import React from 'react';
import { Badge } from './Badge';
import { Button } from './Button';
import { CheckSquare, Check, X } from 'lucide-react';

export function ApprovalCenter() {
  const approvals = [
    { type: 'Teklif', target: 'Mercedes EQ Lansmanı', value: '₺7.900.000' },
    { type: 'Kreatif', target: 'THY Global Miles Video', value: 'Spot MP4' },
    { type: 'Sözleşme', target: 'Samsung SmartThings', value: 'Levent LED' },
    { type: 'Rezervasyon', target: 'Turkcell CIP Pano', value: 'SG-023' }
  ];

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left select-none max-h-72 overflow-y-auto">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
        <CheckSquare size={13} />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Onay Bekleyen Talepler</h4>
      </div>

      <div className="space-y-2.5 pt-0.5">
        {approvals.map((ap, idx) => (
          <div 
            key={idx} 
            className="p-2.5 rounded-xl bg-[#08111f]/30 border border-white/5 flex items-center justify-between text-[9.5px] hover:bg-white/3 duration-100"
          >
            <div className="space-y-0.5 leading-none">
              <span className="text-white font-extrabold block leading-none">{ap.target}</span>
              <span className="text-[8px] text-slate-505 font-bold block mt-0.5 uppercase">{ap.type}: {ap.value}</span>
            </div>
            <div className="flex gap-1 items-center shrink-0">
              <button 
                onClick={() => alert('Talep onaylandı.')} 
                className="w-5.5 h-5.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center cursor-pointer hover:bg-emerald-500/25 duration-100"
              >
                <Check size={10} />
              </button>
              <button 
                onClick={() => alert('Talep reddedildi.')} 
                className="w-5.5 h-5.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center cursor-pointer hover:bg-rose-500/25 duration-100"
              >
                <X size={10} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
