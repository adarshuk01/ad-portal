const mongoose = require('mongoose');

const CATEGORIES = [
  'Technology', 'Fashion', 'Food & Beverage', 'Health & Wellness',
  'Real Estate', 'Education', 'Travel', 'Finance', 'Entertainment',
  'Automotive', 'Other',
];

const AUDIENCES = [
  'General Public', 'Young Adults (18-25)', 'Professionals (25-45)',
  'Senior Citizens (55+)', 'Parents & Families', 'Students', 'Business Owners',
];

const DURATIONS  = ['7 days', '14 days', '30 days', '60 days', '90 days'];
const PLACEMENTS = ['In Instagram Reels'];

const adSchema = new mongoose.Schema(
  {
    // ── Campaign info ──────────────────────────────────────────────────────
    title: {
      type     : String,
      required : [true, 'Campaign title is required'],
      trim     : true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title must not exceed 100 characters'],
    },
    category: {
      type    : String,
      required: [true, 'Category is required'],
      enum    : { values: CATEGORIES, message: '{VALUE} is not a valid category' },
    },
    description: {
      type     : String,
      required : [true, 'Description is required'],
      trim     : true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1000, 'Description must not exceed 1000 characters'],
    },
    targetAudience: {
      type    : String,
      required: [true, 'Target audience is required'],
      enum    : { values: AUDIENCES, message: '{VALUE} is not a valid audience' },
    },

    // ── Budget & schedule ──────────────────────────────────────────────────
    budget: {
      type    : Number,
      required: [true, 'Budget is required'],
      min     : [1, 'Budget must be at least ₹1'],
    },
    duration: {
      type    : String,
      required: [true, 'Duration is required'],
      enum    : { values: DURATIONS, message: '{VALUE} is not a valid duration' },
    },

    // ── Placement & assets ─────────────────────────────────────────────────
    placement: {
      type    : String,
      required: [true, 'Ad placement is required'],
      enum    : { values: PLACEMENTS, message: '{VALUE} is not a valid placement' },
    },

    // Cloudinary-hosted image — set by server after upload, never by client
    imageUrl: {
      type: String,
      trim: true,
    },
    // Stored so we can destroy the old asset when the image is replaced or ad is deleted
    imagePublicId: {
      type: String,
      trim: true,
    },

    website: {
      type : String,
      trim : true,
      match: [/^https?:\/\/.+/, 'Website must be a valid URL'],
    },

    // ── Status ─────────────────────────────────────────────────────────────
    status: {
      type   : String,
      enum   : ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    adminNote: {
      type   : String,
      trim   : true,
      default: '',
    },

    // ── Relations ──────────────────────────────────────────────────────────
    user: {
      type    : mongoose.Schema.Types.ObjectId,
      ref     : 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_, ret) {
        delete ret.__v;
        delete ret.imagePublicId; // never expose Cloudinary internals to clients
        return ret;
      },
    },
  }
);

// ── Indexes ────────────────────────────────────────────────────────────────
adSchema.index({ user: 1 });
adSchema.index({ status: 1 });
adSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Ad', adSchema);
