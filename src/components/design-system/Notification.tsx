import React from 'react';
import { Info, CheckCircle, AlertTriangle, X } from 'lucide-react';

interface NotificationProps {
  title: string;
  description: string;
  type?: 'info' | 'success' | 'alert';
  onClose?: () => void;
}

export function Notification({
  title,
  description,
  type = 'info',
  onClose
}: NotificationProps) {
  const styles = {
    info: 'bg-indigo-50/70 border-indigo-150/40 text-indigo-800 dark:bg-indigo-950/20 dark:border-indigo-900/30 dark:text-indigo-400',
    success: 'bg-emerald-50/70 border-emerald-150/40 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400',
    alert: 'bg-amber-50/70 border-amber-150/40 text-amber-800 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-400'
  };

  const icons = {
    info: <Info size={15} className="text-indigo-500" />,
    success: <CheckCircle size={15} className="text-emerald-500" />,
    alert: <AlertTriangle size={15} className="text-amber-500" />
  };

  return (
    <div className={`p-4 rounded-2xl border ${styles[type]} flex items-start gap-3 shadow-sm relative overflow-hidden transition-all duration-200 animate-slide-in`}>
      <div className="shrink-0 mt-0.5">{icons[type]}</div>
      <div className="space-y-0.5 flex-1 pr-4">
        <h5 className="text-xs font-black uppercase tracking-wider leading-none m-0">
          {title}
        </h5>
        <p className="text-[11px] font-semibold opacity-85 leading-relaxed m-0 mt-1">
          {description}
        </p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}
