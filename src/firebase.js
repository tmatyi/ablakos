import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCuTkE6Eo7cnEW-jJUzLHYE7VwOXwKw-CE",
  authDomain: "ablakos.firebaseapp.com",
  projectId: "ablakos",
  storageBucket: "ablakos.firebasestorage.app",
  messagingSenderId: "776759773698",
  appId: "1:776759773698:web:5f6193250e0a3cdfa0351b",
  measurementId: "G-ZSWXMTK5DK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google Provider
googleProvider.setCustomParameters({
  prompt: "select_account",
});
