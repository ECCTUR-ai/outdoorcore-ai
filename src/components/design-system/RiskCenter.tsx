import { AlertOctagon, AlertTriangle, ShieldAlert } from 'lucide-react';

export function RiskCenter() {
  const risks = [
    { title: '90 Gün Üzeri Gecikme', desc: 'Turkcell ödemesinde ₺30M tutarında 80 gün aşımı bulunuyor.', icon: <AlertOctagon size={14} /> },
    { title: 'Riskli Müşteriler', desc: 'Turkcell cari risk derecesi %72 seviyesine yükseltildi.', icon: <ShieldAlert size={14} /> },
    { title: 'Yüksek Bakiye Alarmı', desc: 'Cari borç toplamı ₺58M seviyesinde seyrediyor.', icon: <AlertTriangle size={14} /> }
  ];

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left select-none">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-rose-450">
        <AlertOctagon size={13} className="animate-pulse" />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Tahsilat Risk Merkezi</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
        {risks.map((risk, idx) => (
          <div 
            key={idx}
            className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 flex flex-col justify-between hover:bg-rose-500/10 duration-150 relative"
          >
            <div className="flex items-center justify-between text-rose-450 mb-3.5">
              <span className="text-[9.5px] font-black uppercase tracking-widest block leading-none">{risk.title}</span>
              <div className="shrink-0">{risk.icon}</div>
            </div>
            <p className="text-[9.5px] text-slate-400 font-semibold leading-normal">{risk.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
