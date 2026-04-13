const express = require('express');
const router  = express.Router();

const {
  createAd,
  updateAd,
  getMyAds,
  getAdById,
  getAllAds,
  updateAdStatus,
  deleteAd,
} = require('../controllers/ad.controller');

const { protect, adminOnly, userOnly } = require('../middleware/auth.middleware');
const { createAdRules, updateAdRules, updateStatusRules, validate } = require('../validators/ad.validator');
const upload = require('../middleware/upload.middleware');

// ── User routes ────────────────────────────────────────────────────────────
// POST   /api/ads          — submit a new ad (image optional)
router.post(
  '/',
  protect,
  userOnly,
  upload.single('image'),   // multer parses multipart; field name must be "image"
  createAdRules,
  validate,
  createAd
);

// GET    /api/ads/my       — user's own ads
router.get('/my', protect, userOnly, getMyAds);

// PUT    /api/ads/:id      — edit a pending ad (image replacement optional)
router.put(
  '/:id',
  protect,
  userOnly,
  upload.single('image'),
  updateAdRules,
  validate,
  updateAd
);

// ── Admin routes ───────────────────────────────────────────────────────────
// GET    /api/ads          — all ads with filters & stats
router.get('/', protect, adminOnly, getAllAds);

// PATCH  /api/ads/:id/status — approve or reject
router.patch('/:id/status', protect, adminOnly, updateStatusRules, validate, updateAdStatus);

// ── Shared routes ──────────────────────────────────────────────────────────
// GET    /api/ads/:id      — single ad (owner or admin)
router.get('/:id', protect, getAdById);

// DELETE /api/ads/:id      — admin or owner
router.delete('/:id', protect, deleteAd);

module.exports = router;
