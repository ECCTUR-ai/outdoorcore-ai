import React from 'react';
import { Offer } from '@/data/offers';
import { Badge } from './Badge';
import { Label } from './Form';
import { Button } from './Button';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Coins, 
  Sparkles, 
  FileText,
  CalendarCheck,
  UserCheck,
  BookOpen,
  Edit3,
  Trash2,
  Send,
  Check,
  XSquare,
  RotateCcw,
  Layers
} from 'lucide-react';
import { EntityLink } from './EntityLink';
import { PermissionGate } from './PermissionGate';

interface OfferDetailPanelProps {
  offer: Offer;
  onEdit: (offer: Offer) => void;
  onDelete: (id: string) => void;
  onStageChange: (id: string, newStage: Offer['stage'], approved?: boolean) => void;
  actionLoading?: 'sendApproval' | 'approve' | 'revise' | 'cancel' | 'delete' | 'save' | null;
}

export function OfferDetailPanel({ offer, onEdit, onDelete, onStageChange, actionLoading = null }: OfferDetailPanelProps) {
  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-5 text-left lg:sticky lg:top-[95px] lg:max-h-[calc(100vh-130px)] overflow-y-auto">
      {/* Header Profile Title */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[9px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/10 uppercase tracking-widest inline-block">
            Teklif: #{offer.id}
          </span>
          <h4 className="text-sm font-black text-white leading-tight uppercase truncate max-w-[150px]" title={offer.clientName}>{offer.clientName}</h4>
          <span className="text-[8.5px] text-slate-555 font-bold uppercase tracking-wider block truncate max-w-[150px]" title={offer.campaignName}>{offer.campaignName}</span>
        </div>
        <Badge variant={offer.priority === 'Yüksek' ? 'danger' : 'warning'}>
          {offer.priority} Öncelik
        </Badge>
      </div>

      {/* Action Buttons: Düzenle & Sil */}
      <div className="grid grid-cols-2 gap-2 pt-1 border-b border-white/5 pb-4">
        <PermissionGate permission="offers.update">
          <Button 
            variant="outline" 
            size="sm" 
            leftIcon={<Edit3 size={11} />} 
            onClick={() => onEdit(offer)}
            disabled={actionLoading !== null}
          >
            Düzenle
          </Button>
        </PermissionGate>
        
        <PermissionGate permission="offers.delete">
          <Button 
            variant="danger" 
            size="sm" 
            leftIcon={<Trash2 size={11} />} 
            onClick={() => onDelete(offer.id)}
            loading={actionLoading === 'delete'}
            disabled={actionLoading !== null}
          >
            Sil
          </Button>
        </PermissionGate>
      </div>

      {/* Teklif Aşaması Yönetimi Quick Actions */}
      <div className="space-y-2 pt-1 border-b border-white/5 pb-4">
        <Label>Teklif Durum Yönetimi</Label>
        <div className="flex flex-wrap gap-2">
          {offer.stage === 'Rezerve' && (
            <PermissionGate permission="offers.update">
              <Button 
                variant="minimal" 
                size="xs" 
                leftIcon={<Send size={10} />}
                onClick={() => onStageChange(offer.id, 'Teklif Gönderildi')}
                loading={actionLoading === 'sendApproval'}
                disabled={actionLoading !== null}
              >
                Teklife Çevir
              </Button>
            </PermissionGate>
          )}

          {offer.stage === 'Teklif Gönderildi' && (
            <PermissionGate permission="offers.update">
              <Button 
                variant="minimal" 
                size="xs" 
                leftIcon={<Send size={10} />}
                onClick={() => onStageChange(offer.id, 'Müşteri Onayı')}
                loading={actionLoading === 'sendApproval'}
                disabled={actionLoading !== null}
              >
                Müşteri Onayına Sun
              </Button>
            </PermissionGate>
          )}

          {['Müşteri Onayı', 'Sözleşme Bekliyor'].includes(offer.stage) && (
            <PermissionGate permission="offers.approve">
              <Button 
                variant="success" 
                size="xs" 
                leftIcon={<Check size={10} />}
                onClick={() => onStageChange(offer.id, 'Sözleşme İmzalandı', true)}
                loading={actionLoading === 'approve'}
                disabled={actionLoading !== null}
              >
                Sözleşme İmzala
              </Button>
            </PermissionGate>
          )}

          {offer.stage === 'Sözleşme İmzalandı' && (
            <PermissionGate permission="offers.update">
              <Button 
                variant="success" 
                size="xs" 
                leftIcon={<Check size={10} />}
                onClick={() => onStageChange(offer.id, 'Yayında')}
                loading={actionLoading === 'approve'}
                disabled={actionLoading !== null}
              >
                Yayına Al
              </Button>
            </PermissionGate>
          )}

          {offer.stage === 'Yayında' && (
            <PermissionGate permission="offers.update">
              <Button 
                variant="minimal" 
                size="xs" 
                leftIcon={<Check size={10} />}
                onClick={() => onStageChange(offer.id, 'Tamamlandı')}
                loading={actionLoading === 'approve'}
                disabled={actionLoading !== null}
              >
                Yayın Tamamla
              </Button>
            </PermissionGate>
          )}

          {!['İptal', 'Tamamlandı'].includes(offer.stage) && (
            <PermissionGate permission="offers.update">
              <Button 
                variant="danger" 
                size="xs" 
                leftIcon={<XSquare size={10} />}
                onClick={() => onStageChange(offer.id, 'İptal')}
                loading={actionLoading === 'cancel'}
                disabled={actionLoading !== null}
              >
                İptal Et
              </Button>
            </PermissionGate>
          )}

          {['Teklif Gönderildi', 'Müşteri Onayı', 'Sözleşme Bekliyor', 'Sözleşme İmzalandı', 'Yayında'].includes(offer.stage) && (
            <PermissionGate permission="offers.update">
              <Button 
                variant="minimal" 
                size="xs" 
                leftIcon={<RotateCcw size={10} />}
                onClick={() => onStageChange(offer.id, 'Rezerve')}
                loading={actionLoading === 'revise'}
                disabled={actionLoading !== null}
              >
                Revize Et
              </Button>
            </PermissionGate>
          )}
        </div>
      </div>

      {/* Booking Core Metadata */}
      <div className="grid grid-cols-2 gap-3.5 border-b border-white/5 pb-4 text-[10.5px] font-semibold text-slate-400">
        <div className="flex items-center gap-2">
          <Coins size={12} className="text-slate-500 shrink-0" />
          <span>Net Tutar: <span className="text-emerald-450 font-bold">₺ {(offer.net_amount || offer.valueNumeric).toLocaleString('tr-TR')}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles size={12} className="text-slate-500 shrink-0" />
          <span>İhtimal: <span className="text-blue-400 font-bold">%{offer.closeProbability}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <span>İndirim Oranı: <span className="text-indigo-400 font-bold">%{offer.discount_rate || 0}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <span>Genel Toplam: <span className="text-white font-bold">₺ {(offer.grand_total || Math.round(offer.valueNumeric * 1.2)).toLocaleString('tr-TR')}</span></span>
        </div>
        {/* Dates Block */}
        <div className="col-span-2 space-y-2 border-t border-b border-white/3 py-2.5 my-1">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-slate-500 font-bold uppercase tracking-wider">Kampanya Başlangıç:</span>
            <span className="text-white font-extrabold">{offer.campaignStartDate || offer.closingDate || '-'}</span>
          </div>
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-slate-500 font-bold uppercase tracking-wider">Kampanya Bitiş:</span>
            <span className="text-white font-extrabold">{offer.campaignEndDate || offer.closingDate || '-'}</span>
          </div>
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-slate-500 font-bold uppercase tracking-wider">Beklenen Kapanış:</span>
            <span className="text-white font-extrabold">{offer.closingDate || '-'}</span>
          </div>
          {(offer.contractId || ['Sözleşme İmzalandı', 'Operasyona Aktarıldı'].includes(offer.stage)) && (
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-slate-500 font-bold uppercase tracking-wider">Sözleşme İmza Tarihi:</span>
              <span className="text-emerald-450 font-black">{offer.closingDate || '-'}</span>
            </div>
          )}
          {(!offer.campaignStartDate || !offer.campaignEndDate) && (
            <div className="mt-1 px-2.5 py-1.5 bg-yellow-500/10 border border-yellow-500/15 rounded-lg text-[8.5px] font-black text-yellow-400 uppercase tracking-wider">
              ⚠️ Bu teklif eski tarih formatıyla oluşturulmuş.
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 col-span-2">
          <UserCheck size={12} className="text-slate-500 shrink-0" />
          <span>Temsilci: <span className="text-white font-bold">{offer.owner}</span></span>
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <Building2 size={12} className="text-slate-500 shrink-0" />
          <span>Aşama: <span className="text-indigo-400 font-bold uppercase">{offer.stage}</span></span>
        </div>
      </div>

      {/* Suggested Spaces */}
      {offer.spacesList && offer.spacesList.length > 0 && (
        <div className="space-y-2 text-left">
          <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 leading-none mb-2.5">
            <MapPin size={11} className="text-blue-400" />
            Önerilen Reklam Alanları
          </h5>
          <div className="space-y-1.5">
            {offer.spacesList.map((code, idx) => {
              const mappedId = offer.spaceIds?.[idx] || 'SPC-0001';
              return (
                <div 
                  key={code} 
                  className="p-2.5 rounded-xl bg-white/3 border border-white/5 flex items-center justify-between text-[10px]"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white font-black">#{code}</span>
                    <EntityLink type="space" id={mappedId} label="Detay" />
                  </div>
                  <span className="text-[8px] text-slate-500 font-black uppercase">LED Ekran</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Global Linked References */}
      <div className="space-y-2.5 border-t border-white/5 pt-4">
        <Label>Modüller Arası Bağlı Kayıtlar</Label>
        <div className="flex flex-wrap gap-2.5">
          {offer.companyId && (
            <EntityLink type="company" id={offer.companyId} label={`Firma: ${offer.clientName}`} />
          )}
          {offer.contractId && (
            <EntityLink type="contract" id={offer.contractId} label={`Sözleşme: ${offer.contractId}`} />
          )}
          {offer.reservationId && (
            <EntityLink type="reservation" id={offer.reservationId} label={`Rezervasyon: ${offer.reservationId}`} />
          )}
          {offer.campaignId && (
            <EntityLink type="campaign" id={offer.campaignId} label={`Kampanya: ${offer.campaignId}`} />
          )}
        </div>
      </div>

      {/* Offer content details */}
      {offer.details && (
        <div className="space-y-2 text-left pt-1 border-t border-white/5 text-[10.5px] font-semibold text-slate-455">
          <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2.5">
            Teklif Açıklaması
          </h5>
          <p className="text-[10px] text-slate-350 leading-relaxed m-0">{offer.details}</p>
        </div>
      )}

      {/* Sonraki İşlemler Workflow Card */}
      <div className="p-4 bg-[#12192B]/60 border border-white/5 rounded-2xl text-left select-none space-y-3.5">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 leading-none">
          <Layers size={11} className="text-blue-500" />
          Satış Süreci Aşamaları
        </span>
        
        <div className="relative pl-4 border-l border-white/5 space-y-4 text-[10px]">
          {/* Step 1: Rezerve */}
          <div className="relative">
            <div className={`absolute -left-[21px] top-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center border text-[8px] font-black ${
              offer.stage !== 'İptal' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-white/5 text-slate-500'
            }`}>
              ✓
            </div>
            <div className="space-y-0.5">
              <span className={`font-black uppercase tracking-wide block ${offer.stage === 'Rezerve' ? 'text-blue-400' : 'text-slate-300'}`}>Rezerve</span>
              <span className="text-[8.5px] text-slate-500 font-bold block uppercase tracking-wider">Envanter tarih aralığında kilitlendi.</span>
            </div>
          </div>

          {/* Step 2: Teklif Gönderildi */}
          <div className="relative">
            <div className={`absolute -left-[21px] top-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center border text-[8px] font-black ${
              ['Teklif Gönderildi', 'Müşteri Onayı', 'Sözleşme Bekliyor', 'Sözleşme İmzalandı', 'Yayında', 'Tamamlandı'].includes(offer.stage)
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : offer.stage === 'Rezerve'
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 ring-2 ring-blue-500/20'
                  : 'bg-slate-800 border-white/5 text-slate-500'
            }`}>
              {['Teklif Gönderildi', 'Müşteri Onayı', 'Sözleşme Bekliyor', 'Sözleşme İmzalandı', 'Yayında', 'Tamamlandı'].includes(offer.stage) ? '✓' : '2'}
            </div>
            <div className="space-y-0.5">
              <span className={`font-black uppercase tracking-wide block ${offer.stage === 'Teklif Gönderildi' ? 'text-blue-400' : 'text-slate-400'}`}>Teklif Gönderildi</span>
              <span className="text-[8.5px] text-slate-500 font-bold block uppercase tracking-wider">Teklif detayları müşteriye sunuldu.</span>
            </div>
          </div>

          {/* Step 3: Müşteri Onayı */}
          <div className="relative">
            <div className={`absolute -left-[21px] top-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center border text-[8px] font-black ${
              ['Müşteri Onayı', 'Sözleşme Bekliyor', 'Sözleşme İmzalandı', 'Yayında', 'Tamamlandı'].includes(offer.stage)
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : offer.stage === 'Teklif Gönderildi'
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 ring-2 ring-blue-500/20'
                  : 'bg-slate-800 border-white/5 text-slate-500'
            }`}>
              {['Müşteri Onayı', 'Sözleşme Bekliyor', 'Sözleşme İmzalandı', 'Yayında', 'Tamamlandı'].includes(offer.stage) ? '✓' : '3'}
            </div>
            <div className="space-y-0.5">
              <span className={`font-black uppercase tracking-wide block ${offer.stage === 'Müşteri Onayı' ? 'text-blue-400' : 'text-slate-400'}`}>Müşteri Onayı</span>
              <span className="text-[8.5px] text-slate-500 font-bold block uppercase tracking-wider">Müşterinin sözel veya yazılı onayı alındı.</span>
            </div>
          </div>

          {/* Step 4: Sözleşme İmzalandı */}
          <div className="relative">
            <div className={`absolute -left-[21px] top-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center border text-[8px] font-black ${
              ['Sözleşme İmzalandı', 'Yayında', 'Tamamlandı'].includes(offer.stage)
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : offer.stage === 'Sözleşme Bekliyor'
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 ring-2 ring-blue-500/20'
                  : 'bg-slate-800 border-white/5 text-slate-500'
            }`}>
              {['Sözleşme İmzalandı', 'Yayında', 'Tamamlandı'].includes(offer.stage) ? '✓' : '4'}
            </div>
            <div className="space-y-0.5">
              <span className={`font-black uppercase tracking-wide block ${['Sözleşme İmzalandı', 'Sözleşme Bekliyor'].includes(offer.stage) ? 'text-blue-400' : 'text-slate-400'}`}>Sözleşme İmzalandı</span>
              <span className="text-[8.5px] text-slate-500 font-bold block uppercase tracking-wider">Islak veya dijital imza süreci tamamlandı.</span>
            </div>
          </div>

          {/* Step 5: Yayında */}
          <div className="relative">
            <div className={`absolute -left-[21px] top-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center border text-[8px] font-black ${
              ['Yayında', 'Tamamlandı'].includes(offer.stage) ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-white/5 text-slate-500'
            }`}>
              {['Yayında', 'Tamamlandı'].includes(offer.stage) ? '✓' : '5'}
            </div>
            <div className="space-y-0.5">
              <span className={`font-black uppercase tracking-wide block ${offer.stage === 'Yayında' ? 'text-blue-400' : 'text-slate-400'}`}>Yayında</span>
              <span className="text-[8.5px] text-slate-500 font-bold block uppercase tracking-wider">Reklam mecraları aktif olarak yayına başladı.</span>
            </div>
          </div>

          {/* Step 6: Tamamlandı */}
          <div className="relative">
            <div className={`absolute -left-[21px] top-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center border text-[8px] font-black ${
              offer.stage === 'Tamamlandı' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-white/5 text-slate-500'
            }`}>
              {offer.stage === 'Tamamlandı' ? '✓' : '6'}
            </div>
            <div className="space-y-0.5">
              <span className={`font-black uppercase tracking-wide block ${offer.stage === 'Tamamlandı' ? 'text-blue-400' : 'text-slate-400'}`}>Tamamlandı</span>
              <span className="text-[8.5px] text-slate-500 font-bold block uppercase tracking-wider">Yayın süresi bitti ve kampanya sonlandı.</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Sales Optimizer Suggestion */}
      {offer.spacesList && offer.spacesList.length > 0 && (
        <div className="p-3.5 bg-gradient-to-br from-blue-950/20 to-indigo-950/30 border border-blue-500/10 rounded-2xl text-left select-none space-y-1.5">
          <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1.5 leading-none">
            <Sparkles size={11} className="animate-pulse" />
            AI Satış Analizi
          </span>
          <p className="text-[9.5px] text-slate-400 font-bold leading-normal m-0">
            Bu teklif için {offer.spacesList[0] || 'seçili'} alanının 15 gün içinde boşalacağı dikkate alınarak teklif süresinin hızlandırılması önerilir.
          </p>
        </div>
      )}

      {/* Bottom CTA Actions */}
      <div className="grid grid-cols-2 gap-2 pt-3.5 border-t border-white/5">
        <Button variant="outline" size="sm" leftIcon={<FileText size={12} />} onClick={() => alert('PDF Teklif belgesi indiriliyor...')}>
          PDF Oluştur
        </Button>
        <Button variant="minimal" size="sm" leftIcon={<CalendarCheck size={12} />} className="text-[10px]" onClick={() => alert('Fırsat Rezervasyon takvimine aktarılıyor...')}>
          Rezervasyona Çevir
        </Button>
        
        {offer.companyId && (
          <Button variant="ghost" size="sm" leftIcon={<BookOpen size={12} />} className="col-span-2 text-[10px] border border-white/5" onClick={() => {
            const params = new URLSearchParams();
            params.set('companyId', offer.companyId || '');
            window.location.href = `/firmalar-markalar?${params.toString()}`;
          }}>
            Firma Kartını Aç
          </Button>
        )}
      </div>
    </div>
  );
}
