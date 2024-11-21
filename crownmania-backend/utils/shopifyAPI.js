// utils/shopifyAPI.js
const axios = require('axios');

// Create a Shopify API client
const shopifyAPI = axios.create({
  baseURL: `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2023-10`,
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': process.env.SHOPIFY_API_ACCESS_TOKEN,
  },
});

/**
 * Fetch products from Shopify
 */
exports.fetchProducts = async () => {
  try {
    const response = await shopifyAPI.get('/products.json');
    return response.data.products;
  } catch (error) {
    console.error('Error fetching products:', error.response?.data || error.message);
    throw new Error('Error fetching products from Shopify.');
  }
};

/**
 * Create an order in Shopify
 * @param {Array} lineItems - Array of items to include in the order
 * @param {Object} customer - Customer details
 */
exports.createOrder = async (lineItems, customer) => {
  try {
    const response = await shopifyAPI.post('/orders.json', {
      order: {
        line_items: lineItems,
        customer,
        financial_status: 'paid', // Automatically mark as paid
      },
    });
    return response.data.order;
  } catch (error) {
    console.error('Error creating order:', error.response?.data || error.message);
    throw new Error('Error creating order in Shopify.');
  }
};