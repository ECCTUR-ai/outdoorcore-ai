import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { X, CheckCircle, Upload, AlertCircle } from 'lucide-react';
import { companySchema, CompanyFormData } from '@/utils/schemas';
import { zodResolver } from '@/utils/resolver';
import { companyRepository, activityLogRepository } from '@/repositories';
import { Company } from '@/data/companies';
import { storageService } from '@/services/storageService';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (company: Company) => void;
  company?: Company;
}

const SECTOR_OPTIONS = [
  { value: 'Havacılık', label: 'Havacılık' },
  { value: 'Otomotiv', label: 'Otomotiv' },
  { value: 'Telekom', label: 'Telekom' },
  { value: 'Finans', label: 'Finans' },
  { value: 'Perakende', label: 'Perakende' },
  { value: 'Turizm', label: 'Turizm' },
  { value: 'Teknoloji', label: 'Teknoloji' },
  { value: 'FMCG', label: 'FMCG' },
  { value: 'Diğer', label: 'Diğer' }
];

const CITY_OPTIONS = [
  { value: 'İstanbul', label: 'İstanbul' },
  { value: 'Ankara', label: 'Ankara' },
  { value: 'İzmir', label: 'İzmir' },
  { value: 'Bursa', label: 'Bursa' },
  { value: 'Antalya', label: 'Antalya' },
  { value: 'Kocaeli', label: 'Kocaeli' },
  { value: 'Muğla', label: 'Muğla' },
  { value: 'Adana', label: 'Adana' },
  { value: 'Trabzon', label: 'Trabzon' },
  { value: 'Eskişehir', label: 'Eskişehir' },
  { value: 'Gaziantep', label: 'Gaziantep' },
  { value: 'Diyarbakır', label: 'Diyarbakır' },
  { value: 'Samsun', label: 'Samsun' },
  { value: 'Konya', label: 'Konya' },
  { value: 'Kayseri', label: 'Kayseri' }
];

const STATUS_OPTIONS = [
  { value: 'Aktif', label: 'Aktif' },
  { value: 'Potansiyel', label: 'Potansiyel' },
  { value: 'Pasif', label: 'Pasif' }
];

const CRM_OPTIONS = [
  { value: 'VIP', label: 'VIP' },
  { value: 'Gold', label: 'Gold' },
  { value: 'Silver', label: 'Silver' },
  { value: 'Standard', label: 'Standard' }
];

export function CompanyModal({ isOpen, onClose, onSuccess, company }: CompanyModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid, isDirty }
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      sector: '',
      city: '',
      status: 'Aktif',
      crmStatus: 'Standard',
      website: '',
      phone: '',
      email: '',
      taxNo: '',
      taxOffice: '',
      mediaAgency: '',
      creativeAgency: '',
      notes: '',
      logoUrl: ''
    }
  });

  const watchLogoUrl = watch('logoUrl');
  const watchSector = watch('sector');
  const watchCity = watch('city');
  const watchStatus = watch('status');
  const watchCrmStatus = watch('crmStatus');

  // Load values when editing
  useEffect(() => {
    if (isOpen) {
      setSubmitError(null);
      setSubmitSuccess(false);
      document.body.style.overflow = 'hidden';

      // Auto-focus on name field
      setTimeout(() => {
        const nameInput = document.getElementById('name-input');
        if (nameInput) nameInput.focus();
      }, 50);

      if (company) {
        reset({
          name: company.name,
          sector: company.sector,
          city: company.city,
          status: company.status,
          crmStatus: company.crmStatus === 'Lead' ? 'Standard' : (company.crmStatus as any),
          website: company.website,
          phone: company.phone,
          email: company.email,
          taxNo: company.taxNo,
          taxOffice: company.taxOffice,
          mediaAgency: company.mediaAgency,
          creativeAgency: company.creativeAgency,
          notes: company.notesList?.[0] || '',
          logoUrl: company.logoUrl || ''
        });
      } else {
        reset({
          name: '',
          sector: '',
          city: '',
          status: 'Aktif',
          crmStatus: 'Standard',
          website: '',
          phone: '',
          email: '',
          taxNo: '',
          taxOffice: '',
          mediaAgency: '',
          creativeAgency: '',
          notes: '',
          logoUrl: ''
        });
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, company, reset]);

  // Keyboard navigation & Close handlers
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancelClick();
      }
      
      // Focus trap loop
      if (e.key === 'Tab' && modalContainerRef.current) {
        const focusableEls = modalContainerRef.current.querySelectorAll(
          'input:not([disabled]), textarea:not([disabled]), button:not([disabled])'
        );
        if (focusableEls.length > 0) {
          const first = focusableEls[0] as HTMLElement;
          const last = focusableEls[focusableEls.length - 1] as HTMLElement;
          if (e.shiftKey) {
            if (document.activeElement === first) {
              last.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === last) {
              first.focus();
              e.preventDefault();
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDirty]);

  const handleCancelClick = () => {
    if (isDirty) {
      if (confirm('Kaydedilmemiş değişiklikleriniz var. Kapatmak istediğinize emin misiniz?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const onSubmit = async (data: CompanyFormData) => {
    if (loading) return; // prevent double clicks
    setLoading(true);
    setSubmitError(null);
    try {
      let result;
      if (company) {
        result = await companyRepository.update(company.id, data);
      } else {
        result = await companyRepository.create(data);
      }
      setSubmitSuccess(true);
      setTimeout(() => {
        onSuccess(result);
        onClose();
      }, 1000);
    } catch (err: any) {
      setSubmitError(err.message || 'Firma kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert('Firma logosu en fazla 2 MB olmalıdır.');
        return;
      }
      setUploadingLogo(true);
      try {
        const cleanName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const result = await storageService.uploadFile('logos', cleanName, file);
        if (result.success && result.url) {
          setValue('logoUrl', result.url, { shouldDirty: true });
          activityLogRepository.log(`Firma logosu yüklendi: ${file.name}`, 'logo.uploaded');
        } else {
          alert('Dosya yüklenemedi: ' + result.error);
        }
      } catch (err: any) {
        alert('Hata: ' + err.message);
      } finally {
        setUploadingLogo(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={handleCancelClick}
      />

      {/* Modal Container */}
      <div 
        ref={modalContainerRef}
        className="relative w-full max-w-[880px] max-h-[88vh] flex flex-col transform overflow-hidden rounded-[24px] border border-slate-100 bg-white text-left shadow-2xl z-[101] animate-scale-in duration-200"
      >
        {/* Fixed Header */}
        <div className="h-[72px] flex items-center justify-between border-b border-slate-100 px-6 shrink-0 bg-white">
          <div className="text-left">
            <h3 className="text-sm font-black text-[#0f172a] uppercase tracking-widest leading-none m-0">
              {company ? 'Firmayı Düzenle' : 'Yeni Firma Ekle'}
            </h3>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mt-1">
              Firma, iletişim ve faturalama bilgilerini oluşturun
            </span>
          </div>
          <button
            type="button"
            onClick={handleCancelClick}
            className="text-slate-450 hover:text-slate-650 cursor-pointer transition-colors p-1.5 hover:bg-slate-50 rounded-xl outline-none"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-5 text-xs text-slate-650 font-medium leading-relaxed pb-28">
          <form id="company-modal-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {submitSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl flex items-center gap-2">
                <CheckCircle size={15} />
                <span>Firma başarıyla oluşturuldu</span>
              </div>
            )}

            {submitError && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{submitError}</span>
              </div>
            )}

            {/* A. FİRMA KİMLİĞİ */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                <span className="text-[11px] font-black text-[#0f172a] uppercase tracking-widest">A. Firma Kimliği</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Logo Upload (Compact 76px Panel) */}
                <div className="col-span-1 md:col-span-2">
                  <span className="text-[10px] font-black text-[#0f172a] uppercase tracking-wider block mb-1.5">Firma Logosu</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  {watchLogoUrl ? (
                    <div className="h-[76px] border border-slate-200 bg-white rounded-xl p-3 flex items-center justify-between gap-4 transition-all hover:border-slate-300">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-lg border border-slate-200/60 overflow-hidden shrink-0">
                          <img src={watchLogoUrl} alt="Logo Preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-black text-slate-700 block truncate max-w-[280px]">
                            {watchLogoUrl.split('/').pop() || 'firma_logosu.png'}
                          </span>
                          <span className="text-[9px] font-black text-emerald-600 flex items-center gap-1 mt-0.5">
                            ✓ Yüklendi
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setValue('logoUrl', '', { shouldDirty: true })}
                        className="text-slate-400 hover:text-rose-500 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="h-[76px] border-2 border-dashed border-slate-200 hover:border-slate-300 bg-white rounded-xl flex items-center justify-center cursor-pointer transition-all gap-2"
                    >
                      <Upload size={14} className="text-slate-400" />
                      <div className="text-left">
                        <span className="text-xs font-black text-slate-700 block">Logo yüklemek için tıklayın</span>
                        <span className="text-[9px] text-slate-400 block font-semibold">PNG, JPG, WEBP (Maks 2MB)</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Firma Adı */}
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="name-input" className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                    Firma Adı <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="name-input"
                    type="text"
                    placeholder="Firma adını girin"
                    className={`w-full px-3.5 h-11 rounded-xl bg-white border text-xs font-semibold text-slate-800 transition-all outline-none ${
                      errors.name ? 'border-rose-500 focus:ring-4 focus:ring-rose-500/10' : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                    }`}
                    {...register('name')}
                  />
                  {errors.name && <span className="text-[10px] text-rose-500 font-bold block">{errors.name.message}</span>}
                </div>

                {/* Sektör Custom Select */}
                <CustomSelect
                  label="Sektör"
                  value={watchSector}
                  onChange={val => setValue('sector', val, { shouldValidate: true, shouldDirty: true })}
                  options={SECTOR_OPTIONS}
                  placeholder="Sektör Seçin..."
                  required
                  error={errors.sector?.message}
                />

                {/* Şehir Searchable Combobox */}
                <CustomSearchableSelect
                  label="Şehir"
                  value={watchCity}
                  onChange={val => setValue('city', val, { shouldValidate: true, shouldDirty: true })}
                  options={CITY_OPTIONS}
                  placeholder="Şehir Seçin..."
                  required
                  error={errors.city?.message}
                />

                {/* Durum Custom Select */}
                <CustomSelect
                  label="Durum"
                  value={watchStatus}
                  onChange={val => setValue('status', val as any, { shouldValidate: true, shouldDirty: true })}
                  options={STATUS_OPTIONS}
                  placeholder="Durum Seçin..."
                  required
                  error={errors.status?.message}
                />

                {/* CRM Segmenti Custom Select */}
                <CustomSelect
                  label="CRM Segmenti"
                  value={watchCrmStatus}
                  onChange={val => setValue('crmStatus', val as any, { shouldValidate: true, shouldDirty: true })}
                  options={CRM_OPTIONS}
                  placeholder="Segment Seçin..."
                  required
                  error={errors.crmStatus?.message}
                />
              </div>
            </div>

            {/* B. İLETİŞİM BİLGİLERİ */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                <span className="text-[11px] font-black text-[#0f172a] uppercase tracking-widest">B. İletişim Bilgileri</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="web-input" className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Web Sitesi</label>
                  <input
                    id="web-input"
                    type="text"
                    placeholder="https://example.com"
                    className={`w-full px-3.5 h-11 rounded-xl bg-white border text-xs font-semibold text-slate-800 transition-all outline-none ${
                      errors.website ? 'border-rose-500 focus:ring-4 focus:ring-rose-500/10' : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                    }`}
                    {...register('website')}
                  />
                  {errors.website && <span className="text-[10px] text-rose-500 font-bold block">{errors.website.message}</span>}
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="email-input" className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">E-posta</label>
                  <input
                    id="email-input"
                    type="text"
                    placeholder="info@firma.com"
                    className={`w-full px-3.5 h-11 rounded-xl bg-white border text-xs font-semibold text-slate-800 transition-all outline-none ${
                      errors.email ? 'border-rose-500 focus:ring-4 focus:ring-rose-500/10' : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                    }`}
                    {...register('email')}
                  />
                  {errors.email && <span className="text-[10px] text-rose-500 font-bold block">{errors.email.message}</span>}
                </div>
              </div>
            </div>

            {/* C. FATURA BİLGİLERİ */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                <span className="text-[11px] font-black text-[#0f172a] uppercase tracking-widest">C. Fatura Bilgileri</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="taxno-input" className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Vergi Numarası</label>
                  <input
                    id="taxno-input"
                    type="text"
                    maxLength={10}
                    placeholder="10 haneli vergi no"
                    className={`w-full px-3.5 h-11 rounded-xl bg-white border text-xs font-semibold text-slate-800 transition-all outline-none ${
                      errors.taxNo ? 'border-rose-500 focus:ring-4 focus:ring-rose-500/10' : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                    }`}
                    {...register('taxNo')}
                  />
                  {errors.taxNo && <span className="text-[10px] text-rose-500 font-bold block">{errors.taxNo.message}</span>}
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="taxoffice-input" className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Vergi Dairesi</label>
                  <input
                    id="taxoffice-input"
                    type="text"
                    placeholder="Vergi dairesi adı"
                    className={`w-full px-3.5 h-11 rounded-xl bg-white border text-xs font-semibold text-slate-800 transition-all outline-none border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10`}
                    {...register('taxOffice')}
                  />
                </div>
              </div>
            </div>

            {/* D. AJANS BİLGİLERİ */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                <span className="text-[11px] font-black text-[#0f172a] uppercase tracking-widest">D. Ajans Bilgileri</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="media-input" className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Medya Ajansı</label>
                  <input
                    id="media-input"
                    type="text"
                    placeholder="Medya ajansı adı"
                    className="w-full px-3.5 h-11 rounded-xl bg-white border text-xs font-semibold text-slate-800 transition-all outline-none border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    {...register('mediaAgency')}
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="creative-input" className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Kreatif Ajans</label>
                  <input
                    id="creative-input"
                    type="text"
                    placeholder="Kreatif ajans adı"
                    className="w-full px-3.5 h-11 rounded-xl bg-white border text-xs font-semibold text-slate-800 transition-all outline-none border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    {...register('creativeAgency')}
                  />
                </div>
              </div>
            </div>

            {/* E. NOTLAR */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                <span className="text-[11px] font-black text-[#0f172a] uppercase tracking-widest">E. Notlar</span>
              </div>
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="notes-input" className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Ek Notlar</label>
                <textarea
                  id="notes-input"
                  rows={3}
                  placeholder="Firma hakkında genel ERP planlama notları..."
                  className="w-full p-3.5 rounded-xl bg-white border text-xs font-semibold text-slate-800 transition-all outline-none border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  {...register('notes')}
                />
              </div>
            </div>
          </form>
        </div>

        {/* Fixed Footer */}
        <div className="h-[72px] flex items-center justify-end gap-3 border-t border-slate-100 px-6 shrink-0 bg-white">
          <button
            type="button"
            onClick={handleCancelClick}
            disabled={loading}
            className="px-5 h-[42px] rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-extrabold transition-all outline-none"
          >
            İptal
          </button>
          <button
            type="submit"
            form="company-modal-form"
            disabled={!isValid || loading}
            className={`px-6 h-[42px] rounded-xl text-white text-xs font-extrabold transition-all outline-none flex items-center justify-center gap-2 ${
              isValid && !loading 
                ? 'bg-blue-650 hover:bg-blue-600 active:scale-98 cursor-pointer shadow-md' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Kaydediliyor...</span>
              </>
            ) : (
              <span>Firma Kaydet</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// 1. Reusable Custom Select Dropdown
interface CustomSelectProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  error?: string;
}

function CustomSelect({ label, value, onChange, options, placeholder = 'Seçiniz...', required, error }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div ref={containerRef} className="relative w-full text-left flex flex-col space-y-1.5">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-3.5 h-11 rounded-xl bg-white border text-left flex items-center justify-between text-xs font-semibold text-slate-800 transition-all ${
            error ? 'border-rose-500 focus:ring-4 focus:ring-rose-500/10' : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
          } outline-none`}
        >
          <span className={selectedOption ? 'text-slate-800 font-extrabold' : 'text-slate-400'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className={`text-[9px] text-slate-400 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
        </button>
        
        {isOpen && (
          <div className="absolute z-[200] left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg py-1 animate-scale-in select-none">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full h-11 px-3.5 text-left text-xs font-bold transition-colors flex items-center justify-between hover:bg-slate-50 ${
                  opt.value === value 
                    ? 'bg-blue-500/10 text-blue-650' 
                    : 'text-slate-700'
                }`}
              >
                <span>{opt.label}</span>
                {opt.value === value && <span className="text-blue-650 font-black">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <span className="text-[10px] text-rose-500 font-bold block">{error}</span>}
    </div>
  );
}

// 2. Reusable Custom Searchable Select (Combobox)
function CustomSearchableSelect({ label, value, onChange, options, placeholder = 'Seçiniz...', required, error }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const selectedOption = options.find(o => o.value === value);
  const filteredOptions = options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <div ref={containerRef} className="relative w-full text-left flex flex-col space-y-1.5">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            setSearch('');
          }}
          className={`w-full px-3.5 h-11 rounded-xl bg-white border text-left flex items-center justify-between text-xs font-semibold text-slate-800 transition-all ${
            error ? 'border-rose-500 focus:ring-4 focus:ring-rose-500/10' : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
          } outline-none`}
        >
          <span className={selectedOption ? 'text-slate-800 font-extrabold' : 'text-slate-400'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className={`text-[9px] text-slate-400 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {isOpen && (
          <div className="absolute z-[200] left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg p-2.5 space-y-2 select-none flex flex-col">
            <input
              type="text"
              placeholder="Şehir ara..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-[38px] px-3.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 bg-slate-50/50"
            />
            <div className="max-h-48 overflow-y-auto py-1 space-y-0.5">
              {filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full h-11 px-2.5 text-left text-xs font-bold transition-colors flex items-center justify-between rounded-lg hover:bg-slate-50 ${
                    opt.value === value 
                      ? 'bg-blue-500/10 text-blue-650' 
                      : 'text-slate-700'
                  }`}
                >
                  <span>{opt.label}</span>
                  {opt.value === value && <span className="text-blue-650 font-black">✓</span>}
                </button>
              ))}
              {filteredOptions.length === 0 && (
                <span className="text-[10px] text-slate-400 italic block text-center py-3">Eşleşen şehir bulunamadı.</span>
              )}
            </div>
          </div>
        )}
      </div>
      {error && <span className="text-[10px] text-rose-500 font-bold block">{error}</span>}
    </div>
  );
}
