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
    id: 'r1',
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
    aiRecommendation: 'Bu rezervasyon bitmeden 15 gün önce yeni teklif hazırlanması önerilir.'
  },
  {
    id: 'r2',
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
    aiRecommendation: 'Kampanya bitiminden sonra LC Waikiki ile görüşülebilir; benzer alanlara ilgileri bulunuyor.'
  },
  {
    id: 'r3',
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
    aiRecommendation: 'Temmuz dönemi için yenileme opsiyonu THY yetkililerine iletildi, yanıt bekleniyor.'
  },
  {
    id: 'r4',
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
    aiRecommendation: 'Kısa süreli bu baskılı alan boşalınca Mercedes-Benz ile dijital geçiş için görüşülebilir.'
  },
  {
    id: 'r5',
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
    aiRecommendation: 'Kreatif dosya formatı P3.91 LED Pitch standartlarına göre onaylandı.'
  },
  {
    id: 'r6',
    spaceCode: 'SG-010',
    spaceName: 'Giden Yolcu Lobi LED',
    location: 'İç Hatlar Giriş',
    clientName: 'Pegasus Airlines',
    agencyName: 'OMD',
    startDate: '01 Tem 2025',
    endDate: '15 Tem 2025',
    durationDays: 15,
    status: 'Yaklaşan',
    budget: '₺1.100.000',
    creativeFiles: ['Pegasus_BolBol.mp4'],
    aiRecommendation: 'Sözleşme onayı bekleniyor. Kampanya başlangıcına 25 gün kaldı.'
  },
  {
    id: 'r7',
    spaceCode: 'SG-012',
    spaceName: 'CIP Salonu Dijital Ekran',
    location: 'Dış Hatlar Lobi',
    clientName: 'Garanti BBVA',
    agencyName: 'Mindshare',
    startDate: '12 Tem 2025',
    endDate: '30 Tem 2025',
    durationDays: 18,
    status: 'Yaklaşan',
    budget: '₺980.000',
    creativeFiles: ['Garanti_MilesSmiles.mp4'],
    aiRecommendation: 'Yolcu akışının en yoğun olduğu CIP salonunda yüksek görünürlük skoruna sahip alan.'
  },
  {
    id: 'r8',
    spaceCode: 'SG-017',
    spaceName: 'Duty Free Merkez Lightbox',
    location: 'Dış Hatlar Duty Free',
    clientName: 'Akbank',
    agencyName: 'Publicis',
    startDate: '01 Ağu 2025',
    endDate: '15 Ağu 2025',
    durationDays: 15,
    status: 'Yaklaşan',
    budget: '₺1.250.000',
    creativeFiles: ['Akbank_Wings.pdf'],
    aiRecommendation: 'Ağustos ayı yoğun dış hat trafiği için premium statüde kampanya.'
  },
  {
    id: 'r9',
    spaceCode: 'SG-018',
    spaceName: 'Pasaport Çıkış Dijital Pano',
    location: 'Dış Hatlar Çıkış',
    clientName: 'Papara',
    agencyName: 'OMD',
    startDate: '15 Ağu 2025',
    endDate: '30 Ağu 2025',
    durationDays: 15,
    status: 'Yaklaşan',
    budget: '₺850.000',
    creativeFiles: ['Papara_Card.mp4'],
    aiRecommendation: 'Dijital format teslim süresi yaklaşıyor; hatırlatma e-postası tetiklenebilir.'
  },
  {
    id: 'r10',
    spaceCode: 'SG-023',
    spaceName: 'Bagaj Alım Giriş LED',
    location: 'İç Hatlar Bagaj',
    clientName: 'Hepsiburada',
    agencyName: 'Publicis',
    startDate: '01 Eyl 2025',
    endDate: '15 Eyl 2025',
    durationDays: 15,
    status: 'Yaklaşan',
    budget: '₺1.400.000',
    creativeFiles: ['Hepsiburada_Eylul.mp4'],
    aiRecommendation: 'Güz dönemi okul lansmanı için ön rezerve durumunda.'
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
