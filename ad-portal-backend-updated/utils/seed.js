const User = require('../models/User.model');

/**
 * Creates the admin account if it doesn't already exist.
 * Called once after MongoDB connects.
 */
const seed = async () => {
  const email = process.env.ADMIN_EMAIL || 'admin@adportal.com';
  const exists = await User.findOne({ email });

  if (exists) return;

  await User.create({
    name    : 'Admin',
    email,
    password: process.env.ADMIN_PASSWORD || 'admin123',
    role    : 'admin',
  });

  console.log(`🌱  Admin user seeded → ${email}`);
};

module.exports = seed;
