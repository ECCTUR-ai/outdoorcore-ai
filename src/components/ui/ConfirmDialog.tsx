import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../design-system/Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Onayla',
  cancelLabel = 'İptal',
  loading = false
}: ConfirmDialogProps) {
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

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={loading ? undefined : onClose}
      />

      {/* Dialog Container */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-[24px] border border-white/8 bg-[#0b0f19] p-6 text-left shadow-2xl transition-all animate-scale-in duration-200 z-[111] text-white space-y-4">
        
        {/* Title */}
        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl shrink-0">
            <AlertTriangle size={18} />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black text-white uppercase tracking-wider leading-tight">
              {title}
            </h4>
            <p className="text-[10px] font-semibold text-slate-400 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/5">
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="danger"
            size="sm"
            type="button"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
