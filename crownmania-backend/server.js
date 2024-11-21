// server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config();
const { connectDB } = require('./utils/helpers');
const authRoutes = require('./routes/authRoutes');
const collectibleRoutes = require('./routes/collectibleRoutes');
const shopifyRoutes = require('./routes/shopifyRoutes');
const userRoutes = require('./routes/userRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const rateLimiter = require('./middleware/rateLimiter');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());

// Connect to MongoDB
connectDB();

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running!' });
});

// Rate Limiting
app.use('/api/collectibles/verify', rateLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/collectibles', collectibleRoutes);
app.use('/api/shop', shopifyRoutes);
app.use('/api/users', userRoutes);

// Error Handling Middleware
app.use(errorMiddleware);

// Start the server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;