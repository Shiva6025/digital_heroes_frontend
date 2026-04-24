import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Trophy, LogOut, LayoutDashboard, Heart, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };

  const isActive = (path: string) => location.pathname === path;

  const navLinkStyle = (path: string): React.CSSProperties => ({
    padding: '0.5rem 0.875rem',
    borderRadius: 'var(--radius)',
    fontSize: '0.9rem',
    fontWeight: isActive(path) ? 700 : 500,
    color: isActive(path) ? 'var(--text)' : 'var(--text-muted)',
    background: isActive(path) ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
    border: isActive(path) ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid transparent',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    position: 'relative',
  });

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(2, 6, 23, 0.88)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--glass-border)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(99,102,241,0.4)',
          }}>
            <Trophy size={18} color="white" />
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }} className="gradient-text">
            Digital Heroes
          </span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>

          {/* Always visible */}
          <Link to="/charities" style={navLinkStyle('/charities')}
            onMouseEnter={e => { if (!isActive('/charities')) { (e.currentTarget as HTMLElement).style.color = 'var(--text)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; } }}
            onMouseLeave={e => { if (!isActive('/charities')) { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; } }}>
            <Heart size={15} /> Charities
          </Link>

          {isAuthenticated ? (
            <>
              {user?.role !== 'ADMIN' && (
                <Link to="/dashboard" style={navLinkStyle('/dashboard')}
                  onMouseEnter={e => { if (!isActive('/dashboard')) { (e.currentTarget as HTMLElement).style.color = 'var(--text)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; } }}
                  onMouseLeave={e => { if (!isActive('/dashboard')) { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; } }}>
                  <LayoutDashboard size={15} /> Dashboard
                </Link>
              )}

              {user?.role === 'ADMIN' && (
                <Link to="/admin" style={{
                  ...navLinkStyle('/admin'),
                  color: isActive('/admin') ? '#f43f5e' : 'rgba(244,63,94,0.75)',
                  background: isActive('/admin') ? 'rgba(244,63,94,0.1)' : 'transparent',
                  border: isActive('/admin') ? '1px solid rgba(244,63,94,0.3)' : '1px solid transparent',
                }}>
                  <ShieldCheck size={15} /> Admin
                </Link>
              )}

              {/* Divider */}
              <div style={{ width: '1px', height: '22px', background: 'var(--glass-border)', margin: '0 0.5rem' }} />

              {/* User chip + logout */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  padding: '0.3rem 0.75rem',
                  borderRadius: '9999px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--glass-border)',
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  fontWeight: 500,
                }}>
                  {user?.name?.split(' ')[0]}
                </div>
                <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.4rem 0.875rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={navLinkStyle('/login')}
                onMouseEnter={e => { if (!isActive('/login')) { (e.currentTarget as HTMLElement).style.color = 'var(--text)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; } }}
                onMouseLeave={e => { if (!isActive('/login')) { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; } }}>
                Sign In
              </Link>
              <Link to="/signup" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', marginLeft: '0.25rem' }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
