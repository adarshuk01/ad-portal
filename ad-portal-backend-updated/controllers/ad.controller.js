const Ad         = require('../models/Ad.model');
const cloudinary = require('../config/cloudinary');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// ─── Cloudinary helper ────────────────────────────────────────────────────
// Converts the multer in-memory buffer to a base64 data URI and uploads it.
// Returns the Cloudinary result object (secure_url, public_id, …).
const uploadToCloudinary = (file) => {
  const b64     = file.buffer.toString('base64');
  const dataUri = `data:${file.mimetype};base64,${b64}`;

  return cloudinary.uploader.upload(dataUri, {
    folder       : 'ad-banners',
    resource_type: 'image',
    // Enforce the recommended banner dimensions on the Cloudinary side
    transformation: [{ width: 1792, height: 512, crop: 'fill', gravity: 'auto' }],
  });
};

// Silently delete an asset from Cloudinary — failures are logged but never bubble up
const destroyFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('[Cloudinary] Failed to delete asset:', publicId, err.message);
  }
};

// ─── Helper: build filter query ───────────────────────────────────────────
const buildFilter = (query, extraFilter = {}) => {
  const filter = { ...extraFilter };
  if (query.status)   filter.status   = query.status;
  if (query.category) filter.category = query.category;
  return filter;
};

// ─── POST /api/ads — Create an ad (user) ──────────────────────────────────
exports.createAd = async (req, res, next) => {
  try {
    const adData = { ...req.body, user: req.user._id };

    // If an image file was uploaded, push it to Cloudinary first
    if (req.file) {
      const result       = await uploadToCloudinary(req.file);
      adData.imageUrl    = result.secure_url;
      adData.imagePublicId = result.public_id;
    }

    const ad        = await Ad.create(adData);
    const populated = await ad.populate('user', 'name email phone');
    return sendSuccess(res, { ad: populated }, 'Ad submitted successfully! Awaiting review.', 201);
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/ads/:id — Update a pending ad (owner only) ─────────────────
exports.updateAd = async (req, res, next) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return sendError(res, 'Ad not found.', 404);

    // Only the owner can edit
    if (ad.user.toString() !== req.user._id.toString()) {
      return sendError(res, 'Not authorised to edit this ad.', 403);
    }

    // Only pending ads can be edited
    if (ad.status !== 'pending') {
      return sendError(res, 'Only pending ads can be edited.', 400);
    }

    

    // If a new image was uploaded, replace the old one in Cloudinary
    if (req.file) {
      const oldPublicId = ad.imagePublicId;           // save before overwrite
      const result      = await uploadToCloudinary(req.file);
      ad.imageUrl       = result.secure_url;
      ad.imagePublicId  = result.public_id;
      await destroyFromCloudinary(oldPublicId);        // clean up old asset
    }

    // Apply the rest of the text fields (whitelist to avoid overwriting status/user/etc.)
    const allowed = ['title', 'category', 'description', 'targetAudience',
                     'budget', 'duration', 'placement', 'website'];
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) ad[key] = req.body[key];
    });

    await ad.save();
    await ad.populate('user', 'name email phone');
    return sendSuccess(res, { ad }, 'Ad updated successfully.');
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/ads/my — Get logged-in user's ads ───────────────────────────
exports.getMyAds = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, category } = req.query;
    const filter = buildFilter({ status, category }, { user: req.user._id });

    const [ads, total] = await Promise.all([
      Ad.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate('user', 'name email'),
      Ad.countDocuments(filter),
    ]);

    return sendSuccess(res, {
      ads,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/ads/:id — Get single ad ────────────────────────────────────
exports.getAdById = async (req, res, next) => {
  try {
    const ad = await Ad.findById(req.params.id).populate('user', 'name email phone');
    if (!ad) return sendError(res, 'Ad not found.', 404);

    if (req.user.role === 'user' && ad.user._id.toString() !== req.user._id.toString()) {
      return sendError(res, 'Not authorised to view this ad.', 403);
    }

    return sendSuccess(res, { ad });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/ads — Get all ads (admin) ─────────────────────────────────
exports.getAllAds = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, category, search } = req.query;
    const filter = buildFilter({ status, category });

    if (search) {
      filter.$or = [
        { title      : { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const [ads, total] = await Promise.all([
      Ad.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate('user', 'name email phone'),
      Ad.countDocuments(filter),
    ]);

    const [pendingCount, approvedCount, rejectedCount] = await Promise.all([
      Ad.countDocuments({ status: 'pending' }),
      Ad.countDocuments({ status: 'approved' }),
      Ad.countDocuments({ status: 'rejected' }),
    ]);

    return sendSuccess(res, {
      ads,
      stats: { pending: pendingCount, approved: approvedCount, rejected: rejectedCount, total: await Ad.countDocuments() },
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

// ─── PATCH /api/ads/:id/status — Approve or reject (admin) ───────────────
exports.updateAdStatus = async (req, res, next) => {
  try {
    const { status, adminNote } = req.body;
    const ad = await Ad.findById(req.params.id);
    if (!ad) return sendError(res, 'Ad not found.', 404);

    ad.status    = status;
    ad.adminNote = adminNote || '';
    await ad.save();
    await ad.populate('user', 'name email');

    return sendSuccess(res, { ad }, `Ad ${status} successfully.`);
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /api/ads/:id — Delete ad (admin or owner) ────────────────────
exports.deleteAd = async (req, res, next) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return sendError(res, 'Ad not found.', 404);

    if (req.user.role !== 'admin' && ad.user.toString() !== req.user._id.toString()) {
      return sendError(res, 'Not authorised to delete this ad.', 403);
    }

    // Remove the image from Cloudinary before deleting the document
    await destroyFromCloudinary(ad.imagePublicId);

    await ad.deleteOne();
    return sendSuccess(res, {}, 'Ad deleted successfully.');
  } catch (err) {
    next(err);
  }
};
