import React from 'react';
import { Sparkles } from 'lucide-react';

export function CampaignAiInsights() {
  const insights = [
    'Samsung kampanyasında yayın başarısı %98.',
    'Duty Free LED eklenirse erişim artışı bekleniyor.',
    'Kreatif dosyalardan biri 11 Haziran’da eksik yayın almış.',
    '30 Haziran sonrası yenileme teklifi hazırlanmalı.'
  ];

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 select-none text-blue-400">
        <Sparkles size={13} className="animate-pulse" />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">AI Kampanya Önerileri</h4>
      </div>
      <ul className="space-y-2.5 pl-3.5 list-disc text-[10px] leading-relaxed font-bold text-slate-400">
        {insights.map((ins, idx) => (
          <li key={idx} className="hover:text-slate-350 transition-colors">
            {ins}
          </li>
        ))}
      </ul>
    </div>
  );
}
