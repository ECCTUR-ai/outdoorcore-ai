import React from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { parseAnyDate } from '@/utils/dateHelper';

interface FinanceSummaryCardProps {
  accounts?: any[];
}

export function FinanceSummaryCard({ accounts = [] }: FinanceSummaryCardProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let totalPaidVadesiGelmis = 0;
  let totalTotalVadesiGelmis = 0;
  let totalOverdue = 0;
  let currentMonthTarget = 0;

  let nearestInstallmentClient = '';
  let nearestInstallmentDays = 999;
  let nearestInstallmentAmt = 0;

  let highestRiskClientName = '';
  let highestRiskScore = 0;

  accounts.forEach(acc => {
    const score = acc.riskScore || 0;
    if (score > highestRiskScore) {
      highestRiskScore = score;
      highestRiskClientName = acc.name;
    }

    const plans = acc.paymentPlan || [];
    plans.forEach((plan: any) => {
      const planAmt = parseFloat((plan.amount || '').replace(/[^0-9]/g, '')) || 0;
      const planDate = parseAnyDate(plan.dueDate);
      if (!planDate) return;

      const isUnpaid = plan.status !== 'Ödendi';

      // 1. Success Rate variables (dueDate <= today only)
      const isDueOrPast = planDate.getTime() <= today.getTime();
      if (isDueOrPast) {
        if (plan.status === 'Ödendi') {
          totalPaidVadesiGelmis += planAmt;
          totalTotalVadesiGelmis += planAmt;
        } else {
          totalTotalVadesiGelmis += planAmt;
        }
      }

      // 2. Overdue
      const isPast = planDate.getTime() < today.getTime();
      if (plan.status === 'Gecikti' || (isUnpaid && isPast)) {
        totalOverdue += planAmt;
      }

      // 3. Current month target (any unpaid due in current calendar month)
      const isThisMonth = planDate.getFullYear() === today.getFullYear() && planDate.getMonth() === today.getMonth();
      if (isThisMonth && isUnpaid) {
        currentMonthTarget += planAmt;
      }

      // 4. Nearest unpaid future installment
      if (isUnpaid && planDate.getTime() >= today.getTime()) {
        const diffDays = Math.ceil((planDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays < nearestInstallmentDays) {
          nearestInstallmentDays = diffDays;
          nearestInstallmentClient = acc.name;
          nearestInstallmentAmt = planAmt;
        }
      }
    });
  });

  const successRateText = totalTotalVadesiGelmis > 0 
    ? `%${((totalPaidVadesiGelmis / totalTotalVadesiGelmis) * 100).toFixed(1)}` 
    : 'Veri yok';

  const formatLargeAmount = (val: number) => {
    if (val === 0) return '₺0';
    if (val >= 1000000) return `₺ ${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `₺ ${(val / 1000).toFixed(0)}K`;
    return `₺ ${val.toLocaleString('tr-TR')}`;
  };

  const hasData = accounts.length > 0;

  if (!hasData) {
    return (
      <div className="bg-gradient-to-br from-blue-950/40 to-indigo-950/40 border border-blue-500/15 rounded-3xl p-6.5 text-center select-none space-y-4 shadow-xl flex flex-col justify-center items-center">
        <Sparkles size={20} className="text-slate-500 animate-pulse" />
        <h4 className="text-xs font-black text-white uppercase tracking-widest leading-none">OutdoorCore AI</h4>
        <span className="text-xs font-bold text-slate-500 italic">Henüz yeterli finansal veri bulunmuyor.</span>
      </div>
    );
  }

  const points = [
    highestRiskClientName && highestRiskScore > 2.0
      ? `${highestRiskClientName} faturasında risk skoru nedeniyle gecikme ihtimali yüksektir.`
      : 'Tüm aktif cari hesapların ödeme durumları güvenli ve stabildir.',
    nearestInstallmentClient 
      ? `${nearestInstallmentClient} carisinin sıradaki ödemesi (${formatLargeAmount(nearestInstallmentAmt)}) ${nearestInstallmentDays} gün içinde beklenmektedir.`
      : 'Yakın tarihte vadesi gelen bekleyen tahsilat kaydı bulunmamaktadır.',
    totalOverdue > 0
      ? `Vadesi geçen toplam gecikmiş alacak tutarı ${formatLargeAmount(totalOverdue)} seviyesindedir.`
      : 'Vadesi geçmiş geciken tahsilat kaydı bulunmamaktadır.',
    `Bu ay sonuna kadar hedeflenen net tahsilat girdisi: ${formatLargeAmount(currentMonthTarget)}.`,
    `Genel tahsilat başarı oranı: ${successRateText} olarak gerçekleşmiştir.`
  ];

  return (
    <div className="bg-gradient-to-br from-blue-950/40 to-indigo-950/40 border border-blue-500/15 rounded-3xl p-6.5 text-left select-none space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Sparkles size={16} className="animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest leading-none">OutdoorCore AI</h4>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">Finansal Akıl ve Tahsilat Analizi</span>
          </div>
        </div>
        <span className="text-[8.5px] bg-emerald-500/10 text-emerald-450 border border-emerald-500/10 px-2.5 py-0.8 rounded-full font-black uppercase tracking-widest">Finansal Yapay Zeka</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-1">
        {points.map((pt, idx) => (
          <div 
            key={idx}
            className="p-4.5 rounded-2xl bg-[#08111f]/35 border border-white/5 flex flex-col justify-between hover:border-white/10 transition-all group"
          >
            <span className="text-[10px] text-slate-350 font-bold leading-normal">{pt}</span>
            <div className="flex items-center gap-1 text-[8px] font-black text-blue-400 uppercase mt-4.5 opacity-60 group-hover:opacity-100 transition-opacity">
              <span>Raporu Aç</span>
              <ArrowUpRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
