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
  Layers, 
  Clock, 
  FileText, 
  BarChart2, 
  DownloadCloud,
  Megaphone,
  Tv,
  Percent,
  Plus,
  CheckCircle,
  FileSignature,
  Wrench,
  CheckCheck
} from 'lucide-react';
import { 
  spaceRepository, 
  offerRepository, 
  contractRepository, 
  reservationRepository, 
  campaignRepository, 
  financeRepository,
  companyRepository,
  digitalScreenRepository,
  maintenanceRepository
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
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid
} from 'recharts';
import { dashboardMetricsService } from '@/services/dashboardMetricsService';

export function Dashboard() {
  const { setCurrentRoute } = useApp();

  // Modals visibility state
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [companyModalOpen, setCompanyModalOpen] = useState(false);

  // Dynamic state loaded instantly using synchronous initializers
  const [companies, setCompanies] = useState<any[]>(() => companyRepository.getAllSync());
  const [spaces, setSpaces] = useState<any[]>(() => spaceRepository.getAllSync());
  const [offers, setOffers] = useState<any[]>(() => offerRepository.getAllSync());
  const [contracts, setContracts] = useState<any[]>(() => contractRepository.getAllSync());
  const [reservations, setReservations] = useState<any[]>(() => reservationRepository.getAllSync());
  const [campaigns, setCampaigns] = useState<any[]>(() => campaignRepository.getAllSync());
  const [finance, setFinance] = useState<any>(() => financeRepository.getFinanceDataSync());
  const [screens, setScreens] = useState<any[]>(() => digitalScreenRepository.listScreens());
  const [slots, setSlots] = useState<any[]>(() => digitalScreenRepository.listPlaylistSlots());
  const [pops, setPops] = useState<any[]>(() => JSON.parse(localStorage.getItem('outdoorcore_mock_proofOfPlays') || '[]'));
  const [maintenance, setMaintenance] = useState<any[]>(() => maintenanceRepository.getAllSync());
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tab state for deadlines
  const [activeDeadlineTab, setActiveDeadlineTab] = useState<'options' | 'contracts' | 'collections' | 'campaigns'>('options');

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [comList, sList, oList, cList, rList, camList, fData, maintList] = await Promise.all([
        companyRepository.list(),
        spaceRepository.list(),
        offerRepository.list(),
        contractRepository.getAll(),
        reservationRepository.getAll(),
        campaignRepository.getAll(),
        financeRepository.getFinanceData(),
        maintenanceRepository.getAll()
      ]);
      setCompanies(comList);
      setSpaces(sList);
      setOffers(oList);
      setContracts(cList);
      setReservations(rList);
      setCampaigns(camList);
      setFinance(fData);
      setScreens(digitalScreenRepository.listScreens());
      setSlots(digitalScreenRepository.listPlaylistSlots());
      setPops(JSON.parse(localStorage.getItem('outdoorcore_mock_proofOfPlays') || '[]'));
      setMaintenance(maintList);
    } catch (e: any) {
      console.error('Error loading CEO dashboard data:', e);
      setError('Dashboard verileri yüklenemedi. Lütfen bağlantınızı kontrol edip tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
    window.addEventListener('storage', loadAllData);
    window.addEventListener('outdoorcore_data_updated', loadAllData);
    return () => {
      window.removeEventListener('storage', loadAllData);
      window.removeEventListener('outdoorcore_data_updated', loadAllData);
    };
  }, []);

  // Compute metrics using central metrics service
  const stats = useMemo(() => {
    return dashboardMetricsService.calculateAll(
      companies,
      spaces,
      offers,
      contracts,
      reservations,
      campaigns,
      finance,
      screens,
      slots,
      pops,
      maintenance
    );
  }, [companies, spaces, offers, contracts, reservations, campaigns, finance, screens, slots, pops, maintenance]);

  // Format currencies beautifully
  const formatCurrency = (val: number) => {
    if (val === 0) return '₺0';
    if (val >= 1000000) return `₺${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `₺${(val / 1000).toFixed(0)}K`;
    return `₺${val.toLocaleString('tr-TR')}`;
  };

  // Remaining days visual tags helper
  const getDeadlineTagStyle = (days: number) => {
    if (days <= 0) return 'bg-rose-500/10 text-rose-500 border border-rose-500/25';
    if (days <= 7) return 'bg-red-500/10 text-red-400 border border-red-500/20';
    if (days <= 29) return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
  };

  return (
    <div className="space-y-6 text-left select-none pb-12 bg-[#0c1325]/40 p-5 rounded-3xl border border-white/5 max-w-[1600px] mx-auto w-full">
      
      {/* CEO Executive Intelligence Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-white/5 pb-5">
        <div className="space-y-1 text-left">
          <h1 className="text-lg font-black text-white uppercase tracking-widest leading-none">CEO Executive Intelligence Center</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Satış, envanter, sözleşme, kampanya ve tahsilat performansını tek ekrandan yönetin.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[9px] font-black text-slate-500 bg-white/3 border border-white/5 px-3 py-1.5 rounded-xl uppercase tracking-wider">
            Son Güncelleme: {new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
          </span>

          <Button 
            variant="minimal" 
            size="sm" 
            leftIcon={<DownloadCloud size={13} />}
            onClick={() => alert('Genel Yönetici Yönetim Kurulu PDF Raporu indiriliyor...')}
          >
            Rapor İndir
          </Button>

          <Button 
            variant="primary" 
            size="sm" 
            leftIcon={<Sparkles size={13} className="animate-pulse" />}
            className="bg-gradient-to-r from-purple-750 to-indigo-750 hover:from-purple-700 hover:to-indigo-700 text-white font-black"
            onClick={() => window.dispatchEvent(new CustomEvent('toggle_ai_pilot'))}
          >
            OutdoorCore AI
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex justify-between items-center text-rose-400">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase">
            <AlertTriangle size={14} />
            <span>{error}</span>
          </div>
          <Button size="xs" variant="minimal" onClick={loadAllData}>Yeniden Dene</Button>
        </div>
      )}

      {/* 6 MAIN KPI CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <DarkKpiCard
          title="Kesinleşmiş Ciro"
          value={loading ? '...' : formatCurrency(stats.ciro)}
          percentage="—"
          subtext="Konfirme rezervasyon / sözleşmeler"
          icon={<Coins size={15} />}
          iconBgColor="bg-emerald-500/10 text-emerald-450 border-emerald-500/10"
          glowColor="green"
        />
        <DarkKpiCard
          title="Aktif Pipeline"
          value={loading ? '...' : formatCurrency(stats.pipeline)}
          percentage="—"
          subtext="Sonuçlanmamış teklifler toplamı"
          icon={<Layers size={15} />}
          iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/10"
        />
        <DarkKpiCard
          title="Tahsilat Bekleyen"
          value={loading ? '...' : formatCurrency(stats.tahsilatBekleyen)}
          percentage="—"
          subtext="Açık fatura ve cariler toplamı"
          icon={<Coins size={15} />}
          iconBgColor="bg-rose-500/10 text-rose-455 border-rose-500/10"
          glowColor="red"
        />
        <DarkKpiCard
          title="Aktif Sözleşme"
          value={loading ? '...' : String(stats.activeContractsCount)}
          percentage="—"
          subtext="İmzalanmış kontrat adeti"
          icon={<FileText size={15} />}
          iconBgColor="bg-teal-500/10 text-teal-400 border-teal-500/10"
        />
        <DarkKpiCard
          title="Aktif Kampanya"
          value={loading ? '...' : String(stats.activeCampaignsCount)}
          percentage="—"
          subtext="Şu an havalimanında yayında"
          icon={<Activity size={15} />}
          iconBgColor="bg-indigo-500/10 text-indigo-400 border-indigo-500/10"
        />
        <DarkKpiCard
          title="Envanter Doluluk Oranı"
          value={loading ? '...' : `%${stats.occupancyRate.toFixed(1)}`}
          percentage="—"
          subtext="Kullanılan / Toplam Reklam Alanı"
          icon={<TrendingUp size={15} />}
          iconBgColor="bg-purple-500/10 text-purple-400 border-purple-500/10"
          glowColor="purple"
        />
      </div>

      {/* THREE SCENARIOS CHECK: IF FULLY EMPTY Workspace -> Onboarding State */}
      {stats.isSystemEmpty ? (
        <div className="p-8 text-center bg-[#10192e]/60 border border-white/5 rounded-3xl space-y-6 max-w-2xl mx-auto py-12 select-none shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto animate-pulse">
            <Sparkles size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-black text-white uppercase tracking-widest">OutdoorCore çalışma alanınız hazır</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider max-w-md mx-auto leading-relaxed">
              İlk firmanızı ve reklam alanınızı ekleyerek satış sürecini anında başlatabilirsiniz.
            </p>
          </div>

          <div className="flex justify-center gap-3.5 pt-2">
            <Button variant="primary" size="sm" onClick={() => setCompanyModalOpen(true)}>
              Firma Ekle
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentRoute('reklam-alanlari')}>
              Reklam Alanı Ekle
            </Button>
          </div>

          <div className="border-t border-white/5 pt-6 text-left max-w-sm mx-auto space-y-3">
            <span className="text-[8.5px] font-black text-slate-500 uppercase tracking-widest block text-center mb-1">
              Üç Aşamalı Başlangıç Rehberi
            </span>
            <div className="flex gap-3 text-[9px] font-bold text-slate-400">
              <span className="w-5 h-5 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center font-black text-white shrink-0">1</span>
              <span>Firma veya marka ekleyin.</span>
            </div>
            <div className="flex gap-3 text-[9px] font-bold text-slate-400">
              <span className="w-5 h-5 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center font-black text-white shrink-0">2</span>
              <span>Reklam alanı envanterini oluşturun.</span>
            </div>
            <div className="flex gap-3 text-[9px] font-bold text-slate-400">
              <span className="w-5 h-5 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center font-black text-white shrink-0">3</span>
              <span>Teklif hazırlayıp rezervasyon akışını başlatın.</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* AI YÖNETİCİ ÖZETİ (AI Executive Summary) */}
          <div className="bg-purple-950/10 border border-purple-500/15 rounded-3xl p-5 space-y-3.5 shadow-xl relative overflow-hidden text-left">
            <div className="flex items-center justify-between pb-2 border-b border-purple-500/15">
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles size={13} className="animate-pulse" />
                AI YÖNETİCİ ÖZETİ
              </span>
              <Badge variant="primary" className="text-[7.5px] bg-purple-500/20 text-purple-300 font-extrabold tracking-wider border border-purple-500/10 uppercase">
                Yapay Zekâ Analizi
              </Badge>
            </div>
            
            {stats.aiInsights.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[9.5px] leading-relaxed text-slate-300 font-bold">
                {stats.aiInsights.map((insight, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 bg-white/2 p-2.5 rounded-xl border border-white/3">
                    <span className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                    <p className="m-0 text-slate-300">
                      {insight}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 text-center py-4">
                <span className="text-[9.5px] font-bold text-slate-500 block uppercase">Analiz oluşturmak için henüz yeterli gerçek veri bulunmuyor.</span>
                <Button size="xs" variant="ghost" onClick={() => setOfferModalOpen(true)}>İlk veriyi oluştur</Button>
              </div>
            )}
          </div>

          {/* SECTION: SATIŞ VE PIPELINE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sol: Sales Pipeline Funnel */}
            <div className="lg:col-span-6">
              <DarkDashboardCard className="space-y-4 h-full text-left">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <BarChart2 size={12} className="text-blue-400" />
                    SATIŞ PIPELINE & KAZANMA ORANI
                  </span>
                  <span className="text-[8px] bg-slate-900 border border-white/5 text-slate-300 font-black px-2 py-0.5 rounded-md uppercase">
                    Kazanma Oranı: {stats.winRateText}
                  </span>
                </div>

                <div className="space-y-3.5 text-[9.5px]">
                  {stats.funnelStages.map((stage, idx) => {
                    const maxVal = Math.max(...stats.funnelStages.map(s => s.value), 1);
                    const widthPct = Math.min((stage.value / maxVal) * 100, 100);
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between font-bold leading-none">
                          <span className="text-slate-400 uppercase tracking-wide">{stage.name}</span>
                          <span className="text-white font-extrabold">{stage.count} Teklif ({formatCurrency(stage.value)})</span>
                        </div>
                        <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-650 transition-all duration-500" 
                            style={{ width: `${Math.max(widthPct, 4)}%` }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </DarkDashboardCard>
            </div>

            {/* Sağ: Upcoming Actions */}
            <div className="lg:col-span-6">
              <DarkDashboardCard className="space-y-3 h-full text-left">
                <div className="pb-2 border-b border-white/5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">YAKLAŞAN SATIŞ AKSİYONLARI</span>
                </div>

                <div className="space-y-2 text-[9.5px]">
                  {stats.sortedUpcomingActions.length === 0 ? (
                    <div className="py-12 text-center text-slate-550 font-bold uppercase tracking-wider text-[8.5px]">
                      Bekleyen satış aksiyonu bulunmuyor.
                    </div>
                  ) : (
                    stats.sortedUpcomingActions.map((act, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl bg-white/3 border border-white/5">
                        <div className="space-y-0.5">
                          <span className="text-white font-black block">{act.title}</span>
                          <span className="text-[7.5px] text-slate-500 block uppercase font-black">{act.sub}</span>
                        </div>
                        <Badge variant="muted" className={`text-[8.5px] font-black ${act.color}`}>
                          {act.value}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </DarkDashboardCard>
            </div>
          </div>

          {/* SECTION: FİNANS VE NAKİT AKIŞI */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sol: 30 Günlük Nakit Akışı */}
            <div className="lg:col-span-7">
              <DarkDashboardCard className="space-y-4 text-left">
                <div className="pb-2 border-b border-white/5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Coins size={12} className="text-emerald-450" />
                    30 GÜNLÜK NAKİT AKIŞI
                  </span>
                </div>

                {stats.collectedPast30 === 0 && stats.expectedNext30 === 0 && stats.overdueFinance === 0 ? (
                  <div className="py-12 text-center text-slate-550 font-bold uppercase tracking-wider text-[8.5px]">
                    Nakit akışı grafiği için henüz finansal veri bulunmuyor.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4 pt-1">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/15 rounded-2xl space-y-1">
                      <span className="text-[8px] font-black text-slate-400 uppercase block tracking-wider">Son 30 Gün Tahsil Edilen</span>
                      <span className="text-xs font-black text-emerald-400 block">{formatCurrency(stats.collectedPast30)}</span>
                    </div>
                    <div className="p-3 bg-blue-500/10 border border-blue-500/15 rounded-2xl space-y-1">
                      <span className="text-[8px] font-black text-slate-400 uppercase block tracking-wider">Gelecek 30 Gün Beklenen</span>
                      <span className="text-xs font-black text-blue-400 block">{formatCurrency(stats.expectedNext30)}</span>
                    </div>
                    <div className="p-3 bg-rose-500/10 border border-rose-500/15 rounded-2xl space-y-1">
                      <span className="text-[8px] font-black text-slate-400 uppercase block tracking-wider">Geciken Toplam Borç</span>
                      <span className="text-xs font-black text-rose-455 block">{formatCurrency(stats.overdueFinance)}</span>
                    </div>
                  </div>
                )}
              </DarkDashboardCard>
            </div>

            {/* Sağ: Tahsilat Risk Özeti */}
            <div className="lg:col-span-5">
              <DarkDashboardCard className="space-y-3 text-left">
                <div className="pb-2 border-b border-white/5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">TAHSİLAT RİSK ÖZETİ</span>
                </div>

                {stats.riskiestAccounts.length === 0 ? (
                  <div className="py-12 text-center text-slate-550 font-bold uppercase tracking-wider text-[8.5px]">
                    Tahsilat riski bulunmuyor.
                  </div>
                ) : (
                  <div className="space-y-2 text-[9.5px]">
                    {stats.riskiestAccounts.slice(0, 3).map((acc, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 rounded-xl bg-white/3 border border-white/5">
                        <span className="text-white font-black">{acc.name}</span>
                        <div className="text-right">
                          <span className="text-rose-455 font-black block">{acc.balanceText}</span>
                          <span className="text-[7px] text-slate-500 block uppercase font-bold">RİSK SKORU: {acc.riskScore}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </DarkDashboardCard>
            </div>
          </div>

          {/* SECTION: ENVANTER VE OPERASYON */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
            {/* 1. Envanter Durumu */}
            <DarkDashboardCard className="space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pb-1 border-b border-white/5">
                ENVANTER DURUMU
              </span>
              {stats.inventory.total === 0 ? (
                <div className="py-6 text-center text-slate-500 font-bold uppercase text-[8.5px]">
                  Henüz reklam alanı eklenmedi.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 text-[9px] font-bold text-slate-400">
                  <div className="bg-white/2 p-2 rounded-xl border border-white/5">
                    <span className="block uppercase text-[7.5px] text-slate-500">Toplam Ünite</span>
                    <span className="text-white text-xs font-black">{stats.inventory.total}</span>
                  </div>
                  <div className="bg-emerald-500/5 p-2 rounded-xl border border-emerald-500/10">
                    <span className="block uppercase text-[7.5px] text-emerald-450">Dolu</span>
                    <span className="text-emerald-400 text-xs font-black">{stats.inventory.dolu}</span>
                  </div>
                  <div className="bg-amber-500/5 p-2 rounded-xl border border-amber-500/10">
                    <span className="block uppercase text-[7.5px] text-amber-450">Opsiyonlu</span>
                    <span className="text-amber-400 text-xs font-black">{stats.inventory.opsiyonlu}</span>
                  </div>
                  <div className="bg-blue-500/5 p-2 rounded-xl border border-blue-500/10">
                    <span className="block uppercase text-[7.5px] text-blue-400">Boş</span>
                    <span className="text-blue-300 text-xs font-black">{stats.inventory.bos}</span>
                  </div>
                </div>
              )}
            </DarkDashboardCard>

            {/* 2. Kampanya Operasyonu */}
            <DarkDashboardCard className="space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pb-1 border-b border-white/5">
                KAMPANYA OPERASYONU
              </span>
              {stats.campaignOps.active === 0 && stats.campaignOps.planned === 0 ? (
                <div className="py-6 text-center text-slate-500 font-bold uppercase text-[8.5px]">
                  Henüz aktif kampanya bulunmuyor.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 text-[9px] font-bold text-slate-400">
                  <div className="bg-emerald-500/5 p-2 rounded-xl border border-emerald-500/10">
                    <span className="block uppercase text-[7.5px] text-emerald-450">Yayında Olan</span>
                    <span className="text-emerald-400 text-xs font-black">{stats.campaignOps.active}</span>
                  </div>
                  <div className="bg-blue-500/5 p-2 rounded-xl border border-blue-500/10">
                    <span className="block uppercase text-[7.5px] text-blue-400">Planlanan</span>
                    <span className="text-blue-300 text-xs font-black">{stats.campaignOps.planned}</span>
                  </div>
                  <div className="bg-white/2 p-2 rounded-xl border border-white/5">
                    <span className="block uppercase text-[7.5px] text-slate-500">Bu Hafta Başlayacak</span>
                    <span className="text-white text-xs font-black">{stats.campaignOps.startsThisWeek}</span>
                  </div>
                  <div className="bg-white/2 p-2 rounded-xl border border-white/5">
                    <span className="block uppercase text-[7.5px] text-slate-500">Bu Hafta Bitecek</span>
                    <span className="text-white text-xs font-black">{stats.campaignOps.endsThisWeek}</span>
                  </div>
                </div>
              )}
            </DarkDashboardCard>

            {/* 3. Dijital Yayın */}
            <DarkDashboardCard className="space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pb-1 border-b border-white/5">
                DİJİTAL YAYIN / PLAYLIST
              </span>
              {stats.digitalPublish.activeScreens === 0 ? (
                <div className="py-6 text-center text-slate-500 font-bold uppercase text-[8.5px]">
                  Dijital ekran kaydı bulunmuyor.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 text-[9px] font-bold text-slate-400">
                  <div className="bg-white/2 p-2 rounded-xl border border-white/5">
                    <span className="block uppercase text-[7.5px] text-slate-500">Aktif LED Ekran</span>
                    <span className="text-white text-xs font-black">{stats.digitalPublish.activeScreens}</span>
                  </div>
                  <div className="bg-white/2 p-2 rounded-xl border border-white/5">
                    <span className="block uppercase text-[7.5px] text-slate-500">Oynatma Slotu</span>
                    <span className="text-white text-xs font-black">{stats.digitalPublish.playlistCount}</span>
                  </div>
                  <div className="bg-emerald-500/5 p-2 rounded-xl border border-emerald-500/10">
                    <span className="block uppercase text-[7.5px] text-emerald-450">Günlük Oynatma</span>
                    <span className="text-emerald-400 text-xs font-black">{stats.digitalPublish.todayPlays.toLocaleString()}</span>
                  </div>
                  <div className="bg-blue-500/5 p-2 rounded-xl border border-blue-500/10">
                    <span className="block uppercase text-[7.5px] text-blue-400">PoP Durumu</span>
                    <span className="text-blue-300 text-xs font-black">{stats.digitalPublish.popOk} OK</span>
                  </div>
                </div>
              )}
            </DarkDashboardCard>
          </div>

          {/* SECTION: TABBED DEADLINES / YAKLAŞAN SÜRELER */}
          <DarkDashboardCard className="space-y-4 text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-white/5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Clock size={12} className="text-blue-400" />
                YAKLAŞAN SÜRELER & CRITICAL DEADLINES
              </span>
              
              <div className="flex border border-white/5 bg-slate-900 rounded-xl p-0.5 overflow-hidden">
                <button 
                  onClick={() => setActiveDeadlineTab('options')}
                  className={`px-3 py-1 text-[8.5px] font-black uppercase rounded-lg border-0 cursor-pointer transition-all ${
                    activeDeadlineTab === 'options' ? 'bg-gradient-to-r from-blue-600 to-indigo-650 text-white' : 'text-slate-450 hover:text-slate-200 bg-transparent'
                  }`}
                >
                  Opsiyonlar
                </button>
                <button 
                  onClick={() => setActiveDeadlineTab('contracts')}
                  className={`px-3 py-1 text-[8.5px] font-black uppercase rounded-lg border-0 cursor-pointer transition-all ${
                    activeDeadlineTab === 'contracts' ? 'bg-gradient-to-r from-blue-600 to-indigo-650 text-white' : 'text-slate-450 hover:text-slate-200 bg-transparent'
                  }`}
                >
                  Sözleşmeler
                </button>
                <button 
                  onClick={() => setActiveDeadlineTab('collections')}
                  className={`px-3 py-1 text-[8.5px] font-black uppercase rounded-lg border-0 cursor-pointer transition-all ${
                    activeDeadlineTab === 'collections' ? 'bg-gradient-to-r from-blue-600 to-indigo-650 text-white' : 'text-slate-450 hover:text-slate-200 bg-transparent'
                  }`}
                >
                  Tahsilatlar
                </button>
                <button 
                  onClick={() => setActiveDeadlineTab('campaigns')}
                  className={`px-3 py-1 text-[8.5px] font-black uppercase rounded-lg border-0 cursor-pointer transition-all ${
                    activeDeadlineTab === 'campaigns' ? 'bg-gradient-to-r from-blue-600 to-indigo-650 text-white' : 'text-slate-450 hover:text-slate-200 bg-transparent'
                  }`}
                >
                  Kampanyalar
                </button>
              </div>
            </div>

            <div className="space-y-2 text-[9.5px]">
              {(() => {
                const filtered = stats.deadlines.filter(d => {
                  if (activeDeadlineTab === 'options') return d.type === 'Opsiyon';
                  if (activeDeadlineTab === 'contracts') return d.type === 'Sözleşme';
                  if (activeDeadlineTab === 'collections') return d.type === 'Tahsilat';
                  return d.type === 'Kampanya';
                });

                if (filtered.length === 0) {
                  return (
                    <div className="py-6 text-center text-slate-500 font-bold uppercase text-[8.5px]">
                      Yaklaşan süre bulunmuyor.
                    </div>
                  );
                }

                return filtered.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl bg-white/3 border border-white/5">
                    <div className="space-y-0.5">
                      <span className="text-white font-black block">{item.client}</span>
                      <span className="text-[7.5px] text-slate-500 block uppercase font-bold">{item.subject}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-emerald-450 font-black">{item.value}</span>
                      <span className={`text-[8.5px] px-2 py-0.5 rounded-lg font-black uppercase tracking-wider ${getDeadlineTagStyle(item.days)}`}>
                        {item.days <= 0 ? 'Bugün / Gecikti' : `${item.days} GÜN`}
                      </span>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </DarkDashboardCard>
        </>
      )}

      {/* QUICK LAUNCH BAR */}
      <DarkDashboardCard className="space-y-3 text-left">
        <span className="text-[8.5px] font-black text-slate-500 uppercase tracking-widest block pb-1 border-b border-white/5">
          HIZLI İŞLEMLER (QUICK LAUNCH)
        </span>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            leftIcon={<Plus size={12} />} 
            onClick={() => setCompanyModalOpen(true)}
            className="text-[9px] uppercase tracking-wider py-1.5 h-8"
          >
            Yeni Firma
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            leftIcon={<Plus size={12} />} 
            onClick={() => setOfferModalOpen(true)}
            className="text-[9px] uppercase tracking-wider py-1.5 h-8"
          >
            Yeni Teklif
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            leftIcon={<Calendar size={12} />} 
            onClick={() => {
              alert('Yeni Rezervasyon oluşturmak için lütfen Satış Sihirbazını kullanın.');
              setCurrentRoute('sales-wizard');
            }}
            className="text-[9px] uppercase tracking-wider py-1.5 h-8"
          >
            Rezervasyon
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            leftIcon={<Megaphone size={12} />} 
            onClick={() => setCurrentRoute('sales-wizard')}
            className="text-[9px] uppercase tracking-wider py-1.5 h-8"
          >
            Yeni Kampanya
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            leftIcon={<Coins size={12} />} 
            onClick={() => setCurrentRoute('finans')}
            className="text-[9px] uppercase tracking-wider py-1.5 h-8"
          >
            Tahsilat Ekle
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            leftIcon={<BarChart2 size={12} />} 
            onClick={() => setCurrentRoute('raporlar')}
            className="text-[9px] uppercase tracking-wider py-1.5 h-8"
          >
            Raporlar
          </Button>
        </div>
      </DarkDashboardCard>

      {/* QUICK LAUNCH MODALS */}
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
