import React from 'react';
import { Campaign } from '@/data/campaigns';
import { CampaignStatusBadge } from './CampaignStatusBadge';
import { Badge } from './Badge';
import { Label } from './Form';
import { Button } from './Button';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Coins, 
  Sparkles, 
  Paperclip, 
  FileText,
  FileCheck,
  CalendarCheck,
  FolderOpen
} from 'lucide-react';
import { EntityLink } from './EntityLink';

interface CampaignDetailPanelProps {
  campaign: Campaign;
}

export function CampaignDetailPanel({ campaign }: CampaignDetailPanelProps) {
  const [imageError, setImageError] = React.useState(false);

  React.useEffect(() => {
    setImageError(false);
  }, [campaign.id]);

  const renderLogo = () => {
    if (campaign.logoUrl && !imageError) {
      return (
        <img 
          src={campaign.logoUrl} 
          onError={() => setImageError(true)} 
          className="w-18 h-18 rounded-2xl object-contain border border-white/5 bg-slate-950 p-2 shrink-0 shadow-sm" 
          alt={campaign.clientName} 
        />
      );
    }
    return (
      <div className="w-18 h-18 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-xl flex items-center justify-center shrink-0 shadow-sm">
        {campaign.logo}
      </div>
    );
  };

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-6 text-left lg:sticky lg:top-[95px] lg:max-h-[calc(100vh-130px)] overflow-y-auto">
      {/* Header Profile Title */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3.5">
          {renderLogo()}
          <div className="space-y-0.5">
            <h4 className="text-sm font-black text-white leading-tight uppercase truncate max-w-[150px]">{campaign.clientName}</h4>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{campaign.campaignName}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <CampaignStatusBadge status={campaign.status} />
          <span className="text-[9px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/10 flex items-center gap-0.8">
            <Sparkles size={8} />
            AI: {campaign.aiScore}
          </span>
        </div>
      </div>

      {/* Linked IDs specifications */}
      <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-3.5 text-center text-[9px] font-bold text-slate-500">
        <div className="p-2 rounded-xl bg-white/2 border border-white/5">
          <span className="block text-slate-500 uppercase">Teklif</span>
          <span className="block text-white uppercase font-black mt-0.5">{campaign.proposalId}</span>
        </div>
        <div className="p-2 rounded-xl bg-white/2 border border-white/5">
          <span className="block text-slate-500 uppercase">Sözleşme</span>
          <span className="block text-white uppercase font-black mt-0.5">{campaign.contractId}</span>
        </div>
        <div className="p-2 rounded-xl bg-white/2 border border-white/5">
          <span className="block text-slate-500 uppercase">Rezervasyon</span>
          <span className="block text-white uppercase font-black mt-0.5">{campaign.reservationId}</span>
        </div>
      </div>

      {/* Campaign Details Metadata */}
      <div className="grid grid-cols-2 gap-3.5 border-t border-white/5 pt-4 text-[10.5px] font-semibold text-slate-400">
        <div className="flex items-center gap-2">
          <Coins size={12} className="text-slate-500 shrink-0" />
          <span className="text-emerald-450 font-bold">{campaign.budget}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={12} className="text-slate-500 shrink-0" />
          <span className="truncate">{campaign.startDate} - {campaign.endDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <Building2 size={12} className="text-slate-500 shrink-0" />
          <span className="truncate">Medya: {campaign.mediaAgency}</span>
        </div>
        <div className="flex items-center gap-2">
          <Building2 size={12} className="text-slate-500 shrink-0" />
          <span className="truncate">Kreatif: {campaign.creativeAgency}</span>
        </div>
      </div>

      {/* Suggested Spaces */}
      <div className="space-y-2 text-left pt-1 border-t border-white/5">
        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 leading-none mb-2.5">
          <MapPin size={11} className="text-blue-400" />
          Yayın Reklam Alanları
        </h5>
        <div className="space-y-1.5">
          {campaign.spacesList.map((code, idx) => {
            const mappedId = campaign.spaceIds?.[idx] || 'SPC-0001';
            return (
              <div 
                key={code} 
                className="p-2.5 rounded-xl bg-white/3 border border-white/5 flex items-center justify-between text-[10px]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-white font-black">#{code}</span>
                  <EntityLink type="space" id={mappedId} label="Detay" />
                </div>
                <span className="text-[8px] text-slate-550 font-bold uppercase">LED Ekran</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Uploaded creative files */}
      <div className="space-y-2 text-left pt-1 border-t border-white/5">
        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 leading-none mb-2.5">
          <Paperclip size={11} className="text-blue-400" />
          Kreatif Dosya Arşivi
        </h5>
        <div className="space-y-1.5">
          {campaign.creativeFiles.map((file, idx) => (
            <div 
              key={idx} 
              className="p-2 rounded-xl bg-white/3 border border-white/5 flex items-center justify-between text-[9.5px]"
            >
              <span className="text-slate-350 font-bold truncate max-w-[170px]">{file.name}</span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[7.5px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-black uppercase">{file.type}</span>
                <Badge variant={file.status === 'Onaylandı' ? 'success' : file.status === 'Revize' ? 'danger' : 'warning'}>
                  {file.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Linked References */}
      <div className="space-y-2.5 border-t border-white/5 pt-4">
        <Label>Modüller Arası Bağlı Kayıtlar</Label>
        <div className="flex flex-wrap gap-2.5">
          {campaign.companyId && (
            <EntityLink type="company" id={campaign.companyId} label={`Firma: ${campaign.clientName}`} />
          )}
          {campaign.proposalId && (
            <EntityLink type="offer" id={campaign.proposalId} label={`Teklif: ${campaign.proposalId}`} />
          )}
          {campaign.contractId && (
            <EntityLink type="contract" id={campaign.contractId} label={`Sözleşme: ${campaign.contractId}`} />
          )}
          {campaign.reservationId && (
            <EntityLink type="reservation" id={campaign.reservationId} label={`Rezervasyon: ${campaign.reservationId}`} />
          )}
        </div>
      </div>

      {/* AI Campaign Analysis */}
      <div className="p-3.5 bg-gradient-to-br from-blue-950/20 to-indigo-950/30 border border-blue-500/10 rounded-2xl text-left select-none space-y-2">
        <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1.5 leading-none">
          <Sparkles size={11} className="animate-pulse" />
          AI Kampanya Analizi
        </span>
        <ul className="text-[9.5px] text-slate-400 space-y-1.5 pl-3 list-disc leading-normal font-semibold">
          {campaign.aiAnalysisNotes.map((note, idx) => (
            <li key={idx}>{note}</li>
          ))}
        </ul>
      </div>

      {/* Bottom CTA Action keys */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5">
        <Button variant="primary" size="sm" onClick={() => alert(`${campaign.campaignName} düzenleme modalı açılacak.`)}>
          Kampanyayı Düzenle
        </Button>
        <Button variant="outline" size="sm" onClick={() => alert('Medya kütüphanesi açılıyor...')}>
          Medya Dosyaları
        </Button>
        <Button variant="minimal" size="sm" leftIcon={<FileText size={12} />} className="col-span-2 text-[10px]" onClick={() => alert('Yayın Performans Raporu PDF oluşturuluyor...')}>
          Yayın Raporu Oluştur
        </Button>
        <Button variant="ghost" size="sm" leftIcon={<FolderOpen size={12} />} className="col-span-2 text-[10px] border border-white/5" onClick={() => alert(`${campaign.clientName} CRM kartı açılıyor...`)}>
          Firma Kartını Aç
        </Button>
      </div>
    </div>
  );
}
