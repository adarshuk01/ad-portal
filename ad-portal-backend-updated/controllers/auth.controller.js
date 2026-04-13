const User          = require('../models/User.model');
const generateToken = require('../utils/generateToken');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// ─── POST /api/auth/register ───────────────────────────────────────────────
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return sendError(res, 'Email is already registered.', 409);

    const user  = await User.create({ name, email, password, phone });
    const token = generateToken(user._id, user.role);

    return sendSuccess(
      res,
      { token, user },
      'Registration successful! Welcome to Ad Portal.',
      201
    );
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/auth/login ──────────────────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Include password for comparison (select: false on schema)
    const user = await User.findOne({ email }).select('+password');
    if (!user) return sendError(res, 'Invalid email or password.', 401);
    if (!user.isActive) return sendError(res, 'Your account has been deactivated.', 403);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return sendError(res, 'Invalid email or password.', 401);

    user.lastLogin = new Date();
    await user.save({ validateModifiedOnly: true });

    const token = generateToken(user._id, user.role);

    return sendSuccess(res, { token, user }, 'Login successful.');
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/auth/me ──────────────────────────────────────────────────────
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return sendSuccess(res, { user });
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/auth/change-password ────────────────────────────────────────
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return sendError(res, 'Current password is incorrect.', 400);

    user.password = newPassword;
    await user.save();

    return sendSuccess(res, {}, 'Password updated successfully.');
  } catch (err) {
    next(err);
  }
};
