import React from 'react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import { Coins } from 'lucide-react';

export function FinanceOverview() {
  const cashFlowMiniData = [
    { name: 'Oca', value: 30 },
    { name: 'Şub', value: 34 },
    { name: 'Mar', value: 38 },
    { name: 'Nis', value: 35 },
    { name: 'May', value: 41 },
    { name: 'Haz', value: 42.8 }
  ];

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left select-none">
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Coins size={13} />
          <h4 className="text-xs font-black text-white uppercase tracking-wider">Finansal Nakit Akışı</h4>
        </div>
        <span className="text-[9px] font-black text-emerald-450 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10">₺42.8M Tahsilat</span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-[10px] font-semibold text-slate-400">
        <div className="p-2.5 rounded-xl bg-white/3 border border-white/5 space-y-1">
          <span className="text-slate-500 text-[8.5px] font-bold block uppercase tracking-wider">Tahsil Edilen</span>
          <span className="text-white block font-black text-xs">₺671.900.000</span>
        </div>
        <div className="p-2.5 rounded-xl bg-white/3 border border-white/5 space-y-1">
          <span className="text-slate-500 text-[8.5px] font-bold block uppercase tracking-wider">Bekleyen faturalar</span>
          <span className="text-slate-200 block font-black text-xs">₺9.500.000</span>
        </div>
        <div className="p-2.5 rounded-xl bg-white/3 border border-white/5 space-y-1">
          <span className="text-slate-500 text-[8.5px] font-bold block uppercase tracking-wider">Geciken Ödemeler</span>
          <span className="text-amber-400 block font-black text-xs">₺3.100.000</span>
        </div>
        <div className="p-2.5 rounded-xl bg-rose-500/5 border border-rose-500/10 space-y-1 animate-pulse">
          <span className="text-rose-500/70 text-[8.5px] font-bold block uppercase tracking-wider">Kritik Tahsilat Riski</span>
          <span className="text-rose-400 block font-black text-xs">₺12.600.000</span>
        </div>
      </div>

      <div className="h-16 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={cashFlowMiniData}>
            <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
