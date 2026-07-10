import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  CheckSquare, 
  Circle, 
  FileText, 
  Wrench, 
  TrendingUp, 
  Layers, 
  Eye, 
  Maximize2,
  PlusSquare,
  Bookmark,
  FileSpreadsheet,
  Calendar,
  Sparkles,
  Search,
  Compass,
  ArrowRight,
  TrendingDown,
  Navigation,
  DollarSign
} from 'lucide-react';
import { Badge } from '@/components/design-system/Badge';
import { Button } from '@/components/design-system/Button';
import { DarkKpiCard } from '@/components/design-system/DarkKpiCard';
import { DarkDashboardCard } from '@/components/design-system/DarkDashboardCard';
import { 
  offerRepository, 
  contractRepository, 
  reservationRepository, 
  campaignRepository, 
  spaceRepository, 
  financeRepository 
} from '@/repositories';
import { AdvertisingSpace } from '@/data/advertisingSpaces';
import { OfferModal } from '@/components/design-system/OfferModal';
import { useApp } from '@/context/AppContext';

export function MapDashboard() {
  const { setCurrentRoute } = useApp();

  // Selected Network state
  const [selectedNetwork, setSelectedNetwork] = useState<string>('outdoor-istanbul');
  
  // Map Layer States
  const [showAllSpaces, setShowAllSpaces] = useState(true);
  const [showAvailable, setShowAvailable] = useState(true);
  const [showOptions, setShowOptions] = useState(true);
  const [showReserved, setShowReserved] = useState(true);
  const [showMaintenance, setShowMaintenance] = useState(true);
  const [mapType, setMapType] = useState<'earth' | 'map'>('earth');
  const [trafficLayer, setTrafficLayer] = useState(true);

  // Search keyword inside map
  const [searchKeyword, setSearchKeyword] = useState('');

  // Selected Space for details panel
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);

  // OfferModal control
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  // Load raw data
  const [spaces, setSpaces] = useState<AdvertisingSpace[]>([]);
  const [offersCount, setOffersCount] = useState(0);
  const [reservationsCount, setReservationsCount] = useState(0);
  const [campaignsCount, setCampaignsCount] = useState(0);
  
  useEffect(() => {
    // Reload state on mounts or updates
    const loadData = () => {
      setSpaces(spaceRepository.getAllSync());
      setOffersCount(offerRepository.getAllSync().length);
      setReservationsCount(reservationRepository.getAllSync().length);
      setCampaignsCount(campaignRepository.getAllSync().length);
    };
    loadData();
    
    // Listen for database changes to refresh GIS dashboard values dynamically
    window.addEventListener('spaces_updated', loadData);
    window.addEventListener('offers_updated', loadData);
    window.addEventListener('reservations_updated', loadData);
    return () => {
      window.removeEventListener('spaces_updated', loadData);
      window.removeEventListener('offers_updated', loadData);
      window.removeEventListener('reservations_updated', loadData);
    };
  }, []);

  // Set default selected space if network changes
  useEffect(() => {
    const networkSpaces = spaces.filter(s => s.networkId === selectedNetwork);
    if (networkSpaces.length > 0) {
      setSelectedSpaceId(networkSpaces[0].id);
    } else {
      setSelectedSpaceId(null);
    }
  }, [selectedNetwork, spaces]);

  // Coordinates boxes mapping coordinates into screen percent bounds based on selected network
  const getCoordinatesNormalization = (lat: number, lng: number) => {
    let latMin = 40.95, latMax = 41.15, lngMin = 28.85, lngMax = 29.15; // default outdoor-istanbul

    if (selectedNetwork === 'saw-airport') {
      latMin = 40.894; latMax = 40.900; lngMin = 29.303; lngMax = 29.313;
    } else if (selectedNetwork === 'outdoor-ankara') {
      // simulated Ankara layout box bounds
      latMin = 39.80; latMax = 40.00; lngMin = 32.70; lngMax = 33.00;
    } else if (selectedNetwork === 'outdoor-turkiye') {
      // simulated Turkey country-wide bounds
      latMin = 36.00; latMax = 42.00; lngMin = 26.00; lngMax = 45.00;
    }

    const y = ((latMax - lat) / (latMax - latMin)) * 100;
    const x = ((lng - lngMin) / (lngMax - lngMin)) * 100;

    return {
      top: `${Math.max(8, Math.min(88, y))}%`,
      left: `${Math.max(8, Math.min(88, x))}%`
    };
  };

  // Filtered spaces by network, status checkboxes, and search keyword
  const filteredSpaces = useMemo(() => {
    return spaces.filter(s => {
      // Network filter
      if (s.networkId !== selectedNetwork) return false;

      // Status filters
      const statusMap = s.status;
      if (statusMap === 'bos' && !showAvailable) return false;
      if (statusMap === 'teklif' && !showOptions) return false;
      if (statusMap === 'dolu' && !showReserved) return false;
      if ((statusMap as string) === 'rezerve' && !showReserved) return false;
      if (statusMap === 'bakim' && !showMaintenance) return false;

      // Search keyword filter
      if (searchKeyword.trim() !== '') {
        const keyword = searchKeyword.toLowerCase();
        return (
          s.name.toLowerCase().includes(keyword) ||
          s.code.toLowerCase().includes(keyword) ||
          (s.district || '').toLowerCase().includes(keyword)
        );
      }

      return true;
    });
  }, [spaces, selectedNetwork, showAvailable, showOptions, showReserved, showMaintenance, searchKeyword]);

  // Selected space object
  const activeSpace = useMemo(() => {
    return spaces.find(s => s.id === selectedSpaceId) || null;
  }, [spaces, selectedSpaceId]);

  // Dynamic Network KPIs calculations
  const networkKpis = useMemo(() => {
    const totalList = spaces.filter(s => s.networkId === selectedNetwork);
    const total = totalList.length;
    if (total === 0) {
      return { total: 0, available: 0, options: 0, reserved: 0, maintenance: 0, availablePct: 0, optionsPct: 0, reservedPct: 0, maintenancePct: 0 };
    }

    const available = totalList.filter(s => s.status === 'bos').length;
    const options = totalList.filter(s => s.status === 'teklif').length;
    const reserved = totalList.filter(s => s.status === 'dolu' || (s.status as string) === 'rezerve').length;
    const maintenance = totalList.filter(s => s.status === 'bakim').length;

    return {
      total,
      available,
      options,
      reserved,
      maintenance,
      availablePct: Math.round((available / total) * 100),
      optionsPct: Math.round((options / total) * 100),
      reservedPct: Math.round((reserved / total) * 100),
      maintenancePct: Math.round((maintenance / total) * 100)
    };
  }, [spaces, selectedNetwork]);

  // Proposal Pipeline details calculation for current network
  const pipelineStats = useMemo(() => {
    const allOffers = offerRepository.getAllSync();
    
    // Filter offers containing spaces belonging to current network
    const networkOffers = allOffers.filter(o => {
      if (!o.spaceIds) return false;
      return o.spaceIds.some(sid => {
        const space = spaces.find(s => s.id === sid);
        return space?.networkId === selectedNetwork;
      });
    });

    return {
      hazirlandi: networkOffers.filter(o => o.stage === 'Teklif Hazırlandı').length,
      onayaGonderildi: networkOffers.filter(o => o.stage === 'Onaya Gönderildi').length,
      sozlesmeBekliyor: networkOffers.filter(o => o.stage === 'Sözleşme Bekliyor').length,
      sozlesmeImzalandı: networkOffers.filter(o => o.stage === 'Sözleşme İmzalandı').length,
      operasyonaAktarildi: networkOffers.filter(o => o.stage === 'Operasyona Aktarıldı').length,
      iptal: networkOffers.filter(o => o.stage === 'İptal').length
    };
  }, [spaces, selectedNetwork]);

  // Operation indicators calculations for selected network
  const opIndicators = useMemo(() => {
    const allReservations = reservationRepository.getAllSync();
    const allCampaigns = campaignRepository.getAllSync();
    const financeData = financeRepository.getFinanceDataSync();

    // Filter elements based on network matching
    const networkReservations = allReservations.filter(r => {
      const sp = spaces.find(s => s.code === r.spaceCode);
      return sp?.networkId === selectedNetwork;
    });

    const networkCampaigns = allCampaigns.filter(c => {
      if (!c.spaceIds) return false;
      return c.spaceIds.some(sid => {
        const space = spaces.find(s => s.id === sid);
        return space?.networkId === selectedNetwork;
      });
    });

    const activeResCount = networkReservations.filter(r => r.status === 'Aktif' || (r.status as string) === 'Kesin Rezervasyon').length;
    const activeCampCount = networkCampaigns.filter(c => c.status === 'Aktif').length;

    // Calculate revenue and balances
    let totalRevenue = 0;
    let totalCollected = 0;
    let pendingCollection = 0;

    networkReservations.forEach(r => {
      const val = parseInt((r.budget || '').replace(/[^0-9]/g, ''), 10) || 0;
      totalRevenue += val;
      if (r.status === 'Aktif') {
        totalCollected += val * 0.60; // simulated collection rate
        pendingCollection += val * 0.40;
      }
    });

    const networkSpaces = spaces.filter(s => s.networkId === selectedNetwork);
    const doluCount = networkSpaces.filter(s => s.status === 'dolu' || (s.status as string) === 'rezerve').length;
    const occupancyRate = networkSpaces.length > 0 ? Math.round((doluCount / networkSpaces.length) * 100) : 0;

    return {
      activeReservations: activeResCount,
      activeCampaigns: activeCampCount,
      totalRevenue,
      totalCollected,
      pendingCollection,
      occupancyRate
    };
  }, [spaces, selectedNetwork]);

  const handleSpaceClick = (id: string) => {
    setSelectedSpaceId(id);
  };

  const getPinColorClass = (status: string) => {
    switch (status) {
      case 'bos': return 'bg-emerald-500 text-emerald-100 glow-green border-emerald-450';
      case 'teklif': return 'bg-amber-500 text-amber-100 glow-yellow border-amber-450';
      case 'dolu':
      case 'rezerve': return 'bg-rose-500 text-rose-100 glow-red border-rose-450';
      case 'bakim': return 'bg-slate-500 text-slate-100 glow-gray border-slate-450';
      default: return 'bg-slate-500 text-slate-100 border-slate-400';
    }
  };

  return (
    <div className="space-y-6 text-left select-none pb-12 bg-transparent">
      {/* Upper selector & main header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-[#0a1424] border border-white/5 p-4 rounded-2xl relative overflow-hidden select-none">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
          <div className="space-y-0.5 text-left">
            <h2 className="text-xs font-black text-white uppercase tracking-widest leading-none flex items-center gap-1">
              <Compass size={12} className="text-blue-500 animate-spin animate-duration-3000" />
              Unified GIS Network Dashboard
            </h2>
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Coğrafi Ağ Haritası & Canlı Stok Envanteri</span>
          </div>
        </div>

        {/* Upper Network Selector */}
        <div className="relative">
          <select
            value={selectedNetwork}
            onChange={(e) => setSelectedNetwork(e.target.value)}
            className="bg-[#12192B] border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black text-white uppercase tracking-widest cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/35 appearance-none pr-9 h-10"
          >
            <option value="outdoor-istanbul">Outdoor İstanbul Network</option>
            <option value="saw-airport">SAW Airport Network</option>
            <option value="outdoor-ankara">Outdoor Ankara Network</option>
            <option value="outdoor-turkiye">Outdoor Türkiye Geneli</option>
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[8px]">
            ▼
          </div>
        </div>
      </div>

      {/* Network KPIs Row (5 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <DarkKpiCard
          title="Toplam Alan"
          value={String(networkKpis.total)}
          percentage="Network Tümü"
          subtext="Toplam envanter"
          icon={<MapPin size={15} />}
          iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/10"
          glowColor="blue"
        />
        <DarkKpiCard
          title="MÜSAİT"
          value={String(networkKpis.available)}
          percentage={`%${networkKpis.availablePct}`}
          subtext="Kiralanabilir boş"
          icon={<Circle size={15} />}
          iconBgColor="bg-emerald-500/10 text-emerald-400 border-emerald-500/10"
          glowColor="green"
        />
        <DarkKpiCard
          title="OPSİYON / TEKLİF"
          value={String(networkKpis.options)}
          percentage={`%${networkKpis.optionsPct}`}
          subtext="Teklif aşamasındaki"
          icon={<FileText size={15} />}
          iconBgColor="bg-amber-500/10 text-amber-400 border-amber-500/10"
          glowColor="yellow"
        />
        <DarkKpiCard
          title="REZERVE / DOLU"
          value={String(networkKpis.reserved)}
          percentage={`%${networkKpis.reservedPct}`}
          subtext="Sözleşmeli dolu"
          icon={<CheckSquare size={15} />}
          iconBgColor="bg-rose-500/10 text-rose-450 border-rose-500/10"
          glowColor="red"
        />
        <DarkKpiCard
          title="BAKIMDA"
          value={String(networkKpis.maintenance)}
          percentage={`%${networkKpis.maintenancePct}`}
          subtext="Arızalı servis"
          icon={<Wrench size={15} />}
          iconBgColor="bg-slate-500/10 text-slate-400 border-slate-500/10"
          glowColor="none"
        />
      </div>

      {/* Main Map & Detail Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left GIS Map View Container (8 columns) */}
        <div className="lg:col-span-8 dark-glass-card border border-white/5 rounded-2xl relative overflow-hidden h-[540px] flex flex-col justify-between p-4 bg-[#12192B]/85">
          {/* Mock Dark Satellite Background Map Layer */}
          <div className="absolute inset-0 z-0">
            {mapType === 'earth' ? (
              <div 
                className="w-full h-full bg-cover bg-center transition-all duration-300 opacity-65"
                style={{ 
                  backgroundImage: selectedNetwork === 'saw-airport'
                    ? "radial-gradient(circle at center, #1b263b 0%, #0b1020 80%)"
                    : "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop')"
                }}
              >
                {/* SVG lines mimicking airport runways or highway grids */}
                <svg className="w-full h-full opacity-15 stroke-blue-500" fill="none">
                  {selectedNetwork === 'saw-airport' ? (
                    <>
                      <line x1="10%" y1="30%" x2="90%" y2="30%" strokeWidth="4" strokeDasharray="10 5" />
                      <line x1="15%" y1="55%" x2="85%" y2="55%" strokeWidth="6" />
                      <path d="M 10 30 Q 50 80 90 30" strokeWidth="2" strokeDasharray="5 5" />
                    </>
                  ) : (
                    <>
                      <path d="M 50,0 Q 150,150 150,300 T 50,450" strokeWidth="2" />
                      <path d="M 0,200 Q 200,100 400,200 T 800,200" strokeWidth="3" />
                      <circle cx="450" cy="220" r="120" strokeWidth="1" strokeDasharray="3 3" />
                    </>
                  )}
                </svg>
              </div>
            ) : (
              <div className="w-full h-full bg-[#0d1527] transition-all duration-300 relative">
                {/* Vector map roads simulation grid */}
                <div className="absolute inset-0 premium-grid-bg opacity-25" />
                <svg className="w-full h-full opacity-10 stroke-slate-500" fill="none">
                  <path d="M 0,100 L 800,100 M 0,300 L 800,300 M 200,0 L 200,500 M 600,0 L 600,500" strokeWidth="2" />
                  <path d="M 0,0 L 800,500" strokeWidth="1" strokeDasharray="5 5" />
                </svg>
              </div>
            )}
            
            {/* Traffic Density overlay layer */}
            {trafficLayer && (
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-amber-500/5 to-rose-500/5 pointer-events-none mix-blend-overlay animate-pulse animate-duration-5000" />
            )}
          </div>

          {/* Map Header overlays: Search and Map controls */}
          <div className="z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 w-full">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Konum, mahalle, cadde ara..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="h-10 w-full bg-[#0a101d]/90 border border-white/8 rounded-xl pl-9 pr-4 text-xs font-semibold text-white focus:outline-none focus:border-blue-500/50 focus:shadow-[0_0_12px_rgba(59,130,246,0.15)] placeholder-white/35"
              />
              <Search size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Scale/Controls mock */}
            <div className="flex gap-2">
              <span className="text-[8px] bg-slate-900/80 px-2 py-1.5 rounded-lg border border-white/5 font-black uppercase text-slate-500 tracking-wider">
                Ölçek: 1 : 25.000
              </span>
            </div>
          </div>

          {/* Left Layers Overlay Panel */}
          <div className="absolute left-4 top-16 z-10 p-4 bg-[#0a101d]/90 border border-white/5 rounded-2xl w-48 text-left space-y-3.5 backdrop-blur-md shadow-2xl">
            <div className="space-y-2">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">KATMANLAR</span>
              <div className="space-y-1.5 text-[9px] font-bold text-slate-300">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={showAllSpaces} onChange={(e) => {
                    const val = e.target.checked;
                    setShowAllSpaces(val);
                    setShowAvailable(val);
                    setShowOptions(val);
                    setShowReserved(val);
                    setShowMaintenance(val);
                  }} className="accent-blue-500 rounded" />
                  <span>Tüm Alanlar</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={showAvailable} onChange={(e) => setShowAvailable(e.target.checked)} className="accent-emerald-500 rounded" />
                  <span className="text-emerald-400">Müsait Alanlar</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={showOptions} onChange={(e) => setShowOptions(e.target.checked)} className="accent-amber-500 rounded" />
                  <span className="text-amber-400">Opsiyon / Teklif</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={showReserved} onChange={(e) => setShowReserved(e.target.checked)} className="accent-rose-500 rounded" />
                  <span className="text-rose-450">Rezerve / Dolu</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={showMaintenance} onChange={(e) => setShowMaintenance(e.target.checked)} className="accent-slate-500 rounded" />
                  <span className="text-slate-400">Bakımda</span>
                </label>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">GÖRÜNÜM</span>
              <div className="flex gap-2 text-[8px] font-black uppercase tracking-wider">
                <button
                  onClick={() => setMapType('earth')}
                  className={`flex-1 py-1 px-1.5 rounded border transition-all cursor-pointer ${mapType === 'earth' ? 'bg-blue-600/10 border-blue-500/20 text-blue-450' : 'bg-transparent border-white/5 text-slate-400'}`}
                >
                  Earth
                </button>
                <button
                  onClick={() => setMapType('map')}
                  className={`flex-1 py-1 px-1.5 rounded border transition-all cursor-pointer ${mapType === 'map' ? 'bg-blue-600/10 border-blue-500/20 text-blue-450' : 'bg-transparent border-white/5 text-slate-400'}`}
                >
                  Maps
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-[9px] font-bold text-slate-400">
              <span>Trafik Yoğunluğu</span>
              <button 
                onClick={() => setTrafficLayer(!trafficLayer)}
                className={`w-7 h-4 rounded-full p-0.5 transition-colors cursor-pointer ${trafficLayer ? 'bg-blue-500' : 'bg-slate-800'}`}
              >
                <div className={`w-3 h-3 rounded-full bg-white transition-transform ${trafficLayer ? 'translate-x-3' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {/* Interactive GIS Pins Render */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {filteredSpaces.map(s => {
              const coords = getCoordinatesNormalization(s.latitude || 41.0, s.longitude || 29.0);
              const isSelected = s.id === selectedSpaceId;
              const colorClass = getPinColorClass(s.status);

              return (
                <div
                  key={s.id}
                  style={{ top: coords.top, left: coords.left }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpaceClick(s.id);
                  }}
                  className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                >
                  <div 
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[7.5px] font-black tracking-tighter uppercase transition-all duration-200 select-none shadow-md ${colorClass} ${isSelected ? 'scale-125 ring-4 ring-blue-500/40 border-white z-30' : 'hover:scale-110 hover:z-20'}`}
                  >
                    {s.code.replace(/[A-Z-]/g, '')}
                  </div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all origin-bottom bg-[#0a101d] border border-white/10 text-white rounded-xl p-2 w-32 shadow-2xl text-center pointer-events-none select-none z-[120]">
                    <span className="text-[7.5px] font-black text-slate-500 block uppercase">#{s.code}</span>
                    <span className="text-[9px] font-black block truncate leading-normal text-white">{s.name}</span>
                    <span className="text-[8px] font-extrabold text-emerald-450 block mt-0.5">{s.price}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Footer legend */}
          <div className="z-10 w-full flex justify-center mt-auto">
            <div className="flex gap-4 p-2 bg-[#0a101d]/90 border border-white/5 rounded-xl text-[8.5px] font-black uppercase tracking-wider backdrop-blur-md">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 glow-green" /><span>Müsait</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 glow-yellow" /><span>Opsiyon</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500 glow-red" /><span>Dolu</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-500 glow-gray" /><span>Bakımda</span></div>
            </div>
          </div>
        </div>

        {/* Right Detail Panel (4 columns) */}
        <div className="lg:col-span-4 dark-glass-card border border-white/5 rounded-2xl p-5 flex flex-col justify-between bg-[#12192B] text-left">
          {activeSpace ? (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              {/* Photo section */}
              <div className="space-y-3">
                <div className="relative h-44 rounded-xl overflow-hidden border border-white/5 bg-slate-900">
                  <img
                    src={activeSpace.photoUrl || activeSpace.image}
                    alt={activeSpace.name}
                    className="w-full h-full object-cover select-none"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant={activeSpace.status === 'bos' ? 'success' : activeSpace.status === 'teklif' ? 'warning' : 'danger'}>
                      {activeSpace.status === 'bos' ? 'Müsait' : activeSpace.status === 'teklif' ? 'Opsiyon' : 'Dolu'}
                    </Badge>
                  </div>
                </div>

                {/* Name and labels */}
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">#{activeSpace.code}</span>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider leading-snug">{activeSpace.name}</h3>
                  <span className="text-[8.5px] text-slate-500 font-extrabold uppercase tracking-wide flex items-center gap-1">
                    <MapPin size={10} />
                    {activeSpace.district ? `${activeSpace.district}, ${activeSpace.city}` : activeSpace.location}
                  </span>
                </div>

                {/* Specs list */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 border-t border-white/5 text-[9.5px]">
                  <div>
                    <span className="text-slate-500 font-bold block uppercase text-[8px]">Tip</span>
                    <span className="text-white font-extrabold">{activeSpace.type}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block uppercase text-[8px]">Koordinat</span>
                    <span className="text-white font-extrabold">{activeSpace.latitude?.toFixed(4)}, {activeSpace.longitude?.toFixed(4)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block uppercase text-[8px]">Günlük Trafik</span>
                    <span className="text-white font-extrabold">₺ {activeSpace.traffic?.toLocaleString('tr-TR')} + araç</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block uppercase text-[8px]">Görünürlük Skoru</span>
                    <span className="text-white font-extrabold">{activeSpace.visibilityScore || 85} / 100</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block uppercase text-[8px]">Ebat</span>
                    <span className="text-white font-extrabold">{activeSpace.dimensions || activeSpace.size}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block uppercase text-[8px]">Aylık Fiyat</span>
                    <span className="text-emerald-450 font-black">{activeSpace.price}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block uppercase text-[8px]">Açık Hava Süresi</span>
                    <span className="text-white font-extrabold">{activeSpace.workingHours}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block uppercase text-[8px]">Yön</span>
                    <span className="text-white font-extrabold">{activeSpace.direction || 'Giriş Cephesi'}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 gap-2.5 pt-4 border-t border-white/5 mt-auto">
                <Button 
                  onClick={() => setIsOfferModalOpen(true)}
                  className="w-full h-11 bg-blue-500 hover:bg-blue-600 font-black text-[10px] uppercase tracking-wider cursor-pointer"
                >
                  + Teklife Ekle
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => alert(`${activeSpace.code} detayı açılacak.`)}
                  className="w-full h-10 border border-white/8 hover:bg-white/5 text-slate-300 font-black text-[9px] uppercase tracking-wider cursor-pointer"
                >
                  Detay
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-full text-slate-500 py-12 space-y-2.5">
              <span className="text-2xl">📍</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Alan Seçilmedi</span>
              <span className="text-[9px] font-semibold max-w-[180px] leading-relaxed">Haritada bir pini seçerek detay bilgilerini burada görüntüleyebilirsiniz.</span>
            </div>
          )}
        </div>
      </div>

      {/* Alt Kart Carousel */}
      <div className="space-y-2">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block text-left">
          Haritada Görünen Reklam Alanları ({filteredSpaces.length} Alan)
        </span>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin select-none no-scrollbar snap-x">
          {filteredSpaces.map(s => {
            const isSelected = s.id === selectedSpaceId;
            return (
              <div
                key={s.id}
                onClick={() => handleSpaceClick(s.id)}
                className={`snap-start shrink-0 w-60 p-3 rounded-2xl border cursor-pointer transition-all duration-150 text-left flex gap-3 ${isSelected ? 'bg-blue-600/5 border-blue-500/50 ring-2 ring-blue-500/35 text-white' : 'bg-[#12192B] border-white/5 text-slate-350 hover:border-white/12'}`}
              >
                <img
                  src={s.photoUrl || s.image}
                  alt={s.name}
                  className="w-14 h-14 rounded-lg object-cover shrink-0 select-none bg-slate-900 border border-white/5"
                />
                <div className="space-y-1 truncate flex-1 min-w-0">
                  <div className="flex justify-between items-center gap-1">
                    <span className="text-[8px] font-black text-blue-400 uppercase tracking-wider">#{s.code}</span>
                    <span className={`text-[7px] font-black px-1.5 py-0.2 rounded uppercase ${s.status === 'bos' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {s.status === 'bos' ? 'MÜSAİT' : 'DOLU'}
                    </span>
                  </div>
                  <h4 className="text-[9.5px] font-black text-white truncate uppercase tracking-wide leading-none">{s.name}</h4>
                  <span className="text-[8px] text-slate-500 font-extrabold uppercase block">{s.district ? `${s.district}` : s.location}</span>
                  <div className="flex justify-between items-center text-[9px] font-black mt-1">
                    <span className="text-emerald-450">{s.price}</span>
                    <span className="text-slate-500 font-bold uppercase text-[7.5px]">{s.type}</span>
                  </div>
                </div>
              </div>
            );
          })}
          {filteredSpaces.length === 0 && (
            <div className="w-full text-center py-6 text-slate-500 text-[10px] font-bold uppercase tracking-wider bg-[#12192B] border border-white/5 rounded-2xl">
              Filtrelere uygun reklam alanı bulunamadı.
            </div>
          )}
        </div>
      </div>

      {/* Teklif & Sözleşme Süreci (Pipeline Stage Steps) */}
      <div className="grid grid-cols-1 gap-6">
        <DarkDashboardCard
          title="TEKLİF & SÖZLEŞME SÜRECİ"
          description="Seçili network üzerindeki güncel satış tekliflerinin huni dağılımı"
          className="w-full"
        >
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3.5 pt-2">
            {[
              { label: 'Teklif Hazırlandı', count: pipelineStats.hazirlandi, color: 'text-slate-400 border-white/5 bg-[#151B2D]' },
              { label: 'Onaya Gönderildi', count: pipelineStats.onayaGonderildi, color: 'text-yellow-400 border-yellow-500/15 bg-yellow-500/5' },
              { label: 'Sözleşme Bekliyor', count: pipelineStats.sozlesmeBekliyor, color: 'text-blue-400 border-blue-500/15 bg-blue-500/5' },
              { label: 'Sözleşme İmzalandı', count: pipelineStats.sozlesmeImzalandı, color: 'text-emerald-400 border-emerald-500/15 bg-emerald-500/5' },
              { label: 'Operasyona Aktarıldı', count: pipelineStats.operasyonaAktarildi, color: 'text-indigo-400 border-indigo-500/15 bg-indigo-500/5' },
              { label: 'İptal', count: pipelineStats.iptal, color: 'text-red-400 border-red-500/15 bg-red-500/5' }
            ].map((step, idx) => (
              <div 
                key={step.label}
                className={`p-3 rounded-xl border flex flex-col justify-between text-left h-24 hover:scale-[1.01] transition-transform ${step.color}`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[7.5px] font-black uppercase tracking-wider">{idx + 1}. {step.label}</span>
                  {step.count > 0 && <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />}
                </div>
                <div className="text-center pt-2">
                  <span className="text-xl font-black text-white">{step.count}</span>
                  <span className="text-[7.5px] block font-bold text-slate-500 uppercase tracking-widest mt-1">Fırsat Kartı</span>
                </div>
              </div>
            ))}
          </div>
        </DarkDashboardCard>
      </div>

      {/* Alt Operasyon KPI & Hızlı Erişim Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sol: Operasyonel KPI'lar */}
        <div className="lg:col-span-8 dark-glass-card border border-white/5 rounded-2xl p-5 bg-[#12192B] grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Aktivite Raporu</span>
              <Badge variant="success">Canlı</Badge>
            </div>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-slate-400">Aktif Rezervasyon</span>
                <span className="text-white font-extrabold">{opIndicators.activeReservations} Slot</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-slate-400">Aktif Kampanya</span>
                <span className="text-white font-extrabold">{opIndicators.activeCampaigns} Adet</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-slate-400">Cari Doluluk</span>
                <span className="text-emerald-450 font-black">%{opIndicators.occupancyRate}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Finans Özeti</span>
              <DollarSign size={11} className="text-emerald-450" />
            </div>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-slate-400">Toplam Hacim</span>
                <span className="text-white font-black">₺ {opIndicators.totalRevenue.toLocaleString('tr-TR')}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-slate-400">Tahsil Edilen</span>
                <span className="text-emerald-450 font-black">₺ {opIndicators.totalCollected.toLocaleString('tr-TR')}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-slate-400">Bekleyen Bakiye</span>
                <span className="text-rose-450 font-black">₺ {opIndicators.pendingCollection.toLocaleString('tr-TR')}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Doluluk Oranı</span>
              <TrendingUp size={11} className="text-blue-400" />
            </div>
            <div className="space-y-3 pt-1">
              <div className="flex justify-between text-[10px] font-black text-white leading-none">
                <span>%{opIndicators.occupancyRate} Dolu</span>
                <span className="text-slate-500">/{networkKpis.total} Toplam</span>
              </div>
              <div className="w-full bg-[#151B2D] h-2 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${opIndicators.occupancyRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sağ: Hızlı Erişim */}
        <div className="lg:col-span-4 dark-glass-card border border-white/5 rounded-2xl p-5 bg-[#12192B] text-left flex flex-col justify-between">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider pb-2 border-b border-white/5 block">Hızlı Erişim Aksiyonları</span>
          <div className="grid grid-cols-2 gap-3 pt-3 flex-1">
            <button
              onClick={() => setIsOfferModalOpen(true)}
              className="p-3 bg-blue-500/10 border border-blue-500/15 text-blue-400 hover:bg-blue-500/15 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer select-none text-center"
            >
              <PlusSquare size={16} />
              <span className="text-[8px] font-black uppercase tracking-wider">Yeni Teklif</span>
            </button>
            <button
              onClick={() => {
                alert('Yeni sözleşme teklif ekranı üzerinden imza adımıyla oluşturulur.');
              }}
              className="p-3 bg-emerald-500/10 border border-emerald-500/15 text-emerald-450 hover:bg-emerald-500/15 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer select-none text-center"
            >
              <Bookmark size={16} />
              <span className="text-[8px] font-black uppercase tracking-wider">Yeni Sözleşme</span>
            </button>
            <button
              onClick={() => setCurrentRoute('raporlar')}
              className="p-3 bg-amber-500/10 border border-amber-500/15 text-amber-450 hover:bg-amber-500/15 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer select-none text-center"
            >
              <FileSpreadsheet size={16} />
              <span className="text-[8px] font-black uppercase tracking-wider">Raporlar</span>
            </button>
            <button
              onClick={() => setCurrentRoute('dashboard')}
              className="p-3 bg-purple-500/10 border border-purple-500/15 text-purple-400 hover:bg-purple-500/15 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer select-none text-center"
            >
              <TrendingUp size={16} />
              <span className="text-[8px] font-black uppercase tracking-wider">CEO Dashboard</span>
            </button>
          </div>
        </div>

      </div>

      {/* OfferModal Wrapper */}
      {isOfferModalOpen && (
        <OfferModal
          isOpen={isOfferModalOpen}
          onClose={() => setIsOfferModalOpen(false)}
          onSuccess={(offer) => {
            // Trigger local reload of dashboard lists/counts
            window.dispatchEvent(new Event('offers_updated'));
            window.dispatchEvent(new Event('spaces_updated'));
            window.dispatchEvent(new Event('reservations_updated'));
          }}
          preselectedSpaceId={selectedSpaceId || undefined}
          preselectedNetworkId={selectedNetwork}
        />
      )}
    </div>
  );
}
