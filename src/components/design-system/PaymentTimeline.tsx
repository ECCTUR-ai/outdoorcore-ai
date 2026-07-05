import React from 'react';
import { CalendarRange, Sparkles, AlertTriangle } from 'lucide-react';

export function PaymentTimeline() {
  const events = [
    { period: 'Gecikenler', amount: '₺37.900.000', count: '2 Cari', color: 'border-rose-500 text-rose-450 bg-rose-500/10' },
    { period: 'Bugün', amount: '₺0', count: 'Ödeme yok', color: 'border-white/5 text-slate-500 bg-white/3' },
    { period: 'Bu Hafta', amount: '₺15.000.000', count: 'THY Taksit', color: 'border-blue-500 text-blue-400 bg-blue-500/10' },
    { period: 'Bu Ay', amount: '₺55.000.000', count: '4 Taksit', color: 'border-indigo-500 text-indigo-400 bg-indigo-500/10' }
  ];

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left select-none">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
        <CalendarRange size={13} />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Tahsilat Takvimi</h4>
      </div>

      <div className="grid grid-cols-4 gap-3 pt-1 text-center">
        {events.map(ev => (
          <div 
            key={ev.period}
            className={`p-3.5 rounded-2xl border flex flex-col justify-between h-28 ${ev.color}`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest block leading-none">{ev.period}</span>
            <div className="space-y-0.5 my-auto">
              <span className="text-[11px] font-black block leading-snug">{ev.amount}</span>
              <span className="text-[8px] font-bold block opacity-70 truncate">{ev.count}</span>
            </div>
            <span className="text-[7.5px] font-black uppercase tracking-widest block leading-none">Takvim</span>
          </div>
        ))}
      </div>
    </div>
  );
}
