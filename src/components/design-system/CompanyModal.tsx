import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from './Modal';
import { Label, Input, Select, Textarea, FormGroup } from './Form';
import { Button } from './Button';
import { Notification } from './Notification';
import { companySchema, CompanyFormData } from '@/utils/schemas';
import { zodResolver } from '@/utils/resolver';
import { companyRepository, activityLogRepository } from '@/repositories';
import { Company } from '@/data/companies';
import { FileUpload } from './FileUpload';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (company: Company) => void;
  company?: Company; // If passed, we are editing
}

export function CompanyModal({ isOpen, onClose, onSuccess, company }: CompanyModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      sector: '',
      city: '',
      status: 'Aktif',
      crmStatus: 'Lead',
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

  // Load values when editing
  useEffect(() => {
    if (isOpen) {
      setSubmitError(null);
      setSubmitSuccess(false);
      if (company) {
        reset({
          name: company.name,
          sector: company.sector,
          city: company.city,
          status: company.status,
          crmStatus: company.crmStatus,
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
          crmStatus: 'Lead',
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
  }, [isOpen, company, reset]);

  const onSubmit = async (data: CompanyFormData) => {
    setLoading(true);
    setSubmitError(null);
    try {
      let result;
      if (company) {
        // Edit flow
        result = await companyRepository.update(company.id, data);
      } else {
        // Create flow
        result = await companyRepository.create(data);
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
    <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
      <Button variant="outline" size="sm" type="button" className="w-full sm:w-auto" onClick={onClose} disabled={loading}>
        İptal
      </Button>
      <Button variant="primary" size="sm" type="submit" form="company-form" className="w-full sm:w-auto" loading={loading}>
        Kaydet
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={company ? 'Firmayı Düzenle' : 'Yeni Firma Ekle'}
      footerActions={footerActions}
      size="lg"
    >
      <form id="company-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {submitSuccess && (
          <Notification
            title="Başarılı"
            description={company ? 'Firma bilgileri başarıyla güncellendi.' : 'Yeni firma kaydı başarıyla oluşturuldu.'}
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
          <FormGroup className="col-span-1 md:col-span-2">
            <FileUpload
              bucket="logos"
              label="Firma Logosu"
              currentFileUrl={watchLogoUrl}
              onUploadSuccess={(url) => {
                setValue('logoUrl', url);
                activityLogRepository.log(`Firma logosu yüklendi: ${url.split('/').pop()}`, 'logo.uploaded');
              }}
              onRemove={() => setValue('logoUrl', '')}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="name">Firma Adı *</Label>
            <Input
              id="name"
              placeholder="Firma adını girin"
              error={errors.name?.message}
              {...register('name')}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="sector">Sektör *</Label>
            <Select id="sector" error={errors.sector?.message} {...register('sector')}>
              <option value="">Sektör Seçin</option>
              <option value="Teknoloji">Teknoloji</option>
              <option value="Havacılık">Havacılık</option>
              <option value="Telekomünikasyon">Telekomünikasyon</option>
              <option value="Otomotiv">Otomotiv</option>
              <option value="Finans">Finans</option>
              <option value="Gıda">Gıda</option>
              <option value="Elektronik">Elektronik</option>
              <option value="Perakende">Perakende</option>
              <option value="Diğer">Diğer</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="city">Şehir *</Label>
            <Select id="city" error={errors.city?.message} {...register('city')}>
              <option value="">Şehir Seçin</option>
              <option value="İstanbul">İstanbul</option>
              <option value="Ankara">Ankara</option>
              <option value="İzmir">İzmir</option>
              <option value="Bursa">Bursa</option>
              <option value="Antalya">Antalya</option>
              <option value="Kocaeli">Kocaeli</option>
              <option value="Diğer">Diğer</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="status">Durum *</Label>
            <Select id="status" error={errors.status?.message} {...register('status')}>
              <option value="Aktif">Aktif</option>
              <option value="Pasif">Pasif</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="crmStatus">CRM Segmenti *</Label>
            <Select id="crmStatus" error={errors.crmStatus?.message} {...register('crmStatus')}>
              <option value="VIP">VIP</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Lead">Lead</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="website">Web Sitesi</Label>
            <Input
              id="website"
              placeholder="https://example.com"
              error={errors.website?.message}
              {...register('website')}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              placeholder="+90 212 ..."
              error={errors.phone?.message}
              {...register('phone')}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              placeholder="info@firma.com"
              error={errors.email?.message}
              {...register('email')}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="taxNo">Vergi Numarası</Label>
            <Input
              id="taxNo"
              placeholder="10 haneli vergi no"
              error={errors.taxNo?.message}
              {...register('taxNo')}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="taxOffice">Vergi Dairesi</Label>
            <Input
              id="taxOffice"
              placeholder="Vergi dairesi"
              error={errors.taxOffice?.message}
              {...register('taxOffice')}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="mediaAgency">Medya Ajansı</Label>
            <Input
              id="mediaAgency"
              placeholder="Medya ajansı adı"
              error={errors.mediaAgency?.message}
              {...register('mediaAgency')}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="creativeAgency">Kreatif Ajans</Label>
            <Input
              id="creativeAgency"
              placeholder="Kreatif ajans adı"
              error={errors.creativeAgency?.message}
              {...register('creativeAgency')}
            />
          </FormGroup>
        </div>

        <FormGroup>
          <Label htmlFor="notes">Notlar</Label>
          <Textarea
            id="notes"
            placeholder="Firma hakkında ek notlar..."
            error={errors.notes?.message}
            {...register('notes')}
          />
        </FormGroup>
      </form>
    </Modal>
  );
}
