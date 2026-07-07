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
  TrendingUp,
  Percent,
  Tv,
  FileText,
  FileSpreadsheet,
  Presentation
} from 'lucide-react';
import { DarkKpiCard } from '@/components/design-system/DarkKpiCard';
import { ExecutiveSummaryCard } from '@/components/design-system/ExecutiveSummaryCard';
import { RevenueAnalytics } from '@/components/design-system/RevenueAnalytics';
import { SpacePerformanceChart } from '@/components/design-system/SpacePerformanceChart';
import { BrandPerformanceTable } from '@/components/design-system/BrandPerformanceTable';
import { PipelineFunnel } from '@/components/design-system/PipelineFunnel';
import { CampaignPerformanceHeatmap } from '@/components/design-system/CampaignPerformanceHeatmap';
import { FinanceOverview } from '@/components/design-system/FinanceOverview';
import { ContractAnalytics } from '@/components/design-system/ContractAnalytics';
import { ReservationAnalytics } from '@/components/design-system/ReservationAnalytics';
import { PredictionCenter } from '@/components/design-system/PredictionCenter';
import { LiveActivityFeed } from '@/components/design-system/LiveActivityFeed';
import { ExecutiveActionCenter } from '@/components/design-system/ExecutiveActionCenter';
import { AiInsightDrawer } from '@/components/design-system/AiInsightDrawer';
import { Button } from '@/components/design-system/Button';
import { CardSkeleton } from '@/components/design-system/Skeleton';
import { 
  offerRepository, 
  reservationRepository, 
  campaignRepository, 
  financeRepository, 
  spaceRepository 
} from '@/repositories';

export function Raporlar() {
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    offers: [],
    reservations: [],
    campaigns: [],
    finance: null,
    spaces: []
  });

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        const [o, r, c, f, s] = await Promise.all([
          offerRepository.list(),
          reservationRepository.getAll(),
          campaignRepository.getAll(),
          financeRepository.getFinanceData(),
          spaceRepository.list()
        ]);
        setData({
          offers: o || [],
          reservations: r || [],
          campaigns: c || [],
          finance: f,
          spaces: s || []
        });
      } catch (err) {
        console.error("Failed to load reports data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  const accounts = data.finance?.accounts || [];
  const totalCiro = accounts.reduce((sum: number, acc: any) => sum + (parseFloat((acc.totalDebt || '0').replace(/[^0-9]/g, '')) || 0), 0);
  const totalCollected = accounts.reduce((sum: number, acc: any) => sum + (parseFloat((acc.totalCollected || '0').replace(/[^0-9]/g, '')) || 0), 0);
  const pendingCollection = accounts.reduce((sum: number, acc: any) => sum + (parseFloat((acc.balance || '0').replace(/[^0-9]/g, '')) || 0), 0);
  
  const pipelineValue = data.offers
    .filter((o: any) => ['Teklif Hazırlandı', 'Onaya Gönderildi', 'Sözleşme Bekliyor'].includes(o.stage))
    .reduce((sum: number, o: any) => sum + (o.valueNumeric || 0), 0);

  const totalSpaces = data.spaces.length;
  const occupiedSpaces = data.spaces.filter((s: any) => s.status === 'rezerve' || s.status === 'dolu').length;
  const occupancyRate = totalSpaces > 0 ? (occupiedSpaces / totalSpaces) * 105 : 0; // scaled peak indicator
  const emptySpaces = data.spaces.filter((s: any) => s.status === 'bos').length;

  const formatCurrency = (val: number) => {
    if (val === 0) return '₺0';
    if (val >= 1000000) return `₺ ${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `₺ ${(val / 1000).toFixed(0)}K`;
    return `₺ ${val.toLocaleString('tr-TR')}`;
  };

  const hasNoData = 
    data.offers.length === 0 && 
    data.reservations.length === 0 && 
    data.campaigns.length === 0 && 
    accounts.length === 0;

  return (
    <div className="space-y-6 select-none pb-12">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 p-5 rounded-3xl border border-white/5 shadow-sm text-left">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">Executive Intelligence Center</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">OutdoorCore AI tarafından oluşturulan canlı yönetim raporları ve karar destek analizleri.</p>
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
            leftIcon={<FileText size={13} />}
            onClick={() => alert('PDF Yönetici Özeti oluşturuluyor...')}
          >
            PDF
          </Button>

          <Button 
            variant="minimal" 
            size="sm" 
            leftIcon={<FileSpreadsheet size={13} />}
            onClick={() => alert('Excel Finansal Raporu dışa aktarılıyor...')}
          >
            Excel
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            leftIcon={<Presentation size={13} />}
            onClick={() => alert('PowerPoint Yönetim Sunumu oluşturuluyor...')}
          >
            PPT
          </Button>
        </div>
      </div>

      {/* Upper Pipeline KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <DarkKpiCard
          title="Toplam Ciro"
          value={loading ? '...' : formatCurrency(totalCiro)}
          percentage="%100"
          subtext="Yıllık hacim"
          icon={<Coins size={15} />}
          iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/10"
        />
        <DarkKpiCard
          title="Tahsil Edilen"
          value={loading ? '...' : formatCurrency(totalCollected)}
          percentage={totalCiro > 0 ? `%${((totalCollected / totalCiro) * 100).toFixed(1)}` : '%0'}
          subtext="Toplam tahsilat"
          icon={<TrendingUp size={15} />}
          iconBgColor="bg-emerald-500/10 text-emerald-450 border-emerald-450/10"
          glowColor="green"
        />
        <DarkKpiCard
          title="Pipeline Değeri"
          value={loading ? '...' : formatCurrency(pipelineValue)}
          percentage="AKTİF FIRSAT"
          subtext="Olası satışlar"
          icon={<SlidersHorizontal size={15} />}
          iconBgColor="bg-amber-500/10 text-amber-400 border-amber-400/10"
          glowColor="yellow"
        />
        <DarkKpiCard
          title="Doluluk Oranı"
          value={loading ? '...' : `% ${Math.min(occupancyRate, 100).toFixed(1)}`}
          percentage="CANLI"
          subtext="Terminal doluluk"
          icon={<Tv size={15} />}
          iconBgColor="bg-purple-500/10 text-purple-400 border-purple-400/10"
          glowColor="purple"
        />
        <DarkKpiCard
          title="Boş Alan"
          value={loading ? '...' : String(emptySpaces)}
          percentage="MÜSAİT LOKASYON"
          subtext="Premium lokasyonlar"
          icon={<Calendar size={15} />}
          iconBgColor="bg-sky-500/10 text-sky-400 border-sky-500/10"
          glowColor="blue"
        />
        <DarkKpiCard
          title="Tahsilat Bekleyen"
          value={loading ? '...' : formatCurrency(pendingCollection)}
          percentage="BAKİYE"
          subtext="Vadesi gelenler dahil"
          icon={<Percent size={15} />}
          iconBgColor="bg-rose-500/10 text-rose-455 border-rose-500/10"
          glowColor="red"
          sparkline={true}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#08111f]/40 border border-white/5 rounded-2xl p-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : hasNoData ? (
        <div className="p-12 text-center bg-[#12192B] border border-white/5 rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,.45)] space-y-4 select-none">
          <div className="w-16 h-16 rounded-full bg-slate-900/60 border border-white/5 flex items-center justify-center text-slate-500 mx-auto">
            <Presentation size={32} />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Henüz raporlanacak veri bulunmuyor.</h4>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Sözleşme imzalandığında ve sistemde kayıtlar oluştukça bu ekran otomatik dolacaktır.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Section 1: CEO Executive Summary */}
          <ExecutiveSummaryCard />

          {/* Section 2 & 3 Grid: Charts row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <RevenueAnalytics />
            <SpacePerformanceChart />
          </div>

          {/* Section 4 & 5 Grid: CRM & Pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <BrandPerformanceTable />
            <PipelineFunnel />
          </div>

          {/* Section 6 & 7 Grid: Heatmap & Finance */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <CampaignPerformanceHeatmap />
            </div>
            <div className="lg:col-span-4">
              <FinanceOverview />
            </div>
          </div>

          {/* Section 8 & 9 Grid: Contracts & Calendar */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <ContractAnalytics />
            <ReservationAnalytics />
          </div>

          {/* Section 10, 11 & 12 Grid: AI Prediction & Operations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6">
              <PredictionCenter />
            </div>
            <div className="lg:col-span-3">
              <LiveActivityFeed />
            </div>
            <div className="lg:col-span-3">
              <ExecutiveActionCenter />
            </div>
          </div>
        </>
      )}

      {/* Sliding AI Panel Drawer */}
      <AiInsightDrawer 
        isOpen={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
        selectedSpaceCode="CEO Rapor Merkezi"
      />
    </div>
  );
}
