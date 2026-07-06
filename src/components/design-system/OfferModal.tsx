import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from './Modal';
import { Label, Input, Select, Textarea, FormGroup } from './Form';
import { Button } from './Button';
import { Notification } from './Notification';
import { offerSchema, OfferFormData } from '@/utils/schemas';
import { zodResolver } from '@/utils/resolver';
import { offerRepository, companyRepository, spaceRepository } from '@/repositories';
import { Company } from '@/data/companies';
import { AdvertisingSpace } from '@/data/advertisingSpaces';
import { Offer } from '@/data/offers';

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (offer: Offer) => void;
  offer?: Offer; // If passed, we are editing
}

export function OfferModal({ isOpen, onClose, onSuccess, offer }: OfferModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Dynamic dropdown data
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
      notes: ''
    }
  });

  const selectedSpaceIds = watch('spaceIds') || [];

  // Fetch Companies & Spaces
  useEffect(() => {
    async function loadData() {
      try {
        const companyList = await companyRepository.list();
        const spaceList = await spaceRepository.list();
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
        // Find matching spaceIds by matching offer.spacesList codes to our spaces codes
        // If offer already has spaceIds populated, we use them
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
          closingDate: offer.closingDate || '',
          owner: offer.owner,
          spaceIds: resolvedSpaceIds,
          details: offer.details || '',
          notes: offer.notes || ''
        });
      } else {
        reset({
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
          notes: ''
        });
      }
    }
  }, [isOpen, offer, reset, spaces]);

  // Toggle suggested space ID
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

  const onSubmit = async (data: OfferFormData) => {
    setLoading(true);
    setSubmitError(null);
    try {
      let result;
      if (offer) {
        result = await offerRepository.update(offer.id, data);
      } else {
        result = await offerRepository.create(data);
      }
      setSubmitSuccess(true);
      setTimeout(() => {
        onSuccess(result);
        onClose();
      }, 1200);
    } catch (err: any) {
      setSubmitError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const footerActions = (
    <div className="flex gap-2.5">
      <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
        İptal
      </Button>
      <Button variant="primary" size="sm" onClick={handleSubmit(onSubmit)} loading={loading}>
        Kaydet
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={offer ? 'Teklifi Düzenle' : 'Yeni Teklif Oluştur'}
      footerActions={footerActions}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormGroup>
            <Label htmlFor="companyId">Firma *</Label>
            <Select id="companyId" error={errors.companyId?.message} {...register('companyId')}>
              <option value="">Firma Seçin</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="campaignName">Kampanya Adı *</Label>
            <Input
              id="campaignName"
              placeholder="Galaxy AI Lansmanı"
              error={errors.campaignName?.message}
              {...register('campaignName')}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="value">Tahmini Bütçe (Görünen Metin) *</Label>
            <Input
              id="value"
              placeholder="₺8.500.000"
              error={errors.value?.message}
              {...register('value')}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="valueNumeric">Sayısal Bütçe Değeri *</Label>
            <Input
              id="valueNumeric"
              type="number"
              placeholder="8500000"
              error={errors.valueNumeric?.message}
              {...register('valueNumeric')}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="stage">Pipeline Aşaması *</Label>
            <Select id="stage" error={errors.stage?.message} {...register('stage')}>
              <option value="Lead">Lead</option>
              <option value="İlk Görüşme">İlk Görüşme</option>
              <option value="İhtiyaç Analizi">İhtiyaç Analizi</option>
              <option value="Teklif Hazırlandı">Teklif Hazırlandı</option>
              <option value="Sunum Yapıldı">Sunum Yapıldı</option>
              <option value="Pazarlık">Pazarlık</option>
              <option value="Onay Bekleniyor">Onay Bekleniyor</option>
              <option value="Sözleşme">Sözleşme</option>
              <option value="Rezervasyon">Rezervasyon</option>
              <option value="Tamamlandı">Tamamlandı</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="closeProbability">Kapanış İhtimali (%) *</Label>
            <Input
              id="closeProbability"
              type="number"
              min="0"
              max="100"
              placeholder="75"
              error={errors.closeProbability?.message}
              {...register('closeProbability')}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="closingDate">Beklenen Kapanış Tarihi *</Label>
            <Input
              id="closingDate"
              placeholder="15 Haz 2025 veya YYYY-MM-DD"
              error={errors.closingDate?.message}
              {...register('closingDate')}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="owner">Sorumlu Satış Temsilcisi *</Label>
            <Select id="owner" error={errors.owner?.message} {...register('owner')}>
              <option value="Cemil Sezgin">Cemil Sezgin</option>
              <option value="Ayşe Kaya">Ayşe Kaya</option>
              <option value="Savaş Arslan">Savaş Arslan</option>
              <option value="Selin Yılmaz">Selin Yılmaz</option>
            </Select>
          </FormGroup>
        </div>

        {/* Multi-select suggested spaces */}
        <FormGroup className="pt-2">
          <Label>Önerilen Reklam Alanları *</Label>
          <div className="max-h-40 overflow-y-auto border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-3.5 space-y-2 bg-slate-50 dark:bg-slate-900 scrollbar-thin">
            {spaces.map(s => {
              const checked = selectedSpaceIds.includes(s.id);
              return (
                <label
                  key={s.id}
                  className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-850 cursor-pointer select-none transition-colors duration-150 text-left"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleSpaceToggle(s.id)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-800"
                  />
                  <div>
                    <span className="text-xs font-black text-slate-850 dark:text-slate-250 uppercase block">
                      #{s.code} - {s.name}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 block uppercase">
                      {s.location} | {s.price}
                    </span>
                  </div>
                </label>
              );
            })}
            {spaces.length === 0 && (
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block text-center py-2">
                Yüklenebilir reklam alanı bulunamadı.
              </span>
            )}
          </div>
          {errors.spaceIds?.message && (
            <span className="text-[10px] text-rose-500 font-bold block mt-1">{errors.spaceIds?.message}</span>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="details">Teklif Açıklaması</Label>
          <Textarea
            id="details"
            placeholder="Teklifin ana şartları, ekran dağılımı, indirim oranları..."
            error={errors.details?.message}
            {...register('details')}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="notes">Notlar</Label>
          <Textarea
            id="notes"
            placeholder="Müşteriye gösterilmeyen iç satış notları..."
            error={errors.notes?.message}
            {...register('notes')}
          />
        </FormGroup>
      </form>
    </Modal>
  );
}
