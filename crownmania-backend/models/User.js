// models/User.js

const mongoose = require('mongoose');

/**
 * Schema for user information.
 * This stores the wallet address of the user and the time of creation.
 */
const UserSchema = new mongoose.Schema({
  walletAddress: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Export the model
module.exports = mongoose.model('User', UserSchema);