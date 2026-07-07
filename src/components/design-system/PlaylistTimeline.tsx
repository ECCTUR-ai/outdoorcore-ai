import React from 'react';
import { DigitalScreen, PlaylistSlot } from '@/types/digitalSignage';
import { Layers, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';

interface PlaylistTimelineProps {
  screen: DigitalScreen;
  slots: PlaylistSlot[];
  onSelectSlot?: (slotId: string) => void;
  onCreateSlotAtEmpty?: () => void;
}

export function PlaylistTimeline({ screen, slots, onSelectSlot, onCreateSlotAtEmpty }: PlaylistTimelineProps) {
  const activeSlots = slots.filter(s => s.screenId === screen.screenId && s.status === 'active');
  const usedSeconds = activeSlots.reduce((sum, s) => sum + s.durationSeconds, 0);
  const availableSeconds = Math.max(0, screen.loopDurationSeconds - usedSeconds);
  const occupancyPercent = Math.min(100, Math.round((usedSeconds / screen.loopDurationSeconds) * 100));

  // Visual helper colors mapping for slots
  const blockColors = [
    'bg-blue-600/30 border-blue-500 text-blue-400',
    'bg-indigo-600/30 border-indigo-500 text-indigo-400',
    'bg-purple-600/30 border-purple-500 text-purple-400',
    'bg-emerald-600/30 border-emerald-500 text-emerald-450',
    'bg-teal-600/30 border-teal-500 text-teal-400',
    'bg-amber-600/30 border-amber-500 text-amber-500',
    'bg-pink-600/30 border-pink-500 text-pink-400'
  ];

  return (
    <div className="space-y-4 select-none">
      
      {/* Stats header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="p-3 bg-white/2 border border-white/5 rounded-2xl text-left">
          <span className="text-[8.5px] font-black text-slate-500 uppercase tracking-wider block">Loop Uzunluğu</span>
          <span className="text-sm font-black text-white block mt-1">{screen.loopDurationSeconds} Saniye</span>
        </div>
        <div className="p-3 bg-white/2 border border-white/5 rounded-2xl text-left">
          <span className="text-[8.5px] font-black text-indigo-400 uppercase tracking-wider block">Kullanılan Süre</span>
          <span className="text-sm font-black text-indigo-400 block mt-1">{usedSeconds} Saniye</span>
        </div>
        <div className="p-3 bg-white/2 border border-white/5 rounded-2xl text-left">
          <span className="text-[8.5px] font-black text-emerald-450 uppercase tracking-wider block">Boş Kalan Süre</span>
          <span className="text-sm font-black text-emerald-450 block mt-1">{availableSeconds} Saniye</span>
        </div>
        <div className="p-3 bg-white/2 border border-white/5 rounded-2xl text-left">
          <span className="text-[8.5px] font-black text-slate-500 uppercase tracking-wider block">Playlist Doluluk Oranı</span>
          <span className={`text-sm font-black block mt-1 ${occupancyPercent > 90 ? 'text-rose-500' : 'text-blue-500 dark:text-blue-400'}`}>
            {occupancyPercent}%
          </span>
        </div>
      </div>

      {/* Visual horizontal loop bar container */}
      <div className="space-y-1.5 text-left">
        <span className="text-[9px] font-black text-slate-450 uppercase tracking-widest block">Loop Oynatma Zaman Çizelgesi</span>
        
        <div className="flex h-12 w-full rounded-2xl bg-slate-100 dark:bg-white/4 border border-slate-200 dark:border-white/5 p-1 items-stretch overflow-hidden select-none">
          {activeSlots.map((slot, index) => {
            const widthPercent = (slot.durationSeconds / screen.loopDurationSeconds) * 100;
            const colorClass = blockColors[index % blockColors.length];
            return (
              <div
                key={slot.slotId}
                onClick={() => onSelectSlot?.(slot.slotId)}
                style={{ width: `${widthPercent}%` }}
                className={`border rounded-xl flex flex-col justify-center items-center px-1 truncate cursor-pointer transition-all duration-150 hover:scale-102 hover:z-10 ${colorClass}`}
                title={`${slot.companyName || 'Müşteri'}: ${slot.durationSeconds}sn (${slot.sharePercent}%)`}
              >
                <span className="text-[9px] font-black uppercase truncate max-w-full px-1">{slot.companyName?.split(' ')[0]}</span>
                <span className="text-[8px] opacity-75 font-semibold">{slot.durationSeconds}sn</span>
              </div>
            );
          })}

          {/* Empty loop space segment bar */}
          {availableSeconds > 0 && (
            <div
              onClick={onCreateSlotAtEmpty}
              style={{ width: `${(availableSeconds / screen.loopDurationSeconds) * 100}%` }}
              className="border border-dashed border-slate-350 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-transparent flex flex-col justify-center items-center text-slate-450 hover:bg-slate-100 dark:hover:bg-white/2 transition-colors cursor-pointer select-none truncate"
              title={`Boş Slot Alanı: ${availableSeconds} saniye kullanılabilir. Tıklayın ve Rezervasyon Ekleyin.`}
            >
              <span className="text-[8.5px] font-black uppercase tracking-wider block">BOŞ</span>
              <span className="text-[7.5px] font-bold block">{availableSeconds}sn</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center text-[7px] text-slate-500 font-bold uppercase select-none px-1">
          <span>0. saniye (Başlangıç)</span>
          <span>{screen.loopDurationSeconds / 2}. saniye</span>
          <span>{screen.loopDurationSeconds}. saniye (Bitiş)</span>
        </div>
      </div>

    </div>
  );
}
