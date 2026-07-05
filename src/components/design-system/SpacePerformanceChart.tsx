import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { reportsData } from '@/data/reports';
import { Map } from 'lucide-react';

export function SpacePerformanceChart() {
  const data = reportsData.spacePerformance.slice(0, 5).map(item => ({
    ...item,
    revenueM: item.revenue / 1000000
  }));

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 select-none text-slate-400">
        <Map size={13} />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">En Değerli Reklam Alanları (Milyon ₺)</h4>
      </div>

      <div className="h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" />
            <XAxis 
              dataKey="spaceCode" 
              stroke="#64748b" 
              fontSize={9} 
              fontWeight="bold" 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={9} 
              fontWeight="bold" 
              tickLine={false} 
              axisLine={false} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0f172a', 
                borderColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: 'bold',
                color: '#fff'
              }}
              labelStyle={{ color: '#64748b' }}
            />
            <Bar dataKey="revenueM" name="Gelir (Milyon ₺)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="occupancy" name="Doluluk Oranı (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
