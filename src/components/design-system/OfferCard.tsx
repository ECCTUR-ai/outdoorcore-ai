import React from 'react';
import { Offer } from '@/data/offers';
import { OfferStatusBadge } from './OfferStatusBadge';
import { Sparkles, User, Target } from 'lucide-react';

interface OfferCardProps {
  offer: Offer;
  isActive: boolean;
  onSelect: (id: string) => void;
}

export function OfferCard({ offer, isActive, onSelect }: OfferCardProps) {
  const priorityBorderColors = {
    'Yüksek': 'border-l-[3.5px] border-l-rose-500',
    'Orta': 'border-l-[3.5px] border-l-amber-500',
    'Düşük': 'border-l-[3.5px] border-l-blue-400'
  };

  return (
    <div
      onClick={() => onSelect(offer.id)}
      className={`dark-glass-card border rounded-2xl p-4.5 cursor-pointer transition-all duration-200 select-none text-left flex flex-col justify-between hover:translate-y-[-1px] ${
        isActive 
          ? 'border-blue-500/30 bg-[#22314a]/30 shadow-md shadow-blue-500/5' 
          : 'border-white/5 hover:border-white/10 hover:bg-[#22314a]/25'
      } ${priorityBorderColors[offer.priority]}`}
    >
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-[11px] font-black text-white uppercase leading-none truncate max-w-[130px]">{offer.clientName}</h4>
          <span className="text-[9px] font-black text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded border border-blue-500/10 flex items-center gap-0.5 shrink-0">
            <Sparkles size={8} />
            {offer.closeProbability}%
          </span>
        </div>
        <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider block truncate max-w-[170px]">{offer.campaignName}</span>
      </div>

      {/* Suggested Spaces Tags */}
      <div className="flex flex-wrap gap-1 mt-2.5">
        {offer.spacesList.map(code => (
          <span key={code} className="px-1.5 py-0.2 rounded-lg bg-white/3 border border-white/5 text-[8.5px] font-black text-slate-400 tracking-tighter">
            {code}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4 pt-3.5 border-t border-white/5">
        <span className="text-xs font-black text-emerald-450 leading-none">{offer.value}</span>
        <div className="flex items-center gap-1 text-[8.5px] text-slate-500 font-bold uppercase tracking-wider shrink-0">
          <User size={10} />
          <span>{offer.owner.split(' ')[0]}</span>
        </div>
      </div>
    </div>
  );
}
