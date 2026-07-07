import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  TrendingUp, 
  Coins, 
  Calendar, 
  AlertTriangle, 
  Activity, 
  Building2, 
  MapPin, 
  Sparkles, 
  Zap, 
  CheckSquare, 
  ShieldAlert, 
  Flame,
  ArrowRight,
  ChevronRight,
  Maximize2,
  Layers,
  Clock,
  PlusSquare,
  FilePlus,
  Bookmark,
  Users,
  Search,
  RefreshCw,
  FileText,
  BarChart2,
  DownloadCloud
} from 'lucide-react';
import { 
  spaceRepository, 
  offerRepository, 
  contractRepository, 
  reservationRepository, 
  campaignRepository, 
  financeRepository 
} from '@/repositories';
import { DarkKpiCard } from '@/components/design-system/DarkKpiCard';
import { DarkDashboardCard } from '@/components/design-system/DarkDashboardCard';
import { Badge } from '@/components/design-system/Badge';
import { Button } from '@/components/design-system/Button';
import { Table, TableRow, TableCell } from '@/components/design-system/Table';
import { OfferModal } from '@/components/design-system/OfferModal';
import { CompanyModal } from '@/components/design-system/CompanyModal';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export function Dashboard() {
  const { setCurrentRoute } = useApp();

  // Modals visibility state
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [companyModalOpen, setCompanyModalOpen] = useState(false);

  // Dynamic state loaded instantly using synchronous initializers for < 1s startup
  const [spaces, setSpaces] = useState<any[]>(() => spaceRepository.getAllSync());
  const [offers, setOffers] = useState<any[]>(() => offerRepository.getAllSync());
  const [contracts, setContracts] = useState<any[]>(() => contractRepository.getAllSync());
  const [reservations, setReservations] = useState<any[]>(() => reservationRepository.getAllSync());
  const [campaigns, setCampaigns] = useState<any[]>(() => campaignRepository.getAllSync());
  const [finance, setFinance] = useState<any>(() => financeRepository.getFinanceDataSync());
  const [loading, setLoading] = useState(false);

  const loadAllData = async () => {
    try {
      const [sList, oList, cList, rList, camList, fData] = await Promise.all([
        spaceRepository.list(),
        offerRepository.list(),
        contractRepository.getAll(),
        reservationRepository.getAll(),
        campaignRepository.getAll(),
        financeRepository.getFinanceData()
      ]);
      setSpaces(sList);
      setOffers(oList);
      setContracts(cList);
      setReservations(rList);
      setCampaigns(camList);
      setFinance(fData);
    } catch (e) {
      console.error('Error loading CEO dashboard data:', e);
    }
  };

  useEffect(() => {
    loadAllData();
    // Re-fetch automatically on storage changes for instantaneous sync
    window.addEventListener('storage', loadAllData);
    return () => window.removeEventListener('storage', loadAllData);
  }, []);

  // 1. ÜST KPI Calculations from real state
  const metrics = useMemo(() => {
    const totalSpaces = spaces.length;
    const doluSpaces = spaces.filter(s => s.status === 'dolu').length;
    const occupancyRate = totalSpaces > 0 ? ((doluSpaces / totalSpaces) * 100).toFixed(1) : '0';

    // Ciro this month (ending or active in June 2025)
    const thisMonthContracts = contracts.filter(c => 
      c.status !== 'cancelled' && 
      c.status !== 'İptal' &&
      (c.endDate.includes('.06.2025') || c.endDate.includes('2025-06'))
    );
    const thisMonthCiro = thisMonthContracts.reduce((sum, c) => sum + (c.valueNumeric || 0), 0);

    const totalExpectedCiro = spaces.reduce((sum, s) => sum + ((s as any).priceNumeric || 0), 0);
    const activeContractsCount = contracts.filter(c => c.status === 'signed' || c.status === 'active' || c.status === 'Aktif').length;

    // Expiring this month
    const expiringThisMonthCount = contracts.filter(c => 
      c.status !== 'cancelled' && 
      c.status !== 'İptal' &&
      (c.endDate.includes('.06.2025') || (c.daysLeft !== undefined && c.daysLeft <= 30))
    ).length;

    // Finance Outstanding dues
    let pendingCollections = 0;
    if (finance && finance.accounts) {
      finance.accounts.forEach((acc: any) => {
        const bal = parseFloat(acc.balance.replace(/[^\d]/g, '')) || 0;
        pendingCollections += bal;
      });
    }

    const activeCampaignsCount = campaigns.filter(c => c.status === 'Aktif' || c.status === 'active').length;
    const activeReservationsCount = reservations.filter(r => r.status === 'Aktif' || r.status === 'active').length;

    // Pipeline sum
    const pipelineValue = offers.reduce((sum, o) => sum + (o.valueNumeric || 0), 0);

    return {
      totalSpaces,
      occupancyRate,
      thisMonthCiro: `₺${(thisMonthCiro / 1000000).toFixed(1)}M`,
      totalExpectedCiro: `₺${(totalExpectedCiro / 1000000).toFixed(1)}M`,
      activeContractsCount,
      expiringThisMonthCount,
      pendingCollections: `₺${(pendingCollections / 1000000).toFixed(1)}M`,
      pendingCollectionsVal: pendingCollections,
      activeCampaignsCount,
      activeReservationsCount,
      pipelineValue: `₺${(pipelineValue / 1000000).toFixed(1)}M`,
      rawOccupancy: totalSpaces > 0 ? (doluSpaces / totalSpaces) * 100 : 0
    };
  }, [spaces, offers, contracts, reservations, campaigns, finance]);

  // 2. SATIŞ: Funnel and top offers calculations
  const salesMetrics = useMemo(() => {
    // Stage counts
    const stagesList = [
      { name: 'Teklif Hazırlandı', count: offers.filter(o => o.stage === 'Teklif Hazırlandı').length },
      { name: 'Onaya Gönderildi', count: offers.filter(o => o.stage === 'Onaya Gönderildi').length },
      { name: 'Sözleşme Bekliyor', count: offers.filter(o => o.stage === 'Sözleşme Bekliyor').length },
      { name: 'Sözleşme İmzalandı', count: offers.filter(o => o.stage === 'Sözleşme İmzalandı').length }
    ];

    // Win Rate: signed / total active offers
    const signedCount = offers.filter(o => o.stage === 'Sözleşme İmzalandı').length;
    const totalActive = offers.filter(o => o.stage !== 'İptal').length;
    const winRate = totalActive > 0 ? Math.round((signedCount / totalActive) * 100) : 0;

    // Top 10 offers
    const topOffers = [...offers]
      .filter(o => o.stage !== 'İptal')
      .sort((a, b) => (b.valueNumeric || 0) - (a.valueNumeric || 0))
      .slice(0, 10);

    return {
      stagesList,
      winRate,
      topOffers
    };
  }, [offers]);

  // 3. OPERASYON: Occupancy map, conflicts and maintenance
  const operationMetrics = useMemo(() => {
    const isConflict = (r1: any, r2: any) => {
      if (r1.id === r2.id || r1.spaceId !== r2.spaceId) return false;
      return r1.startDate <= r2.endDate && r2.startDate <= r1.endDate;
    };

    const conflictsList: any[] = [];
    const activeRes = reservations.filter(r => r.status !== 'İptal');
    for (let i = 0; i < activeRes.length; i++) {
      for (let j = i + 1; j < activeRes.length; j++) {
        if (isConflict(activeRes[i], activeRes[j])) {
          conflictsList.push({
            id: `${activeRes[i].id}-${activeRes[j].id}`,
            spaceCode: activeRes[i].spaceCode,
            spaceName: activeRes[i].spaceName,
            clientA: activeRes[i].clientName,
            datesA: `${activeRes[i].startDate} - ${activeRes[i].endDate}`,
            clientB: activeRes[j].clientName,
            datesB: `${activeRes[j].startDate} - ${activeRes[j].endDate}`,
            reason: 'Tarih çakışması tespit edildi'
          });
        }
      }
    }

    const mostUsed = [...spaces]
      .sort((a, b) => (b.traffic || 0) - (a.traffic || 0))
      .slice(0, 5);

    const premiumFree = spaces
      .filter(s => s.status === 'bos' && (s.priceNumeric || 0) >= 50000)
      .slice(0, 5);

    const underMaintenance = spaces.filter(s => s.status === 'bakim');

    return {
      conflictsList,
      mostUsed,
      premiumFree,
      underMaintenance
    };
  }, [spaces, reservations]);

  // 4. FİNANS: Income & most profitable companies
  const financeMetrics = useMemo(() => {
    const sortedCompanies = [...(finance?.accounts || [])]
      .sort((a: any, b: any) => {
        const valA = parseFloat(a.totalDebt.replace(/[^\d]/g, '')) || 0;
        const valB = parseFloat(b.totalDebt.replace(/[^\d]/g, '')) || 0;
        return valB - valA;
      })
      .slice(0, 5);

    return {
      sortedCompanies
    };
  }, [finance]);

  // 5. SÖZLEŞMELER: Risk Analysis
  const contractMetrics = useMemo(() => {
    const upcomingContracts = contracts
      .filter(c => c.status !== 'cancelled' && c.status !== 'İptal' && c.daysLeft <= 45)
      .slice(0, 5);

    const riskyContracts = contracts
      .filter(c => c.status !== 'cancelled' && c.status !== 'İptal' && (c.aiRiskScore && c.aiRiskScore >= 7))
      .slice(0, 5);

    return {
      upcomingContracts,
      riskyContracts
    };
  }, [contracts]);

  // 6. AI CEO INSIGHTS Auto-generator
  const aiCeoSummary = useMemo(() => {
    const freePremiumCount = spaces.filter(s => s.status === 'bos' && (s.priceNumeric || 0) >= 50000).length;
    
    return [
      `Bu ay havalimanı reklam ünitelerinde **doluluk oranı %${metrics.occupancyRate}** seviyesindedir.`,
      `Önümüzdeki dönem için beklenen ciro kapasitesi **${metrics.totalExpectedCiro}** olarak hesaplanmıştır.`,
      `**${metrics.expiringThisMonthCount} adet sözleşme** bu ay içinde süresini dolduruyor ve yenileme periyoduna giriyor.`,
      `Şu anda kiralama için uygun durumda **${freePremiumCount} adet premium boş alan** bulunmaktadır.`,
      `Cari hesaplarda tahsil edilmeyi bekleyen fatura bakiyesi toplamı **${metrics.pendingCollections}** seviyesindedir.`,
      `**Pegasus** ve **Turkish Airlines** aktif kiralama hacimlerine göre yenileme döneminde fiyat artış potansiyeline sahiptir.`,
      `Uluslararası yolcu trafiğinin artışı nedeniyle **Duty Free LED ekranlarında** yeni kampanya paketleri önerilmektedir.`,
      `**Dış Hatlar terminal grubu** doluluk oranları yükselirken, **İç Hatlar arınmış salon** doluluk oranlarında düşüş trendi gözlenmektedir.`
    ];
  }, [metrics, spaces]);

  // Recharts cashflow mappings
  const cashFlowData = useMemo(() => {
    if (finance && finance.cashFlowTrends && finance.cashFlowTrends.length > 0) {
      return finance.cashFlowTrends;
    }
    return [
      { month: 'Ocak', incoming: 12000000, outgoing: 8000000, net: 4000000 },
      { month: 'Şubat', incoming: 15000000, outgoing: 8500000, net: 6500000 },
      { month: 'Mart', incoming: 18000000, outgoing: 9000000, net: 9000000 },
      { month: 'Nisan', incoming: 22000000, outgoing: 10000000, net: 12000000 },
      { month: 'Mayıs', incoming: 28000000, outgoing: 12000000, net: 16000000 }
    ];
  }, [finance]);

  const pieChartData = useMemo(() => {
    if (finance && finance.collectionStatuses && finance.collectionStatuses.length > 0) {
      return finance.collectionStatuses;
    }
    return [
      { name: 'Tahsil Edilen', value: 80000000, color: '#10b981' },
      { name: 'Kalan Bakiye', value: 40000000, color: '#3b82f6' }
    ];
  }, [finance]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6 text-left select-none pb-12">
      {/* Bloomberg-style Live Ticker Status Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#070b13] border border-white/5 p-4 rounded-3xl relative overflow-hidden select-none shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <div className="space-y-0.5 text-left">
            <h2 className="text-[10px] font-black text-white uppercase tracking-widest leading-none">CEO EXECUTIVE INTELLIGENCE CENTER</h2>
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Yönetim Kurulu Canlı Pazar, Ciro ve SLA Performans Terminali</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-[9px] font-bold text-slate-400">
          <div>USD/TRY: <span className="text-white">34.18</span> <span className="text-emerald-450">▲ +0.12%</span></div>
          <div>BIST Outdoor: <span className="text-white">8.540</span> <span className="text-emerald-450">▲ +0.95%</span></div>
          <div>Şirket Pazar Payı: <span className="text-white">%38.2</span> <span className="text-blue-400">Sabit</span></div>
          <div>SLA Başarı Oranı: <span className="text-emerald-450">%98.4</span></div>
        </div>
      </div>

      {/* ÜST KPI Cards (10 Cards Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-10 gap-3">
        <DarkKpiCard
          title="Toplam Envanter"
          value={loading ? '...' : String(metrics.totalSpaces)}
          percentage="100%"
          subtext="Toplam ünite"
          icon={<MapPin size={13} />}
          iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/10"
        />
        <DarkKpiCard
          title="Doluluk Oranı"
          value={loading ? '...' : `%${metrics.occupancyRate}`}
          percentage={`${metrics.occupancyRate}%`}
          subtext="Envanter verimliliği"
          icon={<TrendingUp size={13} />}
          iconBgColor="bg-purple-500/10 text-purple-400 border-purple-500/10"
          glowColor="purple"
        />
        <DarkKpiCard
          title="Bu Ay Ciro"
          value={loading ? '...' : metrics.thisMonthCiro}
          percentage=""
          subtext="Aktif fatura"
          icon={<Coins size={13} />}
          iconBgColor="bg-emerald-500/10 text-emerald-450 border-emerald-500/10"
          glowColor="green"
        />
        <DarkKpiCard
          title="Beklenen Ciro"
          value={loading ? '...' : metrics.totalExpectedCiro}
          percentage=""
          subtext="Aylık kapasite"
          icon={<Coins size={13} />}
          iconBgColor="bg-indigo-500/10 text-indigo-400 border-indigo-500/10"
        />
        <DarkKpiCard
          title="Aktif Sözleşme"
          value={loading ? '...' : String(metrics.activeContractsCount)}
          percentage=""
          subtext="İmzalı kontratlar"
          icon={<FileText size={13} />}
          iconBgColor="bg-teal-500/10 text-teal-400 border-teal-500/10"
        />
        <DarkKpiCard
          title="Bu Ay Bitecek"
          value={loading ? '...' : String(metrics.expiringThisMonthCount)}
          percentage=""
          subtext="Yenileme potansiyeli"
          icon={<Clock size={13} />}
          iconBgColor="bg-orange-500/10 text-orange-400 border-orange-500/10"
          glowColor="yellow"
        />
        <DarkKpiCard
          title="Tahsilat Bekleyen"
          value={loading ? '...' : metrics.pendingCollections}
          percentage=""
          subtext="Müşteri bakiyesi"
          icon={<Coins size={13} />}
          iconBgColor="bg-rose-500/10 text-rose-455 border-rose-500/10"
          glowColor="red"
        />
        <DarkKpiCard
          title="Aktif Kampanya"
          value={loading ? '...' : String(metrics.activeCampaignsCount)}
          percentage=""
          subtext="Şu an yayında"
          icon={<Activity size={13} />}
          iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/10"
        />
        <DarkKpiCard
          title="Aktif Rezervasyon"
          value={loading ? '...' : String(metrics.activeReservationsCount)}
          percentage=""
          subtext="Onaylanan yerler"
          icon={<Calendar size={13} />}
          iconBgColor="bg-emerald-500/10 text-emerald-450 border-emerald-500/10"
        />
        <DarkKpiCard
          title="Pipeline Satış"
          value={loading ? '...' : metrics.pipelineValue}
          percentage=""
          subtext="Teklif havuzu"
          icon={<TrendingUp size={13} />}
          iconBgColor="bg-indigo-500/10 text-indigo-400 border-indigo-500/10"
        />
      </div>

      {/* Main Sections Splits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: AI CEO INSIGHTS & YÖNETİM AKSİYONLARI */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI CEO INSIGHTS Auto-summary */}
          <div className="bg-purple-950/10 border border-purple-500/15 rounded-3xl p-5 space-y-3.5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-purple-500/15">
              <span className="text-xs font-black text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={13} className="animate-pulse" />
                AI CEO INSIGHTS
              </span>
              <span className="text-[7px] bg-purple-500/20 text-purple-300 font-extrabold px-1.5 py-0.5 rounded uppercase">Pilot Özet</span>
            </div>
            
            <div className="space-y-2 text-[10px] leading-relaxed text-slate-300 font-semibold">
              {aiCeoSummary.map((insight, idx) => (
                <div key={idx} className="flex items-start gap-2 border-b border-white/2 pb-1.5 last:border-0 last:pb-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                  <p className="m-0 text-slate-300">
                    {insight.split('**').map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-white font-extrabold">{part}</strong> : part)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* YÖNETİM AKSİYONLARI Panel */}
          <DarkDashboardCard className="space-y-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Zap size={12} className="text-blue-500 animate-pulse" />
              YÖNETİM AKSİYONLARI (QUICK LAUNCH)
            </span>
            
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <button 
                onClick={() => setOfferModalOpen(true)}
                className="p-3 bg-blue-650 hover:bg-blue-600 rounded-xl text-white font-black uppercase text-center cursor-pointer transition-all border-0 shadow-lg hover:shadow-blue-500/10 flex items-center justify-center gap-1.5"
              >
                <PlusSquare size={13} />
                Yeni Teklif
              </button>
              
              <button 
                onClick={() => {
                  alert('Hızlı rezervasyon oluşturucu yüklendi. Reklam alanları listesinden bir alan seçerek rezervasyonu tamamlayabilirsiniz.');
                  setCurrentRoute('reklam-alanlari');
                }}
                className="p-3 bg-slate-900 hover:bg-white/5 border border-white/5 rounded-xl text-slate-200 font-black uppercase text-center cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <Calendar size={13} />
                Rezervasyon
              </button>
              
              <button 
                onClick={() => setCurrentRoute('sales-wizard')}
                className="p-3 bg-slate-900 hover:bg-white/5 border border-white/5 rounded-xl text-slate-200 font-black uppercase text-center cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <FilePlus size={13} />
                Yeni Kampanya
              </button>
              
              <button 
                onClick={() => setCurrentRoute('sozlesmeler')}
                className="p-3 bg-slate-900 hover:bg-white/5 border border-white/5 rounded-xl text-slate-200 font-black uppercase text-center cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <FilePlus size={13} />
                Sözleşme Oluştur
              </button>
              
              <button 
                onClick={() => setCompanyModalOpen(true)}
                className="p-3 bg-slate-900 hover:bg-white/5 border border-white/5 rounded-xl text-slate-200 font-black uppercase text-center cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <Building2 size={13} />
                Firma Ekle
              </button>

              <button 
                onClick={() => setCurrentRoute('raporlar')}
                className="p-3 bg-slate-900 hover:bg-white/5 border border-white/5 rounded-xl text-slate-200 font-black uppercase text-center cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <BarChart2 size={13} />
                Raporlar
              </button>
            </div>
            
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('toggle_ai_pilot'))}
              className="w-full p-2.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-650 hover:to-indigo-650 text-white font-black uppercase rounded-xl cursor-pointer border-0 shadow-lg text-center text-[10px] flex items-center justify-center gap-1.5 mt-2"
            >
              <Sparkles size={13} className="animate-pulse" />
              Outdoor AI Pilot Sohbet
            </button>
          </DarkDashboardCard>

        </div>

        {/* RIGHT AREA: SATIŞ, FİNANS, OPERASYON, SÖZLEŞMELER */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* SECTION: SATIŞ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Pipeline and Win rate */}
            <DarkDashboardCard className="space-y-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <BarChart2 size={12} className="text-blue-500" />
                Satış Pipeline Funnel & Kazanma Oranı
              </span>
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* SVG Progress Gauge */}
                <div className="col-span-4 text-center space-y-1">
                  <div className="relative w-16 h-16 mx-auto">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path className="text-slate-900" strokeWidth="2.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path className="text-blue-500" strokeDasharray={`${salesMetrics.winRate}, 100`} strokeWidth="2.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-white">
                      %{salesMetrics.winRate}
                    </div>
                  </div>
                  <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Kazanma Oranı</span>
                </div>

                <div className="col-span-8 space-y-2 text-[9.5px]">
                  {salesMetrics.stagesList.map((stage, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between font-bold leading-none">
                        <span className="text-slate-400">{stage.name}</span>
                        <span className="text-white font-extrabold">{stage.count} adet</span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-blue-500" style={{ width: `${Math.min(stage.count * 10, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </DarkDashboardCard>

            {/* Top 5 biggest offers */}
            <DarkDashboardCard className="space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">En Büyük Teklifler</span>
              <div className="space-y-2 text-[9.5px]">
                {salesMetrics.topOffers.slice(0, 5).map(o => (
                  <div key={o.id} className="flex justify-between items-center p-2 rounded-xl bg-white/3 border border-white/5">
                    <div className="space-y-0.5">
                      <span className="text-white font-black">{o.clientName}</span>
                      <span className="text-[7.5px] text-slate-500 block uppercase">{o.campaignName}</span>
                    </div>
                    <span className="text-emerald-450 font-black shrink-0">{o.value}</span>
                  </div>
                ))}
              </div>
            </DarkDashboardCard>

          </div>

          {/* SECTION: FİNANS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Revenue Trend chart */}
            <DarkDashboardCard className="space-y-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Coins size={12} className="text-emerald-450 animate-pulse" />
                Aylık Nakit Akışı ve Tahsilat Trendi (Recharts)
              </span>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cashFlowData}>
                    <defs>
                      <linearGradient id="colorIncoming" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={9} />
                    <YAxis stroke="#64748b" fontSize={9} />
                    <Tooltip contentStyle={{ backgroundColor: '#0b0f19', border: '1px solid rgba(255,255,255,0.1)' }} />
                    <Area type="monotone" dataKey="incoming" stroke="#10b981" fillOpacity={1} fill="url(#colorIncoming)" name="Gelir" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </DarkDashboardCard>

            {/* Most profitable clients */}
            <DarkDashboardCard className="space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">En Yüksek Bütçeli Firmalar</span>
              <div className="space-y-2 text-[9.5px]">
                {financeMetrics.sortedCompanies.map(c => (
                  <div key={c.id} className="flex justify-between items-center p-2 rounded-xl bg-white/3 border border-white/5">
                    <div className="space-y-0.5">
                      <span className="text-white font-black">{c.name}</span>
                      <span className="text-[7.5px] text-slate-500 block uppercase">CRM Seviyesi: {c.crmTier}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-450 font-black block">{c.totalDebt}</span>
                      <span className="text-[7.5px] text-rose-455 block font-bold">Kalan: {c.balance}</span>
                    </div>
                  </div>
                ))}
              </div>
            </DarkDashboardCard>

          </div>

          {/* SECTION: OPERASYON */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Terminal Layout Block Haritası */}
            <DarkDashboardCard className="space-y-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <MapPin size={12} className="text-indigo-400" />
                Terminal Doluluk Isı Haritası (Heatmap)
              </span>
              
              <div className="grid grid-cols-2 gap-3.5">
                {/* İç Hatlar block */}
                <div className="bg-white/2 p-3 rounded-2xl border border-white/5 space-y-2">
                  <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider block">İç Hatlar Terminali</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {spaces.filter(s => s.location.includes('İç')).slice(0, 12).map((s, idx) => {
                      const color = s.status === 'dolu' ? 'bg-emerald-500 glow-green' : s.status === 'teklif' ? 'bg-amber-500 glow-yellow' : 'bg-blue-600/30';
                      return (
                        <div 
                          key={s.id} 
                          className={`h-4.5 rounded-md ${color} transition-all duration-300 hover:scale-110 cursor-pointer`}
                          title={`${s.code}: ${s.name}`}
                          onClick={() => {
                            setCurrentRoute('reklam-alanlari');
                          }}
                        />
                      );
                    })}
                  </div>
                  <span className="text-[7.5px] text-slate-550 block font-bold uppercase">12 İzlenen Ünite</span>
                </div>

                {/* Dış Hatlar block */}
                <div className="bg-white/2 p-3 rounded-2xl border border-white/5 space-y-2">
                  <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider block">Dış Hatlar Terminali</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {spaces.filter(s => s.location.includes('Dış')).slice(0, 12).map((s, idx) => {
                      const color = s.status === 'dolu' ? 'bg-emerald-500 glow-green' : s.status === 'teklif' ? 'bg-amber-500 glow-yellow' : 'bg-blue-600/30';
                      return (
                        <div 
                          key={s.id} 
                          className={`h-4.5 rounded-md ${color} transition-all duration-300 hover:scale-110 cursor-pointer`}
                          title={`${s.code}: ${s.name}`}
                          onClick={() => {
                            setCurrentRoute('reklam-alanlari');
                          }}
                        />
                      );
                    })}
                  </div>
                  <span className="text-[7.5px] text-slate-550 block font-bold uppercase">12 İzlenen Ünite</span>
                </div>
              </div>
            </DarkDashboardCard>

            {/* Conflicts & Maintenance */}
            <DarkDashboardCard className="space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Rezervasyon Çakışmaları & Bakım</span>
              <div className="space-y-2 text-[9.5px]">
                {operationMetrics.conflictsList.length === 0 ? (
                  <div className="p-4.5 bg-emerald-600/5 border border-emerald-500/20 text-emerald-450 rounded-xl text-center font-bold">
                    Mevcut rezervasyon planlamasında çakışma bulunmamaktadır.
                  </div>
                ) : (
                  operationMetrics.conflictsList.slice(0, 2).map(c => (
                    <div key={c.id} className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-455 space-y-1">
                      <div className="flex items-center gap-1.5 font-black uppercase text-[8.5px]">
                        <AlertTriangle size={11} />
                        ÇAKIŞMA ALARMI: {c.spaceCode}
                      </div>
                      <p className="m-0 leading-normal text-[8.5px] font-semibold text-slate-400">
                        {c.clientA} ({c.datesA}) vs {c.clientB} ({c.datesB})
                      </p>
                    </div>
                  ))
                )}

                {operationMetrics.underMaintenance.slice(0, 2).map(s => (
                  <div key={s.id} className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-between">
                    <div>
                      <span className="font-black text-[9px] block leading-none uppercase">{s.code} Bakımda</span>
                      <span className="text-[7.5px] text-slate-500 font-bold block mt-1 uppercase">{s.location}</span>
                    </div>
                    <Badge variant="primary" className="text-[7.5px] bg-amber-500/20 text-amber-400">ARIZALI</Badge>
                  </div>
                ))}
              </div>
            </DarkDashboardCard>

          </div>

          {/* SECTION: SÖZLEŞMELER & YENİLEME */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Risk analysis contracts */}
            <DarkDashboardCard className="space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">AI Risk Analizi (Kritik Cari Kontratlar)</span>
              <div className="space-y-2 text-[9.5px]">
                {contractMetrics.riskyContracts.length === 0 ? (
                  <div className="p-4 bg-emerald-600/5 border border-emerald-500/20 text-emerald-450 rounded-xl text-center font-bold">
                    Kritik düzeyde finansal/operasyonel risk taşıyan sözleşme tespit edilmedi.
                  </div>
                ) : (
                  contractMetrics.riskyContracts.map(c => (
                    <div key={c.id} className="p-2 rounded-xl bg-white/3 border border-white/5 flex justify-between items-center">
                      <div className="space-y-0.5">
                        <span className="text-white font-black block leading-none">{c.contractNo} - {c.clientName}</span>
                        <span className="text-[7.5px] text-slate-500 block uppercase">Fatura Tutarı: {c.value}</span>
                      </div>
                      <Badge variant="primary" className="text-[8px] bg-rose-500/15 text-rose-455 font-black border border-rose-500/20 uppercase tracking-wider">
                        RİSK SKORU: {c.aiRiskScore}/10
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </DarkDashboardCard>

            {/* Expiring contracts list */}
            <DarkDashboardCard className="space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Yaklaşan Bitişler & Yenileme Bekleyenler</span>
              <div className="space-y-2 text-[9.5px]">
                {contractMetrics.upcomingContracts.map(c => (
                  <div key={c.id} className="p-2 rounded-xl bg-white/3 border border-white/5 flex justify-between items-center">
                    <div className="space-y-0.5">
                      <span className="text-white font-black block leading-none">{c.contractNo} - {c.clientName}</span>
                      <span className="text-[7.5px] text-slate-500 block uppercase">Bitiş: {c.endDate}</span>
                    </div>
                    <Badge variant="primary" className="text-[8px] bg-amber-500/15 text-amber-400 font-black border border-amber-500/20 uppercase tracking-wider">
                      {c.daysLeft} GÜN KALDI
                    </Badge>
                  </div>
                ))}
              </div>
            </DarkDashboardCard>

          </div>

        </div>

      </div>

      {/* Quick Launch Modals */}
      <OfferModal
        isOpen={offerModalOpen}
        onClose={() => setOfferModalOpen(false)}
        onSuccess={() => {
          loadAllData();
          alert('Hızlı Teklif başarıyla oluşturuldu.');
        }}
      />

      <CompanyModal
        isOpen={companyModalOpen}
        onClose={() => setCompanyModalOpen(false)}
        onSuccess={() => {
          loadAllData();
          alert('Yeni firma başarıyla kaydedildi.');
        }}
      />

    </div>
  );
}
