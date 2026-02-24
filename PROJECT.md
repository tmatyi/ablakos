# Ablakos Project Documentation

## 🎯 Project Overview

Ablakos is a modern Hungarian multiplayer card game scoring application designed for mobile-first experience with cross-device synchronization capabilities.

## 🇭🇺 Project Vision

Create a fully localized Hungarian card game app that provides:
- Seamless multiplayer experience
- Cross-device game continuity
- Modern, intuitive interface
- Real-time synchronization

## 📱 Core Features

### Authentication System
- Google OAuth integration
- Profile photo synchronization
- Cross-device user state management
- Secure session handling

### Game Management
- Real-time multiplayer scoring
- Active game persistence
- Game history tracking
- Player statistics

### User Interface
- Hungarian localization
- Mobile-responsive design
- Dark mode support
- Smooth animations

## 🏗️ Architecture

### Frontend Architecture
```
src/
├── components/           # React components
│   ├── Dashboard.jsx     # Main dashboard with Hungarian UI
│   ├── GameView.jsx     # Game interface with optimized layout
│   ├── AddRoundForm.jsx # Score input with avatars
│   ├── Scoreboard.jsx   # Rankings with Google photos
│   ├── PlayerList.jsx   # Player management
│   ├── NewGame.jsx      # Game creation
│   ├── Profile.jsx      # User profile
│   └── LandingPage.jsx  # Landing page
├── context/
│   └── AuthContext.jsx  # Authentication context
├── services/
│   ├── gameService.js   # Game operations
│   └── playerService.js # Player management
└── firebase.js          # Firebase configuration
```

### Data Flow
1. **Authentication**: Firebase Auth → User Context → Components
2. **Game Data**: Firestore → Services → Components
3. **Real-time Updates**: Firestore Listeners → State Updates → UI

### State Management
- React Context for authentication
- Local state for component-specific data
- Firestore real-time listeners for game data

## 🔧 Technical Implementation

### Firebase Integration
- **Authentication**: Google OAuth with photoURL
- **Firestore**: Real-time game data and player profiles
- **Hosting**: Static asset deployment

### Cross-Device Synchronization
- Active game ID stored in user's Firestore profile
- Real-time listeners for game state changes
- Automatic game loading on device switch

### Mobile Optimization
- TailwindCSS responsive utilities
- Touch-friendly interface elements
- Optimized layout for mobile screens
- Efficient space utilization

## 📊 Data Models

### Game Document
```javascript
{
  id: string,
  playerIds: string[],
  status: "IN_PROGRESS" | "COMPLETED",
  rounds: [
    {
      scores: { playerId: number },
      timestamp: Timestamp
    }
  ],
  createdAt: Timestamp,
  completedAt: Timestamp
}
```

### Player Document
```javascript
{
  uid: string,
  name: string,
  email: string,
  photoURL: string,
  activeGameId: string,
  stats: {
    wins: number,
    matchesPlayed: number,
    totalPoints: number,
    bestGameScore: number
  },
  createdAt: Timestamp
}
```

## 🎨 UI/UX Design

### Design Principles
- Mobile-first approach
- Hungarian cultural adaptation
- Consistent avatar display
- Smooth animations

### Layout Optimization
- Game page: Új kör rögzítése → Eredménytábla → Pontmenet
- Compact header design
- Efficient use of screen space
- Responsive breakpoints

### Avatar System
- Google profile photos when available
- Fallback to initials with gradient
- Consistent sizing across all pages
- Proper image handling with object-cover

## 🚀 Deployment

### Production URLs
- Primary: https://ablakos.web.app
- Domain: https://ablakosjatek.hu

### Build Process
```bash
npm run build    # Vite build
firebase deploy   # Firebase hosting
```

### Environment Configuration
- Firebase config in `src/firebase.js`
- Environment-specific settings
- Production optimization

## 📈 Performance

### Optimization Techniques
- Lazy loading components
- Efficient Firestore queries
- Optimized bundle size
- Smooth animations with Framer Motion

### Mobile Performance
- Touch event optimization
- Efficient re-rendering
- Minimal bundle size
- Fast initial load

## 🔒 Security

### Authentication
- Firebase Auth with Google OAuth
- Secure token handling
- Proper session management
- Admin access controls

### Data Security
- Firestore security rules
- User data isolation
- Input validation
- XSS protection

## 🧪 Testing

### Manual Testing
- Cross-device synchronization
- Mobile responsiveness
- Authentication flows
- Game state persistence

### Testing Checklist
- [ ] Google OAuth login/logout
- [ ] Game creation and joining
- [ ] Cross-device game continuation
- [ ] Score submission and ranking
- [ ] Mobile layout optimization
- [ ] Dark mode functionality
- [ ] Avatar display consistency

## 📋 Future Enhancements

### Planned Features
- Push notifications for game updates
- Advanced statistics and analytics
- Tournament mode
- Multiple game types support
- Offline mode capability

### Technical Improvements
- TypeScript migration
- Unit testing implementation
- Performance monitoring
- Error boundary implementation

## 🤝 Development Guidelines

### Code Standards
- ESLint configuration
- Prettier formatting
- Component naming conventions
- Hungarian localization standards

### Git Workflow
- Feature branch development
- Semantic versioning
- Comprehensive commit messages
- Proper tag management

---

**Project Status:** Production Ready (v1.0.1)
**Last Updated:** February 2026
**Maintainer:** Mátyás Takács
