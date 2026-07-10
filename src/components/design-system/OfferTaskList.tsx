import React from 'react';
import { CalendarRange } from 'lucide-react';

export function OfferTaskList() {
  const tasks = [
    { text: 'Samsung teklif son takip', due: '2 gün kaldı', color: 'text-rose-400' },
    { text: 'Mercedes sunum görüşmesi', due: '05 Haz 2026', color: 'text-amber-400' },
    { text: 'Garanti BBVA revize teklif teslimi', due: '07 Haz 2026', color: 'text-slate-400' }
  ];

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 select-none text-slate-400">
        <CalendarRange size={13} />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Yaklaşan İşler</h4>
      </div>
      <div className="space-y-3">
        {tasks.map((task, idx) => (
          <div key={idx} className="flex justify-between items-center text-[10px] leading-tight pb-2 border-b border-white/3 last:border-0 last:pb-0">
            <span className="text-slate-350 font-semibold truncate max-w-[170px]">{task.text}</span>
            <span className={`text-[8.5px] font-black uppercase shrink-0 pl-2 ${task.color}`}>{task.due}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
