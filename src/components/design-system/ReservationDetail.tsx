import React from 'react';
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
  FolderOpen
} from 'lucide-react';
import { EntityLink } from './EntityLink';

interface ReservationDetailProps {
  reservation: Reservation;
}

export function ReservationDetail({ reservation }: ReservationDetailProps) {
  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-5 text-left sticky top-[95px] max-h-[calc(100vh-130px)] overflow-y-auto">
      {/* Header Profile Title */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[9px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/10 uppercase tracking-widest inline-block">
            {reservation.spaceCode}
          </span>
          <h4 className="text-sm font-black text-white leading-tight uppercase truncate max-w-[200px]">{reservation.clientName}</h4>
          <span className="text-[8px] text-slate-550 font-bold uppercase tracking-wider block">{reservation.spaceName}</span>
        </div>
        <Badge variant={reservation.status === 'Aktif' ? 'success' : 'primary'}>
          {reservation.status}
        </Badge>
      </div>

      {/* Booking Core Metadata */}
      <div className="grid grid-cols-2 gap-3.5 border-t border-b border-white/5 py-4 text-[10.5px] font-semibold text-slate-400">
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
        <div className="col-span-2 flex items-center gap-2">
          <Building2 size={12} className="text-slate-500 shrink-0" />
          <span>Medya Ajansı: <span className="text-white font-bold">{reservation.agencyName}</span></span>
        </div>
      </div>

      {/* Uploaded Creative Files */}
      <div className="space-y-2 text-left">
        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 leading-none mb-2.5">
          <Paperclip size={11} className="text-blue-400" />
          Teslim Edilen Kreatifler
        </h5>
        <div className="space-y-1.5">
          {reservation.creativeFiles.map((file, idx) => (
            <div 
              key={idx} 
              className="p-2.5 rounded-xl bg-white/3 border border-white/5 flex items-center justify-between text-[10px] hover:bg-white/5 duration-100"
            >
              <span className="text-slate-300 font-bold truncate max-w-[200px]">{file}</span>
              <span className="text-[7.5px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-black uppercase">
                {file.split('.').pop()?.toUpperCase() || 'DOSYA'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Global Linked References */}
      <div className="space-y-2.5 border-t border-white/5 pt-4">
        <Label>Modüller Arası Bağlı Kayıtlar</Label>
        <div className="flex flex-wrap gap-2.5">
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

      {/* AI Scheduling Recommendation */}
      <div className="p-3.5 bg-gradient-to-br from-blue-950/20 to-indigo-950/30 border border-blue-500/10 rounded-2xl text-left select-none space-y-1.5">
        <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1.5 leading-none">
          <Sparkles size={11} className="animate-pulse" />
          AI Planlama Önerisi
        </span>
        <p className="text-[9.5px] text-slate-400 font-bold leading-normal m-0">{reservation.aiRecommendation}</p>
      </div>

      {/* Bottom CTA Actions */}
      <div className="grid grid-cols-2 gap-2 pt-3.5 border-t border-white/5">
        <Button variant="primary" size="sm" leftIcon={<FileEdit size={12} />} onClick={() => alert(`${reservation.spaceCode} rezervasyon düzenleme paneli açılacak.`)}>
          Rezervasyonu Düzenle
        </Button>
        <Button variant="outline" size="sm" leftIcon={<FileText size={12} />} onClick={() => alert('Sözleşmeler sayfasına yönlendirilecek mockup.')}>
          Sözleşmeye Git
        </Button>
        <Button variant="minimal" size="sm" leftIcon={<FolderOpen size={12} />} className="col-span-2 text-[10px]" onClick={() => alert(`${reservation.clientName} CRM kartı açılıyor...`)}>
          Firma Kartını Aç
        </Button>
      </div>
    </div>
  );
}
