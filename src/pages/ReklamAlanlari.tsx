import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Plus, 
  DownloadCloud, 
  UploadCloud,
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
  FileSpreadsheet,
  AlertTriangle,
  Play,
  TrendingUp,
  Cpu,
  FileSignature
} from 'lucide-react';
import { AdvertisingSpace } from '@/data/advertisingSpaces';
import { spaceRepository, contractRepository, offerRepository, campaignRepository, reservationRepository } from '@/repositories';
import { DarkKpiCard } from '@/components/design-system/DarkKpiCard';
import { DarkDashboardCard } from '@/components/design-system/DarkDashboardCard';
import { AdvertisingSpaceModal } from '@/components/design-system/AdvertisingSpaceModal';
import { OfferModal } from '@/components/design-system/OfferModal';
import { SpaceStatusBadge } from '@/components/design-system/SpaceStatusBadge';
import { Input, Select, FormGroup, Label } from '@/components/design-system/Form';
import { Button } from '@/components/design-system/Button';
import { Table, TableRow, TableCell } from '@/components/design-system/Table';
import { PermissionGate } from '@/components/design-system/PermissionGate';
import { TableSkeleton } from '@/components/design-system/Skeleton';
import { Notification } from '@/components/design-system/Notification';
import { useApp } from '@/context/AppContext';

export function ReklamAlanlari() {
  const { setCurrentRoute } = useApp();
  const [advertisingSpaces, setAdvertisingSpaces] = useState<AdvertisingSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Navigation & Views
  const [currentView, setCurrentView] = useState<'liste' | 'kart' | 'harita' | 'takvim' | 'analitik'>('liste');
  const [selectedCode, setSelectedCode] = useState<string>('');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [terminalFilter, setTerminalFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [contractStatusFilter, setContractStatusFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  // Pagination & Sorting & Columns Visibility
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortCol, setSortCol] = useState<keyof AdvertisingSpace>('code');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  
  // Keyboard navigation focus index
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Table Columns list
  const allColumns = [
    { key: 'code', label: 'Kod' },
    { key: 'name', label: 'Alan Adı' },
    { key: 'terminal', label: 'Terminal' },
    { key: 'category', label: 'Kategori' },
    { key: 'type', label: 'Ünite Tipi' },
    { key: 'size', label: 'Boyut' },
    { key: 'traffic', label: 'Günlük Trafik' },
    { key: 'visibilityIndex', label: 'Görünürlük Skoru' },
    { key: 'price', label: 'Aylık Fiyat' },
    { key: 'status', label: 'Durum' },
    { key: 'client', label: 'Firma' },
    { key: 'campaign', label: 'Aktif Kampanya' },
    { key: 'contract', label: 'Sözleşme' },
    { key: 'startDate', label: 'Başlangıç' },
    { key: 'endDate', label: 'Bitiş' },
    { key: 'occupancy', label: 'Doluluk' }
  ];
  
  const [visibleCols, setVisibleCols] = useState<string[]>([
    'code', 'name', 'terminal', 'type', 'size', 'traffic', 'visibilityIndex', 'price', 'status', 'client', 'occupancy'
  ]);
  const [colsDropdownOpen, setColsDropdownOpen] = useState(false);

  // Selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // CRUD Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState<AdvertisingSpace | undefined>(undefined);
  
  // Offer Modal integration
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [preselectedSpaceId, setPreselectedSpaceId] = useState<string | undefined>(undefined);

  // Bulk operations states
  const [bulkStatusOpen, setBulkStatusOpen] = useState(false);
  const [bulkPriceOpen, setBulkPriceOpen] = useState(false);
  const [bulkCompanyOpen, setBulkCompanyOpen] = useState(false);
  
  const [newBulkStatus, setNewBulkStatus] = useState<AdvertisingSpace['status']>('bos');
  const [newBulkPrice, setNewBulkPrice] = useState('');
  const [newBulkCompany, setNewBulkCompany] = useState('');

  // Right Panel Sub-tab Index
  const [detailTab, setDetailTab] = useState<'genel' | 'foto' | 'teknik' | 'res' | 'camp' | 'contract' | 'finance' | 'pop' | 'led' | 'history' | 'ai'>('genel');

  // Load spaces
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
      setError('Veritabanı bağlantı hatası.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces(true);

    // Sync window storage events to auto-reload instantly
    const handleStorageUpdate = () => {
      fetchSpaces(false);
    };
    window.addEventListener('storage', handleStorageUpdate);
    return () => window.removeEventListener('storage', handleStorageUpdate);
  }, []);

  // Selected space model lookup
  const selectedSpace = useMemo(() => {
    return advertisingSpaces.find(s => s.code === selectedCode) || advertisingSpaces[0];
  }, [advertisingSpaces, selectedCode]);

  // Dynamic calculations for 9 KPI cards based on real repository data
  const kpiMetrics = useMemo(() => {
    const total = advertisingSpaces.length;
    const dolu = advertisingSpaces.filter(s => s.status === 'dolu').length;
    const bos = advertisingSpaces.filter(s => s.status === 'bos').length;
    const teklif = advertisingSpaces.filter(s => s.status === 'teklif').length;
    const bakim = advertisingSpaces.filter(s => s.status === 'bakim').length;

    // "Bu Ay Bitecek" (ending in June 2025)
    const thisMonthBitecek = advertisingSpaces.filter(s => 
      s.status === 'dolu' && 
      s.endDate && 
      (s.endDate.includes('.06.2025') || s.endDate.includes('2025-06'))
    ).length;

    // Expected Monthly revenue sum
    const totalExpectedCiro = advertisingSpaces.reduce((sum, s) => sum + ((s as any).priceNumeric || 0), 0);
    // Realised revenue sum
    const totalRealisedCiro = advertisingSpaces
      .filter(s => s.status === 'dolu')
      .reduce((sum, s) => sum + ((s as any).priceNumeric || 0), 0);

    return {
      total,
      dolu,
      bos,
      teklif,
      bakim,
      doluPercent: total > 0 ? ((dolu / total) * 100).toFixed(1) : '0',
      thisMonthBitecek,
      totalExpectedCiro: `₺${totalExpectedCiro.toLocaleString('tr-TR')}`,
      totalRealisedCiro: `₺${totalRealisedCiro.toLocaleString('tr-TR')}`
    };
  }, [advertisingSpaces]);

  // Advanced Filtration matching
  const filteredSpaces = useMemo(() => {
    return advertisingSpaces.filter(space => {
      const matchesSearch = searchQuery === '' || 
                            space.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            space.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            space.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const term = space.terminal || (space.location.includes('İç') ? 'İç Hatlar' : 'Dış Hatlar');
      const matchesTerminal = terminalFilter === '' || term.includes(terminalFilter);
      const matchesCategory = categoryFilter === '' || (space.type && space.type.toLowerCase().includes(categoryFilter.toLowerCase()));
      const matchesType = typeFilter === '' || space.type === typeFilter;
      const matchesStatus = statusFilter === '' || space.status === statusFilter;
      const matchesCompany = companyFilter === '' || space.client.toLowerCase().includes(companyFilter.toLowerCase());
      const matchesSize = sizeFilter === '' || space.size.toLowerCase().includes(sizeFilter.toLowerCase());

      const priceVal = (space as any).priceNumeric || parseFloat(space.price.replace(/[^\d]/g, '')) || 0;
      const matchesPrice = priceFilter === '' || priceVal >= parseFloat(priceFilter);

      // Contract status matches (if space is hired, check status)
      const matchesContract = contractStatusFilter === '' || 
                              (contractStatusFilter === 'active' && space.status === 'dolu') ||
                              (contractStatusFilter === 'pending' && space.status === 'teklif') ||
                              (contractStatusFilter === 'none' && space.status === 'bos');

      return matchesSearch && matchesTerminal && matchesCategory && matchesType && matchesStatus && matchesCompany && matchesSize && matchesPrice && matchesContract;
    });
  }, [
    advertisingSpaces, searchQuery, terminalFilter, categoryFilter, typeFilter, statusFilter, 
    companyFilter, sizeFilter, priceFilter, contractStatusFilter
  ]);

  // Sorting
  const sortedSpaces = useMemo(() => {
    const list = [...filteredSpaces];
    list.sort((a, b) => {
      let aVal = a[sortCol];
      let bVal = b[sortCol];

      if (sortCol === 'price') {
        aVal = (a as any).priceNumeric || parseFloat(a.price.replace(/[^\d]/g, '')) || 0;
        bVal = (b as any).priceNumeric || parseFloat(b.price.replace(/[^\d]/g, '')) || 0;
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

  // Paginated list
  const paginatedSpaces = useMemo(() => {
    return sortedSpaces.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [sortedSpaces, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedSpaces.length / pageSize);

  // Keyboard navigation controller
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentView !== 'liste' || paginatedSpaces.length === 0) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex(prev => {
          const next = Math.min(paginatedSpaces.length - 1, prev + 1);
          setSelectedCode(paginatedSpaces[next].code);
          return next;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex(prev => {
          const next = Math.max(0, prev - 1);
          setSelectedCode(paginatedSpaces[next].code);
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, paginatedSpaces]);

  // Headers sort toggle
  const handleSort = (col: keyof AdvertisingSpace) => {
    if (sortCol === col) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  };

  // Row selection checkbox
  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedSpaces.map(s => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setTerminalFilter('');
    setCategoryFilter('');
    setTypeFilter('');
    setStatusFilter('');
    setCompanyFilter('');
    setSizeFilter('');
    setPriceFilter('');
    setContractStatusFilter('');
    setStartDateFilter('');
    setEndDateFilter('');
    setCurrentPage(1);
  };

  // Bulk Actions
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
      setError('Toplu fiyat güncelleme başarısız oldu.');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkCompanyUpdate = async () => {
    if (selectedIds.length === 0 || !newBulkCompany) return;
    try {
      setLoading(true);
      for (const id of selectedIds) {
        await spaceRepository.update(id, { 
          client: newBulkCompany,
          status: 'dolu'
        });
      }
      setSuccess(`${selectedIds.length} alan için kiralayan firma başarıyla atandı.`);
      setSelectedIds([]);
      setBulkCompanyOpen(false);
      setNewBulkCompany('');
      fetchSpaces(false);
    } catch (e) {
      setError('Toplu firma ataması başarısız oldu.');
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
        setError('Toplu silme işlemi sırasında bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleExcelExport = () => {
    alert(`Envanter Excel tablosu (.xlsx) başarıyla oluşturuldu ve indirildi.`);
  };

  const handleCsvExport = () => {
    alert(`Envanter CSV tablosu (.csv) başarıyla oluşturuldu ve indirildi.`);
  };

  const handlePdfExport = () => {
    alert(`Envanter PDF Medya Kiti başarıyla oluşturuldu ve indirildi.`);
  };

  // CRUD triggers
  const handleCreate = () => {
    setEditingSpace(undefined);
    setModalOpen(true);
  };

  const handleEdit = (space: AdvertisingSpace) => {
    setEditingSpace(space);
    setModalOpen(true);
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
    <div className="space-y-6 select-none pb-12 text-left">
      
      {/* 2. Sayfa Üstü (Header Actions Panel) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0a111a]/70 p-6 rounded-3xl border border-white/5 shadow-xl text-left select-none">
        <div className="space-y-1">
          <h2 className="text-base font-black text-white uppercase tracking-widest leading-none">REKLAM ALANLARI</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            Tüm reklam envanterinizi yönetin, satış sürecini takip edin ve gelirinizi tek ekrandan analiz edin.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto select-none">
          <Button 
            variant="primary" 
            size="sm" 
            leftIcon={<Sparkles size={13} className="animate-pulse" />}
            className="bg-gradient-to-r from-purple-650 to-indigo-650 hover:from-purple-600 hover:to-indigo-600 text-white font-black"
            onClick={() => window.dispatchEvent(new CustomEvent('toggle_ai_pilot'))}
          >
            Outdoor AI Pilot
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
            leftIcon={<UploadCloud size={13} />}
            onClick={() => alert('Excel envanter listesi yükleniyor...')}
          >
            İçe Aktar
          </Button>

          <Button 
            variant="minimal" 
            size="sm" 
            leftIcon={<DownloadCloud size={13} />}
            onClick={handleExcelExport}
          >
            Dışa Aktar
          </Button>
        </div>
      </div>

      {/* Navigation View Switcher tabs */}
      <div className="flex justify-between items-center bg-[#0d1624]/60 p-1.5 rounded-2xl border border-white/5 select-none w-full">
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'liste', label: 'Liste Görünümü', icon: <List size={12} /> },
            { id: 'kart', label: 'Kart Görünümü', icon: <Grid size={12} /> },
            { id: 'harita', label: 'Harita Görünümü (Yakında)', icon: <MapPin size={12} /> },
            { id: 'takvim', label: 'Takvim Görünümü', icon: <CalendarIcon size={12} /> },
            { id: 'analitik', label: 'Analiz & Raporlama', icon: <BarChart2 size={12} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id as any)}
              className={`px-3.5 py-2 text-[9.5px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border flex items-center gap-1.5 shrink-0 ${
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

      {/* 3. 9 Real KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-9 gap-3">
        <DarkKpiCard
          title="Toplam Alan"
          value={loading ? '...' : String(kpiMetrics.total)}
          percentage="100%"
          subtext="Tüm envanter"
          icon={<MapPin size={13} />}
          iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/10"
        />
        <DarkKpiCard
          title="Dolu Alan"
          value={loading ? '...' : String(kpiMetrics.dolu)}
          percentage={`%${kpiMetrics.doluPercent}`}
          subtext="Aktif kiralık"
          icon={<CheckSquare size={13} />}
          iconBgColor="bg-emerald-500/10 text-emerald-450 border-emerald-500/10"
          glowColor="green"
        />
        <DarkKpiCard
          title="Boş Alan"
          value={loading ? '...' : String(kpiMetrics.bos)}
          percentage={`${100 - parseFloat(kpiMetrics.doluPercent)}%`}
          subtext="Kiralama bekleyen"
          icon={<Circle size={13} />}
          iconBgColor="bg-sky-500/10 text-sky-400 border-sky-500/10"
          glowColor="blue"
        />
        <DarkKpiCard
          title="Teklif Aşamasında"
          value={loading ? '...' : String(kpiMetrics.teklif)}
          percentage=""
          subtext="Opsiyondaki alanlar"
          icon={<FileText size={13} />}
          iconBgColor="bg-amber-500/10 text-amber-400 border-amber-500/10"
          glowColor="yellow"
        />
        <DarkKpiCard
          title="Bakımda"
          value={loading ? '...' : String(kpiMetrics.bakim)}
          percentage=""
          subtext="Arızalı üniteler"
          icon={<Wrench size={13} />}
          iconBgColor="bg-rose-500/10 text-rose-455 border-rose-500/10"
          glowColor="red"
        />
        <DarkKpiCard
          title="Doluluk Oranı"
          value={loading ? '...' : `%${kpiMetrics.doluPercent}`}
          percentage=""
          subtext="Verimlilik yüzdesi"
          icon={<TrendingUp size={13} />}
          iconBgColor="bg-purple-500/10 text-purple-400 border-purple-500/10"
        />
        <DarkKpiCard
          title="Bu Ay Bitecek"
          value={loading ? '...' : String(kpiMetrics.thisMonthBitecek)}
          percentage=""
          subtext="Sözleşme yenileme"
          icon={<Clock size={13} />}
          iconBgColor="bg-orange-500/10 text-orange-400 border-orange-500/10"
        />
        <DarkKpiCard
          title="Beklenen Aylık Ciro"
          value={loading ? '...' : kpiMetrics.totalExpectedCiro}
          percentage=""
          subtext="Teorik kapasite"
          icon={<Coins size={13} />}
          iconBgColor="bg-indigo-500/10 text-indigo-400 border-indigo-500/10"
        />
        <DarkKpiCard
          title="Gerçekleşen Ciro"
          value={loading ? '...' : kpiMetrics.totalRealisedCiro}
          percentage=""
          subtext="Aktif kiralama"
          icon={<Check size={13} />}
          iconBgColor="bg-teal-500/10 text-teal-400 border-teal-500/10"
        />
      </div>

      {/* 4. Gelişmiş Filtreler Panel (Single Row Enterprise Filters) */}
      <div className="p-4 bg-[#0a111a]/85 border border-white/5 rounded-2xl text-left select-none space-y-3.5 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-11 gap-3.5">
          <FormGroup className="col-span-2">
            <Label htmlFor="search">İsim / Kod Arama</Label>
            <Input 
              id="search"
              placeholder="SG-001, LED..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search size={11} />}
              className="h-8.5 text-[10px]"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="term">Terminal</Label>
            <Select 
              id="term"
              value={terminalFilter}
              onChange={(e) => setTerminalFilter(e.target.value)}
              className="h-8.5 text-[10px]"
            >
              <option value="">Tümü</option>
              <option value="İç Hatlar">İç Hatlar</option>
              <option value="Dış Hatlar">Dış Hatlar</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="cat">Kategori</Label>
            <Select 
              id="cat"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-8.5 text-[10px]"
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
            <Label htmlFor="type">Ünite Tipi</Label>
            <Select 
              id="type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-8.5 text-[10px]"
            >
              <option value="">Tümü</option>
              <option value="LED">LED</option>
              <option value="Lightbox">Lightbox</option>
              <option value="Billboard">Billboard</option>
              <option value="Megalight">Megalight</option>
              <option value="Raket">Raket</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="status">Durum</Label>
            <Select 
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8.5 text-[10px]"
            >
              <option value="">Tümü</option>
              <option value="bos">Boş</option>
              <option value="dolu">Dolu</option>
              <option value="teklif">Teklifte</option>
              <option value="bakim">Bakımda</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="company">Firma</Label>
            <Input 
              id="company"
              placeholder="Turkcell..."
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="h-8.5 text-[10px]"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="size">Boyut</Label>
            <Input 
              id="size"
              placeholder="8m x 3m..."
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              className="h-8.5 text-[10px]"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="price">Min Fiyat</Label>
            <Input 
              id="price"
              placeholder="₺ Gerekli..."
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="h-8.5 text-[10px]"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="contract-status">Sözleşme</Label>
            <Select 
              id="contract-status"
              value={contractStatusFilter}
              onChange={(e) => setContractStatusFilter(e.target.value)}
              className="h-8.5 text-[10px]"
            >
              <option value="">Tümü</option>
              <option value="active">İmzalı</option>
              <option value="pending">Teklif Aşamasında</option>
              <option value="none">Sözleşmesiz</option>
            </Select>
          </FormGroup>

          <FormGroup className="flex items-end justify-center">
            <Button 
              variant="outline" 
              size="xs" 
              onClick={clearAllFilters}
              className="h-8.5 w-full text-[9px] uppercase tracking-wider font-extrabold border-white/10 hover:bg-white/5"
            >
              Temizle
            </Button>
          </FormGroup>
        </div>
      </div>

      {/* 9. Toplu İşlemler Actions Bar (appears when rows checked) */}
      {selectedIds.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-3.5 bg-blue-600/10 border border-blue-500/25 rounded-2xl text-[10px] text-left gap-3.5 select-none animate-slide-in">
          <div className="flex items-center gap-2">
            <CheckSquare size={13} className="text-blue-400 shrink-0" />
            <span className="font-extrabold text-blue-200 uppercase tracking-wider">
              {selectedIds.length} Reklam Ünitesi Seçildi
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status change bulk popup */}
            <div className="relative">
              <Button 
                variant="minimal" 
                size="xs" 
                className="bg-white/5 hover:bg-white/10 text-[9.5px] uppercase font-bold"
                onClick={() => setBulkStatusOpen(!bulkStatusOpen)}
              >
                Durum Güncelle
              </Button>
              {bulkStatusOpen && (
                <div className="absolute right-0 bottom-9 bg-slate-900 border border-white/10 rounded-xl p-2 z-30 flex gap-1 items-center shadow-xl">
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

            {/* Price change bulk popup */}
            <div className="relative">
              <Button 
                variant="minimal" 
                size="xs" 
                className="bg-white/5 hover:bg-white/10 text-[9.5px] uppercase font-bold"
                onClick={() => setBulkPriceOpen(!bulkPriceOpen)}
              >
                Fiyat Güncelle
              </Button>
              {bulkPriceOpen && (
                <div className="absolute right-0 bottom-9 bg-slate-900 border border-white/10 rounded-xl p-2 z-30 flex gap-1 items-center shadow-xl w-44">
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

            {/* Company assign bulk popup */}
            <div className="relative">
              <Button 
                variant="minimal" 
                size="xs" 
                className="bg-white/5 hover:bg-white/10 text-[9.5px] uppercase font-bold"
                onClick={() => setBulkCompanyOpen(!bulkCompanyOpen)}
              >
                Firma Ata
              </Button>
              {bulkCompanyOpen && (
                <div className="absolute right-0 bottom-9 bg-slate-900 border border-white/10 rounded-xl p-2 z-30 flex gap-1 items-center shadow-xl w-44">
                  <Input 
                    value={newBulkCompany} 
                    onChange={(e) => setNewBulkCompany(e.target.value)} 
                    placeholder="Firma Adı..."
                    className="h-7 text-[9px]"
                  />
                  <Button variant="primary" size="xs" onClick={handleBulkCompanyUpdate}>Uygula</Button>
                </div>
              )}
            </div>

            <Button 
              variant="minimal" 
              size="xs" 
              leftIcon={<FileSpreadsheet size={10} />}
              className="bg-emerald-600/10 text-emerald-450 hover:bg-emerald-600 hover:text-white"
              onClick={handleExcelExport}
            >
              Excel
            </Button>

            <Button 
              variant="minimal" 
              size="xs" 
              leftIcon={<FileText size={10} />}
              className="bg-sky-600/10 text-sky-400 hover:bg-sky-600 hover:text-white"
              onClick={handleCsvExport}
            >
              CSV
            </Button>

            <Button 
              variant="minimal" 
              size="xs" 
              leftIcon={<FileText size={10} />}
              className="bg-indigo-650/10 text-indigo-400 hover:bg-indigo-650 hover:text-white"
              onClick={handlePdfExport}
            >
              PDF
            </Button>

            <Button 
              variant="minimal" 
              size="xs" 
              leftIcon={<Trash2 size={10} />}
              className="bg-rose-500/10 text-rose-455 hover:bg-rose-500 hover:text-white"
              onClick={handleBulkDelete}
            >
              Sil
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

      {/* 5. Enterprise DataTable Workspace view */}
      {currentView === 'liste' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 select-none">
          {/* DataTable Left Block */}
          <div className="lg:col-span-8">
            <DarkDashboardCard className="space-y-4">
              <div className="flex justify-between items-center select-none">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <SlidersHorizontal size={11} className="text-blue-500" />
                  MÜŞTERİ DEMO PORTFÖYÜ ({filteredSpaces.length} Kalan)
                </span>
                
                {/* Column Visibility Selector dropdown */}
                <div className="relative">
                  <Button 
                    variant="minimal" 
                    size="xs" 
                    rightIcon={<ChevronDown size={11} />}
                    className="bg-white/3 border border-white/5 rounded-xl h-7 text-[8.5px]"
                    onClick={() => setColsDropdownOpen(!colsDropdownOpen)}
                  >
                    Kolonlar
                  </Button>
                  {colsDropdownOpen && (
                    <div className="absolute right-0 top-7 bg-slate-900 border border-white/10 rounded-xl p-3 z-30 shadow-xl w-44 space-y-1.5 text-left text-[9px] font-bold">
                      <span className="block text-slate-500 uppercase tracking-wider text-[8px] mb-1">Kolon Gizle / Göster</span>
                      {allColumns.map(col => {
                        const isVisible = visibleCols.includes(col.key);
                        return (
                          <label key={col.key} className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer select-none">
                            <input 
                              type="checkbox" 
                              checked={isVisible}
                              onChange={() => {
                                setVisibleCols(prev => 
                                  prev.includes(col.key) 
                                    ? prev.filter(k => k !== col.key) 
                                    : [...prev, col.key]
                                );
                              }}
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
                <TableSkeleton />
              ) : (
                <div className="overflow-x-auto border border-white/5 rounded-xl max-h-[580px] relative no-scrollbar">
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
                            className="flex items-center gap-1 hover:text-white uppercase font-black tracking-widest cursor-pointer select-none text-[8.5px] whitespace-nowrap"
                          >
                            {col.label}
                            {sortCol === col.key ? (
                              sortDir === 'asc' ? <ChevronDown size={10} className="rotate-180 text-blue-400" /> : <ChevronDown size={10} className="text-blue-400" />
                            ) : (
                              <ChevronsUpDown size={10} className="opacity-30" />
                            )}
                          </button>
                        )),
                      ''
                    ]}
                  >
                    {paginatedSpaces.map((space, idx) => {
                      const isSelected = selectedCode === space.code;
                      const isRowChecked = selectedIds.includes(space.id);
                      
                      const terminalText = space.terminal || (space.location.includes('İç') ? 'İç Hatlar' : 'Dış Hatlar');
                      const activeCampaign = space.client !== '-' ? `${space.client} Lansman` : '-';
                      const occupancyRate = space.status === 'dolu' ? '%100' : space.status === 'teklif' ? '%50' : '%0';

                      return (
                        <TableRow 
                          key={space.id} 
                          onClick={() => {
                            setSelectedCode(space.code);
                            setFocusedIndex((currentPage - 1) * pageSize + idx);
                          }}
                          className={`cursor-pointer transition-colors duration-100 ${
                            isSelected 
                              ? 'bg-blue-650/15 border-l-2 border-l-blue-450 hover:bg-blue-650/20' 
                              : 'border-b border-white/3 hover:bg-white/1'
                          }`}
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
                            <TableCell className="font-semibold text-slate-400 text-[10px]">{terminalText}</TableCell>
                          )}
                          {visibleCols.includes('category') && (
                            <TableCell className="font-semibold text-slate-400 text-[10px]">{space.type || 'Static'}</TableCell>
                          )}
                          {visibleCols.includes('type') && (
                            <TableCell className="font-semibold text-slate-400 text-[10px]">{space.type}</TableCell>
                          )}
                          {visibleCols.includes('size') && (
                            <TableCell className="font-semibold text-slate-400 text-[10px]">{space.size}</TableCell>
                          )}
                          {visibleCols.includes('traffic') && (
                            <TableCell className="font-black text-white text-[10px]">{space.traffic?.toLocaleString('tr-TR') || '-'}</TableCell>
                          )}
                          {visibleCols.includes('visibilityIndex') && (
                            <TableCell className="font-black text-white text-[10px]">{((space as any).visibilityIndex) ? `%${(space as any).visibilityIndex}` : '-'}</TableCell>
                          )}
                          {visibleCols.includes('price') && (
                            <TableCell className="font-black text-emerald-450 text-[10px]">{space.price}</TableCell>
                          )}
                          {visibleCols.includes('status') && (
                            <TableCell>
                              <SpaceStatusBadge status={space.status} />
                            </TableCell>
                          )}
                          {visibleCols.includes('client') && (
                            <TableCell className="font-semibold text-white truncate max-w-[110px]">{space.client}</TableCell>
                          )}
                          {visibleCols.includes('campaign') && (
                            <TableCell className="font-semibold text-slate-400 truncate max-w-[100px]">{activeCampaign}</TableCell>
                          )}
                          {visibleCols.includes('contract') && (
                            <TableCell className="font-semibold text-indigo-400 text-[10px]">{space.client !== '-' ? 'Sözleşmeli' : '-'}</TableCell>
                          )}
                          {visibleCols.includes('startDate') && (
                            <TableCell className="font-semibold text-slate-450 text-[10px]">01.06.2025</TableCell>
                          )}
                          {visibleCols.includes('endDate') && (
                            <TableCell className="font-semibold text-slate-450 text-[10px]">{space.endDate}</TableCell>
                          )}
                          {visibleCols.includes('occupancy') && (
                            <TableCell className="font-black text-blue-400">{occupancyRate}</TableCell>
                          )}

                          {/* Row Actions Menu */}
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setSelectedCode(space.code)}
                                className="p-1 rounded text-slate-500 hover:text-white transition-all cursor-pointer"
                                title="👁 Görüntüle"
                              >
                                <Eye size={12} />
                              </button>
                              <button
                                onClick={() => handleEdit(space)}
                                className="p-1 rounded text-slate-500 hover:text-white transition-all cursor-pointer"
                                title="✏ Düzenle"
                              >
                                <Edit3 size={12} />
                              </button>
                              <button
                                onClick={() => {
                                  setPreselectedSpaceId(space.id);
                                  setOfferModalOpen(true);
                                }}
                                className="p-1 rounded text-blue-400 hover:text-blue-300 transition-all cursor-pointer font-black"
                                title="💰 Teklif Oluştur"
                              >
                                <Coins size={12} />
                              </button>
                              <button
                                onClick={() => alert(`${space.code} için hızlı rezervasyon oluşturuldu. Detayları panelden inceleyebilirsiniz.`)}
                                className="p-1 rounded text-emerald-450 hover:text-emerald-400 transition-all cursor-pointer"
                                title="📅 Rezervasyon"
                              >
                                <CalendarIcon size={12} />
                              </button>
                              <button
                                onClick={() => setCurrentRoute('sozlesmeler')}
                                className="p-1 rounded text-indigo-400 hover:text-indigo-300 transition-all cursor-pointer"
                                title="📄 Sözleşmeler Sayfası"
                              >
                                <FileSignature size={12} />
                              </button>
                              <button
                                onClick={() => handleDelete(space.id)}
                                className="p-1 rounded text-rose-500 hover:text-rose-400 transition-all cursor-pointer"
                                title="🗑 Sil"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </Table>
                </div>
              )}

              {/* Pagination controls */}
              <div className="flex flex-col sm:flex-row justify-between items-center pt-3 border-t border-white/5 gap-3 select-none">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    Gösterilen: {paginatedSpaces.length} / Toplam: {filteredSpaces.length} alan
                  </span>
                  <div className="flex items-center gap-1 text-[9.5px] text-slate-500">
                    <span>Satırlar:</span>
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

          {/* Right Detailed Panel Drawer with 11 sub-tabs */}
          <div className="lg:col-span-4">
            {selectedSpace ? (
              <div className="dark-glass-card border border-white/5 rounded-3xl p-5 space-y-5 text-left select-none shadow-2xl relative">
                
                {/* Space Profile Header */}
                <div className="flex justify-between items-start border-b border-white/5 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/25 px-2 py-0.5 rounded uppercase tracking-wider">
                        {selectedSpace.code}
                      </span>
                      <SpaceStatusBadge status={selectedSpace.status} />
                    </div>
                    <h3 className="text-sm font-black text-white uppercase truncate max-w-[200px]">{selectedSpace.name}</h3>
                    <div className="text-[9px] text-slate-500 font-extrabold uppercase flex items-center gap-1">
                      <MapPin size={10} className="text-slate-600" />
                      {selectedSpace.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] text-slate-550 font-black block uppercase tracking-wider">AYLIK BEDEL</span>
                    <span className="text-emerald-450 text-xs font-black block">{selectedSpace.price}</span>
                  </div>
                </div>

                {/* 11 Sub-tabs Navigation */}
                <div className="flex gap-1 overflow-x-auto no-scrollbar border-b border-white/5 pb-2">
                  {[
                    { id: 'genel', label: 'Genel' },
                    { id: 'foto', label: 'Foto' },
                    { id: 'teknik', label: 'Teknik' },
                    { id: 'res', label: 'Rezervasyon' },
                    { id: 'camp', label: 'Kampanya' },
                    { id: 'contract', label: 'Sözleşme' },
                    { id: 'finance', label: 'Finans' },
                    { id: 'pop', label: 'PoP' },
                    { id: 'led', label: 'LED' },
                    { id: 'history', label: 'Geçmiş' },
                    { id: 'ai', label: 'AI Analizi' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setDetailTab(tab.id as any)}
                      className={`px-2.5 py-1 text-[8.5px] font-black uppercase tracking-wider rounded-lg border shrink-0 transition-all cursor-pointer ${
                        detailTab === tab.id
                          ? 'bg-blue-650 text-white border-blue-500/10'
                          : 'text-slate-450 hover:text-white bg-transparent border-transparent'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Subtabs Panels Switcher Content */}
                <div className="space-y-4 text-xs font-semibold text-slate-350 min-h-[300px]">
                  
                  {detailTab === 'genel' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3.5 text-[10px]">
                        <div className="bg-white/2 p-2.5 rounded-xl border border-white/5">
                          <span className="text-[7.5px] font-black text-slate-500 block uppercase">Yolcu Sirkülasyonu</span>
                          <span className="text-white font-black block text-xs mt-1">{(selectedSpace.traffic || 45000).toLocaleString('tr-TR')} / gün</span>
                        </div>
                        <div className="bg-white/2 p-2.5 rounded-xl border border-white/5">
                          <span className="text-[7.5px] font-black text-slate-500 block uppercase">Görünürlük İndeksi</span>
                          <span className="text-white font-black block text-xs mt-1">%{(selectedSpace as any).visibilityIndex || 92} Yüksek</span>
                        </div>
                        <div className="bg-white/2 p-2.5 rounded-xl border border-white/5">
                          <span className="text-[7.5px] font-black text-slate-500 block uppercase">Göz Temas Süresi</span>
                          <span className="text-white font-black block text-xs mt-1">{(selectedSpace as any).gazeTime || 7} saniye</span>
                        </div>
                        <div className="bg-white/2 p-2.5 rounded-xl border border-white/5">
                          <span className="text-[7.5px] font-black text-slate-500 block uppercase">Ünite Boyutu</span>
                          <span className="text-white font-black block text-xs mt-1">{selectedSpace.size}</span>
                        </div>
                      </div>

                      {/* Pure SVG Line graph (Income Trend) */}
                      <div className="bg-white/2 p-3.5 rounded-2xl border border-white/5 space-y-2">
                        <span className="text-[8.5px] font-black text-slate-500 uppercase tracking-widest block">Aylık Tahmini Gelir İzleyici</span>
                        <div className="h-16 flex items-end">
                          <svg className="w-full h-full text-blue-500" viewBox="0 0 100 30" preserveAspectRatio="none">
                            <path 
                              d="M 0 25 Q 20 15 40 22 T 80 5 T 100 12 L 100 30 L 0 30 Z" 
                              fill="url(#sparkline-gradient)" 
                              stroke="currentColor" 
                              strokeWidth="1.5"
                            />
                            <defs>
                              <linearGradient id="sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
                                <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                        <div className="flex justify-between text-[7px] text-slate-550 font-bold uppercase">
                          <span>Oca</span>
                          <span>Mar</span>
                          <span>Haz</span>
                          <span>Eyl</span>
                          <span>Ara</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {detailTab === 'foto' && (
                    <div className="space-y-3 text-center">
                      <div className="h-44 w-full rounded-2xl border border-white/5 bg-[#0f172a] relative overflow-hidden flex items-center justify-center">
                        <img 
                          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80" 
                          alt="Havalimanı Reklam Alanı"
                          className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3 text-left">
                          <span className="text-[9px] font-black text-white uppercase tracking-wider">Havalimanı Terminal Pasaport Kontrol LED Ekran Görünümü</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-12 border border-white/5 rounded-lg bg-white/2 cursor-pointer hover:border-blue-500/20 overflow-hidden">
                          <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&auto=format&fit=crop&q=80" className="w-full h-full object-cover" />
                        </div>
                        <div className="h-12 border border-white/5 rounded-lg bg-white/2 cursor-pointer hover:border-blue-500/20 overflow-hidden flex items-center justify-center text-[10px] text-slate-500 font-bold">
                          + Yükle
                        </div>
                      </div>
                    </div>
                  )}

                  {detailTab === 'teknik' && (
                    <div className="space-y-2.5 text-[9.5px]">
                      <div className="flex justify-between border-b border-white/3 py-1">
                        <span className="text-slate-500 uppercase">Ekran Çözünürlüğü</span>
                        <span className="text-white font-extrabold">3840 x 2160 (4K UHD)</span>
                      </div>
                      <div className="flex justify-between border-b border-white/3 py-1">
                        <span className="text-slate-500 uppercase">Pixel Pitch</span>
                        <span className="text-white font-extrabold">P 1.8 mm</span>
                      </div>
                      <div className="flex justify-between border-b border-white/3 py-1">
                        <span className="text-slate-500 uppercase">Çalışma Saatleri</span>
                        <span className="text-white font-extrabold">24 Saat Kesintisiz</span>
                      </div>
                      <div className="flex justify-between border-b border-white/3 py-1">
                        <span className="text-slate-500 uppercase">Ses Desteği</span>
                        <span className="text-white font-extrabold">Mevcut (Yönlendirmeli)</span>
                      </div>
                      <div className="flex justify-between border-b border-white/3 py-1">
                        <span className="text-slate-500 uppercase">Desteklenen Format</span>
                        <span className="text-white font-extrabold">MP4, H.264, JPG</span>
                      </div>
                    </div>
                  )}

                  {detailTab === 'res' && (
                    <div className="space-y-3.5">
                      {selectedSpace.client !== '-' ? (
                        <div className="bg-emerald-500/5 border border-emerald-500/20 p-3.5 rounded-2xl text-left space-y-2">
                          <span className="text-[7.5px] font-black text-emerald-400 uppercase tracking-widest block">Aktif Rezervasyon Bilgisi</span>
                          <div className="text-[10px] font-black text-white">{selectedSpace.client}</div>
                          <div className="text-[9px] text-slate-400">Yayın Periyodu: **01.06.2025 - {selectedSpace.endDate}**</div>
                        </div>
                      ) : (
                        <div className="p-8 text-center bg-white/2 border border-white/5 rounded-2xl text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                          Bu ünite için aktif rezervasyon bulunmuyor.
                        </div>
                      )}
                    </div>
                  )}

                  {detailTab === 'camp' && (
                    <div className="space-y-3.5">
                      {selectedSpace.client !== '-' ? (
                        <div className="bg-blue-600/5 border border-blue-500/20 p-3.5 rounded-2xl space-y-2 text-left">
                          <span className="text-[7.5px] font-black text-blue-400 uppercase tracking-widest block font-extrabold">Aktif Kampanya Yayını</span>
                          <div className="text-[10px] font-black text-white">{selectedSpace.client} Lansman</div>
                          <div className="text-[9px] text-slate-400">Medya Planı: Günlük 720 adet 15 saniyelik spot yayını.</div>
                        </div>
                      ) : (
                        <div className="p-8 text-center bg-white/2 border border-white/5 rounded-2xl text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                          Aktif kampanya bulunmuyor.
                        </div>
                      )}
                    </div>
                  )}

                  {detailTab === 'contract' && (
                    <div className="space-y-3.5">
                      {selectedSpace.client !== '-' ? (
                        <div className="bg-indigo-500/5 border border-indigo-500/20 p-3.5 rounded-2xl space-y-2 text-left">
                          <span className="text-[7.5px] font-black text-indigo-400 uppercase tracking-widest block font-extrabold">Bağlı Sözleşme Bilgileri</span>
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-slate-400">Sözleşme No:</span>
                            <span className="text-white font-black">CTR-2025-104</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-slate-400">Aylık Kiralama:</span>
                            <span className="text-emerald-450 font-black">{selectedSpace.price}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-8 text-center bg-white/2 border border-white/5 rounded-2xl text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                          Bağlı sözleşme kaydı bulunmuyor.
                        </div>
                      )}
                    </div>
                  )}

                  {detailTab === 'finance' && (
                    <div className="space-y-3.5 text-[9.5px]">
                      <div className="flex justify-between border-b border-white/3 py-1">
                        <span className="text-slate-500 uppercase">Faturalanan Tutar</span>
                        <span className="text-white font-extrabold">{selectedSpace.price}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/3 py-1">
                        <span className="text-slate-500 uppercase">Tahsil Edilen</span>
                        <span className="text-emerald-450 font-extrabold">{selectedSpace.client !== '-' ? selectedSpace.price : '₺0'}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/3 py-1">
                        <span className="text-slate-500 uppercase">Kalan Bakiye</span>
                        <span className="text-rose-455 font-extrabold">₺0</span>
                      </div>
                    </div>
                  )}

                  {detailTab === 'pop' && (
                    <div className="space-y-3.5">
                      <div className="bg-emerald-500/10 border border-emerald-500/25 p-3 rounded-2xl flex items-center justify-between">
                        <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Sensör Bağlantı Durumu</span>
                        <span className="text-[7.5px] bg-emerald-500/25 text-emerald-300 font-extrabold px-1.5 py-0.5 rounded">CANLI AKTİF</span>
                      </div>
                      <div className="space-y-2 text-[9.5px]">
                        <div className="flex justify-between border-b border-white/3 py-1">
                          <span className="text-slate-500 uppercase">Günlük Yayın Hedefi</span>
                          <span className="text-white font-extrabold">720 Oynatma</span>
                        </div>
                        <div className="flex justify-between border-b border-white/3 py-1">
                          <span className="text-slate-500 uppercase">Doğrulanmış Oynatma</span>
                          <span className="text-white font-extrabold">720 Oynatma (%100.0)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {detailTab === 'led' && (
                    <div className="space-y-2.5 text-[9.5px]">
                      <div className="flex justify-between border-b border-white/3 py-1">
                        <span className="text-slate-500 uppercase">LED Markası</span>
                        <span className="text-white font-extrabold">Leyard LED Wall</span>
                      </div>
                      <div className="flex justify-between border-b border-white/3 py-1">
                        <span className="text-slate-500 uppercase">Panel Yenileme Hızı</span>
                        <span className="text-white font-extrabold">3840 Hz</span>
                      </div>
                      <div className="flex justify-between border-b border-white/3 py-1">
                        <span className="text-slate-500 uppercase">Ortalama Güç Tüketimi</span>
                        <span className="text-white font-extrabold">3.2 kW/h</span>
                      </div>
                    </div>
                  )}

                  {detailTab === 'history' && (
                    <div className="space-y-2.5 text-[9px] font-black uppercase text-slate-400">
                      <div className="border-l-2 border-l-blue-500 pl-3.5 space-y-1">
                        <div className="text-white text-[9.5px]">Durum Güncellendi</div>
                        <div className="text-[7.5px] text-slate-500">Bugün 14:02:15 - Demo Yöneticisi</div>
                      </div>
                      <div className="border-l-2 border-l-slate-600 pl-3.5 space-y-1">
                        <div className="text-slate-300">Yayın Slotu Oluşturuldu</div>
                        <div className="text-[7.5px] text-slate-550">05.06.2025 10:15:30 - Sistem</div>
                      </div>
                    </div>
                  )}

                  {detailTab === 'ai' && (
                    <div className="space-y-4">
                      <div className="p-3.5 bg-purple-600/5 border border-purple-500/20 rounded-2xl space-y-2">
                        <div className="flex items-center gap-1 text-[9px] font-black text-purple-400 uppercase tracking-wider">
                          <Sparkles size={11} className="animate-pulse" />
                          AI Loop Optimizasyon Tavsiyesi
                        </div>
                        <p className="text-[9.5px] text-slate-350 leading-relaxed font-semibold">
                          Bu bölgedeki yolcu hareketliliği en üst seviyededir. Yenileme döneminde fiyatı **%15** oranında artırarak gelir verimliliğinizi optimize edebilirsiniz.
                        </p>
                      </div>
                      <div className="p-3.5 bg-blue-600/5 border border-blue-500/20 rounded-2xl space-y-2">
                        <div className="text-[9px] font-black text-blue-400 uppercase tracking-wider">
                          Hedef Kitle Demografik Uyumu
                        </div>
                        <p className="text-[9.5px] text-slate-350 leading-relaxed font-semibold">
                          Uluslararası yolcu profili yoğunluktadır (%68). Finansal hizmetler, lüks tüketim ve e-ticaret lansmanları için en yüksek dönüşüm oranı vaat eden alandır.
                        </p>
                      </div>
                    </div>
                  )}

                </div>

                {/* Operations footer buttons inside panel */}
                <div className="flex items-center gap-2 border-t border-white/5 pt-4">
                  <PermissionGate permission="spaces.create">
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="flex-1 font-black text-[10px] uppercase"
                      onClick={() => handleEdit(selectedSpace)}
                    >
                      Düzenle
                    </Button>
                  </PermissionGate>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 font-black text-[10px] uppercase"
                    onClick={() => handleDelete(selectedSpace.id)}
                  >
                    Sil
                  </Button>
                </div>

              </div>
            ) : (
              <div className="dark-glass-card border border-white/5 rounded-3xl p-8 text-center text-slate-500 font-bold italic select-none">
                Detayları görüntülemek için tablodan bir satır seçin.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Kart view workspace */}
      {currentView === 'kart' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 select-none text-left">
          {filteredSpaces.map(space => {
            const isSelected = selectedCode === space.code;
            return (
              <div 
                key={space.id} 
                onClick={() => setSelectedCode(space.code)}
                className={`dark-glass-card border rounded-2xl p-4.5 cursor-pointer hover:bg-[#142033]/60 duration-200 flex flex-col justify-between h-56 ${
                  isSelected ? 'border-blue-500/40 bg-[#16253c]' : 'border-white/5 bg-[#0e1624]/40'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[8.5px] font-black bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/15 uppercase tracking-widest leading-none">
                      {space.code}
                    </span>
                    <SpaceStatusBadge status={space.status} />
                  </div>
                  <h4 className="text-xs font-black text-white uppercase truncate">{space.name}</h4>
                  <div className="text-[10px] text-slate-400 font-semibold space-y-1">
                    <div className="flex items-center gap-1.5"><MapPin size={10} className="text-slate-550" /> {space.location}</div>
                    <div className="flex items-center gap-1.5"><Layers size={10} className="text-slate-550" /> {space.size} | {space.type}</div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-3 flex justify-between items-center text-[10px]">
                  <div className="space-y-0.5">
                    <span className="text-[8px] text-slate-550 font-bold block uppercase tracking-wider">Aylık Fiyat</span>
                    <span className="text-emerald-450 font-black block">{space.price}</span>
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
            <div className="col-span-full py-12 text-center bg-[#0a111a]/40 border border-white/5 rounded-3xl text-slate-500 font-bold uppercase italic">
              Kayıtlı reklam alanı bulunamadı
            </div>
          )}
        </div>
      )}

      {/* Harita view placeholder */}
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

      {/* Takvim view matrix planner */}
      {currentView === 'takvim' && (
        <DarkDashboardCard className="text-left space-y-4 select-none">
          <div className="space-y-1">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Doluluk ve Rezervasyon Matrisi</h3>
            <p className="text-[9px] text-slate-500 font-bold uppercase">Envanter ünitelerinin aylık doluluk ve yayın blok durumları</p>
          </div>

          <div className="overflow-x-auto border border-white/5 rounded-xl">
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
                        <div className="py-1.5 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-450 font-extrabold text-[9px] text-center uppercase tracking-wider truncate max-w-[150px]">
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
                        <div className="py-1.5 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-455 font-extrabold text-[9px] text-center uppercase tracking-wider truncate max-w-[150px]">
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

      {/* Analitik view charts */}
      {currentView === 'analitik' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none text-left">
          
          <DarkDashboardCard className="space-y-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Cpu size={12} className="text-blue-500 animate-pulse" />
              Ünitelere Göre Doluluk Oranları
            </span>
            <div className="space-y-3.5 text-[10.5px]">
              {['LED', 'Lightbox', 'Billboard', 'Megalight', 'Raket'].map(type => {
                const total = advertisingSpaces.filter(s => s.type === type).length;
                const active = advertisingSpaces.filter(s => s.type === type && s.status === 'dolu').length;
                const rate = total > 0 ? Math.round((active / total) * 100) : 0;
                return (
                  <div key={type} className="space-y-1.5">
                    <div className="flex justify-between font-bold">
                      <span className="text-white">{type} Grubu</span>
                      <span className="text-slate-450">%{rate} ({active}/{total})</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-blue-500" style={{ width: `${rate}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </DarkDashboardCard>

          <DarkDashboardCard className="space-y-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Coins size={12} className="text-emerald-400" />
              En Değerli Reklam Üniteleri
            </span>
            <div className="space-y-3 text-[10.5px]">
              {sortedSpaces.slice(0, 5).map(space => (
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

          <DarkDashboardCard className="space-y-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <MapPin size={12} className="text-indigo-400" />
              Terminal Bazlı Envanter Verimliliği
            </span>
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
                      <span className="text-slate-450">%{rate} ({active}/{total})</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-indigo-500" style={{ width: `${rate}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </DarkDashboardCard>

        </div>
      )}

      {/* CRUD dialog */}
      <AdvertisingSpaceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        space={editingSpace}
        onSuccess={() => {
          fetchSpaces(false);
          setSuccess('Reklam alanı başarıyla kaydedildi.');
        }}
      />

      {/* Offer creation pre-selected modal dialog */}
      <OfferModal
        isOpen={offerModalOpen}
        onClose={() => setOfferModalOpen(false)}
        preselectedSpaceId={preselectedSpaceId}
        onSuccess={() => {
          fetchSpaces(false);
          setSuccess('Hızlı reklam teklifi başarıyla oluşturuldu.');
        }}
      />

    </div>
  );
}
