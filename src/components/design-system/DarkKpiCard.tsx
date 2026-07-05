import React from 'react';

interface DarkKpiCardProps {
  title: string;
  value: string;
  percentage: string;
  subtext: string;
  icon: React.ReactNode;
  iconBgColor: string; // e.g. 'bg-blue-500/10 text-blue-400'
  glowColor?: 'green' | 'yellow' | 'red' | 'blue' | 'purple' | 'none';
  sparkline?: boolean;
}

export function DarkKpiCard({
  title,
  value,
  percentage,
  subtext,
  icon,
  iconBgColor,
  glowColor = 'none',
  sparkline = false
}: DarkKpiCardProps) {
  const glowStyles = {
    green: 'border-emerald-500/20 shadow-emerald-500/5 shadow-md',
    yellow: 'border-amber-500/20 shadow-amber-500/5 shadow-md',
    red: 'border-rose-500/20 shadow-rose-500/5 shadow-md',
    blue: 'border-blue-500/20 shadow-blue-500/5 shadow-md',
    purple: 'border-purple-500/20 shadow-purple-500/5 shadow-md',
    none: 'border-slate-800/40 shadow-none'
  };

  return (
    <div className={`dark-glass-card rounded-2xl p-4.5 border flex flex-col justify-between transition-all duration-300 hover:border-slate-750/70 hover:translate-y-[-2px] ${glowStyles[glowColor]}`}>
      {/* Top row */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-450 dark:text-slate-400 uppercase tracking-widest leading-none">
          {title}
        </span>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center border border-white/5 shadow-sm shrink-0 ${iconBgColor}`}>
          {icon}
        </div>
      </div>

      {/* Main value & change tags */}
      <div className="flex items-baseline gap-2 mt-4">
        <span className="text-xl font-black text-white leading-none tracking-tight">
          {value}
        </span>
        <span className={`text-[10px] font-black ${
          percentage.startsWith('-') || percentage.includes('düşüş') || percentage.includes('serviste')
            ? 'text-rose-450'
            : percentage.includes('yükseliş') || percentage.startsWith('%100') || percentage.startsWith('%61')
              ? 'text-emerald-450'
              : 'text-indigo-400'
        }`}>
          {percentage}
        </span>
      </div>

      {/* Subtext and optional chart sparkline */}
      <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-white/5">
        <span className="text-[9px] text-slate-500 dark:text-slate-500 font-bold uppercase tracking-wider">
          {subtext}
        </span>
        {sparkline && (
          <div className="w-16 h-5 select-none shrink-0">
            <svg viewBox="0 0 60 20" className="w-full h-full text-emerald-400 overflow-visible">
              <path
                d="M0 15 Q 15 5, 30 12 T 60 2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M0 15 Q 15 5, 30 12 T 60 2 L 60 20 L 0 20 Z"
                fill="url(#sparkline-grad)"
                opacity="0.1"
              />
              <defs>
                <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
