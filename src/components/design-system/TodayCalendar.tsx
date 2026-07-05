import React from 'react';
import { CalendarRange, Sparkles } from 'lucide-react';

export function TodayCalendar() {
  const events = [
    { time: '09:00', title: 'Samsung Strateji Toplantısı', target: 'Havalimanı Kampanyası' },
    { time: '11:00', title: 'THY Global Miles Sunumu', target: 'Müşteri Ofisi' },
    { time: '14:00', title: 'Turkcell Tahsilat Görüşmesi', target: 'Finans Departmanı' },
    { time: '16:00', title: 'Mercedes EQ Yeni Teklif Hazırlığı', target: 'Satış Pipeline' }
  ];

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left select-none max-h-72 overflow-y-auto">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
        <CalendarRange size={13} />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Bugünün Toplantı Takvimi</h4>
      </div>

      <div className="space-y-3.5 pl-2 relative border-l border-white/5 text-[9.5px] font-semibold text-slate-400">
        {events.map((ev, idx) => (
          <div key={idx} className="relative space-y-0.5 pl-3">
            <span className="absolute -left-[16.5px] top-1.5 w-2 h-2 rounded-full border border-slate-950 bg-blue-500" />
            <div className="flex items-center justify-between">
              <span className="text-white font-extrabold">{ev.title}</span>
              <span className="text-blue-400 font-black tracking-widest">{ev.time}</span>
            </div>
            <p className="text-slate-500 font-bold leading-normal">{ev.target}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
