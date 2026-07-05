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
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/30 dark:bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`w-full ${sizes[size]} transform overflow-hidden rounded-3xl border border-slate-100 dark:border-slate-850 bg-white dark:bg-slate-950 p-6 text-left shadow-2xl transition-all animate-scale-in duration-200`}>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4 mb-5">
            <h3 className="text-xs font-black text-slate-850 dark:text-slate-200 uppercase tracking-wider m-0">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors p-1 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl"
            >
              <X size={15} />
            </button>
          </div>

          {/* Body */}
          <div className="text-xs text-slate-650 dark:text-slate-400 font-medium leading-relaxed mb-6">
            {children}
          </div>

          {/* Footer */}
          {footerActions ? (
            <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-850 pt-4">
              {footerActions}
            </div>
          ) : (
            <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-850 pt-4">
              <Button variant="outline" size="sm" onClick={onClose}>
                Kapat
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
