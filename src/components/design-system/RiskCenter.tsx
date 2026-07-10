import React from 'react';
import { AlertOctagon, AlertTriangle, ShieldAlert } from 'lucide-react';
import { parseAnyDate } from '@/utils/dateHelper';

interface RiskCenterProps {
  accounts?: any[];
}

export function RiskCenter({ accounts = [] }: RiskCenterProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. 90 Gün Üzeri Gecikme
  let maxOverdue90Amt = 0;
  let maxOverdue90Client = '';
  
  // 2. Riskli Müşteriler
  let maxRiskScore = 0;
  let maxRiskClient = '';

  // 3. Yüksek Bakiye Alarmı
  let maxBalanceAmt = 0;
  let maxBalanceClient = '';

  accounts.forEach(acc => {
    // Check risk score
    const score = acc.riskScore || 0;
    if (score > maxRiskScore) {
      maxRiskScore = score;
      maxRiskClient = acc.name;
    }

    // Check balance
    const balAmt = parseFloat((acc.balance || '0').replace(/[^0-9]/g, '')) || 0;
    if (balAmt > maxBalanceAmt) {
      maxBalanceAmt = balAmt;
      maxBalanceClient = acc.name;
    }

    // Check 90+ days overdue installments
    const plans = acc.paymentPlan || [];
    plans.forEach((plan: any) => {
      const planAmt = parseFloat((plan.amount || '').replace(/[^0-9]/g, '')) || 0;
      const planDate = parseAnyDate(plan.dueDate);
      if (!planDate) return;

      const isUnpaid = plan.status !== 'Ödendi';
      if (isUnpaid) {
        const diffDays = Math.ceil((today.getTime() - planDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > 90) {
          if (planAmt > maxOverdue90Amt) {
            maxOverdue90Amt = planAmt;
            maxOverdue90Client = acc.name;
          }
        }
      }
    });
  });

  const formatLargeAmount = (val: number) => {
    if (val === 0) return '₺0';
    if (val >= 1000000) return `₺ ${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `₺ ${(val / 1000).toFixed(0)}K`;
    return `₺ ${val.toLocaleString('tr-TR')}`;
  };

  const risks = [
    {
      title: '90 Gün Üzeri Gecikme',
      desc: maxOverdue90Client && maxOverdue90Amt > 0
        ? `${maxOverdue90Client} ödemesinde ${formatLargeAmount(maxOverdue90Amt)} tutarında 90 gün aşımı bulunuyor.`
        : '90 gün üzeri gecikme bulunmuyor.',
      icon: <AlertOctagon size={14} />,
      active: !!maxOverdue90Client
    },
    {
      title: 'Riskli Müşteriler',
      desc: maxRiskClient && maxRiskScore > 2.0
        ? `${maxRiskClient} cari risk derecesi %${((maxRiskScore / 5) * 100).toFixed(0)} seviyesindedir.`
        : 'Riskli müşteri bulunmuyor.',
      icon: <ShieldAlert size={14} />,
      active: maxRiskScore > 2.0
    },
    {
      title: 'Yüksek Bakiye Alarmı',
      desc: maxBalanceClient && maxBalanceAmt > 5000000
        ? `${maxBalanceClient} cari borç toplamı ${formatLargeAmount(maxBalanceAmt)} seviyesinde seyrediyor.`
        : 'Yüksek bakiye alarmı bulunmuyor.',
      icon: <AlertTriangle size={14} />,
      active: maxBalanceAmt > 5000000
    }
  ];

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left select-none">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-rose-455">
        <AlertOctagon size={13} className="animate-pulse" />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Tahsilat Risk Merkezi</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
        {risks.map((risk, idx) => (
          <div 
            key={idx}
            className={`p-4 rounded-2xl border flex flex-col justify-between duration-150 relative ${
              risk.active 
                ? 'bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/15' 
                : 'bg-white/5 border-white/5 opacity-60'
            }`}
          >
            <div className={`flex items-center justify-between mb-3.5 ${risk.active ? 'text-rose-450' : 'text-slate-400'}`}>
              <span className="text-[9.5px] font-black uppercase tracking-widest block leading-none">{risk.title}</span>
              <div className="shrink-0">{risk.icon}</div>
            </div>
            <p className="text-[9.5px] text-slate-350 font-bold leading-normal">{risk.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
