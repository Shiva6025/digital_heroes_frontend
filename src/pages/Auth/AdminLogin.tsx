import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await api.post('/auth/admin-login', formData);
      login(result.user, result.token); // ← updates AuthContext state so ProtectedRoute allows access
      navigate('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at top left, rgba(99,102,241,0.12), transparent 60%), radial-gradient(ellipse at bottom right, rgba(244,63,94,0.08), transparent 60%)',
      padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '1.25rem',
            background: 'linear-gradient(135deg, rgba(244,63,94,0.2), rgba(99,102,241,0.2))',
            border: '1px solid rgba(244,63,94,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}>
            <Shield size={32} color="#f43f5e" />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            Admin <span style={{ color: '#f43f5e' }}>Portal</span>
          </h1>
          <p className="text-muted" style={{ fontSize: '0.95rem' }}>Restricted access — authorised personnel only</p>
        </div>

        {/* Card */}
        <div className="glass" style={{ padding: '2.5rem', border: '1px solid rgba(244,63,94,0.15)' }}>
          {error && (
            <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem' }}>
              <p style={{ color: '#f43f5e', fontSize: '0.875rem', margin: 0 }}>⚠️ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Admin Email
              </label>
              <input
                type="email"
                placeholder="admin@digitalheroes.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
                style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', color: 'white', fontSize: '0.95rem', transition: 'var(--transition)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.875rem 3rem 0.875rem 1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', color: 'white', fontSize: '0.95rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  {showPassword ? <EyeOff size={18} color="var(--text-muted)" /> : <Eye size={18} color="var(--text-muted)" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '1rem', borderRadius: '0.75rem', fontWeight: 700, fontSize: '1rem', marginTop: '0.5rem',
                background: loading ? 'rgba(244,63,94,0.4)' : 'linear-gradient(135deg, #f43f5e, #dc2626)',
                color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 20px rgba(244,63,94,0.25)',
                transition: 'var(--transition)',
              }}
            >
              {loading ? 'Authenticating...' : 'Access Admin Panel'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Not an admin? <Link to="/login" style={{ color: 'var(--primary)' }}>Member Login →</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
