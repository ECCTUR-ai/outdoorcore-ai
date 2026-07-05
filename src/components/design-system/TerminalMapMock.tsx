import React from 'react';
import { Badge } from './Badge';

export function TerminalMapMock() {
  const pins = [
    { code: 'SG-001', name: 'Giriş LED Ekran', status: 'dolu', top: '25%', left: '15%' },
    { code: 'SG-002', name: 'Check-in Desk A Lightbox', status: 'bos', top: '22%', left: '42%' },
    { code: 'SG-003', name: 'Giriş LED Ekran 2', status: 'teklif', top: '35%', left: '26%' },
    { code: 'SG-010', name: 'Pasaport Kontrol Panel', status: 'bakim', top: '48%', left: '52%' },
    { code: 'SG-018', name: 'Duty Free Giriş LED', status: 'yakinda', top: '45%', left: '76%' },
    { code: 'SG-021', name: 'Check-in Önü LED', status: 'dolu', top: '65%', left: '38%' },
    { code: 'SG-023', name: 'Bagaj Alım Lobi Pano', status: 'bos', top: '78%', left: '68%' },
    { code: 'SG-045', name: 'Duty Free Yanı LED', status: 'dolu', top: '72%', left: '85%' }
  ];

  const statusColors = {
    dolu: 'bg-emerald-500 border-emerald-450 glow-green text-white',
    bos: 'bg-amber-500 border-amber-450 glow-yellow text-white',
    teklif: 'bg-purple-500 border-purple-450 glow-purple text-white',
    bakim: 'bg-rose-500 border-rose-450 glow-red text-white',
    yakinda: 'bg-blue-500 border-blue-450 glow-blue text-white'
  };

  return (
    <div className="relative w-full h-[360px] rounded-2xl bg-[#090d1f] border border-white/5 overflow-hidden">
      {/* Blueprint background grid */}
      <div className="absolute inset-0 blueprint-grid opacity-50" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/80 pointer-events-none" />

      {/* Styled airport terminal mock outline */}
      <svg className="absolute inset-0 w-full h-full text-blue-500/15" viewBox="0 0 800 400" fill="none">
        {/* Exterior walls */}
        <rect x="50" y="40" width="700" height="320" rx="30" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 3" />
        
        {/* Terminal sectors */}
        <line x1="280" y1="40" x2="280" y2="360" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="560" y1="40" x2="560" y2="360" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
        
        {/* Inner halls & security checkpoints */}
        <rect x="80" y="80" width="160" height="240" rx="15" stroke="currentColor" strokeWidth="1" />
        <rect x="310" y="80" width="220" height="100" rx="15" stroke="currentColor" strokeWidth="1" />
        <rect x="310" y="220" width="220" height="100" rx="15" stroke="currentColor" strokeWidth="1" />
        <rect x="590" y="80" width="130" height="240" rx="15" stroke="currentColor" strokeWidth="1" />

        {/* Text descriptions */}
        <text x="160" y="200" fill="currentColor" opacity="0.3" textAnchor="middle" className="text-[10px] font-black uppercase tracking-wider">İÇ HATLAR GİRİŞ</text>
        <text x="420" y="130" fill="currentColor" opacity="0.3" textAnchor="middle" className="text-[10px] font-black uppercase tracking-wider">PASAPORT & ARINMIŞ ALAN</text>
        <text x="420" y="270" fill="currentColor" opacity="0.3" textAnchor="middle" className="text-[10px] font-black uppercase tracking-wider">DUTY FREE LOBİ</text>
        <text x="655" y="200" fill="currentColor" opacity="0.3" textAnchor="middle" className="text-[10px] font-black uppercase tracking-wider">DIŞ HATLAR KAPILAR</text>
      </svg>

      {/* Interactive status pins */}
      {pins.map(pin => (
        <div
          key={pin.code}
          style={{ top: pin.top, left: pin.left }}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20 flex flex-col items-center"
        >
          {/* Label Tag */}
          <div className={`px-2 py-0.5 rounded-lg border text-[9px] font-black tracking-tighter shadow-md transition-all group-hover:scale-110 select-none ${statusColors[pin.status as keyof typeof statusColors]}`}>
            {pin.code}
          </div>

          {/* Hover tooltips */}
          <div className="absolute bottom-6 scale-0 group-hover:scale-100 transition-all origin-bottom bg-slate-950/95 border border-white/10 rounded-xl p-2.5 shadow-2xl w-48 text-left z-30 pointer-events-none">
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
      ))}
    </div>
  );
}
