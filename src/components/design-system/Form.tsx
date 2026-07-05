import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ children, className = '', ...props }: LabelProps) {
  return (
    <label
      className={`text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block mb-1.5 select-none ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, leftIcon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 shrink-0 select-none">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={`w-full ${
            leftIcon ? 'pl-10' : 'px-3.5'
          } pr-3.5 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100/50 focus:bg-white dark:bg-slate-900 dark:hover:bg-slate-850 dark:focus:bg-slate-950 border ${
            error ? 'border-rose-450 focus:border-rose-500' : 'border-slate-200/60 dark:border-slate-800/80 focus:border-indigo-650'
          } text-xs focus:outline-none text-slate-850 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all font-semibold shadow-inner duration-150 ${className}`}
          {...props}
        />
        {error && <span className="text-[10px] text-rose-500 font-bold block mt-1">{error}</span>}
      </div>
    );
  }
);

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={`w-full px-3.5 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100/50 focus:bg-white dark:bg-slate-900 dark:hover:bg-slate-850 dark:focus:bg-slate-950 border ${
            error ? 'border-rose-450 focus:border-rose-500' : 'border-slate-200/60 dark:border-slate-800/80 focus:border-indigo-650'
          } text-xs focus:outline-none text-slate-850 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all font-semibold leading-relaxed shadow-inner duration-150 min-h-[80px] ${className}`}
          {...props}
        />
        {error && <span className="text-[10px] text-rose-500 font-bold block mt-1">{error}</span>}
      </div>
    );
  }
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, className = '', error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={`w-full px-3.5 pr-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100/50 dark:bg-slate-900 dark:hover:bg-slate-850 border ${
            error ? 'border-rose-450' : 'border-slate-200/60 dark:border-slate-800/80 focus:border-indigo-650'
          } text-xs focus:outline-none text-slate-850 dark:text-slate-200 font-bold cursor-pointer transition-all appearance-none duration-150 ${className}`}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-slate-450 text-[10px] font-bold">
          ▼
        </div>
        {error && <span className="text-[10px] text-rose-500 font-bold block mt-1">{error}</span>}
      </div>
    );
  }
);

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Switch({ label, className = '', checked, onChange, ...props }: SwitchProps) {
  return (
    <label className={`flex items-center gap-3 cursor-pointer select-none ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
          {...props}
        />
        <div className={`w-9 h-5 rounded-full border border-slate-200 dark:border-slate-800 transition-all duration-200 ${checked ? 'bg-indigo-600 border-indigo-750' : 'bg-slate-100 dark:bg-slate-900'}`} />
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white dark:bg-slate-200 shadow-sm border border-slate-200/50 transition-all duration-200 ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
      </div>
      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{label}</span>
    </label>
  );
}

export function FormGroup({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {children}
    </div>
  );
}
