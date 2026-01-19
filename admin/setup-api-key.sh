#!/bin/bash

# Setup script for Google API key in admin.html
# Usage: ./admin/setup-api-key.sh YOUR_API_KEY

if [ -z "$1" ]; then
    echo "Usage: ./admin/setup-api-key.sh YOUR_API_KEY"
    echo ""
    echo "Example:"
    echo "  ./admin/setup-api-key.sh AIzaSyC..."
    exit 1
fi

API_KEY="$1"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ADMIN_FILE="$SCRIPT_DIR/admin.html"

if [ ! -f "$ADMIN_FILE" ]; then
    echo "Error: admin.html not found at $ADMIN_FILE"
    exit 1
fi

# Replace YOUR_API_KEY with the actual key
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/YOUR_API_KEY/$API_KEY/g" "$ADMIN_FILE"
else
    # Linux
    sed -i "s/YOUR_API_KEY/$API_KEY/g" "$ADMIN_FILE"
fi

echo "✅ API key configured in $ADMIN_FILE"
echo ""
echo "⚠️  SECURITY WARNING:"
echo "   Your API key is now in $ADMIN_FILE"
echo "   Make sure NOT to commit this file with your key to git!"
echo "   Consider adding it to .gitignore or using git update-index --assume-unchanged"
echo ""
echo "Next steps:"
echo "1. Open admin/admin.html in your browser (must be served from a web server)"
echo "2. Try searching for a location to verify it works"
echo ""
echo "Note: Make sure to enable 'Maps JavaScript API' and 'Places API' in Google Cloud Console"
