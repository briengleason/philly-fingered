# Development Guide

## Testing & Development Mode

### Quick Reset Methods

#### Method 1: Keyboard Shortcut (Recommended)
- **Windows/Linux**: Press `Ctrl + Shift + R`
- **Mac**: Press `Cmd + Shift + R`
- This will prompt you to confirm resetting the session

#### Method 2: Browser Console
Open the browser console (F12) and run:
```javascript
// Reset current day's session
const today = new Date().toDateString();
localStorage.removeItem(`phillyGame_${today}`);
location.reload();
```

#### Method 3: Clear All localStorage
```javascript
// Clear everything (nuclear option)
localStorage.clear();
location.reload();
```

#### Method 4: Developer Mode Flag
Edit `index.html` and set:
```javascript
const DEV_MODE = true; // Change from false to true
```
This will:
- Never save game state to localStorage
- Reset on every page refresh
- Perfect for rapid testing

**Remember to set it back to `false` before committing!**

### Testing Daily Reset

To test the daily reset functionality:

1. **Change system date** (temporarily):
   ```bash
   # macOS
   sudo date 010100002025
   
   # Linux
   sudo date -s "2025-01-01 00:00:00"
   
   # Windows (PowerShell as Admin)
   Set-Date -Date "2025-01-01"
   ```

2. **Or use browser console to simulate**:
   ```javascript
   // Temporarily override date
   const originalDate = Date;
   Date = class extends originalDate {
      constructor() {
         super();
         return new originalDate('2025-01-01');
      }
      static now() {
         return new originalDate('2025-01-01').getTime();
      }
   };
   location.reload();
   ```

### Session Storage Structure

Game state is stored in localStorage with the key:
```
phillyGame_{today's date string}
```

Example: `phillyGame_Tue Jan 17 2025`

The game state structure:
```javascript
{
  currentLocationIndex: 0,  // Which location we're on (0-4)
  guesses: {
    [locationId]: {
      latlng: { lat, lng },
      distance: number,    // meters
      score: number        // 0-100
    }
  },
  totalScore: number        // 0-500
}
```

### Development Checklist

- [ ] Test all 5 locations
- [ ] Test completion screen
- [ ] Test score calculations
- [ ] Test daily reset (change date)
- [ ] Test session persistence
- [ ] Test on mobile devices
- [ ] Test with slow network (YAML loading)
- [ ] Verify no console errors
- [ ] Set `DEV_MODE = false` before committing

### Common Issues

**Issue**: Game state persists after refresh
- **Solution**: Check that `DEV_MODE` is set correctly, or use reset methods above

**Issue**: Can't test daily reset
- **Solution**: Use browser console to manually change the date key

**Issue**: Markers not clearing on reset
- **Solution**: Reset function should handle this, but try hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

### Browser DevTools Tips

- **Network tab**: Monitor YAML file loading
- **Application/Storage tab**: View/edit localStorage values
- **Console**: Run reset commands
- **Elements**: Inspect animations and transitions
