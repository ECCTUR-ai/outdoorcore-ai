import React from 'react';
import { Contract } from '@/data/contracts';
import { ContractStatusBadge } from './ContractStatusBadge';
import { Badge } from './Badge';
import { Sparkles, Calendar, DollarSign, Clock } from 'lucide-react';

interface ContractCardProps {
  contract: Contract;
  isActive: boolean;
  onClick: () => void;
}

export function ContractCard({ contract, isActive, onClick }: ContractCardProps) {
  return (
    <div
      onClick={onClick}
      className={`dark-glass-card border rounded-2xl p-4.5 cursor-pointer transition-all duration-200 select-none text-left flex flex-col justify-between ${
        isActive 
          ? 'border-blue-500/30 bg-[#22314a]/30 shadow-md shadow-blue-500/5' 
          : 'border-white/5 hover:border-white/10 hover:bg-[#22314a]/25'
      }`}
    >
      {/* Header title metadata */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-xs flex items-center justify-center shrink-0">
            {contract.logo}
          </div>
          <div className="space-y-0.5">
            <h4 className="text-[11px] font-black text-white uppercase leading-none truncate max-w-[120px]">{contract.clientName}</h4>
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">{contract.contractNo}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <ContractStatusBadge status={contract.status} />
          {contract.crmTier === 'VIP' && (
            <span className="text-[7.5px] bg-rose-500/10 text-rose-400 border border-rose-500/10 px-1 py-0.2 rounded font-black uppercase tracking-wider block mt-1">VIP</span>
          )}
        </div>
      </div>

      {/* Date fields and countdown logs */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-3.5 border-t border-white/5 text-[10px]">
        <div className="space-y-0.5">
          <span className="text-slate-500 font-bold uppercase tracking-wider block">Sözleşme Tutarı</span>
          <span className="text-white font-extrabold block">{contract.value}</span>
        </div>
        <div className="space-y-0.5 text-right">
          <span className="text-slate-500 font-bold uppercase tracking-wider block">Kalan Süre</span>
          <span className="text-slate-200 font-extrabold block">{contract.daysLeft} Gün</span>
        </div>
        <div className="col-span-2 space-y-1.5 border-t border-white/3 pt-2 mt-1">
          <div className="flex justify-between items-center text-[8.5px] text-slate-500 font-bold uppercase tracking-wider">
            <span>Sürec İlerlemesi</span>
            <span>%{contract.progress}</span>
          </div>
          {/* Progress bar line representation */}
          <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                contract.status === 'Riskli' ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${contract.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Risk indicators */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/3 text-[9px] font-bold text-slate-500 select-none">
        <span className="uppercase tracking-wider">Tarih: {contract.startDate} - {contract.endDate}</span>
        <span className={`px-1.5 py-0.2 rounded border flex items-center gap-0.5 scale-[0.9] origin-right ${
          contract.aiRiskScore >= 7 
            ? 'bg-rose-500/10 text-rose-450 border-rose-500/10 font-black' 
            : 'bg-emerald-500/10 text-emerald-450 border-emerald-500/10 font-black'
        }`}>
          <Sparkles size={8} />
          Risk: {contract.aiRiskScore}
        </span>
      </div>
    </div>
  );
}
