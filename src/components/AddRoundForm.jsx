import React, { useState } from "react";
import { motion } from "framer-motion";
import { addRoundToGame, checkGameEnd } from "../services/gameService";
import PremiumButton from "./PremiumButton";

const AddRoundForm = ({ gameId, players, onGameEnd }) => {
  const [roundScores, setRoundScores] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Initialize scores with empty values
  React.useEffect(() => {
    const initialScores = {};
    players.forEach((player) => {
      initialScores[player.id] = "";
    });
    setRoundScores(initialScores);
  }, [players]);

  const handleScoreChange = (playerId, value) => {
    // Allow empty string or valid numbers
    if (value === "" || !isNaN(Number(value))) {
      setRoundScores((prev) => ({
        ...prev,
        [playerId]: value,
      }));
      setError("");
    }
  };

  const validateForm = () => {
    // Check if all players have scores
    for (const player of players) {
      const score = roundScores[player.id];
      if (score === "" || score === undefined || score === null) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError("Please enter scores for all players");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Convert scores to numbers
      const numericScores = {};
      Object.entries(roundScores).forEach(([playerId, score]) => {
        numericScores[playerId] = Number(score);
      });

      // Add the round
      await addRoundToGame(gameId, numericScores);

      // Check if game should end
      const shouldEnd = await checkGameEnd(gameId);
      if (shouldEnd) {
        onGameEnd();
      }

      // Reset form for next round
      const resetScores = {};
      players.forEach((player) => {
        resetScores[player.id] = "";
      });
      setRoundScores(resetScores);
    } catch (err) {
      setError("A kör hozzáadása sikertelen. Próbálja újra.");
      console.error("Error adding round:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-md bg-white/80 dark:bg-gray-800/50 rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6 transition-colors duration-300"
    >
      <h3 className="text-xl font-display font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">
        Új kör rögzítése
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {players.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-3"
          >
            {/* Player Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
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

            {/* Player Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="flex-1"
            >
              <div className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                {player.name}
              </div>
            </motion.div>

            {/* Score Input */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="relative"
            >
              <motion.input
                type="number"
                value={roundScores[player.id] || ""}
                onChange={(e) => handleScoreChange(player.id, e.target.value)}
                placeholder="0"
                className="w-20 px-3 py-2 rounded-xl border border-gray-300/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-700/50 text-center text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all duration-300"
                disabled={isSubmitting}
                whileFocus={{ scale: 1.05 }}
              />
              {/* Score indicator */}
              {roundScores[player.id] && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                    Number(roundScores[player.id]) > 0
                      ? "bg-red-500"
                      : Number(roundScores[player.id]) < 0
                        ? "bg-green-500"
                        : "bg-gray-400"
                  }`}
                />
              )}
            </motion.div>
          </motion.div>
        ))}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-600 dark:text-red-400 text-sm transition-colors duration-300"
          >
            {error}
          </motion.div>
        )}

        <PremiumButton
          type="submit"
          disabled={isSubmitting}
          className="w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? (
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
              Kör hozzáadása...
            </span>
          ) : (
            "Új kör rögzítése"
          )}
        </PremiumButton>
      </form>
    </motion.div>
  );
};

export default AddRoundForm;
