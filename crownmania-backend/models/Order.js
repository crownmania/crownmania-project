// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  shopifyOrderId: { type: String, unique: true },
  customerEmail: { type: String },
  items: { type: Array },
  fulfilled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);