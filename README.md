# Ablakos - Hungarian Card Game App

A modern, responsive multiplayer card game scoring application built with React and Firebase, featuring full Hungarian localization and cross-device synchronization.

## 🎯 Features

### 🇭🇺 Hungarian Localization
- Complete Hungarian interface throughout the app
- Native Hungarian text and cultural adaptation
- Localized game terminology and user messages

### 🔐 Authentication & Profiles
- Google OAuth authentication
- Profile photos displayed consistently across all pages
- Cross-device user synchronization via Firebase

### 🎮 Game Features
- Real-time multiplayer card game scoring
- Cross-device game persistence - continue games on any device
- Interactive scoreboard with animations
- Game history and statistics tracking
- Player profiles with win rates and performance metrics

### 📱 Modern UI/UX
- Mobile-first responsive design
- Dark mode support with smooth transitions
- Glassmorphism design elements
- Optimized layout for mobile devices
- Smooth animations and micro-interactions

### 🚀 Technical Features
- Firebase Firestore for real-time data synchronization
- Firebase Authentication with Google OAuth
- React with modern hooks and patterns
- TailwindCSS for responsive styling
- Cross-device active game persistence

## 🌐 Live Demo

- **Primary:** https://ablakos.web.app
- **Domain:** https://ablakosjatek.hu

## 📱 Pages & Features

### Dashboard (Kezdőlap)
- Hungarian localized interface
- Top players leaderboard with Google avatars
- Active game continuation
- User statistics and performance metrics

### Game Page (Játék folyamatban)
- Optimized layout: Új kör rögzítése → Eredménytábla → Pontmenet
- Real-time score updates
- Cross-device game synchronization
- Google avatars for all players

### Player Management
- Player list with Google profile photos
- New game selection with avatars
- Player statistics and win rates
- Admin player management

### Profile & Settings
- User profile with Google avatar
- Game history and statistics
- Theme toggle (light/dark mode)

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite
- **Styling:** TailwindCSS
- **Authentication:** Firebase Auth (Google OAuth)
- **Database:** Firebase Firestore
- **Hosting:** Firebase Hosting
- **Animations:** Framer Motion
- **Charts:** Recharts

## 🚀 Getting Started

### Prerequisites
- Node.js 20.19+ or 22.12+
- Firebase project with Google OAuth enabled
- Firebase configuration

### Installation

```bash
# Clone the repository
git clone https://github.com/tmatyi/ablakos.git
cd ablakos

# Install dependencies
npm install

# Set up Firebase configuration
# Create src/firebase.js with your Firebase config

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to Firebase
firebase deploy
```

### Firebase Configuration

Create `src/firebase.js` with your Firebase configuration:

```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

## 📱 Mobile Optimization

The app is fully optimized for mobile devices with:
- Responsive design that works on all screen sizes
- Touch-friendly interface elements
- Optimized layout for mobile game play
- Efficient use of screen space

## 🔧 Development

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `firebase deploy` - Deploy to Firebase Hosting

### Project Structure
```
src/
├── components/          # React components
├── context/            # React context (Auth)
├── services/           # Firebase services
├── firebase.js         # Firebase configuration
└── App.jsx            # Main app component
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support or questions, please open an issue on GitHub.

---

**Version 1.0.1** - Complete Hungarian card game app with cross-device synchronization
