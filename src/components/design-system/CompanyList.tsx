import React, { useState } from 'react';
import { Company } from '@/data/companies';
import { Search } from 'lucide-react';
import { Input, Select } from './Form';

interface CompanyListProps {
  companies: Company[];
  selectedId: string;
  onSelect: (id: string) => void;
}

function CompanyListRowLogo({ company }: { company: Company }) {
  const [imageError, setImageError] = React.useState(false);
  if (company.logoUrl && !imageError) {
    return (
      <img 
        src={company.logoUrl} 
        onError={() => setImageError(true)} 
        className="w-8 h-8 rounded-lg object-contain border border-white/5 bg-slate-950 p-0.5 shrink-0" 
        alt={company.name} 
      />
    );
  }
  return (
    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-[10px] flex items-center justify-center shrink-0">
      {company.logo}
    </div>
  );
}

export function CompanyList({ companies, selectedId, onSelect }: CompanyListProps) {
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Extract unique sectors & cities for filters
  const sectors = Array.from(new Set(companies.map(c => c.sector)));
  const cities = Array.from(new Set(companies.map(c => c.city)));

  const filtered = companies.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.sector.toLowerCase().includes(search.toLowerCase());
    const matchesSector = sectorFilter === '' || c.sector === sectorFilter;
    const matchesCity = cityFilter === '' || c.city === cityFilter;
    const matchesStatus = statusFilter === '' || c.status === statusFilter;
    return matchesSearch && matchesSector && matchesCity && matchesStatus;
  });

  return (
    <div className="dark-glass-card rounded-2xl p-4 border border-white/5 space-y-4 text-left max-h-[calc(100vh-130px)] overflow-y-auto">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 select-none">Firma Filtreleri</span>
      
      {/* Filters search */}
      <div className="space-y-2.5 select-none">
        <div className="relative">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Firma veya sektör ara..."
            className="pl-9"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Select value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)} className="h-9 px-2 text-[9.5px]">
            <option value="">Sektör</option>
            {sectors.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
          <Select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="h-9 px-2 text-[9.5px]">
            <option value="">Şehir</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 px-2 text-[9.5px]">
            <option value="">Durum</option>
            <option value="Aktif">Aktif</option>
            <option value="Pasif">Pasif</option>
          </Select>
        </div>
      </div>

      {/* Row List */}
      <div className="border-t border-white/5 pt-3.5 space-y-2">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block pl-1 select-none">Kayıtlı Firmalar ({filtered.length})</span>
        <div className="space-y-1.5">
          {filtered.map(company => {
            const isSelected = selectedId === company.id;
            return (
              <button
                key={company.id}
                onClick={() => onSelect(company.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-left cursor-pointer group ${
                  isSelected 
                    ? 'border-blue-500/20 bg-[#22314a]/30 text-white font-extrabold' 
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/3'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <CompanyListRowLogo company={company} />
                  <div className="space-y-0.5 truncate leading-none">
                    <span className="text-[10.5px] font-extrabold block truncate leading-none text-white">{company.name}</span>
                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">{company.sector}</span>
                  </div>
                </div>
                <div className="text-right shrink-0 leading-none">
                  <span className="text-[10px] font-extrabold block text-white leading-none">{company.totalSpend}</span>
                  <span className="text-[7.5px] text-slate-500 font-black block uppercase mt-0.5">{company.activeSpacesCount} Aktif</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
