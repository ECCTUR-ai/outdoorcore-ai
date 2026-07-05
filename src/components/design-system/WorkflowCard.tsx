import React from 'react';
import { ArrowRight, ChevronRight, Play } from 'lucide-react';

interface WorkflowStep {
  label: string;
  icon?: React.ReactNode;
}

interface WorkflowCardProps {
  title: string;
  description: string;
  steps: WorkflowStep[];
  onTrigger?: () => void;
}

export function WorkflowCard({ title, description, steps, onTrigger }: WorkflowCardProps) {
  return (
    <div className="dark-glass-card border border-white/5 hover:border-blue-500/20 rounded-2xl p-4.5 text-left flex flex-col justify-between hover:bg-[#22314a]/10 duration-200 select-none space-y-4">
      {/* Title block */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <h4 className="text-[11px] font-black text-white uppercase tracking-wider">{title}</h4>
          <button 
            onClick={onTrigger}
            className="w-6 h-6 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/25 flex items-center justify-center cursor-pointer transition-colors"
            title="Workflow Çalıştır"
          >
            <Play size={9} fill="currentColor" />
          </button>
        </div>
        <p className="text-[9.5px] text-slate-500 font-semibold leading-normal">{description}</p>
      </div>

      {/* Visual Flow chart steps row */}
      <div className="flex items-center flex-wrap gap-2.5 bg-slate-950/20 border border-white/3 p-3 rounded-xl overflow-x-auto no-scrollbar">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className="flex items-center gap-1.5 shrink-0">
              {step.icon && (
                <span className="text-blue-400 scale-[0.9]">{step.icon}</span>
              )}
              <span className="text-[9px] font-black text-slate-200 uppercase tracking-wide">
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <ChevronRight size={10} className="text-slate-650 shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
