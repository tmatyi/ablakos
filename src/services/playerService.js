import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  getDoc,
  serverTimestamp,
  increment,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

const playersCollection = collection(db, "players");

// Get or create player profile based on auth user
export const getOrCreatePlayerProfile = async (user) => {
  try {
    // First, try to find existing player with this uid
    const q = query(playersCollection, where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Player exists, return their data
      const playerDoc = querySnapshot.docs[0];
      return {
        id: playerDoc.id,
        ...playerDoc.data(),
      };
    }

    // Player doesn't exist, create new one
    const docRef = await addDoc(playersCollection, {
      uid: user.uid,
      name: user.displayName || "Anonymous Player",
      email: user.email,
      photoURL: user.photoURL || null,
      createdAt: serverTimestamp(),
      stats: {
        wins: 0,
        matchesPlayed: 0,
        totalPoints: 0,
        bestGameScore: null,
      },
    });

    return {
      id: docRef.id,
      uid: user.uid,
      name: user.displayName || "Anonymous Player",
      email: user.email,
      photoURL: user.photoURL || null,
      createdAt: new Date(),
      stats: {
        wins: 0,
        matchesPlayed: 0,
        totalPoints: 0,
        bestGameScore: null,
      },
    };
  } catch (error) {
    console.error("Error getting or creating player profile:", error);
    throw error;
  }
};

export const addPlayer = async () => {
  try {
    // This function is deprecated - use getOrCreatePlayerProfile instead
    // Keeping for backward compatibility but will be removed
    console.warn(
      "addPlayer is deprecated, use getOrCreatePlayerProfile with authenticated user",
    );
    throw new Error(
      "Player creation requires authentication. Please sign in first.",
    );
  } catch (error) {
    console.error("Error adding player:", error);
    throw error;
  }
};

export const getPlayers = () => {
  return new Promise((resolve, reject) => {
    getDocs(playersCollection)
      .then((querySnapshot) => {
        const players = [];
        querySnapshot.forEach((doc) => {
          players.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        resolve(players);
      })
      .catch((error) => {
        console.error("Error getting players:", error);
        reject(error);
      });
  });
};

export const subscribeToPlayers = (callback) => {
  const unsubscribe = onSnapshot(
    playersCollection,
    (querySnapshot) => {
      const players = [];
      querySnapshot.forEach((doc) => {
        players.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      callback(players);
    },
    (error) => {
      console.error("Error in players subscription:", error);
    },
  );

  return unsubscribe;
};

export const updatePlayerStatsAfterGame = async (game) => {
  try {
    console.log("Updating player stats for game:", game);

    // Calculate winner from game data
    const winnerId = calculateWinnerId(game);
    console.log("Calculated winner ID:", winnerId);

    // Calculate final scores for each player
    const finalScores = {};

    // Initialize scores for all players
    game.playerIds.forEach((playerId) => {
      finalScores[playerId] = 0;
    });

    // Calculate total scores from all rounds
    game.rounds.forEach((round) => {
      if (round.scores) {
        Object.entries(round.scores).forEach(([playerId, score]) => {
          if (finalScores[playerId] !== undefined) {
            finalScores[playerId] += score;
          }
        });
      }
    });

    // Update stats for each player
    const updatePromises = game.playerIds.map(async (playerId) => {
      const playerDoc = doc(db, "players", playerId);
      const playerSnapshot = await getDoc(playerDoc);
      const currentPlayerData = playerSnapshot.data();
      const currentBestGameScore = currentPlayerData?.stats?.bestGameScore;

      const updates = {
        "stats.matchesPlayed": increment(1),
        "stats.totalPoints": increment(finalScores[playerId] || 0),
      };

      // Add win increment for winner
      if (playerId === winnerId) {
        updates["stats.wins"] = increment(1);
        console.log("Adding win for player:", playerId);
      }

      // Update best game score if this game's total is better (lower is better in Ablakos)
      const playerFinalScore = finalScores[playerId] || 0;
      if (
        currentBestGameScore === null ||
        currentBestGameScore === undefined ||
        playerFinalScore < currentBestGameScore
      ) {
        updates["stats.bestGameScore"] = playerFinalScore;
        console.log(
          `Updating best game score for player ${playerId}: ${playerFinalScore}`,
        );
      }

      console.log("Updating player", playerId, "with:", updates);
      await updateDoc(playerDoc, updates);
    });

    await Promise.all(updatePromises);
    console.log("Player stats update completed successfully");
    return true;
  } catch (error) {
    console.error("Error updating player stats:", error);
    throw error;
  }
};

// Helper function to calculate winner ID from game data
const calculateWinnerId = (game) => {
  if (!game || !game.rounds || game.status !== "COMPLETED") return null;

  const scores = {};

  // Initialize scores for all players
  game.playerIds.forEach((playerId) => {
    scores[playerId] = 0;
  });

  // Calculate total scores from all rounds
  game.rounds.forEach((round) => {
    if (round.scores) {
      Object.entries(round.scores).forEach(([playerId, score]) => {
        if (scores[playerId] !== undefined) {
          scores[playerId] += score;
        }
      });
    }
  });

  // Find player with lowest score (winner)
  let winnerId = null;
  let lowestScore = Infinity;

  Object.entries(scores).forEach(([playerId, score]) => {
    if (score < lowestScore) {
      lowestScore = score;
      winnerId = playerId;
    }
  });

  return winnerId;
};
