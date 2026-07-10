import React from 'react';
import { CalendarRange } from 'lucide-react';

interface RenewalTimelineProps {
  contracts?: any[];
}

export function RenewalTimeline({ contracts = [] }: RenewalTimelineProps) {
  const today = new Date();
  
  const groups: Record<string, string[]> = {
    '90 Gün': [],
    '60 Gün': [],
    '30 Gün': [],
    '7 Gün': [],
    'Bugün': []
  };

  contracts.forEach((c: any) => {
    if (c.endDate) {
      const parts = c.endDate.split('.');
      let endD: Date | null = null;
      if (parts.length === 3) {
        endD = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
      } else {
        const d = new Date(c.endDate);
        if (!isNaN(d.getTime())) endD = d;
      }

      if (endD) {
        const diffTime = endD.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const client = c.clientName;
        
        if (diffDays <= 0) {
          groups['Bugün'].push(client);
        } else if (diffDays <= 7) {
          groups['7 Gün'].push(`${client} (${diffDays} g)`);
        } else if (diffDays <= 30) {
          groups['30 Gün'].push(`${client} (${diffDays} g)`);
        } else if (diffDays <= 60) {
          groups['60 Gün'].push(`${client} (${diffDays} g)`);
        } else if (diffDays <= 90) {
          groups['90 Gün'].push(`${client} (${diffDays} g)`);
        }
      }
    }
  });

  const steps = [
    { label: '90 Gün', desc: groups['90 Gün'].join(', ') || '—', color: 'border-blue-500 text-blue-400 bg-blue-500/10' },
    { label: '60 Gün', desc: groups['60 Gün'].join(', ') || '—', color: 'border-indigo-500 text-indigo-400 bg-indigo-500/10' },
    { label: '30 Gün', desc: groups['30 Gün'].join(', ') || '—', color: 'border-amber-500 text-amber-400 bg-amber-500/10' },
    { label: '7 Gün', desc: groups['7 Gün'].join(', ') || '—', color: 'border-rose-500 text-rose-400 bg-rose-500/10' },
    { label: 'Bugün', desc: groups['Bugün'].join(', ') || '—', color: 'border-white/5 text-slate-500 bg-white/3' }
  ];

  const hasAnyUpcoming = Object.values(groups).some(arr => arr.length > 0);

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left select-none">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
        <CalendarRange size={13} />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Yenileme Takvimi Aşamaları</h4>
      </div>

      {hasAnyUpcoming ? (
        <div className="grid grid-cols-5 gap-3.5 pt-1 text-center">
          {steps.map(step => (
            <div 
              key={step.label}
              className={`p-3.5 rounded-2xl border flex flex-col justify-between h-28 ${step.color}`}
            >
              <span className="text-[10px] font-black uppercase tracking-widest block leading-none">{step.label}</span>
              <div className="space-y-0.5 my-auto overflow-hidden">
                <span className="text-[8.5px] font-bold block leading-snug truncate" title={step.desc}>{step.desc}</span>
              </div>
              <span className="text-[7.5px] font-black uppercase tracking-widest block leading-none">Takip</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
          Yaklaşan sözleşme yenilemesi bulunmuyor.
        </div>
      )}
    </div>
  );
}
