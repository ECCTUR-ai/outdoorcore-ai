import React from 'react';
import { Sparkles } from 'lucide-react';

export function RiskAnalysisCard() {
  const recommendations = [
    'Kritik tahsilat riski olan 1 sözleşme bulunuyor (Turkcell - 45 gün gecikme).',
    'Samsung ve THY yenileme ihtimalleri %90 üzerinde seyrediyor.',
    'Pegasus için 30 gün içinde yeni kampanya planlama paketi gönderilmelidir.',
    'Mercedes-Benz imza aşamasında olup, ıslak imza evrakları kuryededir.'
  ];

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 select-none text-blue-400">
        <Sparkles size={13} className="animate-pulse" />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">AI Risk Analizi</h4>
      </div>
      <ul className="space-y-2 pl-3.5 list-disc text-[10px] leading-relaxed font-bold text-slate-400">
        {recommendations.map((rec, idx) => (
          <li key={idx} className="hover:text-slate-350 transition-colors">
            {rec}
          </li>
        ))}
      </ul>
    </div>
  );
}
