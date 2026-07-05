import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User } from 'lucide-react';
import { Button } from './Button';

interface AiInsightDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSpaceCode?: string;
}

export function AiInsightDrawer({ isOpen, onClose, selectedSpaceCode = 'SG-001' }: AiInsightDrawerProps) {
  const [activeQA, setActiveQA] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: `Merhaba! Ben OutdoorCore AI. Envanterinizdeki reklam alanları hakkında akıllı doluluk tahminleri, fiyatlandırma önerileri ve performans analizleri yapabilirim. Başlamak için aşağıdaki sorulardan birini seçebilirsiniz.` }
  ]);
  const [isAnswering, setIsAnswering] = useState(false);

  if (!isOpen) return null;

  const demoPrompts = [
    { q: 'Bu alan için en uygun sektörler hangileri?', key: 'sectors' },
    { q: 'Haziran ayında boşalacak alanları göster.', key: 'expiring' },
    { q: `${selectedSpaceCode} için fiyat önerisi yap.`, key: 'price' },
    { q: 'Boş premium LED alanları listele.', key: 'premium_led' }
  ];

  const handlePromptClick = (question: string, key: string) => {
    if (isAnswering) return;
    
    // Add user message
    setActiveQA(prev => [...prev, { sender: 'user', text: question }]);
    setIsAnswering(true);

    setTimeout(() => {
      let replyText = '';
      if (key === 'sectors') {
        replyText = `Mevcut yolcu akışı, ortalama bakış süresi ve terminal lokasyonu analizlerine göre ${selectedSpaceCode} için en yüksek dönüşüm sağlayacak sektörler: \n\n1. Finans & Bankacılık (%38 uyumluluk)\n2. Otomotiv (Premium SUV lansmanları - %29 uyumluluk)\n3. E-Ticaret / Hızlı Teslimat Hizmetleri (%25 uyumluluk)\n\nÖzellikle yolcuların terminal girişinde ve bekleme alanlarında geçirdikleri süre bu sektörlerin akılda kalıcılığını artırmaktadır.`;
      } else if (key === 'expiring') {
        replyText = 'Haziran 2025 döneminde sözleşme süresi biterek boşa çıkacak reklam üniteleri:\n\n• SG-003 | Pasaport Kontrol Üstü LED (30 Haz 25)\n• SG-018 | Pasaport Çıkış Dijital Pano (15 Haz 25)\n• SG-067 | Dış Hatlar Kapı A1 Pano (22 Haz 25)\n\nBu alanlar için şimdiden yenileme teklifleri veya yeni müşteri rezervasyonları planlanması önerilir.';
      } else if (key === 'price') {
        replyText = `Bölgesel yolcu trafiği artış trendi ve rakip panoların doluluk oranları analiz edildi. \n\n${selectedSpaceCode} ünitesi için önerilen güncel taban fiyat:\n• Aylık Kira Bedeli: ₺2.650.000\n\nMevcut fiyata (₺2.450.000) göre %8.1 oranında artış yapılması, pazar koşullarına göre optimize edilmiş bir getiri sağlayacaktır.`;
      } else if (key === 'premium_led') {
        replyText = 'Sistem genelinde boşta bulunan premium LED üniteler listelenmiştir:\n\n• SG-002 | Check-in Önü LED (İç Hatlar - ₺1.850.000 / Ay)\n• SG-012 | CIP Salonu Dijital Ekran (Dış Hatlar - ₺950.000 / Ay)\n• SG-023 | Bagaj Alım Giriş LED (İç Hatlar - ₺1.400.000 / Ay)\n\nBu alanların satışı için hazır teklif şablonlarını Teklifler sayfasından müşterilere gönderebilirsiniz.';
      }

      setActiveQA(prev => [...prev, { sender: 'ai', text: replyText }]);
      setIsAnswering(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-[#070913] border-l border-white/5 shadow-2xl flex flex-col justify-between z-50 animate-slide-in">
        {/* Header */}
        <div className="p-4.5 border-b border-white/5 flex items-center justify-between bg-white/3">
          <div className="flex items-center gap-2 text-left">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Sparkles size={14} className="animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider leading-none">OutdoorCore AI</h4>
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block mt-1">Yapay Zeka Analiz Paneli</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-white cursor-pointer transition-colors p-1.5 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/5"
          >
            <X size={14} />
          </button>
        </div>

        {/* Conversation Logs */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {activeQA.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex items-start gap-3 max-w-[85%] ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 text-slate-400 ${
                msg.sender === 'user' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-white/5 border-white/5'
              }`}>
                {msg.sender === 'user' ? <User size={11} /> : <Bot size={11} className="text-blue-400" />}
              </div>
              <div className={`p-3 rounded-2xl border text-[10.5px] leading-relaxed font-semibold whitespace-pre-line text-left shadow-md ${
                msg.sender === 'user'
                  ? 'bg-blue-600 border-blue-750 text-white rounded-tr-none'
                  : 'bg-white/3 border-white/5 text-slate-300 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {isAnswering && (
            <div className="flex items-center gap-2 text-slate-500 pl-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>

        {/* Demo Prompts / Questions Selector */}
        <div className="p-4 border-t border-white/5 bg-white/3 space-y-2 text-left">
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-2">Hızlı AI Sorguları</span>
          <div className="space-y-1.5">
            {demoPrompts.map(prompt => (
              <button
                key={prompt.key}
                disabled={isAnswering}
                onClick={() => handlePromptClick(prompt.q, prompt.key)}
                className="w-full text-left p-2 rounded-xl bg-white/3 hover:bg-white/5 border border-white/5 text-[9.5px] font-bold text-slate-300 hover:text-white transition-all cursor-pointer block truncate"
              >
                {prompt.q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
