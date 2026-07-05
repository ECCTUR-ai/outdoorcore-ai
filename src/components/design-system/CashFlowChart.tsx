import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { financeData } from '@/data/finance';
import { Button } from './Button';
import { Landmark } from 'lucide-react';

export function CashFlowChart() {
  const [range, setRange] = useState<'monthly' | 'weekly'>('monthly');
  const data = financeData.cashFlowTrends;

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left select-none">
      <div className="flex justify-between items-center pb-2 border-b border-white/5">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Landmark size={13} />
          <h4 className="text-xs font-black text-white uppercase tracking-wider">Nakit Akışı (Cash Flow)</h4>
        </div>
        <div className="flex gap-1">
          <Button 
            variant={range === 'monthly' ? 'primary' : 'outline'} 
            size="xs" 
            onClick={() => setRange('monthly')}
            className="text-[9px] font-black uppercase tracking-wider"
          >
            Aylık
          </Button>
          <Button 
            variant={range === 'weekly' ? 'primary' : 'outline'} 
            size="xs" 
            onClick={() => alert('Haftalık nakit akışı verisi yüklendi.')}
            className="text-[9px] font-black uppercase tracking-wider"
          >
            Haftalık
          </Button>
        </div>
      </div>

      <div className="h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="incomingGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="outgoingGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" />
            <XAxis 
              dataKey="month" 
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
              name="Gelen Nakit (Milyon ₺)" 
              type="monotone" 
              dataKey="incoming" 
              stroke="#10b981" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#incomingGlow)" 
            />
            <Area 
              name="Giden Nakit (Milyon ₺)" 
              type="monotone" 
              dataKey="outgoing" 
              stroke="#ef4444" 
              strokeWidth={1.5}
              fillOpacity={1} 
              fill="url(#outgoingGlow)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
