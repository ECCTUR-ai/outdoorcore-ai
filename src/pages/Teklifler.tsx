import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  DownloadCloud, 
  SlidersHorizontal, 
  Sparkles,
  Layers,
  Coins,
  CheckCircle,
  Clock,
  CheckCheck,
  Percent
} from 'lucide-react';
import { Offer } from '@/data/offers';
import { offerRepository } from '@/repositories';
import { createWorkflowEvent } from '@/automation/workflowEvents';
import { workflowEngine } from '@/automation/workflowEngine';
import { DarkKpiCard } from '@/components/design-system/DarkKpiCard';
import { OfferPipeline } from '@/components/design-system/OfferPipeline';
import { OfferDetailPanel } from '@/components/design-system/OfferDetailPanel';
import { OfferActivityFeed } from '@/components/design-system/OfferActivityFeed';
import { OfferTaskList } from '@/components/design-system/OfferTaskList';
import { OfferAiInsights } from '@/components/design-system/OfferAiInsights';
import { AiInsightDrawer } from '@/components/design-system/AiInsightDrawer';
import { Button } from '@/components/design-system/Button';
import { PermissionGate } from '@/components/design-system/PermissionGate';
import { OfferModal } from '@/components/design-system/OfferModal';
import { TableSkeleton } from '@/components/design-system/Skeleton';
import { Notification } from '@/components/design-system/Notification';

export function Teklifler() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOfferId, setSelectedOfferId] = useState<string>('');
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  // CRUD Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | undefined>(undefined);

  const fetchOffers = async (selectFirst = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await offerRepository.list();
      setOffers(data);
      if (data.length > 0) {
        if (selectFirst || !selectedOfferId || !data.some(o => o.id === selectedOfferId)) {
          setSelectedOfferId(data[0].id);
        }
      } else {
        setSelectedOfferId('');
      }
    } catch (e: any) {
      console.error(e);
      setError('Veriler yüklenirken bir bağlantı hatası oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers(true);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const offerId = params.get('offerId');
    if (offerId && offers.some(o => o.id === offerId)) {
      setSelectedOfferId(offerId);
    }
  }, [offers]);

  // Selected offer lookup
  const selectedOffer = offers.find(o => o.id === selectedOfferId) || offers[0];

  const handleCreate = () => {
    setEditingOffer(undefined);
    setModalOpen(true);
  };

  const handleEdit = (off: Offer) => {
    setEditingOffer(off);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu teklifi silmek istediğinize emin misiniz?')) {
      const success = await offerRepository.softDelete(id);
      if (success) {
        fetchOffers(true);
      }
    }
  };

  const handleStageChange = async (id: string, newStage: Offer['stage'], approved = false) => {
    try {
      const original = offers.find(o => o.id === id);
      const isOfferApprovedTransition = original && original.stage === 'Onay Bekleniyor' && newStage === 'Sözleşme';
      
      await offerRepository.update(id, { stage: newStage, approved: approved || isOfferApprovedTransition });
      fetchOffers(false);

      if (isOfferApprovedTransition) {
        const event = createWorkflowEvent('offer.approved', 'offer', id, {
          clientName: original.clientName,
          campaignName: original.campaignName,
          companyId: original.companyId
        });
        workflowEngine.dispatchWorkflowEvent(event);
      }
    } catch (e: any) {
      alert(e.message || 'Aşama değiştirilirken hata oluştu.');
    }
  };

  // Pipeline total value calculation
  const totalValue = offers.reduce((acc, curr) => acc + curr.valueNumeric, 0);
  const formattedTotalValue = totalValue >= 1000000 
    ? `₺${(totalValue / 1000000).toFixed(1)}M` 
    : `₺${(totalValue / 1000).toFixed(0)}K`;

  return (
    <div className="space-y-6 select-none pb-12">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 p-5 rounded-3xl border border-white/5 shadow-sm text-left">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">Teklifler ve Satış Pipeline</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Reklam satış fırsatlarını, teklif süreçlerini ve müşteri görüşmelerini yönetin.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* OutdoorCore AI Spark Button */}
          <Button 
            variant="primary" 
            size="sm" 
            leftIcon={<Sparkles size={13} className="animate-pulse" />}
            className="bg-gradient-to-r from-blue-650 to-indigo-650 hover:from-blue-600 hover:to-indigo-600 text-white font-black"
            onClick={() => setAiDrawerOpen(true)}
          >
            OutdoorCore AI
          </Button>

          <PermissionGate permission="offers.create">
            <Button 
              variant="outline" 
              size="sm" 
              leftIcon={<Plus size={13} />}
              onClick={handleCreate}
            >
              Yeni Teklif
            </Button>
          </PermissionGate>

          <Button 
            variant="minimal" 
            size="sm" 
            leftIcon={<DownloadCloud size={13} />}
            onClick={() => alert('Satış Pipeline Raporu (.pdf) indiriliyor...')}
          >
            Pipeline Raporu
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            leftIcon={<SlidersHorizontal size={13} />}
            onClick={() => alert('Pipeline filtreleri paneli tetiklendi.')}
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

      {/* bit */}
      {/* Upper Pipeline KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <DarkKpiCard
          title="Toplam Fırsat"
          value={loading ? '...' : String(offers.length)}
          percentage="%100"
          subtext="Aktif satış takibi"
          icon={<Layers size={15} />}
          iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/10"
        />
        <DarkKpiCard
          title="Pipeline Değeri"
          value={loading ? '...' : formattedTotalValue}
          percentage="₺15.6M bu ay"
          subtext="Toplam fırsat hacmi"
          icon={<Coins size={15} />}
          iconBgColor="bg-emerald-500/10 text-emerald-400 border-emerald-500/10"
          glowColor="green"
        />
        <DarkKpiCard
          title="Bu Ay Teklif"
          value="32"
          percentage="+6 artış"
          subtext="Gönderilen teklifler"
          icon={<Clock size={15} />}
          iconBgColor="bg-amber-500/10 text-amber-400 border-amber-500/10"
          glowColor="yellow"
        />
        <DarkKpiCard
          title="Onay Bekleyen"
          value={loading ? '...' : String(offers.filter(o => o.stage === 'Onay Bekleniyor').length)}
          percentage="KRİTİK"
          subtext="Müşteri onayında"
          icon={<CheckCircle size={15} />}
          iconBgColor="bg-purple-500/10 text-purple-400 border-purple-500/10"
          glowColor="purple"
        />
        <DarkKpiCard
          title="Kazanılan"
          value={loading ? '...' : String(offers.filter(o => o.stage === 'Tamamlandı' || o.stage === 'Sözleşme').length)}
          percentage="+4 yeni"
          subtext="Sözleşmeye dönen"
          icon={<CheckCheck size={15} />}
          iconBgColor="bg-sky-500/10 text-sky-400 border-sky-500/10"
          glowColor="blue"
        />
        <DarkKpiCard
          title="Kapanma Oranı"
          value="%42.6"
          percentage="+%2.4 artış"
          subtext="Satış verimliliği"
          icon={<Percent size={15} />}
          iconBgColor="bg-rose-500/10 text-rose-400 border-rose-500/10"
          glowColor="red"
          sparkline={true}
        />
      </div>

      {/* Main Kanban Pipeline workspace grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sol 9-Sütun: Kanban board scroll tracking + Bottom widget cards */}
        <div className="order-1 lg:order-none lg:col-span-9 space-y-6 flex flex-col">
          {/* Section 1: Horizontal scrollable Kanban pipeline */}
          <div className="w-full">
            {loading ? (
              <div className="py-4 bg-[#08111f]/40 border border-white/5 rounded-2xl p-6">
                <TableSkeleton />
              </div>
            ) : (
              <>
                <OfferPipeline 
                  offers={offers}
                  selectedId={selectedOfferId}
                  onSelect={(id) => setSelectedOfferId(id)}
                />
                {offers.length === 0 && (
                  <div className="text-center text-slate-500 text-xs font-bold uppercase tracking-wider py-12 border border-dashed border-white/5 rounded-3xl bg-slate-900/10">
                    Hiç Teklif Bulunmamaktadır
                  </div>
                )}
              </>
            )}
          </div>

          {/* Section 2: Bottom activity tracking dashboards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <OfferActivityFeed />
            <OfferTaskList />
            <OfferAiInsights />
          </div>
        </div>

        {/* Sağ 3-Sütun: Sticky details panel */}
        <div className="order-2 lg:order-none lg:col-span-3">
          {selectedOffer && (
            <OfferDetailPanel 
              offer={selectedOffer}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStageChange={handleStageChange}
            />
          )}
        </div>
      </div>

      {/* Offer CRUD Modal */}
      <OfferModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        offer={editingOffer}
        onSuccess={() => fetchOffers(false)}
      />

      {/* Slide-over AI CRM overlay */}
      {selectedOffer && (
        <AiInsightDrawer 
          isOpen={aiDrawerOpen}
          onClose={() => setAiDrawerOpen(false)}
          selectedSpaceCode={selectedOffer.clientName}
        />
      )}
    </div>
  );
}
