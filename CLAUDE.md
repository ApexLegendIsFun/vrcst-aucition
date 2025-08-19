# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VR CST (VRChat Counter-Strike Tournament) is a single-page web application for conducting player auctions in a team-based tournament. It uses Firebase Realtime Database for real-time data synchronization across multiple users.

## Architecture

### Technology Stack
- **Frontend**: Vanilla JavaScript, HTML5, CSS3 (no framework dependencies)
- **Backend**: Firebase Realtime Database (serverless)
- **Authentication**: Simple password-based team/admin login (client-side)

### Core Components

1. **User Roles**
   - Admin: Can initialize auctions, start bid timers, end auctions
   - Team Captains: Can bid on players using allocated points (1000P initial)
   - 4 teams: Alpha, Bravo, Charlie, Delta

2. **Data Structure (Firebase)**
   ```
   /players/{id}: Player info, current bid, owner, bid history
   /teams/{teamId}: Team points, acquired players
   /auctionTimer: Active state and end time
   ```

3. **Real-time Features**
   - Live bid updates across all connected clients
   - Countdown timer synchronization
   - Team points and roster updates

## Development Commands

Since this is a static HTML application with no build process:

```bash
# Run locally (use any static server)
python -m http.server 8000
# OR
npx serve .

# No build/test/lint commands needed - single file application
```

## Key Implementation Details

### Firebase Configuration
- Project: cs-auction-test
- Region: asia-southeast1
- Real-time database listeners on `/players`, `/teams`, `/auctionTimer`

### Password System
- Hardcoded in JavaScript (lines 486-492)
- Admin: admin123
- Teams: alpha123, bravo123, charlie123, delta123

### Critical Functions
- `initializeAuction()`: Resets all auction data (admin only)
- `placeBid()`: Validates and processes player bids
- `finalizeBids()`: Assigns players to teams when timer ends
- `startBidTimer()`: Initiates countdown for bid round

### UI State Management
- Login state controls visibility of admin panel, team sections, bid inputs
- Real-time updates trigger re-renders via `renderPlayers()` and `renderTeams()`
- Toast notifications for user feedback

## Important Considerations

- All authentication is client-side (not secure for production)
- Firebase API key is exposed in client code (typical for Firebase web apps)
- No build process - direct editing of HTML file
- Mobile responsive via CSS grid and media queries