import React, { useState } from 'react';
import { 
  Plus, 
  DownloadCloud, 
  SlidersHorizontal, 
  Sparkles,
  Calendar,
  Layers,
  Coins,
  CheckCircle,
  AlertTriangle,
  MapPin,
  TrendingUp,
  FileSignature,
  Clock
} from 'lucide-react';
import { reservations, conflicts, Reservation } from '@/data/reservations';
import { DarkKpiCard } from '@/components/design-system/DarkKpiCard';
import { DarkDashboardCard } from '@/components/design-system/DarkDashboardCard';
import { ReservationTimeline } from '@/components/design-system/ReservationTimeline';
import { ReservationDetail } from '@/components/design-system/ReservationDetail';
import { ConflictCard } from '@/components/design-system/ConflictCard';
import { UpcomingReservations } from '@/components/design-system/UpcomingReservations';
import { ReservationFilters } from '@/components/design-system/ReservationFilters';
import { AiInsightDrawer } from '@/components/design-system/AiInsightDrawer';
import { Button } from '@/components/design-system/Button';

export function Rezervasyonlar() {
  const [selectedSpaceCode, setSelectedSpaceCode] = useState<string>('SG-001');
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reservationId = params.get('reservationId');
    if (reservationId) {
      const found = reservations.find(r => r.id === reservationId);
      if (found) {
        setSelectedSpaceCode(found.spaceCode);
      }
    }
  }, []);

  // Filters state mockup values
  const [search, setSearch] = useState('');
  const [clientFilter, setClientFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [terminalFilter, setTerminalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selected reservation model lookup
  const selectedRes = reservations.find(r => r.spaceCode === selectedSpaceCode) || reservations[0];

  return (
    <div className="space-y-6 select-none pb-12">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 p-5 rounded-3xl border border-white/5 shadow-sm text-left">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">Rezervasyon Yönetimi</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tüm reklam alanlarının rezervasyonlarını, doluluk takvimini ve planlamasını yönetin.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* OutdoorCore AI Spark Button */}
          <Button 
            variant="primary" 
            size="sm" 
            leftIcon={<Sparkles size={13} className="animate-pulse" />}
            className="bg-gradient-to-r from-blue-650 to-indigo-650 hover:from-blue-600 hover:to-indigo-600 text-white font-black"
            onClick={() => setAiDrawerOpen(true)}
          >
            OutdoorCore AI
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            leftIcon={<Plus size={13} />}
            onClick={() => alert('Yeni rezervasyon ekleme mockup formu açılacak.')}
          >
            Yeni Rezervasyon
          </Button>

          <Button 
            variant="minimal" 
            size="sm" 
            leftIcon={<DownloadCloud size={13} />}
            onClick={() => alert('Rezervasyon Takvimi (.pdf) dışa aktarılıyor...')}
          >
            Takvimi Dışa Aktar
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            leftIcon={<SlidersHorizontal size={13} />}
            onClick={() => alert('Rezervasyon filtre ayarları paneli tetiklendi.')}
          >
            Filtreler
          </Button>
        </div>
      </div>

      {/* Upper Reservation KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <DarkKpiCard
          title="Toplam Rezervasyon"
          value="824"
          percentage="%100"
          subtext="Sözleşmeli işlemler"
          icon={<FileSignature size={15} />}
          iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/10"
        />
        <DarkKpiCard
          title="Bu Ay Başlayan"
          value="48"
          percentage="+12 yeni"
          subtext="Aktif yayına giren"
          icon={<CheckCircle size={15} />}
          iconBgColor="bg-emerald-500/10 text-emerald-400 border-emerald-500/10"
          glowColor="green"
        />
        <DarkKpiCard
          title="Bu Ay Biten"
          value="31"
          percentage="-4 azalış"
          subtext="Yayından kalkan"
          icon={<Clock size={15} />}
          iconBgColor="bg-amber-500/10 text-amber-400 border-amber-500/10"
          glowColor="yellow"
        />
        <DarkKpiCard
          title="Çakışma Riski"
          value="4"
          percentage="KRİTİK"
          subtext="Süre çakışmaları"
          icon={<AlertTriangle size={15} />}
          iconBgColor="bg-rose-500/10 text-rose-450 border-rose-500/10"
          glowColor="red"
        />
        <DarkKpiCard
          title="Boş Premium Alan"
          value="18"
          percentage="FIRSAT"
          subtext="Kiralanabilir LED"
          icon={<MapPin size={15} />}
          iconBgColor="bg-purple-500/10 text-purple-400 border-purple-500/10"
          glowColor="purple"
        />
        <DarkKpiCard
          title="Doluluk Oranı"
          value="%91.4"
          percentage="+%4.2 artış"
          subtext="Kapasite doluluğu"
          icon={<TrendingUp size={15} />}
          iconBgColor="bg-sky-500/10 text-sky-400 border-sky-500/10"
          glowColor="blue"
          sparkline={true}
        />
      </div>

      {/* Main CRM Timeline grid splits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. Sol: Timeline Filters */}
        <div className="lg:col-span-3">
          <ReservationFilters 
            search={search}
            setSearch={setSearch}
            clientFilter={clientFilter}
            setClientFilter={setClientFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            terminalFilter={terminalFilter}
            setTerminalFilter={setTerminalFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </div>

        {/* 2. Orta: Large Gantt Timeline display */}
        <div className="lg:col-span-6">
          <ReservationTimeline 
            selectedSpaceCode={selectedSpaceCode}
            onSelectSpaceCode={(code) => setSelectedSpaceCode(code)}
          />
        </div>

        {/* 3. Sağ: Selected reservation detail card */}
        <div className="lg:col-span-3">
          <ReservationDetail 
            reservation={selectedRes}
          />
        </div>
      </div>

      {/* Conflicts & Upcoming plan grids */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Conflict warn widget panel */}
        <div className="lg:col-span-5">
          <ConflictCard conflicts={conflicts} />
        </div>

        {/* Upcoming plan list table */}
        <div className="lg:col-span-7">
          <UpcomingReservations 
            reservations={reservations} 
            onSelect={(code) => setSelectedSpaceCode(code)}
          />
        </div>
      </div>

      {/* Sliding AI Panel drawer */}
      <AiInsightDrawer 
        isOpen={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
        selectedSpaceCode={selectedRes.spaceCode}
      />
    </div>
  );
}
