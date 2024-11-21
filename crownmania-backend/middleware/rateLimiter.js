// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

/**
 * Rate limiter middleware to prevent brute-force attacks or excessive requests.
 */
const verifyLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // Time window in milliseconds (5 minutes)
  max: 10, // Maximum number of requests allowed in the time window
  message: {
    message: 'Too many verification attempts from this IP, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers (recommended)
});

module.exports = verifyLimiter;