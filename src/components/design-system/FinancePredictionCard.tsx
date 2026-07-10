import React from 'react';
import { Sparkles, Calendar, TrendingUp, Users } from 'lucide-react';
import { parseAnyDate } from '@/utils/dateHelper';

interface FinancePredictionCardProps {
  accounts?: any[];
}

export function FinancePredictionCard({ accounts = [] }: FinancePredictionCardProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const next30Days = new Date(today);
  next30Days.setDate(next30Days.getDate() + 30);

  let expectedRevenue30Days = 0;
  let totalPaidVadesiGelmis = 0;
  let totalTotalVadesiGelmis = 0; // Denominator
  let riskVolume = 0;

  // Track client metrics for details
  const clientRevenueMap = new Map<string, number>();
  let highestRiskClientName = '';
  let highestRiskScore = 0;

  accounts.forEach(acc => {
    // 1. Find Highest Risk Client
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

      // 2. Expected revenue (due next 30 days and unpaid)
      const isWithin30Days = planDate.getTime() >= today.getTime() && planDate.getTime() <= next30Days.getTime();
      if (isWithin30Days && isUnpaid) {
        expectedRevenue30Days += planAmt;
        clientRevenueMap.set(acc.name, (clientRevenueMap.get(acc.name) || 0) + planAmt);
      }

      // 3. Success Rate calculations (dueDate <= today only)
      const isDueOrPast = planDate.getTime() <= today.getTime();
      if (isDueOrPast) {
        if (plan.status === 'Ödendi') {
          totalPaidVadesiGelmis += planAmt;
          totalTotalVadesiGelmis += planAmt;
        } else {
          totalTotalVadesiGelmis += planAmt;
        }
      }

      // 4. Risk Volume (gecikmiş açık bakiyeler + yüksek riskli carilerin açık bakiyeleri, no double counting)
      if (isUnpaid) {
        const isOverdue = planDate.getTime() < today.getTime();
        const isHighRiskCompany = acc.riskScore > 2.0;
        
        if (isOverdue || isHighRiskCompany) {
          riskVolume += planAmt;
        }
      }
    });
  });

  const formatLargeAmount = (val: number) => {
    if (val === 0) return '₺0';
    if (val >= 1000000) return `₺ ${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `₺ ${(val / 1000).toFixed(0)}K`;
    return `₺ ${val.toLocaleString('tr-TR')}`;
  };

  const hasData = accounts.length > 0;

  if (!hasData) {
    return (
      <div className="bg-gradient-to-br from-blue-950/40 to-indigo-950/40 border border-blue-500/15 rounded-3xl p-6 text-center select-none space-y-4 shadow-xl flex flex-col justify-center items-center min-h-[220px]">
        <Sparkles size={20} className="text-slate-500 animate-pulse" />
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">AI Finansal Öngörüler</span>
        <span className="text-xs font-bold text-slate-500 italic">Henüz yeterli finansal veri bulunmuyor.</span>
      </div>
    );
  }

  const successRateText = totalTotalVadesiGelmis > 0 
    ? `%${((totalPaidVadesiGelmis / totalTotalVadesiGelmis) * 100).toFixed(1)}` 
    : 'Veri yok';

  // Find client with highest expected revenue in 30 days
  let topRevenueClientName = '';
  let topRevenueVal = 0;
  clientRevenueMap.forEach((val, key) => {
    if (val > topRevenueVal) {
      topRevenueVal = val;
      topRevenueClientName = key;
    }
  });

  const points = [
    `Önümüzdeki 30 gün içinde beklenen net tahsilat: ${formatLargeAmount(expectedRevenue30Days)}.`,
    `Gecikmiş ve risk taşıyan açık bakiye hacmi: ${formatLargeAmount(riskVolume)}.`,
    totalTotalVadesiGelmis > 0
      ? `Ölçülen tahsilat başarı oranı: ${successRateText}.`
      : 'Tahsilat başarı oranı hesaplanması için vadesi dolmuş bakiye bulunmamaktadır.',
    topRevenueClientName 
      ? `En yüksek nakit girdisi ${topRevenueClientName} carisinden beklenmektedir.`
      : `Önümüzdeki 30 günde planlanmış yeni nakit girdisi bulunmamaktadır.`,
    highestRiskClientName && highestRiskScore > 1.5
      ? `En yüksek risk skoru ${highestRiskClientName} carisine aittir (Risk: ${highestRiskScore.toFixed(1)}/5.0).`
      : `Tüm aktif cari risk dereceleri güvenli seviyededir.`
  ];

  return (
    <div className="bg-gradient-to-br from-blue-950/40 to-indigo-950/40 border border-blue-500/15 rounded-3xl p-6 text-left select-none space-y-4 shadow-xl">
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div className="flex items-center gap-1.5 text-blue-400">
          <Sparkles size={14} className="animate-pulse" />
          <h4 className="text-xs font-black text-white uppercase tracking-wider">AI Finansal Öngörüler</h4>
        </div>
        <span className="text-[8.5px] bg-blue-500/10 text-blue-400 border border-blue-500/10 px-2 py-0.5 rounded font-black uppercase tracking-wider">30 Günlük Tahmin</span>
      </div>

      <div className="grid grid-cols-3 gap-3.5 pt-1 text-center">
        <div className="p-3.5 rounded-2xl bg-[#08111f]/40 border border-white/5 space-y-1">
          <div className="mx-auto text-blue-400 w-fit"><TrendingUp size={14} /></div>
          <span className="text-[8px] text-slate-500 block uppercase tracking-wider">Beklenen Gelir</span>
          <span className="text-white block text-xs font-black">{formatLargeAmount(expectedRevenue30Days)}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#08111f]/40 border border-white/5 space-y-1">
          <div className="mx-auto text-emerald-400 w-fit"><Calendar size={14} /></div>
          <span className="text-[8px] text-slate-500 block uppercase tracking-wider">Başarı Oranı</span>
          <span className="text-emerald-450 block text-xs font-black">{successRateText}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#08111f]/40 border border-white/5 space-y-1">
          <div className="mx-auto text-rose-400 w-fit"><Users size={14} /></div>
          <span className="text-[8px] text-slate-500 block uppercase tracking-wider">Risk Hacmi</span>
          <span className="text-rose-455 block text-xs font-black">{formatLargeAmount(riskVolume)}</span>
        </div>
      </div>

      <ul className="space-y-2 pl-3.5 list-disc text-[9.5px] leading-relaxed font-bold text-slate-450 pt-2 border-t border-white/5">
        {points.map((pt, idx) => (
          <li key={idx} className="hover:text-slate-350 duration-100">{pt}</li>
        ))}
      </ul>
    </div>
  );
}
