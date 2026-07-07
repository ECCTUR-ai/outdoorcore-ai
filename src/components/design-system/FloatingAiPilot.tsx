import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, MessageSquare, X, Send, Bot, User, ChevronDown, RefreshCw } from 'lucide-react';
import { runCopilotQuery, CopilotResponse } from '@/utils/copilotEngine';
import { useApp } from '@/context/AppContext';

export function FloatingAiPilot() {
  const { setCurrentRoute } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: 'Merhaba! Ben **OutdoorCore AI Pilot** asistanınız. Sistemdeki envanter doluluğu, sözleşme süreleri, tahsilat riskleri ve ciro analizi hakkında gerçek verilerle konuşmaya hazırım. Nasıl yardımcı olabilirim?' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggle_ai_pilot', handleToggle);
    return () => window.removeEventListener('toggle_ai_pilot', handleToggle);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isThinking]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInputVal('');
    setIsThinking(true);

    setTimeout(() => {
      const response: CopilotResponse = runCopilotQuery(text);
      setMessages(prev => [...prev, { sender: 'ai', text: response.answerText }]);
      setIsThinking(false);
    }, 850);
  };

  const sampleCommands = [
    'Boş premium alanları göster',
    'Bu ay bitecek sözleşmeler',
    'En yüksek ciro üreten alanlar',
    'Doluluk oranı düşük alanlar',
    'Riskli sözleşmeleri göster',
    'Teklif bekleyen premium alanlar',
    'Hangi alanların fiyatını artırabiliriz?',
    'En yoğun terminal hangisi?'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[95vw] h-[540px] bg-slate-950/90 backdrop-blur-xl border border-blue-500/20 rounded-3xl shadow-2xl flex flex-col z-50 animate-scale-in text-left overflow-hidden select-none">
      {/* Header Profile */}
      <div className="p-4 bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border-b border-white/5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <Sparkles size={14} className="animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider leading-none m-0">Outdoor AI Pilot</h4>
            <span className="text-[8.5px] text-slate-500 font-bold uppercase tracking-wider block mt-1">Canlı Demo Analiz Asistanı</span>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="p-1 rounded-lg text-slate-450 hover:text-white bg-transparent border-0 cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>

      {/* Message list scrollarea */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex items-start gap-2.5 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center border text-[10px] font-black shrink-0 ${
              m.sender === 'user' ? 'bg-indigo-50 border-indigo-200 text-indigo-650' : 'bg-slate-900 border-white/5 text-blue-400'
            }`}>
              {m.sender === 'user' ? <User size={12} /> : <Bot size={12} />}
            </div>
            
            <div className={`p-3 rounded-2xl text-[10.5px] leading-relaxed font-semibold border ${
              m.sender === 'user' 
                ? 'bg-blue-600 border-blue-750 text-white rounded-tr-none' 
                : 'bg-white/2 border-white/3 text-slate-300 rounded-tl-none'
            }`}>
              {/* Basic markdown parsing for links and strong formatting */}
              {m.text.split('\n').map((line, lIdx) => {
                let formatted = line;
                
                // Parse bold formatting **bold**
                const boldRegex = /\*\*(.*?)\*\*/g;
                const parts = [];
                let lastIndex = 0;
                let match;
                
                while ((match = boldRegex.exec(formatted)) !== null) {
                  if (match.index > lastIndex) {
                    parts.push(formatted.substring(lastIndex, match.index));
                  }
                  parts.push(<strong key={match.index} className="text-white font-extrabold">{match[1]}</strong>);
                  lastIndex = boldRegex.lastIndex;
                }
                
                if (lastIndex < formatted.length) {
                  parts.push(formatted.substring(lastIndex));
                }

                const elements = parts.length > 0 ? parts : [formatted];

                // Detect link markers like SG-001 or CON-001
                const renderedLine = elements.map((el, elIdx) => {
                  if (typeof el === 'string') {
                    // split by word to detect codes
                    const words = el.split(' ');
                    return words.map((w, wIdx) => {
                      const cleanWord = w.replace(/[^\w-]/g, '');
                      if (cleanWord.startsWith('SG-') || cleanWord.startsWith('LED-')) {
                        return (
                          <span key={wIdx}>
                            <button
                              onClick={() => {
                                setCurrentRoute('reklam-alanlari');
                                setIsOpen(false);
                              }}
                              className="text-blue-400 font-black underline bg-transparent border-0 p-0 cursor-pointer inline hover:text-blue-300"
                            >
                              {w}
                            </button>{' '}
                          </span>
                        );
                      }
                      if (cleanWord.startsWith('CON-') || cleanWord.startsWith('CTR-')) {
                        return (
                          <span key={wIdx}>
                            <button
                              onClick={() => {
                                setCurrentRoute('sozlesmeler');
                                setIsOpen(false);
                              }}
                              className="text-indigo-400 font-black underline bg-transparent border-0 p-0 cursor-pointer inline hover:text-indigo-300"
                            >
                              {w}
                            </button>{' '}
                          </span>
                        );
                      }
                      if (cleanWord.startsWith('OFF-') || cleanWord.startsWith('TEK-')) {
                        return (
                          <span key={wIdx}>
                            <button
                              onClick={() => {
                                setCurrentRoute('teklifler');
                                setIsOpen(false);
                              }}
                              className="text-amber-400 font-black underline bg-transparent border-0 p-0 cursor-pointer inline hover:text-amber-300"
                            >
                              {w}
                            </button>{' '}
                          </span>
                        );
                      }
                      return w + ' ';
                    });
                  }
                  return el;
                });

                return (
                  <p key={lIdx} className="m-0 min-h-[1em]">
                    {renderedLine}
                  </p>
                );
              })}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex gap-2.5 justify-start animate-pulse">
            <div className="w-7 h-7 rounded-lg bg-slate-900 border border-white/5 text-blue-400 flex items-center justify-center shrink-0">
              <Sparkles size={11} className="animate-spin" />
            </div>
            <div className="p-3 rounded-2xl bg-white/1 border border-white/5 text-[9.5px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
              <span>Pilot Düşünüyor...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Command Chips */}
      <div className="px-4 py-2 border-t border-white/5 bg-slate-950/45 shrink-0">
        <span className="text-[7.5px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Örnek Demo Soruları</span>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {sampleCommands.map((cmd, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(cmd)}
              className="px-2.5 py-1 text-[8.5px] font-black uppercase text-slate-400 hover:text-white bg-white/3 border border-white/5 rounded-lg shrink-0 cursor-pointer transition-all hover:bg-blue-500/10 hover:border-blue-500/25"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input footer */}
      <div className="p-3 bg-slate-950 border-t border-white/5 shrink-0 flex items-center gap-2">
        <input 
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(inputVal)}
          placeholder="AI Pilot'a bir soru sorun..."
          className="flex-1 h-9 px-3 bg-white/3 border border-white/5 rounded-xl text-[10.5px] text-white focus:outline-none focus:border-blue-500/40"
        />
        <button
          onClick={() => handleSend(inputVal)}
          className="w-9 h-9 bg-blue-650 hover:bg-blue-600 text-white rounded-xl flex items-center justify-center shrink-0 border-0 cursor-pointer transition-all"
        >
          <Send size={12} />
        </button>
      </div>
    </div>
  );
}
