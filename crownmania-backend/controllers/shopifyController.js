// controllers/shopifyController.js
const { fetchProducts, createOrder } = require('../utils/shopifyAPI');

/**
 * Get products from Shopify store
 * @route GET /api/shop/products
 * @returns {array} - List of products
 */
exports.getProducts = async (req, res) => {
  try {
    const products = await fetchProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      message: 'Server error while fetching products. Please try again later.',
    });
  }
};

/**
 * Create an order in Shopify
 * @route POST /api/shop/orders
 * @param {array} lineItems - Items to order
 * @param {object} customer - Customer information
 * @returns {object} - Order details
 */
exports.createOrder = async (req, res) => {
  const { lineItems, customer } = req.body;

  if (!lineItems || !customer) {
    return res.status(400).json({
      message: 'Missing required fields: lineItems or customer.',
    });
  }

  try {
    const order = await createOrder(lineItems, customer);
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      message: 'Server error while creating order. Please try again later.',
    });
  }
};