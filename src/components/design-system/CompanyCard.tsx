import React from 'react';
import { Company } from '@/data/companies';
import { Badge } from './Badge';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { Sparkles, MapPin, Coins, TrendingUp } from 'lucide-react';

interface CompanyCardProps {
  company: Company;
  onClick?: () => void;
  isActive?: boolean;
}

export function CompanyCard({ company, onClick, isActive }: CompanyCardProps) {
  const [imageError, setImageError] = React.useState(false);

  const renderLogo = () => {
    if (company.logoUrl && !imageError) {
      return (
        <img 
          src={company.logoUrl} 
          onError={() => setImageError(true)} 
          className="w-10 h-10 rounded-xl object-contain border border-white/5 bg-slate-950 p-1 shrink-0" 
          alt={company.name} 
        />
      );
    }
    return (
      <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
        {company.logo}
      </div>
    );
  };

  return (
    <div
      onClick={onClick}
      className={`dark-glass-card border rounded-2xl p-4.5 cursor-pointer transition-all duration-200 select-none text-left ${
        isActive 
          ? 'border-blue-500/30 bg-[#22314a]/30 shadow-md shadow-blue-500/5' 
          : 'border-white/5 hover:border-white/10 hover:bg-[#22314a]/20'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {renderLogo()}
          <div className="space-y-0.5">
            <h4 className="text-[11.5px] font-black text-white uppercase leading-none truncate max-w-[130px]">{company.name}</h4>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">{company.sector}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <Badge variant={company.crmStatus === 'VIP' ? 'danger' : company.crmStatus === 'Gold' ? 'warning' : 'info'} styleType="soft" className="scale-[0.8] origin-right">
            {company.crmStatus}
          </Badge>
          <span className="text-[9px] font-black text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded border border-blue-500/10 flex items-center gap-0.5 scale-[0.8] origin-right">
            <Sparkles size={8} />
            {company.aiScore}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-white/5 text-[10px]">
        <div className="space-y-0.5">
          <span className="text-slate-500 font-bold uppercase tracking-wider block">Toplam Harcama</span>
          <span className="text-white font-extrabold block">{company.totalSpend}</span>
        </div>
        <div className="space-y-0.5">
          <span className="text-slate-500 font-bold uppercase tracking-wider block">Aktif Alan</span>
          <span className="text-white font-extrabold block">{company.activeSpacesCount} / {company.campaignsCount} Kampanya</span>
        </div>
        <div className="col-span-2 space-y-0.5 border-t border-white/3 pt-2">
          <span className="text-slate-500 font-bold uppercase tracking-wider block">Son Kampanya</span>
          <span className="text-slate-300 font-semibold block truncate">{company.lastCampaign}</span>
        </div>
      </div>
    </div>
  );
}
