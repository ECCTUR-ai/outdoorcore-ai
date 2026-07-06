import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'minimal';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  type,
  form,
  onClick,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all rounded-xl focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none border duration-200';
  
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-500 border-indigo-700 hover:border-indigo-600 text-white shadow-sm shadow-indigo-650/15',
    secondary: 'bg-slate-900 hover:bg-slate-850 border-slate-950 text-white dark:bg-white dark:hover:bg-slate-100 dark:border-slate-200 dark:text-slate-900',
    outline: 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900 dark:border-slate-800 dark:text-slate-200',
    ghost: 'bg-transparent hover:bg-slate-100/80 border-transparent text-slate-600 hover:text-slate-900 dark:hover:bg-slate-900/50 dark:text-slate-400 dark:hover:text-slate-200',
    danger: 'bg-rose-50 hover:bg-rose-100 border-rose-200/50 text-rose-600',
    success: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200/50 text-emerald-600',
    minimal: 'bg-slate-50 hover:bg-slate-100 border-slate-200/40 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-850 dark:border-slate-850 dark:text-slate-300'
  };

  const sizes = {
    xs: 'px-2.5 py-1 text-[10px] rounded-lg gap-1.5 h-7',
    sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5 h-9',
    md: 'px-4.5 py-2 text-xs rounded-xl gap-2 h-10',
    lg: 'px-6 py-3 text-sm rounded-2xl gap-2.5 h-12'
  };

  return (
    <button
      type={type}
      form={form}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!loading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
}
