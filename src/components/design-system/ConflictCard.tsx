import React from 'react';
import { Conflict } from '@/data/reservations';
import { AlertTriangle, Users } from 'lucide-react';
import { Badge } from './Badge';

interface ConflictCardProps {
  conflicts: Conflict[];
}

export function ConflictCard({ conflicts }: ConflictCardProps) {
  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left">
      <div className="flex items-center gap-2 pb-2 border-b border-white/5 select-none">
        <AlertTriangle size={15} className="text-rose-500 animate-pulse" />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Tespit Edilen Çakışma Riskleri ({conflicts.length})</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {conflicts.map(conf => (
          <div 
            key={conf.id} 
            className="p-3.5 rounded-2xl bg-rose-500/5 border border-rose-500/15 hover:bg-rose-500/10 transition-colors duration-150 relative space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/10 uppercase">
                {conf.spaceCode}
              </span>
              <span className="text-[9px] text-rose-300 font-extrabold uppercase truncate max-w-[150px]">{conf.spaceName}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[10px] font-semibold text-slate-400">
              <div className="space-y-0.5 border-r border-white/5 pr-2">
                <span className="text-[8px] text-slate-500 block uppercase tracking-wider">Rezervasyon A</span>
                <span className="text-white font-extrabold block truncate">{conf.clientA}</span>
                <span className="text-slate-400 block">{conf.datesA}</span>
              </div>
              <div className="space-y-0.5 pl-1">
                <span className="text-[8px] text-slate-500 block uppercase tracking-wider">Rezervasyon B</span>
                <span className="text-white font-extrabold block truncate">{conf.clientB}</span>
                <span className="text-slate-400 block">{conf.datesB}</span>
              </div>
            </div>

            <p className="text-[9.5px] text-rose-350 leading-relaxed font-bold bg-rose-950/20 p-2 rounded-xl border border-rose-500/5 m-0">
              {conf.reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
