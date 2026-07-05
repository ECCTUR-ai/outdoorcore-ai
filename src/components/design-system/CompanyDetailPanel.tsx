import React from 'react';
import { Company } from '@/data/companies';
import { SpaceStatusBadge } from './SpaceStatusBadge';
import { Badge } from './Badge';
import { Label } from './Form';
import { ContactCard } from './ContactCard';
import { CompanyTabs } from './CompanyTabs';
import { 
  Building2, 
  MapPin, 
  Tv, 
  Activity, 
  Sparkles, 
  Layers, 
  DollarSign, 
  Folder 
} from 'lucide-react';

interface CompanyDetailPanelProps {
  company: Company;
}

export function CompanyDetailPanel({ company }: CompanyDetailPanelProps) {
  const [imageError, setImageError] = React.useState(false);

  React.useEffect(() => {
    setImageError(false);
  }, [company.id]);

  const renderLogo = () => {
    if (company.logoUrl && !imageError) {
      return (
        <img 
          src={company.logoUrl} 
          onError={() => setImageError(true)} 
          className="w-18 h-18 rounded-2xl object-contain border border-white/5 bg-slate-950 p-2 shrink-0 shadow-sm" 
          alt={company.name} 
        />
      );
    }
    return (
      <div className="w-18 h-18 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-xl flex items-center justify-center shrink-0 shadow-sm">
        {company.logo}
      </div>
    );
  };

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-6 text-left sticky top-[95px] max-h-[calc(100vh-130px)] overflow-y-auto">
      {/* Header Profile Title card */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3.5">
          {renderLogo()}
          <div className="space-y-0.5">
            <h4 className="text-sm font-black text-white leading-tight uppercase">{company.name}</h4>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{company.sector} | {company.city}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <Badge variant={company.crmStatus === 'VIP' ? 'danger' : company.crmStatus === 'Gold' ? 'warning' : 'info'}>
            {company.crmStatus}
          </Badge>
          <span className="text-[9px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/10 flex items-center gap-0.8">
            <Sparkles size={8} />
            AI Skoru: {company.aiScore}
          </span>
        </div>
      </div>

      {/* Temsilciler & Yetkililer */}
      <div className="space-y-2.5">
        <Label>Firma Yetkilileri</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {company.contacts.map(c => (
            <ContactCard key={c.name} name={c.name} role={c.role} />
          ))}
        </div>
      </div>

      {/* Medya & Kreatif Ajansları */}
      <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4 text-[10px] font-semibold text-slate-400">
        <div className="space-y-0.5">
          <span className="text-[8.5px] text-slate-550 block uppercase tracking-wider">Medya Ajansı</span>
          <span className="text-white font-extrabold block">{company.mediaAgency}</span>
        </div>
        <div className="space-y-0.5">
          <span className="text-[8.5px] text-slate-550 block uppercase tracking-wider">Kreatif Ajans</span>
          <span className="text-white font-extrabold block">{company.creativeAgency}</span>
        </div>
      </div>

      {/* Hacim ve Harcamalar */}
      <div className="grid grid-cols-3 gap-3.5 border-t border-white/5 pt-4">
        <div className="p-3 rounded-2xl bg-white/3 border border-white/5 space-y-0.5">
          <span className="text-[8.5px] text-slate-500 block uppercase tracking-wider">Bütçe</span>
          <span className="text-white block text-xs font-black">{company.budget}</span>
        </div>
        <div className="p-3 rounded-2xl bg-white/3 border border-white/5 space-y-0.5">
          <span className="text-[8.5px] text-slate-500 block uppercase tracking-wider">Kampanya</span>
          <span className="text-white block text-xs font-black">{company.campaignsCount} adet</span>
        </div>
        <div className="p-3 rounded-2xl bg-white/3 border border-white/5 space-y-0.5">
          <span className="text-[8.5px] text-slate-500 block uppercase tracking-wider">Aktif Alan</span>
          <span className="text-slate-200 block text-xs font-black">{company.activeSpacesCount} pano</span>
        </div>
      </div>

      {/* Son & Gelecek Kampanyalar */}
      <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4 text-[10px] font-semibold text-slate-400">
        <div className="space-y-0.5">
          <span className="text-[8.5px] text-slate-550 block uppercase tracking-wider">Son Kampanya</span>
          <span className="text-slate-200 font-extrabold block uppercase truncate">{company.lastCampaign}</span>
        </div>
        <div className="space-y-0.5">
          <span className="text-[8.5px] text-slate-550 block uppercase tracking-wider">Gelecek Kampanya</span>
          <span className="text-blue-400 font-extrabold block uppercase truncate">{company.upcomingCampaign}</span>
        </div>
      </div>

      {/* AI Asistan Önerileri */}
      <div className="p-3.5 bg-gradient-to-br from-blue-950/20 to-indigo-950/30 border border-blue-500/10 rounded-2xl text-left select-none space-y-2">
        <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1.5 leading-none">
          <Sparkles size={11} className="animate-pulse" />
          AI CRM Önerileri
        </span>
        <ul className="text-[9.5px] text-slate-400 space-y-1.5 pl-3 list-disc leading-normal font-semibold">
          <li>Haziran ayında boşalacak premium LED ekranlar öneriliyor.</li>
          <li>İç Hatlar Giriş LED ekranı Samsung için yüksek performans gösteriyor.</li>
        </ul>
      </div>

      {/* Sub-Tabs selector widgets */}
      <div className="border-t border-white/5 pt-4">
        <CompanyTabs company={company} />
      </div>
    </div>
  );
}
