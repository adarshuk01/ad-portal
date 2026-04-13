const { body, validationResult } = require('express-validator');
const { sendError } = require('../utils/apiResponse');

const CATEGORIES = ['Technology','Fashion','Food & Beverage','Health & Wellness','Real Estate','Education','Travel','Finance','Entertainment','Automotive','Other'];
const AUDIENCES  = ['General Public','Young Adults (18-25)','Professionals (25-45)','Senior Citizens (55+)','Parents & Families','Students','Business Owners'];
const DURATIONS  = ['7 days','14 days','30 days','60 days','90 days'];
const PLACEMENTS = ['Homepage Banner','Sidebar Ad','Footer Ad','In-Feed Ad','Pop-up Ad'];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, errors.array()[0].msg, 422);
  }
  next();
};

// ── Rules for creating a new ad ────────────────────────────────────────────
// imageUrl is intentionally absent — the URL is set by the server after
// uploading to Cloudinary, never accepted from the client body.
const createAdRules = [
  body('title').trim().notEmpty().withMessage('Campaign title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),

  body('category').isIn(CATEGORIES).withMessage('Invalid category'),

  body('description').trim().notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),

  body('targetAudience').isIn(AUDIENCES).withMessage('Invalid target audience'),

  body('budget').isFloat({ min: 1 }).withMessage('Budget must be a positive number'),

  body('duration').isIn(DURATIONS).withMessage('Invalid duration'),

  body('placement').isIn(PLACEMENTS).withMessage('Invalid placement'),

  body('website').optional({ checkFalsy: true })
    .isURL().withMessage('Website must be a valid URL'),
];

// ── Rules for updating an existing ad ─────────────────────────────────────
// All fields are optional (user may change only some fields).
const updateAdRules = [
  body('title').optional().trim().notEmpty().withMessage('Campaign title cannot be empty')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),

  body('category').optional().isIn(CATEGORIES).withMessage('Invalid category'),

  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty')
    .isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),

  body('targetAudience').optional().isIn(AUDIENCES).withMessage('Invalid target audience'),

  body('budget').optional().isFloat({ min: 1 }).withMessage('Budget must be a positive number'),

  body('duration').optional().isIn(DURATIONS).withMessage('Invalid duration'),

  body('placement').optional().isIn(PLACEMENTS).withMessage('Invalid placement'),

  body('website').optional({ checkFalsy: true })
    .isURL().withMessage('Website must be a valid URL'),
];

// ── Rules for admin status update ─────────────────────────────────────────
const updateStatusRules = [
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
  body('adminNote').optional().trim().isLength({ max: 500 }).withMessage('Admin note max 500 chars'),
];

module.exports = { validate, createAdRules, updateAdRules, updateStatusRules };
