import React, { useState } from 'react';
import { Contract } from '@/data/contracts';
import { Search } from 'lucide-react';
import { Input, Select } from './Form';

interface ContractListProps {
  contracts: Contract[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function ContractList({ contracts, selectedId, onSelect }: ContractListProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [crmFilter, setCrmFilter] = useState('');

  const filtered = contracts.filter(c => {
    const matchesSearch = c.clientName.toLowerCase().includes(search.toLowerCase()) || 
                          c.contractNo.toLowerCase().includes(search.toLowerCase()) ||
                          c.campaignName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === '' || c.status === statusFilter;
    const matchesCrm = crmFilter === '' || c.crmTier === crmFilter;
    return matchesSearch && matchesStatus && matchesCrm;
  });

  return (
    <div className="dark-glass-card rounded-2xl p-4 border border-white/5 space-y-4 text-left max-h-[calc(100vh-130px)] overflow-y-auto">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 select-none">Sözleşme Arama</span>

      {/* Query Search */}
      <div className="space-y-2 select-none">
        <div className="relative">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Firma veya sözleşme no ara..."
            className="pl-9"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 px-2 text-[9px]">
            <option value="">Durumlar</option>
            <option value="Aktif">Aktif</option>
            <option value="İmza Bekleyen">İmza Bekleyen</option>
            <option value="Yenileme Bekleyen">Yenileme Bekleyen</option>
            <option value="Riskli">Kritik Risk</option>
          </Select>
          <Select value={crmFilter} onChange={(e) => setCrmFilter(e.target.value)} className="h-9 px-2 text-[9px]">
            <option value="">CRM Segment</option>
            <option value="VIP">VIP</option>
            <option value="Gold">Gold</option>
            <option value="Standard">Standard</option>
          </Select>
        </div>
      </div>

      {/* List items mapping */}
      <div className="border-t border-white/5 pt-3.5 space-y-2">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block pl-1 select-none">Sözleşme Kayıtları ({filtered.length})</span>
        <div className="space-y-1.5">
          {filtered.map(contract => {
            const isSelected = selectedId === contract.id;
            return (
              <button
                key={contract.id}
                onClick={() => onSelect(contract.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-left cursor-pointer group ${
                  isSelected 
                    ? 'border-blue-500/20 bg-[#22314a]/30 text-white font-extrabold' 
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/3'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-[10px] flex items-center justify-center shrink-0">
                    {contract.logo}
                  </div>
                  <div className="space-y-0.5 truncate leading-none">
                    <span className="text-[10.5px] font-extrabold block truncate leading-none text-white">{contract.clientName}</span>
                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">{contract.contractNo}</span>
                  </div>
                </div>
                <div className="text-right shrink-0 leading-none">
                  <span className="text-[10px] font-extrabold block text-white leading-none">{contract.value}</span>
                  <span className="text-[7.5px] text-slate-500 font-black block uppercase mt-0.5">{contract.daysLeft} Gün Kalan</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
