# Location Management Guide

This guide explains how to validate and update daily locations for Philly Tap.

## Quick Start: Validation Script

Run the validation script to check for common issues:

```bash
node scripts/validate-locations.js
```

The script checks for:
- ✅ Each date has exactly 5 locations (id 0-4)
- ✅ All required fields (name, coordinates, icon)
- ✅ Coordinates are in Philadelphia bounds
- ✅ No duplicate locations across dates
- ✅ Valid date formats (YYYY-MM-DD)
- ✅ Location IDs match expected values

### Installation (Optional)

For more accurate parsing, install js-yaml:

```bash
npm install js-yaml
```

The script will work without it, but with basic YAML parsing.

## Ideas for Easier Location Management

### Option 1: Web-Based Admin Interface (Recommended)

A simple HTML page with:
- **Date selector** - Choose which date to edit
- **Location forms** - Fill in name, coordinates, icon, description
- **Google Maps integration** - Search for places and auto-fill coordinates
- **Visual validation** - See locations on a map before saving
- **Export to YAML** - Generate the YAML file automatically

**Pros:**
- No command line needed
- Visual feedback on map
- Can integrate Google Places API for coordinate lookup
- Easy to use for non-technical users

**Implementation:** Would need an HTML page + JavaScript (could reuse existing map code)

### Option 2: Google Sheets / CSV Workflow

Use Google Sheets or Excel:
1. Create a spreadsheet with columns: Date, ID, Name, Lat, Lng, Icon, Description
2. Use formulas for validation
3. Export to CSV
4. Convert CSV → YAML with a script

**Pros:**
- Familiar interface
- Easy bulk editing
- Built-in validation formulas
- Can share for collaboration

**Cons:**
- Need CSV→YAML conversion script
- Manual coordinate lookup still needed

### Option 3: Google Places API Integration

CLI or web tool that:
- Accepts location names as input
- Queries Google Places API for coordinates
- Validates addresses are in Philadelphia
- Saves directly to YAML format

**Pros:**
- Automated coordinate lookup
- Validates addresses exist
- Can check if place is in Philly

**Cons:**
- Requires API key
- May have API costs
- Need to build the tool

### Option 4: Enhanced Validation Script with Suggestions

Extend the current validation script to:
- Suggest nearby coordinates if location seems wrong
- Check for common coordinate errors
- Generate template YAML for missing dates
- Bulk update utilities

**Pros:**
- Quick to implement
- No new dependencies
- Can be run in CI/CD

### Option 5: Visual Map Editor

Interactive map where you:
- Click on map to place locations
- Drag markers to adjust positions
- Fill in details in sidebar
- Export directly to YAML

**Pros:**
- Most intuitive
- Visual feedback
- Can reuse Leaflet code

**Cons:**
- More complex to build
- Need to handle saving/loading

## Current Workflow

1. Open `config/locations.yaml` in a text editor
2. Find or create the date entry (format: `YYYY-MM-DD:`)
3. Add/edit 5 locations with:
   - `id`: 0, 1, 2, 3, or 4
   - `name`: Location name
   - `coordinates`: `[latitude, longitude]`
   - `icon`: Emoji
   - `description`: (optional) Educational text
4. Run validation script to check for errors
5. Test in the app

## Coordinate Resources

When looking up coordinates:
- **Google Maps**: Right-click on location → Click coordinates to copy
- **Google Search**: Search "[location name] coordinates"
- **OpenStreetMap**: https://www.openstreetmap.org
- **GeoJSON.io**: https://geojson.io

Philadelphia bounds (for validation):
- Latitude: 39.8 to 40.1
- Longitude: -75.3 to -74.9

## Web Admin Interface

A web-based admin interface is available at `admin/admin.html` for easy location management.

### Features

- 📅 **Date selector** - Choose which date to edit
- 🔍 **Google Places search** - Search for locations and auto-fill coordinates
- 📍 **Visual map preview** - See all locations on a map for validation
- ✅ **Automatic validation** - Checks coordinates and required fields
- 📋 **YAML export** - Generates ready-to-use YAML format
- 💾 **Load existing dates** - Edit existing location sets

### Setup Google Places API (Optional)

To enable location search functionality:

1. **Get a Google Cloud API key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable these APIs:
     - Maps JavaScript API
     - Places API
   - Create credentials (API Key)
   - Optionally restrict the key to your domain

2. **Add your API key to admin/admin.html:**
   - Open `admin/admin.html` in a text editor
   - Find the line: `<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script>`
   - Replace `YOUR_API_KEY` with your actual API key
   - Or run: `./admin/setup-api-key.sh YOUR_API_KEY`

3. **Note:** The admin interface will work without the API key - you can manually enter coordinates.

### Usage

1. Open `admin/admin.html` in your browser (must be served from a web server, not file://)
2. Select or enter a date (YYYY-MM-DD format)
3. For each location:
   - Enter the location name
   - Use the search box to find it on Google Places (if API key is set)
   - Or manually enter latitude and longitude
   - Add an icon (emoji) and optional description
4. Use "Load Existing" to edit a date that's already in locations.yaml
5. Click "Validate & Export YAML" to generate the YAML output
6. Copy the generated YAML and paste it into `config/locations.yaml`

### Validation

The admin interface validates:
- All required fields are filled
- Coordinates are valid numbers
- Coordinates are within Philadelphia bounds (warning if outside)
- Date format is correct
- All 5 locations are complete

## Recommended Next Steps

1. ✅ **Use the validation script** after each edit
2. ✅ **Use the web admin interface** for easier editing (available now!)
3. ✅ **Integrate Google Places API** for coordinate lookup (included in admin)
4. 🚧 **Add automated tests** that run validation on commit

## Example: Adding a New Date

```yaml
2026-01-20:
  - id: 0
    name: South Street
    coordinates: [39.9412, -75.1564]
    icon: 🛣️
    description: South Street is one of Philadelphia's most famous streets...
  - id: 1
    name: Pat's King of Steaks
    coordinates: [39.9334, -75.1713]
    icon: 🥩
    description: Pat's King of Steaks is a legendary cheesesteak shop...
  # ... continue for ids 2, 3, 4
```
