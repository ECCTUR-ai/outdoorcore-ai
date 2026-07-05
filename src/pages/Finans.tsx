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
  Layers,
  FileSignature
} from 'lucide-react';
import { financeData, FinancialAccount } from '@/data/finance';
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

export function Finans() {
  const [selectedAccountId, setSelectedAccountId] = useState<string>('CMP-0001');
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const companyId = params.get('companyId');
    const invoiceId = params.get('invoiceId');
    const paymentId = params.get('paymentId');

    if (companyId && financeData.accounts.some(a => a.id === companyId)) {
      setSelectedAccountId(companyId);
    } else if (invoiceId) {
      const found = financeData.accounts.find(a => a.invoices.some(inv => inv.id === invoiceId));
      if (found) {
        setSelectedAccountId(found.id);
      }
    } else if (paymentId) {
      const found = financeData.accounts.find(a => a.collections.some(col => col.id === paymentId));
      if (found) {
        setSelectedAccountId(found.id);
      }
    }
  }, []);

  // Selected account lookup
  const selectedAccount = financeData.accounts.find(a => a.id === selectedAccountId) || financeData.accounts[0];

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
            onClick={() => alert('Yeni Fatura ekleme formu açılacak.')}
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

      {/* Upper Financial KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <DarkKpiCard
          title="Toplam Ciro"
          value="₺684.5M"
          percentage="%100"
          subtext="Toplam kiralama hacmi"
          icon={<Coins size={15} />}
          iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/10"
        />
        <DarkKpiCard
          title="Tahsil Edilen"
          value="₺612.0M"
          percentage="%89.4"
          subtext="Banka hesaplarına geçen"
          icon={<CheckCircle size={15} />}
          iconBgColor="bg-emerald-500/10 text-emerald-450 border-emerald-450/10"
          glowColor="green"
        />
        <DarkKpiCard
          title="Tahsilat Bekleyen"
          value="₺58.0M"
          percentage="VADEDE"
          subtext="Faturalandırılmış tutar"
          icon={<Clock size={15} />}
          iconBgColor="bg-sky-500/10 text-sky-400 border-sky-500/10"
          glowColor="blue"
        />
        <DarkKpiCard
          title="Vadesi Geçen"
          value="₺14.5M"
          percentage="ALARM"
          subtext="Gecikmeli ödemeler"
          icon={<SlidersHorizontal size={15} />}
          iconBgColor="bg-rose-500/10 text-rose-450 border-rose-500/10"
          glowColor="red"
        />
        <DarkKpiCard
          title="Toplam Fatura"
          value="248"
          percentage="+12 bu ay"
          subtext="Kesilen fatura adeti"
          icon={<FileSignature size={15} />}
          iconBgColor="bg-purple-500/10 text-purple-400 border-purple-400/10"
          glowColor="purple"
        />
        <DarkKpiCard
          title="Nakit Akışı (Net)"
          value="₺72.0M"
          percentage="+%12.4"
          subtext="Haziran net girdisi"
          icon={<TrendingUp size={15} />}
          iconBgColor="bg-sky-500/10 text-sky-450 border-sky-500/10"
          glowColor="blue"
          sparkline={true}
        />
      </div>

      {/* Section 1: AI Finans Özeti */}
      <FinanceSummaryCard />

      {/* Grid Layout: Accounts dock, main graphs, detail panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sol Account list */}
        <div className="order-2 lg:order-none lg:col-span-3">
          <AccountList 
            accounts={financeData.accounts}
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

      {/* Timelines and Leaderboards row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <PaymentTimeline />
        </div>
        <div className="lg:col-span-4">
          <TopRevenueCompanies />
        </div>
        <div className="lg:col-span-4">
          <RiskCenter />
        </div>
      </div>

      {/* Predictions and Activities row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <FinancePredictionCard />
        </div>
        <div className="lg:col-span-3">
          <FinanceActivityFeed />
        </div>
        <div className="lg:col-span-3">
          <QuickFinanceActions />
        </div>
      </div>

      {/* Sliding AI Panel Drawer */}
      <AiInsightDrawer 
        isOpen={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
        selectedSpaceCode={selectedAccount.name}
      />
    </div>
  );
}
