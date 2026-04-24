import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { TrendingUp, TrendingDown, Minus, Trophy, Target, Bell, Heart, Upload, X, Check, Edit2, Trash2, Calendar } from 'lucide-react';

const UserDashboard: React.FC = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<any>(authUser);
  const [scores, setScores] = useState<any[]>([]);
  const [trend, setTrend] = useState<any>(null);
  const [wins, setWins] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [drawEntry, setDrawEntry] = useState<any>(null);
  const [newScore, setNewScore] = useState({ value: '', date: new Date().toISOString().split('T')[0], grossScore: '', course: '' });
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'performance' | 'wins' | 'impact'>('performance');
  const [showNotifs, setShowNotifs] = useState(false);
  const [editingScore, setEditingScore] = useState<any>(null);
  const [showKyc, setShowKyc] = useState<string | null>(null);
  const [kycFile, setKycFile] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [freshUser, scoreData, trendData, winsData, notifData, drawData] = await Promise.all([
        api.get('/auth/me'), api.get('/scores'), api.get('/scores/trend'),
        api.get('/my/wins'), api.get('/notifications'), api.get('/my/draw-entry'),
      ]);
      setUser(freshUser); setScores(scoreData); setTrend(trendData);
      setWins(winsData); setNotifications(notifData); setDrawEntry(drawData);
    } catch (err) { console.error(err); }
  };

  const handleAddScore = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    try {
      await api.post('/scores', { value: parseInt(newScore.value), date: newScore.date, grossScore: newScore.grossScore ? parseInt(newScore.grossScore) : undefined, course: newScore.course || undefined });
      setNewScore({ value: '', date: new Date().toISOString().split('T')[0], grossScore: '', course: '' });
      fetchAll();
    } catch (err: any) { setError(err.message); }
  };

  const handleEditScore = async (e: React.FormEvent) => {
    e.preventDefault(); if (!editingScore) return;
    try {
      await api.patch(`/scores/${editingScore.id}`, { value: parseInt(editingScore.value), grossScore: editingScore.grossScore ? parseInt(editingScore.grossScore) : undefined, course: editingScore.course });
      setEditingScore(null); fetchAll();
    } catch (err: any) { setError(err.message); }
  };

  const handleDeleteScore = async (id: string) => {
    if (!confirm('Delete this score?')) return;
    try { await api.delete(`/scores/${id}`); fetchAll(); } catch (err: any) { setError(err.message); }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const statusColor: Record<string, string> = { ACTIVE: 'var(--secondary-light)', OVERDUE: '#fbbf24', CANCELLED: 'var(--accent)' };
  const trendIcon = trend?.trend === 'improving' ? <TrendingUp size={18} color="var(--secondary)" /> : trend?.trend === 'declining' ? <TrendingDown size={18} color="var(--accent)" /> : <Minus size={18} color="var(--text-muted)" />;

  return (
    <div style={{ background: 'radial-gradient(ellipse at 30% 0%, rgba(99,102,241,0.08) 0%, transparent 60%)', minHeight: '100vh' }}>
      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="animate-up">
            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>Welcome back</p>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{user?.name?.split(' ')[0]} <span className="gradient-text">Dashboard</span></h1>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div className={`badge badge-${user?.subscriptionStatus === 'ACTIVE' ? 'green' : user?.subscriptionStatus === 'OVERDUE' ? 'yellow' : 'red'}`}>
              ● {user?.subscriptionStatus}
            </div>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowNotifs(!showNotifs)} className="btn-secondary" style={{ padding: '0.5rem', position: 'relative' }}>
                <Bell size={18} color={unreadCount > 0 ? '#fbbf24' : undefined} />
                {unreadCount > 0 && <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--accent)', fontSize: '9px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unreadCount}</span>}
              </button>
              {showNotifs && (
                <div className="glass" style={{ position: 'absolute', top: '48px', right: 0, width: '340px', zIndex: 50, padding: '1.25rem', maxHeight: '420px', overflowY: 'auto', boxShadow: 'var(--shadow-lg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Notifications</span>
                    <X size={16} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowNotifs(false)} />
                  </div>
                  {notifications.length === 0 ? <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0', fontSize: '0.85rem' }}>No notifications</p> :
                    notifications.map(n => (
                      <div key={n.id} onClick={async () => { await api.patch(`/notifications/${n.id}/read`, {}); fetchAll(); }} style={{ padding: '0.875rem', borderRadius: 'var(--radius)', background: n.read ? 'transparent' : 'rgba(99,102,241,0.07)', marginBottom: '0.5rem', cursor: 'pointer', border: '1px solid ' + (n.read ? 'transparent' : 'rgba(99,102,241,0.15)'), transition: 'var(--transition)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.82rem' }}>{n.subject}</span>
                          {!n.read && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: '4px' }} />}
                        </div>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{n.message}</p>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feedback */}
        {feedback && <div className="alert alert-success animate-in" style={{ marginBottom: '1.5rem' }}><Check size={16} /> {feedback}</div>}
        {user?.subscriptionStatus === 'OVERDUE' && (
          <div className="alert alert-warning animate-in" style={{ marginBottom: '1.5rem' }}>
            ⚠️ Your subscription is overdue. Grace period ends <strong>{new Date(user.gracePeriodEnd).toLocaleDateString('en-GB')}</strong>. Please renew to avoid cancellation.
          </div>
        )}

        {/* Tabs */}
        <div className="tab-bar">
          {(['performance', 'wins', 'impact'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`tab-btn ${activeTab === tab ? 'active' : ''}`}>
              {tab === 'performance' ? '📊 Performance' : tab === 'wins' ? '🏆 My Wins' : '❤️ Impact'}
            </button>
          ))}
        </div>

        {/* PERFORMANCE TAB */}
        {activeTab === 'performance' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {/* Log Score */}
            <div className="glass animate-up" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                <Target size={20} color="var(--primary-light)" /> Log Score
              </h3>
              {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}
              <form onSubmit={handleAddScore} style={{ display: 'grid', gap: '0.75rem' }}>
                <div>
                  <label className="input-label">Stableford Points (1–45)</label>
                  <input type="number" className="input-field" placeholder="e.g. 36" value={newScore.value} onChange={e => setNewScore({ ...newScore, value: e.target.value })} min="1" max="45" required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className="input-label">Gross Score</label>
                    <input type="number" className="input-field" placeholder="Optional" value={newScore.grossScore} onChange={e => setNewScore({ ...newScore, grossScore: e.target.value })} />
                  </div>
                  <div>
                    <label className="input-label">Date</label>
                    <input type="date" className="input-field" value={newScore.date} onChange={e => setNewScore({ ...newScore, date: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <label className="input-label">Course Name</label>
                  <input type="text" className="input-field" placeholder="Optional" value={newScore.course} onChange={e => setNewScore({ ...newScore, course: e.target.value })} />
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: '0.25rem' }}>Add Score</button>
              </form>
            </div>

            {/* Scores List */}
            <div className="glass animate-up" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={20} color="var(--secondary)" /> Last 5 Scores</h3>
                {trend && scores.length > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.04)' }}>
                    {trendIcon}
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize' }}>{trend.trend}</span>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>avg {trend.average}</span>
                  </div>
                )}
              </div>
              {scores.length === 0
                ? <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}><Target size={32} style={{ margin: '0 auto 1rem', opacity: 0.4 }} /><p style={{ fontSize: '0.9rem' }}>No scores yet. Log your first round!</p></div>
                : scores.map((s) => (
                  <div key={s.id} style={{ marginBottom: '0.75rem', padding: '0.875rem 1rem', borderRadius: 'var(--radius)', background: 'rgba(255,255,255,0.025)', border: '1px solid var(--glass-border)', transition: 'var(--transition)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)'}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{new Date(s.date).toLocaleDateString('en-GB')}</span>
                        {s.course && <span className="text-muted" style={{ fontSize: '0.78rem', marginLeft: '0.5rem' }}>{s.course}</span>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className="gradient-text" style={{ fontSize: '1.4rem', fontWeight: 800 }}>{s.value}</span>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button onClick={() => setEditingScore({ ...s })} style={{ padding: '0.25rem', background: 'none', border: 'none', color: 'var(--text-muted)', transition: 'var(--transition)' }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--primary-light)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}>
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDeleteScore(s.id)} style={{ padding: '0.25rem', background: 'none', border: 'none', color: 'var(--text-muted)', transition: 'var(--transition)' }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--accent)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }}>
                      <div style={{ height: '100%', width: `${(s.value / 45) * 100}%`, background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: '2px', transition: 'width 0.6s ease' }} />
                    </div>
                    {s.grossScore && <p className="text-muted" style={{ fontSize: '0.72rem', marginTop: '0.35rem' }}>Gross: {s.grossScore}</p>}
                  </div>
                ))
              }
            </div>

            {/* Draw Entry Card */}
            <div className="glass animate-up" style={{ padding: '2rem', gridColumn: '1 / -1' }}>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🎲 Your Monthly Draw Entry
              </h3>
              <p className="text-muted" style={{ fontSize: '0.82rem', marginBottom: '1.5rem' }}>
                Your last 5 Stableford scores become your lucky numbers. Match them in the monthly draw to win prizes.
              </p>

              {!drawEntry ? (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ width: '52px', height: '52px', borderRadius: '50%' }} />)}
                </div>
              ) : drawEntry.eligible ? (
                <div>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                    {drawEntry.drawNumbers.map((n: number, i: number) => (
                      <div key={i} style={{
                        width: '52px', height: '52px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: '1.1rem', color: 'white',
                        boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
                        animation: `fadeInUp 0.4s ease ${i * 80}ms both`,
                      }}>{n}</div>
                    ))}
                    {/* Placeholder balls if fewer than 5 scores */}
                    {Array(5 - drawEntry.drawNumbers.length).fill(0).map((_, i) => (
                      <div key={`empty-${i}`} style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px dashed var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="text-muted" style={{ fontSize: '0.7rem' }}>—</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ padding: '0.625rem 1rem', borderRadius: 'var(--radius-sm)', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--secondary-light)', fontWeight: 600 }}>✅ Entered — {drawEntry.scoresUsed}/5 numbers active</span>
                    </div>
                    <div style={{ padding: '0.625rem 1rem', borderRadius: 'var(--radius-sm)', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--primary-light)', fontWeight: 600 }}>
                        🗓 Next draw: {new Date(drawEntry.nextDrawDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    {drawEntry.lastDraw && (
                      <div style={{ padding: '0.625rem 1rem', borderRadius: 'var(--radius-sm)', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}>
                        <span style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 600 }}>
                          Last draw: {drawEntry.lastDraw.numbers} — Pool £{drawEntry.lastDraw.prizePool?.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="alert alert-warning" style={{ display: 'inline-flex' }}>
                  ⚠️ {drawEntry.reason}
                </div>
              )}
            </div>
            <div className="glass animate-up" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>📅 Subscription</h3>
              <div style={{ display: 'grid', gap: '0.875rem' }}>
                {[
                  { label: 'Status', value: <span style={{ color: statusColor[user?.subscriptionStatus] || 'white', fontWeight: 700 }}>{user?.subscriptionStatus}</span> },
                  { label: 'Plan', value: 'Monthly — £10/mo' },
                  { label: 'Renewal', value: user?.renewalDate ? new Date(user.renewalDate).toLocaleDateString('en-GB') : '—' },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span className="text-muted" style={{ fontSize: '0.88rem' }}>{row.label}</span>
                    <span style={{ fontSize: '0.88rem' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* WINS TAB */}
        {activeTab === 'wins' && (
          <div className="animate-up" style={{ display: 'grid', gap: '1.25rem' }}>
            {wins.length === 0
              ? <div className="glass" style={{ padding: '5rem', textAlign: 'center' }}>
                <Trophy size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>No wins yet</h3>
                <p className="text-muted" style={{ fontSize: '0.9rem' }}>Keep logging scores — draws happen monthly!</p>
              </div>
              : wins.map(win => (
                <div key={win.id} className="glass" style={{ padding: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>Tier {win.tier} — {win.matchCount}-Number Match</p>
                    <p className="text-muted" style={{ fontSize: '0.82rem', marginBottom: '0.5rem' }}>{new Date(win.draw.drawDate).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
                    {win.status === 'PENDING' && (
                      <button onClick={() => setShowKyc(win.id)} className="btn-secondary" style={{ padding: '0.35rem 0.875rem', fontSize: '0.78rem' }}>
                        <Upload size={13} /> Upload Score Proof
                      </button>
                    )}
                    {win.status === 'KYC_REQUIRED' && <span className="badge badge-yellow">📋 Under Review</span>}
                    {win.status === 'KYC_VERIFIED' && <span className="badge badge-green"><Check size={11} /> Verified — Payout Pending</span>}
                    {win.status === 'PAID' && <span className="badge badge-purple">💸 Paid Out</span>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p className="gradient-text" style={{ fontSize: '2.25rem', fontWeight: 900, lineHeight: 1 }}>£{win.prizeAmount.toFixed(2)}</p>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {/* IMPACT TAB */}
        {activeTab === 'impact' && (
          <div className="animate-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div className="glass" style={{ padding: '2.5rem', textAlign: 'center' }}>
              <Heart size={36} color="var(--accent)" style={{ margin: '0 auto 1rem' }} />
              <p className="text-muted" style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>Your Total Contribution</p>
              <p className="gradient-text" style={{ fontSize: '3rem', fontWeight: 900 }}>£{user?.totalContributed?.toFixed(2) || '0.00'}</p>
              <p className="text-muted" style={{ marginTop: '0.5rem', fontSize: '0.88rem' }}>to {user?.charity?.name || 'your charity'}</p>
            </div>
            {user?.charity && (
              <div className="glass" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Your Charity</h3>
                <p style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '0.5rem' }}>{user.charity.name}</p>
                <p className="text-muted" style={{ fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>{user.charity.description}</p>
                {user.charity.website && (
                  <a href={user.charity.website} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    Visit Website →
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* EDIT SCORE MODAL */}
        {editingScore && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }}>
            <div className="glass animate-in" style={{ width: '100%', maxWidth: '400px', padding: '2rem', position: 'relative' }}>
              <button onClick={() => setEditingScore(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-muted)' }}><X size={20} /></button>
              <h3 style={{ marginBottom: '1.5rem' }}>Edit Score</h3>
              <form onSubmit={handleEditScore} style={{ display: 'grid', gap: '0.875rem' }}>
                <div><label className="input-label">Stableford (1–45)</label>
                  <input type="number" className="input-field" value={editingScore.value} onChange={e => setEditingScore({ ...editingScore, value: e.target.value })} min="1" max="45" required /></div>
                <div><label className="input-label">Gross Score</label>
                  <input type="number" className="input-field" value={editingScore.grossScore || ''} onChange={e => setEditingScore({ ...editingScore, grossScore: e.target.value })} /></div>
                <div><label className="input-label">Course</label>
                  <input type="text" className="input-field" value={editingScore.course || ''} onChange={e => setEditingScore({ ...editingScore, course: e.target.value })} /></div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                  <button type="button" onClick={() => setEditingScore(null)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* PROOF UPLOAD MODAL */}
        {showKyc && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }}>
            <div className="glass animate-in" style={{ width: '100%', maxWidth: '460px', padding: '2rem', position: 'relative' }}>
              <button onClick={() => setShowKyc(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-muted)' }}><X size={20} /></button>
              <h3 style={{ marginBottom: '0.75rem' }}>Upload Score Proof</h3>
              <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '1.75rem' }}>Please upload a clear screenshot of your scorecard for this round. Our team will verify and process your prize.</p>
              <div onClick={() => document.getElementById('proof-input')?.click()} style={{ border: '2px dashed var(--glass-border)', borderRadius: 'var(--radius)', padding: '2.5rem', textAlign: 'center', cursor: 'pointer', transition: 'var(--transition)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)'}>
                <Upload size={28} color="var(--primary)" style={{ margin: '0 auto 0.75rem' }} />
                <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{kycFile || 'Click to select file'}</p>
                <p className="text-muted" style={{ fontSize: '0.75rem' }}>PNG, JPG or PDF (max 5MB)</p>
                <input id="proof-input" type="file" hidden onChange={e => setKycFile(e.target.files?.[0]?.name || '')} />
              </div>
              <button disabled={!kycFile} onClick={() => { setShowKyc(null); setKycFile(''); setFeedback('Proof submitted! We will review shortly.'); }} className="btn-primary" style={{ width: '100%', marginTop: '1.25rem' }}>
                Submit Proof
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default UserDashboard;
