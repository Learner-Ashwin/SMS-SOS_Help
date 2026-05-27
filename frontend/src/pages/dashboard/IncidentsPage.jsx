import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow, format } from 'date-fns';
import toast from 'react-hot-toast';
import {
  Search, Filter, Download, RefreshCw, MapPin, Clock,
  CheckCircle, AlertTriangle, ChevronDown, ChevronUp,
  User, Phone, Camera, X, Eye, UserCheck, MessageSquare
} from 'lucide-react';

const ALL_INCIDENTS = [
  { id: 'INC-2848', type: 'Fire', location: 'Thamel, Kathmandu', severity: 'critical', status: 'Active', time: new Date(Date.now() - 480000), team: 'Alpha-1', reporter: 'Sita Thapa', phone: '980-1234567', desc: 'Building fire reported on 3rd floor of residential complex. Evacuation in progress. 12 residents displaced.', images: 2 },
  { id: 'INC-2847', type: 'Accident', location: 'Ring Road, Lalitpur', severity: 'high', status: 'Responding', time: new Date(Date.now() - 1320000), team: 'Beta-2', reporter: 'Ram Shrestha', phone: '984-7654321', desc: 'Multi-vehicle collision involving 3 cars and 1 motorcycle. 4 injured, 1 serious.', images: 3 },
  { id: 'INC-2846', type: 'Flood', location: 'Bagmati River, Patan', severity: 'high', status: 'Responding', time: new Date(Date.now() - 2400000), team: 'Delta-1', reporter: 'Anonymous', phone: '—', desc: 'River overflow after heavy monsoon. 2 households in danger zone, road blocked.', images: 1 },
  { id: 'INC-2845', type: 'Medical', location: 'Bhaktapur Durbar Square', severity: 'medium', status: 'Resolved', time: new Date(Date.now() - 3000000), team: 'Med-3', reporter: 'Hari Maharjan', phone: '981-9876543', desc: 'Elderly tourist collapsed. Suspected cardiac event. Rushed to Bhaktapur Hospital.', images: 0 },
  { id: 'INC-2844', type: 'Crime', location: 'New Baneshwor, KTM', severity: 'medium', status: 'Resolved', time: new Date(Date.now() - 4200000), team: 'Alpha-3', reporter: 'Lila Karki', phone: '985-3216547', desc: 'Bag snatching incident. Suspect on motorbike, partial plate number noted.', images: 1 },
  { id: 'INC-2843', type: 'Fire', location: 'Bouddha, KTM', severity: 'low', status: 'Resolved', time: new Date(Date.now() - 7200000), team: 'Gamma-2', reporter: 'Sanjay Pande', phone: '980-1112233', desc: 'Small kitchen fire at restaurant. Extinguished before units arrived.', images: 0 },
  { id: 'INC-2842', type: 'Flood', location: 'Bishnumati, KTM', severity: 'critical', status: 'Active', time: new Date(Date.now() - 600000), team: 'Delta-2', reporter: 'Radha Gurung', phone: '984-5554433', desc: 'Severe flooding. 8 families stranded on rooftops. Urgent rescue needed.', images: 4 },
  { id: 'INC-2841', type: 'Medical', location: 'Putalisadak, KTM', severity: 'high', status: 'Responding', time: new Date(Date.now() - 900000), team: 'Med-1', reporter: 'Gopal Basnet', phone: '981-7778899', desc: 'Serious road accident victim. Multiple fractures reported. ICU required.', images: 2 },
];

const SEVERITY_COLOR = { critical: 'var(--critical)', high: 'var(--high)', medium: 'var(--medium)', low: 'var(--low)' };
const STATUS_COLOR = { Active: 'var(--critical)', Responding: 'var(--medium)', Resolved: 'var(--active)' };

function IncidentDetail({ incident, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
      style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, zIndex: 200,
        background: 'var(--bg-surface)', borderLeft: '1px solid var(--border-active)',
        padding: '1.5rem', overflowY: 'auto', boxShadow: '-8px 0 40px rgba(0,0,0,0.4)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>{incident.id}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>{incident.type} Emergency</div>
        </div>
        <button onClick={onClose} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '0.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>
          <X size={15} />
        </button>
      </div>

      {/* Status badges */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <span style={{ background: `${SEVERITY_COLOR[incident.severity]}18`, color: SEVERITY_COLOR[incident.severity], fontSize: '0.72rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: '4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{incident.severity}</span>
        <span style={{ background: `${STATUS_COLOR[incident.status]}18`, color: STATUS_COLOR[incident.status], fontSize: '0.72rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: '4px' }}>{incident.status}</span>
        {incident.images > 0 && <span style={{ background: 'var(--accent-dim)', color: 'var(--accent-secondary)', fontSize: '0.72rem', fontWeight: 600, padding: '0.25rem 0.65rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Camera size={10} /> {incident.images}</span>}
      </div>

      {/* Info rows */}
      {[
        { label: 'Location', value: incident.location, icon: MapPin },
        { label: 'Reported', value: formatDistanceToNow(incident.time, { addSuffix: true }), icon: Clock },
        { label: 'Assigned Team', value: incident.team, icon: User },
        { label: 'Reporter', value: incident.reporter, icon: User },
        { label: 'Phone', value: incident.phone, icon: Phone },
      ].map(({ label, value, icon: Icon }) => (
        <div key={label} style={{ display: 'flex', gap: '0.75rem', padding: '0.65rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
          <Icon size={13} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{label}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 500 }}>{value}</div>
          </div>
        </div>
      ))}

      {/* Description */}
      <div style={{ margin: '1rem 0', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', padding: '0.85rem', border: '1px solid var(--border-default)' }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>INCIDENT DESCRIPTION</div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{incident.desc}</div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {incident.status !== 'Resolved' && (
          <>
            <button onClick={() => { toast.success(`${incident.id} marked as Resolved`); onClose(); }} style={{
              background: 'var(--low-dim)', border: '1px solid rgba(34,197,94,0.3)',
              color: 'var(--active)', borderRadius: 'var(--radius-md)', padding: '0.75rem',
              cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
            }}>
              <CheckCircle size={15} /> Mark as Resolved
            </button>
            <button style={{
              background: 'var(--accent-dim)', border: '1px solid var(--border-active)',
              color: 'var(--accent-secondary)', borderRadius: 'var(--radius-md)', padding: '0.75rem',
              cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
            }}>
              <UserCheck size={15} /> Reassign Team
            </button>
          </>
        )}
        <button style={{
          background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
          color: 'var(--text-secondary)', borderRadius: 'var(--radius-md)', padding: '0.75rem',
          cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
        }}>
          <MessageSquare size={15} /> Add Update
        </button>
      </div>
    </motion.div>
  );
}

export default function IncidentsPage() {
  const [search, setSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortField, setSortField] = useState('time');
  const [sortDir, setSortDir] = useState('desc');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    return ALL_INCIDENTS
      .filter(inc => {
        if (search && !`${inc.id} ${inc.type} ${inc.location} ${inc.desc}`.toLowerCase().includes(search.toLowerCase())) return false;
        if (filterSeverity !== 'all' && inc.severity !== filterSeverity) return false;
        if (filterStatus !== 'all' && inc.status !== filterStatus) return false;
        if (filterType !== 'all' && inc.type !== filterType) return false;
        return true;
      })
      .sort((a, b) => {
        let av = a[sortField], bv = b[sortField];
        if (sortField === 'time') { av = a.time.getTime(); bv = b.time.getTime(); }
        return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
      });
  }, [search, filterSeverity, filterStatus, filterType, sortField, sortDir]);

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const SortIcon = ({ field }) => sortField === field
    ? (sortDir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />)
    : null;

  const selectStyle = {
    background: 'var(--bg-card)', border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-sm)', padding: '0.45rem 0.75rem',
    color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer',
    fontFamily: 'var(--font-body)', outline: 'none',
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.16em', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '0.3rem' }}>OPERATIONS</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>Incident Management</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            {filtered.length} incidents · {ALL_INCIDENTS.filter(i => i.status === 'Active').length} active · {ALL_INCIDENTS.filter(i => i.severity === 'critical').length} critical
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '0.45rem 0.85rem', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Download size={13} /> Export
          </button>
          <button style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '0.45rem 0.85rem', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <RefreshCw size={13} /> Sync
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)', padding: '0.85rem 1rem',
        display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search incidents, locations, IDs..."
            style={{ width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.75rem 0.5rem 2.25rem', color: 'var(--text-primary)', fontSize: '0.82rem', outline: 'none', fontFamily: 'var(--font-body)' }}
          />
          {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}><X size={12} /></button>}
        </div>

        <select value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)} style={selectStyle}>
          <option value="all">All Severity</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={selectStyle}>
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Responding">Responding</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select value={filterType} onChange={e => setFilterType(e.target.value)} style={selectStyle}>
          <option value="all">All Types</option>
          <option value="Fire">Fire</option>
          <option value="Medical">Medical</option>
          <option value="Flood">Flood</option>
          <option value="Accident">Accident</option>
          <option value="Crime">Crime</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {/* Table Head */}
        <div style={{ display: 'grid', gridTemplateColumns: '90px 100px 1fr 140px 120px 110px 90px', gap: 0, borderBottom: '1px solid var(--border-default)', background: 'var(--bg-elevated)' }}>
          {[
            { key: 'id', label: 'ID' },
            { key: 'severity', label: 'Severity' },
            { key: 'type', label: 'Type & Location' },
            { key: 'time', label: 'Reported' },
            { key: 'team', label: 'Team' },
            { key: 'status', label: 'Status' },
            { key: 'actions', label: '' },
          ].map(({ key, label }) => (
            <div
              key={key}
              onClick={() => key !== 'actions' && handleSort(key)}
              style={{
                padding: '0.65rem 0.85rem', fontSize: '0.68rem', fontWeight: 700,
                color: 'var(--text-muted)', letterSpacing: '0.1em', cursor: key !== 'actions' ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', gap: '0.25rem',
                userSelect: 'none',
              }}
            >
              {label} <SortIcon field={key} />
            </div>
          ))}
        </div>

        {/* Table Rows */}
        <AnimatePresence>
          {filtered.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No incidents match your filters
            </div>
          ) : (
            filtered.map((inc, i) => (
              <motion.div
                key={inc.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                style={{
                  display: 'grid', gridTemplateColumns: '90px 100px 1fr 140px 120px 110px 90px',
                  borderBottom: '1px solid var(--border-subtle)',
                  borderLeft: `3px solid ${SEVERITY_COLOR[inc.severity]}`,
                  background: selected?.id === inc.id ? 'var(--accent-dim)' : inc.status === 'Active' ? `${SEVERITY_COLOR[inc.severity]}05` : 'transparent',
                  transition: 'background 0.15s',
                  cursor: 'pointer',
                }}
                onClick={() => setSelected(inc)}
              >
                {/* ID */}
                <div style={{ padding: '0.9rem 0.85rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                  {inc.id}
                </div>

                {/* Severity */}
                <div style={{ padding: '0.9rem 0.85rem', display: 'flex', alignItems: 'center' }}>
                  <span style={{
                    background: `${SEVERITY_COLOR[inc.severity]}18`,
                    color: SEVERITY_COLOR[inc.severity],
                    fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem',
                    borderRadius: '4px', letterSpacing: '0.06em', textTransform: 'uppercase',
                    boxShadow: inc.severity === 'critical' ? `0 0 8px ${SEVERITY_COLOR[inc.severity]}30` : 'none',
                  }}>{inc.severity}</span>
                </div>

                {/* Type & Location */}
                <div style={{ padding: '0.9rem 0.85rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.15rem' }}>{inc.type}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={9} /> {inc.location}
                  </div>
                </div>

                {/* Time */}
                <div style={{ padding: '0.9rem 0.85rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{formatDistanceToNow(inc.time, { addSuffix: true })}</div>
                  <div style={{ fontSize: '0.67rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{format(inc.time, 'HH:mm')}</div>
                </div>

                {/* Team */}
                <div style={{ padding: '0.9rem 0.85rem', display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>{inc.team}</span>
                </div>

                {/* Status */}
                <div style={{ padding: '0.9rem 0.85rem', display: 'flex', alignItems: 'center' }}>
                  <span style={{
                    background: `${STATUS_COLOR[inc.status]}18`, color: STATUS_COLOR[inc.status],
                    fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: '4px',
                    display: 'flex', alignItems: 'center', gap: '0.3rem',
                  }}>
                    {inc.status === 'Active' && <span className="live-dot live-dot-critical" style={{ width: 5, height: 5 }} />}
                    {inc.status}
                  </span>
                </div>

                {/* Action */}
                <div style={{ padding: '0.9rem 0.85rem', display: 'flex', alignItems: 'center' }}>
                  <button style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '0.3rem 0.6rem', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem' }}>
                    <Eye size={11} /> View
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'black', zIndex: 199 }}
              onClick={() => setSelected(null)}
            />
            <IncidentDetail incident={selected} onClose={() => setSelected(null)} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}