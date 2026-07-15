import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Search, 
  Trash2, 
  XSquare, 
  FileText,
  DollarSign,
  Tv,
  Eye,
  AlertCircle
} from 'lucide-react';
import { reservationRepository, spaceRepository } from '@/repositories';
import { Badge } from '@/components/design-system/Badge';
import { Button } from '@/components/design-system/Button';
import { TableSkeleton } from '@/components/design-system/Skeleton';
import { ToastContainer, ToastItem } from '@/components/ui/Toast';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { formatAnyDate } from '@/utils/dateHelper';

export function Rezervasyonlar() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [resToCancel, setResToCancel] = useState<any | null>(null);

  const showToast = (title: string, description: string, type: ToastItem['type']) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, description, type }]);
  };

  const handleRemoveToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const data = await reservationRepository.getAll();
      setReservations(data);
    } catch (e: any) {
      console.error(e);
      showToast("Hata", "Rezervasyon listesi yüklenemedi.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancelClick = (res: any) => {
    setResToCancel(res);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!resToCancel) return;
    try {
      // 1. Update status to CANCELLED in repo
      await reservationRepository.update(resToCancel.id, { 
        status: 'CANCELLED',
        auditLogDescription: 'Rezervasyon kullanıcı tarafından iptal edildi.'
      });

      // 2. Release space status to 'bos' if no other active reservation occupies it
      const isStillOccupied = reservationRepository.isSpaceAvailableSync(
        resToCancel.spaceId, 
        resToCancel.spaceCode, 
        new Date().toISOString().split('T')[0], 
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      );
      if (isStillOccupied) {
        await spaceRepository.update(resToCancel.spaceId, { status: 'bos' });
      }

      showToast("Başarılı", "Rezervasyon başarıyla iptal edildi ve mecra serbest bırakıldı.", "success");
      fetchReservations();
    } catch (e: any) {
      console.error(e);
      showToast("Hata", "Rezervasyon iptal edilirken bir hata oluştu.", "error");
    } finally {
      setCancelDialogOpen(false);
      setResToCancel(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const s = (status || '').toUpperCase();
    if (s === 'REZERVE' || s === 'CONFIRMED' || s === 'AKTİF') {
      return <Badge variant="success">REZERVE</Badge>;
    }
    if (s === 'YAYINDA' || s === 'ACTIVE') {
      return <Badge variant="primary">YAYINDA</Badge>;
    }
    if (s === 'TAMAMLANDI') {
      return <Badge variant="muted">TAMAMLANDI</Badge>;
    }
    if (s === 'CANCELLED' || s === 'İPTAL') {
      return <Badge variant="danger">İPTAL EDİLDİ</Badge>;
    }
    return <Badge variant="warning">{s}</Badge>;
  };

  const filtered = reservations.filter(r => {
    const matchesSearch = 
      r.clientName.toLowerCase().includes(search.toLowerCase()) ||
      r.spaceCode.toLowerCase().includes(search.toLowerCase()) ||
      (r.campaignName || '').toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
      
    if (statusFilter === 'ALL') return matchesSearch;
    if (statusFilter === 'ACTIVE') return matchesSearch && (r.status === 'REZERVE' || r.status === 'CONFIRMED' || r.status === 'YAYINDA' || r.status === 'ACTIVE');
    if (statusFilter === 'COMPLETED') return matchesSearch && r.status === 'TAMAMLANDI';
    if (statusFilter === 'CANCELLED') return matchesSearch && (r.status === 'CANCELLED' || r.status === 'İPTAL');
    return matchesSearch;
  });

  // KPI Calculations
  const activeCount = reservations.filter(r => r.status === 'REZERVE' || r.status === 'CONFIRMED' || r.status === 'YAYINDA' || r.status === 'ACTIVE').length;
  const completedCount = reservations.filter(r => r.status === 'TAMAMLANDI').length;
  const cancelledCount = reservations.filter(r => r.status === 'CANCELLED' || r.status === 'İPTAL').length;

  return (
    <div className="space-y-6 select-none text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 p-5 rounded-3xl border border-white/5 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">Rezervasyonlar</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Kilitlenmiş envanter kayıtlarını, kampanya yayın tarihlerini ve doluluk takibini yönetin.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0b0f19]/30 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Toplam Rezervasyon</span>
            <span className="text-lg font-black text-white">{reservations.length} Adet</span>
          </div>
          <Calendar size={18} className="text-blue-500 opacity-60" />
        </div>
        <div className="bg-[#0b0f19]/30 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-emerald-450 uppercase tracking-wider block">Aktif / Rezerve</span>
            <span className="text-lg font-black text-white">{activeCount} Adet</span>
          </div>
          <Tv size={18} className="text-emerald-500 opacity-60" />
        </div>
        <div className="bg-[#0b0f19]/30 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Tamamlanan</span>
            <span className="text-lg font-black text-white">{completedCount} Adet</span>
          </div>
          <Eye size={18} className="text-slate-400 opacity-60" />
        </div>
        <div className="bg-[#0b0f19]/30 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-red-400 uppercase tracking-wider block">İptal Edilen</span>
            <span className="text-lg font-black text-white">{cancelledCount} Adet</span>
          </div>
          <XSquare size={18} className="text-red-500 opacity-60" />
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/2 p-4 rounded-2xl border border-white/5">
        <div className="relative w-full md:w-72">
          <span className="absolute left-3.5 top-3.5 text-slate-500"><Search size={14} /></span>
          <input
            type="text"
            placeholder="Firma, mecra veya rezervasyon no ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-[#151B2D] border border-white/5 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder-slate-500"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          {['ALL', 'ACTIVE', 'COMPLETED', 'CANCELLED'].map((mode) => {
            const label = mode === 'ALL' ? 'Tümü' : mode === 'ACTIVE' ? 'Aktif' : mode === 'COMPLETED' ? 'Tamamlanan' : 'İptal';
            const isSelected = statusFilter === mode;
            return (
              <button
                key={mode}
                onClick={() => setStatusFilter(mode)}
                className={`px-3 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl border transition-all ${
                  isSelected 
                    ? 'bg-blue-650/10 border-blue-500/30 text-blue-400 font-bold' 
                    : 'bg-[#151B2D] border-white/5 text-slate-500 hover:text-white'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-[#0b0f19]/30 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-6"><TableSkeleton /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/5 text-[9.5px] font-black text-slate-500 uppercase tracking-widest bg-white/1">
                  <th className="py-4.5 px-6">Rezervasyon No</th>
                  <th className="py-4.5 px-6">Müşteri / Kampanya</th>
                  <th className="py-4.5 px-6">Reklam Alanı</th>
                  <th className="py-4.5 px-6 text-center">Yayın Dönemi</th>
                  <th className="py-4.5 px-6 text-center">Süre</th>
                  <th className="py-4.5 px-6 text-center">Durum</th>
                  <th className="py-4.5 px-6 text-right">Net Bütçe</th>
                  <th className="py-4.5 px-6 text-center">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/3 text-[11px] font-semibold text-slate-300">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-white/2 transition-colors">
                    <td className="py-4 px-6 text-white font-extrabold text-[10px] uppercase">#{r.id}</td>
                    <td className="py-4 px-6">
                      <span className="text-white block font-extrabold">{r.clientName}</span>
                      <span className="text-[9px] text-slate-500 block mt-0.5 uppercase tracking-wider">{r.campaignName || '-'}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-white font-black block">#{r.spaceCode}</span>
                      <span className="text-[9px] text-slate-500 block mt-0.5 truncate max-w-[150px]">{r.spaceName}</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-white block">{formatAnyDate(r.startDate)}</span>
                      <span className="text-slate-500 block mt-0.5 text-[9px] font-bold">ile {formatAnyDate(r.endDate)} arası</span>
                    </td>
                    <td className="py-4 px-6 text-center font-mono text-white text-[10.5px]">{r.durationDays} Gün</td>
                    <td className="py-4 px-6 text-center">{getStatusBadge(r.status)}</td>
                    <td className="py-4 px-6 text-right text-emerald-450 font-extrabold">{r.budget}</td>
                    <td className="py-4 px-6 text-center">
                      {['REZERVE', 'CONFIRMED', 'YAYINDA', 'ACTIVE'].includes(r.status) ? (
                        <Button
                          variant="danger"
                          size="xs"
                          leftIcon={<Trash2 size={10} />}
                          onClick={() => handleCancelClick(r)}
                        >
                          İptal Et
                        </Button>
                      ) : (
                        <span className="text-slate-600 text-[9px] font-black uppercase tracking-wider">İşlem Yok</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500 text-xs font-bold uppercase tracking-wider">
                      Rezervasyon bulunamadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        onConfirm={handleCancelConfirm}
        title="Rezervasyonu iptal etmek istiyor musunuz?"
        description="Bu işlem reklam alanını belirtilen tarih aralığında serbest bırakacaktır. Bu işlem geri alınamaz."
        confirmLabel="Rezervasyonu İptal Et"
        cancelLabel="Vazgeç"
      />

      <ToastContainer toasts={toasts} onRemove={handleRemoveToast} />
    </div>
  );
}
