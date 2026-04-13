import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UserGuard({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/user/login" replace />;
  if (user.role !== 'user') return <Navigate to="/admin/dashboard" replace />;
  return children;
}
