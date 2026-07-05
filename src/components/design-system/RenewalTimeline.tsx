import React from 'react';
import { CalendarRange } from 'lucide-react';

export function RenewalTimeline() {
  const steps = [
    { label: '90 Gün', desc: 'Mercedes-Benz (84 g)', status: 'active', color: 'border-blue-500 text-blue-400 bg-blue-500/10' },
    { label: '60 Gün', desc: 'Samsung (74 g)', status: 'active', color: 'border-indigo-500 text-indigo-400 bg-indigo-500/10' },
    { label: '30 Gün', desc: 'Pegasus (38 g)', status: 'urgent', color: 'border-amber-500 text-amber-400 bg-amber-500/10' },
    { label: '7 Gün', desc: 'Turkcell (18 g)', status: 'critical', color: 'border-rose-500 text-rose-400 bg-rose-500/10' },
    { label: 'Bugün', desc: 'Sözleşme Sonu', status: 'none', color: 'border-white/5 text-slate-500 bg-white/3' }
  ];

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 select-none text-slate-400">
        <CalendarRange size={13} />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Yenileme Takvimi Aşamaları</h4>
      </div>

      <div className="grid grid-cols-5 gap-3.5 pt-1 text-center">
        {steps.map(step => (
          <div 
            key={step.label}
            className={`p-3.5 rounded-2xl border flex flex-col justify-between h-28 ${step.color}`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest block leading-none">{step.label}</span>
            <div className="space-y-0.5 my-auto">
              <span className="text-[9.5px] font-bold block leading-snug">{step.desc}</span>
            </div>
            <span className="text-[7.5px] font-black uppercase tracking-widest block leading-none">Takip</span>
          </div>
        ))}
      </div>
    </div>
  );
}
