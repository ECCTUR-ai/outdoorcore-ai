import React from 'react';
import { financeData, UpcomingPayment } from '@/data/finance';
import { Badge } from './Badge';
import { Clock } from 'lucide-react';
import { EntityLink } from './EntityLink';

function UpcomingPaymentsRowLogo({ item }: { item: UpcomingPayment }) {
  const [imageError, setImageError] = React.useState(false);
  if (item.logoUrl && !imageError) {
    return (
      <img 
        src={item.logoUrl} 
        onError={() => setImageError(true)} 
        className="w-7 h-7 rounded-lg object-contain border border-white/5 bg-slate-950 p-0.5 shrink-0" 
        alt={item.clientName} 
      />
    );
  }
  return (
    <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-[10px] flex items-center justify-center shrink-0">
      {item.logo}
    </div>
  );
}

export function UpcomingPayments() {
  const items = financeData.upcomingPayments;

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left select-none max-h-72 overflow-y-auto">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
        <Clock size={13} />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Vadesi Yaklaşan Ödemeler</h4>
      </div>

      <div className="space-y-2.5 pt-0.5">
        {items.map((item, idx) => {
          const matchingAccount = financeData.accounts.find(acc => acc.name === item.clientName);
          return (
            <div 
              key={idx} 
              className="p-2.5 rounded-xl bg-[#08111f]/30 border border-white/5 flex items-center justify-between text-[9.5px] hover:bg-white/3 duration-105"
            >
              <div className="flex items-center gap-2 min-w-0">
                <UpcomingPaymentsRowLogo item={item} />
                <div className="space-y-0.5 truncate leading-none">
                  <span className="text-white font-extrabold block truncate leading-none mb-1">{item.clientName}</span>
                  {matchingAccount?.companyId ? (
                    <EntityLink type="company" id={matchingAccount.companyId} label="Finans Kartı" />
                  ) : (
                    <span className="text-[7.5px] text-slate-550 font-bold block">Firma Tanımsız</span>
                  )}
                  <span className="text-[8px] text-slate-550 font-bold block mt-1 uppercase tracking-wide">
                    {item.daysLeft < 0 ? `${Math.abs(item.daysLeft)} gün gecikti` : `${item.daysLeft} gün kaldı`}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0 leading-none">
                <span className="text-[10px] font-black block text-white leading-none">{item.amount}</span>
                <div className="scale-[0.8] origin-right mt-1.5">
                  <Badge variant={
                    item.riskLevel === 'Kritik' ? 'danger' :
                    item.riskLevel === 'Yüksek' ? 'danger' :
                    item.riskLevel === 'Orta' ? 'warning' : 'success'
                  }>
                    {item.riskLevel} Risk
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
