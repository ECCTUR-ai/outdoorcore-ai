import React, { useState } from 'react';
import { 
  Plus, 
  DownloadCloud, 
  UploadCloud, 
  SlidersHorizontal, 
  Sparkles,
  Megaphone,
  Calendar,
  Coins,
  CheckCircle,
  Clock,
  CheckCheck,
  TrendingUp,
  Percent,
  Tv
} from 'lucide-react';
import { campaigns, Campaign } from '@/data/campaigns';
import { DarkKpiCard } from '@/components/design-system/DarkKpiCard';
import { DarkDashboardCard } from '@/components/design-system/DarkDashboardCard';
import { CampaignCard } from '@/components/design-system/CampaignCard';
import { CampaignList } from '@/components/design-system/CampaignList';
import { CampaignDetailPanel } from '@/components/design-system/CampaignDetailPanel';
import { CampaignScheduleTimeline } from '@/components/design-system/CampaignScheduleTimeline';
import { CreativeFilesGrid } from '@/components/design-system/CreativeFilesGrid';
import { CampaignPerformanceCards } from '@/components/design-system/CampaignPerformanceCards';
import { CampaignAiInsights } from '@/components/design-system/CampaignAiInsights';
import { AiInsightDrawer } from '@/components/design-system/AiInsightDrawer';
import { Button } from '@/components/design-system/Button';

export function Kampanyalar() {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('CAM-0001');
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const campaignId = params.get('campaignId');
    if (campaignId && campaigns.some(c => c.id === campaignId)) {
      setSelectedCampaignId(campaignId);
    }
  }, []);

  // Selected campaign lookup
  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0];

  return (
    <div className="space-y-6 select-none pb-12">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 p-5 rounded-3xl border border-white/5 shadow-sm text-left">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">Kampanya Yönetim Merkezi</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Reklam kampanyalarını, yayın alanlarını, kreatif dosyaları ve performans durumunu yönetin.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* OutdoorCore AI Button */}
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
            onClick={() => alert('Yeni kampanya ekleme mockup formu açılacak.')}
          >
            Yeni Kampanya
          </Button>

          <Button 
            variant="minimal" 
            size="sm" 
            leftIcon={<UploadCloud size={13} />}
            onClick={() => alert('Yeni kreatif dosya yükleme paneli tetiklendi.')}
          >
            Medya Yükle
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            leftIcon={<DownloadCloud size={13} />}
            onClick={() => alert('Kampanya Yayın Raporu (.xlsx) indiriliyor...')}
          >
            Rapor İndir
          </Button>
        </div>
      </div>

      {/* Upper Pipeline KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <DarkKpiCard
          title="Aktif Kampanya"
          value="68"
          percentage="%100"
          subtext="Aktif yayında olan"
          icon={<Megaphone size={15} />}
          iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/10"
        />
        <DarkKpiCard
          title="Planlanan Kampanya"
          value="24"
          percentage="+5 yeni"
          subtext="Rezerve takvimi"
          icon={<Calendar size={15} />}
          iconBgColor="bg-emerald-500/10 text-emerald-450 border-emerald-450/10"
          glowColor="green"
        />
        <DarkKpiCard
          title="Tamamlanan Kampanya"
          value="156"
          percentage="ARŞİV"
          subtext="Başarıyla bitenler"
          icon={<CheckCheck size={15} />}
          iconBgColor="bg-amber-500/10 text-amber-400 border-amber-400/10"
          glowColor="yellow"
        />
        <DarkKpiCard
          title="Yayında Olan Alan"
          value="112"
          percentage="%74.6"
          subtext="Aktif ekranlar"
          icon={<Tv size={15} />}
          iconBgColor="bg-purple-500/10 text-purple-400 border-purple-400/10"
          glowColor="purple"
        />
        <DarkKpiCard
          title="Toplam Bütçe"
          value="₺248.5M"
          percentage="%100"
          subtext="Yıllık ciro hacmi"
          icon={<Coins size={15} />}
          iconBgColor="bg-sky-500/10 text-sky-400 border-sky-500/10"
          glowColor="blue"
        />
        <DarkKpiCard
          title="Yayın Başarısı"
          value="%96.8"
          percentage="+%1.4 artış"
          subtext="Sistem ortalaması"
          icon={<Percent size={15} />}
          iconBgColor="bg-rose-500/10 text-rose-450 border-rose-500/10"
          glowColor="red"
          sparkline={true}
        />
      </div>

      {/* Main split grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. Sol: Filter & Company list */}
        <div className="lg:col-span-3">
          <CampaignList 
            campaigns={campaigns}
            selectedId={selectedCampaignId}
            onSelect={(id) => setSelectedCampaignId(id)}
          />
        </div>

        {/* 2. Orta: Catalog Cards listing */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kampanya Portalı</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {campaigns.map(c => (
              <CampaignCard 
                key={c.id} 
                campaign={c} 
                isActive={selectedCampaignId === c.id}
                onClick={() => setSelectedCampaignId(c.id)}
              />
            ))}
          </div>
        </div>

        {/* 3. Sağ: Sticky detail panel */}
        <div className="lg:col-span-4">
          <CampaignDetailPanel 
            campaign={selectedCampaign}
          />
        </div>
      </div>

      {/* Bottom Performance widgets */}
      <div className="space-y-4 text-left">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Kampanya Yayın Performansı</span>
        <CampaignPerformanceCards 
          impressions={selectedCampaign.impressions}
          reach={selectedCampaign.reach}
          frequency={selectedCampaign.frequency}
          airtimeHours={selectedCampaign.airtimeHours}
          bestSpace={selectedCampaign.bestSpace}
          riskySpace={selectedCampaign.riskySpace}
        />
      </div>

      {/* Bottom detail lists row splits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <CampaignScheduleTimeline />
          <CreativeFilesGrid files={selectedCampaign.creativeFiles} />
        </div>
        <div className="lg:col-span-4">
          <CampaignAiInsights />
        </div>
      </div>

      {/* Sliding AI Panel Drawer */}
      <AiInsightDrawer 
        isOpen={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
        selectedSpaceCode={selectedCampaign.clientName}
      />
    </div>
  );
}
