import React from 'react';
import { Sparkles, Calendar, TrendingUp, Users } from 'lucide-react';

export function FinancePredictionCard() {
  const points = [
    'Önümüzdeki 30 gün içinde beklenen net tahsilat: ₺38.5M.',
    'Riskli tahsilat hacmi: ₺4.8M seviyesindedir.',
    'Tahmini tahsilat başarı oranı: %95.0.',
    'En yüksek nakit girdisi Samsung Electronics carisinden beklenmektedir.',
    'Mercedes-Benz cildinde ıslak imza kaynaklı gecikme riski bulunmaktadır.'
  ];

  return (
    <div className="bg-gradient-to-br from-blue-950/40 to-indigo-950/40 border border-blue-500/15 rounded-3xl p-6 text-left select-none space-y-4 shadow-xl">
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div className="flex items-center gap-1.5 text-blue-400">
          <Sparkles size={14} className="animate-pulse" />
          <h4 className="text-xs font-black text-white uppercase tracking-wider">AI Finansal Öngörüler</h4>
        </div>
        <span className="text-[8.5px] bg-blue-500/10 text-blue-400 border border-blue-500/10 px-2 py-0.5 rounded font-black uppercase tracking-wider">30 Günlük Tahmin</span>
      </div>

      <div className="grid grid-cols-3 gap-3.5 pt-1 text-center">
        <div className="p-3.5 rounded-2xl bg-[#08111f]/40 border border-white/5 space-y-1">
          <div className="mx-auto text-blue-400 w-fit"><TrendingUp size={14} /></div>
          <span className="text-[8px] text-slate-500 block uppercase tracking-wider">Beklenen Gelir</span>
          <span className="text-white block text-xs font-black">₺38.5M</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#08111f]/40 border border-white/5 space-y-1">
          <div className="mx-auto text-emerald-400 w-fit"><Calendar size={14} /></div>
          <span className="text-[8px] text-slate-500 block uppercase tracking-wider">Başarı Oranı</span>
          <span className="text-emerald-450 block text-xs font-black">%95.0</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#08111f]/40 border border-white/5 space-y-1">
          <div className="mx-auto text-rose-400 w-fit"><Users size={14} /></div>
          <span className="text-[8px] text-slate-500 block uppercase tracking-wider">Risk Hacmi</span>
          <span className="text-rose-450 block text-xs font-black">₺4.8M</span>
        </div>
      </div>

      <ul className="space-y-2 pl-3.5 list-disc text-[9.5px] leading-relaxed font-bold text-slate-450 pt-2 border-t border-white/5">
        {points.map((pt, idx) => (
          <li key={idx} className="hover:text-slate-350 duration-100">{pt}</li>
        ))}
      </ul>
    </div>
  );
}
