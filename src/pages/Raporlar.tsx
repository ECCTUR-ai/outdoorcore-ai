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

export function Raporlar() {
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

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
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <DarkKpiCard
          title="Toplam Ciro"
          value="₺684.5M"
          percentage="%100"
          subtext="Yıllık hacim"
          icon={<Coins size={15} />}
          iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/10"
        />
        <DarkKpiCard
          title="Bu Ay"
          value="₺42.8M"
          percentage="+%8.2"
          subtext="Haziran tahsilatı"
          icon={<TrendingUp size={15} />}
          iconBgColor="bg-emerald-500/10 text-emerald-450 border-emerald-450/10"
          glowColor="green"
        />
        <DarkKpiCard
          title="Pipeline Değeri"
          value="₺94.7M"
          percentage="AKTİF FIRSAT"
          subtext="Olası satışlar"
          icon={<SlidersHorizontal size={15} />}
          iconBgColor="bg-amber-500/10 text-amber-400 border-amber-400/10"
          glowColor="yellow"
        />
        <DarkKpiCard
          title="Doluluk Oranı"
          value="%96.8"
          percentage="ZİRVE"
          subtext="Terminal doluluk"
          icon={<Tv size={15} />}
          iconBgColor="bg-purple-500/10 text-purple-400 border-purple-400/10"
          glowColor="purple"
        />
        <DarkKpiCard
          title="Boş Alan"
          value="18"
          percentage="%3.2 boş"
          subtext="Premium lokasyonlar"
          icon={<Calendar size={15} />}
          iconBgColor="bg-sky-500/10 text-sky-400 border-sky-500/10"
          glowColor="blue"
        />
        <DarkKpiCard
          title="Tahsilat Bekleyen"
          value="₺12.6M"
          percentage="RİSK GRUBU"
          subtext="Vadesi geçenler dahil"
          icon={<Percent size={15} />}
          iconBgColor="bg-rose-500/10 text-rose-450 border-rose-500/10"
          glowColor="red"
          sparkline={true}
        />
      </div>

      {/* Section 1: CEO Executive Summary */}
      <ExecutiveSummaryCard />

      {/* Section 2 & 3 Grid: Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueAnalytics />
        <SpacePerformanceChart />
      </div>

      {/* Section 4 & 5 Grid: CRM & Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

      {/* Sliding AI Panel Drawer */}
      <AiInsightDrawer 
        isOpen={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
        selectedSpaceCode="CEO Rapor Merkezi"
      />
    </div>
  );
}
