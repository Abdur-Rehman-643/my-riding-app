const captainModel = require('../Models/captain_model');
const captainService = require('../Services/captain_service');
const Ride = require('../Models/ride_model');
const blackListTokenModel = require('../Models/black_list_token_model');
const { validationResult } = require('express-validator');

// Register a new captain
module.exports.registerCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password, vehicle } = req.body;

    const existingCaptain = await captainModel.findOne({ email });
    if (existingCaptain) {
        return res.status(400).json({ message: 'Captain already exists' });
    }

    const hashedPassword = await captainModel.hashPassword(password);

    const newCaptain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType,
    });

    const token = newCaptain.generateAuthToken();

    res.status(201).json({ token, captain: newCaptain });
};

// Captain login
module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select('+password');
    if (!captain) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValidPassword = await captain.comparePassword(password);
    if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = captain.generateAuthToken();
    res.cookie('token', token);
    res.status(200).json({ token, captain });
};

// Get captain profile
module.exports.getCaptainProfile = async (req, res, next) => {
    res.status(200).json({ captain: req.captain });
};

// Logout captain and blacklist token
module.exports.logoutCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (token) {
        await blackListTokenModel.create({ token });
        res.clearCookie('token');
    }

    res.status(200).json({ message: 'Logout successful' });
};

module.exports.getRideHistory = async (req, res, next) => {
    try {
        const captainId = req.captain._id;
        const rides = await Ride.find({ captain: captainId })
            .populate('user', 'fullname email')
            .sort({ _id: -1 });
        res.status(200).json({ rides });
    } catch (error) {
        console.error('Error fetching ride history:', error);
        res.status(500).json({ message: 'Failed to fetch ride history' });
    }
};