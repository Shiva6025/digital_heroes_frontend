import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Trophy, Eye, EyeOff } from 'lucide-react';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', charityId: '' });
  const [charities, setCharities] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    api.get('/charities').then(setCharities).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.charityId) { setError('Please select a charity to support'); return; }
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/signup', formData);
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '90vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at center top, rgba(16,185,129,0.08), transparent 60%)',
      padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Trophy size={32} color="#818cf8" />
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }} className="gradient-text">DIGITAL HEROES</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Join the Mission</h1>
          <p className="text-muted">Create your account and start making an impact</p>
        </div>

        <div className="glass" style={{ padding: '2.5rem' }}>
          {error && (
            <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem' }}>
              <p style={{ color: '#f43f5e', fontSize: '0.875rem', margin: 0 }}>⚠️ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
            {/* Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</label>
              <input type="text" placeholder="John Smith" value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })} required
                style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', color: 'white', fontSize: '0.95rem' }} />
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</label>
              <input type="email" placeholder="your@email.com" value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })} required
                style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', color: 'white', fontSize: '0.95rem' }} />
            </div>

            {/* Phone */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone <span style={{ color: 'rgba(255,255,255,0.3)', textTransform: 'lowercase' }}>(optional)</span></label>
              <input type="tel" placeholder="+44 7700 000000" value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', color: 'white', fontSize: '0.95rem' }} />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} placeholder="Create a strong password" value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })} required
                  style={{ width: '100%', padding: '0.875rem 3rem 0.875rem 1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', color: 'white', fontSize: '0.95rem' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  {showPassword ? <EyeOff size={18} color="var(--text-muted)" /> : <Eye size={18} color="var(--text-muted)" />}
                </button>
              </div>
            </div>

            {/* Charity Selection */}
            <div>
              <label className="input-label">Choose Your Charity</label>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.875rem', lineHeight: 1.5 }}>
                10% of your monthly subscription goes directly to your chosen cause
              </p>
              <div style={{ display: 'grid', gap: '0.625rem', maxHeight: '220px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                {charities.length === 0 ? (
                  <div style={{ display: 'flex', gap: '0.625rem', flexDirection: 'column' }}>
                    {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '60px', borderRadius: 'var(--radius)' }} />)}
                  </div>
                ) : charities.map(c => {
                  const selected = formData.charityId === c.id;
                  return (
                    <div key={c.id}
                      onClick={() => setFormData({ ...formData, charityId: c.id })}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.875rem 1rem',
                        borderRadius: 'var(--radius)',
                        border: `1px solid ${selected ? 'rgba(99,102,241,0.5)' : 'var(--glass-border)'}`,
                        background: selected ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.02)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: selected ? '0 0 0 1px rgba(99,102,241,0.2)' : 'none',
                      }}
                      onMouseEnter={e => { if (!selected) { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; } }}
                      onMouseLeave={e => { if (!selected) { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)'; } }}
                    >
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.15rem', color: selected ? 'white' : 'var(--text)' }}>{c.name}</p>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>{c.category || 'General'}</p>
                      </div>
                      <div style={{
                        width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: selected ? 'var(--primary)' : 'transparent',
                        border: `2px solid ${selected ? 'var(--primary)' : 'var(--glass-border)'}`,
                        transition: 'all 0.2s ease',
                      }}>
                        {selected && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Subscription note */}
            <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--primary)', margin: 0 }}>
                💳 <strong>£10/month</strong> subscription. First month starts today. You may cancel anytime during the 3-day grace period.
              </p>
            </div>

            <button type="submit" disabled={loading} className="btn-primary"
              style={{ width: '100%', padding: '1rem', fontSize: '1rem', marginTop: '0.5rem', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Creating account...' : 'Become a Digital Hero'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
              Already a member? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
