import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  Home, AlertTriangle, MapPin, Activity, BookOpen,
  Menu, X, Phone, Shield, Bell
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home, exact: true },
  { to: '/report', label: 'Report', icon: AlertTriangle },
  { to: '/services', label: 'Services', icon: MapPin },
  { to: '/track', label: 'Track', icon: Activity },
  { to: '/tips', label: 'Tips', icon: BookOpen },
];

export default function CitizenLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-void)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <nav className="glass-strong" style={{
        position: 'sticky', top: 0, zIndex: 100,
        height: 'var(--navbar-height)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 1.25rem',
        borderBottom: '1px solid var(--border-default)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{
            width: 38, height: 38,
            background: 'linear-gradient(135deg, var(--sos), #7c3aed)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px var(--sos-glow)',
          }}>
            <Shield size={20} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.05em', color: 'var(--text-primary)', lineHeight: 1 }}>AASHRAYA</div>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.12em', fontFamily: 'var(--font-mono)' }}>EMERGENCY PLATFORM</div>
          </div>
        </div>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }} className="desktop-nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem', fontWeight: 500,
              textDecoration: 'none',
              color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
              background: isActive ? 'var(--accent-dim)' : 'transparent',
              border: `1px solid ${isActive ? 'var(--border-active)' : 'transparent'}`,
              transition: 'all 0.2s',
            })}>
              <Icon size={14} />
              {label}
            </NavLink>
          ))}
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button style={{
            background: 'transparent', border: '1px solid var(--border-default)',
            color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)',
            padding: '0.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center',
          }}>
            <Bell size={16} />
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'var(--accent-dim)', border: '1px solid var(--border-active)',
              color: 'var(--accent-secondary)', borderRadius: 'var(--radius-sm)',
              padding: '0.4rem 0.85rem', cursor: 'pointer', fontSize: '0.8rem',
              fontWeight: 600, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem',
            }}
          >
            <Shield size={13} /> Dashboard
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-only"
            style={{
              background: 'transparent', border: '1px solid var(--border-default)',
              color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)',
              padding: '0.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center',
            }}
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{
              overflow: 'hidden', zIndex: 99, position: 'relative',
              background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)',
            }}
          >
            <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} end={to === '/'} onClick={() => setMobileOpen(false)} style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.65rem 1rem', borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--accent-dim)' : 'transparent',
                })}>
                  <Icon size={16} /> {label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Emergency Hotline Footer Banner */}
      <div style={{
        background: 'linear-gradient(90deg, var(--critical-dim), rgba(239,68,68,0.06))',
        borderTop: '1px solid rgba(239,68,68,0.2)',
        padding: '0.6rem 1.25rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <Phone size={12} color="var(--critical)" />
          <span style={{ color: 'var(--text-muted)' }}>Police</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--critical)', fontWeight: 600 }}>100</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <Phone size={12} color="var(--high)" />
          <span style={{ color: 'var(--text-muted)' }}>Ambulance</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--high)', fontWeight: 600 }}>102</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <Phone size={12} color="var(--medium)" />
          <span style={{ color: 'var(--text-muted)' }}>Fire</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--medium)', fontWeight: 600 }}>101</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <Phone size={12} color="var(--accent-primary)" />
          <span style={{ color: 'var(--text-muted)' }}>NDRRMA</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', fontWeight: 600 }}>1144</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-only { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-only { display: none !important; }
        }
      `}</style>
    </div>
  );
}