# Quick Guide: Getting Your Google API Key

Follow these steps to get a Google Maps API key for the admin interface:

## Step 1: Go to Google Cloud Console

👉 **Open:** https://console.cloud.google.com/

Sign in with your Google account.

## Step 2: Create a Project

1. Click the project dropdown at the top (may say "Select a project")
2. Click **"New Project"**
3. Enter project name: `Philly Tap Admin` (or any name you prefer)
4. Click **"Create"**
5. Wait a few seconds, then select your new project from the dropdown

## Step 3: Enable Required APIs

1. In the left sidebar, go to **"APIs & Services"** → **"Library"**
2. Search for **"Maps JavaScript API"**
   - Click on it
   - Click **"Enable"** button
3. Go back to "Library"
4. Search for **"Places API"**
   - Click on it
   - Click **"Enable"** button

## Step 4: Create API Key

1. Go to **"APIs & Services"** → **"Credentials"** (in left sidebar)
2. Click **"Create Credentials"** at the top
3. Select **"API Key"**
4. Your API key will be generated and displayed
5. **Copy the API key** - it looks like: `AIzaSyC...` (long string)

## Step 5: (Recommended) Restrict the API Key

For security, restrict your key:

1. Click on the API key you just created (or click "Restrict key")
2. Under **"API restrictions"**:
   - Select **"Restrict key"**
   - Check ONLY:
     - ✅ Maps JavaScript API
     - ✅ Places API
   - Click **"Save"**
3. Under **"Application restrictions"**:
   - Select **"HTTP referrers (web sites)"**
   - Click **"Add an item"**
   - Add: `localhost:*` (for local development)
   - Add: `file://*` (if opening HTML file directly)
   - If you have a domain, add: `yourdomain.com/*`
   - Click **"Save"**

## Step 6: Add Key to admin.html

### Option A: Use the setup script (easiest) ✅

Run this command in your terminal (from the project root):

```bash
./admin/setup-api-key.sh YOUR_API_KEY_HERE
```

**Example:**
```bash
./admin/setup-api-key.sh AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz
```

This will automatically replace `YOUR_API_KEY` in `admin/admin.html` with your actual key.

### Option B: Manual setup

1. Open `admin/admin.html` in a text editor
2. Find this line (around line 12):
   ```html
   <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script>
   ```
3. Replace `YOUR_API_KEY` with your actual API key:
   ```html
   <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC...&libraries=places"></script>
   ```
4. Save the file

### ⚠️ Important: Don't Commit Your API Key

After adding your API key, make sure `admin/admin.html` is in `.gitignore` or be careful not to commit it with your key. The setup script will warn you about this. (Note: `admin/admin.html` is already in `.gitignore`)

## Step 7: Test It

1. Open `admin/admin.html` in your browser (must be served from a web server, not file://)
2. Try typing a location in one of the search boxes (e.g., "Liberty Bell")
3. If autocomplete appears, it's working! 🎉

## Troubleshooting

### "This page can't load Google Maps correctly"
- Make sure you enabled "Maps JavaScript API" in Step 3
- Check that your API key is correct
- Verify the API key restrictions allow your domain/localhost

### Search/Autocomplete not working
- Make sure you enabled "Places API" in Step 3
- Check browser console (F12) for errors
- Verify API restrictions include Places API

### API key shows as invalid
- Make sure you copied the entire key (it's long!)
- Check that both APIs are enabled
- Verify application restrictions allow your referrer

## API Costs

Google offers **$200 free credit per month**, which typically covers:
- **Maps JavaScript API**: ~28,000 map loads
- **Places API**: ~17,000 searches

For personal/admin use, you'll likely stay within the free tier.

## Security Notes

⚠️ **Important:**
- Never commit your API key to git (it should already be in .gitignore)
- Consider restricting the key to specific APIs and domains
- Monitor usage in Google Cloud Console

---

**Need help?** Check the detailed guide in `docs/ADMIN_SETUP.md`
