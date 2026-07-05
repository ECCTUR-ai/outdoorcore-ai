import React from 'react';
import { FileSignature, Sparkles } from 'lucide-react';

export function ContractAnalytics() {
  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left select-none">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
        <FileSignature size={13} />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Hukuki ve Sözleşme Analizi</h4>
      </div>

      <div className="space-y-2 text-[10px] font-semibold text-slate-400">
        <div className="flex justify-between items-center p-2 rounded-xl bg-white/3 border border-white/5">
          <span>Bu Ay Bitecek:</span>
          <span className="text-white font-extrabold">14 Sözleşme</span>
        </div>
        <div className="flex justify-between items-center p-2 rounded-xl bg-white/3 border border-white/5">
          <span>Yenileme Görüşmesinde:</span>
          <span className="text-amber-450 font-extrabold">22 Müzakere</span>
        </div>
        <div className="flex justify-between items-center p-2 rounded-xl bg-rose-500/5 border border-rose-500/10">
          <span className="text-rose-400">Riskli / Fesih Riski:</span>
          <span className="text-rose-450 font-black">5 Sözleşme</span>
        </div>
      </div>

      {/* AI yenileme oranı tahmini */}
      <div className="p-3 bg-gradient-to-r from-blue-950/20 to-indigo-950/30 border border-blue-500/10 rounded-2xl flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[8.5px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1 leading-none">
            <Sparkles size={10} className="animate-pulse" />
            AI Tahmini
          </span>
          <span className="text-[9.5px] text-slate-350 font-bold block mt-1">Yenilenme İhtimal Oranı</span>
        </div>
        <span className="text-sm font-black text-blue-400">%88.2</span>
      </div>
    </div>
  );
}
