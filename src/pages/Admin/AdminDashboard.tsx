import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Users, Trophy, BarChart3, DollarSign } from 'lucide-react';

type AdminTab = 'users' | 'draws' | 'winners' | 'reports';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [draws, setDraws] = useState<any[]>([]);
  const [pendingWinners, setPendingWinners] = useState<any[]>([]);
  const [report, setReport] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [drawType, setDrawType] = useState<'RANDOM' | 'ALGORITHMIC'>('RANDOM');
  const [drawing, setDrawing] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState<any>(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [usersData, drawsData, winnersData, reportData] = await Promise.all([
        api.get('/admin/users'),
        api.get('/draws'),
        api.get('/admin/winners/pending'),
        api.get('/admin/reports/financial'),
      ]);
      setUsers(usersData);
      setDraws(drawsData);
      setPendingWinners(winnersData);
      setReport(reportData);
    } catch (err) {
      console.error('Admin fetch error:', err);
    }
  };

  const executeDraw = async () => {
    if (!confirm(`Execute a ${drawType} draw? This cannot be undone.`)) return;
    setDrawing(true);
    setFeedback('');
    try {
      const result = await api.post('/admin/draw', { type: drawType });
      setFeedback(`✅ Draw executed! ${result.numbers} — Prize pool: £${result.prizePool?.toFixed(2)}`);
      fetchAll();
    } catch (err: any) {
      setFeedback(`❌ ${err.message}`);
    } finally {
      setDrawing(false);
    }
  };

  const approveKyc = async (userId: string) => {
    try {
      await api.post(`/admin/kyc/${userId}/approve`, {});
      setFeedback('✅ KYC approved');
      fetchAll();
    } catch (err: any) {
      setFeedback(`❌ ${err.message}`);
    }
  };

  const simulateDraw = async () => {
    setSimulating(true);
    setSimResult(null);
    try {
      const result = await api.post('/admin/draw/simulate', { type: drawType });
      setSimResult(result);
    } catch (err: any) {
      setFeedback(`❌ ${err.message}`);
    } finally {
      setSimulating(false);
    }
  };

  const verifyWinner = async (winnerId: string) => {
    try {
      await api.post(`/admin/winners/${winnerId}/verify`, {});
      setFeedback('✅ Proof verified — winner notified');
      fetchAll();
    } catch (err: any) {
      setFeedback(`❌ ${err.message}`);
    }
  };

  const markPaid = async (winnerId: string) => {
    try {
      await api.patch(`/admin/winners/${winnerId}/pay`, {});
      setFeedback('✅ Marked as paid');
      fetchAll();
    } catch (err: any) {
      setFeedback(`❌ ${err.message}`);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const tabStyle = (tab: AdminTab) => ({
    padding: '0.75rem 1.5rem',
    background: 'none',
    border: 'none',
    borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
    color: activeTab === tab ? 'white' : 'var(--text-muted)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  });

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: 'rgba(16,185,129,0.2)',
      OVERDUE: 'rgba(245,158,11,0.2)',
      CANCELLED: 'rgba(244,63,94,0.2)',
    };
    const textColors: Record<string, string> = {
      ACTIVE: '#34d399',
      OVERDUE: '#fbbf24',
      CANCELLED: '#f43f5e',
    };
    return (
      <span style={{ padding: '0.2rem 0.6rem', borderRadius: '9999px', background: colors[status] || 'rgba(255,255,255,0.1)', color: textColors[status] || 'white', fontSize: '0.75rem', fontWeight: 700 }}>
        {status}
      </span>
    );
  };

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem' }}>Admin <span className="gradient-text">Control Centre</span></h2>
        {feedback && (
          <div className="glass" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>{feedback}</div>
        )}
      </div>

      {/* Summary Cards */}
      {report && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { label: 'Active Members', value: report.activeUsers, icon: <Users size={20} color="#818cf8" />, prefix: '' },
            { label: 'Monthly Revenue', value: report.monthlyRevenue?.toFixed(2), icon: <DollarSign size={20} color="#34d399" />, prefix: '£' },
            { label: 'Prize Pool', value: report.prizePool?.toFixed(2), icon: <Trophy size={20} color="#fbbf24" />, prefix: '£' },
            { label: 'Charity Fund', value: report.charityFund?.toFixed(2), icon: <BarChart3 size={20} color="#f43f5e" />, prefix: '£' },
          ].map((card, i) => (
            <div key={i} className="glass" style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '0.75rem' }}>{card.icon}</div>
              <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>{card.label}</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 800 }} className="gradient-text">{card.prefix}{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--glass-border)', marginBottom: '2rem' }}>
        <button style={tabStyle('users')} onClick={() => setActiveTab('users')}>👤 Users</button>
        <button style={tabStyle('draws')} onClick={() => setActiveTab('draws')}>🎲 Draws</button>
        <button style={tabStyle('winners')} onClick={() => setActiveTab('winners')}>🏆 Winners</button>
        <button style={tabStyle('reports')} onClick={() => setActiveTab('reports')}>📊 Reports</button>
      </div>

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div>
          <input type="text" placeholder="Search by name or email..." value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', maxWidth: '400px', padding: '0.75rem 1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', marginBottom: '1.5rem' }} />
          <div className="glass" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  {['Name', 'Email', 'Status', 'KYC', 'Charity', 'Scores'].map(h => (
                    <th key={h} style={{ padding: '1rem', textAlign: 'left', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>{u.name}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{u.email}</td>
                    <td style={{ padding: '1rem' }}>{statusBadge(u.subscriptionStatus)}</td>
                    <td style={{ padding: '1rem' }}>
                      {u.kycStatus === 'PENDING' ? (
                        <button onClick={() => approveKyc(u.id)} className="btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                          Approve KYC
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: u.kycStatus === 'VERIFIED' ? 'var(--secondary)' : 'var(--text-muted)' }}>
                          {u.kycStatus === 'VERIFIED' ? '✅ Verified' : '—'}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{u.charity?.name || '—'}</td>
                    <td style={{ padding: '1rem' }}>{u._count?.scores || 0}</td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DRAWS TAB */}
      {activeTab === 'draws' && (
        <div style={{ display: 'grid', gap: '2rem' }}>
          {/* Draw Control */}
          <div className="glass" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>🎲 Monthly Draw Control</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Draw Type</label>
                <select value={drawType} onChange={e => { setDrawType(e.target.value as any); setSimResult(null); }}
                  className="input-field"
                  style={{ minWidth: '240px' }}>
                  <option value="RANDOM">Random</option>
                  <option value="ALGORITHMIC">Algorithmic (Frequency-Weighted)</option>
                </select>
              </div>
              <button onClick={simulateDraw} disabled={simulating} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {simulating ? 'Simulating...' : '🔮 Simulate (Preview)'}
              </button>
              <button onClick={executeDraw} disabled={drawing} className="btn-primary">
                {drawing ? 'Running Draw...' : '🚀 Execute Live Draw'}
              </button>
            </div>
            {simResult && (
              <div style={{ padding: '1.5rem', borderRadius: '0.75rem', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--primary)', marginBottom: '1rem', fontWeight: 600 }}>🔮 SIMULATION PREVIEW — No changes saved</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  {simResult.numbers?.split(',').map((n: string) => (
                    <span key={n} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem' }}>{n}</span>
                  ))}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Prize Pool: <strong style={{ color: 'white' }}>£{simResult.prizePool?.toFixed(2)}</strong> | 1st: £{simResult.firstPrize?.toFixed(2)} | 2nd: £{simResult.secondPrize?.toFixed(2)} | 3rd: £{simResult.thirdPrize?.toFixed(2)}</p>
              </div>
            )}
          </div>

          {/* Draw History */}
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Draw History</h3>
            {draws.map((d, i) => (
              <div key={i} className="glass" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <p style={{ fontWeight: 700, marginBottom: '0.25rem' }}>
                      {new Date(d.drawDate).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })} — {d.type}
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800 }} className="gradient-text">
                      {d.numbers?.split(',').map((n: string) => (
                        <span key={n} style={{ display: 'inline-block', margin: '0 0.25rem', minWidth: '2rem', textAlign: 'center' }}>{n}</span>
                      ))}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p className="text-muted" style={{ fontSize: '0.8rem' }}>Prize Pool</p>
                    <p style={{ fontWeight: 700 }}>£{d.prizePool?.toFixed(2) || '—'}</p>
                    <p className="text-muted" style={{ fontSize: '0.8rem' }}>{d.winners?.length || 0} winner(s)</p>
                  </div>
                </div>
              </div>
            ))}
            {draws.length === 0 && <p className="text-muted">No draws executed yet.</p>}
          </div>
        </div>
      )}

      {/* WINNERS TAB */}
      {activeTab === 'winners' && (
        <div className="glass" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                {['Member', 'Prize', 'Match', 'Status', 'Proof', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '1rem', textAlign: 'left', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pendingWinners.map(w => (
                <tr key={w.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '1rem' }}>
                    <p style={{ fontWeight: 600 }}>{w.user?.name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{w.user?.email}</p>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 700 }} className="gradient-text">£{w.prizeAmount?.toFixed(2)}</td>
                  <td style={{ padding: '1rem' }}>{w.matchCount}-match</td>
                  <td style={{ padding: '1rem' }}>{statusBadge(w.status)}</td>
                  <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                    {w.proofUrl ? (
                      <a href={w.proofUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontSize: '0.8rem' }}>View Proof</a>
                    ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                  </td>
                  <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {w.status === 'KYC_REQUIRED' && w.proofUrl && (
                      <button onClick={() => verifyWinner(w.id)} className="btn-secondary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}>Verify</button>
                    )}
                    {(w.status === 'KYC_VERIFIED' || w.status === 'PENDING') && (
                      <button onClick={() => markPaid(w.id)} className="btn-primary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}>Pay</button>
                    )}
                  </td>
                </tr>
              ))}
              {pendingWinners.length === 0 && (
                <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No pending payouts</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* REPORTS TAB */}
      {activeTab === 'reports' && report && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="glass" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>💰 Revenue Breakdown</h3>
            {[
              { label: 'Monthly Revenue (£10 × members)', value: report.monthlyRevenue },
              { label: 'Prize Pool — 50% (Split: 40/35/25%)', value: report.prizePool },
              { label: 'Charity Fund — 10%', value: report.charityFund },
              { label: 'Operational — 40%', value: report.operationalFund },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: i < 3 ? '1px solid var(--glass-border)' : 'none' }}>
                <span className="text-muted" style={{ fontSize: '0.9rem' }}>{row.label}</span>
                <span style={{ fontWeight: 700 }}>£{(row.value || 0).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="glass" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>📈 Cumulative Stats</h3>
            {[
              { label: 'Total Prizes Paid', value: report.totalPrizePaid },
              { label: 'Total Donated to Charities', value: report.totalCharityContributed },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: i < 1 ? '1px solid var(--glass-border)' : 'none' }}>
                <span className="text-muted" style={{ fontSize: '0.9rem' }}>{row.label}</span>
                <span className="gradient-text" style={{ fontWeight: 800, fontSize: '1.1rem' }}>£{(row.value || 0).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
