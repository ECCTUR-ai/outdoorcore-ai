import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { AdvertisingSpace } from '@/data/advertisingSpaces';
import { spaceRepository } from '@/repositories';
import { Radio, Globe, Navigation, Search } from 'lucide-react';

interface AdvertisingSpaceMapProps {
  selectedCode: string;
  onSelectCode: (code: string) => void;
  spaces?: AdvertisingSpace[];
}

// Google Maps Switch Toggle (Set to true to easily switch back to Google Maps JS API)
const USE_GOOGLE_MAPS = false;

export function AdvertisingSpaceMap({ selectedCode, onSelectCode, spaces }: AdvertisingSpaceMapProps) {
  const { resolvedTheme } = useTheme();
  
  // Interactive States
  const [isTrafficActive, setIsTrafficActive] = useState(false);
  const [isEarthView, setIsEarthView] = useState(false);
  const [mapSearchQuery, setMapSearchQuery] = useState('');

  // Istanbul coordinates boundaries for conversion:
  const minLat = 40.85;
  const maxLat = 41.15;
  const minLng = 28.80;
  const maxLng = 29.45;

  // Normalize lat/lng to percentage coordinates
  const getPosition = (space: AdvertisingSpace, index: number) => {
    if (space.latitude && space.longitude) {
      const x = ((space.longitude - minLng) / (maxLng - minLng)) * 100;
      const y = (1 - (space.latitude - minLat) / (maxLat - minLat)) * 100;
      
      return {
        left: `${Math.max(5, Math.min(95, x))}%`,
        top: `${Math.max(5, Math.min(95, y))}%`
      };
    }
    
    // Grid fallback distribution if coordinates are missing (requirement 5)
    const columns = 6;
    const row = Math.floor(index / columns);
    const col = index % columns;
    const x = 12 + col * 15;
    const y = 20 + row * 15;
    
    return {
      left: `${Math.max(5, Math.min(95, x))}%`,
      top: `${Math.max(5, Math.min(95, y))}%`
    };
  };

  // Sync spaces list by props and internal map search (requirement 9)
  const filteredList = (spaces || spaceRepository.getAllSync()).filter(s => {
    const matchesSearch = !mapSearchQuery || 
      s.code.toLowerCase().includes(mapSearchQuery.toLowerCase()) || 
      s.name.toLowerCase().includes(mapSearchQuery.toLowerCase()) || 
      (s.location && s.location.toLowerCase().includes(mapSearchQuery.toLowerCase()));
    return matchesSearch;
  });

  const statusColors = {
    bos: 'bg-emerald-500 border-emerald-450 glow-green text-white',
    teklif: 'bg-amber-500 border-amber-450 glow-yellow text-white',
    dolu: 'bg-rose-500 border-rose-450 glow-red text-white',
    bakim: 'bg-slate-500 border-slate-450 glow-gray text-white',
    yakinda: 'bg-slate-500 border-slate-450 glow-gray text-white'
  };

  const statusLabels = {
    bos: 'Müsait',
    teklif: 'Opsiyon',
    dolu: 'Dolu',
    bakim: 'Bakımda',
    yakinda: 'Bakımda'
  };

  // Google Maps fallback code placeholder block
  if (USE_GOOGLE_MAPS) {
    return (
      <div className="relative w-full h-[500px] rounded-2xl bg-[#090d1f] border border-white/5 overflow-hidden flex items-center justify-center">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
          Google Maps JS API Mode Is Deactivated. Switch USE_GOOGLE_MAPS to false to load dark vector map.
        </span>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-[500px] rounded-2xl border border-white/5 overflow-hidden transition-all duration-350 select-none ${
      isEarthView 
        ? 'bg-gradient-to-b from-[#02050c] via-[#050b18] to-[#010205]' 
        : 'bg-[#0B1020]'
    }`}>
      {/* Map Grid Blueprint Pattern Overlay */}
      {!isEarthView && <div className="absolute inset-0 blueprint-grid opacity-35" />}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/75 pointer-events-none" />

      {/* District/Zones background Labels */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[25%] left-[32%] text-[9px] font-black text-slate-600/30 dark:text-slate-500/20 uppercase tracking-widest">MASLAK ZONU</div>
        <div className="absolute top-[38%] left-[36%] text-[9px] font-black text-slate-600/30 dark:text-slate-500/20 uppercase tracking-widest">LEVENT</div>
        <div className="absolute top-[48%] left-[40%] text-[9px] font-black text-slate-600/30 dark:text-slate-500/20 uppercase tracking-widest">BEŞİKTAŞ</div>
        <div className="absolute top-[52%] left-[60%] text-[9px] font-black text-slate-600/30 dark:text-slate-500/20 uppercase tracking-widest">ÜSKÜDAR</div>
        <div className="absolute top-[65%] left-[64%] text-[9px] font-black text-slate-600/30 dark:text-slate-500/20 uppercase tracking-widest">KADIKÖY</div>
        <div className="absolute top-[60%] left-[74%] text-[9px] font-black text-slate-600/30 dark:text-slate-500/20 uppercase tracking-widest">ATAŞEHİR</div>
        <div className="absolute top-[80%] left-[84%] text-[9px] font-black text-slate-600/30 dark:text-slate-500/20 uppercase tracking-widest">SABİHA GÖKÇEN (PENDİK)</div>
      </div>

      {/* Istanbul Vector Drawing Layout */}
      <svg className="absolute inset-0 w-full h-full text-blue-500/10 pointer-events-none" viewBox="0 0 800 500" fill="none">
        {/* Bosphorus Line */}
        <path 
          d="M480,500 C470,380 440,300 450,230 C460,160 520,90 550,0" 
          stroke={isEarthView ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.3)'} 
          strokeWidth="12" 
          fill="none" 
        />
        
        {/* D-100 Highway Line */}
        <path 
          d="M50,260 L400,250 C430,255 470,245 500,250 L750,275" 
          stroke={isEarthView ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.08)'} 
          strokeWidth="2.5" 
        />

        {/* TEM Highway Line */}
        <path 
          d="M50,130 L390,140 C420,135 480,140 510,150 L750,170" 
          stroke={isEarthView ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.08)'} 
          strokeWidth="2.5" 
        />

        {/* Bosphorus Bridges Connecting Lines */}
        <line x1="445" y1="245" x2="480" y2="248" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
        <line x1="475" y1="147" x2="502" y2="149" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />

        {/* Mock Traffic overlay neon lines (requirement 10) */}
        {isTrafficActive && (
          <>
            <path d="M50,260 L400,250" stroke="#10B981" strokeWidth="3" strokeDasharray="8 8" className="animate-pulse" />
            <path d="M400,250 C430,255 470,245 500,250" stroke="#EF4444" strokeWidth="3" strokeDasharray="8 8" />
            <path d="M500,250 L750,275" stroke="#F59E0B" strokeWidth="3" strokeDasharray="8 8" />
            <path d="M50,130 L390,140" stroke="#10B981" strokeWidth="2.5" strokeDasharray="6 6" />
            <path d="M390,140 C420,135 480,140 510,150" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="6 6" className="animate-pulse" />
            <path d="M510,150 L750,170" stroke="#10B981" strokeWidth="2.5" strokeDasharray="6 6" />
          </>
        )}
      </svg>

      {/* Floating Info Panel Header Controls */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
        {/* Search Input Bar (requirement 9) */}
        <div className="relative w-60">
          <input
            type="text"
            placeholder="Haritada Alan Ara..."
            value={mapSearchQuery}
            onChange={(e) => setMapSearchQuery(e.target.value)}
            className="w-full bg-[#12192B]/90 border border-white/8 backdrop-blur-md px-3.5 py-1.8 pl-8 rounded-xl text-[10px] font-black text-white placeholder-slate-450 focus:outline-none focus:border-blue-500 shadow-xl"
          />
          <Search size={11} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        {/* Demo İstanbul Haritası Badge (requirement 12) */}
        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/10 px-2 py-1 rounded text-[8.5px] font-black uppercase tracking-widest shadow-sm select-none">
          Demo İstanbul Haritası
        </span>
      </div>

      {/* Right Controls Toolbars (Traffic + Maps/Earth) */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {/* Traffic toggle */}
        <button
          onClick={() => setIsTrafficActive(!isTrafficActive)}
          className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md shadow-xl transition-all cursor-pointer border ${
            isTrafficActive
              ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
              : 'bg-[#12192B]/90 text-slate-300 border-white/8 hover:text-white'
          }`}
        >
          <Radio size={11} className={isTrafficActive ? 'animate-pulse' : ''} />
          <span>Trafik</span>
        </button>

        {/* Earth / Maps switch */}
        <button
          onClick={() => setIsEarthView(!isEarthView)}
          className="px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 bg-[#12192B]/90 text-slate-300 border border-white/8 hover:text-white backdrop-blur-md shadow-xl transition-all cursor-pointer"
        >
          <Globe size={11} />
          <span>{isEarthView ? 'Harita' : 'Uydu'}</span>
        </button>
      </div>

      {/* Render Advertising Spaces Markers */}
      <div className="absolute inset-0">
        {filteredList.map((space, index) => {
          const isSelected = selectedCode === space.code;
          const pos = getPosition(space, index);
          
          return (
            <div
              key={space.id}
              style={{ top: pos.top, left: pos.left }}
              onClick={() => onSelectCode(space.code)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20 flex flex-col items-center"
            >
              {/* Pulse rings for active selected space */}
              {isSelected && (
                <span className="absolute -inset-2.5 rounded-lg border border-blue-400 animate-ping opacity-60 pointer-events-none" />
              )}

              {/* Space Code Pin Badge (requirement 16: bounce class if selected) */}
              <div className={`px-2.5 py-0.8 rounded-lg border text-[9px] font-black tracking-tighter shadow-lg transition-all duration-150 select-none ${
                isSelected 
                  ? 'scale-115 ring-2 ring-white/20 border-white animate-bounce' 
                  : 'group-hover:scale-110'
              } ${statusColors[space.status as keyof typeof statusColors] || statusColors.bos}`}>
                {space.code}
              </div>

              {/* Hover Tooltip card (requirement 17) */}
              <div className="absolute bottom-7 scale-0 group-hover:scale-100 transition-all origin-bottom bg-slate-950/95 border border-white/10 rounded-xl p-2.5 shadow-2xl w-48 text-left z-30 pointer-events-none">
                <span className="text-[9.5px] font-black text-white block truncate uppercase">
                  {space.code} - {space.name}
                </span>
                <div className="flex justify-between items-center mt-1.5 pt-1 border-t border-white/5">
                  <span className="text-[8px] text-slate-400 font-bold uppercase">Durum:</span>
                  <span className={`text-[8.5px] font-black uppercase ${
                    space.status === 'bos' ? 'text-emerald-400' :
                    space.status === 'teklif' ? 'text-amber-400' :
                    space.status === 'dolu' ? 'text-rose-455' : 'text-slate-400'
                  }`}>
                    {statusLabels[space.status as keyof typeof statusLabels] || 'Bilinmiyor'}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-0.5">
                  <span className="text-[8px] text-slate-400 font-bold uppercase">Fiyat:</span>
                  <span className="text-[8.5px] font-black text-blue-400">{space.price}</span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredList.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="bg-[#12192B]/90 border border-white/5 backdrop-blur-md px-5 py-2.5 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-wider shadow-2xl">
              Filtrelere Uygun Reklam Alanı Bulunamadı
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
