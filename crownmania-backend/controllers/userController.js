// controllers/userController.js
const User = require('../models/User');

/**
 * Get current user's information
 * @route GET /api/users/me
 * @returns {object} - User data
 */
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error retrieving user data:', error);
    res.status(500).json({ message: 'Server error while retrieving user data.' });
  }
};