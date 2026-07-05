import React from 'react';
import {
  ResponsiveContainer,
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

interface AreaChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  color?: string;
  height?: number;
}

export function AreaChart({
  data,
  xKey,
  yKey,
  color = '#4f46e5', // indigo-600
  height = 300
}: AreaChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <RechartsAreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
        >
          <defs>
            <linearGradient id={`grad-${yKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.12}/>
              <stop offset="95%" stopColor={color} stopOpacity={0.01}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="rgba(0, 0, 0, 0.04)" 
          />
          <XAxis
            dataKey={xKey}
            tickLine={false}
            axisLine={false}
            dy={8}
            style={{
              fontSize: '9px',
              fontFamily: 'sans-serif',
              fontWeight: 700,
              fill: 'rgba(0, 0, 0, 0.35)'
            }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            dx={-8}
            style={{
              fontSize: '9px',
              fontFamily: 'sans-serif',
              fontWeight: 700,
              fill: 'rgba(0, 0, 0, 0.35)'
            }}
          />
          <Tooltip
            contentStyle={{
              background: '#0f172a',
              border: 'none',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 750,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Area
            type="monotone"
            dataKey={yKey}
            stroke={color}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#grad-${yKey})`}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}
