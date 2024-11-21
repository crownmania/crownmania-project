// utils/helpers.js
const mongoose = require('mongoose');

/**
 * Connect to MongoDB
 */
exports.connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

/**
 * Generate a random serial number
 * @returns {string} Random serial number
 */
exports.generateSerialNumber = () => {
  return 'SN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};