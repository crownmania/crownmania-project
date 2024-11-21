// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

/**
 * Authentication middleware to protect routes
 */
module.exports = (req, res, next) => {
  // Retrieve token from the Authorization header
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user information to the request object
    next(); // Proceed to the next middleware or controller
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Token is not valid or has expired.' });
  }
};