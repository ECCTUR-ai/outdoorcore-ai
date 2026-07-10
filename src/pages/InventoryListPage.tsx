import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  DownloadCloud, 
  UploadCloud,
  Search, 
  MapPin, 
  CheckSquare, 
  Circle, 
  FileText, 
  Wrench,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Edit3,
  Sparkles,
  TrendingUp,
  Coins,
  Check,
  Tv,
  AlertTriangle
} from 'lucide-react';
import { AdvertisingSpace } from '@/data/advertisingSpaces';
import { spaceRepository } from '@/repositories';
import { DarkKpiCard } from '@/components/design-system/DarkKpiCard';
import { AdvertisingSpaceModal } from '@/components/design-system/AdvertisingSpaceModal';
import { AdvertisingSpaceDetailPanel } from '@/components/design-system/AdvertisingSpaceDetailPanel';
import { SpaceStatusBadge } from '@/components/design-system/SpaceStatusBadge';
import { Input, Select, FormGroup, Label } from '@/components/design-system/Form';
import { Button } from '@/components/design-system/Button';
import { Table, TableRow, TableCell } from '@/components/design-system/Table';
import { PermissionGate } from '@/components/design-system/PermissionGate';
import { TableSkeleton } from '@/components/design-system/Skeleton';
import { Notification } from '@/components/design-system/Notification';
import { useApp } from '@/context/AppContext';
import { 
  normalizeMediaType, 
  getSpaceAdetAndFace, 
  isSpaceInFilter 
} from '@/utils/mediaTypeHelper';

interface InventoryListPageProps {
  title: string;
  subtitle: string;
  mediaTypeFilter: string[];
  categoryType: 'all' | 'digital' | 'led' | 'static' | 'lightbox' | 'duratrans' | 'megalight' | 'foil' | 'panel' | 'special' | 'stand' | 'sponsorship';
  columns: string[];
  defaultType?: string;
  emptyState?: string;
  icon?: React.ReactNode;
}

export function InventoryListPage({
  title,
  subtitle,
  mediaTypeFilter,
  categoryType,
  columns,
  defaultType,
  emptyState,
  icon
}: InventoryListPageProps) {
  const { setCurrentRoute } = useApp();
  const [advertisingSpaces, setAdvertisingSpaces] = useState<AdvertisingSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Navigation & Selected Space
  const [selectedCode, setSelectedCode] = useState<string>('');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [terminalFilter, setTerminalFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortCol, setSortCol] = useState<keyof AdvertisingSpace>('code');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  
  // Selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState<AdvertisingSpace | undefined>(undefined);
  
  // Bulk operations states
  const [bulkStatusOpen, setBulkStatusOpen] = useState(false);
  const [bulkPriceOpen, setBulkPriceOpen] = useState(false);
  const [newBulkStatus, setNewBulkStatus] = useState<AdvertisingSpace['status']>('bos');
  const [newBulkPrice, setNewBulkPrice] = useState('');

  // Load spaces
  const fetchSpaces = async (selectFirst = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await spaceRepository.list();
      setAdvertisingSpaces(data);
      
      // Filter list of spaces to check if selected code is in this category
      const visibleData = data.filter(s => isSpaceInFilter(s, mediaTypeFilter));
      if (visibleData.length > 0) {
        if (selectFirst || !selectedCode || !visibleData.some(s => s.code === selectedCode)) {
          setSelectedCode(visibleData[0].code);
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

    const handleUpdateEvent = () => {
      fetchSpaces(false);
    };

    window.addEventListener('spaces_updated', handleUpdateEvent);
    window.addEventListener('storage', handleUpdateEvent);
    return () => {
      window.removeEventListener('spaces_updated', handleUpdateEvent);
      window.removeEventListener('storage', handleUpdateEvent);
    };
  }, [JSON.stringify(mediaTypeFilter)]);

  // Selected space model lookup
  const selectedSpace = useMemo(() => {
    const visibleData = advertisingSpaces.filter(s => isSpaceInFilter(s, mediaTypeFilter));
    return visibleData.find(s => s.code === selectedCode) || visibleData[0];
  }, [advertisingSpaces, selectedCode, mediaTypeFilter]);

  // Dynamic calculations for KPI cards based on categoryType
  const kpiMetrics = useMemo(() => {
    const allMatching = advertisingSpaces.filter(s => isSpaceInFilter(s, mediaTypeFilter));
    const total = allMatching.length;
    const active = allMatching.filter(s => s.status === 'dolu').length;
    
    // Counts for All page
    const digitalCount = advertisingSpaces.filter(s => 
      isSpaceInFilter(s, ["LED", "DIGITAL", "DIGITAL_SCREEN", "LED_SCREEN", "DIGITAL_NETWORK"])
    ).length;
    const staticCount = advertisingSpaces.filter(s => 
      isSpaceInFilter(s, ["LIGHTBOX", "DURATRANS", "MEGALIGHT", "FOIL", "STATIC_PANEL", "STATIC"])
    ).length;
    const specialCount = advertisingSpaces.filter(s => 
      isSpaceInFilter(s, ["STAND", "POPUP", "EXPERIENCE_AREA", "SPONSORSHIP", "AREA_SPONSORSHIP"])
    ).length;

    // Sums of Adet and Face
    let totalAdet = 0;
    let totalFace = 0;
    allMatching.forEach(s => {
      const { adet, face } = getSpaceAdetAndFace(s);
      totalAdet += adet;
      totalFace += face;
    });

    return {
      total,
      active,
      digitalCount,
      staticCount,
      specialCount,
      totalAdet,
      totalFace
    };
  }, [advertisingSpaces, mediaTypeFilter]);

  // Advanced Filtration matching
  const filteredSpaces = useMemo(() => {
    return advertisingSpaces
      .filter(s => isSpaceInFilter(s, mediaTypeFilter))
      .filter(space => {
        const matchesSearch = searchQuery === '' || 
                              space.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              space.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              space.location.toLowerCase().includes(searchQuery.toLowerCase());
        
        const term = space.terminal || (space.location.includes('İç') ? 'İç Hatlar' : 'Dış Hatlar');
        const matchesTerminal = terminalFilter === '' || term.includes(terminalFilter);
        const matchesStatus = statusFilter === '' || space.status === statusFilter;
        
        // Match specific sub-type filter dropdown
        const matchesType = typeFilter === '' || space.type === typeFilter || normalizeMediaType(space.type) === typeFilter;

        return matchesSearch && matchesTerminal && matchesStatus && matchesType;
      });
  }, [advertisingSpaces, mediaTypeFilter, searchQuery, terminalFilter, statusFilter, typeFilter]);

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

  // Headers sort toggle
  const handleSort = (col: string) => {
    const spaceCol = col as keyof AdvertisingSpace;
    if (sortCol === spaceCol) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(spaceCol);
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
    setTypeFilter('');
    setStatusFilter('');
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

  // Create Button Text
  const getCreateButtonText = () => {
    if (categoryType === 'all') return 'Yeni Alan Ekle';
    if (categoryType === 'digital') return 'Yeni Dijital Ekran Ekle';
    return `Yeni ${title} Ekle`;
  };

  // Dynamic Type Filter Options based on Category Type
  const getTypeFilterOptions = () => {
    if (categoryType === 'all') {
      return (
        <>
          <option value="LED">LED Ekran</option>
          <option value="LIGHTBOX">Lightbox</option>
          <option value="DURATRANS">Duratrans</option>
          <option value="MEGALIGHT">Megalight</option>
          <option value="FOIL">Folyo Alanı</option>
          <option value="STATIC_PANEL">Statik Pano</option>
          <option value="STAND">Stand Alanı</option>
          <option value="SPONSORSHIP">Sponsorluk Alanı</option>
        </>
      );
    }
    if (categoryType === 'digital') {
      return (
        <>
          <option value="LED">LED Ekran</option>
          <option value="Digital CLP">Dijital CLP</option>
        </>
      );
    }
    if (categoryType === 'static') {
      return (
        <>
          <option value="LIGHTBOX">Lightbox</option>
          <option value="DURATRANS">Duratrans</option>
          <option value="MEGALIGHT">Megalight</option>
          <option value="FOIL">Folyo</option>
          <option value="STATIC_PANEL">Statik Pano</option>
        </>
      );
    }
    if (categoryType === 'special') {
      return (
        <>
          <option value="STAND">Stand Alanı</option>
          <option value="SPONSORSHIP">Sponsorluk Alanı</option>
        </>
      );
    }
    return null;
  };

  // Dynamic columns header mapping
  const renderColumnHeader = (colKey: string): React.ReactNode => {
    const headerMapping: Record<string, string> = {
      'code': 'Kod',
      'name': categoryType.startsWith('special') ? 'Alan Adı' : 'Reklam Alanı',
      'terminal': 'Terminal / Bölge',
      'size': categoryType.startsWith('special') ? 'Ölçü / m²' : 'Ölçü',
      'adet': categoryType.startsWith('digital') ? 'Ekran Adedi' : 'Adet',
      'face': 'Face',
      'media_type': 'Ekran Türü',
      'category': 'Kategori',
      'type': 'Tür',
      'network': 'Network',
      'client': categoryType.startsWith('special') ? 'Aktif Firma' : 'Firma',
      'status': categoryType.startsWith('special') ? 'Kullanım Durumu' : 'Durum',
      'actions': 'İşlemler'
    };

    const label = headerMapping[colKey] || colKey;
    const canSort = ['code', 'name', 'terminal', 'size', 'status', 'price'].includes(colKey);

    if (canSort) {
      return (
        <span 
          onClick={(e) => { e.stopPropagation(); handleSort(colKey); }}
          className="cursor-pointer select-none hover:text-white transition-colors flex items-center gap-1.5"
        >
          {label}
          {sortCol === colKey && (
            <span className="text-blue-400">{sortDir === 'asc' ? '↑' : '↓'}</span>
          )}
        </span>
      );
    }

    return label;
  };

  // Dynamic row cell mapping
  const renderRowCell = (space: AdvertisingSpace, colKey: string) => {
    const { adet, face } = getSpaceAdetAndFace(space);
    
    switch (colKey) {
      case 'code':
        return (
          <TableCell key={colKey} className="font-mono text-slate-300 font-extrabold text-[9px]">
            {space.code}
          </TableCell>
        );
      case 'name':
        return (
          <TableCell key={colKey} className="font-extrabold text-white text-[10px] max-w-[200px] truncate" title={space.name}>
            {space.name}
          </TableCell>
        );
      case 'terminal':
        return (
          <TableCell key={colKey} className="text-slate-400 font-bold text-[9.5px]">
            {space.terminal || space.location || '-'}
          </TableCell>
        );
      case 'size':
        return (
          <TableCell key={colKey} className="text-slate-400 font-bold text-[9.5px]">
            {space.size}
          </TableCell>
        );
      case 'adet':
        return (
          <TableCell key={colKey} className="text-slate-400 font-bold text-[9.5px]">
            {adet}
          </TableCell>
        );
      case 'face':
        return (
          <TableCell key={colKey} className="text-slate-400 font-bold text-[9.5px]">
            {face}
          </TableCell>
        );
      case 'media_type':
        return (
          <TableCell key={colKey}>
            <span className="text-[8.5px] font-black bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/10 uppercase tracking-widest leading-none">
              {normalizeMediaType(space.type)}
            </span>
          </TableCell>
        );
      case 'category':
        return (
          <TableCell key={colKey} className="text-slate-400 font-bold text-[9.5px]">
            {space.type || '-'}
          </TableCell>
        );
      case 'type':
        return (
          <TableCell key={colKey} className="text-slate-400 font-bold text-[9.5px]">
            {space.type || '-'}
          </TableCell>
        );
      case 'network':
        const displayNetwork = space.networkName || (space.networkId === 'saw-airport' ? 'SAW Airport Network' : space.networkId === 'outdoor-istanbul' ? 'Outdoor İstanbul Network' : '-');
        const networkBadge = categoryType === 'led' 
          ? (space.networkId === 'outdoor-istanbul' ? '2 Network' : '1 Network') 
          : displayNetwork;
        return (
          <TableCell key={colKey}>
            <span className="text-[8.5px] font-black bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/10 uppercase tracking-widest leading-none">
              {networkBadge}
            </span>
          </TableCell>
        );
      case 'client':
        return (
          <TableCell key={colKey} className="text-slate-450 font-bold text-[9.5px]">
            {space.client || '-'}
          </TableCell>
        );
      case 'status':
        return (
          <TableCell key={colKey}>
            <SpaceStatusBadge status={space.status} />
          </TableCell>
        );
      case 'actions':
        return (
          <TableCell key={colKey}>
            <div className="flex items-center gap-1.5">
              <Button 
                variant="minimal" 
                size="xs" 
                onClick={(e) => { e.stopPropagation(); setSelectedCode(space.code); }}
                className="h-6.5 w-6.5 p-0 bg-white/3 hover:bg-white/7 border-white/5 rounded-lg flex items-center justify-center text-slate-400 hover:text-white"
              >
                <Eye size={11} />
              </Button>
              <PermissionGate permission="spaces.update">
                <Button 
                  variant="minimal" 
                  size="xs" 
                  onClick={(e) => { e.stopPropagation(); handleEdit(space); }}
                  className="h-6.5 w-6.5 p-0 bg-white/3 hover:bg-white/7 border-white/5 rounded-lg flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <Edit3 size={10} />
                </Button>
              </PermissionGate>
              <PermissionGate permission="spaces.delete">
                <Button 
                  variant="minimal" 
                  size="xs" 
                  onClick={(e) => { e.stopPropagation(); handleDelete(space.id); }}
                  className="h-6.5 w-6.5 p-0 bg-rose-500/5 hover:bg-rose-500/10 border-rose-500/10 rounded-lg flex items-center justify-center text-rose-500"
                >
                  <Trash2 size={10} />
                </Button>
              </PermissionGate>
            </div>
          </TableCell>
        );
      default:
        return <TableCell key={colKey}>-</TableCell>;
    }
  };

  return (
    <div className="space-y-6 select-none pb-12 text-left">
      
      {/* Sayfa Üstü (Header Actions Panel) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0a111a]/70 p-6 rounded-3xl border border-white/5 shadow-xl text-left select-none">
        <div className="space-y-1">
          <h2 className="text-base font-black text-white uppercase tracking-widest leading-none flex items-center gap-2">
            {icon}
            {title}
          </h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            {subtitle}
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
              {getCreateButtonText()}
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
            onClick={() => alert(`Envanter Excel tablosu (.xlsx) başarıyla indirildi.`)}
          >
            Dışa Aktar
          </Button>
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

      {/* KPI Cards Grid based on Category Type */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        {categoryType === 'all' ? (
          <>
            <DarkKpiCard
              title="Toplam Alan"
              value={loading ? '...' : String(kpiMetrics.total)}
              percentage="100%"
              subtext="Tüm envanter"
              icon={<MapPin size={13} />}
              iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/10"
            />
            <DarkKpiCard
              title="Dijital Ekran"
              value={loading ? '...' : String(kpiMetrics.digitalCount)}
              percentage=""
              subtext="Aktif LED / Dijital"
              icon={<Tv size={13} />}
              iconBgColor="bg-emerald-500/10 text-emerald-450 border-emerald-500/10"
              glowColor="green"
            />
            <DarkKpiCard
              title="Statik Alan"
              value={loading ? '...' : String(kpiMetrics.staticCount)}
              percentage=""
              subtext="Lightbox / CLP / Folyo"
              icon={<Circle size={13} />}
              iconBgColor="bg-sky-500/10 text-sky-400 border-sky-500/10"
              glowColor="blue"
            />
            <DarkKpiCard
              title="Özel Alan"
              value={loading ? '...' : String(kpiMetrics.specialCount)}
              percentage=""
              subtext="Stand / Sponsorluk"
              icon={<FileText size={13} />}
              iconBgColor="bg-purple-500/10 text-purple-400 border-purple-500/10"
              glowColor="purple"
            />
          </>
        ) : categoryType === 'digital' || categoryType === 'led' ? (
          <>
            <DarkKpiCard
              title="Toplam Dijital Alan"
              value={loading ? '...' : String(kpiMetrics.total)}
              percentage=""
              subtext="Dinamik yayın alanları"
              icon={<Tv size={13} />}
              iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/10"
            />
            <DarkKpiCard
              title="Toplam Ekran"
              value={loading ? '...' : String(kpiMetrics.totalAdet)}
              percentage=""
              subtext="Fiziksel ekran adedi"
              icon={<Plus size={13} />}
              iconBgColor="bg-indigo-500/10 text-indigo-400 border-indigo-500/10"
            />
            <DarkKpiCard
              title="Toplam Face"
              value={loading ? '...' : String(kpiMetrics.totalFace)}
              percentage=""
              subtext="Yayın yapılan yüzey adedi"
              icon={<Sparkles size={13} />}
              iconBgColor="bg-sky-500/10 text-sky-400 border-sky-500/10"
              glowColor="blue"
            />
            <DarkKpiCard
              title="Aktif Alan"
              value={loading ? '...' : String(kpiMetrics.active)}
              percentage=""
              subtext="Dolu dijital alanlar"
              icon={<CheckSquare size={13} />}
              iconBgColor="bg-emerald-500/10 text-emerald-450 border-emerald-500/10"
              glowColor="green"
            />
          </>
        ) : (
          <>
            <DarkKpiCard
              title={categoryType.startsWith('special') ? "Toplam Özel Alan" : "Toplam Statik Alan"}
              value={loading ? '...' : String(kpiMetrics.total)}
              percentage=""
              subtext="Fiziksel envanter adedi"
              icon={<MapPin size={13} />}
              iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/10"
            />
            <DarkKpiCard
              title="Toplam Adet"
              value={loading ? '...' : String(kpiMetrics.totalAdet)}
              percentage=""
              subtext="Ünite adedi"
              icon={<Plus size={13} />}
              iconBgColor="bg-indigo-500/10 text-indigo-400 border-indigo-500/10"
            />
            <DarkKpiCard
              title="Toplam Face"
              value={loading ? '...' : String(kpiMetrics.totalFace)}
              percentage=""
              subtext="Reklam yüzey adedi"
              icon={<Sparkles size={13} />}
              iconBgColor="bg-sky-500/10 text-sky-400 border-sky-500/10"
              glowColor="blue"
            />
            <DarkKpiCard
              title="Aktif Alan"
              value={loading ? '...' : String(kpiMetrics.active)}
              percentage=""
              subtext="Kiralık alan adedi"
              icon={<CheckSquare size={13} />}
              iconBgColor="bg-emerald-500/10 text-emerald-450 border-emerald-500/10"
              glowColor="green"
            />
          </>
        )}
      </div>

      {/* Advanced Filters Panel */}
      <div className="p-4 bg-[#0a111a]/85 border border-white/5 rounded-2xl text-left select-none space-y-3.5 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
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
              <option value="Ortak Alan">Ortak Alan</option>
            </Select>
          </FormGroup>

          {/* Render category/type dropdown filter if relevant */}
          {['all', 'digital', 'static', 'special'].includes(categoryType) && (
            <FormGroup>
              <Label htmlFor="space-type">Tür / Kategori</Label>
              <Select 
                id="space-type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-8.5 text-[10px]"
              >
                <option value="">Tümü</option>
                {getTypeFilterOptions()}
              </Select>
            </FormGroup>
          )}

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
              <option value="yakinda">Yakında</option>
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

      {/* Bulk Actions Panel */}
      {selectedIds.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-3.5 bg-blue-600/10 border border-blue-500/25 rounded-2xl text-[10px] text-left gap-3.5 select-none animate-slide-in">
          <div className="flex items-center gap-2">
            <CheckSquare size={13} className="text-blue-400 shrink-0" />
            <span className="font-extrabold text-blue-200 uppercase tracking-wider">
              {selectedIds.length} Reklam Ünitesi Seçildi
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
                    className="h-7 py-0 px-2 text-[9px] w-28 bg-slate-950"
                  >
                    <option value="bos">Boş</option>
                    <option value="dolu">Dolu</option>
                    <option value="teklif">Teklifte</option>
                    <option value="bakim">Bakımda</option>
                  </Select>
                  <Button variant="primary" size="xs" onClick={handleBulkStatusUpdate} className="h-7 py-0 px-2 text-[8px] font-black uppercase">
                    Uygula
                  </Button>
                </div>
              )}
            </div>

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
                <div className="absolute right-0 bottom-9 bg-slate-900 border border-white/10 rounded-xl p-2 z-30 flex gap-1 items-center shadow-xl">
                  <Input 
                    placeholder="Tutar girin"
                    value={newBulkPrice}
                    onChange={(e) => setNewBulkPrice(e.target.value)}
                    className="h-7 py-0 px-2 text-[9px] w-24"
                  />
                  <Button variant="primary" size="xs" onClick={handleBulkPriceUpdate} className="h-7 py-0 px-2 text-[8px] font-black uppercase">
                    Uygula
                  </Button>
                </div>
              )}
            </div>

            <PermissionGate permission="spaces.delete">
              <Button 
                variant="danger" 
                size="xs" 
                onClick={handleBulkDelete}
                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-455 text-[9.5px] uppercase font-bold border border-rose-500/15"
              >
                Sil
              </Button>
            </PermissionGate>
          </div>
        </div>
      )}

      {/* Main Grid: Table (Left) + Detail Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#0a111a]/50 rounded-3xl border border-white/5 shadow-inner overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-slate-500 font-bold uppercase tracking-widest text-[9.5px]">
                <TableSkeleton />
              </div>
            ) : filteredSpaces.length === 0 ? (
              <div className="p-12 text-center text-slate-500 font-bold uppercase tracking-wider text-[9.5px] border border-white/5 rounded-3xl bg-slate-950/20 py-16 space-y-3">
                <AlertTriangle className="w-8 h-8 text-slate-600 mx-auto" />
                <p>{emptyState || `Kayıtlı ${title} bulunmamaktadır.`}</p>
                {searchQuery || terminalFilter || typeFilter || statusFilter ? (
                  <Button variant="outline" size="xs" onClick={clearAllFilters} className="mx-auto text-[9px]">
                    Filtreleri Temizle
                  </Button>
                ) : null}
              </div>
            ) : (
              <Table 
                headers={[
                  <input 
                    type="checkbox" 
                    checked={selectedIds.length === paginatedSpaces.length && paginatedSpaces.length > 0} 
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900 bg-slate-950"
                  />,
                  ...columns.map(col => renderColumnHeader(col))
                ]}
                className="min-w-full"
              >
                {paginatedSpaces.map((space, idx) => {
                  const isSelected = selectedCode === space.code;
                  const isRowChecked = selectedIds.includes(space.id);
                  
                  return (
                    <TableRow 
                      key={space.id}
                      className={`cursor-pointer transition-colors border-b border-white/3 hover:bg-white/2 ${
                        isSelected ? 'bg-blue-900/10 border-blue-500/10' : ''
                      }`}
                      onClick={() => setSelectedCode(space.code)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="checkbox" 
                          checked={isRowChecked} 
                          onChange={(e) => handleSelectRow(space.id, e.target.checked)}
                          className="rounded border-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900 bg-slate-950"
                        />
                      </TableCell>
                      {columns.map(col => renderRowCell(space, col))}
                    </TableRow>
                  );
                })}
              </Table>
            )}

            {/* Pagination Controls */}
            {!loading && filteredSpaces.length > 0 && (
              <div className="flex justify-between items-center px-6 py-4.5 border-t border-white/5 select-none bg-slate-950/20 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <div className="flex items-center gap-4">
                  <span>Toplam {filteredSpaces.length} kayıttan {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredSpaces.length)} gösteriliyor</span>
                  <div className="flex items-center gap-1.5">
                    <span>Sayfa Başı:</span>
                    <Select 
                      value={pageSize} 
                      onChange={(e) => { setPageSize(parseInt(e.target.value, 10)); setCurrentPage(1); }}
                      className="h-6.5 py-0 px-2 text-[9px] w-16 bg-slate-950"
                    >
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="xs" 
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="h-7 w-7 p-0 flex items-center justify-center border-white/5"
                  >
                    <ChevronLeft size={12} />
                  </Button>
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    const isActive = pageNum === currentPage;
                    return (
                      <Button 
                        key={pageNum}
                        variant={isActive ? 'primary' : 'outline'} 
                        size="xs" 
                        onClick={() => setCurrentPage(pageNum)}
                        className={`h-7 w-7 p-0 flex items-center justify-center border-white/5 ${
                          isActive ? 'bg-blue-600 text-white font-black' : ''
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  <Button 
                    variant="outline" 
                    size="xs" 
                    disabled={currentPage === totalPages} 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="h-7 w-7 p-0 flex items-center justify-center border-white/5"
                  >
                    <ChevronRight size={12} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Space Detail Panel Drawer (Sticky Right) */}
        <div className="lg:col-span-4">
          {selectedSpace ? (
            <AdvertisingSpaceDetailPanel 
              space={selectedSpace} 
              onEdit={() => handleEdit(selectedSpace)}
              onDelete={handleDelete}
            />
          ) : (
            <div className="p-12 text-center text-slate-500 font-bold uppercase tracking-wider text-[9.5px] border border-white/5 border-dashed rounded-2xl bg-[#0a111a]/40 py-24 select-none">
              <MapPin size={24} className="opacity-20 mx-auto mb-2 text-slate-400" />
              Detayları görüntülemek için bir alan seçin.
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      <AdvertisingSpaceModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        onSuccess={() => fetchSpaces(false)}
        space={editingSpace}
        defaultType={defaultType}
      />

    </div>
  );
}
