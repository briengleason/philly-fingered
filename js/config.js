/**
 * Configuration and Constants
 * Global configuration values and device detection
 */

// Device detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                (window.matchMedia && window.matchMedia("(max-width: 767px)").matches);

const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Maximum distance for scoring (in meters) - beyond this gives 0 points
const MAX_DISTANCE = 5000;

// Developer mode flag (set to true to enable reset functionality)
const DEV_MODE = false; // Change to true for development/testing
