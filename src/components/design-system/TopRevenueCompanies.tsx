import React from 'react';
import { financeData, FinancialAccount } from '@/data/finance';
import { Award } from 'lucide-react';

function TopRevenueRowLogo({ item }: { item: FinancialAccount }) {
  const [imageError, setImageError] = React.useState(false);
  if (item.logoUrl && !imageError) {
    return (
      <img 
        src={item.logoUrl} 
        onError={() => setImageError(true)} 
        className="w-7 h-7 rounded-lg object-contain border border-white/5 bg-slate-950 p-0.5 shrink-0" 
        alt={item.name} 
      />
    );
  }
  return (
    <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-[10px] flex items-center justify-center shrink-0">
      {item.logo}
    </div>
  );
}

export function TopRevenueCompanies() {
  const items = financeData.accounts;

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left select-none max-h-72 overflow-y-auto">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
        <Award size={13} />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">En Çok Ciro Yapan Firmalar</h4>
      </div>

      <div className="space-y-2.5 pt-0.5">
        {items.map((item, idx) => (
          <div 
            key={idx} 
            className="p-2.5 rounded-xl bg-[#08111f]/30 border border-white/5 flex items-center justify-between text-[9.5px] hover:bg-white/3 duration-105"
          >
            <div className="flex items-center gap-2 min-w-0">
              <TopRevenueRowLogo item={item} />
              <div className="space-y-0.5 truncate leading-none">
                <span className="text-white font-extrabold block truncate leading-none">{item.name}</span>
                <span className="text-[8px] text-slate-550 font-bold block mt-0.5 uppercase tracking-wide">{item.crmTier} Cari</span>
              </div>
            </div>
            <div className="text-right shrink-0 leading-none">
              <span className="text-[10px] font-black block text-emerald-450 leading-none">{item.totalDebt}</span>
              <span className="text-[8px] text-slate-550 font-bold block mt-0.5 uppercase tracking-wide">Toplam Borç</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
