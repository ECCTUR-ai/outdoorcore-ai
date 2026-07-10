import React from 'react';
import { Sparkles } from 'lucide-react';

interface RiskAnalysisCardProps {
  contracts?: any[];
}

export function RiskAnalysisCard({ contracts = [] }: RiskAnalysisCardProps) {
  const recommendations: string[] = [];

  const highRisk = contracts.filter((c: any) => c.aiRiskScore && c.aiRiskScore > 5);
  if (highRisk.length > 0) {
    recommendations.push(
      `Kritik tahsilat riski olan ${highRisk.length} sözleşme bulunuyor (${highRisk.map(c => c.clientName).join(', ')}).`
    );
  }

  const normalContracts = contracts.filter((c: any) => !c.aiRiskScore || c.aiRiskScore <= 5);
  normalContracts.slice(0, 3).forEach((c: any) => {
    if (c.endDate) {
      recommendations.push(
        `${c.clientName} sözleşmesi ${c.endDate} tarihinde sona erecektir, yenileme paketi hazırlanmalıdır.`
      );
    }
  });

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left select-none">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-blue-400">
        <Sparkles size={13} className="animate-pulse" />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">AI Risk Analizi</h4>
      </div>
      {recommendations.length > 0 ? (
        <ul className="space-y-2 pl-3.5 list-disc text-[10px] leading-relaxed font-bold text-slate-400">
          {recommendations.map((rec, idx) => (
            <li key={idx} className="hover:text-slate-350 transition-colors">
              {rec}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider py-2">
          Risk analizi için yeterli sözleşme ve ödeme verisi bulunmuyor.
        </div>
      )}
    </div>
  );
}
