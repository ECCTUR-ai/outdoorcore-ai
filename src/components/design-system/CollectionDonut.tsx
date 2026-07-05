import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { financeData } from '@/data/finance';
import { PieChart as PieIcon } from 'lucide-react';

export function CollectionDonut() {
  const data = financeData.collectionStatuses;
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  const formatCurrency = (val: number) => {
    return `₺${(val / 1000000).toFixed(1)}M`;
  };

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left select-none">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
        <PieIcon size={13} />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Tahsilat Dağılımı</h4>
      </div>

      <div className="h-56 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Tooltip 
              formatter={(value: any) => [formatCurrency(Number(value)), 'Tutar']}
              contentStyle={{ 
                backgroundColor: '#0f172a', 
                borderColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: 'bold',
                color: '#fff'
              }}
            />
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Total ciro display in the center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
          <span className="text-[8px] text-slate-550 font-black uppercase tracking-wider">TOPLAM</span>
          <span className="text-sm font-black text-white leading-none">₺684.5M</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[9px] font-bold text-slate-400 mt-2 border-t border-white/5 pt-3">
        {data.map(item => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="truncate">{item.name}: <span className="text-white font-extrabold">{formatCurrency(item.value)}</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}
