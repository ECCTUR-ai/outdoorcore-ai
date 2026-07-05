import React from 'react';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

interface BarChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  color?: string;
  height?: number;
}

export function BarChart({
  data,
  xKey,
  yKey,
  color = '#3b82f6', // blue-500
  height = 300
}: BarChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <RechartsBarChart
          data={data}
          margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
        >
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
          <Bar
            dataKey={yKey}
            fill={color}
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
