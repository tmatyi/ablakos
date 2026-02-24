import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase";
import {
  signInWithPopup,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("A useAuth-ot AuthProvider-en belül kell használni");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setAuthLoading(true);

      // Try popup for all devices first (more reliable)
      try {
        const result = await signInWithPopup(auth, googleProvider);
        console.log("Successfully signed in with popup:", result.user);
        setAuthLoading(false);
        return result.user;
      } catch (popupError) {
        console.log("Popup failed, trying redirect:", popupError);

        // Only use redirect as fallback
        await signInWithRedirect(auth, googleProvider);
      }
    } catch (error) {
      console.error("Hiba a Google bejelentkezés során:", error);
      setAuthLoading(false);
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Hiba a kijelentkezés során:", error);
      throw error;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    let unsubscribe = null;

    // Set persistence immediately when app loads
    const setupAuth = async () => {
      try {
        // Set persistence first
        await setPersistence(auth, browserLocalPersistence);
        console.log("Auth persistence set to LOCAL");

        // Now set up auth state listener
        let authTimeout = null;
        unsubscribe = onAuthStateChanged(auth, (user) => {
          console.log(
            "Auth state changed:",
            user ? "User logged in" : "No user",
          );

          if (user) {
            // Clear any pending auth timeout since we got the user
            if (authTimeout) {
              clearTimeout(authTimeout);
              authTimeout = null;
            }
            setAuthLoading(false);
          }

          setCurrentUser(user);
          setLoading(false);
        });

        // Now handle redirect result after persistence is set and listener is ready
        const handleRedirectResult = async () => {
          try {
            console.log("Checking for redirect result...");

            // For mobile, rely on onAuthStateChanged instead of getRedirectResult
            // getRedirectResult() often fails on mobile even when auth succeeds
            const checkResult = async (attempt = 0) => {
              if (attempt > 2) {
                console.log(
                  "getRedirectResult() failed, relying on onAuthStateChanged instead",
                );
                setAuthLoading(false);
                return;
              }

              try {
                const result = await getRedirectResult(auth);
                if (result) {
                  console.log(
                    "Successfully signed in with redirect:",
                    result.user,
                  );
                  setAuthLoading(false);
                } else {
                  console.log(
                    `Attempt ${attempt + 1}: No redirect result found, retrying...`,
                  );
                  setTimeout(() => checkResult(attempt + 1), 500);
                }
              } catch (error) {
                console.error("Error in attempt", attempt + 1, ":", error);
                if (error.code === "auth/cancelled-popup-request") {
                  console.log("User cancelled the authentication");
                  setAuthLoading(false);
                } else {
                  console.error(
                    "Redirect error details:",
                    error.code,
                    error.message,
                  );
                  // Don't give up, let onAuthStateChanged handle it
                  if (attempt >= 2) {
                    console.log(
                      "getRedirectResult() failed, letting onAuthStateChanged handle auth",
                    );
                    setAuthLoading(false);
                  } else {
                    setTimeout(() => checkResult(attempt + 1), 500);
                  }
                }
              }
            };

            checkResult();
          } catch (error) {
            console.error(
              "Hiba az átirányítás eredményének kezelésekor:",
              error,
            );
            setAuthLoading(false);
          }
        };

        // Check for redirect result after everything is set up
        setTimeout(() => {
          handleRedirectResult();
        }, 100);
      } catch (error) {
        console.error("Error setting auth persistence:", error);
      }
    };

    setupAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const value = {
    currentUser,
    loading,
    authLoading,
    signInWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
