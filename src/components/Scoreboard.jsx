import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Scoreboard = ({ game, players }) => {
  // Calculate total scores for each player
  const calculatePlayerScores = () => {
    const scores = {};

    // Initialize all players with 0
    players.forEach((player) => {
      scores[player.id] = 0;
    });

    // Sum scores from all rounds
    game.rounds?.forEach((round) => {
      if (round.scores) {
        Object.entries(round.scores).forEach(([playerId, score]) => {
          if (scores[playerId] !== undefined) {
            scores[playerId] += score;
          }
        });
      }
    });

    return scores;
  };

  const playerScores = calculatePlayerScores();

  // Sort players by score (lowest first - lowest score wins)
  const sortedPlayers = [...players].sort((a, b) => {
    const scoreA = playerScores[a.id] || 0;
    const scoreB = playerScores[b.id] || 0;
    return scoreA - scoreB; // Reversed: lowest score first
  });

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-display font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
        Eredménytábla
      </h3>

      {players.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-md bg-white/80 dark:bg-gray-800/50 rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/20 p-8 text-center transition-colors duration-300"
        >
          <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
            Nincs játékos a játékban
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {sortedPlayers.map((player, index) => {
              const score = playerScores[player.id] || 0;
              const isLowScorer = score <= 100 && score < 0; // Highlight low scores (negative or low positive)
              const isWinner = index === 0 && players.length > 1; // First place

              return (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 300,
                  }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className={`backdrop-blur-md rounded-3xl shadow-lg border p-4 transition-all duration-300 hover:shadow-xl ${
                    isWinner
                      ? "bg-brand-gradient/10 dark:bg-brand-gradient/20 border-brand-300/50 dark:border-brand-600/50"
                      : "bg-white/80 dark:bg-gray-800/50 border-white/20 dark:border-gray-700/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Rank Badge */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + index * 0.1 }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          isWinner
                            ? "bg-brand-gradient text-white"
                            : index === 1
                              ? "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                              : index === 2
                                ? "bg-orange-200 dark:bg-orange-800 text-orange-700 dark:text-orange-300"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {index + 1}
                      </motion.div>

                      {/* Player Avatar */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
                      >
                        {player.photoURL ? (
                          <img
                            src={player.photoURL}
                            alt={player.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className={`w-full h-full flex items-center justify-center font-bold text-lg ${
                              isWinner
                                ? "bg-brand-gradient text-white"
                                : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {player.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </motion.div>

                      {/* Player Name */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        <div
                          className={`font-semibold ${
                            isWinner
                              ? "text-brand-700 dark:text-brand-300"
                              : "text-gray-900 dark:text-gray-100"
                          } transition-colors duration-300`}
                        >
                          {player.name}
                        </div>
                        {isWinner && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="text-xs text-brand-600 dark:text-brand-400 font-medium"
                          >
                            Leading
                          </motion.div>
                        )}
                      </motion.div>
                    </div>

                    {/* Score */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className={`text-2xl font-bold ${
                        isWinner
                          ? "text-brand-700 dark:text-brand-300"
                          : isLowScorer
                            ? "text-green-600 dark:text-green-400"
                            : score > 0
                              ? "text-red-600 dark:text-red-400"
                              : "text-gray-600 dark:text-gray-400"
                      } transition-colors duration-300`}
                    >
                      {score > 0 ? `+${score}` : score}
                    </motion.div>
                  </div>

                  {/* Progress Bar */}
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="mt-3 h-2 bg-gray-200/50 dark:bg-gray-600/50 rounded-full overflow-hidden"
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(Math.abs(score) / 2, 100)}%`,
                      }}
                      transition={{
                        delay: 0.6 + index * 0.1,
                        type: "spring",
                        stiffness: 200,
                      }}
                      className={`h-full rounded-full ${
                        isWinner
                          ? "bg-brand-gradient"
                          : isLowScorer
                            ? "bg-green-500"
                            : score > 0
                              ? "bg-red-500"
                              : "bg-gray-500"
                      }`}
                    />
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Scoreboard;
