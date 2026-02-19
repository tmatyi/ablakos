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
              Loading game...
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
              Game not found
            </p>
            <button
              onClick={onEndGame}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors duration-300">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
                {isGameCompleted ? "Game Completed" : "Game in Progress"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                Game ID: {gameId}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                Rounds played: {game.rounds?.length || 0}
              </p>
            </div>
            <button
              onClick={onEndGame}
              className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors font-medium"
            >
              End Game
            </button>
          </div>

          {/* Winner Declaration */}
          {isGameCompleted && winner && (
            <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-600 rounded-lg p-6 text-center transition-colors duration-300">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2 transition-colors duration-300">
                {winner.name} Wins!
              </h3>
              <p className="text-green-600 dark:text-green-400 transition-colors duration-300">
                Congratulations on achieving the lowest score!
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <Scoreboard game={game} players={gamePlayers} />
            {!isGameCompleted && (
              <AddRoundForm
                gameId={gameId}
                players={gamePlayers}
                onGameEnd={handleGameEnd}
              />
            )}
          </div>

          {/* Chart Section */}
          <div className="mt-6">
            {/* Chart Toggle Button */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 transition-colors duration-300">
                Score Progression
              </h3>
              <button
                onClick={() => setShowChart(!showChart)}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-300"
              >
                {showChart ? "Hide Chart" : "Show Chart"}
              </button>
            </div>

            {/* Chart */}
            {showChart && (
              <GameChart rounds={game.rounds || []} players={gamePlayers} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameView;
