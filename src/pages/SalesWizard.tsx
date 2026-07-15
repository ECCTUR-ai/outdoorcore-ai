import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  FileText, 
  FileSignature, 
  Calendar, 
  Megaphone, 
  Coins, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Plus, 
  Info,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  FolderOpen,
  Trash2,
  Filter,
  Layers,
  Activity,
  Maximize2
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/design-system/Button';
import { Label, Input, Select, Textarea, FormGroup } from '@/components/design-system/Form';
import { Notification } from '@/components/design-system/Notification';
import { Badge } from '@/components/design-system/Badge';
import { 
  companyRepository, 
  spaceRepository,
  reservationRepository,
  activityLogRepository,
  digitalScreenRepository
} from '@/repositories';
import { Company } from '@/data/companies';
import { AdvertisingSpace } from '@/data/advertisingSpaces';
import { WIZARD_STEPS } from '@/data/salesWizard';
import { workflowService } from '@/services/workflowService';
import { WizardStepId, WorkflowState } from '@/types/workflow';
import { CompanyModal } from '@/components/design-system/CompanyModal';

const MONTH_NAMES = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const SPACE_COORDINATES: Record<string, { top: string; left: string }> = {
  'SG-001': { top: '25%', left: '15%' },
  'SG-002': { top: '22%', left: '42%' },
  'SG-003': { top: '35%', left: '26%' },
  'SG-010': { top: '48%', left: '52%' },
  'SG-018': { top: '45%', left: '76%' },
  'SG-021': { top: '65%', left: '38%' },
  'SG-023': { top: '78%', left: '68%' },
  'SG-045': { top: '72%', left: '85%' }
};

const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number): number => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // 0 for Monday, ..., 6 for Sunday
};

const parseStringDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  const parts = dateStr.split('.');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return null;
};

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

export function SalesWizard() {
  const { setCurrentRoute } = useApp();
  
  // Repos data load
  const [companiesList, setCompaniesList] = useState<Company[]>([]);
  const [spacesList, setSpacesList] = useState<AdvertisingSpace[]>([]);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  // Filters State for Step 2
  const [filters, setFilters] = useState({
    terminal: 'all',
    floor: 'all',
    type: 'all',
    premium: false,
    led: false,
    lightbox: false,
    digital: false,
    minPrice: 0,
    maxPrice: 3000000,
    minTraffic: 0,
    minVisibility: 'all'
  });

  const [selectedLedScreenId, setSelectedLedScreenId] = useState<string>('LED-001');
  const [ledDurationSeconds, setLedDurationSeconds] = useState<number>(15);

  // Initial Workflow state
  const [state, setState] = useState<WorkflowState>({
    currentStep: 'dates',
    completedSteps: [],
    data: {
      dates: {
        startDate: '06.07.2026',
        endDate: '06.08.2026'
      },
      company: null,
      selectedSpaces: [],
      offer: null,
      contract: null,
      reservation: null,
      campaign: null,
      finance: null,
      reklamTipi: 'statik',
      ledSlots: []
    }
  });

  const [wizardResult, setWizardResult] = useState<any | null>(null);
  const [wizardError, setWizardError] = useState<string | null>(null);
  const [wizardSuccess, setWizardSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slowSubmitMsg, setSlowSubmitMsg] = useState(false);

  useEffect(() => {
    if (wizardSuccess) {
      const timer = setTimeout(() => setWizardSuccess(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [wizardSuccess]);

  useEffect(() => {
    if (wizardError) {
      const timer = setTimeout(() => setWizardError(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [wizardError]);

  // Fetch initial list of companies and spaces
  useEffect(() => {
    async function loadData() {
      try {
        const [comps, spaces] = await Promise.all([
          companyRepository.list(),
          spaceRepository.list()
        ]);
        setCompaniesList(comps);
        setSpacesList(spaces);
      } catch (e) {
        console.error('Failed to load companies/spaces for wizard:', e);
      }
    }
    loadData();
  }, []);

  const handleCompanySuccess = async (newCompany: Company) => {
    try {
      const comps = await companyRepository.list();
      setCompaniesList(comps);
      setState(prev => ({
        ...prev,
        data: { ...prev.data, company: newCompany }
      }));
    } catch (e) {
      console.error(e);
    }
  };

  // Step transitions
  const stepsOrder: WizardStepId[] = [
    'dates',
    'spaces',
    'company',
    'offer',
    'contract',
    'reservation',
    'campaign',
    'finance',
    'summary'
  ];

  const currentStepIndex = stepsOrder.indexOf(state.currentStep);

  const goToNextStep = () => {
    setWizardError(null);

    // Validate active step data before progressing
    if (state.currentStep === 'dates') {
      if (!state.data.dates?.startDate || !state.data.dates?.endDate) {
        setWizardError('Lütfen başlangıç ve bitiş tarihlerini zorunlu olarak giriniz.');
        return;
      }
      setState(prev => ({
        ...prev,
        data: {
          ...prev.data,
          contract: prev.data.contract ? prev.data.contract : {
            contractNo: 'SOZ-2026-' + Math.floor(1000 + Math.random() * 9000),
            startDate: prev.data.dates?.startDate || '',
            endDate: prev.data.dates?.endDate || '',
            notes: ''
          },
          reservation: prev.data.reservation ? prev.data.reservation : {
            startDate: prev.data.dates?.startDate || '',
            endDate: prev.data.dates?.endDate || '',
            notes: ''
          }
        }
      }));
    }
    if (state.currentStep === 'spaces') {
      const isLed = state.data.reklamTipi === 'led';
      if (isLed) {
        if (!state.data.ledSlots || state.data.ledSlots.length === 0) {
          setWizardError('Lütfen en az bir LED ekran slotu ekleyin.');
          return;
        }
      } else {
        if (state.data.selectedSpaces.length === 0) {
          setWizardError('Lütfen en az bir reklam alanı seçin.');
          return;
        }
      }
    }
    if (state.currentStep === 'company' && !state.data.company) {
      setWizardError('Lütfen bir firma seçin veya yeni bir kayıt oluşturun.');
      return;
    }
    if (state.currentStep === 'offer' && !state.data.offer) {
      setWizardError('Lütfen teklif bütçe ve aşama alanlarını doldurun.');
      return;
    }
    if (state.currentStep === 'contract' && !state.data.contract) {
      setWizardError('Lütfen sözleşme alanlarını doldurun.');
      return;
    }
    if (state.currentStep === 'reservation' && !state.data.reservation) {
      setWizardError('Lütfen rezervasyon tarihlerini seçin.');
      return;
    }
    if (state.currentStep === 'campaign' && !state.data.campaign) {
      setWizardError('Lütfen kampanya detaylarını doldurun.');
      return;
    }
    if (state.currentStep === 'finance' && !state.data.finance) {
      setWizardError('Lütfen finansman planı detaylarını doldurun.');
      return;
    }

    const nextStep = stepsOrder[currentStepIndex + 1];
    if (nextStep) {
      setState(prev => ({
        ...prev,
        currentStep: nextStep,
        completedSteps: prev.completedSteps.includes(prev.currentStep)
          ? prev.completedSteps
          : [...prev.completedSteps, prev.currentStep]
      }));
    }
  };

  const goToPrevStep = () => {
    setWizardError(null);
    const prevStep = stepsOrder[currentStepIndex - 1];
    if (prevStep) {
      setState(prev => ({
        ...prev,
        currentStep: prevStep
      }));
    }
  };

  const commitWorkflow = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setWizardError(null);
    setWizardSuccess(null);
    setSlowSubmitMsg(false);

    const slowTimer = setTimeout(() => {
      setSlowSubmitMsg(true);
    }, 10000);

    try {
      const res = await workflowService.commitSalesWorkflow(state);
      clearTimeout(slowTimer);
      if (res.success) {
        setWizardResult(res.data);
        setWizardSuccess('Satış süreci başarıyla tamamlandı! Tüm CRM, sözleşme, rezervasyon ve fatura kayıtları oluşturuldu.');
      } else {
        setWizardError(res.error || 'Satış süreci kaydedilemedi.');
      }
    } catch (err: any) {
      clearTimeout(slowTimer);
      setWizardError(err.message || 'Bir hata oluşti.');
    } finally {
      setIsSubmitting(false);
      setSlowSubmitMsg(false);
    }
  };

  const calculateTotalSpacesPrice = (): number => {
    if (state.data.reklamTipi === 'led') {
      return (state.data.ledSlots || []).reduce((total, slot) => total + slot.price, 0);
    }
    return state.data.selectedSpaces.reduce((total, space) => {
      const cleanNum = parseInt(space.price.replace(/[^0-9]/g, ''), 10) || 0;
      return total + cleanNum;
    }, 0);
  };

  const isPremiumSpace = (s: AdvertisingSpace): boolean => {
    const p = parseInt(s.price.replace(/[^0-9]/g, ''), 10) || 0;
    return s.type.toLowerCase().includes('led') || 
           s.type.toLowerCase().includes('megaboard') || 
           p > 500000;
  };

  // Helper calculations for dynamic KPIs
  const getKpis = () => {
    const total = spacesList.length;
    const start = state.data.dates?.startDate || '';
    const end = state.data.dates?.endDate || '';
    
    // Filter available spaces based on reservation check
    const available = spacesList.filter(s => 
      reservationRepository.isSpaceAvailableSync(s.id, s.code, start, end)
    );
    const availableCount = available.length;
    
    const selectedCount = state.data.selectedSpaces.length;
    
    // Selected spaces which are premium
    const premiumSelected = state.data.selectedSpaces.filter(isPremiumSpace).length;
    
    // Total monthly price of selected
    const selectedMonthlySum = calculateTotalSpacesPrice();

    // Total traffic of selected spaces
    const totalTraffic = state.data.selectedSpaces.reduce((total, s) => total + (s.traffic || 0), 0);

    return {
      total,
      available: availableCount,
      selectedCount,
      premiumSelected,
      selectedMonthlySum,
      totalTraffic
    };
  };

  const kpiData = getKpis();

  // Get filtered available spaces for Step 2
  const getFilteredAvailableSpaces = (): AdvertisingSpace[] => {
    const start = state.data.dates?.startDate || '';
    const end = state.data.dates?.endDate || '';
    const available = spacesList.filter(s => 
      reservationRepository.isSpaceAvailableSync(s.id, s.code, start, end)
    );

    return available.filter(s => {
      const p = parseInt(s.price.replace(/[^0-9]/g, ''), 10) || 0;
      
      // Terminal Filter
      if (filters.terminal === 'ic-hatlar' && !s.location.toLowerCase().includes('i̇ç') && !s.location.toLowerCase().includes('ic')) return false;
      if (filters.terminal === 'dis-hatlar' && !s.location.toLowerCase().includes('dış') && !s.location.toLowerCase().includes('dis')) return false;

      // Floor Filter
      if (filters.floor !== 'all' && !s.location.includes(filters.floor)) return false;

      // Type Filter
      if (filters.type !== 'all' && !s.type.toLowerCase().includes(filters.type.toLowerCase())) return false;

      // Checkboxes
      if (filters.premium && !isPremiumSpace(s)) return false;
      if (filters.led && !s.type.toLowerCase().includes('led')) return false;
      if (filters.lightbox && !s.type.toLowerCase().includes('lightbox') && !s.type.toLowerCase().includes('pano')) return false;
      if (filters.digital && !s.type.toLowerCase().includes('led') && !s.type.toLowerCase().includes('dijital') && !s.type.toLowerCase().includes('digital')) return false;

      // Ranges
      if (p < filters.minPrice || p > filters.maxPrice) return false;
      if (s.traffic < filters.minTraffic) return false;

      // Visibility Filter
      if (filters.minVisibility !== 'all' && s.visibility !== filters.minVisibility) return false;

      return true;
    });
  };

  const filteredAvailableSpaces = getFilteredAvailableSpaces();

  // ----------------------------------------------------
  // SUB-COMPONENTS DECLARATIONS
  // ----------------------------------------------------

  // Wizard Stepper Left Sidebar Component
  function WizardStepper() {
    return (
      <div className="dark-glass-card border border-white/5 rounded-2xl p-4.5 space-y-4">
        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block pb-2 border-b border-white/5">Satış Süreci Adımları</span>
        <div className="space-y-1">
          {WIZARD_STEPS.map((stepConfig, index) => {
            const isActive = state.currentStep === stepConfig.id;
            const isCompleted = state.completedSteps.includes(stepConfig.id);
            return (
              <button
                key={stepConfig.id}
                disabled={!isCompleted && !isActive && index > state.completedSteps.length}
                onClick={() => setState(prev => ({ ...prev, currentStep: stepConfig.id }))}
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-indigo-650/30 border border-indigo-500/25 text-white font-extrabold shadow-sm shadow-indigo-600/5'
                    : isCompleted
                    ? 'text-emerald-400 font-bold hover:bg-white/3'
                    : 'text-slate-500 hover:text-slate-350 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                <div className="shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 size={14} className="text-emerald-400" />
                  ) : (
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] border font-black ${
                      isActive ? 'border-indigo-400 bg-indigo-500 text-white' : 'border-slate-800 text-slate-500'
                    }`}>
                      {index + 1}
                    </div>
                  )}
                </div>
                <div className="min-w-0 leading-none">
                  <span className="text-[10.5px] uppercase tracking-wider block">{stepConfig.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Wizard KPI Bar Top Component
  function WizardKpiBar() {
    const trafficFormatted = kpiData.totalTraffic > 1000000 
      ? `${(kpiData.totalTraffic / 1000000).toFixed(1)}M` 
      : kpiData.totalTraffic > 1000 
      ? `${(kpiData.totalTraffic / 1000).toFixed(0)}K` 
      : kpiData.totalTraffic.toString();

    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="dark-glass-card border border-white/5 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[8.5px] font-black text-slate-500 uppercase tracking-wider">Müsait Alan</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-sm font-black text-emerald-400">{kpiData.available}</span>
            <span className="text-[8px] text-emerald-500 font-bold">Boş</span>
          </div>
        </div>

        <div className="dark-glass-card border border-white/5 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[8.5px] font-black text-indigo-400 uppercase tracking-wider">Seçilen Alan</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-sm font-black text-indigo-400">{kpiData.selectedCount}</span>
            <span className="text-[8px] text-indigo-400 font-bold">Adet</span>
          </div>
        </div>

        <div className="dark-glass-card border border-white/5 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[8.5px] font-black text-indigo-400 uppercase tracking-wider">Premium Seçili</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-sm font-black text-indigo-400">{kpiData.premiumSelected}</span>
            <span className="text-[8px] text-indigo-400 font-bold">Alan</span>
          </div>
        </div>

        <div className="dark-glass-card border border-white/5 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[8.5px] font-black text-slate-500 uppercase tracking-wider">Toplam Aylık Fiyat</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-sm font-black text-white">
              ₺{kpiData.selectedMonthlySum.toLocaleString('tr-TR')}
            </span>
          </div>
        </div>

        <div className="dark-glass-card border border-white/5 p-4 rounded-2xl flex flex-col justify-between col-span-2 md:col-span-1">
          <span className="text-[8.5px] font-black text-slate-500 uppercase tracking-wider">Tahmini Erişim</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-sm font-black text-white">{trafficFormatted}</span>
            <span className="text-[8px] text-slate-500 font-bold">/ Gün</span>
          </div>
        </div>
      </div>
    );
  }

  // Sidebar AI Recommendation box
  function WorkflowAiPanel() {
    const getAiSuggestions = () => {
      const occupancyPercent = Math.round(((spacesList.length - kpiData.available) / spacesList.length) * 100) || 0;
      switch (state.currentStep) {
        case 'dates':
          return {
            title: `Doluluk Oranı Analizi`,
            text: `Doluluk %${occupancyPercent}. Bu tarihlerde ${kpiData.available} Alan müsait. Alternatif tarihte %14 daha fazla boş alan var.`,
            meta: `Tarih aralığı kontrolü yapılıyor`
          };
        case 'spaces':
          return {
            title: `OutdoorCore AI Alan Önerileri`,
            text: `Bu tarih aralığında ${kpiData.available} premium alan müsait. SG-021 + SG-045 birlikte kullanılırsa görünürlük %18 artar. Bütçeyi düşürmek için SG-006 alternatif olabilir. Check-in bölgesi Samsung benzeri markalar için yüksek performanslıdır.`,
            meta: `Akıllı envanter önerileri`
          };
        case 'company':
          return {
            title: `CRM Segment Analizi`,
            text: `Firma seçildiğinde CRM segment verileri analiz edilip doluluk durumuna göre en verimli teklif şablonu yüklenecektir.`,
            meta: `VIP CRM Segmentasyon Analizi`
          };
        case 'offer':
          return {
            title: `Bütçe & Marj Değerlendirmesi`,
            text: `Seçtiğiniz alanların toplam liste bedeli aylık ₺${kpiData.selectedMonthlySum.toLocaleString('tr-TR')}. VIP müşteriye %10 esneklik payı tanımlanabilir.`,
            meta: `AI Fiyatlandırma Optimizasyonu`
          };
        case 'contract':
          return {
            title: `Sözleşme Maddeleri Önerisi`,
            text: `Sözleşme tipi standart kiralama olmalıdır. İptal maddelerine 30 gün önceden yazılı ihbar zorunluluğu eklenmesi finansal riski düşürecektir.`,
            meta: `Hukuki SLA risk tespiti`
          };
        case 'reservation':
          return {
            title: `Takvim Çakışma Analizi`,
            text: `Seçilen tarih aralığında takvimde herhangi bir çakışma görülmemektedir. Rezervasyon yapmaya uygundur.`,
            meta: `Rezervasyon müsaitliği doğrulandı`
          };
        case 'campaign':
          return {
            title: `Kampanya Kitle Hedefleme`,
            text: `Yaz sezonu hedefleri için yaratıcı içeriklerde 'Mavi ve Gökyüzü' renk paletlerinin ağırlıklı kullanılması önerilir.`,
            meta: `Görsel Dönüşüm Analizi`
          };
        case 'finance':
          return {
            title: `Finansal Planlama Önerisi`,
            text: `VIP firma kaydı olduğu için faturalandırmada DBS (Doğrudan Borçlandırma Sistemi) veya 30 gün vadeli Havale önerilir.`,
            meta: `DBS / Kredi limit kontrolü`
          };
        default:
          return {
            title: `İş Akışı Doğrulaması`,
            text: `Tüm adımlar başarıyla doğrulandı. Süreci onayladığınızda tüm veri kayıtları oluşturulup audit loglara aktarılacaktır.`,
            meta: `Audit Loglama Aktif`
          };
      }
    };

    const sug = getAiSuggestions();

    return (
      <div className="dark-glass-card border border-blue-500/10 rounded-2xl p-5 space-y-3.5 shadow-sm shadow-blue-500/5 text-left">
        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1.5 leading-none">
          <Sparkles size={11} className="animate-pulse" />
          {sug.title}
        </span>
        <p className="text-[10.5px] text-slate-350 font-semibold leading-relaxed m-0">
          {sug.text}
        </p>
        <div className="pt-2 border-t border-white/5 text-[8.5px] font-black uppercase text-blue-500">
          {sug.meta}
        </div>
      </div>
    );
  }

  // Step 1: Dates step view with premium calendar inline/popup
  function DatesStep() {
    const [pickerOpen, setPickerOpen] = useState(false);
    const [viewDate, setViewDate] = useState<Date>(() => {
      const parsed = parseStringDate(state.data.dates?.startDate || '06.07.2026');
      return parsed || new Date(2026, 6, 6);
    });
    const [activeInput, setActiveInput] = useState<'start' | 'end'>('start');

    const startVal = state.data.dates?.startDate || '';
    const endVal = state.data.dates?.endDate || '';

    const start = parseStringDate(startVal);
    const end = parseStringDate(endVal);

    const handleDayClick = (dayNum: number) => {
      const clickedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), dayNum);
      if (activeInput === 'start') {
        setState(prev => ({
          ...prev,
          data: {
            ...prev.data,
            dates: {
              startDate: formatDate(clickedDate),
              endDate: ''
            }
          }
        }));
        setActiveInput('end');
      } else {
        if (start && clickedDate < start) {
          setState(prev => ({
            ...prev,
            data: {
              ...prev.data,
              dates: {
                startDate: formatDate(clickedDate),
                endDate: ''
              }
            }
          }));
        } else {
          setState(prev => ({
            ...prev,
            data: {
              ...prev.data,
              dates: {
                startDate: startVal,
                endDate: formatDate(clickedDate)
              }
            }
          }));
          setPickerOpen(false);
        }
      }
    };

    const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

    const prevMonth = () => {
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const renderCalendarGrid = () => {
      const cells = [];
      for (let i = 0; i < firstDay; i++) {
        cells.push(<div key={`empty-${i}`} className="w-8 h-8" />);
      }
      for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
        const currentDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), dayNum);
        
        const isStart = start && currentDate.getTime() === start.getTime();
        const isEnd = end && currentDate.getTime() === end.getTime();
        const isInRange = start && end && currentDate > start && currentDate < end;
        
        let cellClass = "w-8 h-8 rounded-lg flex items-center justify-center text-[10.5px] font-bold transition-all cursor-pointer hover:bg-indigo-650/20 text-slate-300";
        if (isStart || isEnd) {
          cellClass = "w-8 h-8 rounded-lg bg-indigo-600 text-white font-extrabold flex items-center justify-center text-[10.5px] shadow-sm shadow-indigo-600/50";
        } else if (isInRange) {
          cellClass = "w-8 h-8 rounded-lg bg-indigo-950/40 text-indigo-400 font-bold flex items-center justify-center text-[10.5px] border border-indigo-500/10";
        }

        cells.push(
          <button
            key={`day-${dayNum}`}
            type="button"
            onClick={() => handleDayClick(dayNum)}
            className={cellClass}
          >
            {dayNum}
          </button>
        );
      }
      return cells;
    };

    return (
      <div className="space-y-4 relative">
        <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/10 text-left text-[10.5px] text-slate-400 font-semibold leading-relaxed">
          Tarih seçimi yapmak için başlangıç veya bitiş alanına tıklayın. Tarih seçimi tamamlandığında envanter müsaitliği anlık olarak güncellenecektir.
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormGroup className="relative">
            <Label>Kampanya Başlangıç Tarihi *</Label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={startVal}
                onClick={() => {
                  setActiveInput('start');
                  setPickerOpen(true);
                }}
                className="w-full bg-[#0b1329] border border-white/10 hover:border-white/20 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white cursor-pointer select-none outline-none font-semibold"
                placeholder="GG.AA.YYYY"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                <Calendar size={13} />
              </span>
            </div>
          </FormGroup>

          <FormGroup className="relative">
            <Label>Kampanya Bitiş Tarihi *</Label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={endVal}
                onClick={() => {
                  setActiveInput('end');
                  setPickerOpen(true);
                }}
                className="w-full bg-[#0b1329] border border-white/10 hover:border-white/20 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white cursor-pointer select-none outline-none font-semibold"
                placeholder="GG.AA.YYYY"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                <Calendar size={13} />
              </span>
            </div>
          </FormGroup>
        </div>

        {pickerOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setPickerOpen(false)} />
            <div className="fixed inset-x-4 bottom-4 top-20 z-50 bg-[#08111f] border border-white/10 rounded-3xl p-5 shadow-2xl flex flex-col justify-between select-none md:absolute md:inset-auto md:top-full md:left-0 md:mt-2 md:w-72 md:bg-[#0b1329] md:rounded-2xl md:p-4">
              <div className="space-y-4 flex-1 md:flex-initial">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <button
                    type="button"
                    onClick={prevMonth}
                    className="p-1.5 hover:bg-white/5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="text-xs font-black text-white uppercase tracking-wider">
                    {MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}
                  </span>
                  <button
                    type="button"
                    onClick={nextMonth}
                    className="p-1.5 hover:bg-white/5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-black text-slate-500 uppercase tracking-widest">
                  <span>Pt</span><span>Sa</span><span>Ça</span><span>Pe</span><span>Cu</span><span>Ct</span><span>Pa</span>
                </div>

                <div className="grid grid-cols-7 gap-1 justify-items-center">
                  {renderCalendarGrid()}
                </div>
              </div>

              <div className="md:hidden pt-4 border-t border-white/5 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setPickerOpen(false)}
                  className="w-full"
                >
                  Kapat
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Step 2: Available Spaces Interactive Selection Step View
  function SpaceSelectionStep() {
    const handleToggleSpace = (space: AdvertisingSpace) => {
      const isSelected = state.data.selectedSpaces.some(s => s.id === space.id);
      let updated: AdvertisingSpace[];
      if (isSelected) {
        updated = state.data.selectedSpaces.filter(s => s.id !== space.id);
      } else {
        updated = [...state.data.selectedSpaces, space];
      }
      
      setState(prev => ({
        ...prev,
        data: {
          ...prev.data,
          selectedSpaces: updated,
          offer: prev.data.offer ? {
            ...prev.data.offer,
            valueNumeric: updated.reduce((t, s) => t + (parseInt(s.price.replace(/[^0-9]/g, ''), 10) || 0), 0),
            value: `₺` + updated.reduce((t, s) => t + (parseInt(s.price.replace(/[^0-9]/g, ''), 10) || 0), 0).toLocaleString('tr-TR')
          } : null
        }
      }));
    };

    const handleQuickFilter = (type: string) => {
      switch (type) {
        case 'premium':
          setFilters(prev => ({ ...prev, premium: true, led: false, lightbox: false, maxPrice: 3000000 }));
          break;
        case 'visibility':
          setFilters(prev => ({ ...prev, minVisibility: 'Çok Yüksek', premium: false }));
          break;
        case 'budget':
          setFilters(prev => ({ ...prev, maxPrice: 400000, premium: false, led: false }));
          break;
        case 'led':
          setFilters(prev => ({ ...prev, led: true, lightbox: false, premium: false }));
          break;
        case 'duty-free':
          setFilters(prev => ({ ...prev, type: 'CLP', terminal: 'dis-hatlar' }));
          break;
        case 'check-in':
          setFilters(prev => ({ ...prev, terminal: 'ic-hatlar' }));
          break;
        case 'baggage':
          setFilters(prev => ({ ...prev, type: 'Lightbox' }));
          break;
        default:
          break;
      }
    };

    const resetFilters = () => {
      setFilters({
        terminal: 'all',
        floor: 'all',
        type: 'all',
        premium: false,
        led: false,
        lightbox: false,
        digital: false,
        minPrice: 0,
        maxPrice: 3000000,
        minTraffic: 0,
        minVisibility: 'all'
      });
    };

    // Calculate available spaces (without sidebar filtering) to check if completely empty
    const start = state.data.dates?.startDate || '';
    const end = state.data.dates?.endDate || '';
    const allAvailableCount = spacesList.filter(s => 
      reservationRepository.isSpaceAvailableSync(s.id, s.code, start, end)
    ).length;

    if (allAvailableCount === 0) {
      return (
        <div className="dark-glass-card border border-dashed border-rose-500/20 p-8 rounded-3xl text-center select-none space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto text-rose-500">
            <AlertTriangle size={24} />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Müsait Reklam Alanı Bulunamadı</h4>
            <p className="text-[10px] text-slate-500 font-semibold max-w-sm mx-auto leading-relaxed">
              Seçtiğiniz tarih aralığında envanterimizde müsait reklam alanı bulunamadı. Lütfen Step 1 üzerinden tarihleri güncelleyin.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => {
              // Automatically adjust to an alternative date in wizard state
              setState(prev => ({
                ...prev,
                currentStep: 'dates',
                data: {
                  ...prev.data,
                  dates: {
                    startDate: '12.08.2026', // Alternative mock date suggestion
                    endDate: '12.09.2026'
                  }
                }
              }));
            }}
          >
            Alternatif Tarih Öner
          </Button>
        </div>
      );
    }

    const isLedMode = state.data.reklamTipi === 'led';

    const renderLedSpaceSelection = () => {
      const screens = digitalScreenRepository.listScreens();
      const currentScreen = screens.find(s => s.screenId === selectedLedScreenId) || screens[0];
      const availability = digitalScreenRepository.getAvailability(selectedLedScreenId, state.data.dates?.startDate || '06.07.2026', state.data.dates?.endDate || '06.08.2026');

      const loopDuration = currentScreen?.loopDurationSeconds || 120;
      const share = parseFloat(((ledDurationSeconds / loopDuration) * 100).toFixed(1));
      const plays = currentScreen ? digitalScreenRepository.calculateEstimatedPlays(selectedLedScreenId) : 0;
      
      const endD = parseStringDate(state.data.dates?.endDate || '');
      const startD = parseStringDate(state.data.dates?.startDate || '');
      const daysCount = (endD && startD) ? Math.ceil(Math.abs(endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)) + 1 : 30;
      const playsTotal = plays * daysCount;
      
      const calculatedPrice = currentScreen ? digitalScreenRepository.calculateSlotPrice(selectedLedScreenId, ledDurationSeconds, state.data.dates?.startDate || '06.07.2026', state.data.dates?.endDate || '06.08.2026') : 0;

      const handleAddLedSlot = () => {
        const existingSessionSeconds = (state.data.ledSlots || [])
          .filter(s => s.screenId === currentScreen.screenId)
          .reduce((sum, s) => sum + s.durationSeconds, 0);
        
        const trueAvailableSeconds = availability.availableSeconds - existingSessionSeconds;
        
        if (ledDurationSeconds > trueAvailableSeconds) {
          alert(`Bu LED ekranda seçilen tarih aralığında sadece ${trueAvailableSeconds} saniye boş slot var.`);
          return;
        }

        const newSlot = {
          screenId: currentScreen.screenId,
          screenCode: currentScreen.screenCode,
          screenName: currentScreen.name,
          durationSeconds: ledDurationSeconds,
          sharePercent: share,
          estimatedPlaysPerDay: plays,
          estimatedPlaysTotal: playsTotal,
          price: calculatedPrice
        };

        const updatedSlots = [...(state.data.ledSlots || []), newSlot];
        const updatedSpaces = [...state.data.selectedSpaces];
        const spaceObj = spacesList.find(s => s.id === currentScreen.screenId);
        if (spaceObj && !updatedSpaces.some(s => s.id === spaceObj.id)) {
          updatedSpaces.push(spaceObj);
        }

        setState(prev => ({
          ...prev,
          data: {
            ...prev.data,
            ledSlots: updatedSlots,
            selectedSpaces: updatedSpaces,
            offer: prev.data.offer ? {
              ...prev.data.offer,
              valueNumeric: updatedSlots.reduce((sum, s) => sum + s.price, 0),
              value: `₺` + updatedSlots.reduce((sum, s) => sum + s.price, 0).toLocaleString('tr-TR')
            } : null
          }
        }));
      };

      const handleRemoveLedSlot = (index: number) => {
        const removedSlot = (state.data.ledSlots || [])[index];
        const updatedSlots = (state.data.ledSlots || []).filter((_, idx) => idx !== index);
        
        let updatedSpaces = [...state.data.selectedSpaces];
        if (removedSlot) {
          const hasOther = updatedSlots.some(s => s.screenId === removedSlot.screenId);
          if (!hasOther) {
            updatedSpaces = updatedSpaces.filter(s => s.id !== removedSlot.screenId);
          }
        }

        setState(prev => ({
          ...prev,
          data: {
            ...prev.data,
            ledSlots: updatedSlots,
            selectedSpaces: updatedSpaces,
            offer: prev.data.offer ? {
              ...prev.data.offer,
              valueNumeric: updatedSlots.reduce((sum, s) => sum + s.price, 0),
              value: `₺` + updatedSlots.reduce((sum, s) => sum + s.price, 0).toLocaleString('tr-TR')
            } : null
          }
        }));
      };

      return (
        <div className="space-y-5 text-left text-xs">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            <div className="lg:col-span-2 space-y-4">
              <span className="text-[10px] font-black text-white uppercase tracking-wider block">Dijital LED Ekranlar</span>
              <div className="space-y-3">
                {screens.map(s => {
                  const screenAvail = digitalScreenRepository.getAvailability(s.screenId, state.data.dates?.startDate || '06.07.2026', state.data.dates?.endDate || '06.08.2026');
                  const isSelected = selectedLedScreenId === s.screenId;
                  return (
                    <div
                      key={s.screenId}
                      onClick={() => setSelectedLedScreenId(s.screenId)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white dark:bg-[#0b0f19]/30 text-left space-y-2 ${
                        isSelected 
                          ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-md shadow-indigo-600/20' 
                          : 'border-white/5 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[11px] font-black text-blue-450 uppercase">{s.screenCode}</span>
                          <span className="text-[10.5px] font-black text-slate-800 dark:text-white block mt-0.5">{s.name}</span>
                        </div>
                        <span className="text-[10.5px] text-emerald-450 font-black">₺{s.monthlyBasePrice.toLocaleString('tr-TR')} / Ay</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-[8.5px] font-bold text-slate-500 uppercase">
                        <div>M²: <span className="text-white font-extrabold">{s.totalM2} m²</span></div>
                        <div>Çözünürlük: <span className="text-white font-extrabold">{s.resolution.split(' ')[0]}</span></div>
                        <div>Loop: <span className="text-white font-extrabold">{s.loopDurationSeconds} sn</span></div>
                        <div>Boş Saniye: <span className="text-emerald-455 font-extrabold">{screenAvail.availableSeconds} sn</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="p-4 rounded-2xl bg-white/2 border border-white/5 space-y-4">
                <span className="text-[10px] font-black text-white uppercase tracking-wider block">Slot Yapılandırma ({currentScreen.screenCode})</span>
                
                <FormGroup>
                  <Label>Yayın Süresi (Saniye)</Label>
                  <Input 
                    type="number" 
                    value={ledDurationSeconds} 
                    min={1} 
                    max={currentScreen.loopDurationSeconds} 
                    onChange={e => setLedDurationSeconds(parseInt(e.target.value, 10) || 0)} 
                  />
                </FormGroup>

                <div className="p-3.5 bg-slate-950/40 border border-white/5 rounded-xl space-y-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                  <div className="flex justify-between">
                    <span>Müşteri Payı (Share %):</span>
                    <span className="text-white">{share}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Günlük Yayın Adedi:</span>
                    <span className="text-white">{plays} kez / gün</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Toplam Tahmini Yayın:</span>
                    <span className="text-white">{playsTotal} yayın</span>
                  </div>
                  <div className="flex justify-between border-t border-white/5 pt-2">
                    <span>Hesaplanan Fiyat:</span>
                    <span className="text-emerald-450 font-extrabold text-[11px]">₺{calculatedPrice.toLocaleString('tr-TR')}</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  className="w-full bg-blue-650 hover:bg-blue-600 text-white font-bold"
                  onClick={handleAddLedSlot}
                  disabled={ledDurationSeconds > availability.availableSeconds}
                >
                  LED Slotu Ekle
                </Button>
              </div>

              <div className="p-4 rounded-2xl bg-white/2 border border-white/5 space-y-2">
                <span className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest block">Eklenen LED Slotları ({(state.data.ledSlots || []).length})</span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {(state.data.ledSlots || []).map((slot, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 rounded-xl bg-white/2 border border-white/5 text-[9.5px]">
                      <div className="space-y-0.5">
                        <span className="text-white font-black">{slot.screenCode} - {slot.durationSeconds} sn (%{slot.sharePercent})</span>
                        <span className="text-emerald-455 font-bold block">₺{slot.price.toLocaleString('tr-TR')}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveLedSlot(idx)}
                        className="p-1 hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 rounded-lg transition-colors cursor-pointer border-0 bg-transparent"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  {(state.data.ledSlots || []).length === 0 && (
                    <span className="text-[9.5px] text-slate-500 italic block py-2">Henüz LED slotu eklenmedi.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    if (isLedMode) {
      return (
        <div className="space-y-4">
          <FormGroup>
            <Label>Reklam Tipi *</Label>
            <Select
              value={state.data.reklamTipi || 'statik'}
              onChange={e => {
                const type = e.target.value as 'statik' | 'led';
                setState(prev => ({
                  ...prev,
                  data: {
                    ...prev.data,
                    reklamTipi: type,
                    selectedSpaces: type === 'led' ? [] : prev.data.selectedSpaces,
                    ledSlots: type === 'statik' ? [] : prev.data.ledSlots
                  }
                }));
              }}
            >
              <option value="statik">Statik Reklam Alanı (Billboard, Pano, Lightbox)</option>
              <option value="led">Dijital LED Ekran (Playlist Slotu)</option>
            </Select>
          </FormGroup>
          {renderLedSpaceSelection()}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <FormGroup>
          <Label>Reklam Tipi *</Label>
          <Select
            value={state.data.reklamTipi || 'statik'}
            onChange={e => {
              const type = e.target.value as 'statik' | 'led';
              setState(prev => ({
                ...prev,
                data: {
                  ...prev.data,
                  reklamTipi: type,
                  selectedSpaces: type === 'led' ? [] : prev.data.selectedSpaces,
                  ledSlots: type === 'statik' ? [] : prev.data.ledSlots
                }
              }));
            }}
          >
            <option value="statik">Statik Reklam Alanı (Billboard, Pano, Lightbox)</option>
            <option value="led">Dijital LED Ekran (Playlist Slotu)</option>
          </Select>
        </FormGroup>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 text-left">
        {/* Sol Kolon: Filtreler */}
        <div className="lg:col-span-1 space-y-4 bg-white/2 border border-white/5 p-4 rounded-2xl">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-[10px] font-black text-white uppercase tracking-wider flex items-center gap-1.5 leading-none">
              <Filter size={11} className="text-indigo-400" />
              Filtreler
            </span>
            <button onClick={resetFilters} className="text-[8.5px] font-black text-indigo-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer">
              Temizle
            </button>
          </div>

          <div className="space-y-3 text-[10px]">
            <FormGroup>
              <Label>Terminal</Label>
              <Select value={filters.terminal} onChange={(e) => setFilters(prev => ({ ...prev, terminal: e.target.value }))}>
                <option value="all">Tüm Terminaller</option>
                <option value="ic-hatlar">İç Hatlar</option>
                <option value="dis-hatlar">Dış Hatlar</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Kat (Sektör)</Label>
              <Select value={filters.floor} onChange={(e) => setFilters(prev => ({ ...prev, floor: e.target.value }))}>
                <option value="all">Tüm Katlar</option>
                <option value="Giriş">Giriş Katı</option>
                <option value="Lobi">Lobi / Duty Free</option>
                <option value="Kapılar">Kapılar Sektörü</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Alan Tipi</Label>
              <Select value={filters.type} onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}>
                <option value="all">Tüm Tipler</option>
                <option value="LED">LED Ekran</option>
                <option value="CLP">CLP Pano</option>
                <option value="Lightbox">Lightbox</option>
                <option value="Billboard">Billboard</option>
              </Select>
            </FormGroup>

            {/* Boolean checkboxes */}
            <div className="space-y-1.5 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={filters.premium} onChange={(e) => setFilters(prev => ({ ...prev, premium: e.target.checked }))} className="w-3.5 h-3.5 rounded text-indigo-650 focus:ring-indigo-500 border-slate-700 bg-transparent" />
                <span>Premium Alanlar</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={filters.led} onChange={(e) => setFilters(prev => ({ ...prev, led: e.target.checked }))} className="w-3.5 h-3.5 rounded text-indigo-650 focus:ring-indigo-500 border-slate-700 bg-transparent" />
                <span>LED Ekranlar</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={filters.lightbox} onChange={(e) => setFilters(prev => ({ ...prev, lightbox: e.target.checked }))} className="w-3.5 h-3.5 rounded text-indigo-650 focus:ring-indigo-500 border-slate-700 bg-transparent" />
                <span>Lightbox / Pano</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={filters.digital} onChange={(e) => setFilters(prev => ({ ...prev, digital: e.target.checked }))} className="w-3.5 h-3.5 rounded text-indigo-650 focus:ring-indigo-500 border-slate-700 bg-transparent" />
                <span>Dijital Envanterler</span>
              </label>
            </div>

            {/* Price max input */}
            <FormGroup>
              <Label>Maksimum Aylık Fiyat</Label>
              <Input type="number" value={filters.maxPrice} onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value, 10) || 3000000 }))} />
            </FormGroup>

            {/* Visibility level */}
            <FormGroup>
              <Label>Görünürlük Seviyesi</Label>
              <Select value={filters.minVisibility} onChange={(e) => setFilters(prev => ({ ...prev, minVisibility: e.target.value }))}>
                <option value="all">Tümü</option>
                <option value="Çok Yüksek">Çok Yüksek</option>
                <option value="Yüksek">Yüksek</option>
                <option value="Orta">Orta</option>
              </Select>
            </FormGroup>
          </div>

          {/* Quick Filters */}
          <div className="pt-2 border-t border-white/5 space-y-2">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Hızlı Filtreler</span>
            <div className="flex flex-wrap gap-1">
              {[
                { key: 'premium', label: 'Premium' },
                { key: 'visibility', label: 'Çok Görünen' },
                { key: 'budget', label: 'Bütçe Dostu' },
                { key: 'led', label: 'LED Ekran' },
                { key: 'duty-free', label: 'Duty Free' },
                { key: 'check-in', label: 'Check-in' },
                { key: 'baggage', label: 'Bagaj Alım' }
              ].map(q => (
                <button
                  key={q.key}
                  type="button"
                  onClick={() => handleQuickFilter(q.key)}
                  className="px-2 py-0.8 rounded bg-white/3 border border-white/5 text-[8px] font-bold text-slate-400 hover:text-white hover:bg-indigo-650/20 hover:border-indigo-500/20 transition-all cursor-pointer"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orta Kolon: Terminal Haritası + Kart Görünümü */}
        <div className="lg:col-span-2 space-y-5">
          {/* Terminal Haritası */}
          <div className="relative w-full h-[280px] rounded-2xl bg-[#090d1f] border border-white/5 overflow-hidden shadow-inner">
            <div className="absolute inset-0 blueprint-grid opacity-30" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/80 pointer-events-none" />

            <svg className="absolute inset-0 w-full h-full text-blue-500/10" viewBox="0 0 800 400" fill="none">
              <rect x="50" y="40" width="700" height="320" rx="30" stroke="currentColor" strokeWidth="2" strokeDasharray="6 3" />
              <line x1="280" y1="40" x2="280" y2="360" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 4" />
              <line x1="560" y1="40" x2="560" y2="360" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 4" />
              
              <rect x="80" y="80" width="160" height="240" rx="15" stroke="currentColor" strokeWidth="0.8" />
              <rect x="310" y="80" width="220" height="100" rx="15" stroke="currentColor" strokeWidth="0.8" />
              <rect x="310" y="220" width="220" height="100" rx="15" stroke="currentColor" strokeWidth="0.8" />
              <rect x="590" y="80" width="130" height="240" rx="15" stroke="currentColor" strokeWidth="0.8" />

              <text x="160" y="200" fill="currentColor" opacity="0.25" textAnchor="middle" className="text-[9px] font-black uppercase tracking-wider">İÇ HATLAR GİRİŞ</text>
              <text x="420" y="130" fill="currentColor" opacity="0.25" textAnchor="middle" className="text-[9px] font-black uppercase tracking-wider">PASAPORT SEKTÖRÜ</text>
              <text x="420" y="270" fill="currentColor" opacity="0.25" textAnchor="middle" className="text-[9px] font-black uppercase tracking-wider">DUTY FREE SEKTÖRÜ</text>
              <text x="655" y="200" fill="currentColor" opacity="0.25" textAnchor="middle" className="text-[9px] font-black uppercase tracking-wider">DIŞ HATLAR</text>
            </svg>

            {/* Dynamic Available Status Pins */}
            {filteredAvailableSpaces.map(s => {
              const coords = SPACE_COORDINATES[s.code] || { top: '50%', left: '50%' };
              const isSelected = state.data.selectedSpaces.some(selected => selected.id === s.id);
              const isPrem = isPremiumSpace(s);

              const colorClass = isSelected 
                ? 'bg-indigo-600 border-indigo-500 glow-indigo text-white shadow-lg scale-110' 
                : isPrem 
                ? 'bg-blue-500 border-blue-450 glow-blue text-white' 
                : 'bg-emerald-500 border-emerald-450 glow-green text-white';

              return (
                <button
                  key={s.id}
                  type="button"
                  style={{ top: coords.top, left: coords.left }}
                  onClick={() => handleToggleSpace(s)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-20 flex flex-col items-center cursor-pointer border-0 bg-transparent outline-none"
                >
                  <div className={`px-2 py-0.5 rounded-lg border text-[9px] font-black tracking-tighter shadow-md transition-all select-none hover:scale-115 ${colorClass}`}>
                    {s.code}
                  </div>

                  {/* Tooltip */}
                  <div className="absolute bottom-6 scale-0 group-hover:scale-100 transition-all origin-bottom bg-slate-950/95 border border-white/10 rounded-xl p-2.5 shadow-2xl w-48 text-left z-30 pointer-events-none">
                    <span className="text-[9.5px] font-black text-white block truncate uppercase">{s.code} - {s.name}</span>
                    <div className="flex justify-between items-center mt-1.5 pt-1 border-t border-white/5 text-[8.5px]">
                      <span className="text-slate-400 font-bold uppercase">Aylık Fiyat:</span>
                      <span className="text-emerald-400 font-black">{s.price}</span>
                    </div>
                    <div className="flex justify-between items-center mt-0.5 text-[8.5px]">
                      <span className="text-slate-400 font-bold uppercase">Günlük Akış:</span>
                      <span className="text-indigo-400 font-black">{(s.traffic || 0).toLocaleString('tr-TR')}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Kart Görünümü */}
          <div className="space-y-3.5">
            <span className="text-[10px] font-black text-white uppercase tracking-wider block">Müsait Reklam Alanları Kartları ({filteredAvailableSpaces.length})</span>
            {filteredAvailableSpaces.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl text-slate-500 text-xs font-bold bg-[#08111f]/40">
                Filtre koşullarına uyan müsait alan bulunamadı. Filtreleri temizleyebilirsiniz.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAvailableSpaces.map(s => {
                  const isSelected = state.data.selectedSpaces.some(selected => selected.id === s.id);
                  const isPrem = isPremiumSpace(s);

                  return (
                    <div
                      key={s.id}
                      className={`dark-glass-card p-4 rounded-2xl flex flex-col justify-between text-xs space-y-3 text-left transition-all ${
                        isSelected 
                          ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-md shadow-indigo-600/20' 
                          : 'border-white/5'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-black text-white uppercase">#{s.code}</span>
                            {isPrem && <Badge variant="danger" className="text-[7.5px] py-0">PREMIUM</Badge>}
                            {isSelected && <Badge variant="success" className="text-[7.5px] py-0 bg-indigo-650/40 text-indigo-400 border-indigo-500/20">SEÇİLDİ</Badge>}
                          </div>
                          <span className="text-[10px] font-bold text-slate-200 block truncate mt-0.5 max-w-[140px]">{s.name}</span>
                        </div>
                        <span className="text-[11px] font-black text-emerald-450">{s.price}</span>
                      </div>

                      <div className="space-y-1 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                        <div className="flex justify-between"><span>Lokasyon:</span><span className="text-slate-300 font-semibold">{s.location}</span></div>
                        <div className="flex justify-between"><span>Tip:</span><span className="text-slate-300 font-semibold">{s.type}</span></div>
                        <div className="flex justify-between"><span>Ölçü:</span><span className="text-slate-300 font-semibold">{s.size}</span></div>
                        <div className="flex justify-between"><span>Görünürlük:</span><span className="text-indigo-400 font-bold">{s.visibility}</span></div>
                        <div className="flex justify-between"><span>Yolcu Akışı:</span><span className="text-white font-extrabold">{(s.traffic || 0).toLocaleString('tr-TR')} / Gün</span></div>
                      </div>

                      <Button
                        variant={isSelected ? 'outline' : 'primary'}
                        size="xs"
                        type="button"
                        onClick={() => handleToggleSpace(s)}
                        className="w-full text-[9px] uppercase tracking-wider py-1.5"
                      >
                        {isSelected ? 'Seçimi Kaldır' : 'Alan Seç'}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sağ Kolon: Seçilen Alanlar Özeti + AI Önerileri */}
        <div className="lg:col-span-1 space-y-4">
          <div className="dark-glass-card border border-white/5 p-4.5 rounded-2xl space-y-3.5">
            <span className="text-[10px] font-black text-white uppercase tracking-wider block pb-2 border-b border-white/5">Seçilen Alanlar</span>
            
            <div className="space-y-2 text-[10px] font-bold text-slate-400 uppercase">
              <div className="flex justify-between">
                <span>Toplam Seçilen:</span>
                <span className="text-white font-extrabold">{kpiData.selectedCount} Adet</span>
              </div>
              <div className="flex justify-between">
                <span>Aylık Fiyat:</span>
                <span className="text-emerald-400 font-extrabold">₺{kpiData.selectedMonthlySum.toLocaleString('tr-TR')}</span>
              </div>
              <div className="flex justify-between">
                <span>Premium Alan:</span>
                <span className="text-indigo-400 font-extrabold">{kpiData.premiumSelected} Adet</span>
              </div>
            </div>

            {state.data.selectedSpaces.length === 0 ? (
              <div className="p-4 text-center text-slate-500 font-bold border border-dashed border-white/5 rounded-xl text-[9.5px]">
                Henüz bir reklam alanı seçmediniz.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-32 overflow-y-auto scrollbar-thin">
                {state.data.selectedSpaces.map(s => (
                  <div key={s.id} className="flex justify-between items-center p-2 rounded-xl bg-white/2 border border-white/3 text-[9.5px]">
                    <span className="text-white font-black uppercase">#{s.code} - {s.price}</span>
                    <button
                      type="button"
                      onClick={() => handleToggleSpace(s)}
                      className="p-1 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer border-0 bg-transparent outline-none"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <WorkflowAiPanel />
        </div>
      </div>
      </div>
    );
  }

  // 3. Company step view
  function CompanyStep() {
    const handleSelectCompany = (cid: string) => {
      const found = companiesList.find(c => c.id === cid);
      if (found) {
        setState(prev => ({
          ...prev,
          data: { 
            ...prev.data, 
            company: found,
            finance: prev.data.finance ? prev.data.finance : {
              paymentMethod: 'Havale/EFT',
              installmentCount: 1,
              billingAddress: `${found.city} (Merkez Ofis)`,
              taxNo: found.taxNo || '',
              taxOffice: found.taxOffice || ''
            }
          }
        }));
      } else {
        setState(prev => ({
          ...prev,
          data: { ...prev.data, company: null }
        }));
      }
    };

    return (
      <div className="space-y-4">
        <FormGroup>
          <Label htmlFor="wizard-company">Müşteri Firma Seçin *</Label>
          <div className="flex gap-2">
            <Select
              id="wizard-company"
              value={state.data.company?.id || ''}
              onChange={(e) => handleSelectCompany(e.target.value)}
            >
              <option value="">Firma Seçin</option>
              {companiesList.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
            <Button
              variant="outline"
              size="sm"
              type="button"
              leftIcon={<Plus size={12} />}
              onClick={() => setIsCompanyModalOpen(true)}
              className="shrink-0"
            >
              Yeni Firma
            </Button>
          </div>
        </FormGroup>

        {state.data.company && (
          <div className="p-4 rounded-2xl bg-white/2 border border-white/5 space-y-3.5 text-xs text-left">
            <h5 className="text-xs font-black uppercase tracking-wider text-white m-0">Firma Profil Kartı</h5>
            <div className="grid grid-cols-2 gap-3.5 text-[10.5px]">
              <div>
                <span className="text-slate-500 font-bold block uppercase">Sektör</span>
                <span className="text-slate-200 font-semibold">{state.data.company.sector}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block uppercase">Şehir</span>
                <span className="text-slate-200 font-semibold">{state.data.company.city}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block uppercase">CRM Segmenti</span>
                <span className="text-slate-200 font-semibold">
                  <Badge variant={state.data.company.crmStatus === 'VIP' ? 'danger' : 'primary'}>
                    {state.data.company.crmStatus}
                  </Badge>
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block uppercase">Web Sitesi</span>
                <span className="text-slate-200 font-semibold truncate block">{state.data.company.website || '-'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block uppercase">Vergi Numarası</span>
                <span className="text-slate-200 font-semibold">{state.data.company.taxNo || '-'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block uppercase">Vergi Dairesi</span>
                <span className="text-slate-200 font-semibold">{state.data.company.taxOffice || '-'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Step 4: Offer Step View
  function OfferStep() {
    const totalSuggest = calculateTotalSpacesPrice();

    useEffect(() => {
      if (!state.data.offer) {
        setState(prev => ({
          ...prev,
          data: {
            ...prev.data,
            offer: {
              campaignName: prev.data.company ? `${prev.data.company.name} Lansmanı` : 'Yeni Lansman Kampanyası',
              valueNumeric: totalSuggest,
              value: `₺` + totalSuggest.toLocaleString('tr-TR'),
              closeProbability: 75,
              closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR'),
              notes: ''
            }
          }
        }));
      }
    }, []);

    const handleChangeOfferField = (field: string, val: any) => {
      setState(prev => ({
        ...prev,
        data: {
          ...prev.data,
          offer: prev.data.offer ? {
            ...prev.data.offer,
            [field]: val
          } : {
            campaignName: '',
            valueNumeric: 0,
            value: '',
            closeProbability: 50,
            closingDate: '',
            notes: '',
            [field]: val
          }
        }
      }));
    };

    if (!state.data.offer) return null;

    return (
      <div className="space-y-4">
        <FormGroup>
          <Label htmlFor="wizard-offer-camp">Kampanya / Teklif Adı *</Label>
          <Input
            id="wizard-offer-camp"
            value={state.data.offer.campaignName}
            onChange={(e) => handleChangeOfferField('campaignName', e.target.value)}
            placeholder="Kampanya adını girin"
            required
          />
        </FormGroup>

        <div className="grid grid-cols-2 gap-4">
          <FormGroup>
            <Label htmlFor="wizard-offer-val-num">Bütçe Değeri (Sayısal) *</Label>
            <Input
              id="wizard-offer-val-num"
              type="number"
              value={state.data.offer.valueNumeric}
              onChange={(e) => {
                const valNum = parseInt(e.target.value, 10) || 0;
                handleChangeOfferField('valueNumeric', valNum);
                handleChangeOfferField('value', `₺` + valNum.toLocaleString('tr-TR'));
              }}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="wizard-offer-val-text">Teklif Bedeli (Metin) *</Label>
            <Input
              id="wizard-offer-val-text"
              value={state.data.offer.value}
              onChange={(e) => handleChangeOfferField('value', e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="wizard-offer-prob">Kapanış Olasılığı (%) *</Label>
            <Input
              id="wizard-offer-prob"
              type="number"
              min="0"
              max="100"
              value={state.data.offer.closeProbability}
              onChange={(e) => handleChangeOfferField('closeProbability', parseInt(e.target.value, 10) || 0)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="wizard-offer-date">Kapanış Tarihi *</Label>
            <Input
              id="wizard-offer-date"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={state.data.offer.closingDate}
              onChange={(e) => handleChangeOfferField('closingDate', e.target.value)}
              required
            />
          </FormGroup>
        </div>

        <FormGroup>
          <Label htmlFor="wizard-offer-notes">Teklif Detay Notu</Label>
          <Textarea
            id="wizard-offer-notes"
            value={state.data.offer.notes}
            onChange={(e) => handleChangeOfferField('notes', e.target.value)}
            placeholder="Teklife ait notlar..."
            rows={3}
          />
        </FormGroup>
      </div>
    );
  }

  // Step 5: Contract Step View
  function ContractStep() {
    const handleChangeContractField = (field: string, val: any) => {
      setState(prev => ({
        ...prev,
        data: {
          ...prev.data,
          contract: prev.data.contract ? {
            ...prev.data.contract,
            [field]: val
          } : {
            contractNo: '',
            startDate: '',
            endDate: '',
            notes: '',
            [field]: val
          }
        }
      }));
    };

    if (!state.data.contract) return null;

    return (
      <div className="space-y-4">
        <FormGroup>
          <Label htmlFor="wizard-contract-no">Sözleşme Numarası *</Label>
          <Input
            id="wizard-contract-no"
            value={state.data.contract.contractNo}
            onChange={(e) => handleChangeContractField('contractNo', e.target.value)}
            placeholder="SOZ-2026-XXXX"
            required
          />
        </FormGroup>

        <div className="grid grid-cols-2 gap-4">
          <FormGroup>
            <Label htmlFor="wizard-contract-start">Başlangıç Tarihi *</Label>
            <Input
              id="wizard-contract-start"
              value={state.data.contract.startDate}
              onChange={(e) => handleChangeContractField('startDate', e.target.value)}
              placeholder="06.07.2026"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="wizard-contract-end">Bitiş Tarihi *</Label>
            <Input
              id="wizard-contract-end"
              value={state.data.contract.endDate}
              onChange={(e) => handleChangeContractField('endDate', e.target.value)}
              placeholder="06.09.2026"
              required
            />
          </FormGroup>
        </div>

        <FormGroup>
          <Label htmlFor="wizard-contract-notes">Sözleşme Özel Notları</Label>
          <Textarea
            id="wizard-contract-notes"
            value={state.data.contract.notes}
            onChange={(e) => handleChangeContractField('notes', e.target.value)}
            placeholder="Şartlar..."
            rows={3}
          />
        </FormGroup>
      </div>
    );
  }

  // Step 6: Reservation Step View
  function ReservationStep() {
    const handleChangeReservationField = (field: string, val: any) => {
      setState(prev => ({
        ...prev,
        data: {
          ...prev.data,
          reservation: prev.data.reservation ? {
            ...prev.data.reservation,
            [field]: val
          } : {
            startDate: '',
            endDate: '',
            notes: '',
            [field]: val
          }
        }
      }));
    };

    if (!state.data.reservation) return null;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormGroup>
            <Label htmlFor="wizard-res-start">Rezervasyon Başlangıç *</Label>
            <Input
              id="wizard-res-start"
              value={state.data.reservation.startDate}
              onChange={(e) => handleChangeReservationField('startDate', e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="wizard-res-end">Rezervasyon Bitiş *</Label>
            <Input
              id="wizard-res-end"
              value={state.data.reservation.endDate}
              onChange={(e) => handleChangeReservationField('endDate', e.target.value)}
              required
            />
          </FormGroup>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/10 flex items-start gap-2.5">
          <ShieldCheck size={16} className="text-emerald-450 shrink-0 mt-0.5" />
          <div className="text-left space-y-0.5 text-[10.5px]">
            <span className="text-white font-extrabold uppercase block tracking-wider leading-none">Çakışma Kontrolü</span>
            <p className="text-slate-400 font-semibold m-0 mt-1 leading-normal">
              Seçilen reklam alanlarının hepsi belirtilen tarih aralığında boştadır. Herhangi bir rezervasyon çakışması bulunmadı.
            </p>
          </div>
        </div>

        <FormGroup>
          <Label htmlFor="wizard-res-notes">Takvim Açıklama Notu</Label>
          <Textarea
            id="wizard-res-notes"
            value={state.data.reservation.notes}
            onChange={(e) => handleChangeReservationField('notes', e.target.value)}
            placeholder="Rezervasyon notları..."
            rows={3}
          />
        </FormGroup>
      </div>
    );
  }

  // Step 7: Campaign Step View
  function CampaignStep() {
    useEffect(() => {
      if (!state.data.campaign) {
        setState(prev => ({
          ...prev,
          data: {
            ...prev.data,
            campaign: {
              name: prev.data.offer?.campaignName || 'Yeni Kampanya',
              budget: prev.data.offer?.value || '',
              objective: 'Marka Bilinirliği',
              targetAudience: ''
            }
          }
        }));
      }
    }, [state.data.offer]);

    const handleChangeCampaignField = (field: string, val: any) => {
      setState(prev => ({
        ...prev,
        data: {
          ...prev.data,
          campaign: prev.data.campaign ? {
            ...prev.data.campaign,
            [field]: val
          } : {
            name: '',
            budget: '',
            objective: '',
            targetAudience: '',
            [field]: val
          }
        }
      }));
    };

    if (!state.data.campaign) return null;

    return (
      <div className="space-y-4">
        <FormGroup>
          <Label htmlFor="wizard-camp-name">Yayınlanacak Kampanya Adı *</Label>
          <Input
            id="wizard-camp-name"
            value={state.data.campaign.name}
            onChange={(e) => handleChangeCampaignField('name', e.target.value)}
            required
          />
        </FormGroup>

        <div className="grid grid-cols-2 gap-4">
          <FormGroup>
            <Label htmlFor="wizard-camp-budget">Kampanya Bütçesi *</Label>
            <Input
              id="wizard-camp-budget"
              value={state.data.campaign.budget}
              onChange={(e) => handleChangeCampaignField('budget', e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="wizard-camp-obj">Kampanya Hedefi *</Label>
            <Select
              id="wizard-camp-obj"
              value={state.data.campaign.objective}
              onChange={(e) => handleChangeCampaignField('objective', e.target.value)}
            >
              <option value="Marka Bilinirliği">Marka Bilinirliği (Awareness)</option>
              <option value="Lansman">Yeni Ürün Lansmanı (Launch)</option>
              <option value="Satış Dönüşümü">Satış Dönüşümü (Conversion)</option>
              <option value="Trafik Artışı">Mağaza/Web Trafiği (Traffic)</option>
            </Select>
          </FormGroup>
        </div>

        <FormGroup>
          <Label htmlFor="wizard-camp-audience">Hedef Kitle Tanımı</Label>
          <Input
            id="wizard-camp-audience"
            value={state.data.campaign.targetAudience}
            onChange={(e) => handleChangeCampaignField('targetAudience', e.target.value)}
            placeholder="Hedef kitle..."
          />
        </FormGroup>
      </div>
    );
  }

  // Step 8: Finance Step View
  function FinanceStep() {
    const handleChangeFinanceField = (field: string, val: any) => {
      setState(prev => ({
        ...prev,
        data: {
          ...prev.data,
          finance: prev.data.finance ? {
            ...prev.data.finance,
            [field]: val
          } : {
            paymentMethod: 'Havale/EFT',
            installmentCount: 1,
            billingAddress: '',
            taxNo: '',
            taxOffice: '',
            [field]: val
          }
        }
      }));
    };

    if (!state.data.finance) return null;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormGroup>
            <Label htmlFor="wizard-fin-method">Fatura Ödeme Yöntemi *</Label>
            <Select
              id="wizard-fin-method"
              value={state.data.finance.paymentMethod}
              onChange={(e) => handleChangeFinanceField('paymentMethod', e.target.value)}
            >
              <option value="Havale/EFT">Havale/EFT</option>
              <option value="Kredi Kartı">Kredi Kartı</option>
              <option value="Çek">Çek (Vadeli)</option>
              <option value="DBS">DBS (Doğrudan Borçlandırma)</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="wizard-fin-inst">Taksit Sayısı *</Label>
            <Select
              id="wizard-fin-inst"
              value={state.data.finance.installmentCount}
              onChange={(e) => handleChangeFinanceField('installmentCount', parseInt(e.target.value, 10) || 1)}
            >
              <option value="1">Tek Çekim (Peşin)</option>
              <option value="3">3 Taksit</option>
              <option value="6">6 Taksit</option>
              <option value="12">12 Taksit</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="wizard-fin-tax-no">Fatura Vergi Numarası</Label>
            <Input
              id="wizard-fin-tax-no"
              value={state.data.finance.taxNo}
              onChange={(e) => handleChangeFinanceField('taxNo', e.target.value)}
              placeholder="10 Haneli No"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="wizard-fin-tax-office">Vergi Dairesi</Label>
            <Input
              id="wizard-fin-tax-office"
              value={state.data.finance.taxOffice}
              onChange={(e) => handleChangeFinanceField('taxOffice', e.target.value)}
              placeholder="Vergi Dairesi"
            />
          </FormGroup>
        </div>

        <FormGroup>
          <Label htmlFor="wizard-fin-addr">Fatura Tebligat Adresi *</Label>
          <Textarea
            id="wizard-fin-addr"
            value={state.data.finance.billingAddress}
            onChange={(e) => handleChangeFinanceField('billingAddress', e.target.value)}
            placeholder="Adres..."
            rows={2.5}
            required
          />
        </FormGroup>
      </div>
    );
  }

  function WorkflowSummaryStep() {
    const { dates, company, selectedSpaces, offer, contract, reservation, campaign, finance, reklamTipi, ledSlots } = state.data;
    if (!dates || !company || (reklamTipi === 'led' ? (!ledSlots || ledSlots.length === 0) : selectedSpaces.length === 0) || !offer || !contract || !reservation || !campaign || !finance) {
      return (
        <div className="p-4 text-center text-rose-500 font-bold">
          Eksik adım bilgisi. Lütfen tüm adımları doldurun.
        </div>
      );
    }

    return (
      <div className="space-y-4 text-xs text-left max-h-[480px] overflow-y-auto pr-1">
        <Notification
          title="Onay Bekleniyor"
          description="Aşağıdaki bilgilerin doğruluğunu onayladıktan sonra satış sürecini başlatabilirsiniz."
          type="info"
        />

        <div className="space-y-3">
          <div className="p-3 bg-white/2 border border-white/5 rounded-xl space-y-1">
            <span className="text-[9.5px] font-black text-indigo-400 uppercase tracking-wider block">Kampanya Tarihleri</span>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div><span className="text-slate-500 font-bold uppercase block">Başlangıç Tarihi</span> <span className="text-white font-extrabold">{dates.startDate}</span></div>
              <div><span className="text-slate-500 font-bold uppercase block">Bitiş Tarihi</span> <span className="text-white font-extrabold">{dates.endDate}</span></div>
            </div>
          </div>

          <div className="p-3 bg-white/2 border border-white/5 rounded-xl space-y-1">
            <span className="text-[9.5px] font-black text-indigo-400 uppercase tracking-wider block">Firma Bilgisi</span>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div><span className="text-slate-500 font-bold uppercase block">Firma Adı</span> <span className="text-white font-extrabold">{company.name}</span></div>
              <div><span className="text-slate-500 font-bold uppercase block">CRM Segment</span> <span className="text-white font-extrabold">{company.crmStatus}</span></div>
            </div>
          </div>

          <div className="p-3 bg-white/2 border border-white/5 rounded-xl space-y-1">
            <span className="text-[9.5px] font-black text-indigo-400 uppercase tracking-wider block">
              {reklamTipi === 'led' ? `Kiralanacak Dijital LED Slotları (${ledSlots?.length || 0})` : `Kiralanacak Alanlar (${selectedSpaces.length})`}
            </span>
            <div className="space-y-1 text-[10px]">
              {reklamTipi === 'led' ? (
                (ledSlots || []).map((slot, idx) => (
                  <div key={idx} className="border-b border-white/3 pb-1.5 last:border-0 last:pb-0 space-y-1">
                    <div className="flex justify-between items-center text-slate-300 font-semibold">
                      <span>{slot.screenCode} - {slot.screenName}</span>
                      <span className="text-emerald-450 font-bold">₺{slot.price.toLocaleString('tr-TR')}</span>
                    </div>
                    <div className="text-[8px] text-slate-550 font-black uppercase tracking-wider">
                      {slot.durationSeconds} saniye yayın • Loop içinde %{slot.sharePercent} pay • Tahmini günlük {slot.estimatedPlaysPerDay} yayın
                    </div>
                  </div>
                ))
              ) : (
                selectedSpaces.map(s => (
                  <div key={s.id} className="flex justify-between items-center text-slate-300 font-semibold border-b border-white/3 pb-1 last:border-0 last:pb-0">
                    <span>#{s.code} - {s.name}</span>
                    <span className="text-emerald-450 font-bold">{s.price}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-3 bg-white/2 border border-white/5 rounded-xl space-y-1">
            <span className="text-[9.5px] font-black text-indigo-400 uppercase tracking-wider block">Teklif & Bütçe Detayları</span>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div><span className="text-slate-500 font-bold uppercase block">Kampanya Adı</span> <span className="text-white font-extrabold">{offer.campaignName}</span></div>
              <div><span className="text-slate-500 font-bold uppercase block">Tahmini Bütçe</span> <span className="text-white font-extrabold">{offer.value}</span></div>
              <div><span className="text-slate-500 font-bold uppercase block">Kapanış İhtimali</span> <span className="text-white font-extrabold">%{offer.closeProbability}</span></div>
            </div>
          </div>

          <div className="p-3 bg-white/2 border border-white/5 rounded-xl space-y-1">
            <span className="text-[9.5px] font-black text-indigo-400 uppercase tracking-wider block">Sözleşme & Rezervasyon</span>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div><span className="text-slate-500 font-bold uppercase block">Sözleşme No</span> <span className="text-white font-extrabold">{contract.contractNo}</span></div>
              <div><span className="text-slate-500 font-bold uppercase block">Sözleşme Süresi</span> <span className="text-white font-extrabold">{contract.startDate} - {contract.endDate}</span></div>
            </div>
          </div>

          <div className="p-3 bg-white/2 border border-white/5 rounded-xl space-y-1">
            <span className="text-[9.5px] font-black text-indigo-400 uppercase tracking-wider block">Finansal Planlama</span>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div><span className="text-slate-500 font-bold uppercase block">Ödeme Şekli</span> <span className="text-white font-extrabold">{finance.paymentMethod}</span></div>
              <div><span className="text-slate-500 font-bold uppercase block">Taksit Sayısı</span> <span className="text-white font-extrabold">{finance.installmentCount} Taksit</span></div>
              <div className="col-span-2"><span className="text-slate-500 font-bold uppercase block">Fatura Adresi</span> <span className="text-slate-300 block truncate">{finance.billingAddress}</span></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Final success result screen
  function WorkflowResult() {
    if (!wizardResult) return null;

    return (
      <div className="dark-glass-card border border-emerald-500/10 p-8 rounded-3xl max-w-xl mx-auto space-y-6 text-center select-none animate-scale-in">
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto">
          <CheckCircle2 size={36} className="text-emerald-500" />
        </div>

        <div className="space-y-1">
          <h3 className="text-md font-black text-white uppercase tracking-wider">Satış Sihirbazı Tamamlandı!</h3>
          <p className="text-[10px] text-slate-400 font-semibold">
            Tüm kayıtlar CRM, teklif, sözleşme, rezervasyon ve fatura veritabanına başarıyla aktarıldı.
          </p>
        </div>

        <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl text-left space-y-2.5 text-[10px] font-semibold text-slate-400">
          <div className="flex justify-between items-center py-1 border-b border-white/3">
            <span>Teklif Kaydı</span>
            <Badge variant="primary" className="font-extrabold uppercase">{wizardResult.offerId}</Badge>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-white/3">
            <span>Sözleşme Kaydı</span>
            <Badge variant="success" className="font-extrabold uppercase">{wizardResult.contractId}</Badge>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-white/3">
            <span>Rezervasyon ID</span>
            <Badge variant="warning" className="font-extrabold uppercase">{wizardResult.reservationId}</Badge>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-white/3">
            <span>Kampanya ID</span>
            <Badge variant="primary" className="font-extrabold uppercase">{wizardResult.campaignId}</Badge>
          </div>
          <div className="flex justify-between items-center py-1">
            <span>Fatura No</span>
            <Badge variant="success" className="font-extrabold uppercase">{wizardResult.invoiceId}</Badge>
          </div>
        </div>

        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            type="button"
            leftIcon={<FolderOpen size={12} />}
            onClick={() => {
              setCurrentRoute('sozlesmeler');
            }}
          >
            Sözleşmelere Git
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="button"
            leftIcon={<ArrowRight size={12} />}
            onClick={() => {
              setCurrentRoute('dashboard');
            }}
          >
            CEO Paneline Dön
          </Button>
        </div>
      </div>
    );
  }

  // Render the current step layout
  const renderStepContent = () => {
    switch (state.currentStep) {
      case 'dates':
        return <DatesStep />;
      case 'spaces':
        return <SpaceSelectionStep />;
      case 'company':
        return <CompanyStep />;
      case 'offer':
        return <OfferStep />;
      case 'contract':
        return <ContractStep />;
      case 'reservation':
        return <ReservationStep />;
      case 'campaign':
        return <CampaignStep />;
      case 'finance':
        return <FinanceStep />;
      case 'summary':
        return <WorkflowSummaryStep />;
      default:
        return <DatesStep />;
    }
  };

  return (
    <div className="space-y-6 text-left select-none pb-12">
      {isSubmitting && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col justify-center items-center z-50 animate-fade-in select-none">
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto" />
            <div className="space-y-1">
              <p className="text-xs font-black text-white uppercase tracking-widest">
                {slowSubmitMsg ? 'İşlem arka planda tamamlanıyor' : 'Satış tamamlanıyor...'}
              </p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                {slowSubmitMsg
                  ? 'Bağlantı yoğunluğu nedeniyle işlem arka planda sürdürülüyor, lütfen bekleyin...'
                  : 'CRM, sözleşme, rezervasyon ve fatura kayıtları oluşturuluyor.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {wizardSuccess && (
        <Notification
          title="Başarılı"
          description={wizardSuccess}
          type="success"
          onClose={() => setWizardSuccess(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 p-5 rounded-3xl border border-white/5 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none flex items-center gap-1.5">
            <Sparkles size={14} className="text-indigo-400 animate-pulse" />
            Yeni Satış Sihirbazı
          </h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            CRM firma seçiminden faturalandırmaya kadar tüm süreci tek bir iş akışı ekranında yönetin.
          </p>
        </div>
        <div className="flex gap-2 text-[10px] font-black uppercase text-indigo-400 bg-indigo-500/10 border border-indigo-500/15 px-3 py-1.5 rounded-xl">
          Satış Workflow Modülü v1.0
        </div>
      </div>

      {!wizardResult ? (
        <>
          {/* KPI Bar */}
          <WizardKpiBar />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Stepper on the left */}
            <div className="lg:col-span-1 space-y-4">
              <WizardStepper />
              <WorkflowAiPanel />
            </div>

            {/* Step Content in the middle */}
            <div className="lg:col-span-3">
              <div className="dark-glass-card border border-white/5 rounded-2xl p-5 flex flex-col justify-between min-h-[480px]">
                <div className="space-y-4 flex-1">
                  <div className="pb-3 border-b border-white/5 flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-wider m-0">
                        {WIZARD_STEPS.find(s => s.id === state.currentStep)?.label}
                      </h4>
                      <span className="text-[9px] font-semibold text-slate-500 block uppercase mt-0.5">
                        {WIZARD_STEPS.find(s => s.id === state.currentStep)?.description}
                      </span>
                    </div>
                    <Badge variant="primary" className="font-extrabold uppercase">
                      Adım {currentStepIndex + 1} / 9
                    </Badge>
                  </div>

                  {wizardError && (
                    <Notification
                      title="Hata"
                      description={wizardError}
                      type="alert"
                      onClose={() => setWizardError(null)}
                    />
                  )}

                  {/* Active Step Content */}
                  <div className="py-2">
                    {renderStepContent()}
                  </div>
                </div>

                {/* Navigation actions */}
                <div className="pt-4 border-t border-white/5 flex justify-between items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={goToPrevStep}
                    disabled={currentStepIndex === 0}
                    leftIcon={<ChevronLeft size={13} />}
                  >
                    Geri
                  </Button>

                  {state.currentStep === 'summary' ? (
                    <Button
                      variant="primary"
                      size="sm"
                      type="button"
                      onClick={commitWorkflow}
                      loading={isSubmitting}
                      rightIcon={<CheckCircle2 size={13} />}
                    >
                      Satışı Tamamla
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      type="button"
                      onClick={goToNextStep}
                      rightIcon={<ChevronRight size={13} />}
                    >
                      İleri
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Result Screen */
        <WorkflowResult />
      )}

      {/* New Company creation modal fallback */}
      <CompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        onSuccess={handleCompanySuccess}
      />
    </div>
  );
}
