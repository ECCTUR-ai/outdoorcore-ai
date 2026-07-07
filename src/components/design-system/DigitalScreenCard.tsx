import React from 'react';
import { DigitalScreen, PlaylistSlot } from '@/types/digitalSignage';
import { Badge } from './Badge';
import { Button } from './Button';
import { Maximize2, Layers, Clock, ShieldCheck, MapPin } from 'lucide-react';

interface DigitalScreenCardProps {
  screen: DigitalScreen;
  slots: PlaylistSlot[];
  onSelectScreen?: (screenId: string) => void;
}

export function DigitalScreenCard({ screen, slots, onSelectScreen }: DigitalScreenCardProps) {
  const activeSlots = slots.filter(s => s.screenId === screen.screenId && s.status === 'active');
  const usedSeconds = activeSlots.reduce((sum, s) => sum + s.durationSeconds, 0);
  const availableSeconds = Math.max(0, screen.loopDurationSeconds - usedSeconds);
  const occupancyPercent = Math.min(100, Math.round((usedSeconds / screen.loopDurationSeconds) * 100));

  return (
    <div className="dark-glass-card border border-slate-200 dark:border-white/5 p-5 rounded-3xl flex flex-col justify-between text-xs space-y-4 text-left transition-all hover:border-slate-350 dark:hover:border-white/10 select-none bg-white dark:bg-[#0b0f19]/30">
      
      {/* Header info */}
      <div className="flex justify-between items-start gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-black text-blue-450 uppercase">{screen.screenCode}</span>
            <Badge variant="success" className="text-[7px] py-0 px-1 font-black uppercase">LED EKRAN</Badge>
          </div>
          <h4 className="text-[11px] font-black text-slate-800 dark:text-white leading-tight">{screen.name}</h4>
        </div>
        <span className="text-[11px] font-black text-emerald-450 shrink-0">
          ₺{screen.monthlyBasePrice.toLocaleString('tr-TR')} <span className="text-[8px] text-slate-500 font-bold">/ Ay</span>
        </span>
      </div>

      {/* Attributes grid */}
      <div className="grid grid-cols-2 gap-2 text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight py-2 border-t border-b border-slate-100 dark:border-white/2">
        <div className="flex justify-between pr-2 border-r border-slate-100 dark:border-white/2">
          <span>Ölçü (m²):</span>
          <span className="text-slate-800 dark:text-slate-200 font-extrabold">{screen.totalM2} m²</span>
        </div>
        <div className="flex justify-between pl-2">
          <span>Çözünürlük:</span>
          <span className="text-slate-800 dark:text-slate-200 font-extrabold">{screen.resolution.split(' ')[0]}</span>
        </div>
        <div className="flex justify-between pr-2 border-r border-slate-100 dark:border-white/2">
          <span>Yayın Akışı:</span>
          <span className="text-slate-800 dark:text-slate-200 font-extrabold">{screen.loopDurationSeconds} sn Loop</span>
        </div>
        <div className="flex justify-between pl-2">
          <span>Günlük Akış:</span>
          <span className="text-slate-800 dark:text-slate-200 font-extrabold">{(86400 / screen.loopDurationSeconds).toLocaleString('tr-TR')} yayın</span>
        </div>
      </div>

      {/* Progress occupancy */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider">
          <span className="text-slate-400">Loop Doluluk Oranı</span>
          <span className={`${occupancyPercent > 90 ? 'text-rose-500' : 'text-blue-500 dark:text-blue-400'} font-black`}>
            {occupancyPercent}%
          </span>
        </div>
        
        {/* Track and fill progress bar */}
        <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
          <div 
            style={{ width: `${occupancyPercent}%` }}
            className={`h-full rounded-full transition-all duration-300 ${
              occupancyPercent > 90 
                ? 'bg-rose-500' 
                : occupancyPercent > 60 
                  ? 'bg-amber-500' 
                  : 'bg-blue-600'
            }`}
          />
        </div>

        <div className="flex justify-between text-[8px] text-slate-500 font-black uppercase">
          <span>Dolu: {usedSeconds} sn</span>
          <span>Boş: {availableSeconds} sn</span>
        </div>
      </div>

      {/* Footer count stats & actions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/2">
        <div className="flex items-center gap-1 text-slate-500 font-bold text-[9.5px]">
          <Layers size={10.5} />
          <span>{activeSlots.length} Aktif Müşteri</span>
        </div>
        {onSelectScreen && (
          <Button 
            variant="outline" 
            size="xs" 
            className="text-[8px] font-black uppercase tracking-wider py-1 hover:bg-blue-500/10 hover:text-blue-500"
            onClick={() => onSelectScreen(screen.screenId)}
          >
            Playlist Yönet
          </Button>
        )}
      </div>

    </div>
  );
}
