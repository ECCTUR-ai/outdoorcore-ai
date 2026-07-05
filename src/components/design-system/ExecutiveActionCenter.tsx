import React from 'react';
import { reportsData } from '@/data/reports';
import { Badge } from './Badge';
import { CheckSquare } from 'lucide-react';

export function ExecutiveActionCenter() {
  const items = reportsData.actionItems;

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left select-none max-h-72 overflow-y-auto">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
        <CheckSquare size={13} />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Yönetici Aksiyon Merkezi</h4>
      </div>

      <div className="space-y-2.5 pt-0.5">
        {items.map(item => (
          <div 
            key={item.id} 
            className="p-2.5 rounded-xl bg-[#08111f]/30 border border-white/5 flex items-center justify-between text-[9.5px] hover:bg-white/3 duration-100"
          >
            <div className="space-y-0.5 leading-none">
              <span className="text-white font-extrabold block leading-none">{item.title}</span>
              <span className="text-[8px] text-slate-500 font-bold block mt-0.5 uppercase tracking-wide">{item.target}</span>
            </div>
            <Badge variant={
              item.category === 'Aranacaklar' ? 'primary' :
              item.category === 'Teklifler' ? 'warning' :
              item.category === 'İmzalanacaklar' ? 'danger' : 'success'
            }>
              {item.category}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
