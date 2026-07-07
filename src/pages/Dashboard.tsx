import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  CheckSquare, 
  Circle, 
  FileText, 
  Wrench, 
  TrendingUp, 
  Calendar,
  Sparkles,
  ChevronDown,
  PlusSquare,
  FileSpreadsheet,
  UploadCloud,
  FilePlus,
  Bookmark,
  Layers,
  Clock,
  CheckCheck
} from 'lucide-react';
import { DarkKpiCard } from '@/components/design-system/DarkKpiCard';
import { DarkDashboardCard } from '@/components/design-system/DarkDashboardCard';
import { TerminalMapMock } from '@/components/design-system/TerminalMapMock';
import { Badge } from '@/components/design-system/Badge';
import { Button } from '@/components/design-system/Button';
import { Table, TableRow, TableCell } from '@/components/design-system/Table';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { 
  offerRepository, 
  reservationRepository, 
  campaignRepository, 
  financeRepository, 
  spaceRepository 
} from '@/repositories';

export function Dashboard() {
  const [terminalSelector, setTerminalSelector] = useState('İç Hatlar - Giriş Kat');

  // Dynamic States
  const [offersCount, setOffersCount] = useState(0);
  const [reservationsCount, setReservationsCount] = useState(0);
  const [campaignsCount, setCampaignsCount] = useState(0);
  const [pendingCollections, setPendingCollections] = useState(0);
  const [occupancyRate, setOccupancyRate] = useState(0);
  
  const [spacesCount, setSpacesCount] = useState(0);
  const [doluCount, setDoluCount] = useState(0);
  const [bosCount, setBosCount] = useState(0);
  const [teklifCount, setTeklifCount] = useState(0);
  const [bakimCount, setBakimCount] = useState(0);
  
  const [recentCampaignsList, setRecentCampaignsList] = useState<any[]>([]);

  useEffect(() => {
    const spaces = spaceRepository.getAllSync();
    const offers = offerRepository.getAllSync();
    const reservations = reservationRepository.getAllSync();
    const campaigns = campaignRepository.getAllSync();
    const finance = financeRepository.getFinanceDataSync();
    
    setSpacesCount(spaces.length);
    const dolu = spaces.filter(s => s.status === 'dolu' || (s.status as string) === 'rezerve').length;
    const bos = spaces.filter(s => s.status === 'bos').length;
    const teklifStage = spaces.filter(s => s.status === 'teklif').length;
    const bakim = spaces.filter(s => s.status === 'bakim').length;
    
    setDoluCount(dolu);
    setBosCount(bos);
    setTeklifCount(teklifStage);
    setBakimCount(bakim);
    
    setOffersCount(offers.length);
    
    const activeRes = reservations.filter(r => r.status === 'Aktif' || (r.status as string) === 'Kesin Rezervasyon').length;
    setReservationsCount(activeRes);
    
    const activeCamp = campaigns.filter(c => c.status === 'Aktif').length;
    setCampaignsCount(activeCamp);
    
    // Calculate pending collections (balance of accounts)
    let totalPending = 0;
    if (finance && finance.accounts) {
      finance.accounts.forEach((acc: any) => {
        const val = parseFloat(acc.balance.replace(/[^\d]/g, '')) || 0;
        totalPending += val;
      });
    }
    setPendingCollections(totalPending);
    
    const rate = spaces.length > 0 ? (dolu / spaces.length) * 100 : 0;
    setOccupancyRate(rate);

    // Map active campaigns for table view
    const mappedCampTable = campaigns.map(c => {
      const relatedSpace = spaces.find(s => s.id === (c.spaceIds && c.spaceIds[0]));
      return {
        code: relatedSpace?.code || 'SPC-001',
        name: relatedSpace?.name || 'Giriş LED Ekran',
        brand: c.clientName,
        startDate: c.startDate,
        endDate: c.endDate,
        status: c.status,
        progress: c.status === 'Aktif' ? 100 : 0
      };
    });
    setRecentCampaignsList(mappedCampTable);
  }, []);

  // Pie chart space status mappings
  const spaceStatusData = [
    { name: 'Dolu', value: doluCount, color: '#10b981' },
    { name: 'Boş', value: bosCount, color: '#f59e0b' },
    { name: 'Teklif', value: teklifCount, color: '#8b5cf6' },
    { name: 'Bakımda', value: bakimCount, color: '#ef4444' }
  ];

  // Gelir Dağılımı Alan Tipi
  const spaceTypeRevenueData = [
    { name: 'LED Ekran', value: doluCount > 0 ? 70 : 0, color: '#3b82f6' },
    { name: 'Lightbox', value: doluCount > 0 ? 30 : 0, color: '#8b5cf6' }
  ];

  // Pipeline steps summary
  const offersList = offerRepository.getAllSync();
  const pipelineSteps = [
    { name: 'Hazırlandı', count: offersList.filter(o => o.stage === 'Teklif Hazırlandı').length, budget: `₺${(offersList.filter(o => o.stage === 'Teklif Hazırlandı').reduce((sum, o) => sum + o.valueNumeric, 0) / 1000000).toFixed(1)}M` },
    { name: 'Onaya Gönderildi', count: offersList.filter(o => o.stage === 'Onaya Gönderildi').length, budget: `₺${(offersList.filter(o => o.stage === 'Onaya Gönderildi').reduce((sum, o) => sum + o.valueNumeric, 0) / 1000000).toFixed(1)}M` },
    { name: 'Sözleşme Bekliyor', count: offersList.filter(o => o.stage === 'Sözleşme Bekliyor').length, budget: `₺${(offersList.filter(o => o.stage === 'Sözleşme Bekliyor').reduce((sum, o) => sum + o.valueNumeric, 0) / 1000000).toFixed(1)}M` },
    { name: 'Sözleşme İmzalandı', count: offersList.filter(o => o.stage === 'Sözleşme İmzalandı').length, budget: `₺${(offersList.filter(o => o.stage === 'Sözleşme İmzalandı').reduce((sum, o) => sum + o.valueNumeric, 0) / 1000000).toFixed(1)}M` }
  ];

  return (
    <div className="space-y-6 select-none pb-12 text-left">
      {/* 6 KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <DarkKpiCard
          title="Toplam Teklif"
          value={String(offersCount)}
          percentage="Canlı Veri"
          subtext="Oluşturulan teklifler"
          icon={<FileText size={15} />}
          iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/10"
          glowColor="blue"
        />
        <DarkKpiCard
          title="Aktif Rezervasyon"
          value={String(reservationsCount)}
          percentage="Kesinleşen"
          subtext="Aktif rezervasyonlar"
          icon={<Bookmark size={15} />}
          iconBgColor="bg-emerald-500/10 text-emerald-400 border-emerald-500/10"
          glowColor="green"
        />
        <DarkKpiCard
          title="Aktif Kampanya"
          value={String(campaignsCount)}
          percentage="Yayında"
          subtext="Yayındaki kampanyalar"
          icon={<CheckCheck size={15} />}
          iconBgColor="bg-purple-500/10 text-purple-400 border-purple-500/10"
          glowColor="purple"
        />
        <DarkKpiCard
          title="Tahsilat Bekleyen"
          value={`₺ ${pendingCollections.toLocaleString('tr-TR')}`}
          percentage="Finans"
          subtext="Bekleyen ödemeler"
          icon={<Coins size={15} />}
          iconBgColor="bg-rose-500/10 text-rose-450 border-rose-500/10"
          glowColor="red"
        />
        <DarkKpiCard
          title="Doluluk Oranı"
          value={`% ${occupancyRate.toFixed(1)}`}
          percentage="Oran"
          subtext="Dolu / Toplam alan"
          icon={<TrendingUp size={15} />}
          iconBgColor="bg-sky-500/10 text-sky-400 border-sky-500/10"
          glowColor="blue"
        />
        <DarkKpiCard
          title="Boş Reklam Alanı"
          value={String(bosCount)}
          percentage="Müsait"
          subtext="Kiralanabilir alanlar"
          icon={<Circle size={15} />}
          iconBgColor="bg-amber-500/10 text-amber-400 border-amber-500/10"
          glowColor="yellow"
        />
      </div>

      {offersCount === 0 ? (
        <div className="p-12 text-center rounded-[20px] bg-[#12192B] border border-white/5 space-y-6 max-w-2xl mx-auto mt-12 shadow-[0_20px_60px_rgba(0,0,0,.45)]">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
            <Layers size={24} className="animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">Henüz Veri Yok</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Sistem sıfırlandı ve temiz test başlangıcına hazır.</p>
          </div>
          <div className="bg-[#0b0f19] p-4 rounded-xl border border-white/5 text-[9.5px] font-semibold text-slate-400 space-y-2.5 text-left">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
              <span>İlk teklifinizi oluşturun.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span>İlk rezervasyon sözleşme imzalandıktan sonra otomatik oluşacaktır.</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Main Grid: Map and Side lists */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sol Üst: Terminal Haritası */}
            <DarkDashboardCard
              title="Terminal Haritası"
              description="Sabiha Gökçen Havalimanı reklam üniteleri yerleşim krokisi"
              className="lg:col-span-8"
              headerActions={
                <div className="relative">
                  <select
                    value={terminalSelector}
                    onChange={(e) => setTerminalSelector(e.target.value)}
                    className="bg-white/5 border border-white/5 rounded-xl px-3.5 py-1.5 text-[9.5px] font-black text-slate-300 focus:outline-none uppercase tracking-wider cursor-pointer appearance-none pr-7"
                  >
                    <option value="İç Hatlar - Giriş Kat">İç Hatlar - Giriş Kat</option>
                    <option value="Dış Hatlar - Gidiş Lobi">Dış Hatlar - Gidiş Lobi</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[8px]">
                    ▼
                  </div>
                </div>
              }
            >
              <div className="space-y-4 text-left">
                <TerminalMapMock />
                {/* Map Legend */}
                <div className="flex flex-wrap items-center justify-start gap-4 pt-1.5">
                  {[
                    { label: 'Dolu', color: 'bg-emerald-500 glow-green' },
                    { label: 'Boş', color: 'bg-amber-500 glow-yellow' },
                    { label: 'Teklif', color: 'bg-purple-500 glow-purple' },
                    { label: 'Bakımda', color: 'bg-rose-500 glow-red' }
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.color}`} />
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </DarkDashboardCard>

            {/* Sağ Üst: Alan Durumu Dağılımı */}
            <DarkDashboardCard
              title="Alan Durumu"
              description="Envanter durum oranları"
              className="lg:col-span-4"
            >
              <div className="flex items-center justify-between gap-2 h-44 text-left">
                <div className="w-1/2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={spaceStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={68}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {spaceStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: '#0b0f19',
                          border: '1px solid rgba(255,255,255,0.06)',
                          borderRadius: '12px',
                          color: '#ffffff',
                          fontSize: '10px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-1/2 space-y-2.5">
                  {spaceStatusData.map(item => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{item.name}</span>
                      </div>
                      <span className="text-xs font-black text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </DarkDashboardCard>
          </div>

          {/* Grid: Proposal Pipeline */}
          <div className="grid grid-cols-1 gap-6">
            <DarkDashboardCard
              title="Teklif Pipeline"
              description="Satış süreçlerindeki potansiyel fırsatlar ve bütçeleri"
              className="w-full"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-center">
                {pipelineSteps.map((step, idx) => (
                  <div 
                    key={step.name} 
                    className="p-4 rounded-2xl bg-white/3 border border-white/5 flex flex-col justify-between h-36 hover:bg-white/5 duration-150 text-left"
                  >
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block leading-none">{step.name}</span>
                    <div className="space-y-1 my-auto">
                      <span className="text-xl font-black text-white block leading-none">{step.count}</span>
                      <span className="text-[8px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-black uppercase tracking-wide inline-block">Teklif</span>
                    </div>
                    <span className="text-xs font-black text-emerald-450 block leading-none">{step.budget}</span>
                  </div>
                ))}
              </div>
            </DarkDashboardCard>
          </div>

          {/* Bottom Grid: Active campaigns and Quick actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sol Alt: Son Aktif Kampanyalar */}
            <DarkDashboardCard
              title="Son Aktif Kampanyalar"
              description="Terminal genelinde yayında olan reklam kampanyaları"
              className="lg:col-span-8"
            >
              {recentCampaignsList.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                  Aktif kampanya bulunmamaktadır
                </div>
              ) : (
                <div className="overflow-x-auto select-none no-scrollbar">
                  <Table headers={['Alan Kodu', 'Alan Adı', 'Marka / Reklamveren', 'Başlangıç', 'Bitiş', 'Durum', 'İlerleme']}>
                    {recentCampaignsList.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-extrabold text-slate-500">{row.code}</TableCell>
                        <TableCell className="font-black text-white">{row.name}</TableCell>
                        <TableCell className="font-semibold text-slate-300">{row.brand}</TableCell>
                        <TableCell>{row.startDate}</TableCell>
                        <TableCell>{row.endDate}</TableCell>
                        <TableCell>
                          <Badge variant="success">{row.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden shrink-0">
                              <div className="h-full bg-emerald-500 rounded-full w-full" />
                            </div>
                            <span className="text-[9px] font-black text-white">%100</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </Table>
                </div>
              )}
            </DarkDashboardCard>

            {/* Sağ Alt: Hızlı İşlemler */}
            <DarkDashboardCard
              title="Hızlı İşlemler"
              description="Sık kullanılan operasyon butonları"
              className="lg:col-span-4"
            >
              <div className="grid grid-cols-3 gap-3 pt-1">
                {[
                  { label: 'Yeni Teklif', icon: <PlusSquare size={16} />, color: 'text-blue-400 bg-blue-500/10 border-blue-500/10 hover:bg-blue-500/15' },
                  { label: 'Alan Rezervasyon', icon: <Bookmark size={16} />, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/10 hover:bg-emerald-500/15' },
                  { label: 'Rapor Oluştur', icon: <FileSpreadsheet size={16} />, color: 'text-amber-400 bg-amber-500/10 border-amber-500/10 hover:bg-amber-500/15' },
                  { label: 'Medya Gönder', icon: <UploadCloud size={16} />, color: 'text-purple-400 bg-purple-500/10 border-purple-500/10 hover:bg-purple-500/15' },
                  { label: 'Sözleşme Ekle', icon: <FilePlus size={16} />, color: 'text-rose-400 bg-rose-500/10 border-rose-500/10 hover:bg-rose-500/15' }
                ].map(action => (
                  <button
                    key={action.label}
                    onClick={() => alert(`${action.label} operasyon paneli açılacak mockup.`)}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2.5 transition-all text-center select-none cursor-pointer h-24 duration-150 ${action.color}`}
                  >
                    <div className="shrink-0">{action.icon}</div>
                    <span className="text-[9.5px] font-black leading-tight uppercase tracking-wider">{action.label}</span>
                  </button>
                ))}
              </div>
            </DarkDashboardCard>
          </div>
        </>
      )}
    </div>
  );
}

// Coins Icon fallback import inside local file
function Coins({ size, className }: { size?: number; className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="8" cy="8" r="6"/>
      <circle cx="18" cy="18" r="4"/>
      <path d="M12 18a6 6 0 0 0-6-6"/>
    </svg>
  );
}
