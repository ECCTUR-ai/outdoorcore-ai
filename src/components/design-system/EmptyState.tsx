import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionText,
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col justify-center items-center text-center p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/20 dark:bg-slate-900/10 min-h-[300px]">
      <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-150/40 dark:border-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 shadow-sm animate-pulse">
        {icon}
      </div>
      <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1.5">
        {title}
      </h4>
      <p className="text-[11px] text-slate-450 dark:text-slate-500 font-semibold max-w-xs leading-relaxed mb-5">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="minimal" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
