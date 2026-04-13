const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const morgan       = require('morgan');
const rateLimit    = require('express-rate-limit');

const authRoutes   = require('./routes/auth.routes');
const adRoutes     = require('./routes/ad.routes');
const userRoutes   = require('./routes/user.routes');
const { notFound, errorHandler } = require('./middleware/error.middleware');

const app = express();

// ── Security ───────────────────────────────────────────────────────────────
app.use(helmet());

app.use(cors({
  origin     : process.env.CLIENT_URL || 'https://ad-portal-neon.vercel.app',
  credentials: true,
}));

// Global rate limiter — 100 req / 15 min per IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max     : 100,
  message : { success: false, message: 'Too many requests, please try again later.' },
}));

// Stricter limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max     : 20,
  message : { success: false, message: 'Too many login attempts, please wait 10 minutes.' },
});

// ── Body parsers ───────────────────────────────────────────────────────────
// Note: multipart/form-data (file uploads) is handled by multer in each route,
// so express.json() and urlencoded() only need to cover JSON & plain form posts.
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── Health check ───────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) =>
  res.json({ success: true, message: 'Ad Portal API is running 🎯' })
);

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/ads',   adRoutes);
app.use('/api/users', userRoutes);

// ── Error Handlers ─────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
