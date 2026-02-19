import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  getDoc,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";

const gamesCollection = collection(db, "games");

export const createGame = async (playerIds) => {
  try {
    const docRef = await addDoc(gamesCollection, {
      playerIds,
      startedAt: serverTimestamp(),
      status: "IN_PROGRESS",
      rounds: [],
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating game:", error);
    throw error;
  }
};

export const subscribeToGame = (gameId, callback) => {
  const gameDoc = doc(db, "games", gameId);

  const unsubscribe = onSnapshot(
    gameDoc,
    (docSnapshot) => {
      if (docSnapshot.exists()) {
        callback({
          id: docSnapshot.id,
          ...docSnapshot.data(),
        });
      } else {
        console.error("Game document not found");
        callback(null);
      }
    },
    (error) => {
      console.error("Error in game subscription:", error);
      callback(null);
    },
  );

  return unsubscribe;
};

export const addRoundToGame = async (gameId, roundScores) => {
  try {
    const gameDoc = doc(db, "games", gameId);

    // Create round object without serverTimestamp for arrayUnion
    const round = {
      scores: roundScores,
      playedAt: new Date(), // Use client-side timestamp instead
    };

    await updateDoc(gameDoc, {
      rounds: arrayUnion(round),
    });

    return true;
  } catch (error) {
    console.error("Error adding round to game:", error);
    throw error;
  }
};

export const checkGameEnd = async (gameId) => {
  try {
    const gameDoc = doc(db, "games", gameId);
    const gameSnapshot = await getDoc(gameDoc);

    if (!gameSnapshot.exists()) {
      return false;
    }

    const gameData = gameSnapshot.data();

    // Calculate total scores for all players
    const totalScores = {};

    // Initialize with 0
    gameData.playerIds.forEach((playerId) => {
      totalScores[playerId] = 0;
    });

    // Sum all rounds
    gameData.rounds.forEach((round) => {
      if (round.scores) {
        Object.entries(round.scores).forEach(([playerId, score]) => {
          if (totalScores[playerId] !== undefined) {
            totalScores[playerId] += score;
          }
        });
      }
    });

    // Check if any player reached 100 points or more (positive or negative)
    const shouldEndGame = Object.values(totalScores).some(
      (score) => score >= 100 || score <= -100,
    );

    if (shouldEndGame && gameData.status === "IN_PROGRESS") {
      await updateDoc(gameDoc, {
        status: "COMPLETED",
        endedAt: serverTimestamp(),
      });
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking game end:", error);
    return false;
  }
};

export const getCompletedGames = async () => {
  try {
    const completedGamesQuery = query(
      gamesCollection,
      where("status", "==", "COMPLETED"),
      orderBy("startedAt", "desc"),
    );

    const querySnapshot = await getDocs(completedGamesQuery);
    const games = [];

    querySnapshot.forEach((doc) => {
      games.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return games;
  } catch (error) {
    console.error("Error getting completed games:", error);
    throw error;
  }
};
