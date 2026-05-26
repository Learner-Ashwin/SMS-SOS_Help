import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Shield, Eye, EyeOff, Loader2, Lock, User, AlertTriangle, ChevronRight } from 'lucide-react';

const ROLES = [
  { value: 'police', label: 'Police / Security', color: '#3b82f6' },
  { value: 'medical', label: 'Medical / EMS', color: '#ef4444' },
  { value: 'fire', label: 'Fire Brigade', color: '#f97316' },
  { value: 'admin', label: 'Admin / Dispatch', color: '#8b5cf6' },
];

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '', role: 'police' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    toast.success(`Welcome back, Officer ${form.username}!`);
    navigate('/dashboard');
  };

  const inputStyle = {
    width: '100%',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)',
    padding: '0.75rem 0.85rem 0.75rem 2.75rem',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div>
      {/* Card */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-elevated)',
      }}>
        {/* Header */}
        <div style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(220,38,38,0.12), rgba(59,130,246,0.08))',
          borderBottom: '1px solid var(--border-default)',
          textAlign: 'center',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <motion.div
              animate={{ boxShadow: ['0 0 20px rgba(220,38,38,0.3)', '0 0 40px rgba(220,38,38,0.5)', '0 0 20px rgba(220,38,38,0.3)'] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: 64, height: 64, borderRadius: 18,
                background: 'linear-gradient(135deg, var(--sos), #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Shield size={32} color="white" />
            </motion.div>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 900, letterSpacing: '0.08em', color: 'var(--text-primary)', lineHeight: 1 }}>
            AASHRAYA
          </div>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.2em', color: 'var(--text-muted)', marginTop: '0.3rem', fontFamily: 'var(--font-mono)' }}>
            EMERGENCY COORDINATION PLATFORM
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Authorized personnel only
          </div>
        </div>

        {/* Form */}
        <div style={{ padding: '1.75rem' }}>
          <form onSubmit={handleSubmit}>
            {/* Role selector */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                ACCESS ROLE
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                {ROLES.map(({ value, label, color }) => (
                  <button
                    key={value} type="button"
                    onClick={() => setForm(f => ({ ...f, role: value }))}
                    style={{
                      background: form.role === value ? `${color}18` : 'var(--bg-elevated)',
                      border: `1px solid ${form.role === value ? color : 'var(--border-default)'}`,
                      borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.6rem',
                      cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
                      color: form.role === value ? color : 'var(--text-muted)',
                      transition: 'all 0.18s', textAlign: 'center',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Username */}
            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                BADGE ID / USERNAME
              </label>
              <div style={{ position: 'relative' }}>
                <User size={14} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  placeholder="Enter your badge ID..."
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={14} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Enter your password..."
                  style={{ ...inputStyle, paddingRight: '2.75rem' }}
                />
                <button
                  type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit" whileTap={{ scale: 0.97 }}
              disabled={loading}
              style={{
                width: '100%', padding: '0.85rem',
                background: loading ? 'var(--bg-elevated)' : 'linear-gradient(135deg, var(--accent-primary), #2563eb)',
                border: '1px solid var(--border-active)',
                borderRadius: 'var(--radius-md)', cursor: loading ? 'not-allowed' : 'pointer',
                color: loading ? 'var(--text-muted)' : 'white',
                fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.05em',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                boxShadow: loading ? 'none' : '0 0 20px var(--accent-primary-glow)',
                transition: 'all 0.2s',
              }}
            >
              {loading ? (
                <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Authenticating...</>
              ) : (
                <>Access Dashboard <ChevronRight size={16} /></>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div style={{ margin: '1.25rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
          </div>

          {/* Citizen link */}
          <button
            onClick={() => navigate('/')}
            style={{
              width: '100%', padding: '0.75rem',
              background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)', cursor: 'pointer',
              color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500,
            }}
          >
            Continue as Citizen →
          </button>
        </div>

        {/* Security notice */}
        <div style={{
          padding: '0.85rem 1.75rem',
          borderTop: '1px solid var(--border-default)',
          background: 'var(--bg-deep)',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          fontSize: '0.68rem', color: 'var(--text-muted)',
        }}>
          <AlertTriangle size={10} color="var(--medium)" />
          <span>All access is logged and monitored. Unauthorized access is a criminal offense.</span>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
          TEAM AEGIS · AASHRAYA v1.0
        </div>
        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          Advanced Emergency Guidance & Integrated Support
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}