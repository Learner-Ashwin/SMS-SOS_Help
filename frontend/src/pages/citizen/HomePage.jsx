import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  AlertTriangle, MapPin, Activity, Phone,
  Flame, Droplets, Heart, Car, ChevronRight,
  WifiOff, BookOpen
} from 'lucide-react';

const EMERGENCY_TYPES = [
  { icon: Flame, label: 'Fire', color: 'var(--high)', bg: 'var(--high-dim)' },
  { icon: Heart, label: 'Medical', color: 'var(--critical)', bg: 'var(--critical-dim)' },
  { icon: Droplets, label: 'Flood', color: '#38bdf8', bg: 'rgba(56,189,248,0.1)' },
  { icon: Car, label: 'Accident', color: 'var(--medium)', bg: 'var(--medium-dim)' },
  { icon: AlertTriangle, label: 'Other', color: 'var(--accent-primary)', bg: 'var(--accent-dim)' },
];

const RECENT_INCIDENTS = [
  { id: 'INC-2847', type: 'Fire', location: 'Thamel, KTM', time: '8 min ago', status: 'Active', severity: 'Critical', color: 'var(--critical)' },
  { id: 'INC-2846', type: 'Accident', location: 'Ring Road, Lalitpur', time: '22 min ago', status: 'Responding', severity: 'High', color: 'var(--high)' },
  { id: 'INC-2845', type: 'Medical', location: 'Bhaktapur Durbar Sq.', time: '41 min ago', status: 'Resolved', severity: 'Medium', color: 'var(--active)' },
];

function SOSButton({ onPress }) {
  const [pressing, setPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  const startPress = useCallback(() => {
    setPressing(true);
    let p = 0;
    const id = setInterval(() => {
      p += 4;
      setProgress(p);
      if (p >= 100) {
        clearInterval(id);
        onPress();
      }
    }, 120);
    setIntervalId(id);
  }, [onPress]);

  const endPress = useCallback(() => {
    setPressing(false);
    setProgress(0);
    if (intervalId) clearInterval(intervalId);
  }, [intervalId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <div style={{ position: 'relative', width: 180, height: 180 }}>
        {/* Pulse rings */}
        {[1, 2, 3].map(i => (
          <motion.div
            key={i}
            style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: '2px solid var(--sos)',
            }}
            animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.7, ease: 'easeOut' }}
          />
        ))}

        {/* Circular progress ring */}
        <svg style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }} width="180" height="180">
          <circle cx="90" cy="90" r="82" fill="none" stroke="rgba(239,68,68,0.15)" strokeWidth="4" />
          <circle
            cx="90" cy="90" r="82" fill="none"
            stroke="var(--sos-bright)" strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 82}`}
            strokeDashoffset={`${2 * Math.PI * 82 * (1 - progress / 100)}`}
            style={{ transition: 'stroke-dashoffset 0.05s' }}
          />
        </svg>

        {/* Main button */}
        <motion.button
          onMouseDown={startPress} onMouseUp={endPress} onMouseLeave={endPress}
          onTouchStart={startPress} onTouchEnd={endPress}
          animate={{ scale: pressing ? 0.93 : 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          style={{
            position: 'absolute', inset: 12, borderRadius: '50%',
            background: pressing
              ? 'radial-gradient(circle, #dc2626, #7f1d1d)'
              : 'radial-gradient(circle, #ef4444, #dc2626)',
            border: '3px solid rgba(255,255,255,0.12)',
            cursor: 'pointer', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '0.2rem',
            boxShadow: pressing
              ? '0 0 40px var(--sos-glow), 0 0 80px rgba(220,38,38,0.2), inset 0 2px 8px rgba(0,0,0,0.3)'
              : '0 0 24px var(--sos-glow), 0 0 50px rgba(220,38,38,0.15)',
          }}
        >
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 900, color: 'white', letterSpacing: '0.05em', lineHeight: 1 }}>SOS</span>
          <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.15em', fontFamily: 'var(--font-mono)' }}>
            {pressing ? `${Math.round(progress)}%` : 'HOLD 3s'}
          </span>
        </motion.button>
      </div>

      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: 220 }}>
        Press and hold to send an emergency alert with your location
      </p>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [isOnline] = useState(navigator.onLine);
  const [sosActivated, setSosActivated] = useState(false);

  const handleSOS = () => {
    setSosActivated(true);
    toast.success('🚨 Emergency Alert Sent! Help is on the way.', { duration: 5000 });
    navigator.vibrate?.([200, 100, 200]);
    setTimeout(() => setSosActivated(false), 8000);
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Offline Banner */}
      {!isOnline && (
        <motion.div
          initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          style={{
            background: 'var(--medium-dim)', border: '1px solid rgba(234,179,8,0.3)',
            borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem',
            display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem',
          }}
        >
          <WifiOff size={16} color="var(--medium)" />
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--medium)' }}>You're Offline</div>
            <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>SMS reporting available. Text EMERGENCY to <strong style={{ fontFamily: 'var(--font-mono)' }}>5555</strong></div>
          </div>
        </motion.div>
      )}

      {/* SOS Activated Overlay */}
      <AnimatePresence>
        {sosActivated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            style={{
              background: 'var(--critical-dim)', border: '1px solid rgba(239,68,68,0.4)',
              borderRadius: 'var(--radius-lg)', padding: '1.25rem',
              marginBottom: '1rem', textAlign: 'center',
            }}
          >
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--critical)', letterSpacing: '0.05em' }}>🚨 ALERT DISPATCHED</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>Nearest units notified — ETA ~4 minutes</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Incident ID: INC-2848 | Tracking active</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero SOS Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, var(--bg-surface), var(--bg-card))',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xl)', padding: '2rem 1.5rem',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: '0.5rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(ellipse at center top, rgba(239,68,68,0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--text-primary)' }}>
            Emergency Response
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Your safety, our priority. Help is one press away.</div>
        </div>
        <SOSButton onPress={handleSOS} />
      </motion.div>

      {/* Quick Action Grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ marginBottom: '1.5rem' }}
      >
        <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.14em', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '0.75rem', paddingLeft: '0.25rem' }}>
          QUICK ACTIONS
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          {[
            { label: 'Report Emergency', desc: 'Detailed incident form', icon: AlertTriangle, color: 'var(--critical)', to: '/report' },
            { label: 'Nearby Services', desc: 'Hospitals, police, fire', icon: MapPin, color: 'var(--accent-primary)', to: '/services' },
            { label: 'Track Incident', desc: 'Follow your report', icon: Activity, color: 'var(--active)', to: '/track' },
            { label: 'Safety Tips', desc: 'Emergency guidelines', icon: BookOpen, color: 'var(--medium)', to: '/tips' },
          ].map(({ label, desc, icon: Icon, color, to }) => (
            <motion.button
              key={to} whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }}
              onClick={() => navigate(to)}
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)', padding: '1rem',
                cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.2s',
                display: 'flex', flexDirection: 'column', gap: '0.4rem',
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                background: `rgba(${color === 'var(--critical)' ? '239,68,68' : color === 'var(--accent-primary)' ? '59,130,246' : color === 'var(--active)' ? '34,197,94' : '234,179,8'},0.12)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={17} color={color} />
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
              <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>{desc}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Emergency Type Quick Report */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        style={{ marginBottom: '1.5rem' }}
      >
        <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.14em', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '0.75rem', paddingLeft: '0.25rem' }}>
          QUICK REPORT
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {EMERGENCY_TYPES.map(({ icon: Icon, label, color, bg }) => (
            <motion.button
              key={label} whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/ReportEmergencyPage?type=${label.toLowerCase()}`)}
              style={{
                flexShrink: 0, background: bg, border: `1px solid ${color}40`,
                borderRadius: 'var(--radius-md)', padding: '0.75rem 1.1rem',
                cursor: 'pointer', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '0.4rem', minWidth: 80,
              }}
            >
              <Icon size={20} color={color} />
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Recent Incidents */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{ marginBottom: '1.5rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.14em', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            NEARBY INCIDENTS
          </div>
          <button onClick={() => navigate('/TrackIncidentPage')} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--accent-secondary)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.2rem',
          }}>
            View all <ChevronRight size={12} />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {RECENT_INCIDENTS.map((incident, i) => (
            <motion.div
              key={incident.id}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.07 }}
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-default)',
                borderLeft: `3px solid ${incident.color}`,
                borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{incident.id}</span>
                  <span style={{
                    background: `${incident.color}20`, color: incident.color,
                    fontSize: '0.62rem', fontWeight: 700, padding: '0.1rem 0.4rem',
                    borderRadius: '4px', letterSpacing: '0.06em',
                  }}>{incident.severity}</span>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{incident.type}</div>
                <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <MapPin size={10} /> {incident.location}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{incident.time}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: incident.status === 'Resolved' ? 'var(--active)' : incident.status === 'Active' ? 'var(--critical)' : 'var(--medium)' }}>
                  {incident.status}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Emergency Numbers */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)', padding: '1rem',
        }}
      >
        <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.14em', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '0.75rem' }}>
          EMERGENCY CONTACTS — NEPAL
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
          {[
            { label: 'Nepal Police', number: '100', color: 'var(--accent-primary)' },
            { label: 'Ambulance', number: '102', color: 'var(--critical)' },
            { label: 'Fire Brigade', number: '101', color: 'var(--high)' },
            { label: 'NDRRMA', number: '1144', color: 'var(--medium)' },
          ].map(({ label, number, color }) => (
            <a key={number} href={`tel:${number}`} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)', padding: '0.65rem 0.85rem',
              textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem',
            }}>
              <Phone size={13} color={color} />
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{label}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 700, color }}>
                  {number}
                </div>
              </div>
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}