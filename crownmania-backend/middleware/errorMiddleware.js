// middleware/errorMiddleware.js

/**
 * Global error handling middleware
 */
module.exports = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace for debugging
    res.status(500).json({
      message: 'An unexpected error occurred.',
      error: err.message, // Optionally include the error message in the response (remove in production for security)
    });
  };