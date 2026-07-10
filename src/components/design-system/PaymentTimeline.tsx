import React from 'react';
import { CalendarRange } from 'lucide-react';
import { parseAnyDate } from '@/utils/dateHelper';

interface PaymentTimelineProps {
  accounts: any[];
}

export function PaymentTimeline({ accounts }: PaymentTimelineProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const endOfWeek = new Date(today);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  const startOfNextPeriod = new Date(today);
  startOfNextPeriod.setDate(startOfNextPeriod.getDate() + 8);

  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  endOfMonth.setHours(0, 0, 0, 0);

  let gecikenTotal = 0;
  let gecikenCount = 0;
  const gecikenClients = new Set<string>();

  let bugunTotal = 0;
  let bugunCount = 0;
  const bugunClients = new Set<string>();

  let haftaTotal = 0;
  let haftaCount = 0;
  const haftaClients = new Set<string>();

  let ayTotal = 0;
  let ayCount = 0;
  const ayClients = new Set<string>();

  (accounts || []).forEach(acc => {
    const plans = acc.paymentPlan || [];
    plans.forEach((plan: any) => {
      const planAmt = parseFloat((plan.amount || '').replace(/[^0-9]/g, '')) || 0;
      const planDate = parseAnyDate(plan.dueDate);
      if (!planDate) return;

      const isUnpaid = plan.status !== 'Ödendi';
      if (!isUnpaid) return; // Only open/unpaid balances go to timeline

      const planTime = planDate.getTime();
      const todayTime = today.getTime();
      const tomorrowTime = tomorrow.getTime();
      const endOfWeekTime = endOfWeek.getTime();
      const startOfNextPeriodTime = startOfNextPeriod.getTime();
      const endOfMonthTime = endOfMonth.getTime();

      if (planTime < todayTime) {
        // 1. Gecikenler: bugünden önce vadesi geçmiş açık tutarlar
        gecikenTotal += planAmt;
        gecikenCount++;
        gecikenClients.add(acc.name);
      } else if (planTime === todayTime) {
        // 2. Bugün: yalnızca bugün vadeli açık tutarlar
        bugunTotal += planAmt;
        bugunCount++;
        bugunClients.add(acc.name);
      } else if (planTime >= tomorrowTime && planTime <= endOfWeekTime) {
        // 3. Bu Hafta: yarından başlayarak sonraki 7 gün içindeki açık tutarlar
        haftaTotal += planAmt;
        haftaCount++;
        haftaClients.add(acc.name);
      } else if (planTime >= startOfNextPeriodTime && planTime <= endOfMonthTime) {
        // 4. Bu Ay: hafta döneminden sonraki günlerden ay sonuna kadar açık tutarlar
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
