import { useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import {
  Search, ClipboardList, Clock, CheckCircle2, AlertTriangle,
  Loader2, ChevronDown, ChevronUp, MapPin, Phone, Calendar,
  Siren, Shield, Activity, CircleDot
} from 'lucide-react';

const STATUS_META = {
  pending: {
    label: 'Pending',
    icon: Clock,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    badge: 'bg-yellow-500/20 text-yellow-300',
    dot: 'bg-yellow-400',
  },
  assigned: {
    label: 'Team Assigned',
    icon: Shield,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    badge: 'bg-blue-500/20 text-blue-300',
    dot: 'bg-blue-400',
  },
  responding: {
    label: 'Responding',
    icon: Activity,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    badge: 'bg-orange-500/20 text-orange-300',
    dot: 'bg-orange-400 animate-pulse',
  },
  resolved: {
    label: 'Resolved',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/20 text-emerald-300',
    dot: 'bg-emerald-400',
  },
};

const SEVERITY_META = {
  critical: { label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/15 text-red-300' },
  high:     { label: 'High',     color: 'text-orange-400', bg: 'bg-orange-500/15 text-orange-300' },
  medium:   { label: 'Medium',   color: 'text-yellow-400', bg: 'bg-yellow-500/15 text-yellow-300' },
  low:      { label: 'Low',      color: 'text-blue-400', bg: 'bg-blue-500/15 text-blue-300' },
};

const TIMELINE_STEPS = [
  { key: 'submitted',  label: 'Report Submitted',     desc: 'Your emergency report has been received.' },
  { key: 'reviewing',  label: 'Under Review',         desc: 'Dispatch team is assessing the situation.' },
  { key: 'assigned',   label: 'Team Assigned',        desc: 'A response team has been dispatched.' },
  { key: 'responding', label: 'Team En Route',        desc: 'Responders are on their way to your location.' },
  { key: 'resolved',   label: 'Incident Resolved',    desc: 'The situation has been handled successfully.' },
];

function getTimelineIndex(status) {
  const map = { pending: 1, assigned: 2, responding: 3, resolved: 4 };
  return map[status] ?? 0;
}

function IncidentCard({ incident }) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_META[incident.status] || STATUS_META.pending;
  const severity = SEVERITY_META[incident.severity] || SEVERITY_META.medium;
  const StatusIcon = status.icon;
  const timelineIdx = getTimelineIndex(incident.status);

  const formatDate = (ts) => {
    if (!ts) return '—';
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString('en-NP', { dateStyle: 'medium', timeStyle: 'short' });
  };

  return (
    <div className={`rounded-2xl border ${status.border} ${status.bg} overflow-hidden transition-all duration-300`}>
      {/* Card Header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 p-2 rounded-lg bg-black/20 border ${status.border}`}>
            <StatusIcon size={16} className={status.color} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <p className="text-xs text-white/40 font-mono">#{incident.id?.slice(0, 8).toUpperCase()}</p>
                <h3 className="text-sm font-bold text-white leading-tight mt-0.5">{incident.incidentType || 'Emergency Report'}</h3>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${severity.bg}`}>
                  {severity.label}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${status.badge}`}>
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-white/40">
              {incident.location && (
                <span className="flex items-center gap-1"><MapPin size={10} /> {incident.location}</span>
              )}
              <span className="flex items-center gap-1"><Calendar size={10} /> {formatDate(incident.createdAt)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 mt-3 text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          {expanded ? 'Hide details' : 'View timeline & details'}
        </button>
      </div>

      {/* Expanded section */}
      {expanded && (
        <div className="border-t border-white/8 p-4 space-y-5">
          {/* Description */}
          {incident.description && (
            <div>
              <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1.5">Description</p>
              <p className="text-sm text-white/80 leading-relaxed">{incident.description}</p>
            </div>
          )}

          {/* Assigned team */}
          {incident.assignedTeam && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-black/20 border border-white/8">
              <Shield size={14} className="text-blue-400" />
              <div>
                <p className="text-xs text-white/40">Assigned Team</p>
                <p className="text-sm font-semibold text-white">{incident.assignedTeam}</p>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Response Timeline</p>
            <div className="space-y-0">
              {TIMELINE_STEPS.map((step, i) => {
                const done = i < timelineIdx;
                const active = i === timelineIdx;
                return (
                  <div key={step.key} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        done
                          ? 'border-emerald-500 bg-emerald-500'
                          : active
                          ? `border-current ${status.color} bg-current/20`
                          : 'border-white/20 bg-transparent'
                      }`}>
                        {done && <CheckCircle2 size={12} className="text-white" />}
                        {active && <CircleDot size={10} className={status.color} />}
                      </div>
                      {i < TIMELINE_STEPS.length - 1 && (
                        <div className={`w-0.5 h-8 mt-0.5 ${done ? 'bg-emerald-500/50' : 'bg-white/10'}`} />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className={`text-sm font-semibold leading-tight ${done || active ? 'text-white' : 'text-white/30'}`}>
                        {step.label}
                      </p>
                      <p className={`text-xs mt-0.5 ${done || active ? 'text-white/50' : 'text-white/20'}`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackIncidentPage() {
  const [searchMode, setSearchMode] = useState('phone'); // 'phone' | 'id'
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setLoading(true);
    setError('');
    setResults(null);
    setSearched(true);

    try {
      const incidentsRef = collection(db, 'incidents');
      let q;

      if (searchMode === 'phone') {
        q = query(
          incidentsRef,
          where('reporterPhone', '==', inputValue.trim()),
          orderBy('createdAt', 'desc')
        );
      } else {
        // Search by incident ID prefix — fetch and filter client-side
        q = query(incidentsRef, orderBy('createdAt', 'desc'));
      }

      const snapshot = await getDocs(q);
      let docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

      if (searchMode === 'id') {
        docs = docs.filter(d => d.id.toLowerCase().startsWith(inputValue.trim().toLowerCase()));
      }

      setResults(docs);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base, #0a0c10)' }}>
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-white/8 backdrop-blur-md" style={{ background: 'rgba(10,12,16,0.92)' }}>
        <div className="max-w-xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/15 border border-violet-500/30">
              <ClipboardList size={18} className="text-violet-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">Track Incident</h1>
              <p className="text-xs text-white/50">Check status of your emergency report</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
        {/* Search Mode Toggle */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/8">
          {['phone', 'id'].map(mode => (
            <button
              key={mode}
              onClick={() => { setSearchMode(mode); setResults(null); setSearched(false); setInputValue(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                searchMode === mode
                  ? 'bg-white text-black shadow'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              {mode === 'phone' ? 'By Phone Number' : 'By Incident ID'}
            </button>
          ))}
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="relative">
            {searchMode === 'phone'
              ? <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              : <Siren size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            }
            <input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder={searchMode === 'phone' ? 'e.g. 9841000000' : 'e.g. A1B2C3D4'}
              className="w-full pl-9 pr-4 py-3 rounded-xl bg-white/6 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/25 focus:bg-white/8 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600 text-white font-bold text-sm hover:bg-violet-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
            {loading ? 'Searching…' : 'Find My Reports'}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            <AlertTriangle size={14} /> {error}
          </div>
        )}

        {/* Results */}
        {searched && !loading && results !== null && (
          <div>
            {results.length === 0 ? (
              <div className="text-center py-16">
                <ClipboardList size={40} className="mx-auto mb-4 text-white/20" />
                <p className="text-white/50 font-semibold">No reports found</p>
                <p className="text-sm text-white/30 mt-1">
                  {searchMode === 'phone'
                    ? 'No incidents were found for this phone number.'
                    : 'No incident found with this ID.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">
                    {results.length} Report{results.length !== 1 ? 's' : ''} Found
                  </p>
                </div>
                {results.map(incident => (
                  <IncidentCard key={incident.id} incident={incident} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Helper text */}
        {!searched && (
          <div className="p-4 rounded-xl bg-white/4 border border-white/8 text-sm text-white/40 space-y-2">
            <p className="font-semibold text-white/60 flex items-center gap-2">
              <AlertTriangle size={13} /> How to track your report
            </p>
            <ul className="space-y-1 text-xs list-disc list-inside ml-1">
              <li>Use the phone number you submitted your emergency report with.</li>
              <li>Or use the Incident ID you received after filing the report.</li>
              <li>Contact <strong className="text-white/60">100</strong> if you need immediate assistance.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}