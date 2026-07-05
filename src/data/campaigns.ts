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
  proposalId: string;
  contractId: string;
  reservationId: string;
  mediaAgency: string;
  creativeAgency: string;
  creativeFiles: CreativeFile[];
  aiAnalysisNotes: string[];
  impressions: string;
  reach: string;
  frequency: number;
  airtimeHours: number;
  bestSpace: string;
  riskySpace: string;
  // Global Relations
  companyId?: string;
  spaceIds?: string[];
}

export const campaigns: Campaign[] = [
  {
    id: 'CAM-0001',
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
    proposalId: 'OFF-0001',
    contractId: 'CON-0001',
    reservationId: 'RSV-0001',
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
    riskySpace: 'SG-021',
    companyId: 'CMP-0001',
    spaceIds: ['SPC-0001', 'SPC-0021', 'SPC-0045']
  },
  {
    id: 'CAM-0002',
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
    proposalId: 'OFF-0003',
    contractId: 'CON-0002',
    reservationId: 'RSV-0002',
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
    riskySpace: 'SG-017',
    companyId: 'CMP-0002',
    spaceIds: ['SPC-0003', 'SPC-0017']
  },
  {
    id: 'CAM-0003',
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
    proposalId: 'OFF-0002',
    contractId: 'CON-0003',
    reservationId: 'RSV-0003',
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
    riskySpace: '-',
    companyId: 'CMP-0003',
    spaceIds: ['SPC-0001', 'SPC-0003', 'SPC-0021']
  },
  {
    id: 'CAM-0004',
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
    proposalId: 'OFF-0004',
    contractId: 'CON-0004',
    reservationId: 'RSV-0005',
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
    riskySpace: 'SG-045',
    companyId: 'CMP-0005',
    spaceIds: ['SPC-0045']
  },
  {
    id: 'CAM-0005',
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
    proposalId: 'OFF-0005',
    contractId: 'CON-0005',
    reservationId: 'RSV-0004',
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
    riskySpace: 'SG-004',
    companyId: 'CMP-0004',
    spaceIds: ['SPC-0004', 'SPC-0006']
  }
];
export const campaignsList = campaigns; // alias
