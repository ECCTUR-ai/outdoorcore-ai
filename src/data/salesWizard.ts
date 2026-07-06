import { WizardStepId } from '@/types/workflow';

export interface StepConfig {
  id: WizardStepId;
  label: string;
  description: string;
}

export const WIZARD_STEPS: StepConfig[] = [
  { id: 'company', label: 'Firma Bilgileri', description: 'Müşteri firma seçimi veya yeni kayıt oluşturma.' },
  { id: 'spaces', label: 'Reklam Alanları', description: 'Rezerve edilecek reklam alanlarının envanterden seçilmesi.' },
  { id: 'offer', label: 'Teklif Detayları', description: 'Pipeline aşaması, bütçe ve kapanış olasılığı girişleri.' },
  { id: 'contract', label: 'Sözleşme', description: 'Sözleşme numarası, geçerlilik tarihleri ve şartları.' },
  { id: 'reservation', label: 'Rezervasyon', description: 'Tarih aralığı ve takvim çakışma kontrolleri.' },
  { id: 'campaign', label: 'Kampanya Kurulumu', description: 'Kampanya adı, hedef kitle ve pazarlama amaçları.' },
  { id: 'finance', label: 'Finansman Planı', description: 'Fatura ödeme yöntemi ve taksit planlaması.' },
  { id: 'summary', label: 'Onay ve Özet', description: 'Tüm adımların doğrulanması ve işlemlerin tamamlanması.' }
];

export const MOCK_AI_SUGGESTIONS = [
  "Bu firma daha önce VIP CRM segmentindeydi, %15 ek iskonto tanımlanabilir.",
  "Seçilen envanterler için doluluk oranı yüksek olduğu için peşin ödemede ekstra avantajlar sunulabilir.",
  "Temmuz döneminde planlanan kampanya, yolcu yoğunluğu nedeniyle yüksek dönüşüm getirecektir."
];
