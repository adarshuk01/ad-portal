# AdPortal — Advertisement Management Platform

A full-stack-ready React Vite web app with two separate modules: **User** and **Admin**.

---

## 🚀 Tech Stack

| Tool | Purpose |
|---|---|
| **React 18 + Vite** | Framework & build tool |
| **React Router v6** | Client-side routing |
| **Tailwind CSS** | Utility-first styling |
| **react-icons** | Icon library (Remix Icons) |
| **localStorage** | Persistent mock data store |

---

## 📁 Project Structure

```
src/
├── App.jsx                      # Root router
├── main.jsx                     # Entry point
├── index.css                    # Tailwind + global styles
├── store.js                     # localStorage data layer
├── context/
│   └── AuthContext.jsx          # Auth state & session
├── components/
│   ├── UserGuard.jsx            # Protect user routes
│   └── AdminGuard.jsx           # Protect admin routes
└── pages/
    ├── Landing.jsx              # Home page
    ├── user/
    │   ├── UserLogin.jsx        # User sign in
    │   ├── UserRegister.jsx     # User registration
    │   ├── UserDashboard.jsx    # User's ad overview
    │   └── ApplyAd.jsx          # 2-step ad application form
    └── admin/
        ├── AdminLogin.jsx       # Admin sign in
        └── AdminDashboard.jsx   # View, approve, reject ads
```

---

## ⚙️ Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
http://localhost:5173
```

---

## 🔐 Routes & Credentials

### User Module — `/user`
| Route | Description |
|---|---|
| `/user/register` | Create a new account |
| `/user/login` | Sign in |
| `/user/dashboard` | View submitted ads & status |
| `/user/apply` | 2-step form to submit a new ad |

### Admin Module — `/admin`
| Route | Description |
|---|---|
| `/admin/login` | Admin sign in |
| `/admin/dashboard` | View all ads, approve/reject |

**Default Admin Credentials:**
```
Email:    admin@adportal.com
Password: admin123
```

---

## ✨ Features

### User
- Register with name, email, phone, password
- Login / Logout with session management
- 2-step ad application form (campaign details + budget/placement)
- Dashboard showing all submitted ads with status badges
- Real-time status: Pending / Approved / Rejected

### Admin
- Secure admin login (separate from user login)
- Full ad review dashboard (dark theme)
- Sidebar with navigation & stats
- Search ads by title, username, or category
- Filter by status: All / Pending / Approved / Rejected
- Quick approve/reject from the table row
- Click to open a detail modal with full ad info
- Reset approved/rejected ads back to pending

---

## 🎨 Design

- **User portal**: Clean light theme — Cormorant Garamond display font + DM Sans
- **Admin portal**: Dark slate/charcoal theme with brand-green accents
- Smooth page animations (`fade-in`, `slide-up`)
- Responsive across mobile, tablet, and desktop

---

## 📦 Build for Production

```bash
npm run build
npm run preview
```
