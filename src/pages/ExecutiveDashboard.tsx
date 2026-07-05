import React from 'react';
import { 
  TrendingUp, 
  Coins, 
  Calendar, 
  AlertTriangle, 
  Activity, 
  Building2, 
  MapPin, 
  Sparkles, 
  Zap, 
  CheckSquare, 
  ShieldAlert, 
  Flame,
  ArrowRight,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { financeData } from '@/data/finance';
import { reportsData } from '@/data/reports';
import { tasksList } from '@/data/tasks';
import { EntityLink } from '@/components/design-system/EntityLink';
import { Badge } from '@/components/design-system/Badge';

export function ExecutiveDashboard() {
  const { setCurrentRoute } = useApp();

  const handleQuickAction = (route: string, param?: string) => {
    if (param) {
      window.history.pushState(null, '', `/${route}?${param}`);
    }
    setCurrentRoute(route as any);
  };

  return (
    <div className="space-y-6 text-left select-none pb-12">
      {/* Bloomberg-style Live Status bar header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0a1424] border border-white/5 p-4 rounded-2xl relative overflow-hidden select-none">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <div className="space-y-0.5 text-left">
            <h2 className="text-[10px] font-black text-white uppercase tracking-widest leading-none">CEO EXECUTIVE INTELLIGENCE TERMINAL</h2>
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Canlı Pazar, Gelir ve SLA Performans Analizleri</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-[9px] font-bold text-slate-400">
          <div>USD/TRY: <span className="text-white">34.12</span> <span className="text-emerald-450">▲ +0.08%</span></div>
          <div>BIST Outdoor: <span className="text-white">8.420</span> <span className="text-emerald-450">▲ +1.24%</span></div>
          <div>Pazar Payı: <span className="text-white">%36.8</span> <span className="text-blue-400">Sabit</span></div>
          <div>SLA Performansı: <span className="text-emerald-450">%97.8</span></div>
        </div>
      </div>

      {/* ÜST KPI Panel (8 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {[
          { title: 'Toplam Ciro', val: '₺684.500.000', change: '▲ %14', desc: 'Son 12 ay' },
          { title: 'Net Kar', val: '₺248.500.000', change: '▲ %18', desc: 'Operasyonel kar' },
          { title: 'Tahsilat', val: '₺612.000.000', change: '▲ %92', desc: 'Tahsilat oranı' },
          { title: 'Pipeline', val: '₺94.700.000', change: '▼ %4', desc: 'Satış boru hattı' },
          { title: 'Doluluk', val: '%96.8', change: '▲ %2', desc: 'Premium alanlar' },
          { title: 'Boş Alan', val: '18 Ünite', change: 'Açık Satış', desc: 'Kiralanabilir envanter' },
          { title: 'Riskli Cari', val: '₺42.800.000', change: 'UYARI', desc: 'Mercedes & Turkcell' },
          { title: 'Operasyon Skoru', val: '9.4 / 10', change: '▲ %3', desc: 'SLA ve teknik başarı' }
        ].map((kpi, idx) => (
          <div key={idx} className="dark-glass-card border border-white/5 p-4 rounded-xl flex flex-col justify-between text-left space-y-2 relative overflow-hidden">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider block">{kpi.title}</span>
            <div className="space-y-0.5">
              <span className="text-sm font-black text-white block truncate leading-none">{kpi.val}</span>
              <div className="flex justify-between items-center text-[7.5px] font-bold uppercase mt-1">
                <span className="text-slate-500">{kpi.desc}</span>
                <span className={kpi.change === 'UYARI' || kpi.change.includes('▼') ? 'text-rose-450' : 'text-emerald-450'}>{kpi.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 12 Elements Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ROW 1: 1. Canlı Yönetici Özeti (4cols) & 11. AI Yönetici Özeti (4cols) & 12. Hızlı Yönetici Aksiyonları (4cols) */}
        <div className="lg:col-span-4 dark-glass-card border border-white/5 rounded-2xl p-5 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-xs font-black text-white uppercase tracking-wider">1. Canlı Yönetici Özeti</span>
            <Badge variant="primary">Q2 2025</Badge>
          </div>
          <p className="text-[10px] text-slate-350 leading-relaxed font-semibold">
            OutdoorCore AI platformu, ikinci çeyrekte **₺42.8M** ciro kaydetmiştir. Ortalama doluluk oranı **%96.8** seviyesine ulaşarak tarihi zirveyi görmüştür. **Turkcell** cari hesabındaki gecikmeli taksit ve **THY** yaklaşan yenileme süreci operasyonel öncelikli maddeler olarak izlenmektedir.
          </p>
          <div className="pt-2 flex gap-4 text-[9px] text-slate-500">
            <div>Aktif Kampanya: <strong className="text-slate-300">68</strong></div>
            <div>Yayındaki Cihaz: <strong className="text-slate-300">112</strong></div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-indigo-950/15 border border-indigo-500/10 rounded-2xl p-5 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-indigo-500/10">
            <span className="text-xs font-black text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={12} className="animate-pulse" />
              11. AI Yönetici Özeti
            </span>
            <span className="text-[7.5px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded font-black uppercase">Canlı Analiz</span>
          </div>
          <p className="text-[10px] text-indigo-200 leading-relaxed font-semibold">
            Yapay zekâ tahmin modelimiz, önümüzdeki 30 günde **%87** olasılıkla THY sözleşmesinin başarıyla yenileneceğini öngörüyor. Mercedes ve Turkcell kaynaklı geciken fatura risk endeksi **%74** seviyesindedir. Boşalan SG-001 ekranı için Samsung'a hızlı teklif yapılması önerilir.
          </p>
        </div>

        <div className="lg:col-span-4 dark-glass-card border border-white/5 rounded-2xl p-5 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-xs font-black text-white uppercase tracking-wider">12. Hızlı Yönetici Aksiyonları</span>
            <Zap size={11} className="text-blue-400" />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <button 
              onClick={() => handleQuickAction('teklifler')}
              className="p-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-[9px] font-black text-white uppercase tracking-wider cursor-pointer text-center"
            >
              Teklifleri Onayla
            </button>
            <button 
              onClick={() => handleQuickAction('bildirimler', 'taskId=TSK-0001')}
              className="p-2 bg-[#22314a]/30 hover:bg-[#22314a]/50 border border-white/5 rounded-xl text-[9px] font-black text-slate-300 uppercase tracking-wider cursor-pointer text-center"
            >
              Kritik İşleri Gör
            </button>
            <button 
              onClick={() => handleQuickAction('finans', 'companyId=CMP-0002')}
              className="p-2 bg-[#22314a]/30 hover:bg-[#22314a]/50 border border-white/5 rounded-xl text-[9px] font-black text-slate-300 uppercase tracking-wider cursor-pointer text-center"
            >
              Cari Mutabakat Başlat
            </button>
            <button 
              onClick={() => handleQuickAction('ai-assistant')}
              className="p-2 bg-[#22314a]/30 hover:bg-[#22314a]/50 border border-white/5 rounded-xl text-[9px] font-black text-blue-450 uppercase tracking-wider cursor-pointer text-center"
            >
              Copilot Asistan
            </button>
          </div>
        </div>

        {/* ROW 2: 2. Ciro Grafiği (4cols) & 3. Pipeline (4cols) & 4. Finans (4cols) */}
        <div className="lg:col-span-4 dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left">
          <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
            <TrendingUp size={13} />
            <h4 className="text-xs font-black text-white uppercase tracking-wider">2. Ciro Grafiği (Trend Analizi)</h4>
          </div>
          <div className="space-y-2.5">
            {reportsData.revenueTrends.monthly.map((point, idx) => (
              <div key={idx} className="flex justify-between items-center text-[9.5px]">
                <span className="text-slate-400 font-extrabold">{point.period} 2025</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-black">₺{point.revenue}M</span>
                  <span className="text-slate-500">| Doluluk %{point.occupancy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left">
          <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
            <Activity size={13} />
            <h4 className="text-xs font-black text-white uppercase tracking-wider">3. Satış Pipeline (Boru Hattı)</h4>
          </div>
          <div className="space-y-2">
            {reportsData.funnelStages.slice(0, 5).map((stage, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-[9px] font-bold">
                  <span className="text-slate-350">{stage.stage} ({stage.count} teklif)</span>
                  <span className="text-white font-extrabold">{stage.value}</span>
                </div>
                <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min(stage.count * 2, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left">
          <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
            <Coins size={13} />
            <h4 className="text-xs font-black text-white uppercase tracking-wider">4. Finans & Cari Analiz</h4>
          </div>
          <div className="space-y-3 pt-0.5">
            {financeData.accounts.slice(0, 3).map((account, idx) => (
              <div key={idx} className="flex justify-between items-center text-[9.5px]">
                <div className="space-y-0.5">
                  <span className="text-white font-black">{account.name}</span>
                  <span className="text-[7.5px] text-slate-500 block uppercase">CRM Seviyesi: {account.crmTier}</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-bold block">{account.totalCollected} Tahsil Edildi</span>
                  <span className="text-[8px] text-rose-450 block font-bold">Bakiye: {account.balance}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 3: 5. En Karlı Firmalar (4cols) & 6. En Karlı Reklam Alanları (4cols) & 7. Yaklaşan Riskler (4cols) */}
        <div className="lg:col-span-4 dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left">
          <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
            <Building2 size={13} />
            <h4 className="text-xs font-black text-white uppercase tracking-wider">5. En Karlı Müşteriler (Ciro Liderleri)</h4>
          </div>
          <div className="space-y-2.5">
            {reportsData.brandPerformance.slice(0, 3).map((brand, idx) => (
              <div key={idx} className="flex justify-between items-center text-[9.5px]">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-black text-[9px]">
                    {brand.logo}
                  </span>
                  <span className="text-white font-extrabold">{brand.name}</span>
                </div>
                <span className="text-emerald-450 font-black">{brand.totalRevenue}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left">
          <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
            <MapPin size={13} />
            <h4 className="text-xs font-black text-white uppercase tracking-wider">6. En Karlı Reklam Alanları</h4>
          </div>
          <div className="space-y-2.5">
            {reportsData.spacePerformance.slice(0, 3).map((space, idx) => (
              <div key={idx} className="flex justify-between items-center text-[9.5px]">
                <div className="flex items-center gap-1.5">
                  <span className="text-blue-400 font-extrabold">#{space.spaceCode}</span>
                  <span className="text-slate-500">| Doluluk %{space.occupancy}</span>
                </div>
                <span className="text-white font-black">₺{(space.revenue / 1000000).toFixed(1)}M Yıllık</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 dark-glass-card border border-rose-500/10 rounded-2xl p-5 space-y-4 text-left shadow-sm shadow-rose-500/5">
          <div className="flex items-center gap-1.5 pb-2 border-b border-rose-500/10 text-rose-450">
            <ShieldAlert size={13} />
            <h4 className="text-xs font-black text-rose-450 uppercase tracking-wider">7. Yaklaşan Kritik Riskler</h4>
          </div>
          <div className="space-y-2.5">
            {[
              { label: 'Turkcell Gecikme', detail: '80 günlük vadesi geçmiş ödeme.', level: 'Kritik' },
              { label: 'Kreatif Uyuşmazlığı', detail: 'CAM-0002 kreatif dosya eksikliği.', level: 'Yüksek' },
              { label: 'Yedek Parça Sıkıntısı', detail: 'TSK-M003 arızalı Meanwell parça bekliyor.', level: 'Orta' }
            ].map((risk, idx) => (
              <div key={idx} className="p-2 rounded bg-rose-500/5 border border-rose-500/10 text-[9px] flex justify-between items-start">
                <div className="space-y-0.5">
                  <span className="text-white font-black">{risk.label}</span>
                  <span className="text-slate-500 block leading-tight">{risk.detail}</span>
                </div>
                <span className="text-[7.5px] bg-rose-500/20 text-rose-450 px-1.5 py-0.2 rounded font-black uppercase tracking-wider shrink-0 ml-2">
                  {risk.level}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 4: 8. Yaklaşan Yenilemeler (4cols) & 9. Bugünkü Görevler (4cols) & 10. Operasyon Skoru (4cols) */}
        <div className="lg:col-span-4 dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left">
          <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
            <Calendar size={13} />
            <h4 className="text-xs font-black text-white uppercase tracking-wider">8. Yaklaşan Sözleşme Yenilemeleri</h4>
          </div>
          <div className="space-y-2.5">
            {[
              { client: 'Türk Hava Yolları', code: 'CON-0003', remainingDays: 18, prob: '%87' },
              { client: 'Samsung Electronics', code: 'CON-0001', remainingDays: 45, prob: '%94' },
              { client: 'Turkcell Yaz Kontratı', code: 'CON-0002', remainingDays: 60, prob: '%65' }
            ].map((ren, idx) => (
              <div key={idx} className="flex justify-between items-center text-[9.5px]">
                <div className="text-left space-y-0.5">
                  <span className="text-white font-extrabold block truncate max-w-[150px]">{ren.client}</span>
                  <span className="text-[7.5px] text-slate-500 block uppercase">Kontrat: {ren.code}</span>
                </div>
                <div className="text-right">
                  <span className="text-amber-450 font-bold block">{ren.remainingDays} Gün kaldı</span>
                  <span className="text-emerald-450 text-[7.5px] block font-black">AI İhtimali: {ren.prob}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left">
          <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
            <CheckSquare size={13} />
            <h4 className="text-xs font-black text-white uppercase tracking-wider">9. Bugünkü Kritik Görevler</h4>
          </div>
          <div className="space-y-2.5">
            {tasksList.slice(0, 3).map((task) => (
              <div key={task.id} className="flex justify-between items-start text-[9.5px]">
                <div className="space-y-0.5 text-left leading-tight">
                  <span className="text-white font-bold block truncate max-w-[200px]">{task.taskTitle}</span>
                  <span className="text-[7.5px] text-slate-500 block uppercase">{task.clientName} | Görev: {task.id}</span>
                </div>
                <Badge variant={task.status === 'Tamamlandı' ? 'success' : 'primary'}>{task.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left">
          <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
            <Activity size={13} />
            <h4 className="text-xs font-black text-white uppercase tracking-wider">10. Teknik Operasyon Skoru</h4>
          </div>
          <div className="space-y-3.5">
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="text-slate-350">Uptime / Yayın Kararlılığı</span>
              <span className="text-emerald-450 font-black">%99.4</span>
            </div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '99.4%' }} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-center text-[9px] pt-1">
              <div className="bg-[#08111f]/60 p-2.5 rounded-xl border border-white/3">
                <span className="text-slate-500 font-bold block uppercase mb-1">Cihaz Sayısı</span>
                <span className="text-white font-black">112 Ünite</span>
              </div>
              <div className="bg-[#08111f]/60 p-2.5 rounded-xl border border-white/3">
                <span className="text-slate-500 font-bold block uppercase mb-1">SLA Uyum Oranı</span>
                <span className="text-emerald-450 font-black">%97.8</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
