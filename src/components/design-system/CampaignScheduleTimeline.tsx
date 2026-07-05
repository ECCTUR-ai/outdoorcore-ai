import React from 'react';
import { Calendar } from 'lucide-react';

export function CampaignScheduleTimeline() {
  // June days publishing ticks
  const days = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    let status: 'Yayınlandı' | 'Eksik Kreatif' | 'Yayın Hatası' | 'Planlandı' = 'Planlandı';
    let color = 'bg-slate-700/30 border-white/5';

    if (day <= 10) {
      status = 'Yayınlandı';
      color = 'bg-emerald-500 glow-green border-emerald-450';
    } else if (day === 11) {
      status = 'Eksik Kreatif';
      color = 'bg-amber-500 glow-yellow border-amber-450';
    } else if (day === 12) {
      status = 'Yayınlandı';
      color = 'bg-emerald-500 glow-green border-emerald-450';
    } else if (day === 13) {
      status = 'Yayın Hatası';
      color = 'bg-rose-500 glow-red border-rose-450';
    } else {
      status = 'Planlandı';
      color = 'bg-white/5 border-white/5';
    }

    return { day, status, color };
  });

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left overflow-x-auto select-none">
      <div className="flex items-center justify-between pb-2 border-b border-white/5 min-w-[500px]">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Calendar size={13} />
          <h4 className="text-xs font-black text-white uppercase tracking-wider">Günlük Yayın Takvimi (Haziran)</h4>
        </div>
        <div className="flex items-center gap-3">
          {['Yayınlandı', 'Eksik Kreatif', 'Yayın Hatası', 'Planlandı'].map(l => (
            <div key={l} className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${
                l === 'Yayınlandı' ? 'bg-emerald-500 glow-green' :
                l === 'Eksik Kreatif' ? 'bg-amber-500 glow-yellow' :
                l === 'Yayın Hatası' ? 'bg-rose-500 glow-red' : 'bg-slate-700'
              }`} />
              <span className="text-[8.5px] font-black text-slate-500 uppercase tracking-wider">{l}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-1.5 pt-1.5 min-w-[500px]">
        {days.map(d => (
          <div 
            key={d.day}
            className="flex-1 flex flex-col items-center gap-1 select-none cursor-pointer group"
          >
            {/* Tick box */}
            <div className={`w-full h-7 rounded-md border flex items-center justify-center transition-all group-hover:scale-105 ${d.color}`}>
              <span className="text-[8px] font-black text-white">{d.day}</span>
            </div>

            {/* Hover Tooltip */}
            <div className="absolute scale-0 group-hover:scale-100 transition-all origin-bottom bg-slate-950/95 border border-white/10 rounded-xl p-2 shadow-2xl w-32 text-center z-30 pointer-events-none -mt-10">
              <span className="text-[9px] font-black text-white block uppercase">{d.day} Haziran</span>
              <span className={`text-[8px] font-bold block uppercase mt-0.5 ${
                d.status === 'Yayınlandı' ? 'text-emerald-400' :
                d.status === 'Eksik Kreatif' ? 'text-amber-400' :
                d.status === 'Yayın Hatası' ? 'text-rose-450' : 'text-slate-500'
              }`}>{d.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
