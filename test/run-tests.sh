#!/bin/bash

# Automated test runner for Philly Fingered
# Opens the test page in a browser and runs tests

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
cd "$REPO_ROOT"

echo "🧪 Starting automated test runner..."
echo ""

# Check if server is already running on port 8000
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "✅ Server already running on port 8000"
else
    echo "🚀 Starting local server on port 8000..."
    python3 -m http.server 8000 > /dev/null 2>&1 &
    SERVER_PID=$!
    sleep 2
    echo "✅ Server started (PID: $SERVER_PID)"
fi

# Open test page in default browser
TEST_URL="http://localhost:8000/test/run-tests-automated.html"
echo "📂 Opening test page: $TEST_URL"
echo ""

# Detect OS and open browser
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "$TEST_URL"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open "$TEST_URL" 2>/dev/null || firefox "$TEST_URL" 2>/dev/null || chromium "$TEST_URL" 2>/dev/null
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    # Windows
    start "$TEST_URL"
else
    echo "⚠️  Unknown OS. Please open manually: $TEST_URL"
fi

echo ""
echo "✅ Tests are running in your browser!"
echo "📊 Check the browser window for test results."
echo ""
echo "Press Ctrl+C to stop the server when done."

# Wait for user interrupt or keep server running
trap "echo ''; echo '🛑 Stopping server...'; kill $SERVER_PID 2>/dev/null || true; exit" INT TERM
wait $SERVER_PID 2>/dev/null || true
