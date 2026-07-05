import React from 'react';
import { Sparkles, Terminal } from 'lucide-react';

interface SuggestedPromptChipsProps {
  onSelect: (prompt: string) => void;
}

export function SuggestedPromptChips({ onSelect }: SuggestedPromptChipsProps) {
  const prompts = [
    'Temmuz ayında boş premium LED alanları göster.',
    'Samsung için yeni teklif öner.',
    'Bu hafta bitecek sözleşmeleri listele.',
    'Kapanma ihtimali yüksek teklifleri sırala.',
    'Tahsilat riski olan firmaları göster.',
    'Bugün ne yapmam gerekiyor?',
    'En çok ciro getiren reklam alanlarını listele.',
    'Kreatif dosyası eksik kampanyaları göster.'
  ];

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left select-none">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
        <Terminal size={13} className="text-blue-400" />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Hızlı Önerilen Komutlar</h4>
      </div>

      <div className="flex flex-col gap-2">
        {prompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(p)}
            className="w-full text-left p-2.5 rounded-xl bg-slate-900/40 border border-white/3 hover:border-blue-500/25 hover:bg-[#22314a]/10 duration-150 text-[9.5px] font-semibold text-slate-400 hover:text-white transition-all cursor-pointer leading-normal flex items-start gap-2"
          >
            <Sparkles size={10} className="text-blue-400 shrink-0 mt-0.5" />
            <span>{p}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
