import React from 'react';
import { reportsData } from '@/data/reports';
import { Layers } from 'lucide-react';

export function PipelineFunnel() {
  const stages = reportsData.funnelStages;
  const maxValue = Math.max(...stages.map(s => s.valueNumeric));

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left select-none">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 select-none text-slate-400">
        <Layers size={13} />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Satış Hunisi (Pipeline Funnel)</h4>
      </div>

      <div className="space-y-2.5 pt-1.5">
        {stages.map((st, idx) => {
          const widthPercent = maxValue > 0 ? (st.valueNumeric / maxValue) * 100 : 0;
          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between items-center text-[9.5px] font-bold text-slate-450 uppercase">
                <span>{st.stage} ({st.count} Fırsat)</span>
                <span className="text-white font-extrabold">{st.value}</span>
              </div>
              <div className="w-full h-4.5 rounded bg-white/3 overflow-hidden border border-white/3">
                <div 
                  className="h-full rounded-r bg-gradient-to-r from-blue-500/20 to-blue-500/50 border-r border-blue-400 transition-all duration-300"
                  style={{ width: `${Math.max(widthPercent, 12)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-3.5 border-t border-white/5 pt-4 text-center">
        <div className="space-y-0.5">
          <span className="text-[8.5px] text-slate-500 block uppercase tracking-wider">Toplam Değer</span>
          <span className="text-white block text-xs font-black">₺198.6M</span>
        </div>
        <div className="space-y-0.5">
          <span className="text-[8.5px] text-slate-500 block uppercase tracking-wider">Kapanma Oranı</span>
          <span className="text-emerald-450 block text-xs font-black">%42.6</span>
        </div>
        <div className="space-y-0.5">
          <span className="text-[8.5px] text-slate-500 block uppercase tracking-wider">Tahmini Satış</span>
          <span className="text-blue-400 block text-xs font-black">₺84.5M</span>
        </div>
      </div>
    </div>
  );
}
