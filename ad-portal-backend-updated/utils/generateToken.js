const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT for a user
 * @param {string} id  - Mongoose User _id
 * @param {string} role - 'user' | 'admin'
 */
const generateToken = (id, role) =>
  jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

module.exports = generateToken;
