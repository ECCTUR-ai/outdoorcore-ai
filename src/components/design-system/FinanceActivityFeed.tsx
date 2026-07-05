import React from 'react';
import { financeData } from '@/data/finance';
import { Activity, Clock } from 'lucide-react';

export function FinanceActivityFeed() {
  const activities = financeData.activities;

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left select-none max-h-72 overflow-y-auto">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
        <Activity size={13} />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Canlı Finans Akışı</h4>
      </div>

      <div className="space-y-3.5 pl-2 relative border-l border-white/5 text-[9.5px] font-semibold text-slate-400">
        {activities.map((act, idx) => (
          <div key={idx} className="relative space-y-0.5 pl-3">
            <span className="absolute -left-[16.5px] top-1.5 w-2 h-2 rounded-full border border-slate-950 bg-emerald-500" />
            <div className="flex items-center justify-between">
              <span className="text-white font-extrabold">{act.type}</span>
              <span className="text-slate-550 flex items-center gap-0.5 text-[8px] font-bold">
                <Clock size={8} />
                {act.time}
              </span>
            </div>
            <p className="text-slate-400 font-bold leading-normal">{act.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
