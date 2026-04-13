const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type     : String,
      required : [true, 'Name is required'],
      trim     : true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name must not exceed 60 characters'],
    },
    email: {
      type     : String,
      required : [true, 'Email is required'],
      unique   : true,
      lowercase: true,
      trim     : true,
      match    : [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type     : String,
      required : [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select   : false,   // never returned by default
    },
    phone: {
      type : String,
      trim : true,
      match: [/^[0-9+\-\s]{7,15}$/, 'Please enter a valid phone number'],
    },
    role: {
      type   : String,
      enum   : ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type   : Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,   // adds createdAt, updatedAt
    toJSON    : {
      transform(_, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ── Pre-save: hash password ────────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance method: compare password ────────────────────────────────────
userSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
