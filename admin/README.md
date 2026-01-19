# Location Admin Interface

Web-based admin interface for managing daily locations in Philly Tap.

## Quick Start

1. **Open the admin interface:**
   ```bash
   # Serve the project from the root directory
   python3 -m http.server 8080
   # Then open: http://localhost:8080/admin/admin.html
   ```

2. **Set up Google Places API (optional but recommended):**
   - Follow instructions in `GET_API_KEY.md`
   - Run: `./admin/setup-api-key.sh YOUR_API_KEY`
   - Or manually replace `YOUR_API_KEY` in `admin.html`

3. **Use the interface:**
   - Enter or select a date
   - Use "Load Existing" to load locations from `config/locations.yaml`
   - Search for locations using Google Places (if API key is set)
   - Or manually enter coordinates
   - Click "Validate & Export YAML" to generate YAML
   - Copy the YAML and paste into `../config/locations.yaml`

## Files

- **`admin.html`** - Main admin interface (add your API key here)
- **`admin.html.example`** - Template without API key
- **`setup-api-key.sh`** - Script to add your API key
- **`GET_API_KEY.md`** - Quick guide to get Google API key
- **`SETUP.md`** - Detailed setup instructions (formerly ADMIN_SETUP.md)

## Features

- 📅 **Date selector** - Choose which date to edit
- 🔍 **Google Places search** - Search for locations and auto-fill coordinates
- 📍 **Map preview** - Visual validation of locations
- ✅ **Validation** - Checks coordinates, required fields, bounds
- 📋 **YAML export** - Generate ready-to-use YAML with copy button
- 💾 **Load existing** - Edit dates already in locations.yaml

## Requirements

- Web server (not `file://`) to load `config/locations.yaml`
- Modern web browser
- Google Maps API key (optional, for location search)

## Notes

- `admin.html` is in `.gitignore` to prevent committing your API key
- The interface loads locations from `../config/locations.yaml`
- All generated YAML should be pasted into `../config/locations.yaml`
