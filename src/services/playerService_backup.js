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
  deleteDoc,
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
    console.error(
      "Hiba a játékos profil lekérdezése vagy létrehozása során:",
      error,
    );
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
    throw new Error("Use getOrCreatePlayerProfile instead");
  } catch (error) {
    console.error("Hiba a játékos hozzáadásakor:", error);
    throw error;
  }
};

export const getPlayers = async () => {
  try {
    const querySnapshot = await getDocs(playersCollection);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Hiba a játékosok lekérdezésekor:", error);
    throw error;
  }
};

export const subscribeToPlayers = (callback) => {
  const unsubscribe = onSnapshot(
    playersCollection,
    (querySnapshot) => {
      const players = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(players);
    },
    (error) => {
      console.error("Hiba a játékosok feliratkozásakor:", error);
    }
  );

  return unsubscribe;
};

// Helper function to calculate player's score from a game
const calculatePlayerScore = (game, playerId) => {
  if (!game || !game.rounds) return 0;

  let totalScore = 0;
  game.rounds.forEach((round) => {
    if (round.scores && round.scores[playerId] !== undefined) {
      totalScore += round.scores[playerId];
    }
  });

  return totalScore;
};

// Helper function to calculate winner ID from game data
const calculateWinnerId = (game) => {
  if (!game || !game.rounds || game.status !== "COMPLETED") return null;

  const scores = {};

  // Initialize scores for all players
  game.playerIds.forEach((playerId) => {
    scores[playerId] = 0;
  });

  // Calculate total scores
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

export const updatePlayerStatsAfterGame = async (game) => {
  try {
    console.log("Updating player stats for game:", game);

    // Get all players in the game
    const gamePlayerIds = game.playerIds || [];
    console.log("Game player IDs:", gamePlayerIds);

    // Create update promises for each player
    const updatePromises = gamePlayerIds.map(async (playerId) => {
      try {
        const playerDoc = doc(playersCollection, playerId);
        const playerSnapshot = await getDoc(playerDoc);

        if (!playerSnapshot.exists()) {
          console.warn(`Player document ${playerId} does not exist`);
          return;
        }

        const playerData = playerSnapshot.data();
        const currentStats = playerData.stats || {
          wins: 0,
          matchesPlayed: 0,
          totalPoints: 0,
          bestGameScore: null,
        };

        // Calculate player's score for this game
        const playerScore = calculatePlayerScore(game, playerId);
        console.log(`Player ${playerId} score:`, playerScore);

        // Update stats
        const updates = {
          stats: {
            ...currentStats,
            matchesPlayed: increment(1),
            totalPoints: currentStats.totalPoints + playerScore,
            bestGameScore:
              currentStats.bestGameScore === null ||
              playerScore < currentStats.bestGameScore
                ? playerScore
                : currentStats.bestGameScore,
          },
        };

        // Check if player won (lowest score)
        const scores = {};
        gamePlayerIds.forEach((pid) => {
          scores[pid] = calculatePlayerScore(game, pid);
        });

        const lowestScore = Math.min(...Object.values(scores));
        const winners = Object.keys(scores).filter((pid) => scores[pid] === lowestScore);

        if (winners.includes(playerId)) {
          updates.stats.wins = increment(1);
        }

        console.log("Updating player", playerId, "with:", updates);
        await updateDoc(playerDoc, updates);
      } catch (error) {
        console.error(`Error updating player ${playerId}:`, error);
        throw error;
      }
    });

    await Promise.all(updatePromises);

    console.log("Player stats updated successfully");
  } catch (error) {
    console.error("Error updating player stats:", error);
    throw error;
  }
};

// Update player's active game
export const updatePlayerActiveGame = async (userId, gameId) => {
  try {
    // Find player by UID
    const q = query(playersCollection, where("uid", "==", userId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const playerDoc = querySnapshot.docs[0];
      const playerRef = doc(playersCollection, playerDoc.id);
      
      if (gameId) {
        await updateDoc(playerRef, { activeGameId: gameId });
      } else {
        await updateDoc(playerRef, { activeGameId: null });
      }
    }
  } catch (error) {
    console.error("Error updating player active game:", error);
    throw error;
  }
};

// Get player's active game
export const getPlayerActiveGame = async (userId) => {
  try {
    // Find player by UID
    const q = query(playersCollection, where("uid", "==", userId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const playerDoc = querySnapshot.docs[0];
      return playerDoc.data().activeGameId || null;
    }
    return null;
  } catch (error) {
    console.error("Error getting player active game:", error);
    return null;
  }
};

export const deletePlayer = async (playerId, currentUser) => {
  try {
    // Check if current user is the admin
    if (currentUser?.email !== "takacsmatyas77@gmail.com") {
      throw new Error("Csak admin törölhet játékosokat");
    }

    // Get the player document to check if it exists
    const playerDoc = doc(db, "players", playerId);
    const playerSnapshot = await getDoc(playerDoc);

    if (!playerSnapshot.exists()) {
      throw new Error("A játékos nem található");
    }

    // Delete the player document
    await deleteDoc(playerDoc);

    return { success: true, message: "Játékos sikeresen törölve" };
  } catch (error) {
    console.error("Hiba a játékos törlésekor:", error);
    throw error;
  }
};
