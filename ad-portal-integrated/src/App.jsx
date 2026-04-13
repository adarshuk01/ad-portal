import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// User pages
import UserLogin     from './pages/user/UserLogin';
import UserRegister  from './pages/user/UserRegister';
import UserDashboard from './pages/user/UserDashboard';
import ApplyAd       from './pages/user/ApplyAd';
import EditAd        from './pages/user/EditAd';

// Admin pages
import AdminLogin     from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

// Guards
import UserGuard  from './components/UserGuard';
import AdminGuard from './components/AdminGuard';

// Landing
import Landing from './pages/Landing';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing */}
          <Route path="/" element={<Landing />} />

          {/* ── User Module ── */}
          <Route path="/user/login"     element={<UserLogin />} />
          <Route path="/user/register"  element={<UserRegister />} />
          <Route path="/user/dashboard" element={<UserGuard><UserDashboard /></UserGuard>} />
          <Route path="/user/apply"     element={<UserGuard><ApplyAd /></UserGuard>} />
          <Route path="/user/edit/:id"  element={<UserGuard><EditAd /></UserGuard>} />

          {/* ── Admin Module ── */}
          <Route path="/admin/login"     element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
          <Route path="/admin"           element={<Navigate to="/admin/login" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
