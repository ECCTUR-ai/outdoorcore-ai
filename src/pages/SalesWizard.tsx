import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Calendar, 
  Layers, 
  MapPin, 
  Coins, 
  Percent, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Plus,
  Trash2,
  Lock,
  Search,
  Check
} from 'lucide-react';
import { 
  companyRepository, 
  spaceRepository, 
  reservationRepository, 
  activityLogRepository 
} from '@/repositories';
import { workflowService } from '@/services/workflowService';
import { Button } from '@/components/design-system/Button';
import { Badge } from '@/components/design-system/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ToastContainer, ToastItem } from '@/components/ui/Toast';
import { calculateCampaignDays } from '@/utils/dateHelper';

export function SalesWizard() {
  // Master Lists
  const [companies, setCompanies] = useState<any[]>([]);
  const [spaces, setSpaces] = useState<any[]>([]);
  
  // Form State
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [productType, setProductType] = useState<'dijital' | 'statik' | 'ozel'>('dijital');
  const [selectedSpaceIds, setSelectedSpaceIds] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  
  // Digital / LED settings
  const [reservedNetworkCount, setReservedNetworkCount] = useState(1);
  const [durationSeconds, setDurationSeconds] = useState(15);
  
  // Pricing State
  const [pricingModel, setPricingModel] = useState<'daily' | 'monthly' | 'period' | 'manual'>('manual');
  const [manualUnitPrice, setManualUnitPrice] = useState<number | null>(null);
  const [discountRate, setDiscountRate] = useState(0);

  // UI state
  const [loading, setLoading] = useState(false);
  const [workflowId] = useState(() => Math.random().toString(36).substring(2, 15));
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [searchSpaceKeyword, setSearchSpaceKeyword] = useState('');

  // Load Initial Data
  useEffect(() => {
    setCompanies(companyRepository.getAllSync());
    setSpaces(spaceRepository.getAllSync());
  }, []);

  const showToast = (title: string, description: string, type: ToastItem['type']) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, description, type }]);
  };

  const handleRemoveToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Filtered Spaces based on Product Type
  const filteredSpacesByType = useMemo(() => {
    return spaces.filter(s => {
      const typeLower = (s.type || '').toLowerCase();
      const isLed = typeLower === 'led' || typeLower === 'dijital led' || s.isDigital;
      
      if (productType === 'dijital') {
        return isLed;
      }
      if (productType === 'statik') {
        return !isLed && ['lightbox', 'duratrans', 'megalight', 'folyo', 'statik pano', 'pano'].some(t => typeLower.includes(t));
      }
      if (productType === 'ozel') {
        return !isLed && ['stand', 'sponsorluk'].some(t => typeLower.includes(t));
      }
      return true;
    });
  }, [spaces, productType]);

  // Keyword Filtered Spaces
  const filteredSpaces = useMemo(() => {
    if (!searchSpaceKeyword.trim()) return filteredSpacesByType;
    const keyword = searchSpaceKeyword.toLowerCase();
    return filteredSpacesByType.filter(s => 
      s.name.toLowerCase().includes(keyword) || 
      s.code.toLowerCase().includes(keyword) || 
      (s.location || '').toLowerCase().includes(keyword)
    );
  }, [filteredSpacesByType, searchSpaceKeyword]);

  // Reset spaces if product type changes
  useEffect(() => {
    setSelectedSpaceIds([]);
    setManualUnitPrice(null);
  }, [productType]);

  // Day count calculation
  const dayCount = useMemo(() => {
    return calculateCampaignDays(startDate, endDate);
  }, [startDate, endDate]);

  // Dynamic available network capacities for LED screens
  const spaceAvailabilityMap = useMemo(() => {
    const map: Record<string, { available: boolean; netCapacity?: number; availableNet?: number }> = {};
    
    filteredSpacesByType.forEach(s => {
      const isAvailable = startDate && endDate 
        ? reservationRepository.isSpaceAvailableSync(s.id, s.code, startDate, endDate) 
        : true;
      
      let netCapacity = s.networkCapacity || s.network_capacity || 0;
      let availableNet = netCapacity;
      
      if (startDate && endDate && (reservationRepository as any).getAvailableNetworkCapacity) {
        availableNet = (reservationRepository as any).getAvailableNetworkCapacity(s.id, s.code, startDate, endDate);
      }
      
      map[s.id] = {
        available: isAvailable,
        netCapacity,
        availableNet
      };
    });
    
    return map;
  }, [filteredSpacesByType, startDate, endDate]);

  // If dates or spaces availability change, validate selected space ids
  useEffect(() => {
    if (!startDate || !endDate) return;
    
    const invalidIds: string[] = [];
    selectedSpaceIds.forEach(id => {
      const info = spaceAvailabilityMap[id];
      if (!info) return;
      if (productType === 'dijital') {
        if (reservedNetworkCount > (info.availableNet || 0)) {
          invalidIds.push(id);
        }
      } else {
        if (!info.available) {
          invalidIds.push(id);
        }
      }
    });

    if (invalidIds.length > 0) {
      setSelectedSpaceIds(prev => prev.filter(id => !invalidIds.includes(id)));
      const invalidCodes = invalidIds.map(id => spaces.find(s => s.id === id)?.code).filter(Boolean).join(', ');
      showToast(
        "Mecra Seçimi Kaldırıldı", 
        `Seçilen tarihlerde müsait olmayan mecralar (${invalidCodes}) seçimden otomatik olarak çıkarıldı.`, 
        "warning"
      );
    }
  }, [startDate, endDate, spaceAvailabilityMap, productType, reservedNetworkCount, spaces]);

  // Selected spaces objects list
  const selectedSpacesList = useMemo(() => {
    return spaces.filter(s => selectedSpaceIds.includes(s.id));
  }, [spaces, selectedSpaceIds]);

  // Base list price calculation
  const listPriceTotal = useMemo(() => {
    return selectedSpacesList.reduce((sum, s) => sum + (s.priceNumeric || 0), 0);
  }, [selectedSpacesList]);

  // Sum daily prices
  const dailyPriceSum = useMemo(() => {
    return selectedSpacesList.reduce((sum, s) => sum + (s.dailyPrice || 0), 0);
  }, [selectedSpacesList]);

  // Sum monthly prices
  const monthlyPriceSum = useMemo(() => {
    return selectedSpacesList.reduce((sum, s) => sum + (s.monthlyPrice || 0), 0);
  }, [selectedSpacesList]);

  // Sum period prices
  const periodPriceSum = useMemo(() => {
    return selectedSpacesList.reduce((sum, s) => sum + (s.priceNumeric || 0), 0);
  }, [selectedSpacesList]);

  // Calculated base price based on model
  const calculatedBasePrice = useMemo(() => {
    if (pricingModel === 'daily') {
      return dailyPriceSum * dayCount;
    }
    if (pricingModel === 'monthly') {
      const months = dayCount / 30;
      return Math.round(monthlyPriceSum * months);
    }
    if (pricingModel === 'period') {
      return periodPriceSum;
    }
    // 'manual'
    return manualUnitPrice !== null ? manualUnitPrice : 0;
  }, [pricingModel, dailyPriceSum, monthlyPriceSum, periodPriceSum, dayCount, manualUnitPrice]);

  // Unit Price (editable)
  const unitPrice = pricingModel === 'manual' 
    ? (manualUnitPrice !== null ? manualUnitPrice : 0) 
    : calculatedBasePrice;

  // Pricing math calculations
  const discountAmount = Math.round(unitPrice * (discountRate / 100));
  const netAmount = Math.round(unitPrice - discountAmount);
  const vatAmount = Math.round(netAmount * 0.20);
  const grandTotal = Math.round(netAmount + vatAmount);

  // Space item checkbox toggle
  const handleSpaceToggle = (spaceId: string) => {
    if (selectedSpaceIds.includes(spaceId)) {
      setSelectedSpaceIds(prev => prev.filter(id => id !== spaceId));
    } else {
      setSelectedSpaceIds(prev => [...prev, spaceId]);
    }
    setManualUnitPrice(null); // Recalculate
  };

  const handleCreateReservation = () => {
    // Form Validations
    if (!selectedCompanyId) {
      showToast("Eksik Bilgi", "Lütfen bir firma seçin.", "error");
      return;
    }
    if (!campaignName.trim() || campaignName.length < 2) {
      showToast("Eksik Bilgi", "Lütfen kampanya adını girin.", "error");
      return;
    }
    if (!startDate || !endDate) {
      showToast("Eksik Bilgi", "Lütfen yayın başlangıç ve bitiş tarihlerini girin.", "error");
      return;
    }
    if (calculateCampaignDays(startDate, endDate) <= 0) {
      showToast("Hata", "Kampanya süresi en az 1 gün olmalıdır.", "error");
      return;
    }
    if (selectedSpaceIds.length === 0) {
      showToast("Eksik Seçim", "Lütfen en az bir reklam alanı seçin.", "error");
      return;
    }
    if (grandTotal <= 0) {
      showToast("Fiyat Hatası", "Nihai genel toplam bütçe ₺0 olamaz.", "error");
      return;
    }

    // Capacity validation check
    for (const spaceId of selectedSpaceIds) {
      const info = spaceAvailabilityMap[spaceId];
      if (!info) continue;
      if (productType === 'dijital') {
        if (reservedNetworkCount > (info.availableNet || 0)) {
          const space = spaces.find(s => s.id === spaceId);
          showToast("Kapasite Aşımı", `${space?.code} LED ekranında seçilen tarihlerde yeterli müsait network slotu yok.`, "error");
          return;
        }
      } else {
        if (!info.available) {
          const space = spaces.find(s => s.id === spaceId);
          showToast("Çakışma Hatası", `${space?.code} reklam alanı seçilen tarihlerde doludur.`, "error");
          return;
        }
      }
    }

    // Show confirmation modal
    setShowConfirmModal(true);
  };

  const executeCommit = async () => {
    setShowConfirmModal(false);
    setLoading(true);

    try {
      const response = await workflowService.commitReservationWorkflow({
        workflowId,
        companyId: selectedCompanyId,
        campaignName,
        startDate,
        endDate,
        productType,
        spaceIds: selectedSpaceIds,
        reservedNetworkCount: productType === 'dijital' ? reservedNetworkCount : undefined,
        durationSeconds: productType === 'dijital' ? durationSeconds : undefined,
        unitPrice,
        discountRate,
        notes
      });

      if (response.success) {
        showToast("Başarılı", "Rezervasyon oluşturuldu. Teklif, Pipeline kartı ve finans planları tamamlandı.", "success");
        // Reset Form
        setSelectedCompanyId('');
        setCampaignName('');
        setStartDate('');
        setEndDate('');
        setSelectedSpaceIds([]);
        setNotes('');
        setManualUnitPrice(null);
        setDiscountRate(0);
        setTimeout(() => {
          window.location.href = '/rezervasyonlar';
        }, 1500);
      } else {
        showToast("Hata", response.error || "İşlem tamamlanırken bir hata oluştu.", "error");
      }
    } catch (e: any) {
      console.error(e);
      showToast("Sistem Hatası", e.message || "İşlem sırasında beklenmedik bir hata oluştu.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 select-none pb-12 text-left">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 p-5 rounded-3xl border border-white/5 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">Rezervasyon Yap</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tarih aralığı, firma ve mecra seçimini yaparak rezervasyonu anında kesinleştirin.</p>
        </div>
      </div>

      {/* Main Form Layout (Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left / Main Form (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Campaign Details */}
          <div className="bg-[#12192B]/40 border border-white/5 p-6 rounded-3xl space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2">
              <Building2 size={14} className="text-blue-400" />
              Firma ve Kampanya Bilgileri
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Firma / Marka</label>
                <select
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  className="w-full h-10 px-3 bg-[#151B2D] border border-white/5 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-blue-500/50"
                >
                  <option value="">Firma Seçiniz...</option>
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Kampanya Adı</label>
                <input
                  type="text"
                  placeholder="örn: Lansman Kampanyası Q3"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full h-10 px-3 bg-[#151B2D] border border-white/5 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-blue-500/50 placeholder-slate-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Yayın Başlangıç Tarihi</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full h-10 px-3 bg-[#151B2D] border border-white/5 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-blue-500/55"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Yayın Bitiş Tarihi</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full h-10 px-3 bg-[#151B2D] border border-white/5 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-blue-500/55"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Yayın Gün Sayısı</label>
                <div className="w-full h-10 px-3 bg-[#151B2D]/50 border border-white/5 rounded-xl text-xs font-black text-blue-400 flex items-center justify-center font-mono">
                  {dayCount} Gün
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Product Type Toggle */}
          <div className="bg-[#12192B]/40 border border-white/5 p-6 rounded-3xl space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2">
              <Layers size={14} className="text-blue-400" />
              Ürün ve Kategori Seçimi
            </h3>
            <div className="flex gap-4">
              {[
                { type: 'dijital', label: 'Dijital (LED Ekranlar)' },
                { type: 'statik', label: 'Statik (Lightbox, Pano vb.)' },
                { type: 'ozel', label: 'Özel Alanlar (Stand, Sponsorluk)' }
              ].map(item => {
                const isSelected = productType === item.type;
                return (
                  <button
                    key={item.type}
                    onClick={() => setProductType(item.type as any)}
                    className={`flex-1 py-3.5 px-4 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all ${
                      isSelected 
                        ? 'bg-blue-650/10 border-blue-500/35 text-blue-400 font-bold shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                        : 'bg-[#151B2D] border-white/5 text-slate-500 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Space Unit Selection */}
          <div className="bg-[#12192B]/40 border border-white/5 p-6 rounded-3xl space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-2.5">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <MapPin size={14} className="text-blue-400" />
                Mecra / Reklam Alanı Üniteleri ({filteredSpaces.length} Bulundu)
              </h3>
              
              {/* Space Search input */}
              <div className="relative w-full sm:w-60">
                <input
                  type="text"
                  placeholder="Mecra kodu veya isim ara..."
                  value={searchSpaceKeyword}
                  onChange={(e) => setSearchSpaceKeyword(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 bg-[#151B2D] border border-white/5 rounded-lg text-[10.5px] font-semibold text-white focus:outline-none focus:border-blue-500/50 placeholder-slate-650"
                />
                <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* List of spaces */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-96 overflow-y-auto pr-1">
              {filteredSpaces.map(space => {
                const isSelected = selectedSpaceIds.includes(space.id);
                const info = spaceAvailabilityMap[space.id] || { available: true };
                
                // LED Screen properties
                const isDijital = productType === 'dijital';
                const usedNet = (info.netCapacity || 0) - (info.availableNet || 0);
                const statusColor = isDijital
                  ? ((info.availableNet || 0) > 0 ? 'text-emerald-400' : 'text-red-400')
                  : (info.available ? 'text-emerald-400' : 'text-red-400');

                return (
                  <div
                    key={space.id}
                    onClick={() => handleSpaceToggle(space.id)}
                    className={`p-4 rounded-2xl border cursor-pointer select-none transition-all flex flex-col justify-between min-h-[140px] h-auto relative text-left ${
                      isSelected 
                        ? 'bg-blue-600/5 border-blue-500/40 ring-2 ring-blue-500/25 text-white' 
                        : 'bg-[#151B2D] border-white/5 text-slate-350 hover:border-white/12 hover:bg-[#182035]'
                    }`}
                  >
                    {/* Checkbox indicator overlay */}
                    {isSelected && (
                      <div className="absolute top-3.5 right-3.5 w-5.5 h-5.5 rounded-full bg-blue-500 flex items-center justify-center border border-white text-[9px] font-black text-white">
                        ✓
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-wider">#{space.code}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase shrink-0 truncate max-w-[120px]">{space.location}</span>
                      </div>
                      <h4 className="text-[11px] font-black text-white truncate uppercase tracking-wide leading-none">{space.name}</h4>
                      {startDate && endDate ? (
                        <div className="text-[9px] text-slate-500 font-bold uppercase">
                          Dönem: {startDate} → {endDate}
                        </div>
                      ) : (
                        <div className="text-[9px] text-yellow-500 font-bold uppercase">
                          Lütfen tarih seçin
                        </div>
                      )}
                      
                      {isDijital ? (
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[9px] pt-1 text-slate-400 font-semibold border-t border-white/3">
                          <div>Toplam Kapasite: <span className="text-white font-extrabold">{info.netCapacity} Network</span></div>
                          <div>Rezerve: <span className="text-white font-extrabold">{usedNet} Network</span></div>
                          <div>Müsait: <span className={`${statusColor} font-extrabold`}>{info.availableNet} Network</span></div>
                          {isSelected && (
                            <>
                              <div>Talep: <span className="text-blue-400 font-bold">{reservedNetworkCount} Network</span></div>
                              <div>Slot: <span className="text-blue-400 font-bold">{durationSeconds} Sn</span></div>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="flex justify-between items-center text-[9px] pt-1 text-slate-400 font-semibold border-t border-white/3">
                          <span>Durum: <span className={`${statusColor} font-extrabold`}>{info.available ? 'MÜSAİT' : 'DOLU'}</span></span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center border-t border-white/3 pt-2 mt-2 text-[10px] font-black leading-none">
                      <span className="text-slate-500 text-[8px] uppercase">GÜNLÜK BAZ FİYAT</span>
                      <span className={space.priceNumeric > 0 ? 'text-emerald-450' : 'text-yellow-500'}>
                        {space.priceNumeric > 0 ? `₺${space.priceNumeric.toLocaleString('tr-TR')}` : 'Fiyat tanımsız'}
                      </span>
                    </div>
                  </div>
                );
              })}
              {filteredSpaces.length === 0 && (
                <div className="col-span-2 py-10 text-center text-slate-500 text-xs font-bold uppercase tracking-wider border border-dashed border-white/5 rounded-3xl">
                  Seçilen türe veya filtreye ait reklam alanı bulunamadı.
                </div>
              )}
            </div>
          </div>

          {/* Section 4: LED Settings (Only for Dijital LED screen) */}
          {productType === 'dijital' && selectedSpaceIds.length > 0 && (
            <div className="bg-[#12192B]/40 border border-white/5 p-6 rounded-3xl space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2">
                <Calendar size={14} className="text-blue-400" />
                Playlist & LED Network Slot Konfigürasyonu
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Rezerve Edilecek Network Adedi</label>
                  <select
                    value={reservedNetworkCount}
                    onChange={(e) => setReservedNetworkCount(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-[#151B2D] border border-white/5 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-blue-500/50"
                  >
                    {[1, 2, 3, 4, 5, 6].map(val => (
                      <option key={val} value={val}>{val} Network Slotu (Dönem Başına)</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Yayın Süresi (Slot Uzunluğu)</label>
                  <select
                    value={durationSeconds}
                    onChange={(e) => setDurationSeconds(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-[#151B2D] border border-white/5 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-blue-500/50"
                  >
                    <option value={15}>15 Saniye (Standart)</option>
                    <option value={30}>30 Saniye</option>
                    <option value={45}>45 Saniye</option>
                    <option value={60}>60 Saniye (1 Dakika)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Section 5: Pricing Calculation Controls */}
          <div className="bg-[#12192B]/40 border border-white/5 p-6 rounded-3xl space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2">
              <Coins size={14} className="text-blue-400" />
              Fiyat Tarifesi ve Bütçe Yönetimi
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Fiyat Tarifesi Modeli</label>
                <select
                  value={pricingModel}
                  onChange={(e) => {
                    setPricingModel(e.target.value as any);
                    if (e.target.value !== 'manual') {
                      setManualUnitPrice(null);
                    }
                  }}
                  className="w-full h-10 px-3 bg-[#151B2D] border border-white/5 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-blue-500/50"
                >
                  <option value="daily">Günlük Tarife (dailyPrice × gün)</option>
                  <option value="monthly">Aylık Tarife (monthlyPrice × ay)</option>
                  <option value="period">Dönem Fiyatı (Tanımlı fiyat)</option>
                  <option value="manual">Manuel Net Dönem Fiyatı</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Fiyat Kaynak Değeri</label>
                <div className="w-full h-10 px-3 bg-[#151B2D]/55 border border-white/5 rounded-xl text-xs font-mono text-slate-300 flex items-center justify-between font-extrabold">
                  {pricingModel === 'daily' && (
                    <>
                      <span>Toplam Günlük Fiyat:</span>
                      <span className="text-emerald-450">₺ {dailyPriceSum.toLocaleString('tr-TR')}</span>
                    </>
                  )}
                  {pricingModel === 'monthly' && (
                    <>
                      <span>Toplam Aylık Fiyat:</span>
                      <span className="text-emerald-450">₺ {monthlyPriceSum.toLocaleString('tr-TR')}</span>
                    </>
                  )}
                  {pricingModel === 'period' && (
                    <>
                      <span>Toplam Dönem Fiyatı:</span>
                      <span className="text-emerald-450">₺ {periodPriceSum.toLocaleString('tr-TR')}</span>
                    </>
                  )}
                  {pricingModel === 'manual' && (
                    <>
                      <span>Manuel Değer:</span>
                      <span className="text-slate-400">Giriş Yapılıyor...</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {pricingModel === 'manual' && (
              <div className="space-y-1.5">
                <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Birim Bütçe Fiyatı (Manuel Giriş)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={manualUnitPrice !== null ? manualUnitPrice : ''}
                    placeholder="Bütçe girin..."
                    onChange={(e) => {
                      const v = e.target.value;
                      setManualUnitPrice(v === '' ? 0 : Number(v));
                    }}
                    className="w-full h-10 pl-8 pr-3 bg-[#151B2D] border border-white/5 rounded-xl text-xs font-mono text-emerald-450 font-extrabold focus:outline-none focus:border-blue-500/50"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[11px] font-extrabold">₺</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">İndirim Oranı (%)</label>
                <div className="relative flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={discountRate}
                    onChange={(e) => setDiscountRate(Number(e.target.value))}
                    className="flex-1 accent-blue-500 h-1 bg-[#151B2D] rounded-lg cursor-pointer"
                  />
                  <span className="w-12 h-10 bg-[#151B2D] border border-white/5 rounded-xl text-xs font-mono text-white flex items-center justify-center font-extrabold">
                    %{discountRate}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">KDV Oranı</label>
                <div className="w-full h-10 px-3 bg-[#151B2D]/40 border border-white/5 rounded-xl text-xs font-mono text-slate-400 flex items-center justify-center font-extrabold">
                  %20 KDV
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Notes */}
          <div className="bg-[#12192B]/40 border border-white/5 p-6 rounded-3xl space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2">
              <FileText size={14} className="text-blue-400" />
              Ekip Notları ve Açıklamalar
            </h3>
            <textarea
              rows={3}
              placeholder="Rezervasyona ait operasyonel veya mali detay notları..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 bg-[#151B2D] border border-white/5 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-blue-500/50 placeholder-slate-500 leading-relaxed resize-none"
            />
          </div>

        </div>

        {/* Right / Sticky Summary Card (4 columns) */}
        <div className="lg:col-span-4 lg:sticky lg:top-[95px]">
          <div className="bg-[#12192B] border border-white/5 rounded-3xl p-5 space-y-5 shadow-2xl">
            <div className="space-y-1 text-center border-b border-white/5 pb-4">
              <span className="text-[9px] font-black text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                Rezervasyon Özeti
              </span>
            </div>

            {/* Campaign specs recap */}
            <div className="space-y-3 text-xs font-bold text-slate-400">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-555 font-bold uppercase tracking-wider">Firma:</span>
                <span className="text-white font-extrabold uppercase truncate max-w-[150px]">
                  {companies.find(c => c.id === selectedCompanyId)?.name || 'Seçilmedi'}
                </span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-555 font-bold uppercase tracking-wider">Kampanya:</span>
                <span className="text-white font-extrabold uppercase truncate max-w-[150px]">
                  {campaignName || 'Girilmedi'}
                </span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-555 font-bold uppercase tracking-wider">Başlangıç:</span>
                <span className="text-white font-mono font-extrabold">{startDate || '-'}</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-555 font-bold uppercase tracking-wider">Bitiş:</span>
                <span className="text-white font-mono font-extrabold">{endDate || '-'}</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-555 font-bold uppercase tracking-wider">Yayın Süresi:</span>
                <span className="text-blue-400 font-mono font-black">{dayCount} Gün</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-555 font-bold uppercase tracking-wider">Mecra Türü:</span>
                <span className="text-white font-extrabold uppercase">{productType}</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-555 font-bold uppercase tracking-wider">Seçilen Reklam Alanı:</span>
                <span className="text-white font-black">{selectedSpaceIds.length} Ünite</span>
              </div>
              {productType === 'dijital' && selectedSpaceIds.length > 0 && (
                <>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-555 font-bold uppercase tracking-wider">Talep Edilen Network:</span>
                    <span className="text-white font-black">{reservedNetworkCount} Slot</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-555 font-bold uppercase tracking-wider">Slot Süresi:</span>
                    <span className="text-white font-black">{durationSeconds} Saniye</span>
                  </div>
                </>
              )}
            </div>

            {/* List of selected spaces list */}
            {selectedSpacesList.length > 0 && (
              <div className="space-y-1.5 pt-3 border-t border-white/5 text-left">
                <span className="text-[8px] font-black text-slate-550 uppercase tracking-widest block mb-1">SEÇİLEN MECRALAR</span>
                <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                  {selectedSpacesList.map(s => (
                    <div key={s.id} className="p-2 rounded-lg bg-white/2 border border-white/3 flex items-center justify-between text-[9px] font-bold text-white uppercase">
                      <span>#{s.code}</span>
                      <span className="text-[8px] text-slate-500 font-bold block truncate max-w-[120px]">{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price breakdown */}
            <div className="space-y-2.5 pt-3.5 border-t border-white/5 text-xs text-slate-400">
              <div className="flex justify-between items-center">
                <span>Liste Fiyatı Toplamı:</span>
                <span className="font-mono">₺ {listPriceTotal.toLocaleString('tr-TR')}</span>
              </div>
              <div className="flex justify-between items-center font-bold text-white">
                <span>Birim Bütçe Fiyatı:</span>
                <span className="font-mono text-emerald-450 font-black">₺ {unitPrice.toLocaleString('tr-TR')}</span>
              </div>
              {discountRate > 0 && (
                <div className="flex justify-between items-center text-indigo-400 font-extrabold">
                  <span>İndirim Tutarı (%{discountRate}):</span>
                  <span className="font-mono">- ₺ {discountAmount.toLocaleString('tr-TR')}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-[11px] font-extrabold text-white">
                <span>Net Tutar:</span>
                <span className="font-mono">₺ {netAmount.toLocaleString('tr-TR')}</span>
              </div>
              <div className="flex justify-between items-center text-[10.5px]">
                <span>KDV Tutarı (%20):</span>
                <span className="font-mono">₺ {vatAmount.toLocaleString('tr-TR')}</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/5 pt-3.5">
                <span className="text-xs font-black uppercase text-white">Genel Toplam Bütçe:</span>
                <span className="text-base font-black text-emerald-450 font-mono">₺ {grandTotal.toLocaleString('tr-TR')}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2">
              <Button
                variant="primary"
                onClick={handleCreateReservation}
                disabled={loading || selectedSpaceIds.length === 0 || !selectedCompanyId || !campaignName.trim() || !startDate || !endDate}
                loading={loading}
                className="w-full h-12 bg-gradient-to-r from-blue-650 to-indigo-650 hover:from-blue-600 hover:to-indigo-600 font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2"
              >
                <span>REZERVASYON YAP</span>
                <ArrowRight size={13} />
              </Button>
            </div>
          </div>
        </div>

      </div>

      {/* Confirmation Modal */}
      <ConfirmDialog
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={executeCommit}
        title="Rezervasyonu oluşturmak istiyor musunuz?"
        description="Bu işlem seçilen reklam alanlarını belirtilen tarih aralığında bloke ederek kesinleştirecek, teklif pipeline kartını oluşturacak ve fatura planlarını açacaktır."
        confirmLabel="Rezervasyonu Oluştur"
        cancelLabel="Vazgeç"
      />

      <ToastContainer toasts={toasts} onRemove={handleRemoveToast} />
    </div>
  );
}
