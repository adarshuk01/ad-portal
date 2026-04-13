const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('⚡ Using existing DB connection');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    isConnected = conn.connection.readyState === 1;

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);

    // Seed only once
    if (isConnected) {
      await require('../utils/seed')();
    }

  } catch (err) {
    console.error(`❌ MongoDB error: ${err.message}`);
    throw err; // ❌ DO NOT process.exit
  }
};

module.exports = connectDB;