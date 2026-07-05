import React, { useState } from 'react';
import { Send, Sparkles, User, Bot, HelpCircle } from 'lucide-react';
import { Button } from './Button';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: 'Merhaba! Ben OutdoorCore AI Asistanı. Reklam alanları doluluğu, sözleşme vadeleri, teklif analizleri veya kampanya önerileri hakkında size nasıl yardımcı olabilirim?', time: 'Şimdi' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      time: 'Şimdi'
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      let aiText = 'Sorunuzu anladım. OutdoorCore AI veritabanını tarayarak size en uygun reklam lokasyonlarını ve kampanya doluluk oranlarını raporluyorum...';
      const promptLower = input.toLowerCase();
      if (promptLower.includes('billboard') || promptLower.includes('reklam')) {
        aiText = 'Mevcut verilere göre Levent ve Maslak bölgesindeki billboardların doluluk oranı %92 seviyesinde. Ağustos ayı için boşta kalan 3 adet billboard için teklif oluşturmamı ister misiniz?';
      } else if (promptLower.includes('sözleşme') || promptLower.includes('sozlesme')) {
        aiText = 'Yakın zamanda (önümüzdeki 30 gün içinde) süresi dolacak 4 sözleşme tespit edildi. En yüksek bütçeli olan Türk Hava Yolları havalimanı panosu sözleşmesinin yenilenmesi için taslak teklif hazırlayabilirim.';
      } else if (promptLower.includes('rapor') || promptLower.includes('analiz')) {
        aiText = 'OutdoorCore AI Kampanya Raporu: Geçen çeyreğe göre gösterim oranları %18 arttı. Lokasyon bazlı en yüksek ROI sağlayan alan AVM Dijital Ekranlar oldu.';
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiText,
        time: 'Şimdi'
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[480px] bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-3xl overflow-hidden shadow-sm shadow-slate-100/50">
      {/* Header */}
      <div className="bg-slate-50/50 dark:bg-slate-900/10 px-5 py-4 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-150/40 dark:border-indigo-900/30 flex items-center justify-center text-indigo-650 dark:text-indigo-400">
            <Sparkles size={14} className="animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider leading-none m-0">OutdoorCore Assistant</h4>
            <span className="text-[9px] text-emerald-500 font-bold flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Çevrimiçi
            </span>
          </div>
        </div>
        <div title="Desteklenen komutlar: Billboard, Sözleşme, Rapor" className="cursor-help">
          <HelpCircle size={14} className="text-slate-400" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 max-w-[85%] ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 text-slate-600 dark:text-slate-400 ${
              msg.sender === 'user' ? 'bg-indigo-50 border-indigo-100 dark:bg-indigo-950/20' : 'bg-slate-50 border-slate-150/30 dark:bg-slate-900'
            }`}>
              {msg.sender === 'user' ? <User size={13} /> : <Bot size={13} className="text-indigo-600" />}
            </div>
            <div className={`p-3.5 rounded-2xl border text-[11px] leading-relaxed font-semibold shadow-xs ${
              msg.sender === 'user'
                ? 'bg-indigo-600 border-indigo-750 text-white rounded-tr-none'
                : 'bg-slate-50/50 border-slate-100 dark:bg-slate-900/30 dark:border-slate-850 text-slate-700 dark:text-slate-350 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-850 flex items-center gap-2 bg-slate-50/20 dark:bg-slate-900/5">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Asistana bir soru sorun (örneğin: 'Billboard doluluk oranları nedir?')"
          className="flex-1 h-10 px-4 bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-600 text-xs font-semibold text-slate-800 dark:text-slate-250 placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-inner"
        />
        <Button size="sm" onClick={handleSend} className="h-10 w-10 flex items-center justify-center shrink-0">
          <Send size={13} />
        </Button>
      </div>
    </div>
  );
}
