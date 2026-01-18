/**
 * Map Initialization and Management
 * Handles Leaflet map setup, pin icons, markers, and map event handlers
 */

// Global map instance (must be accessible to other modules)
const map = L.map('map', {
    center: [39.9526, -75.1652], // Philadelphia coordinates
    zoom: isMobile ? 12 : 13, // Slightly zoomed out on mobile for better overview
    zoomControl: false,
    scrollWheelZoom: !isMobile, // Disable scroll wheel zoom on mobile (use pinch instead)
    doubleClickZoom: true,
    boxZoom: !isMobile, // Box zoom only on desktop
    keyboard: !isMobile, // Keyboard controls only on desktop
    dragging: true,
    touchZoom: hasTouch,
    tap: hasTouch,
    tapTolerance: 15,
    preferCanvas: false,
    zoomAnimation: true,
    zoomAnimationThreshold: 4,
    fadeAnimation: true,
    markerZoomAnimation: true
});

// Use CartoDB Voyager NoLabels - vibrant colorful tiles without labels
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
    minZoom: 10,
    tileSize: 256,
    zoomOffset: 0
}).addTo(map);

// Additional CSS to hide any remaining text elements and controls
const style = document.createElement('style');
style.textContent = `
    .leaflet-container .leaflet-control-attribution,
    .leaflet-container .leaflet-control-scale {
        display: none !important;
    }
    .leaflet-tile-pane {
        filter: contrast(1.1) brightness(0.95);
    }
    /* Hide any text that might appear on tiles */
    .leaflet-tile-container {
        font-size: 0 !important;
    }
`;
document.head.appendChild(style);

// Handle viewport resize (especially important for mobile browsers)
let resizeTimer;
function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        map.invalidateSize();
    }, 100);
}

window.addEventListener('resize', handleResize);
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        map.invalidateSize();
    }, 200);
});

// Prevent default touch behaviors that might interfere (but allow pinch zoom)
if (hasTouch) {
    let touchStartDistance = 0;
    
    map.getContainer().addEventListener('touchstart', function(e) {
        if (e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            touchStartDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
        }
    }, { passive: true });
    
    map.getContainer().addEventListener('touchmove', function(e) {
        // Allow pinch zoom
        if (e.touches.length === 2) {
            e.preventDefault();
        }
    }, { passive: false });
}

// Ensure map fills the screen on initial load
setTimeout(() => {
    map.invalidateSize();
}, 100);

// Additional mobile optimizations
if (isMobile) {
    // Prevent pull-to-refresh on mobile
    let lastTouchY = 0;
    document.addEventListener('touchstart', (e) => {
        lastTouchY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
        const touchY = e.touches[0].clientY;
        const touchDelta = touchY - lastTouchY;
        
        // Prevent pull-to-refresh when scrolling down from top
        if (window.scrollY === 0 && touchDelta > 0) {
            e.preventDefault();
        }
    }, { passive: false });
}

// Desktop keyboard shortcuts
if (!isMobile) {
    document.addEventListener('keydown', (e) => {
        // Arrow keys for panning
        const panDistance = 100;
        switch(e.key) {
            case 'ArrowUp':
                map.panBy([0, -panDistance]);
                break;
            case 'ArrowDown':
                map.panBy([0, panDistance]);
                break;
            case 'ArrowLeft':
                map.panBy([-panDistance, 0]);
                break;
            case 'ArrowRight':
                map.panBy([panDistance, 0]);
                break;
        }
    });
}

// Store references to markers and lines for all locations (must be global)
let locationMarkers = {}; // { locationId: { tapMarker, locationMarker, line, label } }
let pendingGuess = null; // Store pending guess location before confirmation
let previewMarker = null; // Preview marker shown before confirmation

// Create custom pin icon
function createPinIcon(color, isLocation = false, customIcon = null) {
    const icon = customIcon || (isLocation ? '🔔' : '📍');
    return L.divIcon({
        className: 'custom-pin',
        html: `<div style="position: relative; width: 24px; height: 32px;">
            <div style="
                width: 24px;
                height: 24px;
                background: ${color};
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 2;
            ">${icon}</div>
            <div style="
                width: 0;
                height: 0;
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-top: 12px solid ${color};
                position: absolute;
                top: 20px;
                left: 6px;
                z-index: 1;
            "></div>
        </div>`,
        iconSize: [24, 32],
        iconAnchor: [12, 32],
        popupAnchor: [0, -32]
    });
}

// Remove markers for a specific location
function clearLocationMarkers(locationId) {
    if (locationMarkers[locationId]) {
        const markers = locationMarkers[locationId];
        if (markers.tapMarker) map.removeLayer(markers.tapMarker);
        if (markers.locationMarker) map.removeLayer(markers.locationMarker);
        if (markers.line) map.removeLayer(markers.line);
        if (markers.label) map.removeLayer(markers.label);
        delete locationMarkers[locationId];
    }
}

// Create markers and connecting line for a location
function createMarkersAndLine(locationId, tapLatLng, distance, existingTapMarker = null) {
    const location = locations[locationId];
    if (!location) return;
    
    // Clear previous markers for this location
    clearLocationMarkers(locationId);
    
    // Use existing tap marker if provided, otherwise create new one
    const tapMarker = existingTapMarker || L.marker(tapLatLng, {
        icon: createPinIcon('#2563eb', false)
    });
    
    // Only add to map if it's a new marker
    if (!existingTapMarker) {
        tapMarker.addTo(map);
    }
    
    // Create pin at actual location (red) - make it clickable to show description
    const locationMarker = L.marker(location.coordinates, {
        icon: createPinIcon('#dc2626', true, location.icon)
    }).addTo(map);
    
    // Add click handler to show location description (only for guessed locations)
    locationMarker.on('click', (e) => {
        e.originalEvent.stopPropagation(); // Prevent map click
        showLocationInfo(location);
    });
    
    // Add cursor pointer style to indicate it's clickable
    locationMarker.on('mouseover', () => {
        map.getContainer().style.cursor = 'pointer';
    });
    locationMarker.on('mouseout', () => {
        map.getContainer().style.cursor = '';
    });
    
    // Create line connecting the two points
    const line = L.polyline([tapLatLng, location.coordinates], {
        color: '#2563eb',
        weight: 3,
        opacity: 0.6,
        dashArray: '10, 5'
    }).addTo(map);
    
    // Calculate midpoint for distance label
    const midLat = (tapLatLng.lat + location.coordinates[0]) / 2;
    const midLng = (tapLatLng.lng + location.coordinates[1]) / 2;
    
    // Create distance label at midpoint
    const label = L.marker([midLat, midLng], {
        icon: L.divIcon({
            className: 'distance-label',
            html: `<div style="
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                padding: 6px 12px;
                border-radius: 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                font-size: 13px;
                font-weight: 600;
                color: #2563eb;
                white-space: nowrap;
                border: 2px solid #2563eb;
            ">${formatDistance(distance)}</div>`,
            iconSize: [null, null],
            iconAnchor: [0, 0]
        })
    }).addTo(map);
    
    // Store references
    locationMarkers[locationId] = {
        tapMarker,
        locationMarker,
        line,
        label
    };
}
