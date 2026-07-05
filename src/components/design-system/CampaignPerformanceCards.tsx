import React from 'react';
import { Eye, Users, RefreshCw, Clock, Sparkles, AlertTriangle } from 'lucide-react';

interface CampaignPerformanceCardsProps {
  impressions: string;
  reach: string;
  frequency: number;
  airtimeHours: number;
  bestSpace: string;
  riskySpace: string;
}

export function CampaignPerformanceCards({
  impressions,
  reach,
  frequency,
  airtimeHours,
  bestSpace,
  riskySpace
}: CampaignPerformanceCardsProps) {
  const cards = [
    { label: 'Gösterim', value: impressions, icon: <Eye size={12} />, color: 'text-blue-400' },
    { label: 'Tahmini Erişim', value: reach, icon: <Users size={12} />, color: 'text-emerald-450' },
    { label: 'Ortalama Frekans', value: frequency.toString(), icon: <RefreshCw size={12} />, color: 'text-purple-400' },
    { label: 'Yayın Süresi', value: `${airtimeHours} saat`, icon: <Clock size={12} />, color: 'text-sky-400' },
    { label: 'En İyi Alan', value: bestSpace, icon: <Sparkles size={12} />, color: 'text-amber-400' },
    { label: 'En Riskli Alan', value: riskySpace, icon: <AlertTriangle size={12} />, color: 'text-rose-450' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
      {cards.map(card => (
        <div 
          key={card.label}
          className="dark-glass-card border border-white/5 rounded-2xl p-4.5 text-left flex flex-col justify-between"
        >
          <div className="flex items-center justify-between gap-2 text-slate-500">
            <span className="text-[9px] font-black uppercase tracking-wider block">{card.label}</span>
            <div className={`shrink-0 ${card.color}`}>{card.icon}</div>
          </div>
          <span className="text-[13px] font-black text-white block mt-3.5 leading-none">{card.value}</span>
        </div>
      ))}
    </div>
  );
}
