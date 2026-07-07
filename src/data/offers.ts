export interface Offer {
  id: string;
  clientName: string;
  campaignName: string;
  value: string;
  valueNumeric: number;
  spacesList: string[];
  owner: string;
  lastActivity: string;
  closeProbability: number;
  stage: 'Lead' | 'İlk Görüşme' | 'İhtiyaç Analizi' | 'Teklif Hazırlandı' | 'Sunum Yapıldı' | 'Pazarlık' | 'Onay Bekleniyor' | 'Sözleşme' | 'Rezervasyon' | 'Tamamlandı';
  closingDate: string;
  details: string;
  priority: 'Yüksek' | 'Orta' | 'Düşük';
  // Global Relations
  companyId?: string;
  spaceIds?: string[];
  contractId?: string;
  reservationId?: string;
  campaignId?: string;
  notes?: string;
  deleted_at?: string;
  deleted_by?: string;
  discount_rate?: number;
  discount_amount?: number;
  net_amount?: number;
  vat_amount?: number;
  grand_total?: number;
  customer_budget?: number;
}

export const offers: Offer[] = [
  {
    id: 'OFF-0001',
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
    details: '3 alan, 30 gün yayın. LED video + lightbox paketi. Medya kiti dahil.',
    companyId: 'CMP-0001',
    spaceIds: ['SPC-0001', 'SPC-0021', 'SPC-0045'],
    contractId: 'CON-0001',
    reservationId: 'RSV-0001',
    campaignId: 'CAM-0001'
  },
  {
    id: 'OFF-0002',
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
    details: '3 dev LED ekran kiralama, uzun vadeli yenileme teklifi.',
    companyId: 'CMP-0003',
    spaceIds: ['SPC-0001', 'SPC-0003', 'SPC-0021'],
    contractId: 'CON-0003',
    reservationId: 'RSV-0003',
    campaignId: 'CAM-0003'
  },
  {
    id: 'OFF-0003',
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
    details: '2 alan, 15 gün yayın. Gençlik paketi ve pasaport geçiş ekranları.',
    companyId: 'CMP-0002',
    spaceIds: ['SPC-0003', 'SPC-0017'],
    contractId: 'CON-0002',
    reservationId: 'RSV-0002',
    campaignId: 'CAM-0002'
  },
  {
    id: 'OFF-0004',
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
    details: '2 premium alan, 30 gün yayın. Dış hat çıkış LED ve CIP salonları.',
    companyId: 'CMP-0005',
    spaceIds: ['SPC-0045'],
    contractId: 'CON-0004',
    reservationId: 'RSV-0005',
    campaignId: 'CAM-0004'
  },
  {
    id: 'OFF-0005',
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
    details: 'Baskılı lightbox üniteleri ve bagaj alım LED alanları.',
    companyId: 'CMP-0004',
    spaceIds: ['SPC-0004', 'SPC-0006'],
    contractId: 'CON-0005',
    reservationId: 'RSV-0004',
    campaignId: 'CAM-0005'
  }
];
export const offersList = offers; // alias
