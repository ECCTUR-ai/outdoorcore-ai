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
  Layers,
  FileSignature
} from 'lucide-react';
import { FinancialAccount } from '@/data/finance';
import { financeRepository } from '@/repositories';
import { DarkKpiCard } from '@/components/design-system/DarkKpiCard';
import { FinanceSummaryCard } from '@/components/design-system/FinanceSummaryCard';
import { CashFlowChart } from '@/components/design-system/CashFlowChart';
import { CollectionDonut } from '@/components/design-system/CollectionDonut';
import { AccountList } from '@/components/design-system/AccountList';
import { AccountDetailPanel } from '@/components/design-system/AccountDetailPanel';
import { InvoiceTable } from '@/components/design-system/InvoiceTable';
import { PaymentTimeline } from '@/components/design-system/PaymentTimeline';
import { UpcomingPayments } from '@/components/design-system/UpcomingPayments';
import { TopRevenueCompanies } from '@/components/design-system/TopRevenueCompanies';
import { RiskCenter } from '@/components/design-system/RiskCenter';
import { FinancePredictionCard } from '@/components/design-system/FinancePredictionCard';
import { FinanceActivityFeed } from '@/components/design-system/FinanceActivityFeed';
import { QuickFinanceActions } from '@/components/design-system/QuickFinanceActions';
import { AiInsightDrawer } from '@/components/design-system/AiInsightDrawer';
import { Button } from '@/components/design-system/Button';
import { TableSkeleton, CardSkeleton } from '@/components/design-system/Skeleton';
import { Notification } from '@/components/design-system/Notification';

import { parseAnyDate } from '@/utils/dateHelper';

export function Finans() {
  const [financeData, setFinanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('CMP-0001');
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  const fetchFinanceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await financeRepository.getFinanceData();
      setFinanceData(data);
      if (data && data.accounts && data.accounts.length > 0) {
        setSelectedAccountId(data.accounts[0].id);
      }
    } catch (e: any) {
      console.error(e);
      setError('Finansal veriler yüklenirken bir bağlantı hatası oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
    
    const handleStorageChange = () => {
      fetchFinanceData();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('outdoorcore_finance_data_updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('outdoorcore_finance_data_updated', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (!financeData) return;
    const params = new URLSearchParams(window.location.search);
    const companyId = params.get('companyId');
    const invoiceId = params.get('invoiceId');
    const paymentId = params.get('paymentId');

    if (companyId && financeData.accounts.some((a: any) => a.id === companyId)) {
      setSelectedAccountId(companyId);
    } else if (invoiceId) {
      const found = financeData.accounts.find((a: any) => a.invoices.some((inv: any) => inv.id === invoiceId));
      if (found) {
        setSelectedAccountId(found.id);
      }
    } else if (paymentId) {
      const found = financeData.accounts.find((a: any) => a.collections.some((col: any) => col.id === paymentId));
      if (found) {
        setSelectedAccountId(found.id);
      }
    }
  }, [financeData]);

  // Selected account lookup
  const selectedAccount = financeData?.accounts.find((a: any) => a.id === selectedAccountId) || financeData?.accounts[0] || {
    id: '',
    name: 'Yükleniyor...',
    totalInvoiced: '₺0',
    totalCollected: '₺0',
    balance: '₺0',
    riskScore: 0,
    invoices: [],
    collections: [],
    history: []
  };

  // Dynamic calculations from real repository data
  const accounts = financeData?.accounts || [];
  const totalCiro = accounts.reduce((sum: number, acc: any) => sum + (parseFloat((acc.totalDebt || '0').replace(/[^0-9]/g, '')) || 0), 0);
  const totalCollected = accounts.reduce((sum: number, acc: any) => sum + (parseFloat((acc.totalCollected || '0').replace(/[^0-9]/g, '')) || 0), 0);
  const totalPending = accounts.reduce((sum: number, acc: any) => sum + (parseFloat((acc.balance || '0').replace(/[^0-9]/g, '')) || 0), 0);
  
  const totalOverdue = accounts.reduce((sum: number, acc: any) => {
    const overdueAmt = (acc.invoices || [])
      .filter((inv: any) => inv.status === 'Gecikti')
      .reduce((s: number, inv: any) => s + (parseFloat((inv.amount || '0').replace(/[^0-9]/g, '')) || 0), 0);
    return sum + overdueAmt;
  }, 0);
  
  const totalInvoicesCount = accounts.reduce((sum: number, acc: any) => sum + (acc.invoices?.length || 0), 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let paidVadesiGelmis = 0;
  let totalVadesiGelmis = 0;

  accounts.forEach((acc: any) => {
    const plans = acc.paymentPlan || [];
    plans.forEach((plan: any) => {
      const planAmt = parseFloat((plan.amount || '').replace(/[^0-9]/g, '')) || 0;
      const planDate = parseAnyDate(plan.dueDate);
      if (!planDate) return;

      const isDueOrPast = planDate.getTime() <= today.getTime();
      if (isDueOrPast) {
        if (plan.status === 'Ödendi') {
          paidVadesiGelmis += planAmt;
          totalVadesiGelmis += planAmt;
        } else {
          totalVadesiGelmis += planAmt;
        }
      }
    });
  });

  const successRateText = totalVadesiGelmis > 0
    ? `%${((paidVadesiGelmis / totalVadesiGelmis) * 100).toFixed(1)}`
    : 'Veri yok';

  const formatCurrency = (val: number) => {
    if (val === 0) return '₺0';
    if (val >= 1000000) return `₺ ${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `₺ ${(val / 1000).toFixed(0)}K`;
    return `₺ ${val.toLocaleString('tr-TR')}`;
  };

  return (
    <div className="space-y-6 select-none pb-12">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 p-5 rounded-3xl border border-white/5 shadow-sm text-left">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">FİNANS & TAHSİLAT MERKEZİ</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">OutdoorCore AI tarafından oluşturulan finansal analizler, tahsilat yönetimi ve nakit akışı merkezi.</p>
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
            onClick={() => alert('Yeni fatura kayıtları CRM entegre olarak "Yeni Satış Sihirbazı" üzerinden oluşturulmaktadır.')}
          >
            Yeni Fatura
          </Button>

          <Button 
            variant="minimal" 
            size="sm" 
            leftIcon={<DownloadCloud size={13} />}
            onClick={() => alert('Detaylı Cari Ekstre (.xlsx) indiriliyor...')}
          >
            Cari Ekstre
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            leftIcon={<FileText size={13} />}
            onClick={() => alert('Mizan ve Gelir Tablosu PDF olarak oluşturuluyor...')}
          >
            PDF Rapor
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

      {/* Upper Financial KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <DarkKpiCard
          title="Toplam Ciro"
          value={loading ? '...' : formatCurrency(totalCiro)}
          percentage="%100"
          subtext="Toplam kiralama hacmi"
          icon={<Coins size={15} />}
          iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/10"
        />
        <DarkKpiCard
          title="Tahsil Edilen"
          value={loading ? '...' : formatCurrency(totalCollected)}
          percentage={successRateText}
          subtext="Banka hesaplarına geçen"
          icon={<CheckCircle size={15} />}
          iconBgColor="bg-emerald-500/10 text-emerald-450 border-emerald-450/10"
          glowColor="green"
        />
        <DarkKpiCard
          title="Tahsilat Bekleyen"
          value={loading ? '...' : formatCurrency(totalPending)}
          percentage="VADEDE"
          subtext="Faturalandırılmış tutar"
          icon={<Clock size={15} />}
          iconBgColor="bg-sky-500/10 text-sky-400 border-sky-500/10"
          glowColor="blue"
        />
        <DarkKpiCard
          title="Vadesi Geçen"
          value={loading ? '...' : formatCurrency(totalOverdue)}
          percentage="ALARM"
          subtext="Gecikmeli ödemeler"
          icon={<SlidersHorizontal size={15} />}
          iconBgColor="bg-rose-500/10 text-rose-450 border-rose-500/10"
          glowColor="red"
        />
        <DarkKpiCard
          title="Toplam Fatura"
          value={loading ? '...' : String(totalInvoicesCount)}
          percentage="ADET"
          subtext="Kesilen fatura adeti"
          icon={<FileSignature size={15} />}
          iconBgColor="bg-purple-500/10 text-purple-400 border-purple-400/10"
          glowColor="purple"
        />
        <DarkKpiCard
          title="Nakit Akışı (Net)"
          value={loading ? '...' : formatCurrency(totalCollected - totalOverdue)}
          percentage="+%12.4"
          subtext="Cari net girdi"
          icon={<TrendingUp size={15} />}
          iconBgColor="bg-sky-500/10 text-sky-455 border-sky-550/10"
          glowColor="blue"
          sparkline={true}
        />
      </div>

      {/* Section 1: AI Finans Özeti */}
      <FinanceSummaryCard accounts={accounts} />

      {/* Grid Layout: Accounts dock, main graphs, detail panel */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#08111f]/40 border border-white/5 rounded-2xl p-6">
          <div className="lg:col-span-3">
            <TableSkeleton />
          </div>
          <div className="lg:col-span-9 space-y-4">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      ) : accounts.length === 0 ? (
        <div className="p-8 text-center bg-[#12192B] border border-white/5 rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,.45)] space-y-4 select-none col-span-12">
          <div className="w-16 h-16 rounded-full bg-slate-900/60 border border-white/5 flex items-center justify-center text-slate-500 mx-auto">
            <Coins size={32} />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Henüz finansal hesap kaydı bulunmuyor.</h4>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Sözleşme imzalandığında bu ekran otomatik dolacaktır.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sol Account list */}
            <div className="order-2 lg:order-none lg:col-span-3">
              <AccountList 
                accounts={financeData?.accounts || []}
                selectedId={selectedAccountId}
                onSelect={(id) => setSelectedAccountId(id)}
              />
            </div>

            {/* Orta Nakit Akışı Area Chart & Donut */}
            <div className="order-1 lg:order-none lg:col-span-5 space-y-6">
              <CashFlowChart />
              <CollectionDonut />
            </div>

            {/* Sağ Account detail panel */}
            <div className="order-3 lg:order-none lg:col-span-4">
              <AccountDetailPanel account={selectedAccount} />
            </div>
          </div>

          {/* Invoices and Upcoming Payments row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <InvoiceTable />
            </div>
            <div className="lg:col-span-4">
              <UpcomingPayments />
            </div>
          </div>
        </>
      )}

      {/* Timelines and Leaderboards row */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <PaymentTimeline accounts={accounts} />
          </div>
          <div className="lg:col-span-4">
            <TopRevenueCompanies />
          </div>
          <div className="lg:col-span-4 font-semibold text-slate-400">
            <RiskCenter />
          </div>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FinancePredictionCard accounts={accounts} />
          <FinanceActivityFeed />
          <QuickFinanceActions />
        </div>
      )}

      {/* Sliding AI Panel Drawer */}
      <AiInsightDrawer 
        isOpen={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
        selectedSpaceCode={selectedAccount.name}
      />
    </div>
  );
}
