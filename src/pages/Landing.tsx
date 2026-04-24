import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Target, Users, ArrowRight, ShieldCheck, Globe, Trophy } from 'lucide-react';
import { api } from '../services/api';

const Landing: React.FC = () => {
  const [impact, setImpact] = useState<any>(null);

  useEffect(() => {
    const fetchImpact = async () => {
      try {
        const data = await api.get('/charities/impact');
        setImpact(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchImpact();
  }, []);

  return (
    <div className="animate-up">
      {/* Hero Section */}
      <section style={{
        padding: '8rem 0 6rem',
        textAlign: 'center',
        background: 'radial-gradient(circle at top center, rgba(99, 102, 241, 0.15), transparent 70%)'
      }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>New</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>The Monthly Glory Draw is now live!</span>
          </div>
          <h1 style={{ fontSize: '4.5rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>
            Play for <span className="gradient-text">Impact.</span> <br />
            Track your <span className="gradient-text">Glory.</span>
          </h1>
          <p className="text-muted" style={{ fontSize: '1.4rem', maxWidth: '800px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
            Digital Heroes is the premium golf performance platform that turns your birdies into breakthroughs for global charities.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 3rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              Become a Hero <ArrowRight size={20} />
            </Link>
            <Link to="/charities" className="btn-secondary" style={{ fontSize: '1.1rem', padding: '1rem 3rem' }}>Explore Impact</Link>
          </div>
        </div>
      </section>

      {/* Live Impact Stats */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {[
              { label: 'Collective Giving', value: `£${impact?.totalContributed?.toLocaleString() || '42,500'}+`, color: 'var(--primary-light)' },
              { label: 'Active Heroes', value: `${impact?.activeUsers?.toLocaleString() || '1,240'}+`, color: 'var(--secondary-light)' },
              { label: 'Lives Impacted', value: '10k+', color: '#fbbf24' },
            ].map((stat, i) => (
              <div key={i} className="impact-stat">
                <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.875rem' }}>{stat.label}</p>
                <p style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1, background: `linear-gradient(135deg, ${stat.color}, white)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section style={{ padding: '8rem 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '4rem' }}>The Hero's <span className="gradient-text">Journey</span></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem' }}>
            {[
              { icon: <Target size={32} color="#818cf8" />, title: 'Log Performance', desc: 'Enter your scores after every round. We track your last 5 Stableford scores to determine your performance tier.', accent: 'rgba(99,102,241,0.15)' },
              { icon: <Globe size={32} color="#f43f5e" />, title: 'Fund a Cause', desc: '10% of your subscription goes directly to a global charity you choose. Track your individual and collective impact.', accent: 'rgba(244,63,94,0.12)' },
              { icon: <Trophy size={32} color="#34d399" />, title: 'Monthly Draws', desc: 'Match your performance numbers in our monthly draw. Win exclusive prize pools while supporting those in need.', accent: 'rgba(16,185,129,0.12)' }
            ].map((step, i) => (
              <div key={i} className="feature-card">
                <div style={{ width: '60px', height: '60px', borderRadius: '14px', background: step.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.75rem' }}>{step.icon}</div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.875rem' }}>{step.title}</h3>
                <p className="text-muted" style={{ lineHeight: 1.75, fontSize: '0.95rem' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust/Security */}
      <section style={{ padding: '4rem 0', background: 'rgba(15, 23, 42, 0.3)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap', opacity: 0.6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><ShieldCheck size={20} /> <span style={{ fontWeight: 600 }}>Secure Payouts</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Heart size={20} /> <span style={{ fontWeight: 600 }}>Verified Charities</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Users size={20} /> <span style={{ fontWeight: 600 }}>100% Transparent</span></div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '10rem 0' }}>
        <div className="container">
          <div className="glass" style={{
            padding: '6rem 4rem',
            textAlign: 'center',
            background: 'linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.9)), url("https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80&w=2070") center/cover',
            borderRadius: '2rem'
          }}>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: 800 }}>Ready to join the mission?</h2>
            <p className="text-muted" style={{ fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
              Every birdie, every par, every contribution matters. Start your journey as a Digital Hero today.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/signup" className="btn-primary" style={{ padding: '1.25rem 3.5rem', fontSize: '1.1rem' }}>Get Started Now</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '4rem 0', borderTop: '1px solid var(--glass-border)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h3 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>DIGITAL HEROES</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>© 2026 Digital Heroes. All rights reserved.</p>
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <Link to="/charities" className="text-muted" style={{ fontSize: '0.9rem' }}>Charities</Link>
            <Link to="/login" className="text-muted" style={{ fontSize: '0.9rem' }}>Login</Link>
            <Link to="/signup" className="text-muted" style={{ fontSize: '0.9rem' }}>Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
