import React from 'react';
import { Campaign } from '@/data/campaigns';
import { CampaignStatusBadge } from './CampaignStatusBadge';
import { Badge } from './Badge';
import { Sparkles, Calendar, Tv, FileText } from 'lucide-react';

interface CampaignCardProps {
  campaign: Campaign;
  isActive: boolean;
  onClick: () => void;
}

export function CampaignCard({ campaign, isActive, onClick }: CampaignCardProps) {
  const [imageError, setImageError] = React.useState(false);

  const renderLogo = () => {
    if (campaign.logoUrl && !imageError) {
      return (
        <img 
          src={campaign.logoUrl} 
          onError={() => setImageError(true)} 
          className="w-10 h-10 rounded-xl object-contain border border-white/5 bg-slate-950 p-1 shrink-0 shadow-sm" 
          alt={campaign.clientName} 
        />
      );
    }
    return (
      <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
        {campaign.logo}
      </div>
    );
  };

  return (
    <div
      onClick={onClick}
      className={`dark-glass-card border rounded-2xl p-4.5 cursor-pointer transition-all duration-200 select-none text-left flex flex-col justify-between ${
        isActive 
          ? 'border-blue-500/30 bg-[#22314a]/30 shadow-md shadow-blue-500/5' 
          : 'border-white/5 hover:border-white/10 hover:bg-[#22314a]/25'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          {renderLogo()}
          <div className="space-y-0.5">
            <h4 className="text-[11px] font-black text-white uppercase leading-none truncate max-w-[120px]">{campaign.clientName}</h4>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block truncate max-w-[120px]">{campaign.campaignName}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <CampaignStatusBadge status={campaign.status} />
          <span className="text-[8px] font-black text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded border border-blue-500/10 flex items-center gap-0.5 mt-1 scale-[0.9] origin-right">
            <Sparkles size={8} />
            AI: {campaign.aiScore}
          </span>
        </div>
      </div>

      {/* Suggested Spaces Tags */}
      <div className="flex flex-wrap gap-1 mt-3">
        {campaign.spacesList.map(code => (
          <span key={code} className="px-1.5 py-0.2 rounded-lg bg-white/3 border border-white/5 text-[8.5px] font-black text-slate-400 tracking-tighter">
            {code}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4 pt-3.5 border-t border-white/5 text-[10px]">
        <div className="space-y-0.5">
          <span className="text-slate-500 font-bold uppercase tracking-wider block">Bütçe Hacmi</span>
          <span className="text-white font-extrabold block">{campaign.budget}</span>
        </div>
        <div className="space-y-0.5 text-right">
          <span className="text-slate-500 font-bold uppercase tracking-wider block">Kreatif Belge</span>
          <span className="text-slate-200 font-extrabold block">{campaign.creativesCount} Dosya</span>
        </div>
        
        {/* Success rate progress bar */}
        <div className="col-span-2 space-y-1.5 border-t border-white/3 pt-2 mt-1">
          <div className="flex justify-between items-center text-[8.5px] text-slate-500 font-bold uppercase tracking-wider">
            <span>Yayın Başarısı</span>
            <span className={campaign.successRate >= 90 ? 'text-emerald-400 font-black' : 'text-slate-400'}>
              %{campaign.successRate}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                campaign.successRate >= 95 ? 'bg-emerald-500 glow-green' : campaign.successRate >= 80 ? 'bg-amber-500 glow-yellow' : 'bg-slate-700'
              }`}
              style={{ width: `${campaign.successRate || 5}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
