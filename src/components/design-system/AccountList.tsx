import React, { useState } from 'react';
import { FinancialAccount } from '@/data/finance';
import { Search } from 'lucide-react';
import { Input, Select } from './Form';

interface AccountListProps {
  accounts: FinancialAccount[];
  selectedId: string;
  onSelect: (id: string) => void;
}

function AccountListRowLogo({ account }: { account: FinancialAccount }) {
  const [imageError, setImageError] = React.useState(false);
  if (account.logoUrl && !imageError) {
    return (
      <img 
        src={account.logoUrl} 
        onError={() => setImageError(true)} 
        className="w-8 h-8 rounded-lg object-contain border border-white/5 bg-slate-950 p-0.5 shrink-0" 
        alt={account.name} 
      />
    );
  }
  return (
    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-[10px] flex items-center justify-center shrink-0">
      {account.logo}
    </div>
  );
}

export function AccountList({ accounts, selectedId, onSelect }: AccountListProps) {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('');

  const filtered = accounts.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());
    const matchesTier = tierFilter === '' || a.crmTier === tierFilter;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="dark-glass-card rounded-2xl p-4 border border-white/5 space-y-4 text-left max-h-[calc(100vh-130px)] overflow-y-auto select-none">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 select-none">Cari Hesaplar</span>

      {/* Query Search */}
      <div className="space-y-2 select-none">
        <div className="relative">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Cari firma ara..."
            className="pl-9"
          />
        </div>
        <Select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} className="h-9 px-2 text-[9.5px]">
          <option value="">Tüm Sınıflar</option>
          <option value="VIP">VIP</option>
          <option value="Gold">Gold</option>
          <option value="Standard">Standard</option>
        </Select>
      </div>

      {/* List items mapping */}
      <div className="border-t border-white/5 pt-3.5 space-y-2">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block pl-1 select-none">Cari Hesap Listesi ({filtered.length})</span>
        <div className="space-y-1.5">
          {filtered.map(account => {
            const isSelected = selectedId === account.id;
            return (
              <button
                key={account.id}
                onClick={() => onSelect(account.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-left cursor-pointer group ${
                  isSelected 
                    ? 'border-blue-500/20 bg-[#22314a]/30 text-white font-extrabold' 
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/3'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <AccountListRowLogo account={account} />
                  <div className="space-y-0.5 truncate leading-none">
                    <span className="text-[10.5px] font-extrabold block truncate leading-none text-white">{account.name}</span>
                    <span className="text-[8px] text-slate-505 font-bold uppercase tracking-wider block mt-0.5">{account.crmTier} CRM</span>
                  </div>
                </div>
                <div className="text-right shrink-0 leading-none">
                  <span className="text-[10.5px] font-black block text-white leading-none">{account.balance}</span>
                  <span className="text-[7.5px] text-slate-500 font-black block uppercase mt-0.5 tracking-tighter">Bakiye</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
