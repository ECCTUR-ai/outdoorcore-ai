import React from 'react';
import { PlaylistSlot } from '@/types/digitalSignage';
import { digitalScreenRepository } from '@/repositories/digitalScreenRepository';
import { Badge } from './Badge';
import { Clock, Layers, Coins, Sparkles } from 'lucide-react';

interface LedSlotSummaryProps {
  slot: Partial<PlaylistSlot>;
}

export function LedSlotSummary({ slot }: LedSlotSummaryProps) {
  const screens = digitalScreenRepository.listScreens();
  const screen = screens.find(s => s.screenId === slot.screenId);

  return (
    <div className="p-4.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/10 text-left text-xs space-y-3 select-none">
      
      {/* Title */}
      <div className="flex justify-between items-start gap-1">
        <div>
          <span className="text-[7.5px] text-indigo-400 font-black uppercase tracking-wider block">Dijital LED Rezervasyon Özeti</span>
          <span className="text-xs font-black text-white uppercase block mt-0.5">{screen?.name || 'Seçilen LED Ekran'}</span>
        </div>
        <Badge variant="danger" className="text-[7px] py-0 px-1 font-black bg-rose-500/10 text-rose-450 border-rose-500/20 uppercase">LED VİDEO SLOTU</Badge>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-2 gap-3 text-[10.5px] font-bold text-slate-350 tracking-tight pt-2 border-t border-white/5 uppercase">
        <div className="flex items-center gap-1.5">
          <Clock size={11} className="text-slate-450 shrink-0" />
          <div>
            <span className="text-[7px] text-slate-500 block">Yayın Süresi</span>
            <span className="text-white font-extrabold">{slot.durationSeconds} Saniye</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Layers size={11} className="text-slate-450 shrink-0" />
          <div>
            <span className="text-[7px] text-slate-500 block">Loop Payı / Share %</span>
            <span className="text-white font-extrabold">{slot.sharePercent}%</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Sparkles size={11} className="text-slate-450 shrink-0" />
          <div>
            <span className="text-[7px] text-slate-500 block">Tahmini Günlük Oynatma</span>
            <span className="text-white font-extrabold">{slot.estimatedPlaysPerDay} Yayın</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Coins size={11} className="text-slate-450 shrink-0" />
          <div>
            <span className="text-[7px] text-slate-500 block">Hesaplanan Fiyat</span>
            <span className="text-emerald-400 font-extrabold">₺{slot.price?.toLocaleString('tr-TR')}</span>
          </div>
        </div>
      </div>

      {slot.creativeFileUrl && (
        <div className="text-[8px] text-slate-500 font-black tracking-wider pt-1 border-t border-white/5">
          YAYIN DOSYASI: <span className="text-slate-300">{slot.creativeFileUrl}</span>
        </div>
      )}

    </div>
  );
}
