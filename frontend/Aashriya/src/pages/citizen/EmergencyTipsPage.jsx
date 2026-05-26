import { useState } from 'react';
import {
  Flame, Zap, Droplets, Heart, User, AlertTriangle,
  ChevronDown, ChevronUp, Phone, BookOpen, ShieldAlert
} from 'lucide-react';

const CATEGORIES = [
  {
    id: 'fire',
    label: 'Fire Emergency',
    icon: Flame,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    accent: 'bg-orange-500',
    hotline: '101',
    tips: [
      { title: 'Alert Everyone', body: 'Shout "Fire!" to alert everyone in the building. Activate the fire alarm if available.' },
      { title: 'Call 101 Immediately', body: 'Call the fire brigade at 101. Give your address clearly and stay on the line if possible.' },
      { title: 'Evacuate Low & Fast', body: 'Stay below smoke level. Crawl if necessary. Never use elevators during a fire.' },
      { title: 'Close Doors Behind You', body: 'Closing doors slows the spread of fire and smoke, buying others more time to escape.' },
      { title: 'Stop, Drop & Roll', body: 'If clothing catches fire — stop moving, drop to the ground, and roll to smother flames.' },
      { title: 'Never Re-enter', body: 'Once you are out, do NOT go back inside under any circumstances. Wait for firefighters.' },
    ],
  },
  {
    id: 'earthquake',
    label: 'Earthquake',
    icon: Zap,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    accent: 'bg-yellow-500',
    hotline: '100',
    tips: [
      { title: 'Drop, Cover & Hold On', body: 'Drop to your hands and knees. Get under a sturdy table or desk. Hold on until shaking stops.' },
      { title: 'Stay Away from Windows', body: 'Move away from windows, glass, and heavy furniture that could fall.' },
      { title: 'If Outdoors, Stay Outdoors', body: 'Move away from buildings, streetlights, and utility lines.' },
      { title: 'After Shaking Stops', body: 'Check for injuries. Expect aftershocks. Do not use open flames — check for gas leaks first.' },
      { title: 'Avoid Elevators', body: 'Use stairs only. Elevators may become inoperable or trap you between floors.' },
      { title: 'Listen to Authorities', body: 'Tune in to emergency broadcasts. Follow instructions from police and rescue teams.' },
    ],
  },
  {
    id: 'flood',
    label: 'Flood',
    icon: Droplets,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    accent: 'bg-blue-500',
    hotline: '100',
    tips: [
      { title: 'Move to Higher Ground', body: 'Do not wait for official instruction if water is rising. Get to higher ground immediately.' },
      { title: 'Never Walk in Floodwater', body: 'Even 15 cm of moving water can knock you down. 30 cm can sweep away a vehicle.' },
      { title: 'Disconnect Electricity', body: 'Turn off the electricity at the main switch if safe to do so. Never touch live wires.' },
      { title: 'Secure Drinking Water', body: 'Fill clean containers with drinking water before floodwater contaminates your supply.' },
      { title: 'Avoid Bridges', body: 'Floodwater can erode foundations. Bridges may be unstable even if they appear intact.' },
      { title: 'Signal for Help', body: 'If trapped, use a flashlight, whistle, or bright cloth to signal rescuers from a high point.' },
    ],
  },
  {
    id: 'medical',
    label: 'Medical Emergency',
    icon: Heart,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    accent: 'bg-red-500',
    hotline: '102',
    tips: [
      { title: 'Call 102 for Ambulance', body: 'Dial 102 immediately. Describe the emergency clearly: location, patient condition, and age.' },
      { title: 'CPR – Chest Compressions', body: 'If patient is unresponsive and not breathing normally — push hard and fast on the center of the chest, 100–120 times per minute.' },
      { title: 'Bleeding Control', body: 'Apply firm, continuous pressure on the wound using a clean cloth. Do not remove the cloth — add more on top.' },
      { title: 'Choking – Heimlich', body: 'Stand behind the person, make a fist above their navel, and thrust upward firmly. Repeat until object is dislodged.' },
      { title: 'Suspected Fracture', body: 'Do not move the injured limb. Immobilize it as found. Apply ice (wrapped in cloth) to reduce swelling.' },
      { title: 'Unconscious Person', body: 'Place them in the recovery position (on their side) to keep airway clear. Monitor breathing until help arrives.' },
    ],
  },
  {
    id: 'personal',
    label: 'Personal Safety',
    icon: User,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    accent: 'bg-purple-500',
    hotline: '100',
    tips: [
      { title: 'Trust Your Instincts', body: 'If a situation feels unsafe, leave immediately. Your intuition is a powerful safety tool.' },
      { title: 'Share Your Location', body: 'Let a trusted person know where you are going and when to expect you back.' },
      { title: 'Stay in Lit Areas', body: 'Avoid dark alleys and isolated spaces, especially at night.' },
      { title: 'Emergency Contacts', body: 'Save emergency numbers (100, 101, 102) on your phone. Know how to reach local police.' },
      { title: 'Silent SOS', body: 'Use AASHRAYA\'s silent SOS button if you cannot speak. The system will alert emergency services.' },
      { title: 'Safe Word System', body: 'Establish a code word with family members to signal distress without alerting an attacker.' },
    ],
  },
];

const HOTLINES = [
  { label: 'Police',    number: '100', color: 'bg-blue-600/80  border-blue-500/30' },
  { label: 'Fire',      number: '101', color: 'bg-orange-600/80 border-orange-500/30' },
  { label: 'Ambulance', number: '102', color: 'bg-red-600/80    border-red-500/30' },
  { label: 'Disaster',  number: '1149', color: 'bg-yellow-600/80 border-yellow-500/30' },
];

function TipCard({ tip, index }) {
  return (
    <div className="flex gap-3 py-3 border-b border-white/6 last:border-0">
      <span className="shrink-0 w-6 h-6 rounded-full bg-white/8 border border-white/12 text-xs font-bold text-white/50 flex items-center justify-center">
        {index + 1}
      </span>
      <div>
        <p className="text-sm font-semibold text-white">{tip.title}</p>
        <p className="text-xs text-white/55 mt-0.5 leading-relaxed">{tip.body}</p>
      </div>
    </div>
  );
}

function CategoryCard({ category }) {
  const [open, setOpen] = useState(false);
  const Icon = category.icon;
  return (
    <div className={`rounded-2xl border ${category.border} ${category.bg} overflow-hidden transition-all duration-300`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-4 text-left"
      >
        <div className={`p-2.5 rounded-xl bg-black/20 border ${category.border}`}>
          <Icon size={20} className={category.color} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-white text-sm">{category.label}</h3>
          <p className="text-xs text-white/40 mt-0.5">{category.tips.length} essential tips</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`tel:${category.hotline}`}
            onClick={e => e.stopPropagation()}
            className="px-2.5 py-1 rounded-lg bg-black/30 border border-white/10 text-xs font-bold text-white flex items-center gap-1 hover:bg-black/50 transition-all active:scale-95"
          >
            <Phone size={10} />
            {category.hotline}
          </a>
          {open ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-white/8 px-4 pb-2">
          {category.tips.map((tip, i) => (
            <TipCard key={i} tip={tip} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function EmergencyTipsPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all'
    ? CATEGORIES
    : CATEGORIES.filter(c => c.id === activeCategory);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base, #0a0c10)' }}>
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-white/8 backdrop-blur-md" style={{ background: 'rgba(10,12,16,0.92)' }}>
        <div className="max-w-xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-amber-500/15 border border-amber-500/30">
              <BookOpen size={18} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">Emergency Tips</h1>
              <p className="text-xs text-white/50">Know what to do before help arrives</p>
            </div>
          </div>

          {/* Filter chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                activeCategory === 'all'
                  ? 'bg-white text-black border-white'
                  : 'bg-white/6 text-white/60 border-white/10 hover:bg-white/10'
              }`}
            >
              All
            </button>
            {CATEGORIES.map(c => {
              const Icon = c.icon;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    activeCategory === c.id
                      ? 'bg-white text-black border-white'
                      : `${c.bg} ${c.color} ${c.border} hover:brightness-110`
                  }`}
                >
                  <Icon size={11} />
                  {c.label.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
        {/* Emergency Hotlines */}
        <div>
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Emergency Hotlines</p>
          <div className="grid grid-cols-4 gap-2">
            {HOTLINES.map(h => (
              <a
                key={h.number}
                href={`tel:${h.number}`}
                className={`flex flex-col items-center gap-1 py-3 rounded-xl border ${h.color} text-white transition-all active:scale-95 hover:brightness-110`}
              >
                <Phone size={15} />
                <span className="text-sm font-black">{h.number}</span>
                <span className="text-[10px] text-white/70">{h.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Warning banner */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/8 border border-amber-500/25 text-amber-400 text-xs leading-relaxed">
          <ShieldAlert size={16} className="shrink-0 mt-0.5" />
          <p>
            These tips are general guidance only. Always call emergency services first.
            Professional responders should handle serious emergencies.
          </p>
        </div>

        {/* Category Cards */}
        <div className="space-y-3">
          {filtered.map(cat => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>

        {/* Footer reminder */}
        <div className="text-center py-4">
          <p className="text-xs text-white/25">
            In any emergency, call the relevant hotline first. <br />
            AASHRAYA is a coordination aid — not a replacement for emergency services.
          </p>
        </div>
      </div>
    </div>
  );
}