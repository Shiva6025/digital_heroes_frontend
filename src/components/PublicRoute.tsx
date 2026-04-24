import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PublicRoute — wraps Login, Signup, AdminLogin.
 * If a user is already authenticated, redirect them to the right place:
 *   - ADMIN  → /admin
 *   - USER   → /dashboard
 */
const PublicRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({
  children,
}) => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    // Admin visiting /admin/login → send to admin panel
    // Admin visiting /login or /signup → send to admin panel
    if (user?.role === 'ADMIN') return <Navigate to="/admin" replace />;
    // Regular user visiting any auth page → send to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
