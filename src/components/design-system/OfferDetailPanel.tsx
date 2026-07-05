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
  FileCheck,
  CalendarCheck,
  UserCheck,
  BookOpen
} from 'lucide-react';

import { EntityLink } from './EntityLink';

interface OfferDetailPanelProps {
  offer: Offer;
}

export function OfferDetailPanel({ offer }: OfferDetailPanelProps) {
  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-5 text-left sticky top-[95px] max-h-[calc(100vh-130px)] overflow-y-auto">
      {/* Header Profile Title */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[9px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/10 uppercase tracking-widest inline-block">
            Teklif: #{offer.id}
          </span>
          <h4 className="text-sm font-black text-white leading-tight uppercase truncate max-w-[200px]">{offer.clientName}</h4>
          <span className="text-[8.5px] text-slate-550 font-bold uppercase tracking-wider block truncate max-w-[200px]">{offer.campaignName}</span>
        </div>
        <Badge variant={offer.priority === 'Yüksek' ? 'danger' : 'warning'}>
          {offer.priority} Öncelik
        </Badge>
      </div>

      {/* Booking Core Metadata */}
      <div className="grid grid-cols-2 gap-3.5 border-t border-b border-white/5 py-4 text-[10.5px] font-semibold text-slate-400">
        <div className="flex items-center gap-2">
          <Coins size={12} className="text-slate-500 shrink-0" />
          <span className="text-emerald-450 font-bold">{offer.value}</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles size={12} className="text-slate-500 shrink-0" />
          <span>İhtimal: <span className="text-blue-400 font-bold">%{offer.closeProbability}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={12} className="text-slate-500 shrink-0" />
          <span className="truncate">Kapanış: {offer.closingDate}</span>
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
      <div className="space-y-2 text-left pt-1 border-t border-white/5 text-[10.5px] font-semibold text-slate-450">
        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2.5">
          Teklif Açıklaması
        </h5>
        <p className="text-[10px] text-slate-350 leading-relaxed m-0">{offer.details}</p>
      </div>

      {/* AI Sales Optimizer Suggestion */}
      <div className="p-3.5 bg-gradient-to-br from-blue-950/20 to-indigo-950/30 border border-blue-500/10 rounded-2xl text-left select-none space-y-1.5">
        <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1.5 leading-none">
          <Sparkles size={11} className="animate-pulse" />
          AI Satış Analizi
        </span>
        <p className="text-[9.5px] text-slate-400 font-bold leading-normal m-0">
          Bu teklif için {offer.spacesList[0] || 'seçili'} alanının 15 gün içinde boşalacağı dikkate alınarak teklif süresinin hızlandırılması önerilir.
        </p>
      </div>

      {/* Bottom CTA Actions */}
      <div className="grid grid-cols-2 gap-2 pt-3.5 border-t border-white/5">
        <Button variant="primary" size="sm" onClick={() => alert(`${offer.clientName} teklif formu açılacak.`)}>
          Teklifi Düzenle
        </Button>
        <Button variant="outline" size="sm" leftIcon={<FileText size={12} />} onClick={() => alert('PDF Teklif belgesi indiriliyor...')}>
          PDF Oluştur
        </Button>
        <Button variant="minimal" size="sm" leftIcon={<CalendarCheck size={12} />} className="col-span-2 text-[10px]" onClick={() => alert('Fırsat Rezervasyon takvimine aktarılıyor...')}>
          Rezervasyona Çevir
        </Button>
        <Button variant="ghost" size="sm" leftIcon={<FileCheck size={12} />} className="col-span-2 text-[10px]" onClick={() => alert('Teklif Sözleşmeler sayfasına aktarılıyor...')}>
          Sözleşmeye Çevir
        </Button>
        <Button variant="ghost" size="sm" leftIcon={<BookOpen size={12} />} className="col-span-2 text-[10px] border border-white/5" onClick={() => alert(`${offer.clientName} CRM kartı açılıyor...`)}>
          Firma Kartını Aç
        </Button>
      </div>
    </div>
  );
}
