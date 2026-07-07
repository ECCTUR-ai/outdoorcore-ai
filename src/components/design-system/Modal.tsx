import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footerActions?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footerActions,
  size = 'md'
}: ModalProps) {
  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/30 dark:bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className={`relative w-full ${sizes[size]} max-h-[90vh] flex flex-col transform overflow-hidden rounded-3xl border border-slate-100 dark:border-slate-850 bg-white dark:bg-slate-950 text-left shadow-2xl transition-all animate-scale-in duration-200 z-[101]`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 px-6 pt-6 pb-4 shrink-0">
          <h3 className="text-xs font-black text-slate-850 dark:text-slate-200 uppercase tracking-wider m-0">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors p-1 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-4 text-xs text-slate-650 dark:text-slate-400 font-medium leading-relaxed scrollbar-thin">
          {children}
        </div>

        {/* Footer */}
        <div 
          className="sticky bottom-0 z-50 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-850 px-6 pt-4 pb-6 shrink-0 bg-white dark:bg-slate-950"
        >
          {footerActions ? footerActions : (
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Kapat
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
