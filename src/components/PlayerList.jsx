import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { deletePlayer } from "../services/playerService";
import { calculateEnhancedStats } from "../utils/stats";
import PremiumButton from "./PremiumButton";

const PlayerList = ({ players }) => {
  const { currentUser } = useAuth();
  const [deletingPlayerId, setDeletingPlayerId] = useState(null);
  const [error, setError] = useState("");

  // Check if current user is admin
  const isAdmin = currentUser?.email === "takacsmatyas77@gmail.com";

  const handleDeletePlayer = async (playerId) => {
    if (!isAdmin) return;

    try {
      setDeletingPlayerId(playerId);
      setError("");
      await deletePlayer(playerId, currentUser);
      // The parent component will need to refresh the players list
      window.location.reload(); // Simple refresh for now
    } catch (error) {
      setError(error.message);
    } finally {
      setDeletingPlayerId(null);
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-display font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
          Játékosok
        </h3>
        {isAdmin && (
          <span className="text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full">
            Admin Mode
          </span>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm"
        >
          {error}
        </motion.div>
      )}

      {players.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-md bg-white/80 dark:bg-gray-800/50 rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/20 p-8 text-center transition-colors duration-300"
        >
          <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
            Még nincsenek hozzáadott játékosok
          </p>
        </motion.div>
      ) : (
        <AnimatePresence>
          {players.map((player, index) => {
            const enhancedStats = calculateEnhancedStats(player.stats || {});

            return (
              <motion.div
                key={player.id}
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
                {/* Player Name and Performance Level */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      {player.photoURL ? (
                        <img
                          src={player.photoURL}
                          alt={player.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-brand-gradient flex items-center justify-center text-white font-bold text-lg">
                          {player.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                        {player.name}
                      </h4>
                      {enhancedStats.matchesPlayed > 0 && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                          className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${enhancedStats.performanceLevel.color} transition-colors duration-300`}
                        >
                          {enhancedStats.performanceLevel.label}
                        </motion.span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {enhancedStats.bestGameScore !== null &&
                      enhancedStats.bestGameScore !== undefined && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="flex items-center space-x-2"
                        >
                          <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                            Best Game:
                          </span>
                          <span className="text-xs font-bold text-accent-600 dark:text-accent-400 bg-accent-100 dark:bg-accent-900/30 px-2 py-1 rounded-lg transition-colors duration-300">
                            {enhancedStats.bestGameScore}
                          </span>
                        </motion.div>
                      )}
                    {/* Admin Delete Button */}
                    {isAdmin && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        onClick={() => handleDeletePlayer(player.id)}
                        disabled={deletingPlayerId === player.id}
                        className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Játékos törlése"
                      >
                        {deletingPlayerId === player.id ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        )}
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Core Statistics */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 transition-colors duration-300">
                      {player.stats?.wins || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">
                      Győzelmek
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-300">
                      {player.stats?.matchesPlayed || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">
                      Meccsek
                    </div>
                  </motion.div>
                </div>

                {/* Enhanced Statistics */}
                {enhancedStats.matchesPlayed > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200/50 dark:border-gray-600/50"
                  >
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
                        {enhancedStats.formattedWinRate}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                        Win Rate
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
                        {enhancedStats.averageScore > 0
                          ? `+${enhancedStats.averageScore}`
                          : enhancedStats.averageScore}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                        Avg Score
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Player Creation Date */}
                <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-600/50">
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center transition-colors duration-300">
                    {player.createdAt &&
                    typeof player.createdAt.toDate === "function"
                      ? `Csatlakozott: ${player.createdAt.toDate().toLocaleDateString()}`
                      : "Nemrég hozzáadva"}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}
    </div>
  );
};

export default PlayerList;
