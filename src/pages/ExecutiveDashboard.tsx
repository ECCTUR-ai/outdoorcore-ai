import React, { useState, useEffect } from 'react';
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
  Maximize2,
  Layers
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { reportsData } from '@/data/reports';
import { 
  financeRepository, 
  taskRepository, 
  contractRepository, 
  offerRepository, 
  spaceRepository, 
  campaignRepository 
} from '@/repositories';
import { EntityLink } from '@/components/design-system/EntityLink';
import { Badge } from '@/components/design-system/Badge';

export function ExecutiveDashboard() {
  const { setCurrentRoute } = useApp();

  const [totalCiro, setTotalCiro] = useState(0);
  const [netKar, setNetKar] = useState(0);
  const [totalCollected, setTotalCollected] = useState(0);
  const [pipelineVal, setPipelineVal] = useState(0);
  const [occupancyRate, setOccupancyRate] = useState(0);
  const [bosSpacesCount, setBosSpacesCount] = useState(0);
  const [riskCariVal, setRiskCariVal] = useState(0);
  const [opScore, setOpScore] = useState(9.8);

  const [contractsCount, setContractsCount] = useState(0);

  useEffect(() => {
    const contractsList = contractRepository.getAllSync();
    const offersList = offerRepository.getAllSync();
    const spacesList = spaceRepository.getAllSync();
    const financeData = financeRepository.getFinanceDataSync();

    setContractsCount(contractsList.length);

    // Ciro calculation
    const ciro = contractsList.reduce((sum, c) => sum + (c.valueNumeric || 0), 0);
    setTotalCiro(ciro);
    setNetKar(ciro * 0.40); // estimate 40% net margin

    // Pipeline calculation
    const pipeline = offersList.reduce((sum, o) => sum + (o.valueNumeric || 0), 0);
    setPipelineVal(pipeline);

    // Occupancy calculation
    const doluCount = spacesList.filter(s => s.status === 'dolu' || (s.status as string) === 'rezerve').length;
    const rate = spacesList.length > 0 ? (doluCount / spacesList.length) * 100 : 0;
    setOccupancyRate(rate);

    const bosCount = spacesList.filter(s => s.status === 'bos').length;
    setBosSpacesCount(bosCount);

    // Finance totals calculation
    let collected = 0;
    let riskCari = 0;
    if (financeData && financeData.accounts) {
      financeData.accounts.forEach((acc: any) => {
        const colVal = parseFloat(acc.totalCollected.replace(/[^\d]/g, '')) || 0;
        collected += colVal;
        if (acc.riskScore > 5.0) {
          const balVal = parseFloat(acc.balance.replace(/[^\d]/g, '')) || 0;
          riskCari += balVal;
        }
      });
    }
    setTotalCollected(collected);
    setRiskCariVal(riskCari);
  }, []);

  const financeData = financeRepository.getFinanceDataSync();
  const tasksList = taskRepository.getAllSync();

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
          { title: 'Toplam Ciro', val: `₺${totalCiro.toLocaleString('tr-TR')}`, change: '▲ %0', desc: 'Canlı Veri' },
          { title: 'Net Kar', val: `₺${netKar.toLocaleString('tr-TR')}`, change: '▲ %0', desc: 'Sözleşme Karı' },
          { title: 'Tahsilat', val: `₺${totalCollected.toLocaleString('tr-TR')}`, change: '▲ %0', desc: 'Tahsilat tutarı' },
          { title: 'Pipeline', val: `₺${pipelineVal.toLocaleString('tr-TR')}`, change: '▲ %0', desc: 'Satış havuzu' },
          { title: 'Doluluk', val: `%${occupancyRate.toFixed(1)}`, change: '▲ %0', desc: 'Aktif doluluk' },
          { title: 'Boş Alan', val: `${bosSpacesCount} Ünite`, change: 'Müsait', desc: 'Kiralanabilir' },
          { title: 'Riskli Cari', val: `₺${riskCariVal.toLocaleString('tr-TR')}`, change: 'Uyumlu', desc: 'Bakiye riski' },
          { title: 'Operasyon Skoru', val: `${opScore} / 10`, change: 'Aktif', desc: 'Teknik başarı' }
        ].map((kpi, idx) => (
          <div key={idx} className="dark-glass-card border border-white/5 p-4 rounded-xl flex flex-col justify-between text-left space-y-2 relative overflow-hidden bg-[#12192B]">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider block">{kpi.title}</span>
            <div className="space-y-0.5">
              <span className="text-xs font-black text-white block truncate leading-none">{kpi.val}</span>
              <div className="flex justify-between items-center text-[7.5px] font-bold uppercase mt-1">
                <span className="text-slate-500">{kpi.desc}</span>
                <span className={kpi.change === 'UYARI' || kpi.change.includes('▼') ? 'text-rose-450' : 'text-emerald-450'}>{kpi.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {contractsCount === 0 ? (
        <div className="p-12 text-center rounded-[20px] bg-[#12192B] border border-white/5 space-y-6 max-w-2xl mx-auto mt-12 shadow-[0_20px_60px_rgba(0,0,0,.45)]">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
            <Layers size={24} className="animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">Yönetici Paneli Boş Başlangıç</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Hiç aktif sözleşme veya finansal hareket bulunamadı.</p>
          </div>
          <div className="bg-[#0b0f19] p-4 rounded-xl border border-white/5 text-[9.5px] font-semibold text-slate-400 space-y-2.5 text-left">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
              <span>İlk teklifinizi oluşturup onayladığınızda finansal ciro verileri yansıyacaktır.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span>Sözleşme imzalandığında taksit ödeme planları otomatik üretilir.</span>
            </div>
          </div>
        </div>
      ) : (
        /* 12 Elements Grid Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ROW 1: 1. Canlı Yönetici Özeti (4cols) & 11. AI Yönetici Özeti (4cols) & 12. Hızlı Yönetici Aksiyonları (4cols) */}
          <div className="lg:col-span-4 dark-glass-card border border-white/5 rounded-2xl p-5 space-y-3.5 bg-[#12192B]">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-xs font-black text-white uppercase tracking-wider">1. Canlı Yönetici Özeti</span>
              <Badge variant="primary">Q2 2025</Badge>
            </div>
            <p className="text-[10px] text-slate-350 leading-relaxed font-semibold">
              OutdoorCore AI platformu, güncel olarak **₺{(totalCiro / 1000000).toFixed(1)}M** sözleşme cirosu kaydetmiştir. Ortalama doluluk oranı **%{occupancyRate.toFixed(1)}** seviyesindedir. Fırsat pipeline hacmi ise **₺{(pipelineVal / 1000000).toFixed(1)}M** olarak izlenmektedir.
            </p>
            <div className="pt-2 flex gap-4 text-[9px] text-slate-500">
              <div>Aktif Sözleşme: <strong className="text-slate-300">{contractsCount}</strong></div>
              <div>Boş Ekran: <strong className="text-slate-300">{bosSpacesCount}</strong></div>
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
              Yapay zekâ tahmin modelimiz, satış hedeflerine ulaşma olasılığını ciro trendlerini izleyerek %85 olarak hesaplamaktadır. Yeni tekliflerin kapatılması durumunda doluluk oranının artacağı tahmin edilmektedir.
            </p>
          </div>

          <div className="lg:col-span-4 dark-glass-card border border-white/5 rounded-2xl p-5 space-y-3.5 bg-[#12192B]">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-xs font-black text-white uppercase tracking-wider">12. Hızlı Yönetici Aksiyonları</span>
              <Zap size={11} className="text-blue-400" />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button 
                onClick={() => handleQuickAction('teklifler')}
                className="p-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-[9px] font-black text-white uppercase tracking-wider cursor-pointer text-center animate-pulse"
              >
                Teklifleri Gör
              </button>
              <button 
                onClick={() => handleQuickAction('bildirimler')}
                className="p-2 bg-[#22314a]/30 hover:bg-[#22314a]/50 border border-white/5 rounded-xl text-[9px] font-black text-slate-300 uppercase tracking-wider cursor-pointer text-center"
              >
                Kritik İşleri Gör
              </button>
              <button 
                onClick={() => handleQuickAction('finans')}
                className="p-2 bg-[#22314a]/30 hover:bg-[#22314a]/50 border border-white/5 rounded-xl text-[9px] font-black text-slate-300 uppercase tracking-wider cursor-pointer text-center"
              >
                Cari Hesaplar
              </button>
              <button 
                onClick={() => handleQuickAction('ai-assistant')}
                className="p-2 bg-[#22314a]/30 hover:bg-[#22314a]/50 border border-white/5 rounded-xl text-[9px] font-black text-blue-450 uppercase tracking-wider cursor-pointer text-center"
              >
                Copilot Asistan
              </button>
            </div>
          </div>

          {/* ROW 2: 2. Ciro Grafiği & 3. Pipeline & 4. Finans */}
          <div className="lg:col-span-4 dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left bg-[#12192B]">
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

          <div className="lg:col-span-4 dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left bg-[#12192B]">
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

          <div className="lg:col-span-4 dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left bg-[#12192B]">
            <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
              <Coins size={13} />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">4. Finans & Cari Analiz</h4>
            </div>
            <div className="space-y-3 pt-0.5">
              {financeData.accounts.slice(0, 3).map((account, idx) => (
                <div key={idx} className="flex justify-between items-center text-[9.5px]">
                  <div className="space-y-0.5">
                    <span className="text-white font-black">{account.name}</span>
                    <span className="text-[7.5px] text-slate-500 block uppercase">CRM: {account.crmTier}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-bold block">{account.totalCollected} Tahsil Edildi</span>
                    <span className="text-[8px] text-rose-450 block font-bold">Bakiye: {account.balance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
