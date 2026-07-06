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
  FolderOpen
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/design-system/Button';
import { Label, Input, Select, Textarea, FormGroup } from '@/components/design-system/Form';
import { Notification } from '@/components/design-system/Notification';
import { Badge } from '@/components/design-system/Badge';
import { 
  companyRepository, 
  spaceRepository,
  activityLogRepository 
} from '@/repositories';
import { Company } from '@/data/companies';
import { AdvertisingSpace } from '@/data/advertisingSpaces';
import { WIZARD_STEPS } from '@/data/salesWizard';
import { workflowService } from '@/services/workflowService';
import { WizardStepId, WorkflowState } from '@/types/workflow';
import { CompanyModal } from '@/components/design-system/CompanyModal';

export function SalesWizard() {
  const { setCurrentRoute } = useApp();
  
  // Repos data load
  const [companiesList, setCompaniesList] = useState<Company[]>([]);
  const [spacesList, setSpacesList] = useState<AdvertisingSpace[]>([]);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  // Initial Workflow state
  const [state, setState] = useState<WorkflowState>({
    currentStep: 'company',
    completedSteps: [],
    data: {
      company: null,
      selectedSpaces: [],
      offer: null,
      contract: null,
      reservation: null,
      campaign: null,
      finance: null
    }
  });

  const [wizardResult, setWizardResult] = useState<any | null>(null);
  const [wizardError, setWizardError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch initial list of companies and spaces
  useEffect(() => {
    async function loadData() {
      try {
        const comps = await companyRepository.list();
        const spaces = await spaceRepository.list();
        setCompaniesList(comps);
        setSpacesList(spaces);
      } catch (e) {
        console.error('Failed to load companies/spaces for wizard:', e);
      }
    }
    loadData();
  }, []);

  const handleCompanySuccess = async (newCompany: Company) => {
    // Reload list and set as selected
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
    'company',
    'spaces',
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
    if (state.currentStep === 'company' && !state.data.company) {
      setWizardError('Lütfen bir firma seçin veya yeni bir kayıt oluşturun.');
      return;
    }
    if (state.currentStep === 'spaces' && state.data.selectedSpaces.length === 0) {
      setWizardError('Lütfen en az bir reklam alanı seçin.');
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
    setIsSubmitting(true);
    setWizardError(null);
    try {
      const res = await workflowService.commitSalesWorkflow(state);
      if (res.success) {
        setWizardResult(res.data);
      } else {
        setWizardError(res.error || 'Satış süreci kaydedilemedi.');
      }
    } catch (err: any) {
      setWizardError(err.message || 'Bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotalSpacesPrice = (): number => {
    return state.data.selectedSpaces.reduce((total, space) => {
      // Parse monthly price (e.g. ₺1.850.000)
      const cleanNum = parseInt(space.price.replace(/[^0-9]/g, ''), 10) || 0;
      return total + cleanNum;
    }, 0);
  };

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
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="dark-glass-card border border-white/5 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[8.5px] font-black text-slate-500 uppercase tracking-wider">Aktif Müşteri</span>
          <div className="flex items-center gap-1.5 mt-2">
            <Building2 size={13} className="text-indigo-400" />
            <span className="text-xs font-black text-white truncate max-w-[90%]">
              {state.data.company ? state.data.company.name : 'Seçilmedi'}
            </span>
          </div>
        </div>

        <div className="dark-glass-card border border-white/5 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[8.5px] font-black text-slate-500 uppercase tracking-wider">Seçilen Ekranlar</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-sm font-black text-white">{state.data.selectedSpaces.length}</span>
            <span className="text-[8px] text-slate-500 font-bold">Adet</span>
          </div>
        </div>

        <div className="dark-glass-card border border-white/5 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[8.5px] font-black text-slate-500 uppercase tracking-wider">Toplam Fiyat</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-sm font-black text-emerald-450">
              ₺{calculateTotalSpacesPrice().toLocaleString('tr-TR')}
            </span>
            <span className="text-[8px] text-slate-500 font-bold">Aylık</span>
          </div>
        </div>

        <div className="dark-glass-card border border-white/5 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[8.5px] font-black text-slate-500 uppercase tracking-wider">Süreç Aşaması</span>
          <div className="flex items-center gap-1.5 mt-2">
            <Badge variant="primary">
              {WIZARD_STEPS.find(s => s.id === state.currentStep)?.label || '-'}
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  // Sidebar AI Recommendation box
  function WorkflowAiPanel() {
    const getAiSuggestionText = () => {
      switch (state.currentStep) {
        case 'company':
          return "Firma seçildiğinde CRM segment verileri analiz edilip doluluk durumuna göre en verimli teklif şablonu yüklenecektir.";
        case 'spaces':
          return "Tavsiye: THY ve Pegasus gibi havacılık firmaları için havalimanı iç hat CLP ve bagaj LED ekranları %35 daha yüksek dönüşüm skoru vermektedir.";
        case 'offer':
          return "Bütçe Önerisi: Bu reklam alanlarının liste fiyatı toplamı aylık ₺" + calculateTotalSpacesPrice().toLocaleString('tr-TR') + " seviyesindedir. VIP müşteriye %10 esneklik payı eklenebilir.";
        case 'contract':
          return "Sözleşme tipi standart kiralama olmalıdır. İptal maddelerine 30 gün önceden yazılı ihbar zorunluluğu eklenmesi finansal riski düşürecektir.";
        case 'reservation':
          return "Çakışma Analizi: Seçtiğiniz tarih aralıklarında takvimde herhangi bir çakışma görülmemektedir. Rezervasyon yapmaya uygundur.";
        case 'campaign':
          return "Kampanya Analizi: Yaz sezonu hedefleri için yaratıcı içeriklerde 'Mavi ve Gökyüzü' renk paletlerinin ağırlıklı kullanılması önerilir.";
        case 'finance':
          return "Ödeme Şekli: VIP firma kaydı olduğu için faturalandırmada DBS (Doğrudan Borçlandırma Sistemi) veya 30 gün vadeli Havale önerilir.";
        default:
          return "Tüm adımlar doğrulandı. İşlemi onayladığınızda Teklif, Rezervasyon, Kampanya ve Fatura kayıtları otomatik oluşturulacaktır.";
      }
    };

    return (
      <div className="dark-glass-card border border-blue-500/10 rounded-2xl p-5 space-y-3.5 shadow-sm shadow-blue-500/5 text-left">
        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1.5 leading-none">
          <Sparkles size={11} className="animate-pulse" />
          AI Satış Asistanı Önerisi
        </span>
        <p className="text-[10.5px] text-slate-350 font-semibold leading-relaxed m-0">
          {getAiSuggestionText()}
        </p>
        <div className="pt-2 border-t border-white/5 text-[8.5px] font-black uppercase text-blue-500">
          Otomatik Analiz Aktif
        </div>
      </div>
    );
  }

  // 1. Company step view
  function CompanyStep() {
    const handleSelectCompany = (cid: string) => {
      const found = companiesList.find(c => c.id === cid);
      if (found) {
        setState(prev => ({
          ...prev,
          data: { 
            ...prev.data, 
            company: found,
            // Pre-fill finance details from company if available
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

  // 2. Spaces selection step view
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
          // Update offer suggest values
          offer: prev.data.offer ? {
            ...prev.data.offer,
            valueNumeric: updated.reduce((t, s) => t + (parseInt(s.price.replace(/[^0-9]/g, ''), 10) || 0), 0),
            value: `₺` + updated.reduce((t, s) => t + (parseInt(s.price.replace(/[^0-9]/g, ''), 10) || 0), 0).toLocaleString('tr-TR')
          } : null
        }
      }));
    };

    return (
      <div className="space-y-4">
        <Label>Kiralayacak Reklam Alanlarını Seçin *</Label>
        <div className="max-h-60 overflow-y-auto border border-white/10 rounded-2xl p-3.5 space-y-2 bg-[#08111f]/40 scrollbar-thin">
          {spacesList.map(s => {
            const isChecked = state.data.selectedSpaces.some(space => space.id === s.id);
            return (
              <label
                key={s.id}
                className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-white/3 cursor-pointer select-none transition-colors duration-150 text-left"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggleSpace(s)}
                  className="w-4 h-4 rounded text-indigo-650 focus:ring-indigo-500 border-slate-700 bg-transparent"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-white uppercase block">
                      #{s.code} - {s.name}
                    </span>
                    <span className="text-[9.5px] font-black text-emerald-450">
                      {s.price}
                    </span>
                  </div>
                  <span className="text-[8px] font-bold text-slate-500 block uppercase mt-0.5">
                    {s.location} | Tür: {s.type}
                  </span>
                </div>
              </label>
            );
          })}
        </div>

        {state.data.selectedSpaces.length > 0 && (
          <div className="space-y-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Seçilen Ekran Listesi ({state.data.selectedSpaces.length})</span>
            <div className="flex flex-wrap gap-1.5">
              {state.data.selectedSpaces.map(s => (
                <span key={s.id} className="px-2.5 py-1 rounded-xl bg-indigo-950/20 border border-indigo-500/15 text-[9px] font-black text-indigo-400 uppercase tracking-tighter">
                  #{s.code} - {s.price}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. Offer Step View
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
              value={state.data.offer.closingDate}
              onChange={(e) => handleChangeOfferField('closingDate', e.target.value)}
              placeholder="30.07.2025"
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
            placeholder="Teklife ait notlar ve iskonto koşulları..."
            rows={3}
          />
        </FormGroup>
      </div>
    );
  }

  // 4. Contract Step View
  function ContractStep() {
    useEffect(() => {
      if (!state.data.contract) {
        const generatedNo = 'SOZ-2026-' + Math.floor(1000 + Math.random() * 9000);
        setState(prev => ({
          ...prev,
          data: {
            ...prev.data,
            contract: {
              contractNo: generatedNo,
              startDate: new Date().toLocaleDateString('tr-TR'),
              endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR'),
              notes: ''
            }
          }
        }));
      }
    }, []);

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
          <Label htmlFor="wizard-contract-notes">Sözleşme Özel Şartları / Notları</Label>
          <Textarea
            id="wizard-contract-notes"
            value={state.data.contract.notes}
            onChange={(e) => handleChangeContractField('notes', e.target.value)}
            placeholder="Damga vergisi, gecikme cezası ve özel iptal maddeleri..."
            rows={3}
          />
        </FormGroup>
      </div>
    );
  }

  // 5. Reservation Step View
  function ReservationStep() {
    useEffect(() => {
      if (!state.data.reservation && state.data.contract) {
        setState(prev => ({
          ...prev,
          data: {
            ...prev.data,
            reservation: {
              startDate: prev.data.contract?.startDate || '',
              endDate: prev.data.contract?.endDate || '',
              notes: ''
            }
          }
        }));
      }
    }, [state.data.contract]);

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

        {/* Calendar conflict warning mock checks */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/10 flex items-start gap-2.5">
          <ShieldCheck size={16} className="text-emerald-450 shrink-0 mt-0.5" />
          <div className="text-left space-y-0.5 text-[10.5px]">
            <span className="text-white font-extrabold uppercase block tracking-wider leading-none">Takvim Çakışma Kontrolü</span>
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
            placeholder="Görsel değişim periyotları, özel yayın koşulları notu..."
            rows={3}
          />
        </FormGroup>
      </div>
    );
  }

  // 6. Campaign Step View
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
            <Label htmlFor="wizard-camp-obj">Kampanya Hedefi / Amacı *</Label>
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
            placeholder="18-35 yaş, sık seyahat eden beyaz yakalılar..."
          />
        </FormGroup>
      </div>
    );
  }

  // 7. Finance Step View
  function FinanceStep() {
    useEffect(() => {
      if (!state.data.finance && state.data.company) {
        setState(prev => ({
          ...prev,
          data: {
            ...prev.data,
            finance: {
              paymentMethod: 'Havale/EFT',
              installmentCount: 1,
              billingAddress: `${state.data.company?.city} (Merkez Ofis)`,
              taxNo: state.data.company?.taxNo || '',
              taxOffice: state.data.company?.taxOffice || ''
            }
          }
        }));
      }
    }, [state.data.company]);

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
              <option value="3">3 Taksit (Vade farksız)</option>
              <option value="6">6 Taksit</option>
              <option value="12">12 Taksit (Maksimum limit)</option>
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
            placeholder="Fatura tebligat ve e-fatura gönderim adresi..."
            rows={2.5}
            required
          />
        </FormGroup>
      </div>
    );
  }

  // 8. Workflow summary step view
  function WorkflowSummaryStep() {
    const { company, selectedSpaces, offer, contract, reservation, campaign, finance } = state.data;
    if (!company || selectedSpaces.length === 0 || !offer || !contract || !reservation || !campaign || !finance) {
      return (
        <div className="p-4 text-center text-rose-500 font-bold">
          Eksik adım bilgisi. Lütfen tüm adımları tek tek inceleyin.
        </div>
      );
    }

    return (
      <div className="space-y-4 text-xs text-left max-h-[480px] overflow-y-auto pr-1">
        <Notification
          title="Onay Bekleniyor"
          description="Aşağıdaki bilgilerin doğruluğunu onayladıktan sonra satış sürecini başlatabilirsiniz. Sözleşme, fatura, teklif ve kampanya kayıtları oluşturulacaktır."
          type="info"
        />

        <div className="space-y-3">
          {/* Company Details */}
          <div className="p-3 bg-white/2 border border-white/5 rounded-xl space-y-1">
            <span className="text-[9.5px] font-black text-indigo-400 uppercase tracking-wider block">Firma Bilgisi</span>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div><span className="text-slate-500 font-bold uppercase block">Firma Adı</span> <span className="text-white font-extrabold">{company.name}</span></div>
              <div><span className="text-slate-500 font-bold uppercase block">CRM Segment</span> <span className="text-white font-extrabold">{company.crmStatus}</span></div>
            </div>
          </div>

          {/* Spaces Details */}
          <div className="p-3 bg-white/2 border border-white/5 rounded-xl space-y-1">
            <span className="text-[9.5px] font-black text-indigo-400 uppercase tracking-wider block">Kiralanacak Alanlar ({selectedSpaces.length})</span>
            <div className="space-y-1 text-[10px]">
              {selectedSpaces.map(s => (
                <div key={s.id} className="flex justify-between items-center text-slate-300 font-semibold border-b border-white/3 pb-1 last:border-0 last:pb-0">
                  <span>#{s.code} - {s.name}</span>
                  <span className="text-emerald-450 font-bold">{s.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Offer Details */}
          <div className="p-3 bg-white/2 border border-white/5 rounded-xl space-y-1">
            <span className="text-[9.5px] font-black text-indigo-400 uppercase tracking-wider block">Teklif & Bütçe Detayları</span>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div><span className="text-slate-500 font-bold uppercase block">Kampanya Adı</span> <span className="text-white font-extrabold">{offer.campaignName}</span></div>
              <div><span className="text-slate-500 font-bold uppercase block">Tahmini Bütçe</span> <span className="text-white font-extrabold">{offer.value}</span></div>
              <div><span className="text-slate-500 font-bold uppercase block">Kapanış İhtimali</span> <span className="text-white font-extrabold">%{offer.closeProbability}</span></div>
              <div><span className="text-slate-500 font-bold uppercase block">Kapanış Tarihi</span> <span className="text-white font-extrabold">{offer.closingDate}</span></div>
            </div>
          </div>

          {/* Contract Details */}
          <div className="p-3 bg-white/2 border border-white/5 rounded-xl space-y-1">
            <span className="text-[9.5px] font-black text-indigo-400 uppercase tracking-wider block">Sözleşme & Rezervasyon</span>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div><span className="text-slate-500 font-bold uppercase block">Sözleşme No</span> <span className="text-white font-extrabold">{contract.contractNo}</span></div>
              <div><span className="text-slate-500 font-bold uppercase block">Sözleşme Süresi</span> <span className="text-white font-extrabold">{contract.startDate} - {contract.endDate}</span></div>
              <div className="col-span-2"><span className="text-slate-500 font-bold uppercase block">Rezervasyon Notu</span> <span className="text-slate-300 font-semibold">{reservation.notes || 'Yok'}</span></div>
            </div>
          </div>

          {/* Finance details */}
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

        {/* Created entities references */}
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
              // Redirect to contracts
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
              // Redirect to dashboard
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
      case 'company':
        return <CompanyStep />;
      case 'spaces':
        return <SpaceSelectionStep />;
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
        return <CompanyStep />;
    }
  };

  return (
    <div className="space-y-6 text-left select-none pb-12">
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
                      Adım {currentStepIndex + 1} / 8
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
