import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { reportsData } from '@/data/reports';
import { Button } from './Button';
import { TrendingUp } from 'lucide-react';

export function RevenueAnalytics() {
  const [activeRange, setActiveRange] = useState<'monthly' | 'yearly'>('monthly');
  const data = reportsData.revenueTrends[activeRange];

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-2 border-b border-white/5">
        <div className="flex items-center gap-1.5 text-slate-400 select-none">
          <TrendingUp size={13} />
          <h4 className="text-xs font-black text-white uppercase tracking-wider">Ciro ve Doluluk Eğilimi</h4>
        </div>
        <div className="flex gap-1">
          <Button 
            variant={activeRange === 'monthly' ? 'primary' : 'outline'} 
            size="xs"
            onClick={() => setActiveRange('monthly')}
            className="text-[9px] font-black uppercase tracking-wider"
          >
            Aylık (Haziran)
          </Button>
          <Button 
            variant={activeRange === 'yearly' ? 'primary' : 'outline'} 
            size="xs"
            onClick={() => setActiveRange('yearly')}
            className="text-[9px] font-black uppercase tracking-wider"
          >
            Yıllık
          </Button>
        </div>
      </div>

      <div className="h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="occupancyGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" />
            <XAxis 
              dataKey="period" 
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
            <Area 
              name="Ciro (Milyon ₺)" 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#revenueGlow)" 
            />
            <Area 
              name="Doluluk Oranı (%)" 
              type="monotone" 
              dataKey="occupancy" 
              stroke="#10b981" 
              strokeWidth={1.5}
              fillOpacity={1} 
              fill="url(#occupancyGlow)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
