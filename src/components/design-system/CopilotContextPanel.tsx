import React from 'react';
import { Database, Lightbulb, PlayCircle, Layers } from 'lucide-react';
import { EntityLink } from './EntityLink';
import { RegistryEntity } from '@/data/entityRegistry';
import { Label } from './Form';

export interface CopilotAction {
  label: string;
  actionType: string;
  route?: string;
  searchParam?: string;
}

interface CopilotContextPanelProps {
  relatedEntities: RegistryEntity[];
  sourceModules: string[];
  suggestedActions: CopilotAction[];
  onExecuteAction?: (action: CopilotAction) => void;
}

export function CopilotContextPanel({ 
  relatedEntities, 
  sourceModules, 
  suggestedActions,
  onExecuteAction 
}: CopilotContextPanelProps) {
  return (
    <div className="space-y-6 sticky top-[95px] max-h-[calc(100vh-130px)] overflow-y-auto pr-1">
      {/* 1. Bulunan Kayıtlar */}
      <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-3.5 text-left">
        <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400 select-none">
          <Database size={13} className="text-blue-400" />
          <h4 className="text-xs font-black text-white uppercase tracking-wider">Bulunan Sistem Kayıtları</h4>
        </div>
        
        {relatedEntities.length > 0 ? (
          <div className="flex flex-col gap-2">
            {relatedEntities.map((ent) => (
              <div 
                key={ent.id} 
                className="p-2.5 rounded-xl bg-white/2 border border-white/5 flex items-center justify-between text-[10px]"
              >
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[7px] text-slate-500 font-black block uppercase">{ent.type}</span>
                  <span className="text-white font-extrabold block truncate">{ent.label}</span>
                </div>
                <div className="shrink-0 pl-2">
                  <EntityLink type={ent.type as any} id={ent.id} label="Aç" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[9.5px] text-slate-550 italic font-semibold leading-normal m-0 select-none">
            Son sorguyla ilişkili veri eşleşmesi bulunamadı.
          </p>
        )}
      </div>

      {/* 2. AI Insight */}
      <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-3 text-left">
        <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400 select-none">
          <Layers size={13} className="text-indigo-400" />
          <h4 className="text-xs font-black text-white uppercase tracking-wider">Veri Bağlam Analizi</h4>
        </div>

        <div className="space-y-2.5">
          {sourceModules.length > 0 ? (
            <>
              <p className="text-[9.5px] text-slate-400 font-bold leading-normal m-0">
                Bu soru **{sourceModules.length}** farklı modül verisi ile eşleştirildi:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {sourceModules.map((mod, idx) => (
                  <span 
                    key={idx} 
                    className="bg-indigo-500/10 text-indigo-450 border border-indigo-500/10 text-[8px] px-2 py-0.5 rounded font-black uppercase tracking-wider"
                  >
                    {mod}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="text-[9.5px] text-slate-550 italic font-semibold leading-normal m-0 select-none">
              Bağlamsal veri analizi bekleniyor.
            </p>
          )}
        </div>
      </div>

      {/* 3. Önerilen Aksiyonlar */}
      <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-3.5 text-left">
        <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400 select-none">
          <PlayCircle size={13} className="text-emerald-450 animate-pulse" />
          <h4 className="text-xs font-black text-white uppercase tracking-wider">Önerilen Aksiyonlar</h4>
        </div>

        {suggestedActions.length > 0 ? (
          <div className="flex flex-col gap-2">
            {suggestedActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => onExecuteAction?.(action)}
                className="w-full p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/15 duration-150 text-[10px] font-black text-emerald-400 text-center uppercase tracking-wider cursor-pointer transition-all"
              >
                {action.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {[
              { label: 'Teklif Oluştur', route: 'teklifler' },
              { label: 'Görev Oluştur', route: 'bildirimler' },
              { label: 'Rezervasyon Aç', route: 'rezervasyonlar' },
              { label: 'PDF Rapor Hazırla', route: 'raporlar' }
            ].map((act, idx) => (
              <button
                key={idx}
                onClick={() => onExecuteAction?.({ label: act.label, actionType: 'generic', route: act.route })}
                className="w-full p-2 rounded-xl bg-white/3 border border-white/5 hover:border-slate-700 duration-150 text-[9.5px] font-black text-slate-350 text-center uppercase tracking-wider cursor-pointer"
              >
                {act.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
