const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Define the user schema
const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'First name must be at least 3 characters long'],
        },
        lastname: {
            type: String,
            minlength: [3, 'Last name must be at least 3 characters long'],
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'Email must be at least 5 characters long'],
    },
    password: {
        type: String,
        required: true,
        select: false, // Exclude password from query results unless explicitly selected
    },
    socketId: {
        type: String,
        default: null,
    },
});

// Instance method to generate a JWT token
userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

// Instance method to compare hashed password
userSchema.methods.comparePassword = function (inputPassword) {
    return bcrypt.compare(inputPassword, this.password);
};

// Static method to hash a plain password
userSchema.statics.hashPassword = function (plainPassword) {
    return bcrypt.hash(plainPassword, 10);
};

// Create the model and export it
const User = mongoose.model('User', userSchema);
module.exports = User;
