import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import { CopilotMessage, MessageItem } from './CopilotMessage';
import { CopilotInput } from './CopilotInput';
import { runCopilotQuery, CopilotResponse } from '@/utils/copilotEngine';
import { RegistryEntity } from '@/data/entityRegistry';

interface CopilotChatProps {
  onContextUpdate: (context: {
    relatedEntities: RegistryEntity[];
    sourceModules: string[];
    suggestedActions: any[];
  }) => void;
  onExecuteAction: (action: any) => void;
  // External triggers
  externalTriggerPrompt?: string | null;
  clearTriggerPrompt?: () => void;
}

export function CopilotChat({ 
  onContextUpdate, 
  onExecuteAction, 
  externalTriggerPrompt, 
  clearTriggerPrompt 
}: CopilotChatProps) {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize with demo conversation logs
  useEffect(() => {
    // Standard mock dialogue sequence
    const demoConversation: MessageItem[] = [
      {
        sender: 'user',
        text: 'Samsung için boş premium alanları göster.'
      },
      {
        sender: 'ai',
        text: `**Samsung Electronics** için uygun premium alanlar bulundu:

*   **SG-001** | Giriş LED Ekran | İç Hatlar
*   **SG-021** | Check-in Önü LED
*   **SG-045** | Duty Free Yanı LED

Bu alanlar Samsung'un geçmiş kampanyalarıyla yüksek uyum gösteriyor.`,
        relatedEntities: [
          { id: 'CMP-0001', type: 'company', label: 'Samsung Electronics', route: '/firmalar-markalar?companyId=CMP-0001', keywords: [] },
          { id: 'SPC-0001', type: 'space', label: 'SG-001 Giriş LED Ekran', route: '/reklam-alanlari?spaceId=SPC-0001', keywords: [] },
          { id: 'SPC-0021', type: 'space', label: 'SG-021 Check-in Önü LED', route: '/reklam-alanlari?spaceId=SPC-0021', keywords: [] },
          { id: 'SPC-0045', type: 'space', label: 'SG-045 Duty Free Yanı LED', route: '/reklam-alanlari?spaceId=SPC-0045', keywords: [] }
        ],
        suggestedActions: [
          { label: 'Teklif Oluştur', actionType: 'offer', route: 'teklifler', searchParam: 'companyId=CMP-0001' },
          { label: 'Rezervasyon Aç', actionType: 'reservation', route: 'takvim', searchParam: 'companyId=CMP-0001' }
        ],
        confidenceScore: 96,
        sourceModules: ['Firma', 'Reklam Alanı']
      },
      {
        sender: 'user',
        text: 'THY sözleşmesi ne zaman bitiyor?'
      },
      {
        sender: 'ai',
        text: `**Türk Hava Yolları** sözleşmesi **18 gün** içinde bitiyor.
Yenileme ihtimali **%87**.
Yenileme görüşmesi için görev oluşturulması önerilir.`,
        relatedEntities: [
          { id: 'CMP-0003', type: 'company', label: 'Türk Hava Yolları', route: '/firmalar-markalar?companyId=CMP-0003', keywords: [] },
          { id: 'CON-0001', type: 'contract', label: 'Samsung Sözleşmesi', route: '/sozlesmeler?contractId=CON-0001', keywords: [] }
        ],
        suggestedActions: [
          { label: 'Sözleşmeye Git', actionType: 'contract', route: 'sozlesmeler', searchParam: 'contractId=CON-0001' },
          { label: 'Görev Oluştur', actionType: 'task', route: 'bildirimler', searchParam: 'taskId=TSK-0001' }
        ],
        confidenceScore: 87,
        sourceModules: ['Sözleşme', 'Firma']
      },
      {
        sender: 'user',
        text: 'Bu ay tahsilat riski olan firmaları göster.'
      },
      {
        sender: 'ai',
        text: `Riskli tahsilatlar:

1.  **Mercedes-Benz Türkiye** — **₺7.9M** — Risk **%84**
2.  **Turkcell** — **₺1.2M** — Risk **%61**
3.  **Pegasus** — **₺850K** — Risk **%48**`,
        relatedEntities: [
          { id: 'CMP-0005', type: 'company', label: 'Mercedes-Benz Türkiye', route: '/firmalar-markalar?companyId=CMP-0005', keywords: [] },
          { id: 'CMP-0002', type: 'company', label: 'Turkcell', route: '/firmalar-markalar?companyId=CMP-0002', keywords: [] },
          { id: 'CMP-0006', type: 'company', label: 'Pegasus Airlines', route: '/firmalar-markalar?companyId=CMP-0006', keywords: [] }
        ],
        suggestedActions: [
          { label: 'Finans Paneli', actionType: 'finance', route: 'finans', searchParam: 'companyId=CMP-0002' }
        ],
        confidenceScore: 92,
        sourceModules: ['Finans', 'Sözleşme']
      }
    ];

    setMessages(demoConversation);
    
    // Sync the context panel with the last message's details initially
    const last = demoConversation[demoConversation.length - 1];
    onContextUpdate({
      relatedEntities: last.relatedEntities || [],
      sourceModules: last.sourceModules || [],
      suggestedActions: last.suggestedActions || []
    });
  }, []);

  // Handle auto-scrolling
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  // Handle external chip commands triggers
  useEffect(() => {
    if (externalTriggerPrompt) {
      handleSendMessage(externalTriggerPrompt);
      if (clearTriggerPrompt) {
        clearTriggerPrompt();
      }
    }
  }, [externalTriggerPrompt]);

  const handleSendMessage = (text: string) => {
    // 1. Add user message
    const userMsg: MessageItem = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    // 2. Simulate response generation latency
    setTimeout(() => {
      const aiReply: CopilotResponse = runCopilotQuery(text);
      const aiMsg: MessageItem = {
        sender: 'ai',
        text: aiReply.answerText,
        relatedEntities: aiReply.relatedEntities,
        suggestedActions: aiReply.suggestedActions,
        confidenceScore: aiReply.confidenceScore,
        sourceModules: aiReply.sourceModules
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsThinking(false);

      // 3. Propagate context state upwards to parent panel
      onContextUpdate({
        relatedEntities: aiReply.relatedEntities,
        sourceModules: aiReply.sourceModules,
        suggestedActions: aiReply.suggestedActions
      });
    }, 900);
  };

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl flex flex-col h-[620px] select-none">
      {/* Header Profile Title card */}
      <div className="p-4.5 border-b border-white/5 flex items-center justify-between text-left shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Sparkles size={14} className="animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">OutdoorCore AI Copilot</h4>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Sor, analiz et, yönlendir ve aksiyon al.</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[8.5px] bg-emerald-500/15 text-emerald-450 border border-emerald-500/10 px-2 py-0.5 rounded font-black uppercase tracking-wider leading-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 glow-green mr-1 inline-block shrink-0" />
          Canlı Asistan Aktif
        </div>
      </div>

      {/* Messages Scroll Container */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth"
      >
        {messages.map((msg, index) => (
          <CopilotMessage 
            key={index} 
            message={msg} 
            onExecuteAction={onExecuteAction}
          />
        ))}

        {/* AI Typing loading indicator */}
        {isThinking && (
          <div className="flex gap-3.5 justify-start animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-450 flex items-center justify-center shrink-0">
              <Sparkles size={13} className="animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-[#0f172a]/65 border border-white/5 text-[9.5px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <span>OutdoorCore AI düşünüyor</span>
              <span className="flex gap-0.5">
                <span className="w-1 h-1 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-1 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-1 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Modern input footer box */}
      <div className="p-4.5 border-t border-white/5 bg-slate-950/20 shrink-0">
        <CopilotInput onSend={handleSendMessage} disabled={isThinking} />
      </div>
    </div>
  );
}
