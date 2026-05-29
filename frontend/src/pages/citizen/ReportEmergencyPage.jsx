import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  AlertTriangle, MapPin, Camera, Video, Mic, Upload,
  ChevronRight, ChevronLeft, Check, Loader2, X,
  Flame, Droplets, Heart, Car, Zap, ShieldAlert, User, Phone
} from 'lucide-react';

const STEPS = ['Type', 'Details', 'Location', 'Media', 'Review'];

const INCIDENT_TYPES = [
  { value: 'fire', label: 'Fire', icon: Flame, color: 'var(--high)', desc: 'Building, vehicle, or forest fire' },
  { value: 'medical', label: 'Medical', icon: Heart, color: 'var(--critical)', desc: 'Injury, illness, or health emergency' },
  { value: 'flood', label: 'Flood', icon: Droplets, color: '#38bdf8', desc: 'Flooding, waterlogging, or landslide' },
  { value: 'accident', label: 'Accident', icon: Car, color: 'var(--medium)', desc: 'Road accident or vehicle crash' },
  { value: 'crime', label: 'Crime', icon: ShieldAlert, color: 'var(--critical)', desc: 'Theft, assault, or suspicious activity' },
  { value: 'other', label: 'Other', icon: AlertTriangle, color: 'var(--accent-primary)', desc: 'Any other emergency situation' },
];

const SEVERITY_LEVELS = [
  { value: 'critical', label: 'Critical', desc: 'Life in immediate danger', color: 'var(--critical)' },
  { value: 'high', label: 'High', desc: 'Serious risk, urgent response', color: 'var(--high)' },
  { value: 'medium', label: 'Medium', desc: 'Moderate severity', color: 'var(--medium)' },
  { value: 'low', label: 'Low', desc: 'Non-urgent, needs attention', color: 'var(--low)' },
];

function StepIndicator({ current, total, labels }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '2rem' }}>
      {labels.map((label, i) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < labels.length - 1 ? 1 : 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: i < current ? 'var(--active)' : i === current ? 'var(--accent-primary)' : 'var(--bg-card)',
              border: `2px solid ${i < current ? 'var(--active)' : i === current ? 'var(--accent-primary)' : 'var(--border-default)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: i === current ? '0 0 12px var(--accent-primary-glow)' : 'none',
              transition: 'all 0.3s',
            }}>
              {i < current ? <Check size={13} color="white" /> : (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, color: i === current ? 'white' : 'var(--text-muted)' }}>{i + 1}</span>
              )}
            </div>
            <span style={{ fontSize: '0.6rem', color: i === current ? 'var(--accent-secondary)' : 'var(--text-muted)', fontWeight: i === current ? 600 : 400, whiteSpace: 'nowrap' }}>
              {label}
            </span>
          </div>
          {i < labels.length - 1 && (
            <div style={{
              flex: 1, height: 2, background: i < current ? 'var(--active)' : 'var(--border-default)',
              margin: '0 0.25rem', marginBottom: '1.2rem', transition: 'background 0.3s',
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function ReportEmergencyPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    type: '', severity: 'high', description: '', location: '', landmark: '',
    name: '', phone: '', anonymous: false, files: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [incidentId, setIncidentId] = useState('');
  const fileRef = useRef();
  const navigate = useNavigate();

  const updateField = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));
  const handleVoiceCommand = () => {
  alert("Voice button clicked");
};

  const handleSubmit = async () => {
  setSubmitting(true);

  try {
    const newIncidentId = 'INC-' + Date.now().toString().slice(-6);

    setIncidentId(newIncidentId);
    setSubmitted(true);
    toast.success('Emergency report submitted successfully!');
  } catch (error) {
    toast.error('Failed to submit report');
  } finally {
    setSubmitting(false);
  }
};

  const handleNext = () => {
    if (step === 0 && !formData.type) { toast.error('Please select an incident type'); return; }
    if (step < STEPS.length - 1) setStep(s => s + 1);
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '2rem 1rem', textAlign: 'center' }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          style={{
            background: 'var(--low-dim)', border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: 'var(--radius-xl)', padding: '3rem 2rem',
          }}
        >
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: 2, duration: 0.5 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%', background: 'var(--active)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
              boxShadow: '0 0 30px var(--active-glow)',
            }}>
              <Check size={36} color="white" />
            </div>
          </motion.div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Report Submitted
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Emergency services have been notified and will respond shortly.
          </div>
          <div style={{
            background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', padding: '1rem',
            border: '1px solid var(--border-default)', marginBottom: '1.5rem',
          }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>INCIDENT ID</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>{incidentId}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Save this to track your report</div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => navigate('/track')} style={{
              flex: 1, background: 'var(--accent-dim)', border: '1px solid var(--border-active)',
              color: 'var(--accent-secondary)', borderRadius: 'var(--radius-md)', padding: '0.75rem',
              cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
            }}>
              Track Incident
            </button>
            <button onClick={() => navigate('/')} style={{
              flex: 1, background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
              color: 'var(--text-secondary)', borderRadius: 'var(--radius-md)', padding: '0.75rem',
              cursor: 'pointer', fontSize: '0.85rem',
            }}>
              Go Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 580, margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.14em', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '0.4rem' }}>
          EMERGENCY REPORT
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
          Report an Incident
        </h1>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
          Provide accurate details for faster emergency response
        </p>
      </div>

      <StepIndicator current={step} total={STEPS.length} labels={STEPS} />

      {/* Step Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.22 }}
          style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xl)', padding: '1.5rem', marginBottom: '1rem',
          }}
        >
          {/* STEP 0: Type */}
          {step === 0 && (
            <div>
              <button
  onClick={handleVoiceCommand}
  style={{
    marginBottom: '1rem',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-default)',
    cursor: 'pointer'
  }}
>
  Voice Test
</button>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                What is the emergency? TEST
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                {INCIDENT_TYPES.map(({ value, label, icon: Icon, color, desc }) => (
                  <motion.button
                    key={value} whileTap={{ scale: 0.97 }}
                    onClick={() => updateField('type', value)}
                    style={{
                      background: formData.type === value ? `${color}18` : 'var(--bg-elevated)',
                      border: `2px solid ${formData.type === value ? color : 'var(--border-default)'}`,
                      borderRadius: 'var(--radius-md)', padding: '1rem 0.85rem',
                      cursor: 'pointer', textAlign: 'left',
                      boxShadow: formData.type === value ? `0 0 16px ${color}30` : 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Icon size={22} color={color} style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{label}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{desc}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1: Details */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                Describe the situation
              </div>

              {/* Severity */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Severity Level</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                  {SEVERITY_LEVELS.map(({ value, label, desc, color }) => (
                    <button key={value} onClick={() => updateField('severity', value)} style={{
                      background: formData.severity === value ? `${color}18` : 'var(--bg-elevated)',
                      border: `1px solid ${formData.severity === value ? color : 'var(--border-default)'}`,
                      borderRadius: 'var(--radius-sm)', padding: '0.6rem 0.75rem', cursor: 'pointer', textAlign: 'left',
                    }}>
                      <div style={{ fontWeight: 600, fontSize: '0.8rem', color }}>● {label}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                  Description <span style={{ color: 'var(--critical)' }}>*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={e => updateField('description', e.target.value)}
                  placeholder="Describe what's happening, number of people affected, visible dangers..."
                  rows={4}
                  style={{
                    width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-md)', padding: '0.75rem', color: 'var(--text-primary)',
                    fontSize: '0.85rem', fontFamily: 'var(--font-body)', resize: 'vertical', outline: 'none',
                    lineHeight: 1.6,
                  }}
                />
              </div>

              {/* People count */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>People Affected</label>
                  <input
                    type="number" min="1" placeholder="Est. number"
                    style={{
                      width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-sm)', padding: '0.6rem 0.75rem', color: 'var(--text-primary)',
                      fontSize: '0.85rem', fontFamily: 'var(--font-body)', outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Injuries</label>
                  <select style={{
                    width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-sm)', padding: '0.6rem 0.75rem', color: 'var(--text-primary)',
                    fontSize: '0.85rem', fontFamily: 'var(--font-body)', outline: 'none',
                  }}>
                    <option>Unknown</option>
                    <option>None visible</option>
                    <option>Minor injuries</option>
                    <option>Serious injuries</option>
                    <option>Fatalities</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Location */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                Where is the emergency?
              </div>

              {/* Auto location button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  navigator.geolocation?.getCurrentPosition(
                    pos => { updateField('location', `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`); toast.success('Location detected!'); },
                    () => toast.error('Could not detect location')
                  );
                }}
                style={{
                  background: 'var(--accent-dim)', border: '1px solid var(--border-active)',
                  borderRadius: 'var(--radius-md)', padding: '0.85rem',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent-secondary)',
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={18} color="var(--accent-primary)" />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Use My Current Location</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Automatically detects GPS coordinates</div>
                </div>
              </motion.button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
                or enter manually
                <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Address / Area</label>
                <input
                  value={formData.location}
                  onChange={e => updateField('location', e.target.value)}
                  placeholder="e.g. Thamel, Kathmandu or Boudha Chowk..."
                  style={{
                    width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-sm)', padding: '0.65rem 0.85rem', color: 'var(--text-primary)',
                    fontSize: '0.85rem', fontFamily: 'var(--font-body)', outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Nearest Landmark</label>
                <input
                  value={formData.landmark}
                  onChange={e => updateField('landmark', e.target.value)}
                  placeholder="e.g. Near Boudhanath Stupa, beside BHAT-BHATENI..."
                  style={{
                    width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-sm)', padding: '0.65rem 0.85rem', color: 'var(--text-primary)',
                    fontSize: '0.85rem', fontFamily: 'var(--font-body)', outline: 'none',
                  }}
                />
              </div>
            </div>
          )}

          {/* STEP 3: Media */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                Add Photos or Videos
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Visual evidence helps responders assess the situation faster. (Optional)</div>

              <input ref={fileRef} type="file" accept="image/*,video/*" multiple hidden onChange={e => {
                const files = Array.from(e.target.files);
                updateField('files', [...formData.files, ...files]);
              }} />

              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => fileRef.current?.click()}
                style={{
                  border: '2px dashed var(--border-active)', borderRadius: 'var(--radius-lg)',
                  padding: '2.5rem 1rem', textAlign: 'center', cursor: 'pointer',
                  background: 'var(--accent-dim)',
                }}
              >
                <Upload size={28} color="var(--accent-secondary)" style={{ margin: '0 auto 0.75rem' }} />
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--accent-secondary)' }}>Click to Upload</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>JPG, PNG, MP4 — Max 50MB each</div>
              </motion.div>

              {/* Quick capture buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {[{ icon: Camera, label: 'Photo' }, { icon: Video, label: 'Video' }, { icon: Mic, label: 'Voice' }].map(({ icon: Icon, label }) => (
                  <button key={label} style={{
                    background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-md)', padding: '0.75rem',
                    cursor: 'pointer', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)',
                  }}>
                    <Icon size={18} />
                    <span style={{ fontSize: '0.73rem' }}>{label}</span>
                  </button>
                ))}
              </div>

              {/* File previews */}
              {formData.files.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {formData.files.map((file, i) => (
                    <div key={i} style={{
                      position: 'relative', width: 72, height: 72,
                      borderRadius: 'var(--radius-sm)', overflow: 'hidden',
                      background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {file.type.startsWith('image/') ? (
                        <img src={URL.createObjectURL(file)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Video size={24} color="var(--text-muted)" />
                      )}
                      <button onClick={() => updateField('files', formData.files.filter((_, j) => j !== i))} style={{
                        position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.7)',
                        border: 'none', borderRadius: '50%', width: 18, height: 18,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <X size={10} color="white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Review */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                Review & Submit
              </div>

              {/* Summary */}
              {[
                { label: 'Type', value: formData.type || '—' },
                { label: 'Severity', value: formData.severity },
                { label: 'Location', value: formData.location || '—' },
                { label: 'Landmark', value: formData.landmark || '—' },
                { label: 'Description', value: formData.description || '—' },
                { label: 'Files', value: formData.files.length ? `${formData.files.length} file(s)` : 'None' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', gap: '1rem', padding: '0.6rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', width: 100, flexShrink: 0 }}>{label}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500, textTransform: 'capitalize' }}>{value}</span>
                </div>
              ))}

              {/* Anonymous option */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: '0.85rem',
                border: '1px solid var(--border-default)', cursor: 'pointer',
              }} onClick={() => updateField('anonymous', !formData.anonymous)}>
                <div style={{
                  width: 20, height: 20, borderRadius: '4px',
                  background: formData.anonymous ? 'var(--accent-primary)' : 'transparent',
                  border: `2px solid ${formData.anonymous ? 'var(--accent-primary)' : 'var(--border-active)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {formData.anonymous && <Check size={12} color="white" />}
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Submit Anonymously</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Your identity will not be shared with responders</div>
                </div>
              </div>

              <div style={{ background: 'var(--medium-dim)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', border: '1px solid rgba(234,179,8,0.2)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                ⚠ By submitting, you confirm this is a genuine emergency. False reports may result in legal action.
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        {step > 0 && (
          <button
            onClick={() => setStep(s => s - 1)}
            style={{
              flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border-default)',
              color: 'var(--text-secondary)', borderRadius: 'var(--radius-md)', padding: '0.85rem',
              cursor: 'pointer', fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
            }}
          >
            <ChevronLeft size={16} /> Back
          </button>
        )}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={step === STEPS.length - 1 ? handleSubmit : handleNext}
          disabled={submitting}
          style={{
            flex: 2, borderRadius: 'var(--radius-md)', padding: '0.85rem',
            cursor: submitting ? 'not-allowed' : 'pointer', fontSize: '0.9rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            fontFamily: 'var(--font-display)', letterSpacing: '0.04em',
            border: 'none',
            background: step === STEPS.length - 1
              ? 'linear-gradient(135deg, var(--critical), #dc2626)'
              : 'linear-gradient(135deg, var(--accent-primary), #2563eb)',
            color: 'white',
            boxShadow: step === STEPS.length - 1 ? '0 0 20px var(--critical-glow)' : '0 0 16px var(--accent-primary-glow)',
          }}
        >
          {submitting ? (
            <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Submitting...</>
          ) : step === STEPS.length - 1 ? (
            <><AlertTriangle size={16} /> Submit Emergency Report</>
          ) : (
            <>Continue <ChevronRight size={16} /></>
          )}
        </motion.button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}