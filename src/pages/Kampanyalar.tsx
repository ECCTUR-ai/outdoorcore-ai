import React, { useState, useEffect } from 'react';
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
import { Campaign } from '@/data/campaigns';
import { campaignRepository } from '@/repositories';
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
import { useApp } from '@/context/AppContext';
import { TableSkeleton, CardSkeleton } from '@/components/design-system/Skeleton';
import { Notification } from '@/components/design-system/Notification';

export function Kampanyalar() {
  const { setCurrentRoute } = useApp();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('CAM-0001');
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await campaignRepository.getAll();
      setCampaigns(data);
      if (data.length > 0) {
        setSelectedCampaignId(data[0].id);
      }
    } catch (e: any) {
      console.error(e);
      setError('Veriler yüklenirken bir bağlantı hatası oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const campaignId = params.get('campaignId');
    if (campaignId && campaigns.some(c => c.id === campaignId)) {
      setSelectedCampaignId(campaignId);
    }
  }, [campaigns]);

  // Selected campaign lookup
  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0] || {
    id: '',
    campaignName: 'Yükleniyor...',
    clientName: '',
    status: 'Planlandı',
    budget: '₺0',
    startDate: '',
    endDate: '',
    creativeFiles: [],
    history: [],
    metrics: { impressions: 0, clicks: 0, ctr: '0%' },
    impressions: '0',
    reach: '0',
    frequency: 0,
    airtimeHours: 0,
    bestSpace: '',
    riskySpace: ''
  };

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
            onClick={() => {
              if (confirm('Yeni kampanyalar CRM entegre olarak "Yeni Satış Sihirbazı" üzerinden oluşturulur. Sihirbaza gitmek istiyor musunuz?')) {
                setCurrentRoute('sales-wizard');
              }
            }}
          >
            Sihirbazla Kampanya Ekle
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
            leftIcon={<SlidersHorizontal size={13} />}
            onClick={() => alert('Kampanya filtreleme ayarları paneli tetiklendi.')}
          >
            Filtreler
          </Button>
        </div>
      </div>

      {error && (
        <Notification
          title="Sistem Hatası"
          description={error}
          type="alert"
          onClose={() => setError(null)}
        />
      )}

      {/* Upper Pipeline KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <DarkKpiCard
          title="Toplam Kampanya"
          value={loading ? '...' : String(campaigns.length)}
          percentage="%100"
          subtext="Toplam tescilli"
          icon={<Megaphone size={15} />}
          iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/10"
        />
        <DarkKpiCard
          title="Aktif Yayınlar"
          value={loading ? '...' : String(campaigns.filter(c => c.status === 'Aktif').length)}
          percentage="CANLI"
          subtext="Yayında olanlar"
          icon={<Tv size={15} />}
          iconBgColor="bg-emerald-500/10 text-emerald-450 border-emerald-500/10"
          glowColor="green"
        />
        <DarkKpiCard
          title="Planlanan"
          value={loading ? '...' : String(campaigns.filter(c => c.status === 'Planlandı').length)}
          percentage="+2 yeni"
          subtext="Gelecek yayınlar"
          icon={<Calendar size={15} />}
          iconBgColor="bg-amber-500/10 text-amber-400 border-amber-500/10"
          glowColor="yellow"
        />
        <DarkKpiCard
          title="Tamamlanan"
          value={loading ? '...' : String(campaigns.filter(c => c.status === 'Tamamlandı').length)}
          percentage="%100"
          subtext="Geçmiş arşiv"
          icon={<CheckCircle size={15} />}
          iconBgColor="bg-purple-500/10 text-purple-400 border-purple-500/10"
          glowColor="purple"
        />
        <DarkKpiCard
          title="Bütçe Hacmi"
          value={loading ? '...' : '₺412.8M'}
          percentage="+%8.2"
          subtext="Yıllık yatırım"
          icon={<Coins size={15} />}
          iconBgColor="bg-sky-500/10 text-sky-400 border-sky-500/10"
          glowColor="blue"
        />
        <DarkKpiCard
          title="Ort. CTR"
          value={loading ? '...' : '2.4%'}
          percentage="YÜKSEK"
          subtext="Geri dönüş oranı"
          icon={<TrendingUp size={15} />}
          iconBgColor="bg-emerald-500/10 text-emerald-450 border-emerald-450/10"
          glowColor="green"
          sparkline={true}
        />
      </div>

      {/* Main layout split grid */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#08111f]/40 border border-white/5 rounded-2xl p-6">
          <div className="lg:col-span-3">
            <TableSkeleton />
          </div>
          <div className="lg:col-span-9">
            <div className="grid grid-cols-2 gap-4">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 1. Sol: Filter & Campaign list */}
          <div className="order-2 lg:order-none lg:col-span-3">
            <CampaignList 
              campaigns={campaigns}
              selectedId={selectedCampaignId}
              onSelect={(id) => setSelectedCampaignId(id)}
            />
          </div>

          {/* 2. Orta: Catalog Cards listing */}
          <div className="order-1 lg:order-none lg:col-span-5 space-y-4">
            <div className="flex justify-between items-center px-1 text-left">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kampanya Portalı</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {campaigns.map(cp => (
                <CampaignCard 
                  key={cp.id} 
                  campaign={cp} 
                  isActive={selectedCampaignId === cp.id}
                  onClick={() => setSelectedCampaignId(cp.id)}
                />
              ))}
            </div>
          </div>

          {/* 3. Sağ: Sticky detail panel */}
          <div className="order-3 lg:order-none lg:col-span-4">
            <CampaignDetailPanel 
              campaign={selectedCampaign}
            />
          </div>
        </div>
      )}

      {/* Bottom widgets row */}
      {!loading && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <CampaignScheduleTimeline />
              <CreativeFilesGrid files={selectedCampaign.creativeFiles} />
            </div>
            <div className="lg:col-span-4">
              <CampaignAiInsights />
            </div>
          </div>

          <div className="space-y-4 text-left pt-6">
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
        </>
      )}

      {/* Sliding AI Panel Drawer */}
      <AiInsightDrawer 
        isOpen={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
        selectedSpaceCode={selectedCampaign.campaignName}
      />
    </div>
  );
}
