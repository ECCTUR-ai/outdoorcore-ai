import React from 'react';
import { Offer } from '@/data/offers';
import { OfferCard } from './OfferCard';

interface OfferColumnProps {
  stage: Offer['stage'];
  offers: Offer[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function OfferColumn({ stage, offers, selectedId, onSelect }: OfferColumnProps) {
  const stageOffers = offers.filter(o => o.stage === stage);
  const totalValueNumeric = stageOffers.reduce((acc, curr) => acc + curr.valueNumeric, 0);

  // Format money
  const formattedTotal = totalValueNumeric === 0 
    ? '₺0' 
    : totalValueNumeric >= 1000000 
      ? `₺${(totalValueNumeric / 1000000).toFixed(1)}M` 
      : `₺${(totalValueNumeric / 1000).toFixed(0)}K`;

  return (
    <div className="w-72 shrink-0 flex flex-col max-h-[500px] bg-slate-900/40 border border-white/3 rounded-2xl p-3.5 space-y-3.5 select-none text-left">
      {/* Column Title Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <div className="space-y-0.5">
          <span className="text-[10px] font-black text-white uppercase tracking-wider block">{stage}</span>
          <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Toplam: {formattedTotal}</span>
        </div>
        <span className="text-[9.5px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/10 shrink-0">
          {stageOffers.length}
        </span>
      </div>

      {/* Cards list container */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5 min-h-[100px] scrollbar-thin">
        {stageOffers.length > 0 ? (
          stageOffers.map(offer => (
            <OfferCard
              key={offer.id}
              offer={offer}
              isActive={selectedId === offer.id}
              onSelect={onSelect}
            />
          ))
        ) : (
          <div className="h-20 border border-dashed border-white/5 rounded-xl flex items-center justify-center text-slate-650 text-[9px] font-bold uppercase tracking-wider select-none">
            Teklif Yok
          </div>
        )}
      </div>
    </div>
  );
}
