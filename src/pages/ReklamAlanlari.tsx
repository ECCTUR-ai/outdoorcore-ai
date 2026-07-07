import React, { useState, useEffect } from 'react';
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
  Eye,
  Layers,
  Coins,
  Clock
} from 'lucide-react';
import { AdvertisingSpace } from '@/data/advertisingSpaces';
import { spaceRepository } from '@/repositories';
import { DarkKpiCard } from '@/components/design-system/DarkKpiCard';
import { DarkDashboardCard } from '@/components/design-system/DarkDashboardCard';
import { AdvertisingSpaceMap } from '@/components/design-system/AdvertisingSpaceMap';
import { AdvertisingSpaceDetailPanel } from '@/components/design-system/AdvertisingSpaceDetailPanel';
import { SpaceStatusBadge } from '@/components/design-system/SpaceStatusBadge';
import { AiInsightDrawer } from '@/components/design-system/AiInsightDrawer';
import { Input, Select, FormGroup, Label } from '@/components/design-system/Form';
import { Button } from '@/components/design-system/Button';
import { Table, TableRow, TableCell } from '@/components/design-system/Table';
import { PermissionGate } from '@/components/design-system/PermissionGate';
import { AdvertisingSpaceModal } from '@/components/design-system/AdvertisingSpaceModal';
import { TableSkeleton } from '@/components/design-system/Skeleton';
import { Notification } from '@/components/design-system/Notification';

import { digitalScreenRepository } from '@/repositories/digitalScreenRepository';
import { DigitalScreenCard } from '@/components/design-system/DigitalScreenCard';
import { PlaylistTimeline } from '@/components/design-system/PlaylistTimeline';
import { LedReservationForm } from '@/components/design-system/LedReservationForm';
import { ProofOfPlayTable } from '@/components/design-system/ProofOfPlayTable';
import { LedSlotSummary } from '@/components/design-system/LedSlotSummary';
import { Modal } from '@/components/design-system/Modal';

export function ReklamAlanlari() {
  const [advertisingSpaces, setAdvertisingSpaces] = useState<AdvertisingSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCode, setSelectedCode] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [terminalFilter, setTerminalFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // CRUD Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState<AdvertisingSpace | undefined>(undefined);

  // Digital Signage Tabs states
  const [activeTab, setActiveTab] = useState<'static' | 'led' | 'playlist' | 'pop'>('static');
  const [selectedScreenId, setSelectedScreenId] = useState<string>('LED-001');
  const [ledModalOpen, setLedModalOpen] = useState(false);
  
  // LED list states
  const [screensList, setScreensList] = useState<any[]>([]);
  const [slotsList, setSlotsList] = useState<any[]>([]);

  const fetchLedData = () => {
    const screens = digitalScreenRepository.listScreens();
    const slots = digitalScreenRepository.listPlaylistSlots();
    setScreensList(screens);
    setSlotsList(slots);
  };

  const fetchSpaces = async (selectFirst = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await spaceRepository.list();
      setAdvertisingSpaces(data);
      if (data.length > 0) {
        if (selectFirst || !selectedCode || !data.some(s => s.code === selectedCode)) {
          setSelectedCode(data[0].code);
        }
      } else {
        setSelectedCode('');
      }
    } catch (e: any) {
      console.error(e);
      setError('Veriler yüklenirken bir bağlantı hatası oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces(true);
    fetchLedData();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const spaceId = params.get('spaceId');
    if (spaceId) {
      const found = advertisingSpaces.find(s => s.id === spaceId);
      if (found) {
        setSelectedCode(found.code);
      }
    }
  }, [advertisingSpaces]);

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

  const handleCreate = () => {
    setEditingSpace(undefined);
    setModalOpen(true);
  };

  const handleEdit = () => {
    if (selectedSpace) {
      setEditingSpace(selectedSpace);
      setModalOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu reklam alanını silmek istediğinize emin misiniz?')) {
      const success = await spaceRepository.softDelete(id);
      if (success) {
        fetchSpaces(true);
      }
    }
  };

  return (
    <div className="space-y-6 select-none pb-12">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 p-5 rounded-3xl border border-white/5 shadow-sm text-left">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">Reklam Yönetimi</h2>
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

          {activeTab === 'static' ? (
            <PermissionGate permission="spaces.create">
              <Button 
                variant="outline" 
                size="sm" 
                leftIcon={<Plus size={13} />}
                onClick={handleCreate}
              >
                Alan Ekle
              </Button>
            </PermissionGate>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              leftIcon={<Plus size={13} />}
              onClick={() => setLedModalOpen(true)}
            >
              LED Rezervasyon Ekle
            </Button>
          )}

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

      {/* Dynamic Tab Switcher */}
      <div className="flex bg-slate-100 dark:bg-white/2 p-1 rounded-2xl border border-slate-200 dark:border-white/5 select-none w-full sm:w-auto self-start justify-start flex-wrap gap-1">
        {[
          { id: 'static', label: 'Statik Alanlar' },
          { id: 'led', label: 'Dijital LED Ekranlar' },
          { id: 'playlist', label: 'Playlist Yönetimi' },
          { id: 'pop', label: 'Proof of Play' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 text-[9.5px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border ${
              activeTab === tab.id
                ? 'bg-white dark:bg-[#0b0f19] text-blue-500 dark:text-blue-450 shadow-sm border-slate-205 dark:border-white/5'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-transparent border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'static' && (
        <>

      {error && (
        <Notification
          title="Sistem Hatası"
          description={error}
          type="alert"
          onClose={() => setError(null)}
        />
      )}

      {/* 5 KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <DarkKpiCard
          title="Toplam Alan"
          value={loading ? '...' : String(advertisingSpaces.length)}
          percentage="%100"
          subtext="Tüm envanter"
          icon={<MapPin size={15} />}
          iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/10"
        />
        <DarkKpiCard
          title="Dolu Alan"
          value={loading ? '...' : String(advertisingSpaces.filter(s => s.status === 'dolu').length)}
          percentage={`${advertisingSpaces.length > 0 ? ((advertisingSpaces.filter(s => s.status === 'dolu').length / advertisingSpaces.length) * 100).toFixed(1) : 0}%`}
          subtext="Aktif sözleşmeler"
          icon={<CheckSquare size={15} />}
          iconBgColor="bg-emerald-500/10 text-emerald-400 border-emerald-500/10"
          glowColor="green"
        />
        <DarkKpiCard
          title="Boş Alan"
          value={loading ? '...' : String(advertisingSpaces.filter(s => s.status === 'bos').length)}
          percentage={`${advertisingSpaces.length > 0 ? ((advertisingSpaces.filter(s => s.status === 'bos').length / advertisingSpaces.length) * 100).toFixed(1) : 0}%`}
          subtext="Müsait üniteler"
          icon={<Circle size={15} />}
          iconBgColor="bg-sky-500/10 text-sky-400 border-sky-500/10"
          glowColor="blue"
        />
        <DarkKpiCard
          title="Teklif Aşamasında"
          value={loading ? '...' : String(advertisingSpaces.filter(s => s.status === 'teklif').length)}
          percentage={`${advertisingSpaces.length > 0 ? ((advertisingSpaces.filter(s => s.status === 'teklif').length / advertisingSpaces.length) * 100).toFixed(1) : 0}%`}
          subtext="Opsiyonlu alanlar"
          icon={<FileText size={15} />}
          iconBgColor="bg-amber-500/10 text-amber-400 border-amber-500/10"
          glowColor="yellow"
        />
        <DarkKpiCard
          title="Bakım Modu"
          value={loading ? '...' : String(advertisingSpaces.filter(s => s.status === 'bakim').length)}
          percentage={`${advertisingSpaces.length > 0 ? ((advertisingSpaces.filter(s => s.status === 'bakim').length / advertisingSpaces.length) * 100).toFixed(1) : 0}%`}
          subtext="Arızalı üniteler"
          icon={<Wrench size={15} />}
          iconBgColor="bg-rose-500/10 text-rose-400 border-rose-500/10"
          glowColor="red"
        />
      </div>

      {/* Main Workspace Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-white/3 border border-white/5 rounded-3xl text-left">
        <FormGroup>
          <Label htmlFor="search">İsim / Kod Ara</Label>
          <div className="relative">
            <Input 
              id="search"
              placeholder="SG-001 veya Giriş LED..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search size={13} />}
            />
          </div>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="terminal-filter">Terminal Konumu</Label>
          <Select 
            id="terminal-filter"
            value={terminalFilter}
            onChange={(e) => setTerminalFilter(e.target.value)}
          >
            <option value="">Tümü</option>
            <option value="İç Hatlar">İç Hatlar</option>
            <option value="Dış Hatlar">Dış Hatlar</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="type-filter">Ünite Tipi</Label>
          <Select 
            id="type-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">Tümü</option>
            <option value="LED">LED Ekran</option>
            <option value="Lightbox">Lightbox</option>
            <option value="Billboard">Billboard</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="status-filter">Doluluk Durumu</Label>
          <Select 
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tümü</option>
            <option value="dolu">Dolu</option>
            <option value="bos">Boş / Müsait</option>
            <option value="teklif">Teklifte</option>
            <option value="bakim">Bakımda</option>
          </Select>
        </FormGroup>
      </div>

      {/* Middle Interactive Map Section */}
      <div className="grid grid-cols-1 gap-6">
        <DarkDashboardCard>
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Havalimanı Terminal Canlı Haritası</span>
            <div className="flex items-center gap-4 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block"></span> Dolu</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-sky-500 rounded-full inline-block"></span> Boş</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block"></span> Teklif</span>
            </div>
          </div>
          <AdvertisingSpaceMap 
            selectedCode={selectedCode}
            onSelectCode={(code) => setSelectedCode(code)}
          />
        </DarkDashboardCard>
      </div>

      {/* Bottom Inventory Table and Detail Panel Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Table View */}
        <div className="order-1 lg:order-none lg:col-span-8">
          <DarkDashboardCard className="h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Envanter Listesi</span>
              </div>

              {loading ? (
                <div className="py-4">
                  <TableSkeleton />
                </div>
              ) : (
                <Table headers={['Alan Kodu', 'Ünite Tanımı', 'Lokasyon & Detay', 'Ölçü', 'Durum', 'Yayıncı Müşteri', 'Bitiş Tarihi', 'Fiyat', '']}>

                  {paginatedSpaces.map(space => {
                    const isSelected = selectedCode === space.code;
                    return (
                      <TableRow 
                        key={space.id} 
                        onClick={() => setSelectedCode(space.code)}
                        className={`cursor-pointer transition-colors duration-150 ${isSelected ? 'bg-white/3 border-l-2 border-l-blue-400' : 'border-b border-white/3 hover:bg-white/1'}`}
                      >
                        <TableCell className="font-black text-blue-450 text-[10px] uppercase">{space.code}</TableCell>
                        <TableCell className="font-extrabold text-white">{space.name}</TableCell>
                        <TableCell className="font-semibold text-slate-400">
                          <div>{space.location}</div>
                          <div className="text-[8px] text-slate-500">{space.type} Ekran | {space.traffic.toLocaleString('tr-TR')} yolcu/gün</div>
                        </TableCell>
                        <TableCell className="font-semibold text-slate-400">{space.size}</TableCell>
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
                  {paginatedSpaces.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-slate-500 text-xs font-bold uppercase py-8">
                        Reklam Alanı Bulunamadı
                      </TableCell>
                    </TableRow>
                  )}
                </Table>
              )}

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
        <div className="order-2 lg:order-none lg:col-span-4">
          {selectedSpace && (
            <AdvertisingSpaceDetailPanel 
              space={selectedSpace} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
      </>
      )}

      {activeTab === 'led' && (
        <div className="space-y-6">
          {/* LED KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <DarkKpiCard
              title="Toplam Ekran"
              value={String(screensList.length)}
              percentage="100%"
              subtext="Dijital LED Envanteri"
              icon={<Layers size={15} />}
              iconBgColor="bg-blue-500/10 text-blue-400 border border-blue-500/10"
            />
            <DarkKpiCard
              title="Toplam m²"
              value={`${screensList.reduce((sum, s) => sum + s.totalM2, 0)} m²`}
              percentage="LED ALANI"
              subtext="Aktif ekran yüzeyleri"
              icon={<MapPin size={15} />}
              iconBgColor="bg-indigo-500/10 text-indigo-400 border border-indigo-500/10"
            />
            <DarkKpiCard
              title="Kullanılan Saniye"
              value={`${slotsList.filter(s => s.status === 'active').reduce((sum, s) => sum + s.durationSeconds, 0)} sn`}
              percentage="TOPLAM"
              subtext="Rezervasyonlu süreler"
              icon={<Clock size={15} />}
              iconBgColor="bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
            />
            <DarkKpiCard
              title="Ortalama Doluluk"
              value={`%${screensList.length > 0 ? Math.round(screensList.reduce((sum, s) => {
                const active = slotsList.filter(sl => sl.screenId === s.screenId && sl.status === 'active');
                const used = active.reduce((acc, sl) => acc + sl.durationSeconds, 0);
                return sum + (used / s.loopDurationSeconds) * 100;
              }, 0) / screensList.length) : 0}`}
              percentage="DURUM"
              subtext="Loop kapasite doluluğu"
              icon={<Coins size={15} />}
              iconBgColor="bg-teal-500/10 text-teal-400 border border-teal-500/10"
            />
          </div>

          {/* Screens Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {screensList.map(screen => (
              <DigitalScreenCard
                key={screen.screenId}
                screen={screen}
                slots={slotsList}
                onSelectScreen={(screenId) => {
                  setSelectedScreenId(screenId);
                  setActiveTab('playlist');
                }}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'playlist' && (
        <div className="space-y-6">
          <DarkDashboardCard className="space-y-4 text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest leading-none">Playlist Akış Detayı</h3>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0">Ekran Seç:</span>
                <Select
                  value={selectedScreenId}
                  onChange={e => setSelectedScreenId(e.target.value)}
                  className="max-w-[200px]"
                >
                  {screensList.map(s => (
                    <option key={s.screenId} value={s.screenId}>{s.screenCode} - {s.name}</option>
                  ))}
                </Select>
              </div>
            </div>

            {screensList.find(s => s.screenId === selectedScreenId) && (
              <PlaylistTimeline
                screen={screensList.find(s => s.screenId === selectedScreenId)!}
                slots={slotsList}
                onCreateSlotAtEmpty={() => setLedModalOpen(true)}
              />
            )}
          </DarkDashboardCard>

          {/* Slots Table */}
          <DarkDashboardCard className="space-y-4 text-left">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yayınlanan Playlist Slotları</span>
            </div>

            <Table headers={['Müşteri Firma', 'Başlangıç Tarihi', 'Bitiş Tarihi', 'Süre', 'Loop Oranı', 'Günlük Gösterim', 'Hesaplanan Fiyat']}>
              {slotsList.filter(s => s.screenId === selectedScreenId && s.status === 'active').map(slot => (
                <TableRow key={slot.slotId} className="border-b border-white/3 hover:bg-white/1">
                  <TableCell className="font-extrabold text-white">{slot.companyName}</TableCell>
                  <TableCell className="font-semibold text-slate-400">{slot.startDate}</TableCell>
                  <TableCell className="font-semibold text-slate-400">{slot.endDate}</TableCell>
                  <TableCell className="font-black text-white">{slot.durationSeconds} Saniye</TableCell>
                  <TableCell className="font-black text-indigo-400">{slot.sharePercent}%</TableCell>
                  <TableCell className="font-semibold text-slate-400">{slot.estimatedPlaysPerDay} Yayın / Gün</TableCell>
                  <TableCell className="font-black text-emerald-450">₺{slot.price.toLocaleString('tr-TR')}</TableCell>
                </TableRow>
              ))}
              {slotsList.filter(s => s.screenId === selectedScreenId && s.status === 'active').length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-slate-500 text-xs font-bold uppercase py-8">
                    Bu LED Ekran İçin Rezervasyonlu Slot Bulunmuyor.
                  </TableCell>
                </TableRow>
              )}
            </Table>
          </DarkDashboardCard>
        </div>
      )}

      {activeTab === 'pop' && (
        <DarkDashboardCard className="p-5 text-left">
          <ProofOfPlayTable />
        </DarkDashboardCard>
      )}

      {/* CRUD Modal */}
      <AdvertisingSpaceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        space={editingSpace}
        onSuccess={() => fetchSpaces(false)}
      />

      {/* LED Reservation Modal */}
      <Modal
        isOpen={ledModalOpen}
        onClose={() => setLedModalOpen(false)}
        title="LED Video Reklam Rezervasyonu Oluştur"
      >
        <LedReservationForm
          initialScreenId={selectedScreenId}
          onSuccess={() => {
            setLedModalOpen(false);
            fetchLedData();
          }}
          onCancel={() => setLedModalOpen(false)}
        />
      </Modal>

      {/* Slide-over AI Insight Drawer dialog */}
      {selectedSpace && (
        <AiInsightDrawer 
          isOpen={aiDrawerOpen} 
          onClose={() => setAiDrawerOpen(false)} 
          selectedSpaceCode={selectedCode}
        />
      )}
    </div>
  );
}
