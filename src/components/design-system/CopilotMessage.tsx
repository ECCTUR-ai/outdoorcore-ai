import React from 'react';
import { Sparkles, User, BadgeAlert } from 'lucide-react';
import { EntityLink } from './EntityLink';
import { RegistryEntity } from '@/data/entityRegistry';

export interface MessageItem {
  sender: 'user' | 'ai';
  text: string;
  relatedEntities?: RegistryEntity[];
  suggestedActions?: { label: string; actionType: string; route?: string; searchParam?: string }[];
  confidenceScore?: number;
  sourceModules?: string[];
}

interface CopilotMessageProps {
  message: MessageItem;
  onExecuteAction?: (action: any) => void;
}

export function CopilotMessage({ message, onExecuteAction }: CopilotMessageProps) {
  const isAi = message.sender === 'ai';

  return (
    <div className={`flex gap-3.5 ${isAi ? 'justify-start' : 'justify-end'} animate-fadeIn select-none`}>
      {/* Avatar column */}
      {isAi && (
        <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-450 flex items-center justify-center shrink-0">
          <Sparkles size={13} className="animate-pulse" />
        </div>
      )}

      {/* Message content bubble wrapper */}
      <div className={`max-w-[85%] space-y-3 p-4 rounded-2xl border text-left ${
        isAi 
          ? 'bg-[#0f172a]/65 border-white/5 text-slate-200' 
          : 'bg-blue-650/15 border-blue-500/10 text-white'
      }`}>
        {/* Title / Sender row */}
        <div className="flex justify-between items-center gap-4 text-[8px] font-black uppercase tracking-wider text-slate-500 pb-1 border-b border-white/3">
          <span>{isAi ? 'OUTDOORCORE COPILOT' : 'KULLANICI (CEMİL SEZGİN)'}</span>
          {isAi && message.confidenceScore && (
            <span className="text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded flex items-center gap-0.5 border border-blue-500/10">
              Güven: {message.confidenceScore}%
            </span>
          )}
        </div>

        {/* Text paragraph */}
        <div className="text-[10px] font-semibold leading-relaxed text-slate-300 space-y-2 whitespace-pre-wrap">
          {message.text}
        </div>

        {/* Source modules and metadata */}
        {isAi && message.sourceModules && message.sourceModules.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/3">
            <span className="text-[8px] font-black text-slate-550 uppercase tracking-widest mr-1">Kaynak Veri:</span>
            {message.sourceModules.map((mod, idx) => (
              <span key={idx} className="bg-slate-800 text-slate-450 text-[7.5px] px-1.5 py-0.2 rounded font-black uppercase tracking-wide">
                {mod}
              </span>
            ))}
          </div>
        )}

        {/* Related Entities Badges */}
        {isAi && message.relatedEntities && message.relatedEntities.length > 0 && (
          <div className="space-y-1.5 pt-2">
            <span className="text-[8px] font-black text-slate-555 uppercase tracking-widest block">Bağlantılı Sistem Kayıtları:</span>
            <div className="flex flex-wrap gap-1.5">
              {message.relatedEntities.map((ent) => (
                <EntityLink key={ent.id} type={ent.type as any} id={ent.id} label={`${ent.label}`} />
              ))}
            </div>
          </div>
        )}

        {/* Suggested Actions buttons inside bubble */}
        {isAi && message.suggestedActions && message.suggestedActions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-3">
            {message.suggestedActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => onExecuteAction?.(action)}
                className="px-2.5 py-1 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-all font-black text-[9px] uppercase tracking-wider cursor-pointer shadow shadow-blue-500/10"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {!isAi && (
        <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0">
          <User size={13} />
        </div>
      )}
    </div>
  );
}
