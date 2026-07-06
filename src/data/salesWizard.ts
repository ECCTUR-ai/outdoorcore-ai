import { WizardStepId } from '@/types/workflow';

export interface StepConfig {
  id: WizardStepId;
  label: string;
  description: string;
}

export const WIZARD_STEPS: StepConfig[] = [
  { id: 'dates', label: 'Kampanya Tarihi', description: 'Kampanya başlangıç ve bitiş tarihlerinin planlanması.' },
  { id: 'spaces', label: 'Müsait Reklam Alanları', description: 'Belirtilen tarihlerde çakışmasız ve müsait envanter seçimi.' },
  { id: 'company', label: 'Firma Bilgileri', description: 'Müşteri firma seçimi veya yeni kayıt oluşturma.' },
  { id: 'offer', label: 'Teklif Detayları', description: 'Pipeline aşaması, bütçe ve kapanış olasılığı girişleri.' },
  { id: 'contract', label: 'Sözleşme', description: 'Sözleşme numarası, geçerlilik tarihleri ve şartları.' },
  { id: 'reservation', label: 'Rezervasyon', description: 'Tarih aralığı ve takvim çakışma kontrolleri.' },
  { id: 'campaign', label: 'Kampanya Kurulumu', description: 'Kampanya adı, hedef kitle ve pazarlama amaçları.' },
  { id: 'finance', label: 'Finansman Planı', description: 'Fatura ödeme yöntemi ve taksit planlaması.' },
  { id: 'summary', label: 'Onay ve Özet', description: 'Tüm adımların doğrulanması ve işlemlerin tamamlanması.' }
];

export const MOCK_AI_SUGGESTIONS = [
  "Bu dönemde en yüksek doluluk oranı %88 seviyesindedir. CLP ve billboard alanları dolmak üzere.",
  "En uygun premium alanlar: Havalimanı CIP Girişi ve Check-in LED Ekranlarıdır.",
  "Alternatif tarih önerisi: Başlangıç tarihini 1 hafta ertelemek %15 daha fazla reklam alanı seçeneği sunar."
];
