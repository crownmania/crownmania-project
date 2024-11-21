const mongoose = require('mongoose');
const Collectible = require('./models/Collectible');
require('dotenv').config();

const data = require('./collectibles.json'); // Your data file

/**
 * Script to import collectible data into MongoDB
 */
const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Optional: Clear existing data
    await Collectible.deleteMany();

    // Insert new data
    await Collectible.insertMany(data);
    console.log('Data Imported Successfully');
    process.exit();
  } catch (error) {
    console.error('Data Import Failed:', error.message);
    process.exit(1);
  }
};

importData();