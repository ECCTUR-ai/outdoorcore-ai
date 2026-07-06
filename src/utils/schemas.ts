import { z } from 'zod';

// Company Form Zod Validation Schema
export const companySchema = z.object({
  name: z.string().min(2, 'Firma adı en az 2 karakter olmalıdır'),
  sector: z.string().min(1, 'Sektör seçilmelidir'),
  city: z.string().min(1, 'Şehir seçilmelidir'),
  status: z.enum(['Aktif', 'Pasif']),
  crmStatus: z.enum(['VIP', 'Gold', 'Silver', 'Lead']),
  website: z.string()
    .url('Geçerli bir web sitesi adresi giriniz (örn: https://example.com)')
    .or(z.string().length(0))
    .or(z.string().regex(/^www\.[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, 'Geçerli bir web sitesi adresi giriniz')),
  phone: z.string().min(10, 'Telefon numarası en az 10 karakter olmalıdır').or(z.string().length(0)),
  email: z.string().email('Geçerli bir e-posta adresi giriniz').or(z.string().length(0)),
  taxNo: z.string().min(10, 'Vergi numarası 10 haneli olmalıdır').max(10, 'Vergi numarası 10 haneli olmalıdır').or(z.string().length(0)),
  taxOffice: z.string().or(z.string().length(0)),
  mediaAgency: z.string().or(z.string().length(0)),
  creativeAgency: z.string().or(z.string().length(0)),
  notes: z.string().optional()
});

export type CompanyFormData = z.infer<typeof companySchema>;

// Advertising Space Form Zod Validation Schema
export const spaceSchema = z.object({
  code: z.string().min(2, 'Alan kodu en az 2 karakter olmalıdır'),
  name: z.string().min(2, 'Alan adı en az 2 karakter olmalıdır'),
  location: z.string().min(2, 'Lokasyon en az 2 karakter olmalıdır'),
  terminal: z.string().or(z.string().length(0)),
  floor: z.string().or(z.string().length(0)),
  type: z.string().min(1, 'Tip seçilmelidir'),
  size: z.string().min(1, 'Ölçü girilmelidir'),
  traffic: z.coerce.number().min(0, 'Yolcu akışı 0 veya daha büyük olmalıdır'),
  status: z.enum(['dolu', 'bos', 'teklif', 'bakim', 'yakinda']),
  price: z.string().min(1, 'Fiyat girilmelidir'),
  visibility: z.string().min(1, 'Görünürlük seçilmelidir'),
  // Technical specs
  resolution: z.string().optional(),
  pitch: z.string().optional(),
  workingHours: z.string().optional(),
  audio: z.string().optional(),
  power: z.string().optional(),
  fileFormat: z.string().optional(),
  maxFileSize: z.string().optional(),
  updateInterval: z.string().optional(),
  image: z.string().url('Geçerli bir resim URL\'si giriniz').or(z.string().length(0)),
  notes: z.string().optional()
});

export type SpaceFormData = z.infer<typeof spaceSchema>;

// Offer Form Zod Validation Schema
export const offerSchema = z.object({
  companyId: z.string().min(1, 'Firma seçilmelidir'),
  campaignName: z.string().min(2, 'Kampanya adı en az 2 karakter olmalıdır'),
  value: z.string().min(1, 'Tahmini bütçe (yazılı) girilmelidir (örn: ₺8.500.000)'),
  valueNumeric: z.coerce.number().min(1, 'Bütçe sayısal değeri 0\'dan büyük olmalıdır'),
  stage: z.enum([
    'Lead',
    'İlk Görüşme',
    'İhtiyaç Analizi',
    'Teklif Hazırlandı',
    'Sunum Yapıldı',
    'Pazarlık',
    'Onay Bekleniyor',
    'Sözleşme',
    'Rezervasyon',
    'Tamamlandı'
  ]),
  closeProbability: z.coerce.number().min(0, 'İhtimal %0 ile %100 arasında olmalıdır').max(100, 'İhtimal %0 ile %100 arasında olmalıdır'),
  closingDate: z.string().min(1, 'Beklenen kapanış tarihi seçilmelidir'),
  owner: z.string().min(1, 'Sorumlu temsilci seçilmelidir'),
  spaceIds: z.array(z.string()).min(1, 'En az bir önerilen reklam alanı seçilmelidir'),
  details: z.string().or(z.string().length(0)),
  notes: z.string().optional()
});

export type OfferFormData = z.infer<typeof offerSchema>;
