import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Landing from './pages/Landing';
import Login from './pages/Auth/Login';
import AdminLogin from './pages/Auth/AdminLogin';
import Signup from './pages/Auth/Signup';
import UserDashboard from './pages/Dashboard/UserDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import CharityExplorer from './pages/CharityExplorer';
import './index.css';

import { AuthProvider } from './context/AuthContext';

const HIDE_NAVBAR_PATHS = ['/admin/login'];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const hideNavbar = HIDE_NAVBAR_PATHS.includes(location.pathname);
  return (
    <div className="app-container">
      {!hideNavbar && <Navbar />}
      <main>{children}</main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/admin/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
            <Route path="/charities" element={<CharityExplorer />} />

            {/* Protected: Users Only */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />

            {/* Protected: Admins Only */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
