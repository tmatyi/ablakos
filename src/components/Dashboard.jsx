import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import PremiumButton from "./PremiumButton";
import { subscribeToGame } from "../services/gameService";
import { getPlayers } from "../services/playerService";

// Resume Game Card Component
const ResumeGameCard = ({ activeGame }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{
      opacity: 1,
      y: 0,
      boxShadow: [
        "0 0 0 0 rgba(99, 102, 241, 0.4)",
        "0 0 0 10px rgba(99, 102, 241, 0)",
        "0 0 0 20px rgba(99, 102, 241, 0)",
      ],
    }}
    transition={{
      duration: 2,
      boxShadow: {
        repeat: Infinity,
        duration: 2,
      },
    }}
    className="backdrop-blur-md bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6 relative overflow-hidden"
  >
    {/* Glow effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-3xl"></div>

    <div className="relative z-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Játék folytatása
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {activeGame?.currentRound || 1}. kör folyamatban
        </p>
      </div>

      <PremiumButton
        onClick={() => {
          /* Navigate to game */
        }}
        variant="primary"
        className="w-full"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Vissza a játékhoz
      </PremiumButton>
    </div>
  </motion.div>
);

// Start New Game Card Component
const StartNewGameCard = ({ onStartGame }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="backdrop-blur-md bg-gradient-to-br from-brand-500/20 to-brand-600/20 rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6 relative overflow-hidden"
  >
    {/* Gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-brand-600/10 rounded-3xl"></div>

    <div className="relative z-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Új játék indítása
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Gyűjts össze 2+ játékost és kezdj játszani!
        </p>
      </div>

      <PremiumButton
        onClick={onStartGame}
        variant="primary"
        className="w-full"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Új játék létrehozása
      </PremiumButton>
    </div>
  </motion.div>
);

// Personal Best Card Component
const PersonalBestCard = ({ userStats }) => {
  if (!userStats) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="backdrop-blur-md bg-white/80 dark:bg-gray-800/50 rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6"
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Egyéni teljesítmény
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-brand-600 dark:text-brand-400">
            {userStats.stats.bestGameScore || "-"}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Legkisebb pontos győzelem
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {userStats.stats.matchesPlayed > 0
              ? `${(
                  (userStats.stats.wins / userStats.stats.matchesPlayed) *
                  100
                ).toFixed(1)}%`
              : "0%"}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Nyerési arány
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Lejátszott meccs
          </span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {userStats.stats.matchesPlayed}
          </span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-gray-600 dark:text-gray-400">
            Összes győzelem
          </span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {userStats.stats.wins}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// Top Players Card Component
const TopPlayersCard = ({ topPlayers, showMore, onViewAll }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className="backdrop-blur-md bg-white/80 dark:bg-gray-800/50 rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6"
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
        Legjobb játékosok
      </h3>
      <button
        onClick={onViewAll}
        className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
      >
        {showMore ? "Kevesebb mutatása" : "Több mutatása"}
      </button>
    </div>

    <div className="space-y-3">
      {topPlayers.length > 0 ? (
        topPlayers.map((player, index) => (
          <div
            key={player.id}
            className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                {player.photoURL ? (
                  <img
                    src={player.photoURL}
                    alt={player.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-brand-gradient flex items-center justify-center text-white font-bold text-sm">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {player.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {player.stats.wins} győzelem
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-brand-600 dark:text-brand-400">
                {player.winRate}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                nyerési arány
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <p>Még nincsenek lejátszott meccsek</p>
          <p className="text-sm">Játsz egy játékot, hogy lásd a ranglistát!</p>
        </div>
      )}
    </div>
  </motion.div>
);

const Dashboard = ({ onStartGame, activeGameId }) => {
  const { currentUser } = useAuth();
  const [activeGame, setActiveGame] = React.useState(null);
  const [players, setPlayers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showMoreTopPlayers, setShowMoreTopPlayers] = React.useState(false);

  // Subscribe to active game
  React.useEffect(() => {
    if (activeGameId) {
      const unsubscribe = subscribeToGame(activeGameId, (game) => {
        setActiveGame(game);
        setLoading(false);
      });
      return unsubscribe;
    } else {
      setActiveGame(null);
      setLoading(false);
    }
  }, [activeGameId]);

  // Get players for leaderboard
  React.useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const playersData = await getPlayers();
        setPlayers(playersData);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    // Only fetch players if user is authenticated
    if (currentUser) {
      fetchPlayers();
    }
  }, [currentUser]);

  // Calculate top players by win rate
  const getTopPlayers = (limit = 3) => {
    return players
      .filter((player) => player.stats && player.stats.matchesPlayed > 0)
      .map((player) => ({
        ...player,
        winRate:
          player.stats.matchesPlayed > 0
            ? ((player.stats.wins / player.stats.matchesPlayed) * 100).toFixed(
                1,
              )
            : 0,
      }))
      .sort((a, b) => b.winRate - a.winRate)
      .slice(0, limit);
  };

  // Get current user's stats
  const getUserStats = () => {
    if (!currentUser) return null;
    return players.find((player) => player.uid === currentUser.uid);
  };

  const userStats = getUserStats();
  const topPlayers = getTopPlayers(showMoreTopPlayers ? 10 : 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Game Status Card */}
      <AnimatePresence mode="wait">
        {activeGame ? (
          <ResumeGameCard key="resume-game" activeGame={activeGame} />
        ) : (
          <StartNewGameCard key="start-game" onStartGame={onStartGame} />
        )}
      </AnimatePresence>

      {/* User Stats and Leaderboard */}
      <div className="space-y-8">
        <TopPlayersCard
          topPlayers={topPlayers}
          showMore={showMoreTopPlayers}
          onViewAll={() => setShowMoreTopPlayers(!showMoreTopPlayers)}
        />
        <PersonalBestCard userStats={userStats} />
      </div>
    </div>
  );
};

export default Dashboard;
