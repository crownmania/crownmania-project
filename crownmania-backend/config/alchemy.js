// config/alchemy.js
const { Alchemy } = require('alchemy-sdk');

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: 'matic-mainnet',
};

const alchemy = new Alchemy(settings);

module.exports = alchemy;