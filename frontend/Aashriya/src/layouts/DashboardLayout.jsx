import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  LayoutDashboard, AlertTriangle, Users, Package,
  Bell, BarChart2, ChevronLeft, ChevronRight,
  Shield, Radio, LogOut, Settings, User, Home,
  Zap, Activity
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Command Center', icon: LayoutDashboard, exact: true },
  { to: '/dashboard/incidents', label: 'Incidents', icon: AlertTriangle, badge: 12 },
  { to: '/dashboard/teams', label: 'Teams', icon: Users },
  { to: '/dashboard/resources', label: 'Resources', icon: Package },
  { to: '/dashboard/notifications', label: 'Alerts', icon: Bell, badge: 5 },
  { to: '/dashboard/analytics', label: 'Analytics', icon: BarChart2 },
];

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const sideW = collapsed ? 68 : 260;

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-void)', overflow: 'hidden' }}>
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sideW }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        style={{
          height: '100vh', flexShrink: 0, overflow: 'hidden',
          background: 'var(--bg-deep)',
          borderRight: '1px solid var(--border-default)',
          display: 'flex', flexDirection: 'column',
          position: 'relative', zIndex: 50,
        }}
      >
        {/* Logo area */}
        <div style={{
          height: 'var(--navbar-height)', display: 'flex', alignItems: 'center',
          padding: collapsed ? '0 1.1rem' : '0 1.25rem',
          borderBottom: '1px solid var(--border-default)',
          gap: '0.75rem', overflow: 'hidden',
        }}>
          <div style={{
            width: 36, height: 36, flexShrink: 0,
            background: 'linear-gradient(135deg, var(--sos), #7c3aed)',
            borderRadius: '9px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 14px var(--sos-glow)',
          }}>
            <Shield size={18} color="white" />
          </div>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.06em', color: 'var(--text-primary)', lineHeight: 1 }}>AASHRAYA</div>
              <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', letterSpacing: '0.14em', fontFamily: 'var(--font-mono)' }}>COMMAND CENTER</div>
            </motion.div>
          )}
        </div>

        {/* Live Status Bar */}
        {!collapsed && (
          <div style={{
            margin: '0.75rem', borderRadius: 'var(--radius-sm)',
            background: 'var(--low-dim)', border: '1px solid rgba(34,197,94,0.2)',
            padding: '0.5rem 0.75rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <span className="live-dot" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--active)', fontWeight: 600 }}>SYSTEM LIVE</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>All services operational</div>
            </div>
            <Radio size={12} color="var(--active)" style={{ marginLeft: 'auto' }} />
          </div>
        )}

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '0.5rem 0.6rem', display: 'flex', flexDirection: 'column', gap: '0.15rem', overflowY: 'auto' }}>
          {NAV_ITEMS.map(({ to, label, icon: Icon, badge, exact }) => (
            <NavLink key={to} to={to} end={exact} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: collapsed ? '0.65rem' : '0.6rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none', position: 'relative',
              justifyContent: collapsed ? 'center' : 'flex-start',
              color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
              background: isActive ? 'var(--accent-dim)' : 'transparent',
              border: `1px solid ${isActive ? 'var(--border-active)' : 'transparent'}`,
              transition: 'all 0.18s',
              fontSize: '0.85rem', fontWeight: isActive ? 600 : 400,
              overflow: 'hidden',
            })}>
              <Icon size={16} style={{ flexShrink: 0 }} />
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ flex: 1, whiteSpace: 'nowrap' }}>
                  {label}
                </motion.span>
              )}
              {!collapsed && badge && (
                <span style={{
                  background: 'var(--critical)', color: 'white',
                  borderRadius: '99px', fontSize: '0.65rem', fontWeight: 700,
                  padding: '0.1rem 0.45rem', fontFamily: 'var(--font-mono)',
                  boxShadow: '0 0 8px var(--critical-glow)',
                }}>
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: collapsed ? '0.6rem' : '0.6rem 0.85rem',
              borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              background: 'transparent', border: '1px solid var(--border-default)',
              color: 'var(--text-muted)', justifyContent: collapsed ? 'center' : 'flex-start',
              fontSize: '0.85rem', transition: 'all 0.18s', width: '100%',
            }}
          >
            <Home size={15} />
            {!collapsed && <span>Citizen View</span>}
          </button>

          {/* Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: collapsed ? '0.6rem' : '0.6rem 0.85rem',
              borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
              color: 'var(--text-secondary)', justifyContent: collapsed ? 'center' : 'flex-start',
              fontSize: '0.85rem', transition: 'all 0.18s', width: '100%',
            }}
          >
            {collapsed ? <ChevronRight size={15} /> : <><ChevronLeft size={15} /><span>Collapse</span></>}
          </button>
        </div>
      </motion.aside>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top navbar */}
        <header style={{
          height: 'var(--navbar-height)', flexShrink: 0,
          background: 'var(--bg-deep)', borderBottom: '1px solid var(--border-default)',
          display: 'flex', alignItems: 'center', padding: '0 1.5rem',
          gap: '1rem',
        }}>
          {/* Live Alert Ticker */}
          <div style={{
            flex: 1, overflow: 'hidden', height: 28,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--critical-dim)', border: '1px solid rgba(239,68,68,0.2)',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <div style={{
              flexShrink: 0, padding: '0 0.6rem', height: '100%',
              background: 'var(--critical)', display: 'flex', alignItems: 'center',
              borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)',
            }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.12em', fontFamily: 'var(--font-mono)', color: 'white' }}>LIVE</span>
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <motion.div
                animate={{ x: [300, -800] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                style={{ whiteSpace: 'nowrap', fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}
              >
                🔴 CRITICAL: Fire reported at Thamel, KTM — 3 units dispatched &nbsp;&nbsp;|&nbsp;&nbsp;
                🟡 HIGH: Flooding in Bagmati corridor — teams on standby &nbsp;&nbsp;|&nbsp;&nbsp;
                🟢 RESOLVED: Medical emergency at Lalitpur — patient stable &nbsp;&nbsp;|&nbsp;&nbsp;
                🔴 CRITICAL: Road accident on Ring Road — ambulance deployed
              </motion.div>
            </div>
          </div>

          {/* Right Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>NST +05:45</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={14} color="white" />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>Officer Kumar</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>KTM Central</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-base)' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              style={{ height: '100%' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}