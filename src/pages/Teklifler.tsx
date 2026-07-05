import React, { useState } from 'react';
import { 
  Plus, 
  DownloadCloud, 
  SlidersHorizontal, 
  Sparkles,
  Layers,
  Coins,
  CheckCircle,
  Clock,
  CheckCheck,
  TrendingUp,
  Percent
} from 'lucide-react';
import { offers, Offer } from '@/data/offers';
import { DarkKpiCard } from '@/components/design-system/DarkKpiCard';
import { DarkDashboardCard } from '@/components/design-system/DarkDashboardCard';
import { OfferPipeline } from '@/components/design-system/OfferPipeline';
import { OfferDetailPanel } from '@/components/design-system/OfferDetailPanel';
import { OfferActivityFeed } from '@/components/design-system/OfferActivityFeed';
import { OfferTaskList } from '@/components/design-system/OfferTaskList';
import { OfferAiInsights } from '@/components/design-system/OfferAiInsights';
import { AiInsightDrawer } from '@/components/design-system/AiInsightDrawer';
import { Button } from '@/components/design-system/Button';

export function Teklifler() {
  const [selectedOfferId, setSelectedOfferId] = useState<string>('o1');
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  // Selected offer lookup
  const selectedOffer = offers.find(o => o.id === selectedOfferId) || offers[0];

  return (
    <div className="space-y-6 select-none pb-12">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 p-5 rounded-3xl border border-white/5 shadow-sm text-left">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">Teklifler ve Satış Pipeline</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Reklam satış fırsatlarını, teklif süreçlerini ve müşteri görüşmelerini yönetin.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* OutdoorCore AI Spark Button */}
          <Button 
            variant="primary" 
            size="sm" 
            leftIcon={<Sparkles size={13} className="animate-pulse" />}
            className="bg-gradient-to-r from-blue-650 to-indigo-650 hover:from-blue-600 hover:to-indigo-600 text-white font-black"
            onClick={() => setAiDrawerOpen(true)}
          >
            OutdoorCore AI
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            leftIcon={<Plus size={13} />}
            onClick={() => alert('Yeni teklif ekleme mockup formu açılacak.')}
          >
            Yeni Teklif
          </Button>

          <Button 
            variant="minimal" 
            size="sm" 
            leftIcon={<DownloadCloud size={13} />}
            onClick={() => alert('Satış Pipeline Raporu (.pdf) indiriliyor...')}
          >
            Pipeline Raporu
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            leftIcon={<SlidersHorizontal size={13} />}
            onClick={() => alert('Pipeline filtreleri paneli tetiklendi.')}
          >
            Filtreler
          </Button>
        </div>
      </div>

      {/* Upper Pipeline KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <DarkKpiCard
          title="Toplam Fırsat"
          value="128"
          percentage="%100"
          subtext="Aktif satış takibi"
          icon={<Layers size={15} />}
          iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/10"
        />
        <DarkKpiCard
          title="Pipeline Değeri"
          value="₺94.75M"
          percentage="₺15.6M bu ay"
          subtext="Toplam fırsat hacmi"
          icon={<Coins size={15} />}
          iconBgColor="bg-emerald-500/10 text-emerald-400 border-emerald-500/10"
          glowColor="green"
        />
        <DarkKpiCard
          title="Bu Ay Teklif"
          value="32"
          percentage="+6 artış"
          subtext="Gönderilen teklifler"
          icon={<Clock size={15} />}
          iconBgColor="bg-amber-500/10 text-amber-400 border-amber-500/10"
          glowColor="yellow"
        />
        <DarkKpiCard
          title="Onay Bekleyen"
          value="14"
          percentage="KRİTİK"
          subtext="Müşteri onayında"
          icon={<CheckCircle size={15} />}
          iconBgColor="bg-purple-500/10 text-purple-400 border-purple-500/10"
          glowColor="purple"
        />
        <DarkKpiCard
          title="Kazanılan"
          value="18"
          percentage="+4 yeni"
          subtext="Sözleşmeye dönen"
          icon={<CheckCheck size={15} />}
          iconBgColor="bg-sky-500/10 text-sky-400 border-sky-500/10"
          glowColor="blue"
        />
        <DarkKpiCard
          title="Kapanma Oranı"
          value="%42.6"
          percentage="+%2.4 artış"
          subtext="Satış verimliliği"
          icon={<Percent size={15} />}
          iconBgColor="bg-rose-500/10 text-rose-400 border-rose-500/10"
          glowColor="red"
          sparkline={true}
        />
      </div>

      {/* Main Kanban Pipeline workspace grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sol 9-Sütun: Kanban board scroll tracking + Bottom widget cards */}
        <div className="lg:col-span-9 space-y-6 flex flex-col">
          {/* Section 1: Horizontal scrollable Kanban pipeline */}
          <div className="w-full">
            <OfferPipeline 
              offers={offers}
              selectedId={selectedOfferId}
              onSelect={(id) => setSelectedOfferId(id)}
            />
          </div>

          {/* Section 2: Bottom activity tracking dashboards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <OfferActivityFeed />
            <OfferTaskList />
            <OfferAiInsights />
          </div>
        </div>

        {/* Sağ 3-Sütun: Sticky details panel */}
        <div className="lg:col-span-3">
          <OfferDetailPanel 
            offer={selectedOffer}
          />
        </div>
      </div>

      {/* Slide-over AI CRM overlay */}
      <AiInsightDrawer 
        isOpen={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
        selectedSpaceCode={selectedOffer.clientName}
      />
    </div>
  );
}
