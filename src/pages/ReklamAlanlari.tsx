import React, { useState } from 'react';
import { 
  Plus, 
  DownloadCloud, 
  SlidersHorizontal, 
  Sparkles, 
  Search, 
  MapPin, 
  CheckSquare, 
  Circle, 
  FileText, 
  Wrench,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';
import { advertisingSpaces, AdvertisingSpace } from '@/data/advertisingSpaces';
import { DarkKpiCard } from '@/components/design-system/DarkKpiCard';
import { DarkDashboardCard } from '@/components/design-system/DarkDashboardCard';
import { AdvertisingSpaceMap } from '@/components/design-system/AdvertisingSpaceMap';
import { AdvertisingSpaceDetailPanel } from '@/components/design-system/AdvertisingSpaceDetailPanel';
import { SpaceStatusBadge } from '@/components/design-system/SpaceStatusBadge';
import { AiInsightDrawer } from '@/components/design-system/AiInsightDrawer';
import { Input, Select } from '@/components/design-system/Form';
import { Button } from '@/components/design-system/Button';
import { Table, TableRow, TableCell } from '@/components/design-system/Table';

export function ReklamAlanlari() {
  const [selectedCode, setSelectedCode] = useState<string>('SG-001');
  const [searchQuery, setSearchQuery] = useState('');
  const [terminalFilter, setTerminalFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const spaceId = params.get('spaceId');
    if (spaceId) {
      const found = advertisingSpaces.find(s => s.id === spaceId);
      if (found) {
        setSelectedCode(found.code);
      }
    }
  }, []);

  // Selected space model lookup
  const selectedSpace = advertisingSpaces.find(s => s.code === selectedCode) || advertisingSpaces[0];

  // Filtering logs
  const filteredSpaces = advertisingSpaces.filter(space => {
    const matchesSearch = space.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          space.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTerminal = terminalFilter === '' || space.location.includes(terminalFilter);
    const matchesType = typeFilter === '' || space.type === typeFilter;
    const matchesStatus = statusFilter === '' || space.status === statusFilter;
    return matchesSearch && matchesTerminal && matchesType && matchesStatus;
  });

  // Simple paging
  const pageSize = 5;
  const paginatedSpaces = filteredSpaces.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredSpaces.length / pageSize);

  return (
    <div className="space-y-6 select-none pb-12">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 p-5 rounded-3xl border border-white/5 shadow-sm text-left">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">Reklam Alanları Envanteri</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tüm reklam envanterini, doluluk durumunu ve teknik bilgileri yönetin.</p>
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
            onClick={() => alert('Yeni reklam alanı oluşturma formu mockup modalı açılacak.')}
          >
            Alan Ekle
          </Button>

          <Button 
            variant="minimal" 
            size="sm" 
            leftIcon={<DownloadCloud size={13} />}
            onClick={() => alert('Reklam Envanter Raporu (.xlsx) indiriliyor...')}
          >
            Rapor İndir
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            leftIcon={<SlidersHorizontal size={13} />}
            onClick={() => alert('Gelişmiş filtreleme ayarları paneli tetiklendi.')}
          >
            Filtrele
          </Button>
        </div>
      </div>

      {/* 5 KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <DarkKpiCard
          title="Toplam Alan"
          value="150"
          percentage="%100"
          subtext="Tüm envanter"
          icon={<MapPin size={15} />}
          iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/10"
        />
        <DarkKpiCard
          title="Dolu Alan"
          value="92"
          percentage="%61.3"
          subtext="Aktif sözleşmeler"
          icon={<CheckSquare size={15} />}
          iconBgColor="bg-emerald-500/10 text-emerald-400 border-emerald-500/10"
          glowColor="green"
        />
        <DarkKpiCard
          title="Boş Alan"
          value="34"
          percentage="%22.7"
          subtext="Kiralanabilir alanlar"
          icon={<Circle size={15} />}
          iconBgColor="bg-amber-500/10 text-amber-400 border-amber-500/10"
          glowColor="yellow"
        />
        <DarkKpiCard
          title="Teklif Aşamasında"
          value="18"
          percentage="%12.0"
          subtext="Müzakere sürecinde"
          icon={<FileText size={15} />}
          iconBgColor="bg-purple-500/10 text-purple-400 border-purple-500/10"
          glowColor="purple"
        />
        <DarkKpiCard
          title="Bakımda"
          value="6"
          percentage="%4.0"
          subtext="Serviste olan alanlar"
          icon={<Wrench size={15} />}
          iconBgColor="bg-rose-500/10 text-rose-400 border-rose-500/10"
          glowColor="red"
        />
      </div>

      {/* Main Layout 3 Section Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Map & Table List */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Terminal Map Mock Card */}
          <DarkDashboardCard
            title="Alan Haritası"
            description="Terminal üniteleri yerleşim dağılımı"
            headerActions={
              <div className="relative">
                <select className="bg-white/5 border border-white/5 rounded-xl px-3.5 py-1.5 text-[9.5px] font-black text-slate-300 focus:outline-none uppercase tracking-wider cursor-pointer appearance-none pr-7">
                  <option value="İç Hatlar - Giriş Kat">İç Hatlar - Giriş Kat</option>
                  <option value="Dış Hatlar - Gidiş Lobi">Dış Hatlar - Gidiş Lobi</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[8px]">
                  ▼
                </div>
              </div>
            }
          >
            <div className="space-y-4">
              <AdvertisingSpaceMap 
                selectedCode={selectedCode}
                onSelectCode={(code) => setSelectedCode(code)}
              />
              {/* Map Legend */}
              <div className="flex flex-wrap items-center justify-start gap-4 pt-1">
                {[
                  { label: 'Dolu', color: 'bg-emerald-500 glow-green' },
                  { label: 'Boş (Müsait)', color: 'bg-amber-500 glow-yellow' },
                  { label: 'Teklif Aşamasında', color: 'bg-purple-500 glow-purple' },
                  { label: 'Bakımda / Arıza', color: 'bg-rose-500 glow-red' },
                  { label: 'Yakında Boşalacak', color: 'bg-blue-500 glow-blue' }
                ].map(leg => (
                  <div key={leg.label} className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full border border-white/5 ${leg.color}`} />
                    <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider">{leg.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </DarkDashboardCard>

          {/* Section 2: Space Inventory Table List */}
          <DarkDashboardCard
            title="Reklam Alanları Listesi"
            description="Tüm açık hava reklam lokasyonları envanteri"
          >
            <div className="space-y-4 text-left">
              {/* Filters row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="relative">
                  <Search size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <Input 
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Alan adı veya kodu ara..."
                    className="pl-10"
                  />
                </div>
                <Select 
                  value={terminalFilter}
                  onChange={(e) => {
                    setTerminalFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Tüm Terminaller</option>
                  <option value="İç Hatlar">İç Hatlar</option>
                  <option value="Dış Hatlar">Dış Hatlar</option>
                </Select>
                <Select 
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Tüm Tipler</option>
                  <option value="LED">LED Ekran</option>
                  <option value="Lightbox">Lightbox</option>
                </Select>
                <Select 
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Tüm Durumlar</option>
                  <option value="dolu">Dolu</option>
                  <option value="bos">Müsait (Boş)</option>
                  <option value="teklif">Teklif Aşamasında</option>
                  <option value="bakim">Bakımda</option>
                </Select>
              </div>

              {/* Data Table */}
              <Table headers={[
                'Alan Kodu', 
                'Alan Adı', 
                'Lokasyon', 
                'Tip', 
                'Ölçü', 
                'Günlük Trafik', 
                'Durum', 
                'Kiralayan Firma', 
                'Bitiş Tarihi', 
                'Aylık Bedel', 
                'İşlemler'
              ]}>
                {paginatedSpaces.map(space => {
                  const isSelected = selectedCode === space.code;
                  return (
                    <TableRow 
                      key={space.code}
                      onClick={() => setSelectedCode(space.code)}
                      className={`cursor-pointer ${isSelected ? 'bg-white/5' : ''}`}
                    >
                      <TableCell className="font-extrabold text-blue-400">#{space.code}</TableCell>
                      <TableCell className="font-black text-white">{space.name}</TableCell>
                      <TableCell>{space.location}</TableCell>
                      <TableCell>
                        <span className="text-[10px] bg-white/5 border border-white/5 px-2 py-0.5 rounded text-slate-300 font-bold">
                          {space.type}
                        </span>
                      </TableCell>
                      <TableCell>{space.size}</TableCell>
                      <TableCell className="font-bold text-slate-350">{space.traffic.toLocaleString('tr-TR')}</TableCell>
                      <TableCell>
                        <SpaceStatusBadge status={space.status} />
                      </TableCell>
                      <TableCell className="font-semibold text-white">{space.client}</TableCell>
                      <TableCell className="font-semibold text-slate-400">{space.endDate || '-'}</TableCell>
                      <TableCell className="font-black text-white">{space.price}</TableCell>
                      <TableCell>
                        <Button 
                          variant="minimal" 
                          size="xs" 
                          leftIcon={<Eye size={10} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCode(space.code);
                          }}
                        >
                          İncele
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </Table>

              {/* Table Pagination row */}
              <div className="flex justify-between items-center pt-2.5 border-t border-white/5">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Gösterilen: {paginatedSpaces.length} / Toplam: {filteredSpaces.length} alan
                </span>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="minimal" 
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    leftIcon={<ChevronLeft size={12} />}
                  >
                    Önceki
                  </Button>
                  <span className="text-[10.5px] font-black text-white px-2 py-1 bg-white/5 rounded-xl border border-white/5 select-none">
                    {currentPage} / {totalPages || 1}
                  </span>
                  <Button 
                    variant="minimal" 
                    size="sm"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    rightIcon={<ChevronRight size={12} />}
                  >
                    Sonraki
                  </Button>
                </div>
              </div>
            </div>
          </DarkDashboardCard>
        </div>

        {/* Right Side: Sticky Space Detail Panel */}
        <div className="lg:col-span-4">
          <AdvertisingSpaceDetailPanel space={selectedSpace} />
        </div>
      </div>

      {/* Slide-over AI Insight Drawer dialog */}
      <AiInsightDrawer 
        isOpen={aiDrawerOpen} 
        onClose={() => setAiDrawerOpen(false)} 
        selectedSpaceCode={selectedCode}
      />
    </div>
  );
}
