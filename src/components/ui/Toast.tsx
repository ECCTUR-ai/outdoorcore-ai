import React, { useEffect } from 'react';
import { Info, CheckCircle, AlertTriangle, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface ToastProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastProps) {
  return (
    <div className="fixed top-5 right-5 z-[200] flex flex-col gap-3 max-w-sm w-full select-none">
      {toasts.map(t => (
        <ToastCard key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastCard({ toast, onRemove }: { toast: ToastItem; onRemove: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  const styles = {
    info: 'bg-[#151B2D]/95 border-blue-500/30 text-blue-400',
    success: 'bg-[#151B2D]/95 border-emerald-500/30 text-emerald-400',
    warning: 'bg-[#151B2D]/95 border-amber-500/30 text-amber-400',
    error: 'bg-[#151B2D]/95 border-red-500/30 text-red-400'
  };

  const icons = {
    info: <Info size={16} className="text-blue-500 shrink-0" />,
    success: <CheckCircle size={16} className="text-emerald-500 shrink-0" />,
    warning: <AlertTriangle size={16} className="text-amber-500 shrink-0" />,
    error: <AlertTriangle size={16} className="text-red-500 shrink-0" />
  };

  return (
    <div className={`p-4 rounded-2xl border ${styles[toast.type]} backdrop-blur-md flex items-start gap-3 shadow-2xl relative overflow-hidden transition-all duration-300 animate-slide-in`}>
      <div>{icons[toast.type]}</div>
      <div className="space-y-1 flex-1 pr-4 text-left">
        <h5 className="text-xs font-black uppercase tracking-wider leading-none text-white m-0">
          {toast.title}
        </h5>
        <p className="text-[10px] font-semibold text-slate-400 leading-normal m-0 mt-1">
          {toast.description}
        </p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-slate-500 hover:text-white cursor-pointer transition-colors"
      >
        <X size={12} />
      </button>
    </div>
  );
}
