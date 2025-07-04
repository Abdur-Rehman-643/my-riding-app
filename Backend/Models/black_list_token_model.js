const mongoose = require('mongoose');

// Define schema for blacklisted tokens
const BlacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400, // Token expires after 24 hours (in seconds)
    },
});

// Export the model
module.exports = mongoose.model('BlacklistToken', BlacklistTokenSchema);
