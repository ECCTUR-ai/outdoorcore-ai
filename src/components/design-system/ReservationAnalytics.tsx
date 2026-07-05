import React from 'react';
import { CalendarRange, Sparkles } from 'lucide-react';

export function ReservationAnalytics() {
  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left select-none">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
        <CalendarRange size={13} />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Planlama ve Takvim Analizi</h4>
      </div>

      <div className="space-y-2 text-[10px] font-semibold text-slate-400">
        <div className="flex justify-between items-center p-2 rounded-xl bg-white/3 border border-white/5">
          <span>En Yoğun Sezon:</span>
          <span className="text-white font-extrabold">Temmuz - Ağustos</span>
        </div>
        <div className="flex justify-between items-center p-2 rounded-xl bg-white/3 border border-white/5">
          <span>Boş Alan Rezervi:</span>
          <span className="text-slate-200 font-extrabold">18 Premium Alan</span>
        </div>
        <div className="flex justify-between items-center p-2 rounded-xl bg-amber-500/5 border border-amber-500/10">
          <span className="text-amber-400">Çakışma Riski:</span>
          <span className="text-amber-450 font-black">4 Lokasyon</span>
        </div>
      </div>

      <div className="p-3 bg-gradient-to-r from-blue-950/20 to-indigo-950/30 border border-blue-500/10 rounded-2xl flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[8.5px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1 leading-none">
            <Sparkles size={10} className="animate-pulse" />
            AI Doluluk Hedefi
          </span>
          <span className="text-[9.5px] text-slate-350 font-bold block mt-1">Premium Kullanım Oranı</span>
        </div>
        <span className="text-sm font-black text-emerald-400">%94.5</span>
      </div>
    </div>
  );
}
