import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Tv, 
  Activity, 
  Clock, 
  Coins, 
  AlertCircle, 
  Sparkles, 
  Plus, 
  Play, 
  CheckCircle2, 
  Layers, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { digitalScreenRepository } from '@/repositories/digitalScreenRepository';
import { DigitalScreenCard } from '@/components/design-system/DigitalScreenCard';
import { PlaylistTimeline } from '@/components/design-system/PlaylistTimeline';
import { ProofOfPlayTable } from '@/components/design-system/ProofOfPlayTable';
import { LedSlotSummary } from '@/components/design-system/LedSlotSummary';
import { LedReservationForm } from '@/components/design-system/LedReservationForm';
import { DarkKpiCard } from '@/components/design-system/DarkKpiCard';
import { DarkDashboardCard } from '@/components/design-system/DarkDashboardCard';
import { Button } from '@/components/design-system/Button';
import { Badge } from '@/components/design-system/Badge';

export function DigitalSignage() {
  const { setCurrentRoute } = useApp();
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Sync with global storage events
  useEffect(() => {
    const handleStorage = () => {
      setRefreshKey(prev => prev + 1);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const refreshData = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Fetch screens and slots
  const screens = useMemo(() => {
    return digitalScreenRepository.listScreens();
  }, [refreshKey]);

  const allSlots = useMemo(() => {
    return digitalScreenRepository.listPlaylistSlots();
  }, [refreshKey]);

  // Set initial selected screen
  useEffect(() => {
    if (screens.length > 0 && !selectedScreenId) {
      setSelectedScreenId(screens[0].screenId);
    }
  }, [screens, selectedScreenId]);

  // KPIs Calculations
  const metrics = useMemo(() => {
    const totalScreens = screens.length;
    const activeScreens = screens.filter(s => s.status === 'active').length;

    let totalOccupancy = 0;
    let totalPlays = 0;

    screens.forEach(s => {
      const avail = digitalScreenRepository.getAvailability(s.screenId, '2026-06-15', '2026-07-15');
      totalOccupancy += avail.occupancyPercent;
      totalPlays += digitalScreenRepository.calculateEstimatedPlays(s.screenId);
    });

    const avgOccupancy = totalScreens > 0 ? Math.round(totalOccupancy / totalScreens) : 0;

    return {
      totalScreens,
      activeScreens,
      avgOccupancy,
      totalPlays
    };
  }, [screens, refreshKey]);

  const selectedScreen = useMemo(() => {
    return screens.find(s => s.screenId === selectedScreenId) || null;
  }, [screens, selectedScreenId]);

  const screenSlots = useMemo(() => {
    if (!selectedScreenId) return [];
    return allSlots.filter(s => s.screenId === selectedScreenId);
  }, [allSlots, selectedScreenId]);

  const availability = useMemo(() => {
    if (!selectedScreenId) return null;
    return digitalScreenRepository.getAvailability(selectedScreenId, '2026-06-15', '2026-07-15');
  }, [selectedScreenId, refreshKey]);

  const selectedSlot = useMemo(() => {
    if (!selectedSlotId) return null;
    return allSlots.find(s => s.slotId === selectedSlotId) || null;
  }, [allSlots, selectedSlotId]);

  // Calculated average slot price for standard 15s slot
  const avgSlotPrice = useMemo(() => {
    if (!selectedScreenId) return 0;
    return digitalScreenRepository.calculateSlotPrice(selectedScreenId, 15, '2026-06-15', '2026-07-15');
  }, [selectedScreenId, refreshKey]);

  if (screens.length === 0) {
    return (
      <div className="flex flex-col gap-6 select-none">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping shrink-0" />
            <div className="space-y-0.5 text-left">
              <h2 className="text-[10px] font-black text-white uppercase tracking-widest leading-none">DİJİTAL YAYIN YÖNETİMİ</h2>
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">LED Ekran Playlist, Loop ve Proof-of-Play Operasyon Merkezi</span>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="dark-glass-card border border-slate-200 dark:border-white/5 p-12 rounded-3xl text-center space-y-6 max-w-lg mx-auto my-12 bg-white dark:bg-[#0b0f19]/30">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto text-blue-450 border border-blue-500/20">
            <Tv size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Aktif Dijital LED Ekran Bulunmadı</h3>
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed max-w-sm mx-auto">
              Sistemde kayıtlı herhangi bir dijital LED ekran bulunmamaktadır. Playlist ve loop yönetimi yapabilmek için lütfen Reklam Alanları sayfasından "LED" tipinde yeni bir ünite tanımlayın.
            </p>
          </div>
          <Button 
            variant="primary" 
            size="sm" 
            className="bg-blue-650 hover:bg-blue-600 text-white font-bold text-[9px] uppercase tracking-wider px-6"
            onClick={() => setCurrentRoute('reklam-alanlari')}
          >
            Reklam Alanı Ekle
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <div className="space-y-0.5 text-left">
            <h2 className="text-[10px] font-black text-white uppercase tracking-widest leading-none">DİJİTAL YAYIN YÖNETİMİ</h2>
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">LED Ekran Playlist, Loop ve Proof-of-Play Operasyon Merkezi</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="xs" 
            className="text-[8px] font-black uppercase tracking-wider py-1.5 hover:bg-blue-500/10 hover:text-blue-550 border-white/5"
            onClick={() => setCurrentRoute('reklam-alanlari')}
          >
            Alanları Düzenle
          </Button>
          <Button 
            variant="primary" 
            size="xs" 
            className="text-[8px] font-black uppercase tracking-wider py-1.5 bg-blue-650 hover:bg-blue-600 text-white"
            onClick={() => setShowAddForm(prev => !prev)}
          >
            {showAddForm ? 'Formu Gizle' : 'Yeni Yayın Ekle'}
          </Button>
        </div>
      </div>

      {/* KPIs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DarkKpiCard
          title="Toplam Ekran"
          value={String(metrics.totalScreens)}
          percentage="LED Ünitesi"
          subtext="Envanterdeki dijital ekran sayısı"
          icon={<Tv size={13} />}
          iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/10"
        />
        <DarkKpiCard
          title="Aktif Ekran"
          value={String(metrics.activeScreens)}
          percentage={`${Math.round((metrics.activeScreens / metrics.totalScreens) * 100)}%`}
          subtext="Yayına hazır aktif donanım"
          icon={<CheckCircle2 size={13} />}
          iconBgColor="bg-emerald-500/10 text-emerald-450 border-emerald-500/10"
          glowColor="green"
        />
        <DarkKpiCard
          title="Ortalama Loop Doluluğu"
          value={`%${metrics.avgOccupancy}`}
          percentage={`${metrics.avgOccupancy}%`}
          subtext="Kullanılan yayın süresi oranı"
          icon={<TrendingUp size={13} />}
          iconBgColor="bg-purple-500/10 text-purple-400 border-purple-500/10"
          glowColor="purple"
        />
        <DarkKpiCard
          title="Günlük Oynatım Tahmini"
          value={metrics.totalPlays.toLocaleString('tr-TR')}
          percentage="Yayın/Gün"
          subtext="Tüm ekranlarda toplam dönüş"
          icon={<Play size={13} />}
          iconBgColor="bg-teal-500/10 text-teal-400 border-teal-500/10"
        />
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Left Side: LED Screens List (4 columns) */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <DarkDashboardCard className="space-y-4 text-left">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Layers size={11} /> LED Ekran Listesi
              </span>
              <Badge variant="primary" className="text-[7.5px] py-0 px-1 font-black bg-blue-500/10 text-blue-400 border-blue-500/20 uppercase">
                {screens.length} Ekran
              </Badge>
            </div>
            
            <div className="space-y-3.5 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin">
              {screens.map(screen => {
                const isSelected = screen.screenId === selectedScreenId;
                return (
                  <div 
                    key={screen.screenId} 
                    onClick={() => {
                      setSelectedScreenId(screen.screenId);
                      setSelectedSlotId(null);
                    }}
                    className={`cursor-pointer transition-all duration-200 rounded-3xl ${
                      isSelected 
                        ? 'ring-1 ring-blue-500 shadow-md shadow-blue-500/5 translate-y-[-1px]' 
                        : 'opacity-85 hover:opacity-100'
                    }`}
                  >
                    <DigitalScreenCard 
                      screen={screen} 
                      slots={allSlots} 
                    />
                  </div>
                );
              })}
            </div>
          </DarkDashboardCard>
        </div>

        {/* Right Side: Visual Playlist Console (8 columns) */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {selectedScreen ? (
            <>
              {/* Selected Screen Playlist Details Console */}
              <DarkDashboardCard className="space-y-4 text-left">
                <div className="flex justify-between items-center pb-3 border-b border-white/5 flex-wrap gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[7px] text-blue-400 font-black uppercase tracking-widest">Yayın Akışı Konsolu</span>
                    <h3 className="text-[11px] font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                      {selectedScreen.screenCode} - {selectedScreen.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-[9px] font-bold text-slate-400">
                    <div>Ölçü: <span className="text-white font-extrabold">{selectedScreen.totalM2} m²</span></div>
                    <div>Çözünürlük: <span className="text-white font-extrabold">{selectedScreen.resolution}</span></div>
                    <div>Sektör: <span className="text-white font-extrabold">{selectedScreen.terminal} / {selectedScreen.floor}</span></div>
                  </div>
                </div>

                {/* Playlist Visual Timeline Component */}
                <div className="p-1 rounded-2xl bg-slate-900/10 border border-white/2">
                  <PlaylistTimeline
                    screen={selectedScreen}
                    slots={screenSlots}
                    onSelectSlot={(slotId) => setSelectedSlotId(slotId)}
                    onCreateSlotAtEmpty={() => setShowAddForm(true)}
                  />
                </div>

                {/* Selected Screen Detailed Availability Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
                  <div className="p-3 bg-white/2 border border-white/3 rounded-xl">
                    <span className="text-[7.5px] text-slate-500 font-black uppercase block">Loop Süresi</span>
                    <span className="text-xs font-black text-white block mt-0.5">{selectedScreen.loopDurationSeconds} sn</span>
                  </div>
                  <div className="p-3 bg-white/2 border border-white/3 rounded-xl">
                    <span className="text-[7.5px] text-slate-500 font-black uppercase block">Dolu Saniye</span>
                    <span className="text-xs font-black text-indigo-400 block mt-0.5">{availability?.usedSeconds || 0} sn</span>
                  </div>
                  <div className="p-3 bg-white/2 border border-white/3 rounded-xl">
                    <span className="text-[7.5px] text-slate-500 font-black uppercase block">Boş Saniye</span>
                    <span className="text-xs font-black text-emerald-450 block mt-0.5">{availability?.availableSeconds || 0} sn</span>
                  </div>
                  <div className="p-3 bg-white/2 border border-white/3 rounded-xl">
                    <span className="text-[7.5px] text-slate-500 font-black uppercase block">Doluluk Yüzdesi</span>
                    <span className={`text-xs font-black block mt-0.5 ${
                      availability && availability.occupancyPercent > 90 ? 'text-rose-500' : 'text-blue-450'
                    }`}>
                      %{availability?.occupancyPercent || 0}
                    </span>
                  </div>
                  <div className="p-3 bg-white/2 border border-white/3 rounded-xl col-span-2 md:col-span-1">
                    <span className="text-[7.5px] text-slate-500 font-black uppercase block">Ort. Slot Fiyatı</span>
                    <span className="text-xs font-black text-emerald-450 block mt-0.5">₺{avgSlotPrice.toLocaleString('tr-TR')}</span>
                  </div>
                </div>
              </DarkDashboardCard>

              {/* Selected Slot Detail Summary Panel */}
              {selectedSlot ? (
                <div className="animate-fade-in">
                  <LedSlotSummary slot={selectedSlot} />
                </div>
              ) : (
                <div className="p-4.5 rounded-2xl bg-indigo-950/5 border border-dashed border-indigo-500/10 text-left text-[9.5px] font-bold text-slate-400 flex items-center gap-2">
                  <AlertCircle size={12} className="text-indigo-400 shrink-0" />
                  Yayın detaylarını incelemek, kreatif dosyasını görmek ve slot ayrıntılarını okumak için oynatma zaman çizelgesindeki doluluk bloklarından birine tıklayın.
                </div>
              )}

              {/* Add New Playlist Slot Form (collapsible panel) */}
              {showAddForm && (
                <DarkDashboardCard className="space-y-4 text-left border border-blue-500/20 bg-blue-950/5 animate-fade-in">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles size={11} className="text-blue-400" />
                      {selectedScreen.screenCode} Üzerine Yeni Yayın Planla
                    </span>
                    <button 
                      onClick={() => setShowAddForm(false)}
                      className="text-[9px] font-black text-slate-500 hover:text-slate-350 uppercase cursor-pointer"
                    >
                      Kapat
                    </button>
                  </div>
                  <LedReservationForm
                    initialScreenId={selectedScreen.screenId}
                    initialDateRange={{ startDate: '2026-06-15', endDate: '2026-07-15' }}
                    onSuccess={() => {
                      refreshData();
                      setShowAddForm(false);
                      setSelectedSlotId(null);
                    }}
                    onCancel={() => setShowAddForm(false)}
                  />
                </DarkDashboardCard>
              )}
            </>
          ) : (
            <div className="dark-glass-card border border-slate-200 dark:border-white/5 p-8 rounded-3xl text-center text-slate-400 text-xs select-none">
              Lütfen sol taraftaki menüden playlist operasyonlarını yöneteceğiniz bir LED ekran ünitesi seçin.
            </div>
          )}
        </div>
      </div>

      {/* Proof of Play Logs (12 columns wide at bottom) */}
      <div className="w-full">
        <DarkDashboardCard className="p-5.5">
          <ProofOfPlayTable />
        </DarkDashboardCard>
      </div>
    </div>
  );
}
