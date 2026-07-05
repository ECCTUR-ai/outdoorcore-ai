import React from 'react';

interface SpacePin {
  code: string;
  name: string;
  status: 'dolu' | 'bos' | 'teklif' | 'bakim' | 'yakinda';
  top: string;
  left: string;
}

interface AdvertisingSpaceMapProps {
  selectedCode: string;
  onSelectCode: (code: string) => void;
}

export function AdvertisingSpaceMap({ selectedCode, onSelectCode }: AdvertisingSpaceMapProps) {
  const pins: SpacePin[] = [
    { code: 'SG-001', name: 'Giriş LED Ekran', status: 'dolu', top: '25%', left: '12%' },
    { code: 'SG-002', name: 'Check-in Önü LED', status: 'bos', top: '22%', left: '38%' },
    { code: 'SG-003', name: 'Pasaport Kontrol Üstü', status: 'dolu', top: '35%', left: '26%' },
    { code: 'SG-004', name: 'Duty Free Yanı Lightbox', status: 'teklif', top: '55%', left: '35%' },
    { code: 'SG-005', name: 'Yürüyen Bant Yanı', status: 'dolu', top: '65%', left: '42%' },
    { code: 'SG-006', name: 'Bagaj Alım Salonu LED', status: 'bakim', top: '78%', left: '62%' },
    { code: 'SG-010', name: 'Giden Yolcu Lobi LED', status: 'bakim', top: '15%', left: '55%' },
    { code: 'SG-012', name: 'CIP Salonu Dijital Ekran', status: 'bos', top: '48%', left: '52%' },
    { code: 'SG-017', name: 'Duty Free Merkez Lightbox', status: 'teklif', top: '42%', left: '68%' },
    { code: 'SG-018', name: 'Pasaport Çıkış Dijital Pano', status: 'yakinda', top: '48%', left: '76%' },
    { code: 'SG-021', name: 'Check-in Desk B Panel', status: 'dolu', top: '70%', left: '20%' },
    { code: 'SG-023', name: 'Bagaj Alım Giriş LED', status: 'bos', top: '85%', left: '48%' },
    { code: 'SG-045', name: 'Duty Free Lobi LED', status: 'dolu', top: '70%', left: '85%' },
    { code: 'SG-067', name: 'Dış Hatlar Kapı A1 Pano', status: 'yakinda', top: '30%', left: '88%' }
  ];

  const statusColors = {
    dolu: 'bg-emerald-500 border-emerald-450 glow-green',
    bos: 'bg-amber-500 border-amber-450 glow-yellow',
    teklif: 'bg-purple-500 border-purple-450 glow-purple',
    bakim: 'bg-rose-500 border-rose-450 glow-red',
    yakinda: 'bg-blue-500 border-blue-450 glow-blue'
  };

  return (
    <div className="relative w-full h-[400px] rounded-2xl bg-[#090d1f] border border-white/5 overflow-hidden">
      {/* Blueprint grid background */}
      <div className="absolute inset-0 blueprint-grid opacity-50" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/85 pointer-events-none" />

      {/* SVG blueprint outline */}
      <svg className="absolute inset-0 w-full h-full text-blue-500/12" viewBox="0 0 800 400" fill="none">
        {/* Exterior border walls */}
        <rect x="30" y="30" width="740" height="340" rx="30" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 3" />
        
        {/* Terminal gates & lobby separations */}
        <line x1="260" y1="30" x2="260" y2="370" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="580" y1="30" x2="580" y2="370" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
        
        {/* Inner halls */}
        <rect x="60" y="70" width="170" height="260" rx="15" stroke="currentColor" strokeWidth="1" />
        <rect x="290" y="70" width="260" height="110" rx="15" stroke="currentColor" strokeWidth="1" />
        <rect x="290" y="220" width="260" height="110" rx="15" stroke="currentColor" strokeWidth="1" />
        <rect x="610" y="70" width="130" height="260" rx="15" stroke="currentColor" strokeWidth="1" />

        {/* Text descriptions */}
        <text x="145" y="200" fill="currentColor" opacity="0.35" textAnchor="middle" className="text-[10px] font-black uppercase tracking-wider">İÇ HATLAR GİRİŞ HANGARI</text>
        <text x="420" y="125" fill="currentColor" opacity="0.35" textAnchor="middle" className="text-[10px] font-black uppercase tracking-wider">GİVENLİK & GİDEN PASAPORT</text>
        <text x="420" y="275" fill="currentColor" opacity="0.35" textAnchor="middle" className="text-[10px] font-black uppercase tracking-wider">DUTY FREE LOBİ ALANI</text>
        <text x="675" y="200" fill="currentColor" opacity="0.35" textAnchor="middle" className="text-[10px] font-black uppercase tracking-wider">DIŞ HATLAR KAPILAR</text>
      </svg>

      {/* Interactive pins */}
      {pins.map(pin => {
        const isSelected = selectedCode === pin.code;
        return (
          <div
            key={pin.code}
            style={{ top: pin.top, left: pin.left }}
            onClick={() => onSelectCode(pin.code)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20 flex flex-col items-center"
          >
            {/* Pulsing selection circle rings */}
            {isSelected && (
              <span className="absolute -inset-2.5 rounded-lg border border-blue-400 animate-ping opacity-60" />
            )}
            
            {/* Tag pin */}
            <div className={`px-2.5 py-0.8 rounded-lg border text-[9px] font-black tracking-tighter shadow-lg transition-all duration-150 select-none ${
              isSelected ? 'scale-115 ring-2 ring-white/20 border-white' : 'group-hover:scale-110'
            } ${statusColors[pin.status]}`}>
              {pin.code}
            </div>

            {/* Float helper description tooltips */}
            <div className="absolute bottom-7 scale-0 group-hover:scale-100 transition-all origin-bottom bg-slate-950/95 border border-white/10 rounded-xl p-2.5 shadow-2xl w-48 text-left z-30 pointer-events-none">
              <span className="text-[9.5px] font-black text-white block truncate uppercase">{pin.code} - {pin.name}</span>
              <div className="flex justify-between items-center mt-1.5 pt-1 border-t border-white/5">
                <span className="text-[8px] text-slate-400 font-bold uppercase">Durum:</span>
                <span className={`text-[8.5px] font-black uppercase ${
                  pin.status === 'dolu' ? 'text-emerald-400' :
                  pin.status === 'bos' ? 'text-amber-400' :
                  pin.status === 'teklif' ? 'text-purple-400' :
                  pin.status === 'bakim' ? 'text-rose-400' : 'text-blue-400'
                }`}>
                  {pin.status === 'dolu' ? 'Dolu' :
                   pin.status === 'bos' ? 'Müsait' :
                   pin.status === 'teklif' ? 'Teklifte' :
                   pin.status === 'bakim' ? 'Bakımda' : 'Yakında Boş'}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
