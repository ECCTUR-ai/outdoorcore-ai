import React from 'react';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy' | 'away';
}

export function Avatar({
  src,
  name = 'Guest',
  size = 'md',
  status,
  className = '',
  ...props
}: AvatarProps) {
  const getInitials = (n: string) => {
    return n
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sizes = {
    xs: 'w-6 h-6 text-[9px] rounded-lg shadow-sm',
    sm: 'w-8 h-8 text-[10px] rounded-xl shadow-sm',
    md: 'w-10 h-10 text-[11px] rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-800',
    lg: 'w-12 h-12 text-xs rounded-2xl shadow-md border border-slate-200/60 dark:border-slate-800',
    xl: 'w-16 h-16 text-sm rounded-3xl shadow-lg border border-slate-200/80 dark:border-slate-800'
  };

  const statusColors = {
    online: 'bg-emerald-500 ring-white dark:ring-slate-950',
    offline: 'bg-slate-400 ring-white dark:ring-slate-950',
    busy: 'bg-rose-500 ring-white dark:ring-slate-950',
    away: 'bg-amber-500 ring-white dark:ring-slate-950'
  };

  const statusSizes = {
    xs: 'w-2 h-2 -bottom-0.5 -right-0.5 ring-[1.5px]',
    sm: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5 ring-[2px]',
    md: 'w-3 h-3 -bottom-0.5 -right-0.5 ring-[2px]',
    lg: 'w-3.5 h-3.5 -bottom-0.5 -right-0.5 ring-[2.5px]',
    xl: 'w-4 h-4 -bottom-1 -right-1 ring-[3px]'
  };

  return (
    <div className={`relative shrink-0 flex items-center justify-center font-bold ${sizes[size]} ${className}`} {...props}>
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover rounded-[inherit]"
        />
      ) : (
        <div className="w-full h-full rounded-[inherit] bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex items-center justify-center uppercase select-none">
          {getInitials(name)}
        </div>
      )}
      {status && (
        <span className={`absolute rounded-full ring-offset-0 ${statusColors[status]} ${statusSizes[size]}`} />
      )}
    </div>
  );
}
