import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'elevated' | 'glowing';
  blur?: boolean;
}

export function Card({
  children,
  variant = 'default',
  blur = false,
  className = '',
  ...props
}: CardProps) {
  const baseStyles = 'rounded-3xl border border-slate-100 dark:border-slate-850 p-6 transition-all duration-200 overflow-hidden';
  
  const variants = {
    default: 'bg-white dark:bg-slate-950 shadow-sm shadow-slate-100/50 dark:shadow-none',
    flat: 'bg-slate-50/50 dark:bg-slate-900/20 border-transparent',
    elevated: 'bg-white dark:bg-slate-950 shadow-md hover:shadow-lg shadow-slate-100/70 dark:shadow-none border-slate-200/40',
    glowing: 'bg-white dark:bg-slate-950 shadow-sm relative after:absolute after:inset-[-1px] after:bg-gradient-to-br after:from-indigo-650/10 after:to-blue-500/5 after:z-[-1] after:rounded-3xl after:pointer-events-none'
  };

  const blurStyle = blur ? 'backdrop-blur-md bg-white/90 dark:bg-slate-950/90' : '';

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${blurStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4 mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-xs font-black text-slate-850 dark:text-slate-200 uppercase tracking-wider m-0 ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '', ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-[11px] text-slate-400 dark:text-slate-500 font-medium m-0 mt-0.5 ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`border-t border-slate-100 dark:border-slate-850 pt-4 mt-4 ${className}`} {...props}>
      {children}
    </div>
  );
}
