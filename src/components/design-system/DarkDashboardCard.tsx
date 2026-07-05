import React from 'react';

interface DarkDashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  headerActions?: React.ReactNode;
}

export function DarkDashboardCard({
  children,
  title,
  description,
  headerActions,
  className = '',
  ...props
}: DarkDashboardCardProps) {
  return (
    <div
      className={`dark-glass-card rounded-2xl p-5 border border-white/5 flex flex-col justify-between overflow-hidden ${className}`}
      {...props}
    >
      {/* Optional Header */}
      {(title || description || headerActions) && (
        <div className="flex items-start justify-between border-b border-white/5 pb-4 mb-4 select-none">
          <div className="space-y-0.5">
            {title && (
              <h3 className="text-xs font-black text-white uppercase tracking-widest leading-none m-0">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-[10px] text-slate-500 font-bold tracking-wider uppercase m-0 mt-1">
                {description}
              </p>
            )}
          </div>
          {headerActions && <div className="shrink-0">{headerActions}</div>}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 text-slate-300">
        {children}
      </div>
    </div>
  );
}
