// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getUser } = require('../controllers/userController');

// @route   GET /api/users/me
// @desc    Get current user
router.get('/me', auth, getUser);

module.exports = router;