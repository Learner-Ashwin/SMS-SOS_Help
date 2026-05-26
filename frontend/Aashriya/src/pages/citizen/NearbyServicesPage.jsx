import { useState, useEffect, useCallback } from 'react';
import { MapPin, Phone, Navigation, Clock, Shield, Flame, Heart, Search, LocateFixed, ChevronRight, AlertCircle } from 'lucide-react';
 
const SERVICE_TYPES = [
  { id: 'all',      label: 'All',        icon: null },
  { id: 'police',   label: 'Police',     icon: Shield,  color: '#3B82F6' },
  { id: 'hospital', label: 'Hospital',   icon: Heart,   color: '#EF4444' },
  { id: 'fire',     label: 'Fire',       icon: Flame,   color: '#F97316' },
];
 
// Static Nepal emergency data (fallback / demo)
const NEPAL_SERVICES = [
  { id: 1, type: 'police',   name: 'Metropolitan Police Circle – Thamel',       phone: '01-4410510', address: 'Thamel, Kathmandu',       lat: 27.7154, lng: 85.3123, open24h: true,  distanceKm: 0.8 },
  { id: 2, type: 'police',   name: 'Metropolitan Police Range – Kathmandu',     phone: '01-4261945', address: 'Naxal, Kathmandu',        lat: 27.7172, lng: 85.3240, open24h: true,  distanceKm: 1.2 },
  { id: 3, type: 'hospital', name: 'Tribhuvan University Teaching Hospital',    phone: '01-4412303', address: 'Maharajgunj, Kathmandu',  lat: 27.7361, lng: 85.3310, open24h: true,  distanceKm: 2.1 },
  { id: 4, type: 'hospital', name: 'Bir Hospital – Emergency',                 phone: '01-4221119', address: 'Mahabauddha, Kathmandu',  lat: 27.7015, lng: 85.3142, open24h: true,  distanceKm: 1.6 },
  { id: 5, type: 'hospital', name: 'Patan Hospital',                           phone: '01-5522266', address: 'Lagankhel, Lalitpur',     lat: 27.6642, lng: 85.3175, open24h: true,  distanceKm: 3.9 },
  { id: 6, type: 'fire',     name: 'Fire Brigade – Kathmandu',                 phone: '101',        address: 'Bhadrakali, Kathmandu',   lat: 27.7050, lng: 85.3150, open24h: true,  distanceKm: 1.0 },
  { id: 7, type: 'fire',     name: 'Fire Brigade – Lalitpur',                  phone: '01-5521633', address: 'Pulchowk, Lalitpur',      lat: 27.6770, lng: 85.3200, open24h: true,  distanceKm: 4.2 },
  { id: 8, type: 'police',   name: 'Armed Police Force – Kathmandu',           phone: '01-4611000', address: 'Halchowk, Kathmandu',     lat: 27.7100, lng: 85.2990, open24h: true,  distanceKm: 2.8 },
];
 
const TYPE_META = {
  police:   { color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   badge: 'bg-blue-500/20 text-blue-300',   dot: 'bg-blue-400'   },
  hospital: { color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30',    badge: 'bg-red-500/20 text-red-300',     dot: 'bg-red-400'    },
  fire:     { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', badge: 'bg-orange-500/20 text-orange-300', dot: 'bg-orange-400' },
};
 
const ICON_MAP = { police: Shield, hospital: Heart, fire: Flame };
 
function ServiceCard({ service, isSelected, onClick }) {
  const meta = TYPE_META[service.type];
  const Icon = ICON_MAP[service.type];
  return (
    <button
      onClick={() => onClick(service)}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
        isSelected
          ? `${meta.bg} ${meta.border} shadow-lg`
          : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 p-2 rounded-lg ${meta.bg} ${meta.border} border`}>
          <Icon size={16} className={meta.color} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-white leading-tight">{service.name}</p>
            <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${meta.badge}`}>
              {service.distanceKm} km
            </span>
          </div>
          <p className="text-xs text-white/50 mt-1 flex items-center gap-1">
            <MapPin size={10} /> {service.address}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-white/60 flex items-center gap-1">
              <Phone size={10} /> {service.phone}
            </span>
            {service.open24h && (
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <Clock size={10} /> 24/7
              </span>
            )}
          </div>
        </div>
        <ChevronRight size={14} className="text-white/30 mt-1 shrink-0" />
      </div>
    </button>
  );
}
 
function QuickDial({ label, number, color }) {
  return (
    <a
      href={`tel:${number}`}
      className={`flex flex-col items-center justify-center gap-1 p-4 rounded-xl border ${color} transition-all duration-200 active:scale-95`}
    >
      <Phone size={20} className="text-white" />
      <span className="text-lg font-black text-white tracking-tight">{number}</span>
      <span className="text-xs text-white/70 font-medium">{label}</span>
    </a>
  );
}
 
export default function NearbyServicesPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
 
  const filtered = NEPAL_SERVICES
    .filter(s => activeFilter === 'all' || s.type === activeFilter)
    .filter(s =>
      search === '' ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.address.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.distanceKm - b.distanceKm);
 
  const handleLocate = useCallback(() => {
    setLocating(true);
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocationError('Unable to retrieve your location. Please allow location access.');
        setLocating(false);
      }
    );
  }, []);
 
  const handleCall = (phone) => window.open(`tel:${phone}`);
 
  const handleDirections = (service) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${service.lat},${service.lng}`;
    window.open(url, '_blank');
  };
 
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base, #0a0c10)' }}>
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-white/8 backdrop-blur-md" style={{ background: 'rgba(10,12,16,0.92)' }}>
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30">
              <MapPin size={18} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">Nearby Services</h1>
              <p className="text-xs text-white/50">Emergency services near you</p>
            </div>
            <button
              onClick={handleLocate}
              disabled={locating}
              className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/25 transition-all disabled:opacity-50"
            >
              <LocateFixed size={13} className={locating ? 'animate-spin' : ''} />
              {locating ? 'Locating…' : userLocation ? 'Located' : 'Locate Me'}
            </button>
          </div>
 
          {/* Search */}
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search hospitals, police stations…"
              className="w-full pl-8 pr-4 py-2.5 rounded-lg bg-white/6 border border-white/10 text-white text-sm placeholder:text-white/35 focus:outline-none focus:border-white/25 focus:bg-white/8 transition-all"
            />
          </div>
 
          {/* Filter chips */}
          <div className="flex gap-2">
            {SERVICE_TYPES.map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveFilter(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    activeFilter === t.id
                      ? 'bg-white text-black border-white'
                      : 'bg-white/6 text-white/60 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {Icon && <Icon size={11} />}
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
 
      <div className="max-w-2xl mx-auto px-4 pb-8 pt-4 space-y-6">
        {/* Location Error */}
        {locationError && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            <AlertCircle size={14} /> {locationError}
          </div>
        )}
 
        {/* Quick Dial */}
        <div>
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Quick Dial</p>
          <div className="grid grid-cols-3 gap-3">
            <QuickDial label="Police"   number="100" color="bg-blue-600/80   border-blue-500/40 hover:bg-blue-600 active:bg-blue-700" />
            <QuickDial label="Ambulance" number="102" color="bg-red-600/80    border-red-500/40 hover:bg-red-600 active:bg-red-700" />
            <QuickDial label="Fire"     number="101" color="bg-orange-600/80 border-orange-500/40 hover:bg-orange-600 active:bg-orange-700" />
          </div>
        </div>
 
        {/* Services list */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">
              {filtered.length} Service{filtered.length !== 1 ? 's' : ''} Found
            </p>
            <span className="text-xs text-white/30">Sorted by distance</span>
          </div>
 
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-white/30">
              <MapPin size={36} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">No services found</p>
              <p className="text-xs mt-1">Try changing filters or search term</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(s => (
                <ServiceCard
                  key={s.id}
                  service={s}
                  isSelected={selectedService?.id === s.id}
                  onClick={setSelectedService}
                />
              ))}
            </div>
          )}
        </div>
      </div>
 
      {/* Detail Drawer */}
      {selectedService && (
        <div
          className="fixed inset-0 z-50 flex items-end"
          onClick={() => setSelectedService(null)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-2xl mx-auto rounded-t-2xl border border-white/10 p-6 pb-10"
            style={{ background: 'var(--bg-card, #131720)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />
            {(() => {
              const s = selectedService;
              const meta = TYPE_META[s.type];
              const Icon = ICON_MAP[s.type];
              return (
                <>
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`p-3 rounded-xl ${meta.bg} border ${meta.border}`}>
                      <Icon size={22} className={meta.color} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-base font-bold text-white leading-tight">{s.name}</h2>
                      <p className="text-sm text-white/50 mt-1 flex items-center gap-1.5">
                        <MapPin size={12} /> {s.address}
                      </p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${meta.badge}`}>
                          {s.distanceKm} km away
                        </span>
                        {s.open24h && (
                          <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-500/15 text-emerald-400">
                            Open 24/7
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleCall(s.phone)}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-white/90 transition-all active:scale-95"
                    >
                      <Phone size={15} /> Call {s.phone}
                    </button>
                    <button
                      onClick={() => handleDirections(s)}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/8 border border-white/15 text-white font-semibold text-sm hover:bg-white/12 transition-all active:scale-95"
                    >
                      <Navigation size={15} /> Directions
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}