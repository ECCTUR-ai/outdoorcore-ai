import React from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';

export function NotificationSummaryCard() {
  const tasks = [
    'Bugün tamamlanması gereken 6 kritik görev bulunuyor.',
    'Samsung sözleşmesi 5 gün içinde yenilenmeli.',
    'THY kreatif dosyası eksik.',
    'Mercedes tahsilatı gecikti.',
    'SG-021 bakım işlemi başarıyla tamamlandı.',
    'Pegasus teklifi müşteri onayı bekliyor.'
  ];

  return (
    <div className="bg-gradient-to-br from-blue-950/40 to-indigo-950/40 border border-blue-500/15 rounded-3xl p-6.5 text-left select-none space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Sparkles size={16} className="animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest leading-none">OutdoorCore AI</h4>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">Bugünkü Görev & Operasyon Özeti</span>
          </div>
        </div>
        <span className="text-[8.5px] bg-blue-500/10 text-blue-400 border border-blue-500/10 px-2.5 py-0.8 rounded-full font-black uppercase tracking-widest">Akıllı Asistan</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 pt-1">
        {tasks.map((pt, idx) => (
          <div 
            key={idx}
            className="p-4 rounded-2xl bg-[#08111f]/35 border border-white/5 flex flex-col justify-between hover:border-white/10 transition-all group"
          >
            <span className="text-[10px] text-slate-350 font-bold leading-normal">{pt}</span>
            <div className="flex items-center gap-1 text-[8px] font-black text-blue-400 uppercase mt-4.5 opacity-60 group-hover:opacity-100 transition-opacity">
              <span>Görevi Aç</span>
              <ArrowUpRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
