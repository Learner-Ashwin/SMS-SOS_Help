import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AuthLayout() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-void)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }} className="grid-bg">
      {/* Ambient background */}
      <div style={{
        position: 'absolute', top: '-20%', left: '-10%',
        width: '60%', height: '60%', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%',
        width: '60%', height: '60%', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        style={{ width: '100%', maxWidth: 460, padding: '1rem' }}
      >
        <Outlet />
      </motion.div>
    </div>
  );
}