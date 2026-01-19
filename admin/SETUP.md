# Admin Interface Setup Guide

This guide explains how to set up and use the web-based admin interface for managing daily locations.

## Quick Start

1. Open `admin/admin.html` in your web browser (must be served from a web server)
2. Start adding locations - you can manually enter coordinates without any setup
3. For location search, follow the Google API setup below

## Google Places API Setup

The admin interface can search for locations and auto-fill coordinates using Google Places API. This is optional - you can always manually enter coordinates.

### Step 1: Get a Google Cloud API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Create a new project (or select an existing one):
   - Click the project dropdown at the top
   - Click "New Project"
   - Enter a project name (e.g., "Philly Tap Admin")
   - Click "Create"

### Step 2: Enable Required APIs

1. In your project, go to "APIs & Services" → "Library"
2. Search for and enable these APIs:
   - **Maps JavaScript API** - Required for the map preview
   - **Places API** - Required for location search

### Step 3: Create API Key

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the API key that's generated

### Step 4: (Optional) Restrict API Key

For security, restrict your API key:

1. Click on the API key you just created
2. Under "API restrictions":
   - Select "Restrict key"
   - Check only "Maps JavaScript API" and "Places API"
3. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Add your domain (e.g., `localhost:*` for local development, or your production domain)
4. Click "Save"

### Step 5: Add API Key to admin/admin.html

1. Open `admin/admin.html` in a text editor
2. Find this line (around line 10):
   ```html
   <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script>
   ```
3. Replace `YOUR_API_KEY` with your actual API key:
   ```html
   <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC...&libraries=places"></script>
   ```
4. Save the file

### Step 6: Test It

1. Open `admin/admin.html` in your browser
2. Try searching for a location (e.g., "Liberty Bell")
3. If it works, you'll see the location name and coordinates auto-filled!

## Using the Admin Interface

### Adding Locations for a New Date

1. Enter the date in YYYY-MM-DD format (or use the date picker)
2. For each of the 5 locations:
   - **Name**: Enter the location name
   - **Search**: Type the location name and click "Search" (or use autocomplete)
   - **Coordinates**: Will auto-fill from search, or enter manually
   - **Icon**: Add an emoji (🔔, 🏛️, etc.)
   - **Description**: Optional educational description
3. Check the map preview to verify locations are correct
4. Click "Validate & Export YAML"
5. Copy the generated YAML and paste into `config/locations.yaml`

### Editing Existing Dates

1. Enter the date you want to edit
2. Click "Load Existing"
3. The form will populate with current location data
4. Make your changes
5. Click "Validate & Export YAML"
6. Replace the corresponding section in `config/locations.yaml`

### Manual Coordinate Entry

Without the API key, you can still use the admin interface:

1. Enter location names manually
2. Look up coordinates on:
   - Google Maps (right-click → click coordinates)
   - [OpenStreetMap](https://www.openstreetmap.org)
   - [GeoJSON.io](https://geojson.io)
3. Enter coordinates manually in the form
4. The map preview will still show your locations

### Validation

The interface validates:
- ✅ All required fields are filled
- ✅ Coordinates are valid numbers
- ⚠️ Coordinates are within Philadelphia bounds (shows warning if outside)
- ✅ Date format is correct (YYYY-MM-DD)
- ✅ All 5 locations have data

### Tips

- **Map Preview**: Use the map to visually verify locations are in the right place
- **Coordinate Bounds**: Philadelphia is approximately:
  - Latitude: 39.8 to 40.1
  - Longitude: -75.3 to -74.9
- **Icons**: Use emojis that represent the location type (🔔 for Liberty Bell, 🏛️ for museums, 🍕 for restaurants, etc.)
- **Save Your Work**: The YAML output is not automatically saved - copy it to your `locations.yaml` file

## Troubleshooting

### "Google API key not loaded" warning
- Make sure you've replaced `YOUR_API_KEY` in `admin/admin.html`
- Check that you've enabled the required APIs in Google Cloud Console
- Verify your API key restrictions allow your domain

### Search not working
- Check browser console for errors (F12 → Console tab)
- Verify Places API is enabled in Google Cloud Console
- Make sure your API key has Places API access

### Can't load existing dates
- Make sure you're serving the files from a web server (not opening as `file://`)
- Check that `config/locations.yaml` is accessible
- The file must be accessible from `admin/admin.html` (located at `../config/locations.yaml`)

### Coordinates seem wrong
- Use the map preview to visually verify
- Double-check you're using latitude, longitude (not longitude, latitude)
- Verify coordinates are in decimal format (e.g., 39.9526, not 39°57'09")

## API Costs

Google Maps Platform offers a free tier:
- **Maps JavaScript API**: $200 free credit per month (typically covers 28,000+ loads)
- **Places API (Text Search)**: $200 free credit per month (typically covers 17,000+ searches)

For personal use with the admin interface, you're unlikely to exceed the free tier.

## Security Notes

- **Never commit your API key to git** - consider using environment variables or a config file that's git-ignored
- **Restrict your API key** to only the APIs and domains you need
- **Monitor usage** in Google Cloud Console to detect unusual activity
