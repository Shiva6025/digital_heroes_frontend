import React, { useState, useEffect } from 'react';
import { Search, Filter, ExternalLink, Heart, Users, DollarSign } from 'lucide-react';
import { api } from '../services/api';

const CharityExplorer: React.FC = () => {
  const [charities, setCharities] = useState<any[]>([]);
  const [impact, setImpact] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [charityData, impactData] = await Promise.all([
          api.get('/charities'),
          api.get('/charities/impact')
        ]);
        setCharities(charityData);
        setImpact(impactData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCharities = charities.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <header style={{ marginBottom: '5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }} className="gradient-text">Impact Partners</h1>
        <p className="text-muted" style={{ fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto' }}>
          Discover the global organizations you empower through your play. Every birdie contributes to a mission.
        </p>
      </header>

      {/* Global Impact Summary */}
      {impact && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          {[
            { icon: <Heart size={28} color="var(--accent)" />, label: 'Collective Giving', value: `£${impact.totalContributed?.toLocaleString() || '0'}` },
            { icon: <Users size={28} color="var(--primary)" />, label: 'Active Heroes', value: impact.activeUsers?.toLocaleString() || '0' },
            { icon: <DollarSign size={28} color="var(--secondary)" />, label: 'Active Causes', value: String(charities.length) },
          ].map((stat, i) => (
            <div key={i} className="impact-stat">
              <div style={{ marginBottom: '1rem' }}>{stat.icon}</div>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{stat.label}</p>
              <p style={{ fontSize: '2.25rem', fontWeight: 900 }} className="gradient-text">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Search & Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
        <div className="glass" style={{ flex: 1, padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Search size={20} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search by name or category..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: 'none', border: 'none', outline: 'none', color: 'white', width: '100%' }} 
          />
        </div>
        <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} /> Filters
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '420px' }} />
          ))
        ) : (
          filteredCharities.map((c) => (
            <div key={c.id} className="charity-card">
              <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                <img src={c.image || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=800'} alt={c.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.65 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(2,6,23,0.7) 0%, transparent 50%)' }} />
                <span className="badge badge-muted" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>{c.category || 'General'}</span>
              </div>
              <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ marginBottom: '0.625rem', fontSize: '1.2rem' }}>{c.name}</h3>
                <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '1.5rem', flex: 1, lineHeight: 1.65 }}>{c.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                  <div>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Received</p>
                    <p style={{ fontWeight: 700, color: 'var(--secondary-light)', fontSize: '1rem' }}>£{c.totalReceived?.toLocaleString() || '0'}</p>
                  </div>
                  {c.website && (
                    <a href={c.website} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '0.4rem 0.875rem', fontSize: '0.8rem' }}>Visit →</a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {!loading && filteredCharities.length === 0 && (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <p className="text-muted">No impact partners found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default CharityExplorer;
