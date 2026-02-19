import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCompletedGames } from "../services/gameService";
import { getPlayers } from "../services/playerService";

const GameHistory = () => {
  const [games, setGames] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedGames, setExpandedGames] = useState(new Set());

  const toggleGameExpansion = (gameId) => {
    const newExpanded = new Set(expandedGames);
    if (newExpanded.has(gameId)) {
      newExpanded.delete(gameId);
    } else {
      newExpanded.add(gameId);
    }
    setExpandedGames(newExpanded);
  };

  const getPlayerNameById = (playerId) => {
    const player = players.find((p) => p.id === playerId);
    return player ? player.name : `Player ${playerId}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [gamesData, playersData] = await Promise.all([
          getCompletedGames(),
          getPlayers(),
        ]);

        setGames(gamesData);
        setPlayers(playersData);
        setError("");
      } catch (err) {
        setError("Failed to load game history");
        console.error("Error fetching game history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get winner name from game data
  const getWinnerName = (game) => {
    if (!game || !game.rounds) return "Unknown";

    const scores = {};

    // Initialize scores for all players
    game.playerIds.forEach((playerId) => {
      scores[playerId] = 0;
    });

    // Sum all rounds
    game.rounds.forEach((round) => {
      if (round.scores) {
        Object.entries(round.scores).forEach(([playerId, score]) => {
          if (scores[playerId] !== undefined) {
            scores[playerId] += score;
          }
        });
      }
    });

    // Find the player with the lowest score (Ablakos rules)
    let winnerId = null;
    let lowestScore = Infinity;

    Object.entries(scores).forEach(([playerId, score]) => {
      if (score < lowestScore) {
        lowestScore = score;
        winnerId = playerId;
      }
    });

    return winnerId ? getPlayerNameById(winnerId) : "Unknown";
  };

  // Helper function to format date
  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-display font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
        Game History
      </h3>

      {loading ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-md bg-white/80 dark:bg-gray-800/50 rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/20 p-8 text-center transition-colors duration-300"
        >
          <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
            Loading game history...
          </p>
        </motion.div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-md bg-white/80 dark:bg-gray-800/50 rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/20 p-8 text-center transition-colors duration-300"
        >
          <p className="text-red-600 dark:text-red-400 transition-colors duration-300">
            {error}
          </p>
        </motion.div>
      ) : games.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-md bg-white/80 dark:bg-gray-800/50 rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/20 p-8 text-center transition-colors duration-300"
        >
          <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
            No completed games yet
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {games.map((game, index) => {
              const isExpanded = expandedGames.has(game.id);
              const winnerName = getWinnerName(game);

              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 300,
                  }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="backdrop-blur-md bg-white/80 dark:bg-gray-800/50 rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6 transition-all duration-300 hover:shadow-xl"
                >
                  {/* Game Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.1 }}
                        className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300"
                      >
                        {game.endedAt
                          ? typeof game.endedAt.toDate === "function"
                            ? game.endedAt.toDate().toLocaleDateString()
                            : typeof game.endedAt === "object"
                              ? new Date(
                                  game.endedAt.seconds * 1000,
                                ).toLocaleDateString()
                              : new Date(game.endedAt).toLocaleDateString()
                          : game.startedAt
                            ? typeof game.startedAt.toDate === "function"
                              ? game.startedAt.toDate().toLocaleDateString()
                              : typeof game.startedAt === "object"
                                ? new Date(
                                    game.startedAt.seconds * 1000,
                                  ).toLocaleDateString()
                                : new Date(game.startedAt).toLocaleDateString()
                            : "Unknown date"}
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="text-lg font-display font-semibold text-green-600 dark:text-green-400 transition-colors duration-300"
                      >
                        {winnerName} won!
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300"
                      >
                        {game.playerIds?.length || 0} players •{" "}
                        {game.rounds?.length || 0} rounds
                      </motion.div>
                    </div>
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      onClick={() => toggleGameExpansion(game.id)}
                      className="ml-4 px-4 py-2 text-sm font-medium bg-brand-gradient text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isExpanded ? "Collapse" : "Expand"}
                    </motion.button>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-600/50"
                      >
                        <motion.h4
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-300"
                        >
                          Round-by-Round Breakdown
                        </motion.h4>

                        {game.rounds && game.rounds.length > 0 ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="overflow-x-auto"
                          >
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-gray-200/50 dark:border-gray-600/50">
                                  <th className="text-left py-2 px-2 font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                                    Round
                                  </th>
                                  {game.playerIds.map((playerId) => (
                                    <th
                                      key={playerId}
                                      className="text-center py-2 px-2 font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300"
                                    >
                                      {getPlayerNameById(playerId)}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {game.rounds.map((round, roundIndex) => (
                                  <motion.tr
                                    key={roundIndex}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                      delay: 0.3 + roundIndex * 0.05,
                                    }}
                                    className="border-b border-gray-100/50 dark:border-gray-600/50"
                                  >
                                    <td className="py-2 px-2 text-gray-600 dark:text-gray-400 transition-colors duration-300">
                                      {roundIndex + 1}
                                    </td>
                                    {game.playerIds.map((playerId) => (
                                      <td
                                        key={playerId}
                                        className="text-center py-2 px-2"
                                      >
                                        <motion.span
                                          initial={{ opacity: 0, scale: 0.8 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{
                                            delay: 0.4 + roundIndex * 0.05,
                                          }}
                                          className={`inline-block font-medium ${
                                            round.scores?.[playerId] > 0
                                              ? "text-red-600 dark:text-red-400"
                                              : round.scores?.[playerId] < 0
                                                ? "text-green-600 dark:text-green-400"
                                                : "text-gray-600 dark:text-gray-400"
                                          } transition-colors duration-300`}
                                        >
                                          {round.scores?.[playerId] !==
                                          undefined
                                            ? round.scores[playerId] > 0
                                              ? `+${round.scores[playerId]}`
                                              : round.scores[playerId]
                                            : "-"}
                                        </motion.span>
                                      </td>
                                    ))}
                                  </motion.tr>
                                ))}
                                {/* Total Row */}
                                <motion.tr
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{
                                    delay: 0.5 + game.rounds.length * 0.05,
                                  }}
                                  className="font-semibold border-t-2 border-gray-200/50 dark:border-gray-600/50"
                                >
                                  <td className="py-2 px-2 text-gray-700 dark:text-gray-300 transition-colors duration-300">
                                    Total
                                  </td>
                                  {game.playerIds.map((playerId) => {
                                    const totalScore = game.rounds.reduce(
                                      (sum, round) =>
                                        sum + (round.scores?.[playerId] || 0),
                                      0,
                                    );
                                    return (
                                      <td
                                        key={playerId}
                                        className={`text-center py-2 px-2 ${
                                          totalScore > 0
                                            ? "text-red-600 dark:text-red-400"
                                            : totalScore < 0
                                              ? "text-green-600 dark:text-green-400"
                                              : "text-gray-600 dark:text-gray-400"
                                        } transition-colors duration-300`}
                                      >
                                        {totalScore > 0
                                          ? `+${totalScore}`
                                          : totalScore}
                                      </td>
                                    );
                                  })}
                                </motion.tr>
                              </tbody>
                            </table>
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-center py-4"
                          >
                            <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
                              No rounds recorded
                            </p>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {games.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: games.length * 0.1 }}
          className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-600/50"
        >
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center transition-colors duration-300">
            Showing {games.length} completed game{games.length !== 1 ? "s" : ""}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default GameHistory;
