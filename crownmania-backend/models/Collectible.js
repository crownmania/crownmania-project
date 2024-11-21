// models/Collectible.js

const mongoose = require('mongoose');

/**
 * Schema for collectible items.
 * Stores details about each collectible, including its verification and claim status.
 */
const CollectibleSchema = new mongoose.Schema({
  serialNumber: { type: String, unique: true, required: true },
  verificationStatus: { type: String, enum: ['unverified', 'verified'], default: 'unverified' },
  tokenClaimed: { type: Boolean, default: false },
  collectibleName: { type: String, required: true },
  collectibleNumber: { type: Number }, // Assigned during packaging
  totalCollectibles: { type: Number, required: true },
  nftId: { type: String },
  claimDate: { type: Date },
  preMintedStatus: { type: Boolean, default: false },
  testedStatus: { type: Boolean, default: false },
  metadata: { type: Object },
  ownerWalletAddress: { type: String },
  inUse: { type: Boolean, default: false }, // New field to mark if in use
  assignedDate: { type: Date },             // New field to record assignment date
  createdAt: { type: Date, default: Date.now },
});

// Export the model
module.exports = mongoose.model('Collectible', CollectibleSchema);