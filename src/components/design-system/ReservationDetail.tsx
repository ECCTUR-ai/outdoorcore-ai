import React, { useState, useEffect } from 'react';
import { Reservation } from '@/data/reservations';
import { Badge } from './Badge';
import { Label } from './Form';
import { Button } from './Button';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Clock, 
  Coins, 
  Paperclip, 
  Sparkles, 
  FileText,
  FileEdit,
  FolderOpen,
  CheckCircle,
  XCircle,
  RefreshCw,
  CalendarCheck,
  AlertTriangle,
  History,
  ShieldAlert
} from 'lucide-react';
import { EntityLink } from './EntityLink';
import { useAuth } from '@/auth/useAuth';
import { 
  reservationRepository, 
  reservationAuditRepository, 
  contractRepository, 
  campaignRepository, 
  financeRepository,
  spaceRepository
} from '@/repositories';
import { createWorkflowEvent } from '@/automation/workflowEvents';
import { workflowEngine } from '@/automation/workflowEngine';

interface ReservationDetailProps {
  reservation: Reservation;
}

export function ReservationDetail({ reservation }: ReservationDetailProps) {
  const { currentUser } = useAuth();
  
  // Local state to re-trigger lists
  const [logs, setLogs] = useState(() => reservationAuditRepository.getLogs().filter(l => l.reservationId === reservation.id));
  
  // Prompt states
  const [rejectReason, setRejectReason] = useState('');
  const [rejectOpen, setRejectOpen] = useState(false);
  const [releaseSpacesOnReject, setReleaseSpacesOnReject] = useState(true);

  const [revisionNote, setRevisionNote] = useState('');
  const [revisionOpen, setRevisionOpen] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    setLogs(reservationAuditRepository.getLogs().filter(l => l.reservationId === reservation.id));
  }, [reservation.id]);

  const handleRefresh = () => {
    window.location.reload();
  };

  // Stepper Calculation
  const isOptioned = ['OPTIONED', 'CONTRACT_PENDING', 'SALES_APPROVAL_PENDING', 'CONFIRMED'].includes(reservation.status);
  const isSigned = reservation.contractStatus === 'SIGNED' || ['SALES_APPROVAL_PENDING', 'CONFIRMED'].includes(reservation.status);
  const isApproved = reservation.salesApprovalStatus === 'APPROVED' || reservation.status === 'CONFIRMED';
  const isConfirmed = reservation.status === 'CONFIRMED';

  const steps = [
    { label: 'Opsiyon Oluşturuldu', done: isOptioned },
    { label: 'Sözleşme İmzalandı', done: isSigned },
    { label: 'Satış Departmanı Onayı', done: isApproved },
    { label: 'Confirme Edildi (Hard Lock)', done: isConfirmed }
  ];

  // Role Checks
  const userRole = currentUser?.role || 'Super Admin';
  const isSalesDept = userRole === 'Sales Director' || userRole === 'Super Admin' || userRole === 'CEO';
  const isSalesManager = userRole === 'Sales Director' || userRole === 'Super Admin';

  // Option Expiry calculation
  const getOptionHoursLeft = () => {
    if (!reservation.optionExpiresAt) return null;
    const diff = new Date(reservation.optionExpiresAt).getTime() - new Date().getTime();
    if (diff <= 0) return 'Süresi Doldu';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}s ${mins}dk`;
  };

  // Actions handlers
  const handleExtendOption = async () => {
    const hours = prompt('Opsiyon süresini kaç saat uzatmak istersiniz?', '24');
    if (!hours) return;
    const hoursNum = parseInt(hours, 10);
    if (isNaN(hoursNum) || hoursNum <= 0) {
      alert('Geçerli bir saat giriniz.');
      return;
    }

    const currentExpire = reservation.optionExpiresAt ? new Date(reservation.optionExpiresAt) : new Date();
    currentExpire.setHours(currentExpire.getHours() + hoursNum);
    
    await reservationRepository.update(reservation.id, {
      optionExpiresAt: currentExpire.toISOString(),
      optionExtendedBy: currentUser?.email || 'admin@outdoorcore.ai',
      optionExtendedAt: new Date().toISOString(),
      optionExtensionCount: (reservation.optionExtensionCount || 0) + 1,
      auditLogDescription: `Opsiyon süresi ${hoursNum} saat uzatıldı. Yeni Bitiş: ${currentExpire.toLocaleString('tr-TR')}`
    });

    alert('Opsiyon süresi başarıyla uzatıldı!');
    handleRefresh();
  };

  const handleCancelReservation = async () => {
    if (!confirm('Bu rezervasyonu iptal etmek istediğinize emin misiniz? Tutulan kapasiteler serbest kalacaktır.')) return;
    
    await reservationRepository.update(reservation.id, {
      status: 'CANCELLED',
      contractStatus: 'CANCELLED',
      salesApprovalStatus: 'REJECTED',
      auditLogDescription: 'Rezervasyon kullanıcı tarafından iptal edildi.'
    });

    // Release spaces
    if (reservation.spaceId) {
      await spaceRepository.update(reservation.spaceId, { status: 'bos' });
    }

    alert('Rezervasyon iptal edildi.');
    handleRefresh();
  };

  const handleRequestSalesApproval = async () => {
    await reservationRepository.update(reservation.id, {
      status: 'SALES_APPROVAL_PENDING',
      auditLogDescription: 'Rezervasyon el ile Satış Onayı Sürecine gönderildi.'
    });
    alert('Rezervasyon Satış Onayı Sürecine Gönderildi!');
    handleRefresh();
  };

  const handleSalesApprove = async () => {
    await reservationRepository.update(reservation.id, {
      salesApprovalStatus: 'APPROVED',
      salesApprovedBy: currentUser?.email || 'sales@outdoorcore.ai',
      salesApprovedAt: new Date().toISOString(),
      auditLogDescription: 'Satış Departmanı tarafından ONAYLANDI. Confirme edilmeye hazır.'
    });
    alert('Satış Departmanı Onayı Verildi! Rezervasyonu "Confirme Et" işlemiyle kesinleştirebilirsiniz.');
    handleRefresh();
  };

  const handleSalesRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason) {
      alert('Lütfen bir red nedeni giriniz.');
      return;
    }

    await reservationRepository.update(reservation.id, {
      status: releaseSpacesOnReject ? 'CANCELLED' : reservation.status,
      salesApprovalStatus: 'REJECTED',
      salesRejectionReason: rejectReason,
      auditLogDescription: `Satış Departmanı ONAYI REDDEDİLDİ. Gerekçe: ${rejectReason}. Envanter Serbest Bırakıldı: ${releaseSpacesOnReject ? 'Evet' : 'Hayır'}`
    });

    if (releaseSpacesOnReject && reservation.spaceId) {
      await spaceRepository.update(reservation.spaceId, { status: 'bos' });
    }

    alert('Rezervasyon satış onayı reddedildi.');
    setRejectOpen(false);
    handleRefresh();
  };

  const handleSalesRevisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionNote) {
      alert('Lütfen bir revizyon notu giriniz.');
      return;
    }

    await reservationRepository.update(reservation.id, {
      salesApprovalStatus: 'REVISION_REQUESTED',
      salesRevisionNote: revisionNote,
      auditLogDescription: `Satış Departmanı tarafından revizyon talep edildi. Not: ${revisionNote}`
    });

    alert('Revizyon talebi kaydedildi.');
    setRevisionOpen(false);
    handleRefresh();
  };

  const handleConfirmReservation = async () => {
    try {
      // 1. Durumu CONFIRMED yap
      await reservationRepository.update(reservation.id, {
        status: 'CONFIRMED',
        confirmedAt: new Date().toISOString(),
        confirmedBy: currentUser?.email || 'manager@outdoorcore.ai',
        inventoryLockedAt: new Date().toISOString(),
        auditLogDescription: 'REZERVASYON CONFİRME EDİLDİ. Kesin satış kilitlendi ve süreçler başlatıldı.'
      });

      // 2. Mecrayı kesin kapat (Hard Lock)
      if (reservation.spaceId) {
        await spaceRepository.update(reservation.spaceId, { status: 'rezerve' });
      }

      // 3. Kampanya oluştur
      await campaignRepository.create({
        clientName: reservation.clientName,
        campaignName: reservation.campaignName || `${reservation.clientName} - Kampanya`,
        status: 'Kurulum Bekliyor',
        startDate: reservation.startDate,
        endDate: reservation.endDate,
        valueNumeric: parseFloat((reservation.budget || '').replace(/[^0-9]/g, '')) || 150000,
        companyId: reservation.companyId || 'CMP-0001',
        contractId: reservation.contractId || ''
      });

      // 4. Finans Planı oluştur
      await financeRepository.createPaymentPlan(
        reservation.companyId || 'CMP-0001', 
        reservation.clientName, 
        parseFloat((reservation.budget || '').replace(/[^0-9]/g, '')) || 150000,
        reservation.contractId || 'CON-CONFIRMED'
      );

      // 5. Workflow automation tetikle
      const event = createWorkflowEvent('reservation.confirmed', 'reservation', reservation.id, {
        clientName: reservation.clientName,
        companyId: reservation.companyId
      });
      workflowEngine.dispatchWorkflowEvent(event);

      alert('Rezervasyon başarıyla CONFİRME edildi! Kesin satış ciroya yazıldı, kampanya ve finans planı başlatıldı.');
      setConfirmOpen(false);
      handleRefresh();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Konfirmasyon sırasında bir hata oluştu.');
    }
  };

  // Check Confirme Et button active requirements
  const isConfirmButtonEnabled = 
    reservation.contractStatus === 'SIGNED' &&
    reservation.salesApprovalStatus === 'APPROVED' &&
    reservation.status !== 'CANCELLED' &&
    reservation.status !== 'OPTION_EXPIRED';

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-5 text-left lg:sticky lg:top-[95px] lg:max-h-[calc(100vh-130px)] overflow-y-auto">
      {/* Header Profile Title */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[9px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/10 uppercase tracking-widest inline-block">
            {reservation.spaceCode}
          </span>
          <h4 className="text-sm font-black text-white leading-tight uppercase truncate max-w-[200px]">{reservation.clientName}</h4>
          <span className="text-[8px] text-slate-550 font-bold uppercase tracking-wider block">{reservation.spaceName}</span>
        </div>
        <Badge variant={
          reservation.status === 'CONFIRMED' ? 'success' : 
          reservation.status === 'SALES_APPROVAL_PENDING' ? 'warning' : 
          reservation.status === 'OPTION_EXPIRED' || reservation.status === 'CANCELLED' ? 'danger' : 'primary'
        }>
          {reservation.status}
        </Badge>
      </div>

      {/* Dynamic Process Stepper */}
      <div className="border-t border-b border-white/5 py-4 space-y-2.5">
        <span className="text-[8.5px] text-slate-500 font-extrabold uppercase tracking-wider block mb-1">Rezervasyon Akış Durumu</span>
        <div className="grid grid-cols-4 gap-1.5 text-center select-none">
          {steps.map((st, idx) => (
            <div key={idx} className="space-y-1.5 flex flex-col items-center">
              <div className={`w-5 h-5 rounded-full flex items-center justify-between text-[9px] font-bold ${
                st.done 
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/35' 
                  : 'bg-white/5 text-slate-500 border border-white/5'
              }`}>
                <span className="mx-auto">{idx + 1}</span>
              </div>
              <span className={`text-[7.5px] leading-tight font-extrabold block truncate max-w-[70px] uppercase ${
                st.done ? 'text-slate-350' : 'text-slate-650'
              }`}>{st.label.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Core Metadata */}
      <div className="grid grid-cols-2 gap-3.5 text-[10.5px] font-semibold text-slate-400">
        <div className="flex items-center gap-2">
          <MapPin size={12} className="text-slate-500 shrink-0" />
          <span className="truncate">{reservation.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Coins size={12} className="text-slate-500 shrink-0" />
          <span className="text-emerald-450 font-bold">{reservation.budget}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={12} className="text-slate-500 shrink-0" />
          <span>{reservation.startDate} - {reservation.endDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={12} className="text-slate-500 shrink-0" />
          <span>Süre: {reservation.durationDays} Gün</span>
        </div>
        <div className="col-span-2 flex items-center gap-2 border-t border-white/3 pt-2">
          <Building2 size={12} className="text-slate-500 shrink-0" />
          <span>Medya Ajansı: <span className="text-white font-bold">{reservation.agencyName}</span></span>
        </div>
      </div>

      {/* Option details block */}
      {reservation.status === 'OPTIONED' && reservation.optionExpiresAt && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/15 rounded-2xl flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-2 text-amber-450">
            <Clock size={13} className="animate-pulse" />
            <div>
              <span className="font-extrabold uppercase block leading-none">Opsiyon Kalan Süresi</span>
              <span className="text-[11px] font-black text-white mt-1 block">{getOptionHoursLeft()}</span>
            </div>
          </div>
          <Badge variant="warning">Soft Lock</Badge>
        </div>
      )}

      {/* Contract & Approval state values details */}
      <div className="p-3.5 bg-white/3 border border-white/5 rounded-2xl text-[10px] space-y-2">
        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">MGA ERP Kontrolleri</span>
        <div className="flex justify-between">
          <span className="text-slate-450">Sözleşme Durumu:</span>
          <span className={`font-black ${reservation.contractStatus === 'SIGNED' ? 'text-emerald-500' : 'text-slate-400'}`}>
            {reservation.contractStatus === 'SIGNED' ? 'SÖZLEŞME İMZALANDI (SIGNED)' : 'TASLAK (DRAFT)'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-450">Satış Onay Durumu:</span>
          <span className={`font-black ${
            reservation.salesApprovalStatus === 'APPROVED' ? 'text-emerald-500' : 
            reservation.salesApprovalStatus === 'REJECTED' ? 'text-rose-500' : 
            reservation.salesApprovalStatus === 'REVISION_REQUESTED' ? 'text-amber-500' : 'text-slate-400'
          }`}>
            {reservation.salesApprovalStatus === 'APPROVED' ? 'ONAYLANDI (APPROVED)' : 
             reservation.salesApprovalStatus === 'REJECTED' ? 'REDDEDİLDİ (REJECTED)' : 
             reservation.salesApprovalStatus === 'REVISION_REQUESTED' ? 'REVİZYON İSTENDİ' : 'ONAY BEKLİYOR (PENDING)'}
          </span>
        </div>
        {reservation.salesRejectionReason && (
          <div className="pt-1.5 border-t border-white/5 text-[9px] text-rose-400 font-bold">
            Red Nedeni: {reservation.salesRejectionReason}
          </div>
        )}
        {reservation.salesRevisionNote && (
          <div className="pt-1.5 border-t border-white/5 text-[9px] text-amber-550 font-bold">
            Revizyon Notu: {reservation.salesRevisionNote}
          </div>
        )}
      </div>

      {/* Linked references */}
      <div className="space-y-2.5">
        <Label>Modüller Arası Bağlı Kayıtlar</Label>
        <div className="flex flex-wrap gap-2">
          {reservation.companyId && (
            <EntityLink type="company" id={reservation.companyId} label={`Firma: ${reservation.clientName}`} />
          )}
          {reservation.spaceId && (
            <EntityLink type="space" id={reservation.spaceId} label={`Alan: ${reservation.spaceCode}`} />
          )}
          {reservation.offerId && (
            <EntityLink type="offer" id={reservation.offerId} label={`Teklif: ${reservation.offerId}`} />
          )}
          {reservation.contractId && (
            <EntityLink type="contract" id={reservation.contractId} label={`Sözleşme: ${reservation.contractId}`} />
          )}
          {reservation.campaignId && (
            <EntityLink type="campaign" id={reservation.campaignId} label={`Kampanya: ${reservation.campaignId}`} />
          )}
        </div>
      </div>

      {/* Dynamic Actions panel */}
      <div className="space-y-2 pt-3.5 border-t border-white/5">
        
        {/* CONFIRME ET Button for managers */}
        {isSalesManager && (
          <Button 
            variant="primary" 
            size="sm" 
            disabled={!isConfirmButtonEnabled}
            className={`w-full py-3 text-[10px] font-black uppercase tracking-widest ${
              isConfirmButtonEnabled 
                ? 'bg-gradient-to-r from-emerald-600 to-teal-650 hover:from-emerald-500 hover:to-teal-600 text-white animate-pulse' 
                : 'bg-white/5 text-slate-650 border border-white/5 cursor-not-allowed'
            }`}
            onClick={() => setConfirmOpen(true)}
          >
            <CalendarCheck size={13} className="mr-1.5 shrink-0 inline" />
            CONFİRME ET & KESİN SATIŞ YAP
          </Button>
        )}

        {/* Sales Approval Flow Actions for Sales Department */}
        {isSalesDept && reservation.status === 'SALES_APPROVAL_PENDING' && reservation.salesApprovalStatus !== 'APPROVED' && (
          <div className="p-3 bg-[#0d1527] border border-blue-500/10 rounded-2xl space-y-2">
            <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest block leading-none mb-1">SATIŞ ONAYI YETKİ KONTROLLERİ</span>
            <div className="grid grid-cols-3 gap-1.5">
              <Button 
                variant="primary" 
                size="xs" 
                className="bg-emerald-650 hover:bg-emerald-600 text-white font-extrabold text-[8.5px]"
                onClick={handleSalesApprove}
              >
                Onayla
              </Button>
              <Button 
                variant="outline" 
                size="xs" 
                className="text-[8.5px] font-extrabold text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/25 border-rose-500/15"
                onClick={() => setRejectOpen(true)}
              >
                Reddet
              </Button>
              <Button 
                variant="outline" 
                size="xs" 
                className="text-[8.5px] font-extrabold text-amber-500 hover:bg-amber-500/10 hover:border-amber-500/25 border-amber-500/15"
                onClick={() => setRevisionOpen(true)}
              >
                Revizyon
              </Button>
            </div>
          </div>
        )}

        {/* General Options Extensions & Cancellations */}
        <div className="grid grid-cols-2 gap-2">
          {reservation.status === 'OPTIONED' && (
            <Button 
              variant="outline" 
              size="sm" 
              className="col-span-2 text-white bg-blue-500/10 border-blue-500/15 hover:bg-blue-500/20"
              onClick={handleRequestSalesApproval}
            >
              Satış Onayına Gönder
            </Button>
          )}

          {['OPTIONED', 'CONTRACT_PENDING'].includes(reservation.status) && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExtendOption}
            >
              Opsiyonu Uzat
            </Button>
          )}

          {reservation.status !== 'CANCELLED' && reservation.status !== 'CONFIRMED' && (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-rose-500 border-rose-500/10 hover:bg-rose-500/10"
              onClick={handleCancelReservation}
            >
              Rezervasyonu İptal Et
            </Button>
          )}
        </div>
      </div>

      {/* Reservation audit log feed block */}
      <div className="space-y-2 border-t border-white/5 pt-4">
        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 leading-none">
          <History size={11} className="text-blue-400" />
          Rezervasyon Audit Geçmişi
        </h5>
        <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
          {logs.map((log) => (
            <div key={log.id} className="p-2 rounded-xl bg-white/3 border border-white/5 text-[9px] font-semibold text-slate-400 space-y-1">
              <div className="flex justify-between text-[8px] text-slate-500">
                <span className="font-extrabold">{log.user}</span>
                <span>{log.date}</span>
              </div>
              <div className="text-[9px] text-slate-350">{log.description}</div>
              <div className="text-[7.5px] uppercase tracking-wider text-slate-650">
                Geçiş: {log.oldStatus} &rarr; {log.newStatus}
              </div>
            </div>
          ))}
          {logs.length === 0 && (
            <span className="text-[9px] text-slate-500 font-bold italic block text-center py-2">Kayıtlı durum değişikliği bulunmuyor.</span>
          )}
        </div>
      </div>

      {/* REJECTION PROMPT MODAL */}
      {rejectOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSalesRejectSubmit} className="bg-[#0b1329] border border-white/5 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h4 className="text-xs font-black uppercase text-rose-500 tracking-widest flex items-center gap-2">
              <XCircle size={15} />
              SATIŞ ONAYI RED DETAYLARI
            </h4>
            <div className="space-y-2 text-left">
              <Label htmlFor="rej-reason">Red Nedeni *</Label>
              <textarea
                id="rej-reason"
                required
                rows={3}
                placeholder="Neden onaylanmadı? Açıklayınız..."
                className="w-full text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-white/3 border border-slate-250 dark:border-white/5 rounded-xl p-2.5 text-xs outline-none"
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-[10px] font-bold text-slate-400 select-none text-left">
              <input
                type="checkbox"
                checked={releaseSpacesOnReject}
                onChange={e => setReleaseSpacesOnReject(e.target.checked)}
                className="rounded border-white/10 bg-[#0f172a] text-rose-500 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
              />
              Mecra Kapasitesini Hemen Serbest Bırak
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setRejectOpen(false)}>Vazgeç</Button>
              <Button type="submit" variant="primary" size="sm" className="bg-rose-650 hover:bg-rose-600 text-white font-bold">Reddi Onayla</Button>
            </div>
          </form>
        </div>
      )}

      {/* REVISION REQUEST PROMPT MODAL */}
      {revisionOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSalesRevisionSubmit} className="bg-[#0b1329] border border-white/5 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h4 className="text-xs font-black uppercase text-amber-500 tracking-widest flex items-center gap-2">
              <RefreshCw size={15} />
              REVİZYON TALEBİ DETAYLARI
            </h4>
            <div className="space-y-2 text-left">
              <Label htmlFor="rev-note">Revizyon Talebi & Düzeltme Notu *</Label>
              <textarea
                id="rev-note"
                required
                rows={3}
                placeholder="Nelerin düzeltilmesi gerekiyor? Açıklayınız..."
                className="w-full text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-white/3 border border-slate-250 dark:border-white/5 rounded-xl p-2.5 text-xs outline-none"
                value={revisionNote}
                onChange={e => setRevisionNote(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setRevisionOpen(false)}>Vazgeç</Button>
              <Button type="submit" variant="primary" size="sm" className="bg-amber-650 hover:bg-amber-600 text-white font-bold">Revizyon İste</Button>
            </div>
          </form>
        </div>
      )}

      {/* CONFIRMATION DIALOG MODAL */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-white/5 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl text-left select-none">
            <h4 className="text-xs font-black uppercase text-emerald-500 tracking-widest flex items-center gap-2">
              <CalendarCheck size={16} />
              REZERVASYON CONFİRME ONAYI
            </h4>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 rounded-2xl text-[10px] font-semibold leading-relaxed">
              ⚠️ **DİKKAT (HARD LOCK):** Bu işlem rezervasyonu kesin olarak kapatacaktır. 
              Mecra takvimde yeşil renkle kesinleşecek, kampanya süreci başlayacak ve gelir ciroya yazılacaktır.
            </div>
            <div className="space-y-1.5 text-xs font-bold text-slate-300">
              <div>Müşteri: <span className="text-white font-extrabold">{reservation.clientName}</span></div>
              <div>Mecra Kodu: <span className="text-white font-extrabold">{reservation.spaceCode}</span></div>
              <div>Tarih Aralığı: <span className="text-white font-extrabold">{reservation.startDate} - {reservation.endDate}</span></div>
              <div>Bütçe Değeri: <span className="text-emerald-450 font-extrabold">{reservation.budget}</span></div>
            </div>
            <div className="flex justify-end gap-2.5 pt-3 border-t border-white/5">
              <Button type="button" variant="outline" size="sm" onClick={() => setConfirmOpen(false)}>Vazgeç</Button>
              <Button 
                type="button" 
                variant="primary" 
                size="sm" 
                className="bg-emerald-650 hover:bg-emerald-600 text-white font-bold"
                onClick={handleConfirmReservation}
              >
                Evet, Confirme Et & Süreci Başlat
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
