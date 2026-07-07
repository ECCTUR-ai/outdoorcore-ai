import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Label, FormGroup } from './Form';
import { Button } from './Button';
import { Notification } from './Notification';
import { offerSchema, OfferFormData } from '@/utils/schemas';
import { zodResolver } from '@/utils/resolver';
import { offerRepository, companyRepository, spaceRepository } from '@/repositories';
import { Company } from '@/data/companies';
import { AdvertisingSpace } from '@/data/advertisingSpaces';
import { Offer } from '@/data/offers';
import { X, Sparkles } from 'lucide-react';

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (offer: Offer) => void;
  offer?: Offer;
}

const STAGE_CONFIGS: Record<Offer['stage'], { label: string; bg: string; border: string; text: string }> = {
  'Lead': { label: 'Lead', bg: 'bg-slate-500/10', border: 'border-slate-500/20', text: 'text-slate-400' },
  'İlk Görüşme': { label: 'İlk Görüşme', bg: 'bg-slate-500/10', border: 'border-slate-500/20', text: 'text-slate-400' },
  'İhtiyaç Analizi': { label: 'İhtiyaç Analizi', bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' },
  'Teklif Hazırlandı': { label: 'Hazırlanıyor', bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400' },
  'Sunum Yapıldı': { label: 'Sunum Yapıldı', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400' },
  'Pazarlık': { label: 'Pazarlık', bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400' },
  'Onay Bekleniyor': { label: 'Onay Bekliyor', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400' },
  'Sözleşme': { label: 'Sözleşme', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
  'Rezervasyon': { label: 'Rezervasyon', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
  'Tamamlandı': { label: 'Kazanıldı', bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-400' }
};

const formatToInputDate = (dateStr: string): string => {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  
  const dots = dateStr.split('.');
  if (dots.length === 3) {
    const d = dots[0].padStart(2, '0');
    const m = dots[1].padStart(2, '0');
    const y = dots[2];
    return `${y}-${m}-${d}`;
  }

  const parts = dateStr.split(' ');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const year = parts[2];
    const monthName = parts[1].toLowerCase();
    
    const months: Record<string, string> = {
      'ocak': '01', 'oca': '01',
      'şubat': '02', 'sub': '02', 'şub': '02',
      'mart': '03', 'mar': '03',
      'nisan': '04', 'nis': '04',
      'mayıs': '05', 'may': '05',
      'haziran': '06', 'haz': '06',
      'temmuz': '07', 'tem': '07',
      'ağustos': '08', 'agu': '08', 'ağu': '08',
      'eylül': '09', 'eyl': '09',
      'ekim': '10', 'eki': '10',
      'kasım': '11', 'kas': '11',
      'aralık': '12', 'ara': '12'
    };
    
    const month = months[monthName] || '01';
    return `${year}-${month}-${day}`;
  }
  return new Date().toISOString().split('T')[0];
};

function CustomSelect({
  label,
  value,
  onChange,
  options,
  error,
  placeholder = 'Seçin'
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(o => o.value === value);

  return (
    <FormGroup className="relative">
      <Label>{label}</Label>
      <div
        className={`h-[52px] bg-[#151B2D] border ${error ? 'border-red-500/50' : 'border-white/8'} rounded-xl px-4 flex items-center justify-between cursor-pointer select-none transition-all duration-200 text-white ${isOpen ? 'shadow-[0_0_12px_rgba(59,130,246,0.25)] border-blue-500/50' : 'hover:border-white/15'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? 'text-white text-xs font-semibold' : 'text-white/35 font-semibold text-xs'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={`text-[10px] text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </div>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[102]" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 top-[84px] bg-[#121826] border border-white/8 rounded-xl mt-1.5 max-h-60 overflow-y-auto z-[103] shadow-2xl animate-scale-in scrollbar-thin">
            {options.map(opt => (
              <div
                key={opt.value}
                className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-350 hover:bg-white/5 hover:text-white cursor-pointer select-none transition-colors duration-150 ${opt.value === value ? 'bg-blue-600/10 text-blue-400 font-bold' : ''}`}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </>
      )}
      {error && <span className="text-[10px] text-red-500 font-bold mt-1 block">{error}</span>}
    </FormGroup>
  );
}

export function OfferModal({ isOpen, onClose, onSuccess, offer }: OfferModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [companies, setCompanies] = useState<Company[]>([]);
  const [spaces, setSpaces] = useState<AdvertisingSpace[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      companyId: '',
      campaignName: '',
      value: '',
      valueNumeric: 0,
      stage: 'Lead',
      closeProbability: 50,
      closingDate: '',
      owner: 'Cemil Sezgin',
      spaceIds: [],
      details: '',
      notes: '',
      discountRate: 0,
      customerBudget: 0
    }
  });

  const selectedSpaceIds = watch('spaceIds') || [];
  const discountRate = watch('discountRate') || 0;
  const customerBudget = watch('customerBudget') || 0;

  // Fetch Companies & Spaces
  useEffect(() => {
    async function loadData() {
      try {
        const [companyList, spaceList] = await Promise.all([
          companyRepository.list(),
          spaceRepository.list()
        ]);
        setCompanies(companyList);
        setSpaces(spaceList);
      } catch (e) {
        console.error('Failed to load companies/spaces inside OfferModal:', e);
      }
    }
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  // Set default form values
  useEffect(() => {
    if (isOpen) {
      setSubmitError(null);
      setSubmitSuccess(false);
      if (offer) {
        let resolvedSpaceIds = offer.spaceIds || [];
        if (resolvedSpaceIds.length === 0 && offer.spacesList && spaces.length > 0) {
          resolvedSpaceIds = offer.spacesList
            .map(code => spaces.find(s => s.code === code)?.id)
            .filter((id): id is string => !!id);
        }

        reset({
          companyId: offer.companyId || '',
          campaignName: offer.campaignName,
          value: offer.value,
          valueNumeric: offer.valueNumeric,
          stage: offer.stage,
          closeProbability: offer.closeProbability,
          closingDate: formatToInputDate(offer.closingDate || ''),
          owner: offer.owner,
          spaceIds: resolvedSpaceIds,
          details: offer.details || '',
          notes: offer.notes || '',
          discountRate: offer.discount_rate || 0,
          customerBudget: offer.customer_budget || 0
        });
      } else {
        reset({
          companyId: '',
          campaignName: '',
          value: '',
          valueNumeric: 0,
          stage: 'Lead',
          closeProbability: 50,
          closingDate: new Date().toISOString().split('T')[0],
          owner: 'Cemil Sezgin',
          spaceIds: [],
          details: '',
          notes: '',
          discountRate: 0,
          customerBudget: 0
        });
      }
    }
  }, [isOpen, offer, reset, spaces]);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const handleSpaceToggle = (spaceId: string) => {
    const current = [...selectedSpaceIds];
    const idx = current.indexOf(spaceId);
    if (idx > -1) {
      current.splice(idx, 1);
    } else {
      current.push(spaceId);
    }
    setValue('spaceIds', current, { shouldValidate: true });
  };

  const handleSaveDraft = () => {
    setValue('stage', 'Lead');
    handleSubmit(onSubmit)();
  };

  // Calculations for sticky summary card
  const selectedSpacesData = selectedSpaceIds
    .map(id => spaces.find(s => s.id === id))
    .filter((s): s is AdvertisingSpace => !!s);

  const totalM2 = selectedSpacesData.reduce((sum, s) => {
    const spaceAny = s as any;
    if (spaceAny.totalM2) return sum + spaceAny.totalM2;
    const numbers = (s.size || '').replace(/,/g, '.').match(/\d+(\.\d+)?/g);
    if (numbers && numbers.length >= 2) {
      const w = parseFloat(numbers[0]);
      const h = parseFloat(numbers[1]);
      if (!isNaN(w) && !isNaN(h)) return sum + parseFloat((w * h).toFixed(1));
    }
    return sum;
  }, 0);

  const listPriceTotal = selectedSpacesData.reduce((sum, s) => {
    const p = parseInt((s.price || '').replace(/[^0-9]/g, ''), 10) || 0;
    return sum + p;
  }, 0);

  const discountAmount = Math.round(listPriceTotal * discountRate / 100);
  const netAmount = listPriceTotal - discountAmount;
  const vatAmount = Math.round(netAmount * 0.20);
  const grandTotal = netAmount + vatAmount;
  const totalTraffic = selectedSpacesData.reduce((sum, s) => sum + (s.traffic || 0), 0);

  const onSubmit = async (data: OfferFormData) => {
    setLoading(true);
    setSubmitError(null);
    try {
      // Synchronize valueNumeric and value to netAmount before sending to repo
      const finalData = {
        ...data,
        valueNumeric: netAmount,
        value: `₺ ${netAmount.toLocaleString('tr-TR')}`,
        discountRate: discountRate,
        discountAmount: discountAmount,
        netAmount: netAmount,
        vatAmount: vatAmount,
        grandTotal: grandTotal,
        customerBudget: customerBudget
      };

      let result;
      if (offer) {
        result = await offerRepository.update(offer.id, finalData);
      } else {
        result = await offerRepository.create(finalData);
      }
      setSubmitSuccess(true);
      setTimeout(() => {
        onSuccess(result);
        onClose();
      }, 800);
    } catch (err: any) {
      setSubmitError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Premium Glassmorphism Container */}
      <div className="relative w-full max-w-[1350px] max-h-[90vh] flex flex-col transform overflow-hidden rounded-[24px] border border-white/8 bg-[#0b0f19]/95 backdrop-blur-xl text-left shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-all animate-scale-in duration-200 z-[101] text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 px-8 pt-7 pb-5 shrink-0">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none flex items-center gap-1.5">
              <Sparkles size={14} className="text-blue-400 animate-pulse animate-duration-1000" />
              {offer ? 'Teklifi Düzenle' : 'Yeni Teklif Oluştur'}
            </h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">
              Firma, kampanya ve teklif bilgilerini girerek yeni teklif oluşturabilirsiniz.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white cursor-pointer transition-colors p-2 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/5"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Body (Grid) */}
        <div className="flex-1 overflow-y-auto px-8 py-6 scrollbar-thin">
          <form id="offer-form" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column - Inputs */}
            <div className="lg:col-span-8 space-y-6">
              {submitSuccess && (
                <Notification
                  title="Başarılı"
                  description={offer ? 'Teklif başarıyla güncellendi.' : 'Yeni teklif başarıyla oluşturuldu.'}
                  type="success"
                />
              )}

              {submitError && (
                <Notification
                  title="Hata"
                  description={submitError}
                  type="alert"
                  onClose={() => setSubmitError(null)}
                />
              )}

              {/* Grid 1: Company, Campaign & Owner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CustomSelect
                  label="Firma *"
                  value={watch('companyId')}
                  onChange={(val) => setValue('companyId', val, { shouldValidate: true })}
                  options={companies.map(c => ({ value: c.id, label: c.name }))}
                  error={errors.companyId?.message}
                />

                <FormGroup>
                  <Label htmlFor="campaignName">Kampanya Adı *</Label>
                  <input
                    id="campaignName"
                    type="text"
                    placeholder="Galaxy AI Lansmanı"
                    className={`h-[52px] w-full bg-[#151B2D] border ${errors.campaignName ? 'border-red-500/50' : 'border-white/8'} rounded-xl px-4 text-xs font-semibold text-white focus:outline-none focus:shadow-[0_0_12px_rgba(59,130,246,0.25)] focus:border-blue-500/50 transition-all duration-200 placeholder-white/35`}
                    {...register('campaignName')}
                  />
                  {errors.campaignName?.message && (
                    <span className="text-[10px] text-red-500 font-bold mt-1 block">{errors.campaignName.message}</span>
                  )}
                </FormGroup>

                <CustomSelect
                  label="Sorumlu Satış Temsilcisi *"
                  value={watch('owner')}
                  onChange={(val) => setValue('owner', val, { shouldValidate: true })}
                  options={[
                    { value: 'Cemil Sezgin', label: 'Cemil Sezgin' },
                    { value: 'Ayşe Kaya', label: 'Ayşe Kaya' },
                    { value: 'Savaş Arslan', label: 'Savaş Arslan' },
                    { value: 'Selin Yılmaz', label: 'Selin Yılmaz' }
                  ]}
                  error={errors.owner?.message}
                />
              </div>

              {/* Grid 2: Discount & Customer Budget */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormGroup>
                  <div className="flex justify-between items-center">
                    <Label htmlFor="discountRate">İndirim Oranı (%)</Label>
                    <span className="text-base font-black text-indigo-400">%{discountRate}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <input
                      id="discountRate"
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      className="flex-1 accent-indigo-500 h-1 bg-[#151B2D] rounded-lg appearance-none cursor-pointer"
                      value={discountRate}
                      onChange={(e) => setValue('discountRate', parseInt(e.target.value, 10), { shouldValidate: true })}
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="w-16 h-9 bg-[#151B2D] border border-white/8 rounded-lg px-2 text-center text-xs font-semibold text-white focus:outline-none focus:border-blue-500/50"
                      value={discountRate}
                      onChange={(e) => {
                        let val = parseInt(e.target.value, 10) || 0;
                        if (val < 0) val = 0;
                        if (val > 100) val = 100;
                        setValue('discountRate', val, { shouldValidate: true });
                      }}
                    />
                  </div>
                  {discountRate > 50 ? (
                    <div className="mt-2.5 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-bold text-red-400 flex items-center gap-1.5 uppercase tracking-wider">
                      ⚠️ Kritik indirim: özel onay gerektirir.
                    </div>
                  ) : discountRate > 30 ? (
                    <div className="mt-2.5 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-[10px] font-bold text-yellow-400 flex items-center gap-1.5 uppercase tracking-wider">
                      ⚠️ Yüksek indirim oranı: yönetici onayı gerekebilir.
                    </div>
                  ) : null}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="customerBudget">Müşteri Bütçesi (Sayısal Bilgi)</Label>
                  <input
                    id="customerBudget"
                    type="text"
                    placeholder="9000000"
                    className="h-[52px] w-full bg-[#151B2D] border border-white/8 rounded-xl px-4 text-xs font-semibold text-white focus:outline-none focus:shadow-[0_0_12px_rgba(59,130,246,0.25)] focus:border-blue-500/50 transition-all duration-200 placeholder-white/35"
                    value={customerBudget || ''}
                    onChange={(e) => {
                      const val = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10) || 0;
                      setValue('customerBudget', val, { shouldValidate: true });
                    }}
                  />
                </FormGroup>
              </div>

              {/* Grid 3: Date & Pipeline & Probability */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormGroup>
                  <Label htmlFor="closingDate">Beklenen Kapanış Tarihi *</Label>
                  <input
                    id="closingDate"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className={`h-[52px] w-full bg-[#151B2D] border ${errors.closingDate ? 'border-red-500/50' : 'border-white/8'} rounded-xl px-4 text-xs font-semibold text-white focus:outline-none focus:shadow-[0_0_12px_rgba(59,130,246,0.25)] focus:border-blue-500/50 transition-all duration-200 placeholder-white/35`}
                    {...register('closingDate')}
                  />
                  {errors.closingDate?.message && (
                    <span className="text-[10px] text-red-500 font-bold mt-1 block">{errors.closingDate.message}</span>
                  )}
                </FormGroup>

                <FormGroup>
                  <div className="flex justify-between items-center">
                    <Label htmlFor="closeProbability">Kapanış İhtimali *</Label>
                    <span className="text-lg font-black text-blue-400">%{watch('closeProbability') || 0}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <input
                      id="closeProbability"
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      className="flex-1 accent-blue-500 h-1 bg-[#151B2D] rounded-lg appearance-none cursor-pointer border border-transparent"
                      value={watch('closeProbability') || 0}
                      onChange={(e) => setValue('closeProbability', parseInt(e.target.value, 10), { shouldValidate: true })}
                    />
                  </div>
                  {errors.closeProbability?.message && (
                    <span className="text-[10px] text-red-500 font-bold mt-1 block">{errors.closeProbability.message}</span>
                  )}
                </FormGroup>
              </div>

              {/* Grid 4: Pipeline Badge Buttons */}
              <FormGroup>
                <Label>Pipeline Aşaması *</Label>
                <div className="flex flex-wrap gap-2.5 mt-2">
                  {Object.keys(STAGE_CONFIGS).map((key) => {
                    const stg = key as Offer['stage'];
                    const conf = STAGE_CONFIGS[stg];
                    const isSelected = watch('stage') === stg;
                    return (
                      <button
                        key={stg}
                        type="button"
                        onClick={() => setValue('stage', stg, { shouldValidate: true })}
                        className={`px-3 py-2.5 text-[9.5px] font-black uppercase tracking-wider rounded-xl border transition-all duration-150 cursor-pointer select-none ${isSelected ? `${conf.bg} ${conf.border} ${conf.text} ring-2 ring-blue-500/30 scale-[1.03]` : 'bg-[#151B2D] border-white/5 text-slate-500 hover:text-slate-350 hover:border-white/10'}`}
                      >
                        {conf.label}
                      </button>
                    );
                  })}
                </div>
                {errors.stage?.message && (
                  <span className="text-[10px] text-red-500 font-bold mt-1 block">{errors.stage.message}</span>
                )}
              </FormGroup>

              {/* Grid 5: Advertising Space Cards */}
              <FormGroup className="pt-2">
                <Label>Önerilen Reklam Alanları *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3 max-h-[260px] overflow-y-auto pr-2 scrollbar-thin">
                  {spaces.map(s => {
                    const isSelected = selectedSpaceIds.includes(s.id);
                    const isPremium = s.visibility === 'Çok Yüksek';
                    return (
                      <div
                        key={s.id}
                        onClick={() => handleSpaceToggle(s.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer select-none transition-all duration-150 text-left flex flex-col justify-between min-h-[110px] ${isSelected ? 'bg-blue-600/5 border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.15)] text-white' : 'bg-[#151B2D] border-white/5 text-slate-350 hover:border-white/12 hover:scale-[1.01]'}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-black text-white uppercase tracking-wider block">#{s.code}</span>
                            <span className="text-[9px] font-semibold text-slate-500 block truncate max-w-[130px]" title={s.name}>{s.name}</span>
                          </div>
                          <div className="flex gap-1 items-center">
                            {isPremium && (
                              <span className="text-[8px] font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/15 px-1.5 py-0.5 rounded uppercase">
                                PREMIUM
                              </span>
                            )}
                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${s.status === 'bos' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'bg-red-500/10 text-red-400 border border-red-500/15'}`}>
                              {s.status === 'bos' ? 'BOŞ' : s.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-end mt-3 pt-2 border-t border-white/3">
                          <span className="text-[8px] font-bold text-slate-500 uppercase">{s.type} Ekran</span>
                          <span className="text-[10px] font-black text-emerald-450">{s.price}</span>
                        </div>
                      </div>
                    );
                  })}
                  {spaces.length === 0 && (
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block text-center py-4 col-span-3">
                      Yüklenebilir reklam alanı bulunamadı.
                    </span>
                  )}
                </div>
                {errors.spaceIds?.message && (
                  <span className="text-[10px] text-red-500 font-bold block mt-2">{errors.spaceIds.message}</span>
                )}
              </FormGroup>

              {/* Textareas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormGroup>
                  <Label htmlFor="details">Teklif Açıklaması</Label>
                  <textarea
                    id="details"
                    rows={4}
                    placeholder="Teklifin ana şartları, ekran dağılımı, indirim oranları..."
                    className="w-full bg-[#151B2D] border border-white/8 rounded-xl p-4 text-xs font-semibold text-white focus:outline-none focus:shadow-[0_0_12px_rgba(59,130,246,0.25)] focus:border-blue-500/50 transition-all duration-200 placeholder-white/35 min-h-[140px] resize-none"
                    {...register('details')}
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="notes">İç Satış Notları</Label>
                  <textarea
                    id="notes"
                    rows={4}
                    placeholder="Müşteriye gösterilmeyen iç satış notları..."
                    className="w-full bg-[#151B2D] border border-white/8 rounded-xl p-4 text-xs font-semibold text-white focus:outline-none focus:shadow-[0_0_12px_rgba(59,130,246,0.25)] focus:border-blue-500/50 transition-all duration-200 placeholder-white/35 min-h-[140px] resize-none"
                    {...register('notes')}
                  />
                </FormGroup>
              </div>
            </div>

            {/* Right Column - Live Summary */}
            <div className="lg:col-span-4">
              <div className="bg-[#121826]/40 border border-white/5 rounded-3xl p-5 space-y-5 sticky top-5 self-start select-none">
                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none flex items-center gap-1.5 border-b border-white/5 pb-3">
                  <Sparkles size={11} className="text-indigo-400 animate-pulse animate-duration-1000" />
                  CANLI TEKLİF ÖZETİ
                </h4>

                <div className="space-y-3.5 text-[10.5px] font-semibold text-slate-400">
                  <div className="flex justify-between items-center py-1.5 border-b border-white/3">
                    <span>Firma</span>
                    <span className="text-white font-black truncate max-w-[150px]">
                      {companies.find(c => c.id === watch('companyId'))?.name || '-'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-white/3">
                    <span>Kampanya</span>
                    <span className="text-white font-black truncate max-w-[150px]">
                      {watch('campaignName') || '-'}
                    </span>
                  </div>

                  <div className="space-y-1.5 py-1.5 border-b border-white/3">
                    <div className="flex justify-between items-center">
                      <span>Seçilen Alanlar</span>
                      <span className="text-white font-black">{selectedSpaceIds.length} Adet</span>
                    </div>
                    {selectedSpacesData.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1 max-h-16 overflow-y-auto pr-1 scrollbar-thin">
                        {selectedSpacesData.map(s => (
                          <span key={s.id} className="text-[8px] font-black bg-blue-500/10 border border-blue-500/15 text-blue-400 px-1.5 py-0.5 rounded uppercase">
                            #{s.code}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-white/3">
                    <span>Toplam Metrekare</span>
                    <span className="text-white font-black">{totalM2.toFixed(1)} m²</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-white/3">
                    <span>Liste Fiyatı</span>
                    <span className="text-white font-black">₺ {listPriceTotal.toLocaleString('tr-TR')}</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-white/3">
                    <span>İndirim Oranı</span>
                    <span className="text-indigo-400 font-black">%{discountRate}</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-white/3">
                    <span>İndirim Tutarı</span>
                    <span className="text-rose-455 font-black">
                      {discountAmount > 0 ? `- ₺ ${discountAmount.toLocaleString('tr-TR')}` : '₺ 0'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-white/3">
                    <span>Net Tutar</span>
                    <span className="text-white font-black">₺ {netAmount.toLocaleString('tr-TR')}</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-white/3">
                    <span>KDV (%20)</span>
                    <span className="text-white font-black">₺ {vatAmount.toLocaleString('tr-TR')}</span>
                  </div>

                  <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                    <span className="text-white font-bold text-xs">GENEL TOPLAM</span>
                    <span className="text-emerald-450 font-black text-xs">₺ {grandTotal.toLocaleString('tr-TR')}</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-white/3">
                    <span>Müşteri Bütçesi</span>
                    <span className="text-white font-black">
                      {customerBudget > 0 ? `₺ ${customerBudget.toLocaleString('tr-TR')}` : '-'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1.5">
                    <span>Tahmini Erişim</span>
                    <span className="text-blue-400 font-black">{totalTraffic.toLocaleString('tr-TR')} Kişi</span>
                  </div>
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-50 flex items-center justify-between border-t border-white/5 px-8 pt-5 pb-7 shrink-0 bg-[#0b0f19] bg-opacity-95">
          <Button variant="outline" size="sm" type="button" className="px-6 font-bold" onClick={onClose} disabled={loading}>
            İptal
          </Button>

          <Button variant="minimal" size="sm" type="button" className="px-6 font-bold border border-white/5" onClick={handleSaveDraft} disabled={loading}>
            Taslak Kaydet
          </Button>

          <Button
            variant="primary"
            size="sm"
            type="submit"
            form="offer-form"
            className="px-8 font-black bg-gradient-to-r from-blue-650 to-indigo-650 hover:from-blue-600 hover:to-indigo-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-200"
            loading={loading}
          >
            {loading ? 'Teklif Kaydediliyor...' : (offer ? 'Teklifi Güncelle' : 'Yeni Teklif Oluştur')}
          </Button>
        </div>
      </div>
    </div>
  );
}
