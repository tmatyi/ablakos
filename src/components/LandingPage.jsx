import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PremiumButton from "./PremiumButton";
import { useAuth } from "../context/AuthContext";

const LandingPage = () => {
  const { signInWithGoogle, authLoading } = useAuth();
  const [showRulesModal, setShowRulesModal] = useState(false);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleRulesClick = () => {
    setShowRulesModal(true);
  };

  const handleCloseRules = () => {
    setShowRulesModal(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ultra-simple background - no animations, no blur */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500 via-brand-600 to-purple-700">
        {/* Static gradient overlays - no animations */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-transparent to-purple-500/20"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-pink-500/10 via-transparent to-blue-500/10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Simple fade-in animation for main content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }} // Very fast, simple animation
          className="text-center mb-12"
        >
          {/* Hero Title - no scale animation */}
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-brand-400 via-brand-500 to-purple-600 bg-clip-text text-transparent mb-6">
            Ablakos
          </h1>

          {/* Subtitle - no animation */}
          <p className="text-lg md:text-xl text-white/90 font-light mb-12">
            A kártyajáték tökéletes kísérője
          </p>
        </motion.div>

        {/* Buttons - minimal hover effects */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <PremiumButton
            onClick={handleLogin}
            variant="primary"
            disabled={authLoading}
            className="px-8 py-4 text-lg bg-white/20 border border-white/30 text-white hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
            // No whileHover/tap animations for mobile performance
          >
            {authLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Bejelentkezés...</span>
              </div>
            ) : (
              "Bejelentkezés"
            )}
          </PremiumButton>

          <PremiumButton
            onClick={handleRulesClick}
            variant="secondary"
            className="px-8 py-4 text-lg bg-white/10 border border-white/20 text-white hover:bg-white/20"
            // No whileHover/tap animations for mobile performance
          >
            Játékszabályok
          </PremiumButton>
        </div>

        {/* Static decorative element - no animation */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center text-white/60 text-sm">
            <span>Kezdéshez jelentkezz be</span>
          </div>
        </div>
      </div>

      {/* Ultra-simple modal - no backdrop blur, minimal animations */}
      <AnimatePresence>
        {showRulesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }} // Very fast
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
          >
            {/* Simple backdrop - no blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }} // Very fast
              className="absolute inset-0 bg-black/80" // Darker, no blur
              onClick={handleCloseRules}
            />

            {/* Modal Content - minimal animation */}
            <motion.div
              initial={{ opacity: 0, y: 5 }} // Minimal movement
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.15 }} // Very fast
              className="relative z-10 w-full max-w-md"
            >
              {/* Simple modal - no backdrop blur */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8">
                {/* Modal Header */}
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
                    Ablakos Szabályok
                  </h2>
                </div>

                {/* Modal Content */}
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
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Hamarosan...
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                    A játékszabályok fejlesztés alatt állnak
                  </p>
                </div>

                {/* Close Button - no animations */}
                <div className="flex justify-center">
                  <PremiumButton
                    onClick={handleCloseRules}
                    variant="primary"
                    className="px-6 py-3"
                    // No hover/tap animations
                  >
                    Bezárás
                  </PremiumButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
