const express = require('express');
const router  = express.Router();

const {
  getAllUsers,
  getUserById,
  toggleUserStatus,
  updateProfile,
  deleteUser,
} = require('../controllers/user.controller');

const { protect, adminOnly } = require('../middleware/auth.middleware');

// ── Own profile (any authenticated user) ──────────────────────────────────
router.put('/profile', protect, updateProfile);

// ── Admin only ─────────────────────────────────────────────────────────────
router.get('/',              protect, adminOnly, getAllUsers);
router.get('/:id',           protect, adminOnly, getUserById);
router.patch('/:id/status',  protect, adminOnly, toggleUserStatus);
router.delete('/:id',        protect, adminOnly, deleteUser);

module.exports = router;
