import React, { useState, useEffect } from 'react';
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
  Clock
} from 'lucide-react';
import { Contract } from '@/data/contracts';
import { contractRepository } from '@/repositories';
import { DarkKpiCard } from '@/components/design-system/DarkKpiCard';
import { ContractCard } from '@/components/design-system/ContractCard';
import { ContractList } from '@/components/design-system/ContractList';
import { ContractDetailPanel } from '@/components/design-system/ContractDetailPanel';
import { PaymentSchedule } from '@/components/design-system/PaymentSchedule';
import { RenewalTimeline } from '@/components/design-system/RenewalTimeline';
import { RiskAnalysisCard } from '@/components/design-system/RiskAnalysisCard';
import { AiInsightDrawer } from '@/components/design-system/AiInsightDrawer';
import { Button } from '@/components/design-system/Button';
import { useApp } from '@/context/AppContext';
import { TableSkeleton, CardSkeleton } from '@/components/design-system/Skeleton';
import { Notification } from '@/components/design-system/Notification';

export function Sozlesmeler() {
  const { setCurrentRoute } = useApp();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContractId, setSelectedContractId] = useState<string>('');
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  const fetchContracts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contractRepository.getAll();
      setContracts(data);
      if (data.length > 0) {
        // If there's already a selected ID that still exists, keep it; otherwise choose the first one
        setSelectedContractId((prev) => {
          if (prev && data.some(c => c.id === prev)) {
            return prev;
          }
          return data[0].id;
        });
      } else {
        setSelectedContractId('');
      }
    } catch (e: any) {
      console.error(e);
      setError('Veriler yüklenirken bir bağlantı hatası oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const contractId = params.get('contractId');
    if (contractId && contracts.some(c => c.id === contractId)) {
      setSelectedContractId(contractId);
    }
  }, [contracts]);

  const handleDeleteContract = async (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (confirm('Bu sözleşmeyi silmek istediğinizden emin misiniz?')) {
      try {
        await contractRepository.delete(id);
        const updated = await contractRepository.getAll();
        setContracts(updated);
        
        // If selected contract was deleted, select next best fallback
        if (selectedContractId === id) {
          if (updated.length > 0) {
            setSelectedContractId(updated[0].id);
          } else {
            setSelectedContractId('');
          }
        }
      } catch (err) {
        console.error('Sözleşme silinirken hata oluştu:', err);
        alert('Sözleşme silinirken bir hata oluştu.');
      }
    }
  };

  // Real KPI Calculations based on contracts data
  const activeContracts = contracts.filter(c => 
    c.status === 'active' || c.status === 'signed' || c.status === 'Aktif'
  );

  const mockToday = new Date(2025, 5, 15); // 15 Haziran 2025
  const willExpireThisMonth = activeContracts.filter(c => {
    if (!c.endDate) return false;
    const parts = c.endDate.split('.');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
      return d.getFullYear() === mockToday.getFullYear() && d.getMonth() === mockToday.getMonth();
    }
    return false;
  });

  const renewalPending = contracts.filter(c => 
    c.status === 'Yenileme Bekleyen' || c.status === 'pending'
  );

  const signaturePending = contracts.filter(c => 
    c.status === 'pending' || c.status === 'draft' || c.status === 'İmza Bekleyen' || c.status === 'Taslak'
  );

  const sumTotalValue = activeContracts.reduce((acc, c) => {
    const val = c.valueNumeric || 0;
    return acc + (val > 0 ? val : 0);
  }, 0);

  const riskyContracts = activeContracts.filter(c => 
    (c.aiRiskScore && c.aiRiskScore >= 7) || 
    (c.aiRiskAnalysis && c.aiRiskAnalysis.length > 0)
  );

  const formatCurrency = (num: number): string => {
    if (num === 0) return '₺0';
    if (num >= 1000000) {
      return `₺${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `₺${(num / 1000).toFixed(1)}K`;
    }
    return `₺${num}`;
  };

  // Debug Console Parameters
  const loadedContractsCount = contracts.length;
  const activeContractsCount = activeContracts.length;
  const cancelledContractsCount = contracts.filter(c => c.status === 'cancelled' || c.status === 'İptal').length;
  const orphanContractsCount = contracts.filter(c => !c.proposalId || !c.reservationId || c.proposalId === 'Bulunamadı' || c.reservationId === 'Bulunamadı').length;
  const totalContractValue = sumTotalValue;
  const riskyContractsCount = riskyContracts.length;

  useEffect(() => {
    if (!loading) {
      console.log('--- CONTRACT DEBUG METRICS ---');
      console.log('loadedContractsCount:', loadedContractsCount);
      console.log('activeContractsCount:', activeContractsCount);
      console.log('cancelledContractsCount:', cancelledContractsCount);
      console.log('orphanContractsCount:', orphanContractsCount);
      console.log('totalContractValue:', totalContractValue);
      console.log('riskyContractsCount:', riskyContractsCount);
      console.log('------------------------------');
    }
  }, [loading, loadedContractsCount, activeContractsCount, cancelledContractsCount, orphanContractsCount, totalContractValue, riskyContractsCount]);

  // Selected contract lookup
  const selectedContract = contracts.find(c => c.id === selectedContractId) || contracts[0] || {
    id: '',
    contractNo: '',
    clientName: 'Sözleşme Seçi̇lmedi̇',
    status: 'draft',
    value: '₺0',
    startDate: '',
    endDate: '',
    notes: [],
    installments: [],
    spacesList: [],
    filesList: [],
    history: [],
    aiRiskAnalysis: []
  };

  return (
    <div className="space-y-6 select-none pb-12">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 p-5 rounded-3xl border border-white/5 shadow-sm text-left">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">Sözleşme Yönetim Merkezi</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tüm reklam sözleşmelerini, yenilemeleri, ödeme planlarını ve risk durumlarını yönetin.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
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
              if (confirm('Yeni sözleşmeler CRM entegre olarak "Yeni Satış Sihirbazı" üzerinden oluşturulur. Sihirbaza gitmek istiyor musunuz?')) {
                setCurrentRoute('sales-wizard');
              }
            }}
          >
            Sihirbazla Sözleşme Ekle
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
          title="Aktif Sözleşme"
          value={loading ? '...' : String(activeContractsCount)}
          percentage="%100"
          subtext="Yayında olanlar"
          icon={<FileSignature size={15} />}
          iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/10"
        />
        <DarkKpiCard
          title="Bu Ay Bitecek"
          value={loading ? '...' : String(willExpireThisMonth.length)}
          percentage="KRİTİK"
          subtext="Opsiyon yenilemeleri"
          icon={<Clock size={15} />}
          iconBgColor="bg-rose-500/10 text-rose-450 border-rose-500/10"
          glowColor="red"
        />
        <DarkKpiCard
          title="Yenileme Bekleyen"
          value={loading ? '...' : String(renewalPending.length)}
          percentage="TAKİPTE"
          subtext="Müzakere sürecinde"
          icon={<Layers size={15} />}
          iconBgColor="bg-amber-500/10 text-amber-400 border-amber-500/10"
          glowColor="yellow"
        />
        <DarkKpiCard
          title="İmza Bekleyen"
          value={loading ? '...' : String(signaturePending.length)}
          percentage="HUKUKTA"
          subtext="Hukuk departmanında"
          icon={<CheckCircle size={15} />}
          iconBgColor="bg-purple-500/10 text-purple-400 border-purple-500/10"
          glowColor="purple"
        />
        <DarkKpiCard
          title="Toplam Tutar"
          value={loading ? '...' : formatCurrency(totalContractValue)}
          percentage="AKTİF"
          subtext="Toplam kiralama hacmi"
          icon={<Coins size={15} />}
          iconBgColor="bg-sky-500/10 text-sky-400 border-sky-500/10"
          glowColor="blue"
        />
        <DarkKpiCard
          title="Riskli Sözleşme"
          value={loading ? '...' : String(riskyContractsCount)}
          percentage="ALARM"
          subtext="Tahsilat / yenileme"
          icon={<AlertTriangle size={15} />}
          iconBgColor="bg-rose-500/10 text-rose-455 border-rose-500/10"
          glowColor="red"
          sparkline={true}
        />
      </div>

      {/* Main split grid layout */}
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
                  onDelete={handleDeleteContract}
                />
              ))}
              {contracts.length === 0 && (
                <div className="col-span-full py-12 text-center bg-white/3 border border-white/5 rounded-2xl select-none">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Kayıtlı Sözleşme Bulunmuyor</span>
                  <p className="text-[9px] text-slate-600 font-bold">Yeni bir teklif onaylandığında otomatik olarak sözleşme kaydı oluşacaktır.</p>
                </div>
              )}
            </div>
          </div>

          {/* 3. Sağ: Sticky detail panel */}
          <div className="order-3 lg:order-none lg:col-span-4">
            {selectedContractId ? (
              <ContractDetailPanel 
                contract={selectedContract}
                onDelete={(id) => handleDeleteContract(id)}
              />
            ) : (
              <div className="dark-glass-card border border-white/5 rounded-2xl p-8 text-center text-slate-500 font-bold italic select-none">
                Detayları görüntülemek için soldan bir sözleşme seçin.
              </div>
            )}
          </div>
        </div>
      )}

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
