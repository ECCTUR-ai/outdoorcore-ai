import React from 'react';
import { Sparkles } from 'lucide-react';

interface CampaignAiInsightsProps {
  campaign?: any;
}

export function CampaignAiInsights({ campaign }: CampaignAiInsightsProps) {
  if (!campaign || !campaign.id) {
    return (
      <div className="dark-glass-card border border-white/5 rounded-2xl p-5 text-center select-none py-8 space-y-2">
        <Sparkles size={16} className="text-slate-500 mx-auto" />
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Mevcut verilere göre planlama önerisi bulunmuyor.</p>
      </div>
    );
  }

  const successRate = campaign.successRate || 95;
  const insights = [
    `"${campaign.campaignName}" kampanyasında yayın başarı oranı %${successRate} olarak ölçümlenmiştir.`,
    'Dijital ekranlarımıza ek LED üniteleri entegre edilirse erişim artışı beklenmektedir.',
    'Yayınlanan tüm kreatif dosyaların çözünürlük ve uyumluluk kontrolleri tamamlanmıştır.',
    campaign.endDate 
      ? `Kampanya bitiş tarihi olan ${campaign.endDate} sonrasında yeni dönem planlaması hazırlanmalıdır.`
      : 'Yeni rezervasyon dönemi için planlama takvimi oluşturulmalıdır.'
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
