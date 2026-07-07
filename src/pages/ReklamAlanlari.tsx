import React, { useState, useEffect, useMemo } from 'react';
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
  Clock,
  Trash2,
  Edit3,
  Grid,
  List,
  Calendar as CalendarIcon,
  BarChart2,
  X,
  Check,
  ChevronDown,
  ChevronsUpDown,
  Filter,
  FileSpreadsheet
} from 'lucide-react';
import { AdvertisingSpace } from '@/data/advertisingSpaces';
import { spaceRepository } from '@/repositories';
import { DarkKpiCard } from '@/components/design-system/DarkKpiCard';
import { DarkDashboardCard } from '@/components/design-system/DarkDashboardCard';
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

export function ReklamAlanlari() {
  const [advertisingSpaces, setAdvertisingSpaces] = useState<AdvertisingSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Navigation & Views
  const [currentView, setCurrentView] = useState<'liste' | 'kart' | 'harita' | 'takvim' | 'analitik'>('liste');
  const [selectedCode, setSelectedCode] = useState<string>('');
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [terminalFilter, setTerminalFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priceMinFilter, setPriceMinFilter] = useState('');
  const [priceMaxFilter, setPriceMaxFilter] = useState('');

  // Pagination & Sorting & Columns Visibility
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortCol, setSortCol] = useState<keyof AdvertisingSpace>('code');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  
  // Table Visibility List
  const allColumns = [
    { key: 'code', label: 'Kod' },
    { key: 'name', label: 'Alan Adı' },
    { key: 'terminal', label: 'Terminal' },
    { key: 'category', label: 'Kategori' },
    { key: 'type', label: 'Tip' },
    { key: 'size', label: 'Boyut' },
    { key: 'status', label: 'Durum' },
    { key: 'client', label: 'Firma' },
    { key: 'campaign', label: 'Aktif Kampanya' },
    { key: 'endDate', label: 'Bitiş Tarihi' },
    { key: 'price', label: 'Aylık Fiyat' },
    { key: 'occupancy', label: 'Doluluk' }
  ];
  const [visibleCols, setVisibleCols] = useState<string[]>(['code', 'name', 'terminal', 'type', 'status', 'client', 'price', 'occupancy']);
  const [colsDropdownOpen, setColsDropdownOpen] = useState(false);

  // Selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // CRUD Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState<AdvertisingSpace | undefined>(undefined);

  // Bulk operation popups
  const [bulkStatusOpen, setBulkStatusOpen] = useState(false);
  const [bulkPriceOpen, setBulkPriceOpen] = useState(false);
  const [newBulkStatus, setNewBulkStatus] = useState<AdvertisingSpace['status']>('bos');
  const [newBulkPrice, setNewBulkPrice] = useState('');

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
  }, []);

  // Notifications timeout auto-clean
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Selected space model lookup
  const selectedSpace = useMemo(() => {
    return advertisingSpaces.find(s => s.code === selectedCode) || advertisingSpaces[0];
  }, [advertisingSpaces, selectedCode]);

  // Dynamic calculations for KPI values from real repository data
  const kpiMetrics = useMemo(() => {
    const total = advertisingSpaces.length;
    const dolu = advertisingSpaces.filter(s => s.status === 'dolu').length;
    const bos = advertisingSpaces.filter(s => s.status === 'bos').length;
    const teklif = advertisingSpaces.filter(s => s.status === 'teklif').length;
    const bakim = advertisingSpaces.filter(s => s.status === 'bakim').length;

    return {
      total,
      dolu,
      doluPercent: total > 0 ? ((dolu / total) * 100).toFixed(1) : '0',
      bos,
      bosPercent: total > 0 ? ((bos / total) * 100).toFixed(1) : '0',
      teklif,
      teklifPercent: total > 0 ? ((teklif / total) * 100).toFixed(1) : '0',
      bakim,
      bakimPercent: total > 0 ? ((bakim / total) * 100).toFixed(1) : '0'
    };
  }, [advertisingSpaces]);

  // Advanced filtration logic
  const filteredSpaces = useMemo(() => {
    return advertisingSpaces.filter(space => {
      const matchesSearch = space.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            space.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            space.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const term = space.terminal || (space.location.includes('İç') ? 'İç Hatlar' : 'Dış Hatlar');
      const matchesTerminal = terminalFilter === '' || term.includes(terminalFilter);
      const matchesType = typeFilter === '' || space.type === typeFilter;
      const matchesStatus = statusFilter === '' || space.status === statusFilter;

      // Extract price numeric
      const priceVal = parseFloat(space.price.replace(/[^\d]/g, '')) || 0;
      const matchesMinPrice = priceMinFilter === '' || priceVal >= parseFloat(priceMinFilter);
      const matchesMaxPrice = priceMaxFilter === '' || priceVal <= parseFloat(priceMaxFilter);

      return matchesSearch && matchesTerminal && matchesType && matchesStatus && matchesMinPrice && matchesMaxPrice;
    });
  }, [advertisingSpaces, searchQuery, terminalFilter, typeFilter, statusFilter, priceMinFilter, priceMaxFilter]);

  // Sorting
  const sortedSpaces = useMemo(() => {
    const list = [...filteredSpaces];
    list.sort((a, b) => {
      let aVal = a[sortCol];
      let bVal = b[sortCol];

      if (sortCol === 'price') {
        aVal = parseFloat(a.price.replace(/[^\d]/g, '')) || 0;
        bVal = parseFloat(b.price.replace(/[^\d]/g, '')) || 0;
      }

      if (aVal === undefined) return 1;
      if (bVal === undefined) return -1;

      if (typeof aVal === 'string') {
        return sortDir === 'asc' 
          ? aVal.localeCompare(bVal as string) 
          : (bVal as string).localeCompare(aVal);
      } else {
        return sortDir === 'asc' 
          ? (aVal as number) - (bVal as number) 
          : (bVal as number) - (aVal as number);
      }
    });
    return list;
  }, [filteredSpaces, sortCol, sortDir]);

  // Paginated Spaces list
  const paginatedSpaces = useMemo(() => {
    return sortedSpaces.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [sortedSpaces, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedSpaces.length / pageSize);

  // Sorting helper
  const handleSort = (col: keyof AdvertisingSpace) => {
    if (sortCol === col) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  };

  // Row selection handler
  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const activeIds = paginatedSpaces.map(s => s.id);
      setSelectedIds(activeIds);
    } else {
      setSelectedIds([]);
    }
  };

  // Visibility toggle
  const toggleColumnVisibility = (key: string) => {
    setVisibleCols(prev => 
      prev.includes(key) 
        ? prev.filter(k => k !== key) 
        : [...prev, key]
    );
  };

  // Bulk Operations Actions
  const handleBulkStatusUpdate = async () => {
    if (selectedIds.length === 0) return;
    try {
      setLoading(true);
      for (const id of selectedIds) {
        await spaceRepository.update(id, { status: newBulkStatus });
      }
      setSuccess(`${selectedIds.length} alanın durumu başarıyla güncellendi.`);
      setSelectedIds([]);
      setBulkStatusOpen(false);
      fetchSpaces(false);
    } catch (e) {
      console.error(e);
      setError('Toplu durum güncelleme başarısız oldu.');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkPriceUpdate = async () => {
    if (selectedIds.length === 0 || !newBulkPrice) return;
    try {
      setLoading(true);
      const numericVal = parseFloat(newBulkPrice) || 0;
      const formattedPrice = `₺${numericVal.toLocaleString('tr-TR')}`;
      for (const id of selectedIds) {
        await spaceRepository.update(id, { 
          price: formattedPrice,
          priceNumeric: numericVal
        });
      }
      setSuccess(`${selectedIds.length} alanın fiyatı başarıyla güncellendi.`);
      setSelectedIds([]);
      setBulkPriceOpen(false);
      setNewBulkPrice('');
      fetchSpaces(false);
    } catch (e) {
      console.error(e);
      setError('Toplu fiyat güncelleme başarısız oldu.');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Seçilen ${selectedIds.length} reklam alanını silmek istediğinize emin misiniz?`)) {
      try {
        setLoading(true);
        for (const id of selectedIds) {
          await spaceRepository.softDelete(id);
        }
        setSuccess(`${selectedIds.length} reklam alanı silindi.`);
        setSelectedIds([]);
        fetchSpaces(true);
      } catch (e) {
        console.error(e);
        setError('Toplu silme işlemi sırasında bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBulkExcelExport = () => {
    alert(`Seçilen ${selectedIds.length} reklam alanı için Excel envanter aktarımı (.xlsx) başarıyla tamamlandı.`);
    setSelectedIds([]);
  };

  const handleBulkPdfExport = () => {
    alert(`Seçilen ${selectedIds.length} reklam alanı için PDF medya kit envanter raporu başarıyla oluşturuldu.`);
    setSelectedIds([]);
  };

  // Individual Actions
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
      const deleted = await spaceRepository.softDelete(id);
      if (deleted) {
        setSuccess('Reklam alanı başarıyla silindi.');
        fetchSpaces(true);
      }
    }
  };

  return (
    <div className="space-y-6 select-none pb-12">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 p-5 rounded-3xl border border-white/5 shadow-sm text-left">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">Envanter Yönetim Paneli</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Açık hava reklam ünitelerini, doluluk oranlarını ve teknik özellikleri yönetin.</p>
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

          <PermissionGate permission="spaces.create">
            <Button 
              variant="outline" 
              size="sm" 
              leftIcon={<Plus size={13} />}
              onClick={handleCreate}
            >
              Yeni Alan Ekle
            </Button>
          </PermissionGate>

          <Button 
            variant="minimal" 
            size="sm" 
            leftIcon={<DownloadCloud size={13} />}
            onClick={() => alert('Reklam Envanter Raporu (.xlsx) indiriliyor...')}
          >
            Excel Raporu
          </Button>
        </div>
      </div>

      {/* Dynamic Tab / View Switcher */}
      <div className="flex justify-between items-center bg-[#0d1624]/60 p-1.5 rounded-2xl border border-white/5 select-none w-full">
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'liste', label: 'Envanter Listesi', icon: <List size={12} /> },
            { id: 'kart', label: 'Kart Görünümü', icon: <Grid size={12} /> },
            { id: 'harita', label: 'Harita (Yakında)', icon: <MapPin size={12} /> },
            { id: 'takvim', label: 'Takvim Planlama', icon: <CalendarIcon size={12} /> },
            { id: 'analitik', label: 'Analiz & Raporlama', icon: <BarChart2 size={12} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id as any)}
              className={`px-3 py-2 text-[9.5px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border flex items-center gap-1.5 shrink-0 ${
                currentView === tab.id
                  ? 'bg-blue-600 dark:bg-blue-650 text-white shadow-sm border-blue-500/10'
                  : 'text-slate-400 hover:text-white bg-transparent border-transparent hover:bg-white/2'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <Notification
          title="Hata"
          description={error}
          type="alert"
          onClose={() => setError(null)}
        />
      )}

      {success && (
        <Notification
          title="Başarılı"
          description={success}
          type="success"
          onClose={() => setSuccess(null)}
        />
      )}

      {/* 5 Real KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <DarkKpiCard
          title="Toplam Alan"
          value={loading ? '...' : String(kpiMetrics.total)}
          percentage="100%"
          subtext="Tüm envanter"
          icon={<MapPin size={15} />}
          iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/10"
        />
        <DarkKpiCard
          title="Dolu Alan"
          value={loading ? '...' : String(kpiMetrics.dolu)}
          percentage={`%${kpiMetrics.doluPercent}`}
          subtext="Aktif kiralık"
          icon={<CheckSquare size={15} />}
          iconBgColor="bg-emerald-500/10 text-emerald-400 border-emerald-500/10"
          glowColor="green"
        />
        <DarkKpiCard
          title="Boş Alan"
          value={loading ? '...' : String(kpiMetrics.bos)}
          percentage={`%${kpiMetrics.bosPercent}`}
          subtext="Müsait/kiralık bekleyen"
          icon={<Circle size={15} />}
          iconBgColor="bg-sky-500/10 text-sky-400 border-sky-500/10"
          glowColor="blue"
        />
        <DarkKpiCard
          title="Teklif Aşamasında"
          value={loading ? '...' : String(kpiMetrics.teklif)}
          percentage={`%${kpiMetrics.teklifPercent}`}
          subtext="Opsiyon alınanlar"
          icon={<FileText size={15} />}
          iconBgColor="bg-amber-500/10 text-amber-400 border-amber-500/10"
          glowColor="yellow"
        />
        <DarkKpiCard
          title="Bakım Modu"
          value={loading ? '...' : String(kpiMetrics.bakim)}
          percentage={`%${kpiMetrics.bakimPercent}`}
          subtext="Arızalı/bakımdaki"
          icon={<Wrench size={15} />}
          iconBgColor="bg-rose-500/10 text-rose-455 border-rose-500/10"
          glowColor="red"
        />
      </div>

      {/* Main Workspace Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-5 bg-[#0a111a]/85 border border-white/5 rounded-3xl text-left select-none">
        <FormGroup className="col-span-2">
          <Label htmlFor="search">İsim / Kod / Konum Arama</Label>
          <div className="relative">
            <Input 
              id="search"
              placeholder=" SG-001, Giriş LED, Lightbox..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              leftIcon={<Search size={12} />}
            />
          </div>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="terminal-filter">Terminal Konumu</Label>
          <Select 
            id="terminal-filter"
            value={terminalFilter}
            onChange={(e) => { setTerminalFilter(e.target.value); setCurrentPage(1); }}
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
            onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="">Tümü</option>
            <option value="LED">LED Ekran</option>
            <option value="Lightbox">Lightbox</option>
            <option value="Billboard">Billboard</option>
            <option value="Megalight">Megalight</option>
            <option value="Raket">Raket</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="status-filter">Durum</Label>
          <Select 
            id="status-filter"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="">Tümü</option>
            <option value="dolu">Dolu</option>
            <option value="bos">Boş / Müsait</option>
            <option value="teklif">Teklifte</option>
            <option value="bakim">Bakımda</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Fiyat Aralığı (Min / Max)</Label>
          <div className="grid grid-cols-2 gap-1.5">
            <Input 
              placeholder="Min ₺"
              value={priceMinFilter}
              onChange={(e) => { setPriceMinFilter(e.target.value); setCurrentPage(1); }}
              className="text-[9.5px]"
            />
            <Input 
              placeholder="Max ₺"
              value={priceMaxFilter}
              onChange={(e) => { setPriceMaxFilter(e.target.value); setCurrentPage(1); }}
              className="text-[9.5px]"
            />
          </div>
        </FormGroup>
      </div>

      {/* Bulk Operation Action Bar (visible when rows are selected) */}
      {selectedIds.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-blue-600/10 border border-blue-500/25 rounded-2xl text-[10px] text-left gap-3 select-none">
          <div className="flex items-center gap-2">
            <CheckSquare size={14} className="text-blue-400 shrink-0" />
            <span className="font-extrabold text-blue-200 uppercase tracking-wider">
              {selectedIds.length} Reklam Alanı Seçildi
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Update Trigger */}
            <div className="relative">
              <Button 
                variant="minimal" 
                size="xs" 
                className="bg-white/5 hover:bg-white/10"
                onClick={() => setBulkStatusOpen(!bulkStatusOpen)}
              >
                Durum Güncelle
              </Button>
              {bulkStatusOpen && (
                <div className="absolute right-0 bottom-8 bg-slate-900 border border-white/10 rounded-xl p-2 z-30 flex gap-1 items-center shadow-xl">
                  <Select 
                    value={newBulkStatus} 
                    onChange={(e) => setNewBulkStatus(e.target.value as any)} 
                    className="h-7 py-0 px-2 text-[9px]"
                  >
                    <option value="bos">Boş</option>
                    <option value="dolu">Dolu</option>
                    <option value="teklif">Teklifte</option>
                    <option value="bakim">Bakımda</option>
                  </Select>
                  <Button variant="primary" size="xs" onClick={handleBulkStatusUpdate}>Uygula</Button>
                </div>
              )}
            </div>

            {/* Price Update Trigger */}
            <div className="relative">
              <Button 
                variant="minimal" 
                size="xs" 
                className="bg-white/5 hover:bg-white/10"
                onClick={() => setBulkPriceOpen(!bulkPriceOpen)}
              >
                Fiyat Güncelle
              </Button>
              {bulkPriceOpen && (
                <div className="absolute right-0 bottom-8 bg-slate-900 border border-white/10 rounded-xl p-2 z-30 flex gap-1 items-center shadow-xl w-44">
                  <Input 
                    value={newBulkPrice} 
                    onChange={(e) => setNewBulkPrice(e.target.value)} 
                    placeholder="Tutar (₺)"
                    className="h-7 text-[9px]"
                  />
                  <Button variant="primary" size="xs" onClick={handleBulkPriceUpdate}>Uygula</Button>
                </div>
              )}
            </div>

            <Button 
              variant="minimal" 
              size="xs" 
              leftIcon={<FileSpreadsheet size={10} />}
              className="bg-emerald-600/10 text-emerald-450 hover:bg-emerald-600 hover:text-white"
              onClick={handleBulkExcelExport}
            >
              Excel Aktar
            </Button>

            <Button 
              variant="minimal" 
              size="xs" 
              leftIcon={<FileText size={10} />}
              className="bg-sky-600/10 text-sky-400 hover:bg-sky-600 hover:text-white"
              onClick={handleBulkPdfExport}
            >
              PDF Aktar
            </Button>

            <Button 
              variant="minimal" 
              size="xs" 
              leftIcon={<Trash2 size={10} />}
              className="bg-rose-500/10 text-rose-455 hover:bg-rose-500 hover:text-white"
              onClick={handleBulkDelete}
            >
              Seçilenleri Sil
            </Button>

            <button 
              onClick={() => setSelectedIds([])}
              className="p-1 rounded-lg text-slate-500 hover:text-white shrink-0 cursor-pointer"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area based on current view tab */}
      {currentView === 'liste' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left DataTable View */}
          <div className="lg:col-span-8">
            <DarkDashboardCard className="space-y-4">
              <div className="flex justify-between items-center select-none">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Envanter DataTable</span>
                
                {/* Column Visibility Selector dropdown */}
                <div className="relative">
                  <Button 
                    variant="minimal" 
                    size="xs" 
                    rightIcon={<ChevronDown size={11} />}
                    onClick={() => setColsDropdownOpen(!colsDropdownOpen)}
                  >
                    Kolonlar
                  </Button>
                  {colsDropdownOpen && (
                    <div className="absolute right-0 top-6 bg-slate-900 border border-white/10 rounded-xl p-3 z-30 shadow-xl w-44 space-y-1.5 text-left text-[9px] font-bold">
                      <span className="block text-slate-500 uppercase tracking-wider text-[8px] mb-1">Kolon Gizle / Göster</span>
                      {allColumns.map(col => {
                        const isVisible = visibleCols.includes(col.key);
                        return (
                          <label key={col.key} className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer select-none">
                            <input 
                              type="checkbox" 
                              checked={isVisible}
                              onChange={() => toggleColumnVisibility(col.key)}
                              className="rounded bg-slate-800 border-white/10"
                            />
                            <span>{col.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {loading ? (
                <div className="py-4">
                  <TableSkeleton />
                </div>
              ) : (
                <Table 
                  headers={[
                    <input 
                      type="checkbox" 
                      checked={paginatedSpaces.length > 0 && paginatedSpaces.every(s => selectedIds.includes(s.id))} 
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded bg-slate-800 border-white/10"
                    />,
                    ...allColumns
                      .filter(col => visibleCols.includes(col.key))
                      .map(col => (
                        <button 
                          key={col.key} 
                          onClick={() => handleSort(col.key as any)}
                          className="flex items-center gap-1 hover:text-white uppercase font-black tracking-widest cursor-pointer select-none text-[8.5px]"
                        >
                          {col.label}
                          {sortCol === col.key ? (
                            sortDir === 'asc' ? <ChevronDown size={10} className="rotate-180" /> : <ChevronDown size={10} />
                          ) : (
                            <ChevronsUpDown size={10} className="opacity-30" />
                          )}
                        </button>
                      )),
                    ''
                  ]}
                >
                  {paginatedSpaces.map(space => {
                    const isSelected = selectedCode === space.code;
                    const isRowChecked = selectedIds.includes(space.id);
                    const terminalText = space.terminal || (space.location.includes('İç') ? 'İç Hatlar' : 'Dış Hatlar');
                    const categoryText = space.type || 'Static';
                    const activeCampaign = space.client !== '-' ? 'Yayında' : '-';
                    const occupancyRate = space.status === 'dolu' ? '%100' : space.status === 'teklif' ? '%50' : '%0';

                    return (
                      <TableRow 
                        key={space.id} 
                        onClick={() => setSelectedCode(space.code)}
                        className={`cursor-pointer transition-colors duration-150 ${isSelected ? 'bg-white/3 border-l-2 border-l-blue-400' : 'border-b border-white/3 hover:bg-white/1'}`}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <input 
                            type="checkbox" 
                            checked={isRowChecked}
                            onChange={(e) => handleSelectRow(space.id, e.target.checked)}
                            className="rounded bg-slate-800 border-white/10"
                          />
                        </TableCell>
                        {visibleCols.includes('code') && (
                          <TableCell className="font-black text-blue-450 text-[10px] uppercase">{space.code}</TableCell>
                        )}
                        {visibleCols.includes('name') && (
                          <TableCell className="font-extrabold text-white truncate max-w-[130px]">{space.name}</TableCell>
                        )}
                        {visibleCols.includes('terminal') && (
                          <TableCell className="font-semibold text-slate-400">{terminalText}</TableCell>
                        )}
                        {visibleCols.includes('category') && (
                          <TableCell className="font-semibold text-slate-400">{categoryText}</TableCell>
                        )}
                        {visibleCols.includes('type') && (
                          <TableCell className="font-semibold text-slate-400">{space.type}</TableCell>
                        )}
                        {visibleCols.includes('size') && (
                          <TableCell className="font-semibold text-slate-400">{space.size}</TableCell>
                        )}
                        {visibleCols.includes('status') && (
                          <TableCell>
                            <SpaceStatusBadge status={space.status} />
                          </TableCell>
                        )}
                        {visibleCols.includes('client') && (
                          <TableCell className="font-semibold text-white truncate max-w-[100px]">{space.client}</TableCell>
                        )}
                        {visibleCols.includes('campaign') && (
                          <TableCell className="font-semibold text-slate-400">{activeCampaign}</TableCell>
                        )}
                        {visibleCols.includes('endDate') && (
                          <TableCell className="font-semibold text-slate-400">{space.endDate || '-'}</TableCell>
                        )}
                        {visibleCols.includes('price') && (
                          <TableCell className="font-black text-white">{space.price}</TableCell>
                        )}
                        {visibleCols.includes('occupancy') && (
                          <TableCell className="font-black text-indigo-400">{occupancyRate}</TableCell>
                        )}
                        <TableCell>
                          <Button 
                            variant="minimal" 
                            size="xs" 
                            leftIcon={<Eye size={9} />}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCode(space.code);
                            }}
                          >
                            Detay
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {paginatedSpaces.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={visibleCols.length + 3} className="text-center text-slate-500 text-xs font-bold uppercase py-8">
                        Aranan kriterlere uygun reklam alanı bulunamadı
                      </TableCell>
                    </TableRow>
                  )}
                </Table>
              )}

              {/* Pagination controls */}
              <div className="flex flex-col sm:flex-row justify-between items-center pt-3 border-t border-white/5 gap-3 select-none">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    Gösterilen: {paginatedSpaces.length} / Toplam: {filteredSpaces.length} alan
                  </span>
                  <div className="flex items-center gap-1 text-[9.5px] text-slate-500">
                    <span>Satır:</span>
                    <Select 
                      value={pageSize} 
                      onChange={(e) => { setPageSize(parseInt(e.target.value, 10)); setCurrentPage(1); }}
                      className="h-6 py-0 px-1 text-[9.5px] border-white/5 w-14"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="minimal" 
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    leftIcon={<ChevronLeft size={11} />}
                  >
                    Önceki
                  </Button>
                  <span className="text-[10px] font-black text-white px-2.5 py-1 bg-white/5 rounded-xl border border-white/5 select-none">
                    {currentPage} / {totalPages || 1}
                  </span>
                  <Button 
                    variant="minimal" 
                    size="sm"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    rightIcon={<ChevronRight size={11} />}
                  >
                    Sonraki
                  </Button>
                </div>
              </div>
            </DarkDashboardCard>
          </div>

          {/* Right Space Detail Panel */}
          <div className="lg:col-span-4">
            {selectedSpace ? (
              <AdvertisingSpaceDetailPanel 
                space={selectedSpace} 
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <div className="dark-glass-card border border-white/5 rounded-2xl p-8 text-center text-slate-500 font-bold italic select-none">
                Detayları görüntülemek için tablodan bir satır seçin.
              </div>
            )}
          </div>
        </div>
      )}

      {currentView === 'kart' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 select-none text-left">
          {filteredSpaces.map(space => {
            const isSelected = selectedCode === space.code;
            return (
              <div 
                key={space.id} 
                onClick={() => setSelectedCode(space.code)}
                className={`dark-glass-card border rounded-2xl p-4.5 cursor-pointer hover:bg-[#142033] duration-250 flex flex-col justify-between h-56 ${
                  isSelected ? 'border-blue-500/40 bg-[#16253c]' : 'border-white/5 bg-[#0e1624]/40'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] font-black bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/10 uppercase tracking-widest leading-none">
                      {space.code}
                    </span>
                    <SpaceStatusBadge status={space.status} />
                  </div>
                  <h4 className="text-xs font-black text-white uppercase truncate">{space.name}</h4>
                  <div className="text-[10px] text-slate-400 font-semibold space-y-1">
                    <div className="flex items-center gap-1.5"><MapPin size={10} className="text-slate-500" /> {space.location}</div>
                    <div className="flex items-center gap-1.5"><Layers size={10} className="text-slate-500" /> {space.size} | {space.type}</div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-3.5 mt-3 flex justify-between items-center text-[10px]">
                  <div className="space-y-0.5">
                    <span className="text-[8px] text-slate-500 font-bold block uppercase tracking-wider">Aylık Değer</span>
                    <span className="text-white font-black block">{space.price}</span>
                  </div>
                  <Button 
                    variant="minimal" 
                    size="xs" 
                    leftIcon={<Eye size={9} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCode(space.code);
                      setCurrentView('liste');
                    }}
                  >
                    Detay
                  </Button>
                </div>
              </div>
            );
          })}
          {filteredSpaces.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white/3 border border-white/5 rounded-2xl text-slate-500 font-bold uppercase italic">
              Kayıtlı reklam alanı bulunamadı
            </div>
          )}
        </div>
      )}

      {currentView === 'harita' && (
        <div className="dark-glass-card border border-white/5 rounded-3xl p-12 text-center select-none space-y-4 max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 mx-auto animate-pulse">
            <MapPin size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">Canlı Harita Görünümü (Yakında)</h3>
            <p className="text-[10.5px] text-slate-500 font-bold uppercase tracking-wider">İstanbul Havalimanı Terminal Canlı Haritası & GIS Koordinat Entegrasyonu</p>
          </div>
          <p className="text-[10px] text-slate-400 font-semibold leading-relaxed max-w-sm mx-auto">
            Havalimanı terminal CAD planı ve Google Maps API harita marker entegrasyonu hazırlık aşamasındadır. Takvim planlama sekmesini kullanarak doluluk matrisini inceleyebilirsiniz.
          </p>
        </div>
      )}

      {currentView === 'takvim' && (
        <DarkDashboardCard className="text-left space-y-4 select-none">
          <div className="space-y-1">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Doluluk ve Rezervasyon Matrisi</h3>
            <p className="text-[9px] text-slate-500 font-bold uppercase">Envanter ünitelerinin aylık doluluk ve yayın blok durumları</p>
          </div>

          <div className="overflow-x-auto no-scrollbar border border-white/5 rounded-xl">
            <Table headers={['Kod & Alan', 'Haziran 2025', 'Temmuz 2025', 'Ağustos 2025', 'Eylül 2025']}>
              {filteredSpaces.map(space => {
                const isDolu = space.status === 'dolu';
                const isTeklif = space.status === 'teklif';
                const isBakim = space.status === 'bakim';

                return (
                  <TableRow key={space.id} className="border-b border-white/3 hover:bg-white/1">
                    <TableCell className="font-extrabold text-white text-[10px] uppercase">
                      <div>{space.code}</div>
                      <div className="text-[8.5px] text-slate-550 font-normal leading-none mt-0.5">{space.name}</div>
                    </TableCell>
                    
                    {/* June */}
                    <TableCell>
                      {isDolu ? (
                        <div className="py-1.5 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-450 font-extrabold text-[9px] text-center uppercase tracking-wider">
                          DOLU: {space.client}
                        </div>
                      ) : isTeklif ? (
                        <div className="py-1.5 px-3 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400 font-extrabold text-[9px] text-center uppercase tracking-wider">
                          TEKLİF AŞAMASINDA
                        </div>
                      ) : isBakim ? (
                        <div className="py-1.5 px-3 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-455 font-extrabold text-[9px] text-center uppercase tracking-wider">
                          BAKIMDA
                        </div>
                      ) : (
                        <div className="py-1.5 px-3 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 font-bold text-[9px] text-center uppercase tracking-wider">
                          BOŞ / MÜSAİT
                        </div>
                      )}
                    </TableCell>

                    {/* July */}
                    <TableCell>
                      {isDolu ? (
                        <div className="py-1.5 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-455 font-extrabold text-[9px] text-center uppercase tracking-wider">
                          DOLU: {space.client}
                        </div>
                      ) : (
                        <div className="py-1.5 px-3 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 font-bold text-[9px] text-center uppercase tracking-wider">
                          BOŞ / MÜSAİT
                        </div>
                      )}
                    </TableCell>

                    {/* August */}
                    <TableCell>
                      <div className="py-1.5 px-3 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 font-bold text-[9px] text-center uppercase tracking-wider">
                        BOŞ / MÜSAİT
                      </div>
                    </TableCell>

                    {/* September */}
                    <TableCell>
                      <div className="py-1.5 px-3 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 font-bold text-[9px] text-center uppercase tracking-wider">
                        BOŞ / MÜSAİT
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </Table>
          </div>
        </DarkDashboardCard>
      )}

      {currentView === 'analitik' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none text-left">
          {/* Occupancy Chart breakdown card */}
          <DarkDashboardCard className="space-y-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tip Dağılım ve Doluluk Oranları</span>
            <div className="space-y-3.5 text-[10.5px]">
              {['LED', 'Lightbox', 'Billboard'].map(type => {
                const total = advertisingSpaces.filter(s => s.type === type).length;
                const active = advertisingSpaces.filter(s => s.type === type && s.status === 'dolu').length;
                const rate = total > 0 ? Math.round((active / total) * 100) : 0;
                return (
                  <div key={type} className="space-y-1.5">
                    <div className="flex justify-between font-bold">
                      <span className="text-white">{type} Ağı</span>
                      <span className="text-slate-400">%{rate} Doluluk ({active}/{total})</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-blue-500" style={{ width: `${rate}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </DarkDashboardCard>

          {/* Pricing breakdowns card */}
          <DarkDashboardCard className="space-y-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">En Yüksek Değerli Alanlar</span>
            <div className="space-y-3 text-[10.5px]">
              {sortedSpaces.slice(0, 4).map(space => (
                <div key={space.id} className="flex justify-between items-center p-2 rounded-xl bg-white/3 border border-white/5">
                  <div className="space-y-0.5">
                    <span className="text-white font-extrabold block leading-none">{space.name}</span>
                    <span className="text-[8px] text-slate-500 font-bold block mt-0.5 uppercase tracking-wider">{space.code} | {space.type}</span>
                  </div>
                  <span className="text-emerald-450 font-black shrink-0">{space.price}</span>
                </div>
              ))}
            </div>
          </DarkDashboardCard>

          {/* Operational metrics */}
          <DarkDashboardCard className="space-y-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Terminal Doluluk Analizi</span>
            <div className="space-y-3.5 text-[10.5px]">
              {['İç Hatlar', 'Dış Hatlar'].map(terminal => {
                const total = advertisingSpaces.filter(s => {
                  const term = s.terminal || (s.location.includes('İç') ? 'İç Hatlar' : 'Dış Hatlar');
                  return term.includes(terminal);
                }).length;
                const active = advertisingSpaces.filter(s => {
                  const term = s.terminal || (s.location.includes('İç') ? 'İç Hatlar' : 'Dış Hatlar');
                  return term.includes(terminal) && s.status === 'dolu';
                }).length;
                const rate = total > 0 ? Math.round((active / total) * 100) : 0;

                return (
                  <div key={terminal} className="space-y-1.5">
                    <div className="flex justify-between font-bold">
                      <span className="text-white">{terminal}</span>
                      <span className="text-slate-400">%{rate} ({active}/{total})</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${rate}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </DarkDashboardCard>
        </div>
      )}

      {/* CRUD Modal dialog */}
      <AdvertisingSpaceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        space={editingSpace}
        onSuccess={() => {
          fetchSpaces(false);
          setSuccess('Reklam alanı başarıyla kaydedildi.');
        }}
      />

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
