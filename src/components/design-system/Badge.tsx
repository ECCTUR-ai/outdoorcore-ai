import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'muted';
  styleType?: 'soft' | 'solid' | 'outline';
}

export function Badge({
  children,
  variant = 'primary',
  styleType = 'soft',
  className = '',
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider select-none shrink-0 border duration-200';
  
  const variants = {
    primary: {
      soft: 'bg-indigo-50 text-indigo-650 border-indigo-150/40 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30',
      solid: 'bg-indigo-600 text-white border-indigo-700',
      outline: 'bg-transparent text-indigo-600 border-indigo-200 dark:border-indigo-800'
    },
    success: {
      soft: 'bg-emerald-50 text-emerald-650 border-emerald-150/40 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
      solid: 'bg-emerald-600 text-white border-emerald-700',
      outline: 'bg-transparent text-emerald-600 border-emerald-200 dark:border-emerald-800'
    },
    warning: {
      soft: 'bg-amber-50 text-amber-650 border-amber-150/40 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
      solid: 'bg-amber-650 text-white border-amber-700',
      outline: 'bg-transparent text-amber-600 border-amber-200 dark:border-amber-800'
    },
    danger: {
      soft: 'bg-rose-50 text-rose-650 border-rose-150/40 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30',
      solid: 'bg-rose-600 text-white border-rose-700',
      outline: 'bg-transparent text-rose-600 border-rose-200 dark:border-rose-800'
    },
    info: {
      soft: 'bg-sky-50 text-sky-650 border-sky-150/40 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900/30',
      solid: 'bg-sky-600 text-white border-sky-700',
      outline: 'bg-transparent text-sky-600 border-sky-200 dark:border-sky-800'
    },
    muted: {
      soft: 'bg-slate-100 text-slate-600 border-slate-200/50 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800',
      solid: 'bg-slate-600 text-white border-slate-700',
      outline: 'bg-transparent text-slate-500 border-slate-200 dark:border-slate-800'
    }
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant][styleType]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
