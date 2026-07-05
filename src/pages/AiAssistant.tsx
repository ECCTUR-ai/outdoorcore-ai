import React from 'react';
import { AiAssistant as AssistantWidget } from '@/components/design-system/AiAssistant';

export function AiAssistant() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest leading-none">AI Assistant Panel</h2>
        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">OutdoorCore AI Yapay Zeka Satış ve Operasyon Danışmanı</span>
      </div>
      <AssistantWidget />
    </div>
  );
}
