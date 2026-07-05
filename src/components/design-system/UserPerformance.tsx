import React from 'react';
import { ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Award } from 'lucide-react';

export function UserPerformance() {
  const chartData = [
    { name: 'Pzt', completed: 4 },
    { name: 'Sal', completed: 6 },
    { name: 'Çar', completed: 3 },
    { name: 'Per', completed: 5 },
    { name: 'Cum', completed: 8 }
  ];

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left select-none">
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Award size={13} />
          <h4 className="text-xs font-black text-white uppercase tracking-wider">Kişisel Performans Skoru</h4>
        </div>
        <span className="text-[9px] font-black text-emerald-450 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10">Skor: 9.6</span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-[10px] font-semibold text-slate-400">
        <div className="p-2.5 rounded-xl bg-white/3 border border-white/5 space-y-1">
          <span className="text-slate-550 text-[8.5px] font-bold block uppercase tracking-wider">Bugün Tamamlanan</span>
          <span className="text-white block font-black text-xs">8 Görev</span>
        </div>
        <div className="p-2.5 rounded-xl bg-white/3 border border-white/5 space-y-1">
          <span className="text-slate-550 text-[8.5px] font-bold block uppercase tracking-wider">Haftalık Hedef</span>
          <span className="text-slate-200 block font-black text-xs">26 Görev</span>
        </div>
      </div>

      <div className="h-16 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <Bar dataKey="completed" fill="#3b82f6" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
