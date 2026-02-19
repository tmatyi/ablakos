import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import AddPlayerForm from "./components/AddPlayerForm";
import PlayerList from "./components/PlayerList";
import NewGame from "./components/NewGame";
import GameView from "./components/GameView";
import GameHistory from "./components/GameHistory";
import ThemeToggle from "./components/ThemeToggle";
import { subscribeToPlayers } from "./services/playerService";
import { createGame } from "./services/gameService";
import { getOrCreatePlayerProfile } from "./services/playerService";
import "./App.css";

// Main App Content with auth integration
function AppContent() {
  const { currentUser, loading } = useAuth();
  const [players, setPlayers] = useState([]);
  const [activeGameId, setActiveGameId] = useState(null);
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [gameError, setGameError] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "light";
  });

  // Apply theme class to document and sync with localStorage
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Subscribe to players
  useEffect(() => {
    const unsubscribe = subscribeToPlayers((playersData) => {
      setPlayers(playersData);
    });
    return () => unsubscribe();
  }, []);

  // Handle user login - create/get player profile
  useEffect(() => {
    if (currentUser) {
      getOrCreatePlayerProfile(currentUser);
    }
  }, [currentUser]);

  const handleStartGame = async (playerIds) => {
    if (playerIds.length < 3) {
      setGameError("Need at least 3 players to start a game");
      return;
    }
    try {
      setIsCreatingGame(true);
      setGameError("");
      const gameId = await createGame(playerIds);
      setActiveGameId(gameId);
      setActiveTab("home"); // Switch to home to show the game
    } catch (error) {
      setGameError("Failed to create game. Please try again.");
      console.error("Error creating game:", error);
    } finally {
      setIsCreatingGame(false);
    }
  };

  const handleEndGame = () => {
    setActiveGameId(null);
    setGameError("");
  };

  // Handle tab changes with game state consideration
  const handleTabChange = (tabId) => {
    // If game is active, certain tabs should show the game
    if (activeGameId) {
      if (tabId === "home" || tabId === "game") {
        // Stay on home to show the active game
        setActiveTab("home");
        return;
      }
    }
    setActiveTab(tabId);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Render content based on active tab with smooth transitions
  const renderContent = () => {
    // If game is active, show GameView for home and game tabs
    if (activeGameId && (activeTab === "home" || activeTab === "game")) {
      return (
        <motion.div
          key="game-view"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <GameView gameId={activeGameId} onGameEnd={handleEndGame} />
        </motion.div>
      );
    }

    // Handle different tabs
    switch (activeTab) {
      case "login":
        return (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Login />
          </motion.div>
        );

      case "profile":
        return (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Profile />
          </motion.div>
        );

      case "game":
        return (
          <motion.div
            key="new-game"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-6">
              <AddPlayerForm />
              <NewGame
                players={players}
                onStartGame={handleStartGame}
                isCreatingGame={isCreatingGame}
              />
              {gameError && (
                <div className="text-red-600 dark:text-red-400 text-center">
                  {gameError}
                </div>
              )}
            </div>
          </motion.div>
        );

      case "history":
        return (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <GameHistory />
          </motion.div>
        );

      case "home":
      default:
        return (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Dashboard
              onStartGame={() => setActiveTab("game")}
              activeGameId={activeGameId}
            />
          </motion.div>
        );
    }
  };

  return (
    <div className={`min-h-screen ${theme}`}>
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>
      <Layout activeTab={activeTab} onTabChange={handleTabChange}>
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </Layout>
    </div>
  );
}

// Main App wrapper with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
