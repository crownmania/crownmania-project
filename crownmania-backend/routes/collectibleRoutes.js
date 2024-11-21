// routes/collectibleRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const rateLimiter = require('../middleware/rateLimiter');
const {
  verifyCollectible,
  claimCollectible,
  getMyCollectibles,
  packageCollectible,
} = require('../controllers/collectibleController');

// @route   GET /api/collectibles/my-collectibles
// @desc    Get collectibles owned by the user
router.get('/my-collectibles', auth, getMyCollectibles);

// @route   POST /api/collectibles/verify
// @desc    Verify a collectible
router.post('/verify', rateLimiter, verifyCollectible);

// @route   POST /api/collectibles/claim
// @desc    Claim a collectible
router.post('/claim', auth, claimCollectible);

// @route   POST /api/collectibles/package
// @desc    Mark a collectible as packaged
router.post('/package', auth, packageCollectible);

module.exports = router;