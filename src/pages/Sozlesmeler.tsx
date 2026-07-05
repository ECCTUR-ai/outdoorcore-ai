import React, { useState } from 'react';
import { 
  Plus, 
  DownloadCloud, 
  SlidersHorizontal, 
  Sparkles,
  FileSignature,
  Calendar,
  Coins,
  CheckCircle,
  AlertTriangle,
  Layers,
  TrendingUp,
  Clock
} from 'lucide-react';
import { contracts, Contract } from '@/data/contracts';
import { DarkKpiCard } from '@/components/design-system/DarkKpiCard';
import { DarkDashboardCard } from '@/components/design-system/DarkDashboardCard';
import { ContractCard } from '@/components/design-system/ContractCard';
import { ContractList } from '@/components/design-system/ContractList';
import { ContractDetailPanel } from '@/components/design-system/ContractDetailPanel';
import { PaymentSchedule } from '@/components/design-system/PaymentSchedule';
import { RenewalTimeline } from '@/components/design-system/RenewalTimeline';
import { RiskAnalysisCard } from '@/components/design-system/RiskAnalysisCard';
import { AiInsightDrawer } from '@/components/design-system/AiInsightDrawer';
import { Button } from '@/components/design-system/Button';

export function Sozlesmeler() {
  const [selectedContractId, setSelectedContractId] = useState<string>('CON-0001');
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const contractId = params.get('contractId');
    if (contractId && contracts.some(c => c.id === contractId)) {
      setSelectedContractId(contractId);
    }
  }, []);

  // Selected contract lookup
  const selectedContract = contracts.find(c => c.id === selectedContractId) || contracts[0];

  return (
    <div className="space-y-6 select-none pb-12">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 p-5 rounded-3xl border border-white/5 shadow-sm text-left">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">Sözleşme Yönetim Merkezi</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tüm reklam sözleşmelerini, yenilemeleri, ödeme planlarını ve risk durumlarını yönetin.</p>
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
            onClick={() => alert('Yeni sözleşme ekleme mockup formu açılacak.')}
          >
            Yeni Sözleşme
          </Button>

          <Button 
            variant="minimal" 
            size="sm" 
            leftIcon={<DownloadCloud size={13} />}
            onClick={() => alert('PDF Sözleşme Şablon Raporu oluşturuluyor...')}
          >
            PDF Oluştur
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            leftIcon={<SlidersHorizontal size={13} />}
            onClick={() => alert('Sözleşme filtreleme ayarları paneli tetiklendi.')}
          >
            Filtreler
          </Button>
        </div>
      </div>

      {/* Upper Pipeline KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <DarkKpiCard
          title="Aktif Sözleşme"
          value="186"
          percentage="%100"
          subtext="Yayında olanlar"
          icon={<FileSignature size={15} />}
          iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/10"
        />
        <DarkKpiCard
          title="Bu Ay Bitecek"
          value="14"
          percentage="KRİTİK"
          subtext="Opsiyon yenilemeleri"
          icon={<Clock size={15} />}
          iconBgColor="bg-rose-500/10 text-rose-450 border-rose-500/10"
          glowColor="red"
        />
        <DarkKpiCard
          title="Yenileme Bekleyen"
          value="22"
          percentage="+4 talep"
          subtext="Müzakere sürecinde"
          icon={<Layers size={15} />}
          iconBgColor="bg-amber-500/10 text-amber-400 border-amber-500/10"
          glowColor="yellow"
        />
        <DarkKpiCard
          title="İmza Bekleyen"
          value="8"
          percentage="HUKUKTA"
          subtext="Hukuk departmanında"
          icon={<CheckCircle size={15} />}
          iconBgColor="bg-purple-500/10 text-purple-400 border-purple-500/10"
          glowColor="purple"
        />
        <DarkKpiCard
          title="Toplam Tutar"
          value="₺684.5M"
          percentage="%100"
          subtext="Toplam kiralama hacmi"
          icon={<Coins size={15} />}
          iconBgColor="bg-sky-500/10 text-sky-400 border-sky-500/10"
          glowColor="blue"
        />
        <DarkKpiCard
          title="Riskli Sözleşme"
          value="5"
          percentage="ALARM"
          subtext="Tahsilat / yenileme"
          icon={<AlertTriangle size={15} />}
          iconBgColor="bg-rose-500/10 text-rose-450 border-rose-500/10"
          glowColor="red"
          sparkline={true}
        />
      </div>

      {/* Main split grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. Sol: Filter & Company list */}
        <div className="order-2 lg:order-none lg:col-span-3">
          <ContractList 
            contracts={contracts}
            selectedId={selectedContractId}
            onSelect={(id) => setSelectedContractId(id)}
          />
        </div>

        {/* 2. Orta: Catalog Cards listing */}
        <div className="order-1 lg:order-none lg:col-span-5 space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sözleşme Kartları Portalı</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contracts.map(ct => (
              <ContractCard 
                key={ct.id} 
                contract={ct} 
                isActive={selectedContractId === ct.id}
                onClick={() => setSelectedContractId(ct.id)}
              />
            ))}
          </div>
        </div>

        {/* 3. Sağ: Sticky detail panel */}
        <div className="order-3 lg:order-none lg:col-span-4">
          <ContractDetailPanel 
            contract={selectedContract}
          />
        </div>
      </div>

      {/* Bottom widgets row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PaymentSchedule />
        <RenewalTimeline />
        <RiskAnalysisCard />
      </div>

      {/* Sliding AI Panel Drawer */}
      <AiInsightDrawer 
        isOpen={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
        selectedSpaceCode={selectedContract.clientName}
      />
    </div>
  );
}
