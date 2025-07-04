const userModel = require('../Models/user_model');
const captainModel = require('../Models/captain_model');
const blackListTokenModel = require('../Models/black_list_token_model');
const jwt = require('jsonwebtoken');

// Middleware to authenticate regular users
module.exports.authUser = async (req, res, next) => {
    const token =
        req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const blacklisted = await blackListTokenModel.findOne({ token });
    if (blacklisted) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

// Middleware to authenticate captains
module.exports.authCaptain = async (req, res, next) => {
    const token =
        req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const blacklisted = await blackListTokenModel.findOne({ token });
    if (blacklisted) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findById(decoded._id);

        req.captain = captain;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
