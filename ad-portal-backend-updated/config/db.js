const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Mongoose 8+ no longer needs deprecated options
    });

    console.log(`✅  MongoDB connected: ${conn.connection.host}`);

    // Seed the admin account on first connect
    await require('../utils/seed')();
  } catch (err) {
    console.error(`❌  MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('📴  MongoDB connection closed (app terminated).');
  process.exit(0);
});

module.exports = connectDB;
