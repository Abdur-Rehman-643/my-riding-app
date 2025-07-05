const userModel = require('../Models/user_model');
const userService = require('../Services/user_service');
const Ride = require('../Models/ride_model');
const blackListTokenModel = require('../Models/black_list_token_model');
const { validationResult } = require('express-validator');

// Register User
module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exist' });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const newUser = await userService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword
    });

    const token = newUser.generateAuthToken();

    res.status(201).json({ token, user: newUser });
};

// Login User
module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = user.generateAuthToken();

    res.cookie('token', token);
    res.status(200).json({ token, user });
};

// Get User Profile
module.exports.getUserProfile = async (req, res, next) => {
    res.status(200).json(req.user);
};

// Logout User
module.exports.logoutUser = async (req, res, next) => {
    res.clearCookie('token');

    const token =
        req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (token) {
        await blackListTokenModel.create({ token });
    }

    res.status(200).json({ message: 'Logged out' });
};

module.exports.getRideHistory = async (req, res, next) => {
    try {
        const userId = req.user._id;
        console.log("Fetching rides for user:", userId); // 🐞 DEBUG

        const rides = await Ride.find({ user: userId })
            .populate('captain', 'fullname email vehicle')
            .sort({ _id: -1 });

        console.log("Found rides:", rides.length); // 🐞 DEBUG

        res.status(200).json({ rides });
    } catch (error) {
        console.error('Error fetching ride history:', error);
        res.status(500).json({ message: 'Failed to fetch ride history' });
    }
};
