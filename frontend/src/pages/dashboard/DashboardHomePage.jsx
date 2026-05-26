import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import {
  AlertTriangle, Users, CheckCircle, Clock, Zap, TrendingUp, TrendingDown,
  MapPin, Phone, Radio, ArrowRight, Activity, ChevronRight, RefreshCw
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Mock Data
const LIVE_INCIDENTS = [
  { id: 'INC-2848', type: 'Fire', location: 'Thamel, KTM', lat: 27.7172, lng: 85.3240, severity: 'critical', status: 'Active', time: new Date(Date.now() - 480000), team: 'Alpha-1', desc: 'Building fire, 3 floors affected' },
  { id: 'INC-2847', type: 'Accident', location: 'Ring Road, Lalitpur', lat: 27.6710, lng: 85.3240, severity: 'high', status: 'Responding', time: new Date(Date.now() - 1320000), team: 'Beta-2', desc: 'Multi-vehicle collision, 4 injured' },
  { id: 'INC-2846', type: 'Flood', location: 'Bagmati, Patan', lat: 27.6588, lng: 85.3247, severity: 'high', status: 'Responding', time: new Date(Date.now() - 2400000), team: 'Delta-1', desc: 'River overflow, 2 households affected' },
  { id: 'INC-2845', type: 'Medical', location: 'Bhaktapur Durbar', lat: 27.6710, lng: 85.4298, severity: 'medium', status: 'Resolved', time: new Date(Date.now() - 3000000), team: 'Med-3', desc: 'Cardiac arrest, patient stabilized' },
  { id: 'INC-2844', type: 'Crime', location: 'New Baneshwor', lat: 27.6870, lng: 85.3416, severity: 'medium', status: 'Resolved', time: new Date(Date.now() - 4200000), team: 'Alpha-3', desc: 'Robbery report, suspects identified' },
];

const AREA_DATA = [
  { time: '00:00', incidents: 2 }, { time: '04:00', incidents: 1 }, { time: '08:00', incidents: 5 },
  { time: '12:00', incidents: 8 }, { time: '16:00', incidents: 11 }, { time: '20:00', incidents: 7 }, { time: '23:00', incidents: 4 },
];

const SEVERITY_DATA = [
  { name: 'Critical', value: 3, color: '#ef4444' },
  { name: 'High', value: 7, color: '#f97316' },
  { name: 'Medium', value: 12, color: '#eab308' },
  { name: 'Low', value: 5, color: '#22c55e' },
];

const TEAMS = [
  { name: 'Alpha-1', status: 'Deployed', location: 'Thamel', type: 'Fire', members: 4 },
  { name: 'Beta-2', status: 'En Route', location: 'Ring Road', type: 'Medical', members: 3 },
  { name: 'Delta-1', status: 'On Scene', location: 'Patan', type: 'Rescue', members: 6 },
  { name: 'Gamma-3', status: 'Standby', location: 'HQ', type: 'Police', members: 5 },
];

const SEVERITY_COLOR = { critical: 'var(--critical)', high: 'var(--high)', medium: 'var(--medium)', low: 'var(--low)' };
const STATUS_COLOR = { Active: 'var(--critical)', Responding: 'var(--medium)', Resolved: 'var(--active)', Standby: 'var(--text-muted)' };

function StatCard({ icon: Icon, label, value, sub, trend, color, glow }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      style={{
        background: 'var(--bg-card)', border: `1px solid ${color}30`,
        borderRadius: 'var(--radius-lg)', padding: '1.25rem',
        position: 'relative', overflow: 'hidden',
        boxShadow: glow ? `0 0 24px ${color}20` : 'none',
      }}
    >
      <div style={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120, borderRadius: '50%', background: `radial-gradient(circle, ${color}12 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} color={color} />
        </div>
        {trend !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', color: trend > 0 ? 'var(--critical)' : 'var(--active)' }}>
            {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.1rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, marginBottom: '0.25rem' }}>{value}</div>
      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</div>
      {sub && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{sub}</div>}
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-active)', borderRadius: 'var(--radius-sm)', padding: '0.6rem 0.85rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
      <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{label}</div>
      <div style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>{payload[0]?.value} incidents</div>
    </div>
  );
};

export default function DashboardHomePage() {
  const [tick, setTick] = useState(0);
  const navigate = useNavigate();

  // Simulate live updates
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ padding: '1.5rem', maxWidth: 1400, margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.16em', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '0.3rem' }}>
            COMMAND CENTER
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '0.03em' }}>
            Live Operations
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            Kathmandu Metropolitan Area — Real-time incident monitoring
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--low-dim)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 'var(--radius-sm)', padding: '0.4rem 0.75rem' }}>
            <span className="live-dot" />
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--active)', fontWeight: 600 }}>LIVE</span>
          </div>
          <button style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '0.4rem 0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
            <RefreshCw size={13} /> Sync
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard icon={AlertTriangle} label="Active Incidents" value="27" sub="3 critical" trend={12} color="#ef4444" glow />
        <StatCard icon={Users} label="Teams Deployed" value="14" sub="8 on scene" color="#3b82f6" />
        <StatCard icon={CheckCircle} label="Resolved Today" value="43" sub="+8 from yesterday" trend={-5} color="#22c55e" />
        <StatCard icon={Clock} label="Avg Response" value="4.2m" sub="Target: 5 min" color="#eab308" />
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1rem', marginBottom: '1rem' }}>
        {/* Incident Queue */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Active Incidents</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Priority-sorted queue</div>
            </div>
            <button onClick={() => navigate('/dashboard/incidents')} style={{
              background: 'var(--accent-dim)', border: '1px solid var(--border-active)',
              color: 'var(--accent-secondary)', borderRadius: 'var(--radius-sm)', padding: '0.35rem 0.75rem',
              cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem',
            }}>
              View All <ChevronRight size={13} />
            </button>
          </div>

          <div>
            {LIVE_INCIDENTS.map((inc, i) => (
              <motion.div
                key={inc.id}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                style={{
                  padding: '0.85rem 1.25rem', borderBottom: '1px solid var(--border-subtle)',
                  borderLeft: `3px solid ${SEVERITY_COLOR[inc.severity]}`,
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  background: i === 0 ? `${SEVERITY_COLOR[inc.severity]}06` : 'transparent',
                  cursor: 'pointer', transition: 'background 0.15s',
                }}
              >
                {/* Severity indicator */}
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: SEVERITY_COLOR[inc.severity],
                    boxShadow: inc.status === 'Active' ? `0 0 8px ${SEVERITY_COLOR[inc.severity]}` : 'none',
                    margin: '0 auto 4px',
                    animation: inc.status === 'Active' ? 'live-dot 1.5s ease-in-out infinite' : 'none',
                  }} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>{inc.id}</span>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{inc.type}</span>
                    <span style={{
                      background: `${SEVERITY_COLOR[inc.severity]}18`,
                      color: SEVERITY_COLOR[inc.severity],
                      fontSize: '0.6rem', fontWeight: 700, padding: '0.1rem 0.4rem',
                      borderRadius: '4px', letterSpacing: '0.06em', textTransform: 'uppercase',
                    }}>{inc.severity}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.1rem' }}>
                    <MapPin size={10} /> {inc.location}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{inc.desc}</div>
                </div>

                <div style={{ flexShrink: 0, textAlign: 'right' }}>
                  <div style={{
                    fontSize: '0.68rem', fontWeight: 700, color: STATUS_COLOR[inc.status],
                    background: `${STATUS_COLOR[inc.status]}18`,
                    padding: '0.15rem 0.5rem', borderRadius: '4px', marginBottom: '0.3rem',
                  }}>{inc.status}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {formatDistanceToNow(inc.time, { addSuffix: true })}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--accent-secondary)' }}>→ {inc.team}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Charts + Teams */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Severity Breakdown */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '1rem' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>Severity Breakdown</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <PieChart width={110} height={110}>
                <Pie data={SEVERITY_DATA} cx={55} cy={55} innerRadius={32} outerRadius={50} dataKey="value" strokeWidth={0}>
                  {SEVERITY_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {SEVERITY_DATA.map(({ name, value, color }) => (
                  <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 4px ${color}` }} />
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{name}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Teams */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '1rem', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Teams</div>
              <button onClick={() => navigate('/dashboard/teams')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-secondary)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                Manage <ArrowRight size={11} />
              </button>
            </div>
            {TEAMS.map((team, i) => (
              <div key={team.name} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.6rem 0', borderBottom: i < TEAMS.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: team.status === 'Standby' ? 'var(--text-muted)' : team.status === 'Deployed' ? 'var(--critical)' : 'var(--active)',
                  boxShadow: team.status !== 'Standby' ? `0 0 6px ${team.status === 'Deployed' ? 'var(--critical-glow)' : 'var(--active-glow)'}` : 'none',
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{team.name}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'flex', gap: '0.3rem' }}>
                    <MapPin size={8} /> {team.location} · {team.type}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 600, color: team.status === 'Standby' ? 'var(--text-muted)' : team.status === 'Deployed' ? 'var(--critical)' : 'var(--active)' }}>
                    {team.status}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem', justifyContent: 'flex-end' }}>
                    <Users size={8} /> {team.members}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Trend Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Incident Trend */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Today's Incident Trend</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Hourly distribution — Last 24 hours</div>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={AREA_DATA}>
              <defs>
                <linearGradient id="incidentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#475569', fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="incidents" stroke="#3b82f6" strokeWidth={2} fill="url(#incidentGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>Activity Feed</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {[
              { text: 'Alpha-1 arrived at Thamel fire scene', time: '2m ago', color: 'var(--critical)', icon: '🔴' },
              { text: 'INC-2847 — Ambulance dispatched to Ring Road', time: '8m ago', color: 'var(--high)', icon: '🟠' },
              { text: 'Beta-2 team status updated to En Route', time: '12m ago', color: 'var(--medium)', icon: '🟡' },
              { text: 'INC-2845 marked as Resolved — Bhaktapur', time: '41m ago', color: 'var(--active)', icon: '🟢' },
              { text: 'New SMS report received: Flooding near Bagmati', time: '55m ago', color: 'var(--accent-primary)', icon: '📱' },
            ].map(({ text, time, color, icon }, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                <div style={{ width: 24, height: 24, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
                  {icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{text}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.1rem' }}>{time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}