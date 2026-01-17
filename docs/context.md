# Project Context: Philly Fingered

## Overview

**Philly Fingered** is a daily location-guessing game for Philadelphia landmarks. Users must identify 5 different locations each day by tapping on an interactive map, receiving scores based on proximity to the actual locations. The game features sequential location display with smooth animations, shareable score results, and comprehensive test coverage.

**Live Site**: https://briengleason.github.io/philly-fingered/

## Project Evolution & Development Summary

### Phase 1: Initial Setup
- Created basic map interface with Leaflet.js
- Centered on Philadelphia with no labels for clean aesthetic
- Made responsive for both desktop and mobile

### Phase 2: Core Game Mechanics
- Added single location guessing (Liberty Bell)
- Implemented distance calculation using Haversine formula
- Created exponential decay scoring system (0-100 points)

### Phase 3: Multi-Location Daily Game
- Expanded to 5 locations per day
- Externalized locations to YAML configuration file
- Implemented daily game state persistence with localStorage
- Added aggregated scoring across all locations

### Phase 4: Sequential Game Flow & UX
- Replaced simultaneous location selection with sequential display
- Added smooth animations and transitions between locations
- Implemented "next location" overlay with pulsing icon
- Fixed location skipping bugs through careful index management

### Phase 5: Share Functionality
- Added emoji-based scoring (🎯 for perfect, 🏅 for excellent, etc.)
- Implemented share score button with clipboard API
- Generated formatted share messages: `briengleason.github.io/philly-fingered/ January 17 96🏅 100🎯...`

### Phase 6: Testing & Quality Assurance
- Built comprehensive test suite (65+ tests)
- Added tests for all game logic, share functionality, and map rendering
- Created pre-commit hooks to automatically run tests before commits
- Established test-first development workflow

### Phase 7: Deployment & Automation
- Deployed to GitHub Pages
- Set up automatic syncing with GitHub (post-commit hook)
- Organized code into logical directory structure
- Created comprehensive documentation

## Project Structure

```
philly-fingered/
├── index.html                 # Main application (root - required for GitHub Pages)
├── config/
│   └── locations.yaml         # Daily locations configuration (YAML format)
├── docs/
│   ├── README.md              # User-facing documentation
│   ├── DEPLOYMENT.md          # Deployment instructions
│   ├── GITHUB_PAGES_SETUP.md  # GitHub Pages specific setup
│   ├── DEVELOPMENT.md         # Developer guide (testing, reset methods)
│   ├── TESTING.md             # Testing guidelines and workflow
│   └── context.md             # This file - project context and history
├── scripts/
│   └── sync-to-github.sh      # Manual GitHub sync script
├── test/
│   ├── game-tests.js          # Comprehensive test suite (65+ tests)
│   ├── run-tests.html         # Browser test runner (interactive)
│   ├── run-tests-automated.html  # Browser test runner (auto-run)
│   ├── run-tests-sync.js      # Node.js test runner (for pre-commit)
│   ├── run-tests.sh           # Automated test runner script
│   └── README.md              # Test suite documentation
├── .git/
│   └── hooks/
│       ├── pre-commit         # Runs tests before commits
│       └── post-commit        # Auto-pushes to GitHub after commits
├── .gitignore                 # Git ignore rules
└── .nojekyll                  # GitHub Pages configuration
```

## Technology Stack

- **Frontend**: Pure HTML, CSS, JavaScript (no frameworks)
- **Mapping**: Leaflet.js (open-source mapping library)
- **Map Tiles**: CartoDB light_nolabels (no street names/labels)
- **Storage**: localStorage (for daily game state persistence)
- **Configuration**: YAML file for daily locations (`config/locations.yaml`)
- **YAML Parser**: js-yaml (loaded from CDN)
- **Testing**: Custom test framework (browser-based)
- **Deployment**: GitHub Pages (static hosting)

## Core Features

### 1. Interactive Map
- Full-screen map of Philadelphia
- No street names or labels (clean aesthetic)
- Mobile and desktop responsive
- Touch and mouse interaction support
- Viewport resize handling for mobile browsers
- Orientation change support

### 2. Daily Location Guessing Game
- **5 Locations per day** (configurable via `config/locations.yaml`)
- **Sequential display**: Locations appear one at a time
- **Default locations**:
  1. Liberty Bell (🔔)
  2. Independence Hall (🏛️)
  3. Philadelphia Museum of Art (🎨)
  4. Reading Terminal Market (🍕)
  5. City Hall (🏢)
- **Date-based configuration**: Different locations can be set for specific dates
- **Fallback**: Uses default locations if no date-specific config exists

### 3. Sequential Game Flow with Animations
- **One location at a time**: User focuses on single location
- **Fade animations**: Smooth transitions between locations
- **Pulse animation**: Icon pulses to indicate user should tap
- **Next location overlay**: Shows upcoming location with animation
- **Progress indicator**: Shows "Location X of 5"
- **No skipping**: Ensures all locations are played in order

### 4. Scoring System
- **Individual Scores**: 0-100 points per location
- **Total Score**: 0-500 points (sum of all 5 locations)
- **Distance-based**: Uses Haversine formula to calculate distance
- **Scoring Curve**: Exponential decay (closer = exponentially better score)
  - Formula: `score = 100 * (1 - (distance / MAX_DISTANCE))^1.5`
- **Maximum Distance**: 5km (beyond this = 0 points)

### 5. Visual Feedback
- Blue pin (📍) at user's guess location
- Colored icon pin (🔔/🏛️/🎨/🍕/🏢) at actual location
- Dashed line connecting the two points
- Distance label at midpoint of line (in meters)
- Quick score popup on each guess
- Running total score display

### 6. Share Score Functionality
- **Share button**: On completion screen, below score table
- **Emoji-based scoring**: Visual representation of performance
  - 🎯 = Perfect (100)
  - 🏅 = Excellent (95-99)
  - 🏆 = Great (90-94)
  - 🎉 = Good (85-89)
  - ✨ = Nice (80-84)
  - 😁 = Good (75-79)
  - 🤗 = Okay (70-74)
  - Lower scores have appropriate emojis
- **Share message format**:
  ```
  briengleason.github.io/philly-fingered/ January 17
  96🏅 100🎯 95🏅 87🎉 89🎉
  Final score: 467
  ```
- **Clipboard API**: Automatically copies to clipboard
- **Native Share API**: Falls back to clipboard if not available

### 7. Game State Management
- **Daily Persistence**: Saves progress to localStorage
- **Auto-reset**: New game each day (based on date)
- **Progress Tracking**: Shows which locations are completed
- **Sequential Progression**: Tracks current location index
- **Completion Detection**: Shows completion screen when all 5 locations guessed

### 8. Completion Screen
- **Score table**: Shows all locations with distances and scores
- **Final score**: Total aggregated score
- **Share button**: Allows sharing score with emojis
- **Clean UI**: Organized display of all game results

### 9. User Interface
- **Current Location Panel**: Top (mobile) / Right side (desktop)
  - Current location icon and name
  - Progress indicator (Location X of 5)
  - Running total score
- **Game Instructions**: Initial guidance for first-time users
- **Quick Score Popup**: Temporary display on each guess
- **Next Location Overlay**: Animated transition between locations

### 10. Development Features
- **Developer Mode**: `DEV_MODE` flag for testing (disables localStorage)
- **Session Reset**: Keyboard shortcut (Ctrl+Shift+R / Cmd+Shift+R)
- **Browser Console Commands**: Manual reset methods
- **Test Suite**: 65+ automated tests

## Key Functions

### Distance Calculation
```javascript
function calculateDistance(lat1, lon1, lat2, lon2)
```
- Uses Haversine formula for accurate distance between lat/lng coordinates
- Returns distance in meters
- Accounts for Earth's curvature

### Score Calculation
```javascript
function calculateScore(distance, maxDistance = 5000)
```
- Formula: `100 * (1 - (distance / maxDistance))^1.5`
- Exponential decay curve
- Closer guesses get disproportionately better scores
- Maximum distance: 5000 meters (5km)

### Share Message Generation
```javascript
function generateShareMessage()
function getScoreEmoji(score)
async function shareScore()
```
- Generates formatted share message with URL, date, scores, and emojis
- Maps scores to appropriate emojis
- Uses Clipboard API or native Share API

### Location Progression
```javascript
function getCurrentLocation()
function updateCurrentLocationDisplay(animate)
function advanceToNextLocation()
function makeGuess(tapLatLng)
```
- Manages sequential location display
- Handles animations and transitions
- Prevents skipping locations
- Updates UI and game state

### Game State Structure
```javascript
{
  currentLocationIndex: number,  // Current location being guessed (0-4)
  guesses: {
    [locationId]: {
      latlng: { lat: number, lng: number },  // User's guess coordinates
      distance: number,                      // Distance in meters
      score: number                          // Score 0-100
    }
  },
  totalScore: number                         // Sum of all scores (0-500)
}
```

### localStorage Key Format
- Key: `phillyGame_${today.toDateString()}`
- Example: `phillyGame_Tue Jan 17 2025`
- Value: JSON stringified gameState
- Resets automatically each day

## Location Configuration

Locations are defined in `config/locations.yaml` file. The file supports:

1. **Default locations**: Used when no specific date match is found
2. **Date-specific locations**: Format `YYYY-MM-DD` as keys for specific dates

### YAML Structure

```yaml
default:
  - id: 0
    name: Liberty Bell
    coordinates: [39.9496, -75.1503]
    icon: 🔔

2025-01-20:
  - id: 0
    name: Philadelphia Museum of Art
    coordinates: [39.9656, -75.1809]
    icon: 🎨
```

### Default Location Coordinates

All coordinates are in [latitude, longitude] format:

1. **Liberty Bell**: [39.9496, -75.1503]
2. **Independence Hall**: [39.9489, -75.1500]
3. **Philadelphia Museum of Art**: [39.9656, -75.1809]
4. **Reading Terminal Market**: [39.9531, -75.1584]
5. **City Hall**: [39.9523, -75.1636]

## Testing

### Test Suite Overview

The project includes a comprehensive test suite with **65+ tests** covering:

1. **Core Game Logic (25 tests)**
   - Distance calculations (3 tests)
   - Score calculations (8 tests)
   - Location progression (5 tests)
   - Game state management (3 tests)
   - Edge cases (5 tests)
   - Integration tests (1 test)

2. **Share Functionality (17 tests)**
   - Emoji mapping (9 tests)
   - Date formatting (1 test)
   - Message generation (7 tests)

3. **Map Rendering & Visibility (23 tests)**
   - Container existence and visibility (6 tests)
   - Configuration validation (3 tests)
   - Tile layer setup (3 tests)
   - Map instance checks (4 tests)
   - Interaction handling (3 tests)
   - Viewport handling (2 tests)
   - Style checks (2 tests)

### Test Execution

**Automatic (Pre-commit Hook)**
- Tests run automatically before each commit
- Blocks commit if tests fail
- Uses `test/run-tests-sync.js` (Node.js)

**Manual (Browser)**
```bash
./test/run-tests.sh
```
Opens test page in browser with full DOM support.

**Direct Browser**
- Open `test/run-tests-automated.html` in browser
- Tests run automatically and display results

### Test-First Development Workflow

1. Write tests for new functionality
2. Run tests to verify they pass
3. Ensure existing tests still pass
4. Only commit if all tests pass

See `docs/TESTING.md` for detailed testing guidelines.

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires JavaScript enabled
- Requires localStorage support
- Requires Clipboard API (for share functionality)

## Development Notes

### Map Configuration
- Initial zoom: 13 (desktop), 12 (mobile)
- Center: [39.9526, -75.1652] (Philadelphia downtown)
- Min zoom: 10, Max zoom: 19
- Tile provider: CartoDB light_nolabels
- Subdomains: a, b, c, d (for load balancing)

### Touch vs Click Handling
- Distinguishes between taps and drags
- Prevents accidental guesses while panning
- Supports pinch-to-zoom on mobile
- Tap tolerance: 15 pixels

### Performance
- Single HTML file (no external dependencies except Leaflet CDN)
- Lightweight (~50KB total)
- Fast loading and rendering
- No backend required

### Animations
- **Fade in/out**: Location transitions
- **Pulse**: Icon animation to indicate tapping
- **Quick score**: Popup animation on guess
- **Next location overlay**: Full-screen transition animation

### Session Management
- **Daily Reset**: New game each day automatically
- **Developer Mode**: `DEV_MODE` flag to disable persistence
- **Reset Shortcut**: Ctrl+Shift+R / Cmd+Shift+R
- **Browser Console**: Manual reset commands

See `docs/DEVELOPMENT.md` for detailed development guide.

## Deployment

**Live Site**: https://briengleason.github.io/philly-fingered/

**Platform**: GitHub Pages (static hosting)

### Auto-Sync Setup

1. **Post-commit hook**: Automatically pushes after each `git commit`
2. **Pre-commit hook**: Runs tests before allowing commit
3. **Manual sync script**: Run `./scripts/sync-to-github.sh` anytime

See `docs/DEPLOYMENT.md` and `docs/GITHUB_PAGES_SETUP.md` for detailed deployment instructions.

## Maintenance

### Updating Locations
Edit `config/locations.yaml` file:

1. **Update default locations**: Modify the `default:` section
2. **Add date-specific locations**: Add a new date key (YYYY-MM-DD format)

Example:
```yaml
default:
  - id: 0
    name: Liberty Bell
    coordinates: [39.9496, -75.1503]
    icon: 🔔

2025-01-20:
  - id: 0
    name: Philadelphia Museum of Art
    coordinates: [39.9656, -75.1809]
    icon: 🎨
```

The app automatically loads the correct locations based on today's date.

### Changing Scoring
Modify `MAX_DISTANCE` (default: 5000 meters) and `calculateScore()` function in `index.html`.

### Styling
All CSS is embedded in `<style>` tag in `index.html`.

## Git Workflow

- **Main branch**: `main`
- **Auto-sync**: Post-commit hook pushes to GitHub
- **Test enforcement**: Pre-commit hook runs tests before commit
- **Manual sync**: Run `./scripts/sync-to-github.sh`

## Key Bug Fixes & Improvements

### Location Skipping Bug
- **Issue**: Locations 2 and 4 were being skipped during sequential display
- **Root Cause**: Variable name conflict and incorrect index management
- **Fix**: Used temporary `nextIndex` variable and proper loop logic
- **Result**: All locations now display sequentially without skipping

### Share Button Not Working
- **Issue**: Share button did nothing when clicked
- **Root Cause**: JavaScript functions (`getScoreEmoji`, `generateShareMessage`, `shareScore`) were missing
- **Fix**: Added all three functions to implement share functionality
- **Result**: Share button now copies formatted message to clipboard

### Map Container Test Failing
- **Issue**: Test failed on test page (no map container present)
- **Root Cause**: Test asserted map exists without checking if container is present
- **Fix**: Added graceful skip when container doesn't exist
- **Result**: Test skips appropriately in different environments

## Future Enhancement Ideas

- [x] Sequential location display
- [x] Share score functionality
- [x] Comprehensive test suite
- [x] Pre-commit test automation
- [ ] Rotate locations daily (different set each day)
- [ ] Leaderboard (requires backend)
- [ ] More locations (expand beyond 5)
- [ ] Difficulty levels
- [ ] Hint system
- [ ] Historical accuracy tracking
- [ ] Social features

## Last Updated

**Generated**: 2025-01-17  
**Last commit**: Check `git log` for latest changes

---

## Development Philosophy

This project follows a **test-first development** approach:
- All new features include tests
- Tests run automatically before commits
- Commits are blocked if tests fail
- Comprehensive test coverage ensures reliability

See `docs/TESTING.md` for testing guidelines and `docs/DEVELOPMENT.md` for development practices.
