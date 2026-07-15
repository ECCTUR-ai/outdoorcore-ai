import React, { useState, useEffect } from 'react';
import { 
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
import { Notification } from '@/components/design-system/Notification';
import { offerRepository, activityLogRepository, contractRepository, reservationRepository, campaignRepository, spaceRepository } from '@/repositories';
import { parseAnyDate } from '@/utils/dateHelper';
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
import { ToastContainer, ToastItem } from '@/components/ui/Toast';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export function PipelinePage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOfferId, setSelectedOfferId] = useState<string>('');
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<'sendApproval' | 'approve' | 'revise' | 'cancel' | 'delete' | 'save' | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<string | null>(null);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [offerToCancel, setOfferToCancel] = useState<string | null>(null);
  const [signConfirmOpen, setSignConfirmOpen] = useState(false);
  const [offerToSign, setOfferToSign] = useState<string | null>(null);

  // CRUD Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | undefined>(undefined);

  const showToast = (title: string, description: string, type: ToastItem['type']) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, description, type }]);
  };

  const handleRemoveToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

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

  const selectedOffer = offers.find(o => o.id === selectedOfferId) || offers[0];

  const handleEdit = (off: Offer) => {
    setEditingOffer(off);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setOfferToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!offerToDelete) return;
    setActionLoading('delete');
    
    const originalOffers = [...offers];
    setOffers(prev => prev.filter(o => o.id !== offerToDelete));
    if (selectedOfferId === offerToDelete) {
      setSelectedOfferId('');
    }

    try {
      const success = await offerRepository.softDelete(offerToDelete);
      if (success) {
        showToast("Teklif Silindi", "Teklif başarıyla silindi.", "success");
        fetchOffers(true);
      } else {
        throw new Error("Sistem teklifi silemedi.");
      }
    } catch (e: any) {
      setOffers(originalOffers);
      showToast("Hata", e.message || "Teklif silinirken bir hata oluştu.", "error");
    } finally {
      setActionLoading(null);
      setDeleteConfirmOpen(false);
      setOfferToDelete(null);
    }
  };

  const handleStageChange = async (id: string, newStage: Offer['stage'], approved = false) => {
    if (newStage === 'İptal' && !approved) {
      setOfferToCancel(id);
      setCancelConfirmOpen(true);
      return;
    }
    if (newStage === 'Sözleşme İmzalandı' && !approved) {
      setOfferToSign(id);
      setSignConfirmOpen(true);
      return;
    }
    await executeStageChange(id, newStage, approved);
  };

  const handleCancelConfirm = async () => {
    if (!offerToCancel) return;
    setCancelConfirmOpen(false);
    await executeStageChange(offerToCancel, 'İptal', true);
    setOfferToCancel(null);
  };

  const handleSignConfirm = async () => {
    if (!offerToSign) return;
    setSignConfirmOpen(false);
    await executeStageChange(offerToSign, 'Sözleşme İmzalandı', true);
    setOfferToSign(null);
  };

  const executeStageChange = async (id: string, newStage: Offer['stage'], approved = false) => {
    const original = offers.find(o => o.id === id);
    if (!original) return;

    let loadingKey: typeof actionLoading = null;
    if (newStage === 'Teklif Gönderildi') loadingKey = 'sendApproval';
    else if (newStage === 'Sözleşme İmzalandı') loadingKey = 'approve';
    else if (newStage === 'Rezerve') loadingKey = 'revise';
    else if (newStage === 'İptal') loadingKey = 'cancel';

    setActionLoading(loadingKey);

    try {
      if (newStage === 'Sözleşme İmzalandı') {
        const startDate = original.campaignStartDate || original.closingDate || new Date().toISOString().split('T')[0];
        const endDate = original.campaignEndDate || original.closingDate || new Date().toISOString().split('T')[0];
        
        const diffTime = Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

        const contract = await contractRepository.create({
          contractNo: 'CON-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
          companyId: original.companyId || 'CMP-0001',
          clientName: original.clientName,
          campaignName: original.campaignName,
          status: 'signed',
          valueNumeric: original.valueNumeric,
          startDate: startDate,
          endDate: endDate,
          spacesList: original.spacesList,
          progress: 100
        });

        const reservationIds: string[] = [];
        const allSpaces = spaceRepository.getAllSync();
        const selectedSpaces = (original.spaceIds || []).map(sId => allSpaces.find(s => s.id === sId)).filter(Boolean) as any[];

        if (selectedSpaces.length === 0) {
          throw new Error("Teklifte seçilmiş herhangi bir reklam alanı bulunmamaktadır.");
        }

        for (const space of selectedSpaces) {
          const resPayload = {
            spaceId: space.id,
            spaceCode: space.code,
            spaceName: space.name,
            location: space.location || 'İstanbul',
            clientName: original.clientName,
            startDate: startDate,
            endDate: endDate,
            durationDays: diffDays,
            status: 'REZERVE',
            contractStatus: 'SIGNED',
            salesApprovalStatus: 'APPROVED' as const,
            budget: `₺ ${(space.price || '0').replace(/[^0-9]/g, '')}`,
            companyId: original.companyId || 'CMP-0001',
            offerId: original.id,
            contractId: contract.id
          };
          const rObj = await reservationRepository.create(resPayload);
          if (!rObj || !rObj.id) {
            throw new Error("Rezervasyon kaydı oluşturulamadı.");
          }
          reservationIds.push(rObj.id);
        }

        if (original.spaceIds) {
          for (const sId of original.spaceIds) {
            try {
              await spaceRepository.update(sId, { status: 'dolu' });
            } catch (se) {
              console.warn("Space update error", se);
            }
          }
        }

        await offerRepository.update(id, {
          stage: newStage,
          approved: approved,
          contractId: contract.id,
          reservationId: reservationIds[0]
        });

        showToast("Sözleşme İmzalandı", "Sözleşme imzalandı. Rezervasyonlar oluşturuldu.", "success");
      } else {
        if (newStage === 'İptal') {
          await offerRepository.update(id, { stage: 'İptal' });
          const reservationsList = await reservationRepository.getAll();
          const relatedReservations = reservationsList.filter((r: any) => r.offerId === id || r.contractId === original.contractId);
          for (const res of relatedReservations) {
            await reservationRepository.update(res.id, { status: 'İptal' });
          }

          const campaigns = await campaignRepository.getAll();
          const relatedCampaigns = campaigns.filter((c: any) => c.offerId === id || c.contractId === original.contractId || c.id === original.campaignId);
          for (const camp of relatedCampaigns) {
            await campaignRepository.update(camp.id, { status: 'İptal' });
          }

          if (original.contractId) {
            await contractRepository.update(original.contractId, { status: 'cancelled' });
          }

          if (original.spaceIds) {
            for (const sId of original.spaceIds) {
              await spaceRepository.update(sId, { status: 'bos' });
            }
          }

          window.dispatchEvent(new Event('offers_updated'));
          window.dispatchEvent(new Event('reservations_updated'));
          window.dispatchEvent(new Event('campaigns_updated'));
          window.dispatchEvent(new Event('spaces_updated'));
        } else {
          await offerRepository.update(id, { stage: newStage, approved: approved });
        }
        showToast("Aşama Güncellendi", `Teklif aşaması "${newStage}" olarak güncellendi.`, "success");
      }

      await activityLogRepository.log(`Teklif aşaması güncellendi: ${original.clientName} - ${newStage}`, 'offers');
      fetchOffers(false);
    } catch (e: any) {
      console.error(e);
      showToast("Hata", e.message || "Aşama güncellenirken hata oluştu.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const totalValue = offers.reduce((acc, curr) => acc + curr.valueNumeric, 0);
  const formattedTotalValue = totalValue === 0 
    ? '₺0' 
    : totalValue >= 1000000 
      ? `₺${(totalValue / 1000000).toFixed(1)}M` 
      : `₺${(totalValue / 1000).toFixed(0)}K`;

  return (
    <div className="space-y-6 select-none pb-12">
      {success && (
        <Notification
          title="Başarılı"
          description={success}
          type="success"
          onClose={() => setSuccess(null)}
        />
      )}

      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 p-5 rounded-3xl border border-white/5 shadow-sm text-left">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">Satış Pipeline</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Kanban panosu üzerinden satış aşamalarını ve rezerve fırsatları izleyin.</p>
        </div>
        <div className="flex items-center gap-2">
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
            onClick={() => alert('Filtreler tetiklendi.')}
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DarkKpiCard
          title="Toplam Fırsat"
          value={loading ? '...' : String(offers.length)}
          percentage="—"
          subtext="Aktif teklifler"
          icon={<Layers size={15} />}
          iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/10"
        />
        <DarkKpiCard
          title="Pipeline Değeri"
          value={loading ? '...' : formattedTotalValue}
          percentage="—"
          subtext="Toplam fırsat hacmi"
          icon={<Coins size={15} />}
          iconBgColor="bg-emerald-500/10 text-emerald-400 border-emerald-500/10"
          glowColor="green"
        />
        <DarkKpiCard
          title="Rezerve Fırsatlar"
          value={loading ? '...' : String(offers.filter(o => o.stage === 'Rezerve').length)}
          percentage="—"
          subtext="Kilitli kapasite fırsatları"
          icon={<Clock size={15} />}
          iconBgColor="bg-amber-500/10 text-amber-400 border-amber-500/10"
          glowColor="yellow"
        />
        <DarkKpiCard
          title="Kazanılan (İmzalı)"
          value={loading ? '...' : String(offers.filter(o => o.stage === 'Sözleşme İmzalandı' || o.stage === 'Yayında').length)}
          percentage="—"
          subtext="Satışa dönen fırsatlar"
          icon={<CheckCheck size={15} />}
          iconBgColor="bg-sky-500/10 text-sky-400 border-sky-500/10"
          glowColor="blue"
        />
      </div>

      {/* Pipeline Kanban Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9 flex flex-col space-y-6">
          <div className="w-full">
            {loading ? (
              <div className="py-4 bg-[#08111f]/40 border border-white/5 rounded-2xl p-6">
                <TableSkeleton />
              </div>
            ) : (
              <OfferPipeline 
                offers={offers}
                selectedId={selectedOfferId}
                onSelect={(id) => setSelectedOfferId(id)}
              />
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <OfferActivityFeed />
            <OfferTaskList />
            <OfferAiInsights />
          </div>
        </div>

        <div className="lg:col-span-3">
          {selectedOffer && (
            <OfferDetailPanel 
              offer={selectedOffer}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStageChange={handleStageChange}
              actionLoading={actionLoading}
            />
          )}
        </div>
      </div>

      <OfferModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        offer={editingOffer}
        onSuccess={() => fetchOffers(false)}
      />

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Teklifi silmek istiyor musunuz?"
        description="Bu teklif kalıcı olarak silinecek."
        confirmLabel="Sil"
        cancelLabel="Vazgeç"
      />

      <ConfirmDialog
        isOpen={cancelConfirmOpen}
        onClose={() => setCancelConfirmOpen(false)}
        onConfirm={handleCancelConfirm}
        title="Teklifi iptal etmek istiyor musunuz?"
        description="Bu teklif iptal edilecek."
        confirmLabel="İptal Et"
        cancelLabel="Vazgeç"
      />

      <ConfirmDialog
        isOpen={signConfirmOpen}
        onClose={() => setSignConfirmOpen(false)}
        onConfirm={handleSignConfirm}
        title="Sözleşmeyi imzala?"
        description="Sözleşme imzalanacak ve kesin rezervasyonlar oluşturulacak."
        confirmLabel="İmzala"
        cancelLabel="Vazgeç"
      />

      <ToastContainer toasts={toasts} onRemove={handleRemoveToast} />
    </div>
  );
}
