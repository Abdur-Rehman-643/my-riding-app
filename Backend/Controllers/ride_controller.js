const rideService = require('../Services/ride_service');
const mapService = require('../Services/map_service');
const rideModel = require('../Models/ride_model');
const { validationResult } = require('express-validator');
const { sendMessageToSocketId } = require('../socket');

// Create a new ride request
module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body;

    try {
        const ride = await rideService.createRide({
            user: req.user._id,
            pickup,
            destination,
            vehicleType,
        });

        res.status(201).json(ride);

        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
        const captainsNearby = await mapService.getCaptainsInTheRadius(
            pickupCoordinates.ltd,
            pickupCoordinates.lng,
            2 // radius in km
        );

        // Hide OTP before sending ride to captains
        ride.otp = '';

        const rideWithUser = await rideModel
            .findOne({ _id: ride._id })
            .populate('user');

        captainsNearby.forEach((captain) => {
            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: rideWithUser,
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// Get fare estimate for a ride
module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        res.status(200).json(fare);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Confirm a ride by captain
module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.confirmRide({
            rideId,
            captain: req.captain,
        });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride,
        });

        res.status(200).json(ride);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// Start a ride using rideId and OTP
module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({
            rideId,
            otp,
            captain: req.captain,
        });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride,
        });

        res.status(200).json(ride);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// End a ride
module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({
            rideId,
            captain: req.captain,
        });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride,
        });

        res.status(200).json(ride);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
