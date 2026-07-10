import React from 'react';
import { CalendarRange } from 'lucide-react';

interface PaymentTimelineProps {
  accounts: any[];
}

export function PaymentTimeline({ accounts }: PaymentTimelineProps) {
  // Helper to parse DD.MM.YYYY string
  const parseDate = (str?: string): Date | null => {
    if (!str) return null;
    const parts = str.split('.');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let gecikenTotal = 0;
  let gecikenCount = 0;

  let bugunTotal = 0;
  let bugunCount = 0;

  let haftaTotal = 0;
  let haftaCount = 0;

  let ayTotal = 0;
  let ayCount = 0;

  // Track distinct clients
  const gecikenClients = new Set<string>();
  const bugunClients = new Set<string>();
  const haftaClients = new Set<string>();
  const ayClients = new Set<string>();

  (accounts || []).forEach(acc => {
    const plans = acc.paymentPlan || [];
    plans.forEach((plan: any) => {
      const planAmt = parseFloat((plan.amount || '').replace(/[^0-9]/g, '')) || 0;
      const planDate = parseDate(plan.dueDate);
      if (!planDate) return;

      const isUnpaid = plan.status !== 'Ödendi';

      // 1. Gecikenler
      const isPastDue = planDate.getTime() < today.getTime();
      if (plan.status === 'Gecikti' || (isUnpaid && isPastDue)) {
        gecikenTotal += planAmt;
        gecikenCount++;
        gecikenClients.add(acc.name);
      }

      // 2. Bugün
      const isToday = planDate.getTime() === today.getTime();
      if (isToday && isUnpaid) {
        bugunTotal += planAmt;
        bugunCount++;
        bugunClients.add(acc.name);
      }

      // 3. Bu Hafta
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      const isWithinWeek = planDate.getTime() >= today.getTime() && planDate.getTime() <= nextWeek.getTime();
      if (isWithinWeek && isUnpaid) {
        haftaTotal += planAmt;
        haftaCount++;
        haftaClients.add(acc.name);
      }

      // 4. Bu Ay
      const isWithinMonth = planDate.getFullYear() === today.getFullYear() && planDate.getMonth() === today.getMonth() && planDate.getTime() >= today.getTime();
      if (isWithinMonth && isUnpaid) {
        ayTotal += planAmt;
        ayCount++;
        ayClients.add(acc.name);
      }
    });
  });

  const formatCurrency = (val: number) => {
    return `₺ ${val.toLocaleString('tr-TR')}`;
  };

  const hasData = (accounts || []).length > 0;

  const events = [
    { 
      period: 'Gecikenler', 
      amount: hasData ? formatCurrency(gecikenTotal) : '₺ 0', 
      count: gecikenCount > 0 ? `${gecikenCount} Ödeme (${gecikenClients.size} Cari)` : 'Kayıt yok', 
      color: 'border-rose-500 text-rose-450 bg-rose-500/10' 
    },
    { 
      period: 'Bugün', 
      amount: hasData ? formatCurrency(bugunTotal) : '₺ 0', 
      count: bugunCount > 0 ? `${bugunCount} Ödeme` : 'Ödeme yok', 
      color: 'border-amber-500 text-amber-500 bg-amber-500/10' 
    },
    { 
      period: 'Bu Hafta', 
      amount: hasData ? formatCurrency(haftaTotal) : '₺ 0', 
      count: haftaCount > 0 ? `${haftaCount} Ödeme` : 'Ödeme yok', 
      color: 'border-blue-500 text-blue-400 bg-blue-500/10' 
    },
    { 
      period: 'Bu Ay', 
      amount: hasData ? formatCurrency(ayTotal) : '₺ 0', 
      count: ayCount > 0 ? `${ayCount} Ödeme` : 'Ödeme yok', 
      color: 'border-indigo-500 text-indigo-400 bg-indigo-500/10' 
    }
  ];

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left select-none">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
        <CalendarRange size={13} />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Tahsilat Takvimi</h4>
      </div>

      <div className="grid grid-cols-4 gap-3 pt-1 text-center">
        {events.map(ev => (
          <div 
            key={ev.period}
            className={`p-3.5 rounded-2xl border flex flex-col justify-between h-28 ${ev.color}`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest block leading-none">{ev.period}</span>
            <div className="space-y-0.5 my-auto">
              <span className="text-[11px] font-black block leading-snug">{ev.amount}</span>
              <span className="text-[8px] font-bold block opacity-70 truncate">{ev.count}</span>
            </div>
            <span className="text-[7.5px] font-black uppercase tracking-widest block leading-none">Takvim</span>
          </div>
        ))}
      </div>
    </div>
  );
}
