const captainModel = require('../Models/captain_model');

// Hardcoded mock coordinates for known locations
const mockCoordinates = {
    "UET Lahore": { ltd: 31.5764, lng: 74.4060 },
    "Walton Road": { ltd: 31.4938, lng: 74.3537 },
    "Liberty Market": { ltd: 31.5204, lng: 74.3587 },
    "Mall Road": { ltd: 31.5656, lng: 74.3142 },
    "Johar Town": { ltd: 31.4673, lng: 74.2728 },
    "Gulberg": { ltd: 31.5250, lng: 74.3507 },
    "Model Town": { ltd: 31.4833, lng: 74.3333 },
    "DHA Phase 3": { ltd: 31.4700, lng: 74.4000 },
    "Thokar Niaz Baig": { ltd: 31.4667, lng: 74.2667 }
};

// Estimate coordinates based on address
module.exports.getAddressCoordinate = async (address) => {
    if (mockCoordinates[address]) {
        return mockCoordinates[address];
    } else {
        throw new Error("Address not found in static dataset");
    }
};

// Estimate distance and time (based on Haversine formula or static mock values)
module.exports.getDistanceTime = async (origin, destination) => {
    const from = mockCoordinates[origin];
    const to = mockCoordinates[destination];

    if (!from || !to) throw new Error("Unknown origin or destination");

    const distanceKm = getEstimatedDistance(from, to); // In km
    const estimatedTimeMin = Math.ceil(distanceKm / 0.6); // Assume 36km/h average

    return {
        distance: { text: `${distanceKm.toFixed(1)} km`, value: distanceKm * 1000 },
        duration: { text: `${estimatedTimeMin} mins`, value: estimatedTimeMin * 60 }
    };
};

// Provide static suggestions based on a keyword match
module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) throw new Error("Input is required for suggestions");

    return Object.keys(mockCoordinates).filter(loc =>
        loc.toLowerCase().includes(input.toLowerCase())
    );
};

// Get captains near a location using mock radius logic
module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    const captains = await captainModel.find(); // All captains
    const filtered = captains.filter(captain => {
        const dist = getEstimatedDistance({ ltd, lng }, captain.location);
        return dist <= radius;
    });

    return filtered;
};

// Simple haversine formula to estimate distance in km
function getEstimatedDistance(from, to) {
    const R = 6371;
    const dLat = toRadians(to.ltd - from.ltd);
    const dLon = toRadians(to.lng - from.lng);
    const lat1 = toRadians(from.ltd);
    const lat2 = toRadians(to.ltd);

    const a = Math.sin(dLat / 2) ** 2 +
        Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// Estimate fare based on distance (in km)
module.exports.getEstimatedFare = async (pickup, destination) => {
    const { distance } = await module.exports.getDistanceTime(pickup, destination);

    const distanceKm = distance.value / 1000;
    const baseFare = 100;       // base charge
    const perKmRate = 30;       // rate per km

    const fare = Math.ceil(baseFare + distanceKm * perKmRate);

    return {
        fare,
        distance: distance.text,
        time: Math.ceil(distanceKm / 0.6) + " mins" // optional for display
    };
};



