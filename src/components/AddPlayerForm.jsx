import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const AddPlayerForm = () => {
  const { currentUser } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-md bg-white/80 dark:bg-gray-800/50 rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6 transition-colors duration-300"
    >
      <h3 className="text-xl font-display font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">
        {currentUser ? "Player Profile" : "Authentication Required"}
      </h3>

      {!currentUser ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-gradient/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-brand-600 dark:text-brand-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-300">
            Player creation requires authentication
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 transition-colors duration-300">
            Please sign in to create your player profile and start playing games
          </p>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
            Your player profile is automatically created when you sign in
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 transition-colors duration-300">
            Check the Profile tab to see your stats and game history
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default AddPlayerForm;
