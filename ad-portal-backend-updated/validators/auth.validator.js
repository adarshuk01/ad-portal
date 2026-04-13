const { body, validationResult } = require('express-validator');
const { sendError } = require('../utils/apiResponse');

// Middleware to collect validation errors and short-circuit
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, errors.array()[0].msg, 422);
  }
  next();
};

const registerRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 60 }).withMessage('Name must be 2-60 characters'),

  body('email')
    .trim()
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  body('phone')
    .optional()
    .matches(/^[0-9+\-\s]{7,15}$/).withMessage('Please enter a valid phone number'),
];

const loginRules = [
  body('email').trim().isEmail().withMessage('Please enter a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = { validate, registerRules, loginRules };
