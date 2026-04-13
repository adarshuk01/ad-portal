const jwt  = require('jsonwebtoken');
const User = require('../models/User.model');
const { sendError } = require('../utils/apiResponse');

/**
 * protect — verifies JWT and attaches req.user
 */
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Not authorised — no token', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) return sendError(res, 'User not found', 401);
    if (!req.user.isActive) return sendError(res, 'Account is deactivated', 403);

    next();
  } catch (err) {
    const msg = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    return sendError(res, msg, 401);
  }
};

/**
 * adminOnly — must come AFTER protect
 */
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return sendError(res, 'Access denied — admins only', 403);
  }
  next();
};

/**
 * userOnly — must come AFTER protect
 */
const userOnly = (req, res, next) => {
  if (req.user?.role !== 'user') {
    return sendError(res, 'Access denied — users only', 403);
  }
  next();
};

module.exports = { protect, adminOnly, userOnly };
