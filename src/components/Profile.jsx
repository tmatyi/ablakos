import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import PremiumButton from "./PremiumButton";

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-md bg-white/80 dark:bg-gray-800/50 rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6 transition-colors duration-300"
    >
      {/* User Profile Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-6"
      >
        {/* User Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-brand-500/20"
        >
          {currentUser.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt={currentUser.displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-brand-gradient flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {currentUser.displayName?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
          )}
        </motion.div>

        {/* User Name */}
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-display font-bold text-gray-800 dark:text-gray-100 mb-1 transition-colors duration-300"
        >
          {currentUser.displayName || "Ismeretlen játékos"}
        </motion.h2>

        {/* User Email */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300"
        >
          {currentUser.email}
        </motion.p>
      </motion.div>

      {/* Account Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 gap-4 mb-6"
      >
        <div className="text-center p-3 rounded-xl bg-gray-50/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50">
          <div className="text-2xl font-bold text-brand-600 dark:text-brand-400">
            0
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Lejátszott meccsek
          </div>
        </div>
        <div className="text-center p-3 rounded-xl bg-gray-50/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            0
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Győzelmek
          </div>
        </div>
      </motion.div>

      {/* Account Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-3"
      >
        <PremiumButton
          variant="secondary"
          className="w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center justify-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Beállítások
          </span>
        </PremiumButton>

        <PremiumButton
          onClick={handleLogout}
          disabled={isLoggingOut}
          variant="glass"
          className="w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoggingOut ? (
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
              Kijelentkezés...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Kijelentkezés
            </span>
          )}
        </PremiumButton>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
