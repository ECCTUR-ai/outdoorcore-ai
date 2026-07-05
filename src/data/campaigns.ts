export interface CreativeFile {
  name: string;
  type: 'Video MP4' | 'Banner JPG' | 'Lightbox PDF' | 'Storyboard PDF' | 'Brand Guide PDF' | 'IMG' | 'PDF';
  uploadDate: string;
  status: 'Onaylandı' | 'Bekliyor' | 'Revize';
}

export interface Campaign {
  id: string;
  clientName: string;
  campaignName: string;
  status: 'Aktif' | 'Planlandı' | 'Onay Bekliyor' | 'Tamamlandı';
  startDate: string;
  endDate: string;
  daysLeft?: number;
  budget: string;
  spacesList: string[];
  successRate: number;
  creativesCount: number;
  aiScore: number;
  logo: string;
  logoUrl?: string;
  // Detail Specifics
  proposalId: string;
  contractId: string;
  reservationId: string;
  mediaAgency: string;
  creativeAgency: string;
  creativeFiles: CreativeFile[];
  aiAnalysisNotes: string[];
  // Performance numbers
  impressions: string;
  reach: string;
  frequency: number;
  airtimeHours: number;
  bestSpace: string;
  riskySpace: string;
}

export const campaigns: Campaign[] = [
  {
    id: 'cmp1',
    clientName: 'Samsung Electronics',
    campaignName: 'Galaxy AI Lansmanı',
    status: 'Aktif',
    startDate: '01 Haz 2025',
    endDate: '30 Haz 2025',
    daysLeft: 18,
    budget: '₺8.500.000',
    spacesList: ['SG-001', 'SG-021', 'SG-045'],
    successRate: 98,
    creativesCount: 6,
    aiScore: 9.4,
    logo: 'S',
    logoUrl: '/logos/samsung.svg',
    proposalId: 'OF-00021',
    contractId: 'OC-2025-00124',
    reservationId: 'RS-00125',
    mediaAgency: 'Mindshare',
    creativeAgency: 'Publicis',
    creativeFiles: [
      { name: 'galaxy-ai-video.mp4', type: 'Video MP4', uploadDate: '28 May 2025', status: 'Onaylandı' },
      { name: 'banner-1920x1080.jpg', type: 'Banner JPG', uploadDate: '28 May 2025', status: 'Onaylandı' },
      { name: 'lightbox-design.pdf', type: 'Lightbox PDF', uploadDate: '28 May 2025', status: 'Onaylandı' },
      { name: 'storyboard.pdf', type: 'Storyboard PDF', uploadDate: '28 May 2025', status: 'Onaylandı' },
      { name: 'brand-guideline.pdf', type: 'Brand Guide PDF', uploadDate: '28 May 2025', status: 'Onaylandı' }
    ],
    aiAnalysisNotes: [
      'Bu kampanya İç Hatlar Giriş alanında yüksek görünürlük sağlıyor.',
      'Duty Free alanına ek yayın verilirse erişim %18 artabilir.',
      'SG-021 alanı kampanya bitişinden sonra yeni dönem için tekrar rezerve edilebilir.'
    ],
    impressions: '1.840.000',
    reach: '1.240.000',
    frequency: 1.48,
    airtimeHours: 684,
    bestSpace: 'SG-001',
    riskySpace: 'SG-021'
  },
  {
    id: 'cmp2',
    clientName: 'Turkcell',
    campaignName: 'Yaz İletişim Kampanyası',
    status: 'Aktif',
    startDate: '05 Haz 2025',
    endDate: '05 Tem 2025',
    daysLeft: 30,
    budget: '₺6.200.000',
    spacesList: ['SG-003', 'SG-017'],
    successRate: 94,
    creativesCount: 4,
    aiScore: 8.8,
    logo: 'T',
    logoUrl: '/logos/turkcell.svg',
    proposalId: 'OF-00034',
    contractId: 'OC-2025-00130',
    reservationId: 'RS-00132',
    mediaAgency: 'Starcom',
    creativeAgency: 'Rafineri',
    creativeFiles: [
      { name: 'turkcell-yaz-spot.mp4', type: 'Video MP4', uploadDate: '01 Haz 2025', status: 'Onaylandı' },
      { name: 'banner-pasaport.jpg', type: 'Banner JPG', uploadDate: '01 Haz 2025', status: 'Onaylandı' }
    ],
    aiAnalysisNotes: [
      'Yolcuların bekleme alanlarında ekranı fark etme oranı %82 olarak ölçümlendi.'
    ],
    impressions: '1.250.000',
    reach: '890.000',
    frequency: 1.35,
    airtimeHours: 420,
    bestSpace: 'SG-003',
    riskySpace: 'SG-017'
  },
  {
    id: 'cmp3',
    clientName: 'Türk Hava Yolları',
    campaignName: 'Global Miles',
    status: 'Planlandı',
    startDate: '15 Haz 2025',
    endDate: '15 Tem 2025',
    daysLeft: 9,
    budget: '₺9.750.000',
    spacesList: ['SG-001', 'SG-003', 'SG-021'],
    successRate: 0,
    creativesCount: 3,
    aiScore: 9.1,
    logo: 'T',
    logoUrl: '/logos/thy.svg',
    proposalId: 'OF-00010',
    contractId: 'OC-2025-00110',
    reservationId: 'RS-00112',
    mediaAgency: 'Starcom',
    creativeAgency: 'Publicis',
    creativeFiles: [
      { name: 'thy-global-spot.mp4', type: 'Video MP4', uploadDate: '08 Haz 2025', status: 'Bekliyor' }
    ],
    aiAnalysisNotes: [
      'Kreatif dosyalardan biri henüz onaylanmadı. Kampanyanın aksamaması için onay süreci hızlandırılmalı.'
    ],
    impressions: '0',
    reach: '0',
    frequency: 0,
    airtimeHours: 0,
    bestSpace: 'SG-003',
    riskySpace: '-'
  },
  {
    id: 'cmp4',
    clientName: 'Mercedes-Benz Türkiye',
    campaignName: 'EQ Serisi Lansmanı',
    status: 'Onay Bekliyor',
    startDate: '10 Haz 2025',
    endDate: '10 Tem 2025',
    daysLeft: 4,
    budget: '₺7.900.000',
    spacesList: ['SG-045', 'SG-067'],
    successRate: 0,
    creativesCount: 5,
    aiScore: 8.9,
    logo: 'M',
    logoUrl: '/logos/mercedes.svg',
    proposalId: 'OF-00045',
    contractId: 'OC-2025-00142',
    reservationId: 'RS-00140',
    mediaAgency: 'Wavemaker',
    creativeAgency: 'Publicis',
    creativeFiles: [
      { name: 'mercedes-eq-spot.mp4', type: 'Video MP4', uploadDate: '02 Haz 2025', status: 'Revize' }
    ],
    aiAnalysisNotes: [
      'Gelen kreatif dosyasının çözünürlüğü SG-045 boyutlarıyla uyuşmuyor. Revize talep edildi.'
    ],
    impressions: '0',
    reach: '0',
    frequency: 0,
    airtimeHours: 0,
    bestSpace: '-',
    riskySpace: 'SG-045'
  },
  {
    id: 'cmp5',
    clientName: 'LC Waikiki',
    campaignName: 'Yaz Koleksiyonu',
    status: 'Aktif',
    startDate: '01 Haz 2025',
    endDate: '20 Haz 2025',
    daysLeft: 14,
    budget: '₺3.400.000',
    spacesList: ['SG-004', 'SG-006'],
    successRate: 87,
    creativesCount: 4,
    aiScore: 8.1,
    logo: 'L',
    logoUrl: '/logos/lcwaikiki.svg',
    proposalId: 'OF-00004',
    contractId: 'OC-2025-00105',
    reservationId: 'RS-00108',
    mediaAgency: 'OMD',
    creativeAgency: 'Rafineri',
    creativeFiles: [
      { name: 'lcw-kids-print.pdf', type: 'Lightbox PDF', uploadDate: '25 May 2025', status: 'Onaylandı' }
    ],
    aiAnalysisNotes: [
      'Açık hava reklamlarında görsellerin kontrast oranı optimize edilerek okuma kolaylığı sağlandı.'
    ],
    impressions: '580.000',
    reach: '420.000',
    frequency: 1.25,
    airtimeHours: 240,
    bestSpace: 'SG-006',
    riskySpace: 'SG-004'
  },
  {
    id: 'cmp6',
    clientName: 'Garanti BBVA',
    campaignName: 'Seyahat Kartı Kampanyası',
    status: 'Tamamlandı',
    startDate: '01 May 2025',
    endDate: '31 May 2025',
    budget: '₺4.800.000',
    spacesList: ['SG-010', 'SG-023'],
    successRate: 99,
    creativesCount: 7,
    aiScore: 9.0,
    logo: 'G',
    logoUrl: '/logos/garanti.svg',
    proposalId: 'OF-00018',
    contractId: 'OC-2025-00108',
    reservationId: 'RS-00110',
    mediaAgency: 'Mindshare',
    creativeAgency: 'Publicis',
    creativeFiles: [
      { name: 'garanti-miles-spot.mp4', type: 'Video MP4', uploadDate: '20 Nis 2025', status: 'Onaylandı' }
    ],
    aiAnalysisNotes: [
      'Kampanya başarıyla tamamlandı. Hedeflenen seyahat kartı başvuru sayısında artış raporlandı.'
    ],
    impressions: '2.100.000',
    reach: '1.450.000',
    frequency: 1.55,
    airtimeHours: 744,
    bestSpace: 'SG-010',
    riskySpace: '-'
  }
];
