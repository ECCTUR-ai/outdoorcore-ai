import React from 'react';
import { Clock } from 'lucide-react';
import { Badge } from './Badge';

export function DeadlineWidget() {
  const deadlines = [
    { type: 'Bakım', target: 'SG-021 LED Panel', days: 'Bugün', priority: 'Kritik' },
    { type: 'Tahsilat', target: 'Mercedes Taksit', days: '3 Gün', priority: 'Kritik' },
    { type: 'Kampanya', target: 'THY Kreatif Onayı', days: '7 Gün', priority: 'Yüksek' },
    { type: 'Rezervasyon', target: 'Samsung Gelen Lobi', days: '15 Gün', priority: 'Orta' },
    { type: 'Sözleşme', target: 'Turkcell Revize', days: '30 Gün', priority: 'Düşük' }
  ];

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left select-none max-h-72 overflow-y-auto">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
        <Clock size={13} />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Yaklaşan Kritik Süreler</h4>
      </div>

      <div className="space-y-2.5 pt-0.5">
        {deadlines.map((dl, idx) => (
          <div 
            key={idx} 
            className="p-2.5 rounded-xl bg-[#08111f]/30 border border-white/5 flex items-center justify-between text-[9.5px] hover:bg-white/3 duration-100"
          >
            <div className="space-y-0.5 leading-none">
              <span className="text-white font-extrabold block leading-none">{dl.target}</span>
              <span className="text-[8px] text-slate-550 font-bold block mt-0.5 uppercase tracking-wide">{dl.type}</span>
            </div>
            <div className="text-right shrink-0 leading-none">
              <span className="text-[10px] font-black block text-rose-450 leading-none">{dl.days}</span>
              <div className="scale-[0.8] origin-right mt-1.5">
                <Badge variant={dl.priority === 'Kritik' ? 'danger' : dl.priority === 'Yüksek' ? 'danger' : dl.priority === 'Orta' ? 'warning' : 'info'}>
                  {dl.priority}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
