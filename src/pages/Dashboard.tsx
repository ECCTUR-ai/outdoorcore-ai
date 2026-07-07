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
import { Notification } from '@/components/design-system/Notification';
import { TableSkeleton, CardSkeleton } from '@/components/design-system/Skeleton';
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
  const [loading, setLoading] = useState(true);
  const [hasNoGlobalData, setHasNoGlobalData] = useState(false);
  const [pipelineSteps, setPipelineSteps] = useState<any[]>([]);

  // Default Date range: 01 Mayıs 2025 - 31 Mayıs 2025
  const [dateRange, setDateRange] = useState({
    start: '2025-05-01',
    end: '2025-05-31'
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [spaces, offers, reservations, campaigns, finance] = await Promise.all([
          spaceRepository.list(),
          offerRepository.list(),
          reservationRepository.getAll(),
          campaignRepository.getAll(),
          financeRepository.getFinanceData()
        ]);

        const noData = offers.length === 0 && reservations.length === 0 && campaigns.length === 0;
        setHasNoGlobalData(noData);

        const datesOverlap = (startA: string, endA: string, startB: string, endB: string) => {
          return startA <= endB && endA >= startB;
        };

        const filteredOffers = offers.filter((o: any) => {
          const date = o.campaignStartDate || o.closingDate || o.created_at || '';
          const dateStr = date.substring(0, 10);
          return dateStr >= dateRange.start && dateStr <= dateRange.end;
        });

        const filteredReservations = reservations.filter((r: any) => {
          const rStart = r.startDate || r.start_date || '';
          const rEnd = r.endDate || r.end_date || '';
          return datesOverlap(rStart.substring(0, 10), rEnd.substring(0, 10), dateRange.start, dateRange.end);
        });

        const filteredCampaigns = campaigns.filter((c: any) => {
          const cStart = c.startDate || c.start_date || '';
          const cEnd = c.endDate || c.end_date || '';
          return datesOverlap(cStart.substring(0, 10), cEnd.substring(0, 10), dateRange.start, dateRange.end);
        });

        let totalPending = 0;
        let paymentsCount = 0;
        if (finance && finance.accounts) {
          finance.accounts.forEach((acc: any) => {
            const inRangeInvoices = (acc.invoices || []).filter((inv: any) => {
              const invDate = inv.date || '';
              let dateStr = invDate;
              if (invDate.includes('.')) {
                const parts = invDate.split('.');
                dateStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
              }
              return dateStr >= dateRange.start && dateStr <= dateRange.end;
            });
            
            inRangeInvoices.forEach((inv: any) => {
              if (inv.status !== 'Ödendi') {
                const val = parseFloat((inv.amount || '0').replace(/[^0-9]/g, '')) || 0;
                totalPending += val;
                paymentsCount++;
              }
            });
          });
        }

        const totalSpacesCount = spaces.length;
        const occupiedSpaceIds = new Set<string>();
        filteredReservations.forEach((r: any) => {
          if (r.spaceId) {
            occupiedSpaceIds.add(r.spaceId);
          }
        });
        
        const doluSpacesCount = occupiedSpaceIds.size;
        const bosSpacesCount = Math.max(0, totalSpacesCount - doluSpacesCount);
        const rate = totalSpacesCount > 0 ? (doluSpacesCount / totalSpacesCount) * 100 : 0;

        setSpacesCount(totalSpacesCount);
        setDoluCount(doluSpacesCount);
        setBosCount(bosSpacesCount);
        setTeklifCount(filteredOffers.length);
        setBakimCount(spaces.filter((s: any) => s.status === 'bakim').length);

        setOffersCount(filteredOffers.length);
        setReservationsCount(filteredReservations.length);
        setCampaignsCount(filteredCampaigns.length);
        setPendingCollections(totalPending);
        setOccupancyRate(rate);

        const mappedCampTable = filteredCampaigns.map((c: any) => {
          const relatedSpace = spaces.find((s: any) => s.id === (c.spaceIds && c.spaceIds[0]));
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

        const steps = [
          { name: 'Hazırlandı', count: filteredOffers.filter((o: any) => o.stage === 'Teklif Hazırlandı').length, budget: `₺ ${(filteredOffers.filter((o: any) => o.stage === 'Teklif Hazırlandı').reduce((sum: number, o: any) => sum + o.valueNumeric, 0) / 1000000).toFixed(1)}M` },
          { name: 'Onaya Gönderildi', count: filteredOffers.filter((o: any) => o.stage === 'Onaya Gönderildi').length, budget: `₺ ${(filteredOffers.filter((o: any) => o.stage === 'Onaya Gönderildi').reduce((sum: number, o: any) => sum + o.valueNumeric, 0) / 1000000).toFixed(1)}M` },
          { name: 'Sözleşme Bekliyor', count: filteredOffers.filter((o: any) => o.stage === 'Sözleşme Bekliyor').length, budget: `₺ ${(filteredOffers.filter((o: any) => o.stage === 'Sözleşme Bekliyor').reduce((sum: number, o: any) => sum + o.valueNumeric, 0) / 1000000).toFixed(1)}M` },
          { name: 'Sözleşme İmzalandı', count: filteredOffers.filter((o: any) => o.stage === 'Sözleşme İmzalandı').length, budget: `₺ ${(filteredOffers.filter((o: any) => o.stage === 'Sözleşme İmzalandı').reduce((sum: number, o: any) => sum + o.valueNumeric, 0) / 1000000).toFixed(1)}M` }
        ];
        setPipelineSteps(steps);

        console.log("DEBUG DASHBOARD METRICS:", {
          dateRange,
          loadedOffersCount: offers.length,
          loadedReservationsCount: reservations.length,
          loadedCampaignsCount: campaigns.length,
          loadedPaymentsCount: paymentsCount,
          calculatedDashboardSummary: {
            filteredOffers: filteredOffers.length,
            filteredReservations: filteredReservations.length,
            filteredCampaigns: filteredCampaigns.length,
            pendingCollections: totalPending,
            occupancyRate: rate,
            emptySpaces: bosSpacesCount
          }
        });

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  const spaceStatusData = [
    { name: 'Dolu', value: doluCount, color: '#10b981' },
    { name: 'Boş', value: bosCount, color: '#f59e0b' },
    { name: 'Teklif', value: teklifCount, color: '#8b5cf6' },
    { name: 'Bakımda', value: bakimCount, color: '#ef4444' }
  ];

  const spaceTypeRevenueData = [
    { name: 'LED Ekran', value: doluCount > 0 ? 70 : 0, color: '#3b82f6' },
    { name: 'Lightbox', value: doluCount > 0 ? 30 : 0, color: '#8b5cf6' }
  ];

  const hasNoDataInRange = 
    offersCount === 0 && 
    reservationsCount === 0 && 
    campaignsCount === 0 && 
    pendingCollections === 0;

  return (
    <div className="space-y-6 select-none pb-12 text-left">
      {/* Top Header Section with Date Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 p-5 rounded-3xl border border-white/5 shadow-sm text-left">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">PERFORMANS DASHBOARD</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Seçili tarih aralığına göre teklifler, rezervasyonlar, kampanyalar ve doluluk oranları analitiği.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto bg-[#12192B]/80 p-2.5 rounded-2xl border border-white/5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Başlangıç:</span>
            <input 
              type="date" 
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="bg-white/5 border border-white/5 rounded-xl px-2.5 py-1 text-[10px] font-bold text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Bitiş:</span>
            <input 
              type="date" 
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="bg-white/5 border border-white/5 rounded-xl px-2.5 py-1 text-[10px] font-bold text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {!loading && !hasNoGlobalData && hasNoDataInRange && (
        <Notification
          title="Seçili Tarih Aralığında Veri Yok"
          description="Seçtiğiniz tarih aralığına (Mayıs 2025 veya diğer) ait herhangi bir teklif, rezervasyon, kampanya ya da finansal tahsilat kaydı bulunamadı."
          type="alert"
          onClose={() => {}}
        />
      )}

      {/* 6 KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <DarkKpiCard
          title="Toplam Teklif"
          value={loading ? '...' : String(offersCount)}
          percentage="Seçili Dönem"
          subtext="Oluşturulan teklifler"
          icon={<FileText size={15} />}
          iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/10"
          glowColor="blue"
        />
        <DarkKpiCard
          title="Aktif Rezervasyon"
          value={loading ? '...' : String(reservationsCount)}
          percentage="Seçili Dönem"
          subtext="Aktif rezervasyonlar"
          icon={<Bookmark size={15} />}
          iconBgColor="bg-emerald-500/10 text-emerald-450 border-emerald-450/10"
          glowColor="green"
        />
        <DarkKpiCard
          title="Aktif Kampanya"
          value={loading ? '...' : String(campaignsCount)}
          percentage="Yayında"
          subtext="Yayındaki kampanyalar"
          icon={<CheckCheck size={15} />}
          iconBgColor="bg-purple-500/10 text-purple-400 border-purple-400/10"
          glowColor="purple"
        />
        <DarkKpiCard
          title="Tahsilat Bekleyen"
          value={loading ? '...' : `₺ ${pendingCollections.toLocaleString('tr-TR')}`}
          percentage="Finans"
          subtext="Bekleyen ödemeler"
          icon={<Coins size={15} />}
          iconBgColor="bg-rose-500/10 text-rose-450 border-rose-500/10"
          glowColor="red"
        />
        <DarkKpiCard
          title="Doluluk Oranı"
          value={loading ? '...' : `% ${occupancyRate.toFixed(1)}`}
          percentage="Oran"
          subtext="Dolu / Toplam alan"
          icon={<TrendingUp size={15} />}
          iconBgColor="bg-sky-500/10 text-sky-400 border-sky-500/10"
          glowColor="blue"
        />
        <DarkKpiCard
          title="Boş Reklam Alanı"
          value={loading ? '...' : String(bosCount)}
          percentage="Müsait"
          subtext="Kiralanabilir alanlar"
          icon={<Circle size={15} />}
          iconBgColor="bg-amber-500/10 text-amber-400 border-amber-500/10"
          glowColor="yellow"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : hasNoGlobalData ? (
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
