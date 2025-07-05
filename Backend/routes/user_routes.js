const express = require('express');
const { body } = require('express-validator');

const router = express.Router();
const userController = require('../Controllers/user_controller');
const authMiddleware = require('../Middleware/auth_middleware');

// Register route
router.post(
    '/register',
    [
        body('email')
            .isEmail()
            .withMessage('Invalid Email'),
        body('fullname.firstname')
            .isLength({ min: 3 })
            .withMessage('First name must be at least 3 characters long'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long'),
    ],
    userController.registerUser
);

// Login route
router.post(
    '/login',
    [
        body('email')
            .isEmail()
            .withMessage('Invalid Email'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long'),
    ],
    userController.loginUser
);

// Profile route (requires authentication)
router.get(
    '/profile',
    authMiddleware.authUser,
    userController.getUserProfile
);

// Logout route (requires authentication)
router.get(
    '/logout',
    authMiddleware.authUser,
    userController.logoutUser
);

router.get(
    '/ride-history',
    authMiddleware.authUser,
    userController.getRideHistory
);

module.exports = router;
