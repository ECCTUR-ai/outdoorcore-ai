import React, { useState } from 'react';
import { 
  Database, 
  MessageSquare, 
  Lightbulb, 
  AlertCircle, 
  Coins, 
  Sparkles,
  Building2,
  FileSignature,
  FileText,
  Megaphone,
  Calendar,
  Layers,
  Wrench,
  Image,
  BarChart3,
  Terminal,
  Activity,
  Play
} from 'lucide-react';
import { CopilotKpiCard } from '@/components/design-system/CopilotKpiCard';
import { SuggestedPromptChips } from '@/components/design-system/SuggestedPromptChips';
import { CopilotChat } from '@/components/design-system/CopilotChat';
import { CopilotContextPanel, CopilotAction } from '@/components/design-system/CopilotContextPanel';
import { WorkflowCard } from '@/components/design-system/WorkflowCard';
import { useApp } from '@/context/AppContext';
import { RegistryEntity } from '@/data/entityRegistry';

export function AiAssistant() {
  const { setCurrentRoute } = useApp();
  const [externalPrompt, setExternalPrompt] = useState<string | null>(null);
  
  // Right sidebar AI context state
  const [context, setContext] = useState<{
    relatedEntities: RegistryEntity[];
    sourceModules: string[];
    suggestedActions: CopilotAction[];
  }>({
    relatedEntities: [],
    sourceModules: [],
    suggestedActions: []
  });

  const handleExecuteAction = (action: CopilotAction) => {
    if (action.route) {
      // Calculate search param if exists
      const paramStr = action.searchParam ? `?${action.searchParam}` : '';
      const fullUrl = `${window.location.origin}/${action.route}${paramStr}`;
      
      // Update address bar
      window.history.pushState({ path: newUrlWithParams() }, '', `/${action.route}${paramStr}`);
      
      function newUrlWithParams() {
        return `${window.location.pathname}${paramStr}`;
      }

      // Navigate to target route
      setCurrentRoute(action.route as any);
    } else {
      alert(`[Aksiyon Tetiklendi] "${action.label}" Copilot tarafından başlatıldı.`);
    }
  };

  const handleTriggerWorkflow = (wfName: string, firstPrompt: string) => {
    setExternalPrompt(firstPrompt);
    alert(`[Süreç Akışı Başlatıldı] "${wfName}" iş akışı Copilot arayüzüne yüklendi.`);
  };

  // Mock conversation history listing
  const historySessions = [
    { title: 'Samsung Premium Alan Analizi', time: '10 dk önce', query: 'Samsung için boş premium alanları göster.' },
    { title: 'THY Kontrat Yenileme Durumu', time: '45 dk önce', query: 'THY sözleşmesi ne zaman bitiyor?' },
    { title: 'Vadesi Geçen Cari Riskleri', time: '2 saat önce', query: 'Bu ay tahsilat riski olan firmaları göster.' },
    { title: 'Kreatif Onay Takip Raporu', time: 'Dün', query: 'Kreatif dosyası eksik kampanyaları göster.' }
  ];

  return (
    <div className="space-y-6 select-none pb-12 text-left">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 p-5 rounded-3xl border border-white/5 shadow-sm text-left">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">OutdoorCore AI Copilot</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            Tüm reklam envanterinizi, satış sürecinizi, sözleşmelerinizi, kampanyalarınızı ve finansal durumunuzu doğal dille yönetin.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#1e293b]/50 px-3 py-1.5 rounded-xl border border-white/5 select-none">
          <Sparkles size={11} className="text-blue-400 animate-pulse" />
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Model: OutdoorCore-v2.0-Pro</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <CopilotKpiCard
          title="Toplam Bağlı Kayıt"
          value="1.248"
          subtext="Envanter veri kataloğu"
          icon={<Database size={13} />}
          glowColor="blue"
        />
        <CopilotKpiCard
          title="Bugünkü AI Sorgusu"
          value="86"
          percentage="+12"
          subtext="Kullanıcı etkileşimi"
          icon={<MessageSquare size={13} />}
          glowColor="purple"
        />
        <CopilotKpiCard
          title="Otomatik Öneri"
          value="34"
          subtext="AI tarafından tetiklenen"
          icon={<Lightbulb size={13} />}
          glowColor="yellow"
        />
        <CopilotKpiCard
          title="Kritik Risk"
          value="12"
          percentage="ALARM"
          subtext="Gecikme & çakışmalar"
          icon={<AlertCircle size={13} />}
          glowColor="red"
        />
        <CopilotKpiCard
          title="Satış Fırsatı"
          value="₺22.4M"
          percentage="+%8"
          subtext="Pipeline potansiyeli"
          icon={<Coins size={13} />}
          glowColor="green"
        />
        <CopilotKpiCard
          title="AI Güven Skoru"
          value="%94"
          subtext="Doğruluk oranı"
          icon={<Sparkles size={13} />}
          glowColor="blue"
        />
      </div>

      {/* Main Grid layout splits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. Sol panel: Conversation history & SuggestedPromptChips */}
        <div className="order-2 lg:order-none lg:col-span-3 space-y-6">
          {/* Conversation history block */}
          <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-3.5 text-left">
            <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
              <MessageSquare size={13} />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Copilot Konuşma Geçmişi</h4>
            </div>
            
            <div className="space-y-2.5">
              {historySessions.map((session, idx) => (
                <button
                  key={idx}
                  onClick={() => setExternalPrompt(session.query)}
                  className="w-full text-left p-2.5 rounded-xl bg-white/2 border border-white/5 hover:border-blue-500/25 duration-100 transition-all cursor-pointer space-y-1 block"
                >
                  <span className="text-[9.5px] font-extrabold text-slate-200 block truncate">{session.title}</span>
                  <div className="flex justify-between items-center text-[7.5px] text-slate-500 font-bold uppercase tracking-wide">
                    <span>{session.time}</span>
                    <span>Sorgula</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <SuggestedPromptChips onSelect={(prompt) => setExternalPrompt(prompt)} />
        </div>

        {/* 2. Orta alan: Chat / cevap ekranı */}
        <div className="order-1 lg:order-none lg:col-span-6">
          <CopilotChat 
            onContextUpdate={(ctx) => setContext(ctx)} 
            onExecuteAction={handleExecuteAction}
            externalTriggerPrompt={externalPrompt}
            clearTriggerPrompt={() => setExternalPrompt(null)}
          />
        </div>

        {/* 3. Sağ panel: Bağlam kartları ve bulunan kayıtlar */}
        <div className="order-3 lg:order-none lg:col-span-3">
          <CopilotContextPanel 
            relatedEntities={context.relatedEntities}
            sourceModules={context.sourceModules}
            suggestedActions={context.suggestedActions}
            onExecuteAction={handleExecuteAction}
          />
        </div>
      </div>

      {/* 4. Alt bölüm: Hızlı aksiyonlar ve önerilen workflow'lar */}
      <div className="space-y-4 text-left">
        <div className="flex items-center gap-1.5 pl-1 text-slate-400">
          <Activity size={13} className="text-blue-400" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">OutdoorCore AI Workflow Önerileri</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <WorkflowCard 
            title="1. Samsung Yenileme Akışı" 
            description="Mevcut sözleşmeden yeni teklif oluşturarak kiralama ve kampanya operasyonunu başlatır."
            steps={[
              { label: 'Firma', icon: <Building2 size={10} /> },
              { label: 'Sözleşme', icon: <FileSignature size={10} /> },
              { label: 'Teklif', icon: <FileText size={10} /> },
              { label: 'Rezervasyon', icon: <Calendar size={10} /> },
              { label: 'Kampanya', icon: <Megaphone size={10} /> }
            ]}
            onTrigger={() => handleTriggerWorkflow('Samsung Yenileme Akışı', 'Samsung için yeni teklif öner.')}
          />
          <WorkflowCard 
            title="2. Tahsilat Risk Akışı" 
            description="Geciken faturaları sorgulayarak finans ekipleri ve cari hesaplar için aksiyon görevi tetikler."
            steps={[
              { label: 'Finans', icon: <Coins size={10} /> },
              { label: 'Cari', icon: <Building2 size={10} /> },
              { label: 'Görev', icon: <Layers size={10} /> },
              { label: 'Bildirim', icon: <Activity size={10} /> }
            ]}
            onTrigger={() => handleTriggerWorkflow('Tahsilat Risk Akışı', 'Tahsilat riski olan firmaları göster.')}
          />
          <WorkflowCard 
            title="3. Boş Alan Satış Akışı" 
            description="Boşalan reklam alanlarına uygun firma önerilerini getirip pazarlık teklif sürecini hazırlar."
            steps={[
              { label: 'Alan', icon: <Wrench size={10} /> },
              { label: 'Firma', icon: <Building2 size={10} /> },
              { label: 'Teklif', icon: <FileText size={10} /> },
              { label: 'Rezervasyon', icon: <Calendar size={10} /> }
            ]}
            onTrigger={() => handleTriggerWorkflow('Boş Alan Satış Akışı', 'Temmuz ayında boş premium LED alanları göster.')}
          />
          <WorkflowCard 
            title="4. Kampanya Optimizasyon Akışı" 
            description="Kreatif dosyası eksik veya hata veren yayınları tespit edip performans raporu hazırlar."
            steps={[
              { label: 'Kampanya', icon: <Megaphone size={10} /> },
              { label: 'Alan Performansı', icon: <BarChart3 size={10} /> },
              { label: 'Medya', icon: <Image size={10} /> },
              { label: 'Rapor', icon: <FileText size={10} /> }
            ]}
            onTrigger={() => handleTriggerWorkflow('Kampanya Optimizasyon Akışı', 'Kreatif dosyası eksik kampanyaları göster.')}
          />
        </div>
      </div>
    </div>
  );
}
