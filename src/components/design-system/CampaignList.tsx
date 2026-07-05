import React, { useState } from 'react';
import { Campaign } from '@/data/campaigns';
import { Search } from 'lucide-react';
import { Input, Select } from './Form';

interface CampaignListProps {
  campaigns: Campaign[];
  selectedId: string;
  onSelect: (id: string) => void;
}

function CampaignListRowLogo({ campaign }: { campaign: Campaign }) {
  const [imageError, setImageError] = React.useState(false);
  if (campaign.logoUrl && !imageError) {
    return (
      <img 
        src={campaign.logoUrl} 
        onError={() => setImageError(true)} 
        className="w-8 h-8 rounded-lg object-contain border border-white/5 bg-slate-950 p-0.5 shrink-0" 
        alt={campaign.clientName} 
      />
    );
  }
  return (
    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-[10px] flex items-center justify-center shrink-0">
      {campaign.logo}
    </div>
  );
}

export function CampaignList({ campaigns, selectedId, onSelect }: CampaignListProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = campaigns.filter(c => {
    const matchesSearch = c.campaignName.toLowerCase().includes(search.toLowerCase()) || 
                          c.clientName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === '' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dark-glass-card rounded-2xl p-4 border border-white/5 space-y-4 text-left max-h-[calc(100vh-130px)] overflow-y-auto select-none">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 select-none">Kampanya Arama</span>

      {/* Query Search */}
      <div className="space-y-2 select-none">
        <div className="relative">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Kampanya veya firma ara..."
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 px-2 text-[9.5px]">
          <option value="">Tüm Durumlar</option>
          <option value="Aktif">Aktif Yayında</option>
          <option value="Planlandı">Planlandı</option>
          <option value="Onay Bekliyor">Onay Bekliyor</option>
          <option value="Tamamlandı">Tamamlandı</option>
        </Select>
      </div>

      {/* List items mapping */}
      <div className="border-t border-white/5 pt-3.5 space-y-2">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block pl-1 select-none">Kampanya Kayıtları ({filtered.length})</span>
        <div className="space-y-1.5">
          {filtered.map(campaign => {
            const isSelected = selectedId === campaign.id;
            return (
              <button
                key={campaign.id}
                onClick={() => onSelect(campaign.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-left cursor-pointer group ${
                  isSelected 
                    ? 'border-blue-500/20 bg-[#22314a]/30 text-white font-extrabold' 
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/3'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <CampaignListRowLogo campaign={campaign} />
                  <div className="space-y-0.5 truncate leading-none">
                    <span className="text-[10.5px] font-extrabold block truncate leading-none text-white">{campaign.campaignName}</span>
                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">{campaign.clientName}</span>
                  </div>
                </div>
                <div className="text-right shrink-0 leading-none">
                  <span className="text-[10.5px] font-black block text-emerald-450 leading-none">%{campaign.successRate}</span>
                  <span className="text-[7.5px] text-slate-500 font-black block uppercase mt-0.5 tracking-tighter">{campaign.status}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
