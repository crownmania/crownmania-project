const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * User login or registration
 * @route POST /api/auth/login
 * @param {string} walletAddress - User's wallet address
 * @returns {object} - JWT token and wallet address
 */
exports.login = async (req, res) => {
  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ message: 'Wallet address is required.' });
  }

  try {
    // Find user by wallet address or create a new one
    let user = await User.findOne({ walletAddress });
    if (!user) {
      user = new User({ walletAddress });
      await user.save();
    }

    // Generate JWT token
    const payload = { userId: user._id, walletAddress: user.walletAddress };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, walletAddress: user.walletAddress });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};