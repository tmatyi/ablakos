# Ablakos Score Tracker - Project Documentation

## Overview

The Ablakos Score Tracker is a comprehensive web application for managing and scoring the Ablakos card game. Built with React, Firebase, and Tailwind CSS, it provides real-time multiplayer functionality, persistent statistics tracking, and a complete game history system.

## Game Rules Context

**Ablakos** is a card game where:
- Players accumulate points across multiple rounds
- The **lowest total score wins** (unlike typical games where highest wins)
- Games end when any player reaches ±100 points
- Negative scores are desirable and represent good performance
- Each round players receive points (positive or negative) based on their performance

## Technical Architecture

### Technology Stack
- **Frontend**: React 18 with Vite
- **Backend**: Firebase Firestore (real-time database)
- **Styling**: Tailwind CSS v3
- **Deployment**: Ready for Vercel/Netlify deployment
- **Real-time**: Firebase real-time subscriptions

### Project Structure
```
src/
├── components/           # React UI components
│   ├── AddPlayerForm.jsx
│   ├── AddRoundForm.jsx
│   ├── GameHistory.jsx
│   ├── GameView.jsx
│   ├── NewGame.jsx
│   └── Scoreboard.jsx
├── services/            # Firebase service layer
│   ├── firebase.js      # Firebase configuration
│   ├── gameService.js   # Game operations
│   └── playerService.js # Player operations
├── App.jsx              # Main application component
├── index.css            # Global styles
└── main.jsx             # Application entry point
```

## Core Components

### 1. App.jsx (Main Application)
**Purpose**: Root component managing application state and routing
**Key Features**:
- Game session management (`activeGameId`)
- Real-time player data subscription
- Error handling and loading states
- 3-column responsive layout
- Conditional rendering between menu and game views

**State Management**:
```javascript
const [players, setPlayers] = useState([]);
const [activeGameId, setActiveGameId] = useState(null);
const [isCreatingGame, setIsCreatingGame] = useState(false);
const [gameError, setGameError] = useState("");
```

### 2. Player Management Components

#### AddPlayerForm.jsx
**Purpose**: Add new players to the system
**Features**:
- Form validation and error handling
- Timeout mechanism to prevent hanging
- Real-time feedback and loading states
- Automatic form reset on successful submission

#### PlayerList.jsx
**Purpose**: Display all players with their statistics
**Features**:
- Real-time player statistics display
- Shows wins and matches played
- Responsive grid layout
- Visual hierarchy for player information

### 3. Game Management Components

#### NewGame.jsx
**Purpose**: Create new game sessions
**Features**:
- Player selection with checkboxes (minimum 3 players)
- Real-time validation feedback
- Loading states during game creation
- Player statistics display for informed selection

#### GameView.jsx
**Purpose**: Main game interface during active gameplay
**Features**:
- Real-time game data synchronization
- Winner calculation and celebration UI
- Game ending detection and statistics updates
- Responsive layout with scoreboard and round entry

### 4. Gameplay Components

#### Scoreboard.jsx
**Purpose**: Display current game scores and rankings
**Features**:
- Real-time score calculation across all rounds
- Lowest-score-first ranking (Ablakos rules)
- Visual hierarchy with medal badges (🥇🥈🥉)
- Winner highlighting with green theme
- Round count display

#### AddRoundForm.jsx
**Purpose**: Submit scores for new rounds
**Features**:
- Individual score inputs for each player
- Form validation requiring complete data entry
- Automatic game ending detection
- Form reset after successful submission
- Game completion triggering

### 5. History Components

#### GameHistory.jsx
**Purpose**: Display completed games and their results
**Features**:
- Fetches completed games via Firebase query
- Winner name resolution and display
- Date formatting and game metadata
- Loading states and error handling
- Chronological ordering (newest first)

## Service Layer

### Firebase Configuration (firebase.js)
**Purpose**: Initialize Firebase connection
**Configuration**:
- Firebase project credentials for "ablakos" project
- Firestore database initialization
- Exported database instance for services

### Player Service (playerService.js)
**Purpose**: Manage player data and statistics
**Key Functions**:
- `addPlayer(name)`: Create new player with initial stats
- `subscribeToPlayers(callback)`: Real-time player data subscription
- `updatePlayerStatsAfterGame(game)`: Atomic statistics updates
- `calculateWinnerId(game)`: Winner determination logic

**Statistics Structure**:
```javascript
stats: {
  wins: 0,
  matchesPlayed: 0
}
```

### Game Service (gameService.js)
**Purpose**: Manage game sessions and rounds
**Key Functions**:
- `createGame(playerIds)`: Create new game session
- `subscribeToGame(gameId, callback)`: Real-time game data
- `addRoundToGame(gameId, roundScores)`: Submit round scores
- `getCompletedGames()`: Fetch finished games
- `checkGameEnd(gameId)`: Validate game completion conditions

**Game Data Structure**:
```javascript
{
  playerIds: ["player1", "player2", "player3"],
  startedAt: timestamp,
  status: "IN_PROGRESS" | "COMPLETED",
  rounds: [
    {
      scores: { playerId: score, ... },
      playedAt: timestamp
    }
  ],
  endedAt: timestamp // Only for completed games
}
```

## Data Flow Architecture

### Game Creation Flow
1. User selects 3+ players in NewGame component
2. `createGame()` called with player IDs
3. Firebase document created in `games` collection
4. `activeGameId` state updated in App.jsx
5. UI switches to GameView component

### Gameplay Flow
1. GameView subscribes to real-time game data
2. Users enter round scores in AddRoundForm
3. `addRoundToGame()` updates game document
4. Real-time subscription triggers UI updates
5. Scoreboard recalculates and displays new rankings
6. Game ending detection when threshold reached

### Game Completion Flow
1. Game status changes to "COMPLETED"
2. `updatePlayerStatsAfterGame()` called automatically
3. Player statistics updated atomically using Firestore increments
4. Winner celebration displayed in GameView
5. Game appears in GameHistory component

### Statistics Update Flow
1. Game completion detected in GameView
2. Winner calculated from final scores
3. Atomic updates applied to all player documents:
   - `matchesPlayed` incremented for all participants
   - `wins` incremented for winner only
4. Real-time subscription updates PlayerList component

## Firebase Database Schema

### Players Collection
```javascript
players/{playerId} {
  name: string,
  createdAt: timestamp,
  stats: {
    wins: number,
    matchesPlayed: number
  }
}
```

### Games Collection
```javascript
games/{gameId} {
  playerIds: string[],
  startedAt: timestamp,
  status: "IN_PROGRESS" | "COMPLETED",
  rounds: [
    {
      scores: { playerId: number, ... },
      playedAt: timestamp
    }
  ],
  endedAt: timestamp // Optional, only for completed games
}
```

## Real-time Subscriptions

### Player Data Subscription
- **Location**: App.jsx and GameView.jsx
- **Purpose**: Keep player lists and statistics current
- **Trigger**: Any player document change
- **Components Affected**: PlayerList, NewGame, GameHistory

### Game Data Subscription
- **Location**: GameView.jsx
- **Purpose**: Real-time game state updates
- **Trigger**: Any game document change
- **Components Affected**: Scoreboard, AddRoundForm, winner celebration

## UI/UX Design System

### Color Scheme
- **Primary**: Blue (`blue-600`) for main actions and branding
- **Success**: Green (`green-600`) for winners and positive actions
- **Warning**: Orange (`orange-600`) for third place
- **Error**: Red (`red-600`) for errors and destructive actions
- **Neutral**: Gray shades for secondary elements

### Layout System
- **Main Screen**: 3-column grid (`lg:grid-cols-3`)
- **Game Screen**: 2-column grid for scoreboard and round entry
- **Responsive**: Adapts to mobile with stacked layouts
- **Spacing**: Consistent `gap-6` for grid spacing

### Interactive Elements
- **Buttons**: Hover states, loading states, disabled states
- **Forms**: Real-time validation, error feedback
- **Cards**: Hover effects, transitions, shadows
- **Badges**: Visual hierarchy for rankings and status

## Error Handling Strategy

### Client-side Errors
- Form validation with user-friendly messages
- Loading states for async operations
- Graceful fallbacks for missing data
- Console logging for debugging

### Firebase Errors
- Network connectivity handling
- Permission error management
- Index requirement detection
- Retry mechanisms where appropriate

### User Feedback
- Toast-style error messages
- Loading indicators
- Success confirmations
- Empty state guidance

## Performance Optimizations

### Firebase Optimizations
- Composite indexes for efficient queries
- Atomic operations to prevent race conditions
- Real-time subscriptions with proper cleanup
- Efficient data fetching patterns

### React Optimizations
- Proper dependency arrays in useEffect
- Component memoization where appropriate
- Efficient state management
- Clean subscription cleanup

### UI Optimizations
- Responsive image handling
- Efficient CSS with Tailwind
- Smooth transitions and animations
- Mobile-first design approach

## Security Considerations

### Firebase Security Rules
- Test mode rules for development
- Production-ready rules needed for deployment
- Proper access control for collections

### Data Validation
- Client-side validation for user input
- Server-side validation through Firebase rules
- Type checking for data structures

## Deployment Readiness

### Environment Configuration
- Firebase configuration environment variables
- Production build optimization
- Asset optimization and caching

### Hosting Considerations
- Static site hosting (Vercel/Netlify)
- Firebase hosting integration
- CDN configuration for assets

## Future Enhancement Opportunities

### Advanced Features
- Player performance analytics and trends
- Game replay functionality
- Tournament mode support
- Export/import game data
- Player profiles with detailed statistics

### UI/UX Improvements
- Dark mode support
- Mobile app development
- Advanced animations and transitions
- Accessibility improvements
- Internationalization support

### Backend Enhancements
- Advanced statistics calculations
- Leaderboard system
- Achievement system
- Social features (friend lists, etc.)

## Development Workflow

### Local Development
```bash
npm install
npm run dev
```

### Build Process
```bash
npm run build
npm run preview
```

### Firebase Deployment
```bash
firebase deploy
```

## Testing Strategy

### Manual Testing Coverage
- Game creation and completion flow
- Statistics update verification
- Real-time synchronization testing
- Error scenario handling
- Responsive design testing

### Future Testing Plans
- Unit tests for service functions
- Component testing with React Testing Library
- Integration tests for complete workflows
- E2E testing with Cypress

## Conclusion

The Ablakos Score Tracker represents a complete, production-ready web application that demonstrates modern web development practices. It showcases real-time data synchronization, atomic database operations, responsive design, and comprehensive error handling. The architecture supports scalability and future enhancements while maintaining clean code organization and optimal user experience.

The project successfully achieves all MVP requirements and provides a solid foundation for continued development and feature expansion.
