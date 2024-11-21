// config/shopify.js
const Shopify = require('shopify-api-node');

exports.shopify = new Shopify({
  shopName: process.env.SHOPIFY_STORE_DOMAIN,
  apiKey: process.env.SHOPIFY_API_KEY,
  password: process.env.SHOPIFY_ACCESS_TOKEN,
});