export interface Reservation {
  id: string;
  spaceCode: string;
  spaceName: string;
  location: string;
  clientName: string;
  agencyName: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  status: 'Aktif' | 'Yaklaşan' | 'Tamamlandı' | 'İptal';
  budget: string;
  creativeFiles: string[];
  aiRecommendation: string;
  daysLeft?: number;
  // Global Relations
  companyId?: string;
  spaceId?: string;
  offerId?: string;
  contractId?: string;
  campaignId?: string;
}

export interface Conflict {
  id: string;
  spaceCode: string;
  spaceName: string;
  clientA: string;
  datesA: string;
  clientB: string;
  datesB: string;
  reason: string;
}

export const reservations: Reservation[] = [
  {
    id: 'RSV-0001',
    spaceCode: 'SG-001',
    spaceName: 'Giriş LED Ekran',
    location: 'İç Hatlar Giriş',
    clientName: 'Samsung Electronics',
    agencyName: 'Mindshare',
    startDate: '01 Haz 2025',
    endDate: '30 Haz 2025',
    durationDays: 30,
    status: 'Aktif',
    budget: '₺2.450.000',
    creativeFiles: ['Galaxy_Fold_Launch_Video.mp4', 'Galaxy_Fold_Banner.jpg', 'specifications.pdf'],
    aiRecommendation: 'Bu rezervasyon bitmeden 15 gün önce yeni teklif hazırlanması önerilir.',
    companyId: 'CMP-0001',
    spaceId: 'SPC-0001',
    offerId: 'OFF-0001',
    contractId: 'CON-0001',
    campaignId: 'CAM-0001'
  },
  {
    id: 'RSV-0002',
    spaceCode: 'SG-002',
    spaceName: 'Check-in Önü LED',
    location: 'İç Hatlar Check-in',
    clientName: 'Turkcell',
    agencyName: 'Starcom',
    startDate: '05 Haz 2025',
    endDate: '15 Haz 2025',
    durationDays: 10,
    status: 'Aktif',
    budget: '₺850.000',
    creativeFiles: ['Turkcell_Pasaport_Video.mp4', 'banner.png'],
    aiRecommendation: 'Kampanya bitiminden sonra LC Waikiki ile görüşülebilir; benzer alanlara ilgileri bulunuyor.',
    companyId: 'CMP-0002',
    spaceId: 'SPC-0021',
    offerId: 'OFF-0003',
    contractId: 'CON-0002',
    campaignId: 'CAM-0002'
  },
  {
    id: 'RSV-0003',
    spaceCode: 'SG-003',
    spaceName: 'Pasaport Kontrol Üstü',
    location: 'Dış Hatlar Güvenlik',
    clientName: 'Türk Hava Yolları',
    agencyName: 'Starcom',
    startDate: '01 Haz 2025',
    endDate: '20 Haz 2025',
    durationDays: 20,
    status: 'Aktif',
    budget: '₺1.950.000',
    creativeFiles: ['THY_Global_Widen_Your_World.mp4', 'thy_banner.jpg'],
    aiRecommendation: 'Temmuz dönemi için yenileme opsiyonu THY yetkililerine iletildi, yanıt bekleniyor.',
    companyId: 'CMP-0003',
    spaceId: 'SPC-0003',
    offerId: 'OFF-0002',
    contractId: 'CON-0003',
    campaignId: 'CAM-0003'
  },
  {
    id: 'RSV-0004',
    spaceCode: 'SG-004',
    spaceName: 'Duty Free Yanı Lightbox',
    location: 'Dış Hatlar Duty Free',
    clientName: 'LC Waikiki',
    agencyName: 'OMD',
    startDate: '15 Haz 2025',
    endDate: '20 Haz 2025',
    durationDays: 5,
    status: 'Aktif',
    budget: '₺450.000',
    creativeFiles: ['lcw_kids_print.pdf', 'lcw_kids_mockup.jpg'],
    aiRecommendation: 'Kısa süreli bu baskılı alan boşalınca Mercedes-Benz ile dijital geçiş için görüşülebilir.',
    companyId: 'CMP-0004',
    spaceId: 'SPC-0004',
    offerId: 'OFF-0005',
    contractId: 'CON-0005',
    campaignId: 'CAM-0005'
  },
  {
    id: 'RSV-0005',
    spaceCode: 'SG-005',
    spaceName: 'Yürüyen Bant Yanı LED',
    location: 'İç Hatlar Bagaj',
    clientName: 'Mercedes-Benz Türkiye',
    agencyName: 'Wavemaker',
    startDate: '10 Tem 2025',
    endDate: '25 Tem 2025',
    durationDays: 15,
    status: 'Yaklaşan',
    budget: '₺1.600.000',
    creativeFiles: ['AMG_Performance_Launch.mp4'],
    aiRecommendation: 'Kreatif dosya formatı P3.91 LED Pitch standartlarına göre onaylandı.',
    companyId: 'CMP-0005',
    spaceId: 'SPC-0045',
    offerId: 'OFF-0004',
    contractId: 'CON-0004',
    campaignId: 'CAM-0004'
  }
];

export const conflicts: Conflict[] = [
  {
    id: 'c1',
    spaceCode: 'SG-021',
    spaceName: 'Check-in Desk B Panel',
    clientA: 'Samsung Electronics',
    datesA: '01 Tem - 15 Tem 2025',
    clientB: 'Turkcell',
    datesB: '10 Tem - 30 Tem 2025',
    reason: '10 Tem - 15 Tem (5 Gün) Tarihleri arasında çakışma riski bulunuyor.'
  },
  {
    id: 'c2',
    spaceCode: 'SG-045',
    spaceName: 'Duty Free Lobi LED',
    clientA: 'Mercedes-Benz Türkiye',
    datesA: '05 Ağu - 20 Ağu 2025',
    clientB: 'Türk Hava Yolları',
    datesB: '18 Ağu - 31 Ağu 2025',
    reason: '18 Ağu - 20 Ağu (2 Gün) Tarihleri arasında çakışma riski bulunuyor.'
  }
];
export const reservationsList = reservations; // alias
