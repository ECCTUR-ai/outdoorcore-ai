import React from 'react';
import { Input, Select } from './Form';
import { Search, Calendar, Sliders } from 'lucide-react';

interface ReservationFiltersProps {
  search: string;
  setSearch: (v: string) => void;
  clientFilter: string;
  setClientFilter: (v: string) => void;
  typeFilter: string;
  setTypeFilter: (v: string) => void;
  terminalFilter: string;
  setTerminalFilter: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
}

export function ReservationFilters({
  search,
  setSearch,
  clientFilter,
  setClientFilter,
  typeFilter,
  setTypeFilter,
  terminalFilter,
  setTerminalFilter,
  statusFilter,
  setStatusFilter
}: ReservationFiltersProps) {
  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-4.5 space-y-5 text-left max-h-[calc(100vh-130px)] overflow-y-auto">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 select-none text-slate-400">
        <Sliders size={13} />
        <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Takvim Filtreleri</span>
      </div>

      {/* Query Search */}
      <div className="space-y-1.5 select-none">
        <label className="text-[9px] text-slate-550 font-black uppercase tracking-wider">Arama Terimi</label>
        <div className="relative">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Firma veya alan kodu ara..."
            className="pl-9"
          />
        </div>
      </div>

      {/* Dropdown Filters */}
      <div className="space-y-3.5 select-none">
        <div className="space-y-1">
          <label className="text-[9px] text-slate-550 font-black uppercase tracking-wider">Reklam Veren Firma</label>
          <Select value={clientFilter} onChange={(e) => setClientFilter(e.target.value)}>
            <option value="">Tüm Firmalar</option>
            <option value="Samsung Electronics">Samsung Electronics</option>
            <option value="Turkcell">Turkcell</option>
            <option value="Türk Hava Yolları">Türk Hava Yolları</option>
            <option value="LC Waikiki">LC Waikiki</option>
            <option value="Mercedes-Benz Türkiye">Mercedes-Benz Türkiye</option>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] text-slate-550 font-black uppercase tracking-wider">Ünite Alan Tipi</label>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">Tüm Tipler</option>
            <option value="LED">LED Ekran</option>
            <option value="Lightbox">Lightbox</option>
            <option value="Digital">Digital Panel</option>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] text-slate-550 font-black uppercase tracking-wider">Terminal / Konum</label>
          <Select value={terminalFilter} onChange={(e) => setTerminalFilter(e.target.value)}>
            <option value="">Tüm Konumlar</option>
            <option value="İç Hatlar">İç Hatlar</option>
            <option value="Dış Hatlar">Dış Hatlar</option>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] text-slate-550 font-black uppercase tracking-wider">Rezervasyon Durumu</label>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Tüm Durumlar</option>
            <option value="Aktif">Aktif</option>
            <option value="Yaklaşan">Yaklaşan</option>
          </Select>
        </div>
      </div>

      {/* Quick Filter buttons */}
      <div className="space-y-2 border-t border-white/5 pt-4 text-left select-none">
        <span className="text-[8.5px] font-black text-slate-500 uppercase tracking-widest block mb-2">Hızlı Filtreler</span>
        <div className="flex flex-wrap gap-1.5">
          {['Bugün', 'Bu Hafta', 'Bu Ay', 'Premium', 'LED', 'Lightbox', 'Digital'].map(label => (
            <button
              key={label}
              onClick={() => alert(`"${label}" filtresi uygulandı (mockup).`)}
              className="px-2 py-1.2 rounded-lg bg-white/3 hover:bg-white/5 border border-white/5 text-[9px] font-black text-slate-350 hover:text-white transition-all cursor-pointer"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
