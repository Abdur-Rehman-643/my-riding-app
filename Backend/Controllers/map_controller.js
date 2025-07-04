const mapService = require('../Services/map_service');
const { validationResult } = require('express-validator');

// Get coordinates from an address
module.exports.getCoordinates = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { address } = req.query;

    try {
        const coordinates = await mapService.getAddressCoordinate(address);
        res.status(200).json(coordinates);
    } catch (error) {
        console.error('Error fetching coordinates:', error.message);
        res.status(404).json({ message: 'Coordinates not found' });
    }
};

// Get distance and time between two locations
module.exports.getDistanceTime = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { origin, destination } = req.query;

    try {
        const distanceTime = await mapService.getDistanceTime(origin, destination);
        res.status(200).json(distanceTime);
    } catch (error) {
        console.error('Error fetching distance/time:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get auto-complete suggestions for location input
module.exports.getAutoCompleteSuggestions = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { input } = req.query;

    try {
        const suggestions = await mapService.getAutoCompleteSuggestions(input);
        res.status(200).json(suggestions);
    } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports.getEstimatedFare = async (req, res, next) => {
    const { pickup, destination } = req.query;

    try {
        const data = await mapService.getEstimatedFare(pickup, destination);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error calculating fare:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};
