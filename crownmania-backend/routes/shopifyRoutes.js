// routes/shopifyRoutes.js
const express = require('express');
const router = express.Router();
const { getProducts, createOrder } = require('../controllers/shopifyController');

// @route   GET /api/shop/products
// @desc    Get products from Shopify
router.get('/products', getProducts);

// @route   POST /api/shop/orders
// @desc    Create an order in Shopify
router.post('/orders', createOrder);

module.exports = router;