import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PremiumButton from "./PremiumButton";
import { useAuth } from "../context/AuthContext";

const NewGame = ({ players, onStartGame, isCreatingGame }) => {
  const { currentUser } = useAuth();

  // Initialize selected players with current user if logged in
  const getInitialSelectedPlayers = () => {
    if (currentUser && players.length > 0) {
      const currentUserPlayer = players.find(
        (player) => player.uid === currentUser.uid,
      );
      return currentUserPlayer ? [currentUserPlayer.id] : [];
    }
    return [];
  };

  const [selectedPlayers, setSelectedPlayers] = useState(
    getInitialSelectedPlayers,
  );

  const handlePlayerToggle = (playerId) => {
    // Don't allow deselecting the current user if they're logged in
    if (currentUser) {
      const player = players.find((p) => p.id === playerId);
      if (
        player?.uid === currentUser.uid &&
        selectedPlayers.includes(playerId)
      ) {
        return; // Don't allow deselecting current user
      }
    }

    setSelectedPlayers((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId],
    );
  };

  const handleStartGame = () => {
    onStartGame(selectedPlayers);
  };

  const isGameStartable = selectedPlayers.length >= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-md bg-white/80 dark:bg-gray-800/50 rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6 mb-6 transition-colors duration-300"
    >
      <h2 className="text-xl font-display font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">
        Új játék indítása
      </h2>

      {players.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
            Nincs elérhető játékos. Először adjon hozzá játékosokat!
          </p>
        </motion.div>
      ) : (
        <>
          <div
            className="space-y-3 mb-6 max-h-64 overflow-y-auto"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#d1d5db #f3f4f6",
            }}
          >
            <AnimatePresence>
              {players.map((player, index) => {
                const isSelected = selectedPlayers.includes(player.id);

                return (
                  <motion.label
                    key={player.id}
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 300,
                    }}
                    className={`flex items-center p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? "bg-brand-gradient/20 dark:bg-brand-gradient/30 border border-brand-300/50 dark:border-brand-600/50 shadow-md"
                        : "bg-white/50 dark:bg-gray-700/50 border border-white/20 dark:border-gray-600/50 hover:bg-white/70 dark:hover:bg-gray-700/70"
                    }`}
                  >
                    {/* Custom Checkbox */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="relative"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handlePlayerToggle(player.id)}
                        className="sr-only"
                        disabled={isCreatingGame}
                      />
                      <div
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                          isSelected
                            ? "bg-brand-gradient border-brand-500 shadow-lg"
                            : "bg-white/70 dark:bg-gray-600/70 border-gray-300 dark:border-gray-500"
                        }`}
                      >
                        {isSelected && (
                          <motion.svg
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + index * 0.05 }}
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </motion.svg>
                        )}
                      </div>
                    </motion.div>

                    {/* Player Avatar */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.15 + index * 0.05 }}
                      className="ml-4 w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
                    >
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
                    </motion.div>

                    {/* Player Info */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="ml-3 flex-1"
                    >
                      <div className="font-semibold">{player.name}</div>
                    </motion.div>

                    {/* Selection Indicator */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{ delay: 0.25 + index * 0.05 }}
                          className="w-2 h-2 bg-brand-500 rounded-full"
                        />
                      )}
                    </AnimatePresence>
                  </motion.label>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Game Status */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: players.length * 0.05 }}
            className="mb-4 p-4 rounded-xl bg-gray-50/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                Kiválasztott játékosok:
              </span>
              <motion.span
                key={selectedPlayers.length}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
                className={`text-sm font-bold ${
                  selectedPlayers.length >= 3
                    ? "text-green-600 dark:text-green-400"
                    : selectedPlayers.length > 0
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-gray-500 dark:text-gray-400"
                } transition-colors duration-300`}
              >
                {selectedPlayers.length} / 3+ szükséges
              </motion.span>
            </div>

            {selectedPlayers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300"
              >
                {selectedPlayers.length === 1 &&
                  "Még 2 játékos szükséges a kezdéshez"}
                {selectedPlayers.length === 2 &&
                  "Még 1 játékos szükséges a kezdéshez"}
                {selectedPlayers.length >= 3 && "Készen áll a kezdésre!"}
              </motion.div>
            )}
          </motion.div>

          {/* Start Game Button */}
          <PremiumButton
            onClick={handleStartGame}
            disabled={!isGameStartable || isCreatingGame}
            variant={isGameStartable ? "primary" : "secondary"}
            className="w-full"
            whileHover={{ scale: isGameStartable ? 1.02 : 1 }}
            whileTap={{ scale: isGameStartable ? 0.98 : 1 }}
          >
            {isCreatingGame ? (
              <span className="flex items-center justify-center">
                <motion.svg
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </motion.svg>
                Játék létrehozása...
              </span>
            ) : (
              `Játék indítása ${selectedPlayers.length > 0 ? `(${selectedPlayers.length} játékos)` : ""}`
            )}
          </PremiumButton>
        </>
      )}
    </motion.div>
  );
};

export default NewGame;
