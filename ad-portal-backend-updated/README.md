# Ad Portal — Backend API

> Node.js · Express · MongoDB · JWT Auth

---

## Folder Structure

```
ad-portal-backend/
├── config/
│   └── db.js                  # MongoDB connection + auto-seed
├── controllers/
│   ├── auth.controller.js     # register, login, getMe, changePassword
│   ├── ad.controller.js       # CRUD for ads + admin status update
│   └── user.controller.js     # admin user management + profile update
├── middleware/
│   ├── auth.middleware.js     # protect, adminOnly, userOnly guards
│   └── error.middleware.js    # 404 handler + global error handler
├── models/
│   ├── User.model.js          # User schema (bcrypt, role, isActive)
│   └── Ad.model.js            # Ad schema (status, indexes)
├── routes/
│   ├── auth.routes.js         # /api/auth/*
│   ├── ad.routes.js           # /api/ads/*
│   └── user.routes.js         # /api/users/*
├── utils/
│   ├── apiResponse.js         # sendSuccess / sendError helpers
│   ├── generateToken.js       # JWT signing
│   └── seed.js                # Admin account auto-seed
├── validators/
│   ├── auth.validator.js      # express-validator rules for auth
│   └── ad.validator.js        # express-validator rules for ads
├── .env.example
├── .gitignore
├── app.js                     # Express app (middleware + routes)
├── package.json
└── server.js                  # Entry point (DB connect → listen)
```

---

## Getting Started

### 1 — Prerequisites
- Node.js ≥ 18
- MongoDB running locally **or** a MongoDB Atlas connection string

### 2 — Install
```bash
cd ad-portal-backend
npm install
```

### 3 — Environment
```bash
cp .env.example .env
# Edit .env with your values
```

| Variable          | Default                              | Description                  |
|-------------------|--------------------------------------|------------------------------|
| `PORT`            | `5000`                               | HTTP port                    |
| `NODE_ENV`        | `development`                        | `development` / `production` |
| `MONGO_URI`       | `mongodb://localhost:27017/ad-portal`| MongoDB connection string    |
| `JWT_SECRET`      | *(required)*                         | Strong random secret         |
| `JWT_EXPIRES_IN`  | `7d`                                 | Token lifetime               |
| `ADMIN_EMAIL`     | `admin@adportal.com`                 | Seeded admin email           |
| `ADMIN_PASSWORD`  | `admin123`                           | Seeded admin password        |
| `CLIENT_URL`      | `http://localhost:5173`              | Frontend origin for CORS     |

### 4 — Run
```bash
npm run dev    # development (nodemon)
npm start      # production
```

The admin account is seeded automatically on first boot.

---

## API Reference

All endpoints return JSON in this shape:
```json
{ "success": true,  "message": "...", /* data fields */ }
{ "success": false, "message": "Error description" }
```

Authenticated endpoints require:
```
Authorization: Bearer <token>
```

---

### Auth  `/api/auth`

| Method | Endpoint                  | Auth     | Description              |
|--------|---------------------------|----------|--------------------------|
| POST   | `/register`               | Public   | Create user account      |
| POST   | `/login`                  | Public   | Login (user or admin)    |
| GET    | `/me`                     | Any user | Get own profile          |
| PUT    | `/change-password`        | Any user | Update password          |

#### POST `/api/auth/register`
```json
// Request body
{
  "name":     "Arun Kumar",
  "email":    "arun@example.com",
  "password": "secret123",
  "phone":    "9876543210"      // optional
}

// 201 Response
{
  "success": true,
  "message": "Registration successful! Welcome to Ad Portal.",
  "token":   "<JWT>",
  "user":    { "_id": "...", "name": "Arun Kumar", "email": "...", "role": "user" }
}
```

#### POST `/api/auth/login`
```json
// Request body
{ "email": "arun@example.com", "password": "secret123" }

// 200 Response
{
  "success": true,
  "message": "Login successful.",
  "token":   "<JWT>",
  "user":    { "_id": "...", "name": "Arun Kumar", "role": "user" }
}
```

#### PUT `/api/auth/change-password`
```json
// Request body
{ "currentPassword": "secret123", "newPassword": "newSecret456" }
```

---

### Ads  `/api/ads`

| Method | Endpoint          | Auth        | Description                        |
|--------|-------------------|-------------|------------------------------------|
| POST   | `/`               | User only   | Submit a new ad                    |
| GET    | `/my`             | User only   | Get own ads (paginated + filtered) |
| GET    | `/`               | Admin only  | Get all ads + stats                |
| GET    | `/:id`            | Owner/Admin | Get single ad detail               |
| PATCH  | `/:id/status`     | Admin only  | Approve or reject an ad            |
| DELETE | `/:id`            | Owner/Admin | Delete an ad                       |

#### POST `/api/ads`
```json
// Request body
{
  "title":          "Summer Sale 2025",
  "category":       "Fashion",
  "description":    "Upto 50% off on all summer wear...",
  "targetAudience": "Young Adults (18-25)",
  "budget":         5000,
  "duration":       "30 days",
  "placement":      "Homepage Banner",
  "imageUrl":       "https://example.com/banner.jpg",   // optional
  "website":        "https://mystore.com"                // optional
}
```

#### GET `/api/ads/my?page=1&limit=10&status=pending&category=Fashion`
```json
{
  "ads": [ /* Ad objects */ ],
  "pagination": { "total": 12, "page": 1, "limit": 10, "pages": 2 }
}
```

#### GET `/api/ads?page=1&limit=10&status=pending&search=summer` *(admin)*
```json
{
  "ads": [ /* Ad objects with populated user */ ],
  "stats": { "pending": 5, "approved": 20, "rejected": 3, "total": 28 },
  "pagination": { "total": 5, "page": 1, "limit": 10, "pages": 1 }
}
```

#### PATCH `/api/ads/:id/status` *(admin)*
```json
// Request body
{ "status": "approved", "adminNote": "Looks good!" }
// status must be "approved" or "rejected"
```

---

### Users  `/api/users`

| Method | Endpoint          | Auth       | Description                      |
|--------|-------------------|------------|----------------------------------|
| PUT    | `/profile`        | Any user   | Update own name / phone          |
| GET    | `/`               | Admin only | List all users (paginated)       |
| GET    | `/:id`            | Admin only | Get user + ad stats              |
| PATCH  | `/:id/status`     | Admin only | Toggle active / deactivated      |
| DELETE | `/:id`            | Admin only | Delete user + all their ads      |

#### GET `/api/users?page=1&limit=10&search=arun` *(admin)*
```json
{
  "users": [ /* User objects */ ],
  "pagination": { "total": 50, "page": 1, "limit": 10, "pages": 5 }
}
```

#### GET `/api/users/:id` *(admin)*
```json
{
  "user":    { /* User object */ },
  "adStats": { "total": 5, "pending": 2, "approved": 2, "rejected": 1 }
}
```

---

## Frontend Integration

Replace `store.js` mock calls with real API calls. Example using `fetch`:

```js
// utils/api.js
const BASE = 'http://localhost:5000/api';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
});

export const api = {
  // Auth
  register : (data) => fetch(`${BASE}/auth/register`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) }).then(r => r.json()),
  login    : (data) => fetch(`${BASE}/auth/login`,    { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) }).then(r => r.json()),

  // Ads
  createAd       : (data) => fetch(`${BASE}/ads`,             { method:'POST',  headers: authHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  getMyAds       : (q='') => fetch(`${BASE}/ads/my${q}`,      { headers: authHeaders() }).then(r => r.json()),
  getAllAds       : (q='') => fetch(`${BASE}/ads${q}`,         { headers: authHeaders() }).then(r => r.json()),
  updateAdStatus : (id, data) => fetch(`${BASE}/ads/${id}/status`, { method:'PATCH', headers: authHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  deleteAd       : (id) => fetch(`${BASE}/ads/${id}`,         { method:'DELETE', headers: authHeaders() }).then(r => r.json()),
};
```

---

## Security Features

- **Helmet** — sets secure HTTP headers
- **CORS** — locked to `CLIENT_URL`
- **Rate limiting** — 100 req/15 min globally; 20 req/10 min on auth
- **bcryptjs** — passwords hashed with salt rounds 12
- **JWT** — signed tokens, configurable expiry
- **express-validator** — all inputs validated before hitting controllers
- **Role-based guards** — `protect`, `adminOnly`, `userOnly` middleware
- **Global error handler** — Mongoose errors normalised, no stack traces leaked in production
