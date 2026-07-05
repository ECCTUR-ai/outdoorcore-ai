import React from 'react';
import { History } from 'lucide-react';

export function OfferActivityFeed() {
  const activities = [
    { text: 'Samsung için teklif revize edildi', time: '1 saat önce' },
    { text: 'Turkcell görüşme notu eklendi', time: '3 saat önce' },
    { text: 'THY sunum tarihi oluşturuldu', time: 'Dün' },
    { text: 'LC Waikiki fiyat revizyonu bekliyor', time: '2 gün önce' }
  ];

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 select-none text-slate-400">
        <History size={13} />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Son Aktiviteler</h4>
      </div>
      <div className="space-y-3">
        {activities.map((act, idx) => (
          <div key={idx} className="flex justify-between items-center text-[10px] leading-tight pb-2 border-b border-white/3 last:border-0 last:pb-0">
            <span className="text-slate-300 font-semibold">{act.text}</span>
            <span className="text-[8.5px] text-slate-500 font-bold shrink-0 pl-2">{act.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
