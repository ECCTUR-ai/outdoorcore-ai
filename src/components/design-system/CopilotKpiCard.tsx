import React from 'react';

interface CopilotKpiCardProps {
  title: string;
  value: string;
  percentage?: string;
  subtext: string;
  icon: React.ReactNode;
  glowColor?: 'blue' | 'green' | 'red' | 'purple' | 'yellow';
}

export function CopilotKpiCard({ title, value, percentage, subtext, icon, glowColor = 'blue' }: CopilotKpiCardProps) {
  const glowClasses = {
    blue: 'border-blue-500/20 shadow-blue-500/5',
    green: 'border-emerald-500/20 shadow-emerald-500/5',
    red: 'border-rose-500/20 shadow-rose-500/5',
    purple: 'border-indigo-500/20 shadow-indigo-500/5',
    yellow: 'border-amber-500/20 shadow-amber-500/5'
  };

  const iconColors = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/10',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10',
    red: 'bg-rose-500/10 text-rose-450 border-rose-500/10',
    purple: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/10',
    yellow: 'bg-amber-500/10 text-amber-400 border-amber-500/10'
  };

  return (
    <div className={`dark-glass-card border rounded-2xl p-4.5 text-left flex flex-col justify-between shadow-sm relative overflow-hidden transition-all duration-250 select-none ${glowClasses[glowColor]}`}>
      {/* Top row metadata */}
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
          {title}
        </span>
        <div className={`w-7 h-7 rounded-xl border flex items-center justify-center shrink-0 ${iconColors[glowColor]}`}>
          {icon}
        </div>
      </div>

      {/* Main value indicator */}
      <div className="space-y-1 mt-4">
        <div className="flex items-baseline gap-1.5 leading-none">
          <h3 className="text-lg font-black text-white leading-none m-0 uppercase tracking-tighter">
            {value}
          </h3>
          {percentage && (
            <span className={`text-[8.5px] font-black uppercase tracking-wider ${
              glowColor === 'red' ? 'text-rose-450' : 
              glowColor === 'green' ? 'text-emerald-450' : 'text-blue-400'
            }`}>
              {percentage}
            </span>
          )}
        </div>
        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider leading-none m-0 pt-0.5">
          {subtext}
        </p>
      </div>
    </div>
  );
}
