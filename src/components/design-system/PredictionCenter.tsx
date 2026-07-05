import React from 'react';
import { Sparkles, Calendar, TrendingUp, Users } from 'lucide-react';

export function PredictionCenter() {
  const predictions = [
    'Önümüzdeki 90 gün içinde doluluk %97 seviyesine çıkabilir.',
    'Samsung ve THY için yeni premium alan önerilebilir.',
    '14 yeni sözleşme imzalanması bekleniyor.',
    '9 sözleşmenin yenilenme ihtimali %80 üzerindedir.'
  ];

  return (
    <div className="bg-gradient-to-br from-blue-950/40 to-indigo-950/40 border border-blue-500/15 rounded-3xl p-6 text-left select-none space-y-4 shadow-xl">
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div className="flex items-center gap-1.5 text-blue-400">
          <Sparkles size={14} className="animate-pulse" />
          <h4 className="text-xs font-black text-white uppercase tracking-wider">AI Tahmin ve Öngörü Merkezi</h4>
        </div>
        <span className="text-[8.5px] bg-blue-500/10 text-blue-400 border border-blue-500/10 px-2 py-0.5 rounded font-black uppercase tracking-wider">90 Günlük Projeksiyon</span>
      </div>

      <div className="grid grid-cols-3 gap-3.5 pt-1 text-center">
        <div className="p-3.5 rounded-2xl bg-[#08111f]/40 border border-white/5 space-y-1">
          <div className="mx-auto text-blue-400 w-fit"><TrendingUp size={14} /></div>
          <span className="text-[8px] text-slate-500 block uppercase tracking-wider">Gelecek Ciro</span>
          <span className="text-white block text-xs font-black">₺118.0M</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#08111f]/40 border border-white/5 space-y-1">
          <div className="mx-auto text-emerald-400 w-fit"><Calendar size={14} /></div>
          <span className="text-[8px] text-slate-500 block uppercase tracking-wider">Hedef Doluluk</span>
          <span className="text-emerald-400 block text-xs font-black">%97.0</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#08111f]/40 border border-white/5 space-y-1">
          <div className="mx-auto text-purple-400 w-fit"><Users size={14} /></div>
          <span className="text-[8px] text-slate-500 block uppercase tracking-wider">Yeni Anlaşma</span>
          <span className="text-purple-400 block text-xs font-black">14 adet</span>
        </div>
      </div>

      <ul className="space-y-2 pl-3.5 list-disc text-[9.5px] leading-relaxed font-bold text-slate-450 pt-2 border-t border-white/5">
        {predictions.map((pred, idx) => (
          <li key={idx} className="hover:text-slate-350 duration-100">{pred}</li>
        ))}
      </ul>
    </div>
  );
}
