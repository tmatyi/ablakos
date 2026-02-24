import React, { useState, useEffect } from "react";
import { subscribeToGame } from "../services/gameService";
import {
  subscribeToPlayers,
  updatePlayerStatsAfterGame,
} from "../services/playerService";
import Scoreboard from "./Scoreboard";
import AddRoundForm from "./AddRoundForm";
import GameChart from "./GameChart";

const GameView = ({ gameId, onEndGame }) => {
  const [game, setGame] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChart, setShowChart] = useState(true);

  // Calculate winner when game is completed
  const getWinner = () => {
    if (!game || !game.rounds || game.status !== "COMPLETED") return null;

    const scores = {};

    // Initialize scores for players in the current game only
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

    return winnerId ? players.find((p) => p.id === winnerId) : null;
  };

  const handleGameEnd = () => {
    // This will be called when a game ends due to reaching 100 points
    // The UI will update automatically through the subscription
  };

  useEffect(() => {
    // Subscribe to game data
    const unsubscribeGame = subscribeToGame(gameId, (gameData) => {
      if (gameData) {
        const previousStatus = game?.status;
        setGame(gameData);

        // Check if game just completed
        if (
          previousStatus === "IN_PROGRESS" &&
          gameData.status === "COMPLETED"
        ) {
          console.log("Game status changed from IN_PROGRESS to COMPLETED");
          console.log("Previous status:", previousStatus);
          console.log("New status:", gameData.status);
          // Update player stats when game ends
          updatePlayerStatsAfterGame(gameData).catch((error) => {
            console.error("Failed to update player stats:", error);
          });
        }
      } else {
        console.error("Failed to load game data");
      }
      setLoading(false);
    });

    // Subscribe to all players data
    const unsubscribePlayers = subscribeToPlayers((playersData) => {
      setPlayers(playersData);
    });

    return () => {
      unsubscribeGame();
      unsubscribePlayers();
    };
  }, [gameId, game?.status]);

  // Get players in the current game
  const gamePlayers = players.filter((player) =>
    game?.playerIds?.includes(player.id),
  );

  const winner = getWinner();
  const isGameCompleted = game?.status === "COMPLETED";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center transition-colors duration-300">
            <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
              Játék betöltése...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center transition-colors duration-300">
            <p className="text-red-500 dark:text-red-400 transition-colors duration-300">
              A játék nem található
            </p>
            <button
              onClick={onEndGame}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
            >
              Vissza a menübe
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Compact Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 truncate">
                {isGameCompleted ? "Játék befejezve" : "Játék folyamatban"}
              </h2>
              <div className="flex items-center gap-4 mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <span>ID: {gameId}</span>
                <span>Körök: {game.rounds?.length || 0}</span>
              </div>
            </div>
            <button
              onClick={onEndGame}
              className="flex-shrink-0 bg-red-600 text-white py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors font-medium text-sm"
            >
              Befejezés
            </button>
          </div>
        </div>

        {/* Winner Banner - Compact */}
        {isGameCompleted && winner && (
          <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-600 px-4 py-3">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl sm:text-3xl">🏆</span>
              <div className="text-center">
                <h3 className="text-base sm:text-lg font-bold text-green-800 dark:text-green-300">
                  {winner.name} nyert!
                </h3>
                <p className="text-xs sm:text-sm text-green-600 dark:text-green-400">
                  Legalacsonyabb pontszám
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Full Width */}
        <div className="flex-1 p-2 sm:p-4">
          <div className="space-y-3 sm:space-y-4">
            {/* Add Round Form - Always First */}
            {!isGameCompleted && (
              <AddRoundForm
                gameId={gameId}
                players={gamePlayers}
                onGameEnd={handleGameEnd}
              />
            )}

            {/* Scoreboard - Second */}
            <Scoreboard game={game} players={gamePlayers} />

            {/* Chart Section - Third */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex justify-between items-center px-3 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  Pontmenet
                </h3>
                <button
                  onClick={() => setShowChart(!showChart)}
                  className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                >
                  {showChart ? "Elrejtés" : "Mutatás"}
                </button>
              </div>
              {showChart && (
                <div className="p-2 sm:p-3">
                  <GameChart rounds={game.rounds || []} players={gamePlayers} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameView;
