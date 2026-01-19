#!/usr/bin/env node

/**
 * Location Validator
 * Validates locations.yaml file for common issues
 * 
 * Usage: node scripts/validate-locations.js
 * 
 * This script can work standalone with basic YAML parsing, or you can install js-yaml:
 * npm install js-yaml (if you want to use the full parser)
 */

const fs = require('fs');
const path = require('path');

// Try to use js-yaml if available, otherwise use basic parsing
let yaml;
try {
  yaml = require('js-yaml');
} catch (e) {
  console.warn('⚠️  js-yaml not found. Install with: npm install js-yaml');
  console.warn('   Using basic YAML parsing (may be less accurate)\n');
  // Basic YAML parser (for dates only)
  yaml = {
    load: (content) => {
      // This is a very basic parser - for production, install js-yaml
      // For now, we'll just parse dates manually
      return basicYAMLParse(content);
    },
    JSON_SCHEMA: {}
  };
}

const LOCATIONS_FILE = path.join(__dirname, '..', 'config', 'locations.yaml');
const REQUIRED_LOCATIONS = 5; // Each date should have 5 locations (id 0-4)
const PHILLY_BOUNDS = {
  lat: { min: 39.8, max: 40.1 },
  lng: { min: -75.3, max: -74.9 }
};

let errors = [];
let warnings = [];
let allLocations = new Map(); // Track all unique locations

function validateCoordinates(coord, locationName, date) {
  const [lat, lng] = coord;
  
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    errors.push(`Invalid coordinates for ${locationName} on ${date}: must be numbers`);
    return false;
  }
  
  if (lat < PHILLY_BOUNDS.lat.min || lat > PHILLY_BOUNDS.lat.max) {
    warnings.push(`Suspicious latitude for ${locationName} on ${date}: ${lat} (expected ~39.9)`);
  }
  
  if (lng < PHILLY_BOUNDS.lng.min || lng > PHILLY_BOUNDS.lng.max) {
    warnings.push(`Suspicious longitude for ${locationName} on ${date}: ${lng} (expected ~-75.1)`);
  }
  
  return true;
}

function validateLocation(location, date, expectedId) {
  const issues = [];
  
  // Check required fields
  if (!location.name) {
    issues.push('missing name');
  }
  
  if (!location.coordinates) {
    issues.push('missing coordinates');
  } else if (!Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
    issues.push('coordinates must be [lat, lng] array');
  } else {
    validateCoordinates(location.coordinates, location.name || 'Unknown', date);
  }
  
  if (!location.icon) {
    issues.push('missing icon');
  }
  
  // Check ID matches expected
  if (location.id !== expectedId) {
    issues.push(`id mismatch: expected ${expectedId}, got ${location.id}`);
  }
  
  // Track for duplicate checking
  if (location.name) {
    const key = location.name.toLowerCase().trim();
    if (allLocations.has(key)) {
      const existing = allLocations.get(key);
      warnings.push(`Duplicate location "${location.name}" found on ${date} (also on ${existing.date})`);
    } else {
      allLocations.set(key, { name: location.name, date, coordinates: location.coordinates });
    }
  }
  
  return issues;
}

function validateDateEntry(date, locations) {
  if (date === 'default') {
    return; // Skip default validation
  }
  
  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.push(`Invalid date format: ${date} (expected YYYY-MM-DD)`);
    return;
  }
  
  // Validate it's a real date
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    errors.push(`Invalid date: ${date}`);
    return;
  }
  
  // Check location count
  if (!Array.isArray(locations)) {
    errors.push(`Locations for ${date} must be an array`);
    return;
  }
  
  if (locations.length !== REQUIRED_LOCATIONS) {
    errors.push(`Date ${date} has ${locations.length} locations, expected ${REQUIRED_LOCATIONS}`);
  }
  
  // Validate each location
  const expectedIds = [0, 1, 2, 3, 4];
  const foundIds = new Set();
  
  locations.forEach((location, index) => {
    const expectedId = expectedIds[index];
    const issues = validateLocation(location, date, expectedId);
    
    if (issues.length > 0) {
      errors.push(`Date ${date}, Location ${index} (${location.name || 'unnamed'}): ${issues.join(', ')}`);
    }
    
    if (foundIds.has(location.id)) {
      errors.push(`Date ${date}: Duplicate location ID ${location.id}`);
    }
    foundIds.add(location.id);
  });
  
  // Check for missing IDs
  expectedIds.forEach(id => {
    if (!foundIds.has(id)) {
      errors.push(`Date ${date}: Missing location with ID ${id}`);
    }
  });
}

function main() {
  console.log('Validating locations.yaml...\n');
  
  try {
    const fileContents = fs.readFileSync(LOCATIONS_FILE, 'utf8');
    let data;
    if (typeof yaml.load === 'function' && yaml.JSON_SCHEMA) {
      data = yaml.load(fileContents, { schema: yaml.JSON_SCHEMA });
    } else {
      // Use basic parser
      data = yaml.load(fileContents);
    }
    
    // Validate default locations
    if (data.default && Array.isArray(data.default)) {
      console.log(`✓ Found default locations (${data.default.length} locations)`);
      data.default.forEach((location, index) => {
        validateLocation(location, 'default', location.id || index);
      });
    } else {
      warnings.push('No default locations found');
    }
    
    // Validate date-specific locations
    const dateKeys = Object.keys(data).filter(key => key !== 'default').sort();
    console.log(`✓ Found ${dateKeys.length} date-specific location sets\n`);
    
    dateKeys.forEach(date => {
      validateDateEntry(date, data[date]);
    });
    
    // Print results
    console.log('\n' + '='.repeat(60));
    console.log('VALIDATION RESULTS');
    console.log('='.repeat(60));
    
    if (errors.length === 0 && warnings.length === 0) {
      console.log('\n✅ All checks passed! No issues found.\n');
      process.exit(0);
    }
    
    if (errors.length > 0) {
      console.log(`\n❌ ERRORS (${errors.length}):`);
      errors.forEach((error, i) => {
        console.log(`  ${i + 1}. ${error}`);
      });
    }
    
    if (warnings.length > 0) {
      console.log(`\n⚠️  WARNINGS (${warnings.length}):`);
      warnings.forEach((warning, i) => {
        console.log(`  ${i + 1}. ${warning}`);
      });
    }
    
    console.log();
    process.exit(errors.length > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('❌ Error reading or parsing YAML file:');
    console.error(error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

// Basic YAML parser for validation (fallback if js-yaml not installed)
function basicYAMLParse(content) {
  const result = {};
  const lines = content.split('\n');
  let currentKey = null;
  let currentArray = null;
  let inArray = false;
  let currentItem = null;
  let indentLevel = 0;
  
  // This is very basic - just enough to find dates and basic structure
  // For full functionality, install js-yaml
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (trimmed.startsWith('#') || trimmed === '') continue;
    
    // Match date keys: YYYY-MM-DD:
    const dateMatch = line.match(/^(\d{4}-\d{2}-\d{2}):\s*$/);
    if (dateMatch) {
      currentKey = dateMatch[1];
      result[currentKey] = [];
      currentArray = result[currentKey];
      inArray = true;
      continue;
    }
    
    // Match default:
    if (line.match(/^default:\s*$/)) {
      currentKey = 'default';
      result[currentKey] = [];
      currentArray = result[currentKey];
      inArray = true;
      continue;
    }
    
    // Match array items: - id: X
    if (line.match(/^\s*-\s+id:/)) {
      if (currentArray) {
        currentItem = {};
        const idMatch = line.match(/id:\s*(\d+)/);
        if (idMatch) currentItem.id = parseInt(idMatch[1]);
        currentArray.push(currentItem);
      }
      continue;
    }
    
    // Match fields: name:, coordinates:, etc.
    if (currentItem && line.match(/^\s+[a-z]+:/)) {
      const fieldMatch = line.match(/^\s+([a-z]+):\s*(.+)$/);
      if (fieldMatch) {
        const [, key, value] = fieldMatch;
        if (key === 'coordinates') {
          // Parse [lat, lng]
          const coordMatch = value.match(/\[([-\d.]+),\s*([-\d.]+)\]/);
          if (coordMatch) {
            currentItem[key] = [parseFloat(coordMatch[1]), parseFloat(coordMatch[2])];
          }
        } else if (key === 'id') {
          currentItem[key] = parseInt(value.trim());
        } else {
          // Remove quotes if present
          currentItem[key] = value.trim().replace(/^["']|["']$/g, '');
        }
      }
    }
  }
  
  return result;
}

module.exports = { validateLocation, validateDateEntry, validateCoordinates };
