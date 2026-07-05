export interface Offer {
  id: string;
  clientName: string;
  campaignName: string;
  value: string;
  valueNumeric: number;
  spacesList: string[];
  owner: string;
  lastActivity: string;
  closeProbability: number; // percentage e.g. 78
  stage: 'Lead' | 'İlk Görüşme' | 'İhtiyaç Analizi' | 'Teklif Hazırlandı' | 'Sunum Yapıldı' | 'Pazarlık' | 'Onay Bekleniyor' | 'Sözleşme' | 'Rezervasyon' | 'Tamamlandı';
  closingDate: string;
  details: string;
  priority: 'Yüksek' | 'Orta' | 'Düşük';
}

export const offers: Offer[] = [
  {
    id: 'o1',
    clientName: 'Samsung Electronics',
    campaignName: 'Galaxy AI Lansmanı',
    value: '₺8.500.000',
    valueNumeric: 8500000,
    spacesList: ['SG-001', 'SG-021', 'SG-045'],
    owner: 'Cemil Sezgin',
    lastActivity: 'Teklif revize edildi',
    closeProbability: 78,
    stage: 'Onay Bekleniyor',
    closingDate: '15 Haz 2025',
    priority: 'Yüksek',
    details: '3 alan, 30 gün yayın. LED video + lightbox paketi. Medya kiti dahil.'
  },
  {
    id: 'o2',
    clientName: 'Turkcell',
    campaignName: 'Yaz İletişim Kampanyası',
    value: '₺6.200.000',
    valueNumeric: 6200000,
    spacesList: ['SG-003', 'SG-017'],
    owner: 'Cemil Sezgin',
    lastActivity: 'Görüşme notu eklendi',
    closeProbability: 64,
    stage: 'Teklif Hazırlandı',
    closingDate: '20 Haz 2025',
    priority: 'Orta',
    details: '2 alan, 15 gün yayın. Gençlik paketi ve pasaport geçiş ekranları.'
  },
  {
    id: 'o3',
    clientName: 'Mercedes-Benz Türkiye',
    campaignName: 'EQ Serisi Lansmanı',
    value: '₺7.900.000',
    valueNumeric: 7900000,
    spacesList: ['SG-045', 'SG-067'],
    owner: 'Ayşe Kaya',
    lastActivity: 'Sunum tarihi oluşturuldu',
    closeProbability: 71,
    stage: 'Sunum Yapıldı',
    closingDate: '05 Haz 2025',
    priority: 'Yüksek',
    details: '2 premium alan, 30 gün yayın. Dış hat çıkış LED ve CIP salonları.'
  },
  {
    id: 'o4',
    clientName: 'LC Waikiki',
    campaignName: 'Yaz Koleksiyonu',
    value: '₺3.400.000',
    valueNumeric: 3400000,
    spacesList: ['SG-004', 'SG-006'],
    owner: 'Ahmet Demir',
    lastActivity: 'Fiyat revizyonu bekliyor',
    closeProbability: 52,
    stage: 'İhtiyaç Analizi',
    closingDate: '10 Tem 2025',
    priority: 'Düşük',
    details: 'Baskılı lightbox üniteleri ve bagaj alım LED alanları.'
  },
  {
    id: 'o5',
    clientName: 'Garanti BBVA',
    campaignName: 'Seyahat Kartı Kampanyası',
    value: '₺4.800.000',
    valueNumeric: 4800000,
    spacesList: ['SG-010', 'SG-023'],
    owner: 'Ahmet Demir',
    lastActivity: 'Müşteri talepleri alındı',
    closeProbability: 58,
    stage: 'İlk Görüşme',
    closingDate: '07 Haz 2025',
    priority: 'Orta',
    details: 'CIP salonu ekranları kiralama talepleri.'
  },
  {
    id: 'o6',
    clientName: 'Türk Hava Yolları',
    campaignName: 'Global Miles Kampanyası',
    value: '₺9.750.000',
    valueNumeric: 9750000,
    spacesList: ['SG-001', 'SG-003', 'SG-021'],
    owner: 'Cemil Sezgin',
    lastActivity: 'Pazarlık toplantısı yapıldı',
    closeProbability: 82,
    stage: 'Pazarlık',
    closingDate: '30 Haz 2025',
    priority: 'Yüksek',
    details: '3 dev LED ekran kiralama, uzun vadeli yenileme teklifi.'
  }
];
