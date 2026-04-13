const User = require('../models/User.model');
const Ad   = require('../models/Ad.model');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// ─── GET /api/users — Get all users (admin) ───────────────────────────────
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const filter = { role: 'user' };

    if (search) {
      filter.$or = [
        { name : { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    return sendSuccess(res, {
      users,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/users/:id — Get single user (admin) ────────────────────────
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 'User not found.', 404);

    // Fetch the user's ads summary
    const [adsCount, pendingCount, approvedCount, rejectedCount] = await Promise.all([
      Ad.countDocuments({ user: user._id }),
      Ad.countDocuments({ user: user._id, status: 'pending' }),
      Ad.countDocuments({ user: user._id, status: 'approved' }),
      Ad.countDocuments({ user: user._id, status: 'rejected' }),
    ]);

    return sendSuccess(res, {
      user,
      adStats: { total: adsCount, pending: pendingCount, approved: approvedCount, rejected: rejectedCount },
    });
  } catch (err) {
    next(err);
  }
};

// ─── PATCH /api/users/:id/status — Activate / deactivate user (admin) ────
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 'User not found.', 404);
    if (user.role === 'admin') return sendError(res, 'Cannot modify an admin account.', 403);

    user.isActive = !user.isActive;
    await user.save({ validateModifiedOnly: true });

    return sendSuccess(
      res,
      { user },
      `User account ${user.isActive ? 'activated' : 'deactivated'} successfully.`
    );
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/users/profile — Update own profile ─────────────────────────
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true, runValidators: true }
    );

    return sendSuccess(res, { user }, 'Profile updated successfully.');
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /api/users/:id — Delete user (admin) ─────────────────────────
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 'User not found.', 404);
    if (user.role === 'admin') return sendError(res, 'Cannot delete an admin account.', 403);

    // Delete all ads belonging to this user
    await Ad.deleteMany({ user: user._id });
    await user.deleteOne();

    return sendSuccess(res, {}, 'User and all associated ads deleted.');
  } catch (err) {
    next(err);
  }
};
