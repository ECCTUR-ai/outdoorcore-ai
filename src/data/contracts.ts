export interface PaymentInstallment {
  id: string;
  installment: string;
  dueDate: string;
  status: 'Ödendi' | 'Bekliyor' | 'Gecikti';
  amount: string;
}

export interface ContractHistory {
  year: string;
  campaign: string;
  value: string;
}

export interface Contract {
  id: string;
  contractNo: string;
  clientName: string;
  logo: string;
  value: string;
  valueNumeric: number;
  startDate: string;
  endDate: string;
  daysLeft: number;
  status: 'Aktif' | 'İmza Bekleyen' | 'Yenileme Bekleyen' | 'Süresi Dolmuş' | 'Riskli';
  progress: number;
  crmTier: 'VIP' | 'Gold' | 'Silver' | 'Standard';
  aiRiskScore: number;
  mediaAgency: string;
  campaignName: string;
  proposalId: string;
  reservationId: string;
  spacesList: string[];
  filesList: string[];
  installments: PaymentInstallment[];
  history: ContractHistory[];
  aiRiskAnalysis: string[];
  notes: string[];
  // Global Relations
  companyId?: string;
  offerId?: string;
  campaignId?: string;
}

export const contracts: Contract[] = [
  {
    id: 'CON-0001',
    contractNo: 'OC-2025-00124',
    clientName: 'Samsung Electronics',
    logo: 'S',
    value: '₺8.500.000',
    valueNumeric: 8500000,
    startDate: '01 Mar 2025',
    endDate: '31 Ağu 2025',
    daysLeft: 74,
    status: 'Aktif',
    progress: 60,
    crmTier: 'VIP',
    aiRiskScore: 2.1,
    mediaAgency: 'Mindshare',
    campaignName: 'Galaxy AI',
    proposalId: 'OFF-0001',
    reservationId: 'RSV-0001',
    spacesList: ['SG-001', 'SG-021', 'SG-045'],
    filesList: ['Sozlesme_Galaxy_AI.pdf', 'Ek-1_Teknik_Sartname.pdf', 'Signed_Signature_Page.pdf'],
    installments: [
      { id: 'i1', installment: '1. Taksit', dueDate: '15 Mar 2025', status: 'Ödendi', amount: '₺3.000.000' },
      { id: 'i2', installment: '2. Taksit', dueDate: '15 May 2025', status: 'Ödendi', amount: '₺3.000.000' },
      { id: 'i3', installment: '3. Taksit', dueDate: '15 Tem 2025', status: 'Bekliyor', amount: '₺2.500.000' }
    ],
    history: [
      { year: '2022', campaign: 'Galaxy Fold Lansmanı', value: '₺4.200.000' },
      { year: '2023', campaign: 'Galaxy Watch Serisi', value: '₺5.800.000' },
      { year: '2024', campaign: 'Bespoke Beyaz Eşya', value: '₺7.200.000' },
      { year: '2025', campaign: 'Galaxy AI', value: '₺8.500.000' }
    ],
    aiRiskAnalysis: [
      'Bu sözleşmenin bitmesine 74 gün kaldı.',
      '30 gün sonra yenileme görüşmesi planlanması önerilir.',
      'Samsung son 3 yıldır aynı alanları kiralıyor.',
      'Yenileme ihtimali %91.',
      'SG-021 alanı için alternatif P3.91 LED önerilebilir.'
    ],
    notes: [
      'Ödeme vadeleri vaktinde yapılıyor, tahsilat riski bulunmuyor.',
      'Müşteri yenilemede %10 bütçe artışına sıcak bakıyor.'
    ],
    companyId: 'CMP-0001',
    offerId: 'OFF-0001',
    campaignId: 'CAM-0001'
  },
  {
    id: 'CON-0002',
    contractNo: 'OC-2025-00130',
    clientName: 'Turkcell',
    logo: 'T',
    value: '₺6.200.000',
    valueNumeric: 6200000,
    startDate: '01 Oca 2025',
    endDate: '30 Haz 2025',
    daysLeft: 18,
    status: 'Riskli',
    progress: 90,
    crmTier: 'Gold',
    aiRiskScore: 7.8,
    mediaAgency: 'Starcom',
    campaignName: 'Yaz İletişim',
    proposalId: 'OFF-0003',
    reservationId: 'RSV-0002',
    spacesList: ['SG-003', 'SG-017'],
    filesList: ['Sozlesme_Turkcell_Yaz.pdf'],
    installments: [
      { id: 'i4', installment: '1. Taksit', dueDate: '15 Oca 2025', status: 'Ödendi', amount: '₺3.100.000' },
      { id: 'i5', installment: '2. Taksit', dueDate: '15 Nis 2025', status: 'Gecikti', amount: '₺3.100.000' }
    ],
    history: [
      { year: '2024', campaign: 'Turkcell Superonline', value: '₺5.100.000' }
    ],
    aiRiskAnalysis: [
      'Bitimine 18 gün kalmasına rağmen henüz yenileme onayı alınamadı.',
      '2. Taksit ödemesi 45 gün gecikmiş durumda (tahsilat riski).',
      'Yenileme ihtimali %45 olarak hesaplandı.'
    ],
    notes: [
      'Ödeme gecikmesi için finans ekibi bilgilendirildi, ihtarname hazırlandı.'
    ],
    companyId: 'CMP-0002',
    offerId: 'OFF-0003',
    campaignId: 'CAM-0002'
  },
  {
    id: 'CON-0003',
    contractNo: 'OC-2025-00110',
    clientName: 'Türk Hava Yolları',
    logo: 'T',
    value: '₺12.000.000',
    valueNumeric: 12000000,
    startDate: '01 Oca 2025',
    endDate: '31 Ara 2025',
    daysLeft: 198,
    status: 'Aktif',
    progress: 45,
    crmTier: 'VIP',
    aiRiskScore: 1.5,
    mediaAgency: 'Starcom',
    campaignName: 'Widen Your World',
    proposalId: 'OFF-0002',
    reservationId: 'RSV-0003',
    spacesList: ['SG-003', 'SG-012', 'SG-045', 'SG-067'],
    filesList: ['THY_Global_Sözlesme_2025.pdf'],
    installments: [
      { id: 'i6', installment: '1. Taksit', dueDate: '01 Oca 2025', status: 'Ödendi', amount: '₺6.000.000' },
      { id: 'i7', installment: '2. Taksit', dueDate: '01 Haz 2025', status: 'Ödendi', amount: '₺6.000.000' }
    ],
    history: [
      { year: '2023', campaign: 'Mil&Smiles Lansmanı', value: '₺9.500.000' },
      { year: '2024', campaign: 'Widen Your World', value: '₺11.000.000' }
    ],
    aiRiskAnalysis: [
      'En istikrarlı müşterilerimizden biri. Yenileme riski bulunmuyor.',
      'Tüm ödemeler planlanan takvimde tahsil edildi.',
      'Yenileme ihtimali %96.'
    ],
    notes: [
      'Gelecek yıl için havalimanı dev LED ekranlarındaki opsiyon süreleri uzatıldı.'
    ],
    companyId: 'CMP-0003',
    offerId: 'OFF-0002',
    campaignId: 'CAM-0003'
  },
  {
    id: 'CON-0004',
    contractNo: 'OC-2025-00142',
    clientName: 'Mercedes-Benz Türkiye',
    logo: 'M',
    value: '₺7.900.000',
    valueNumeric: 7900000,
    startDate: '15 Haz 2025',
    endDate: '30 Eyl 2025',
    daysLeft: 84,
    status: 'İmza Bekleyen',
    progress: 5,
    crmTier: 'Gold',
    aiRiskScore: 3.4,
    mediaAgency: 'Wavemaker',
    campaignName: 'EQ Serisi',
    proposalId: 'OFF-0004',
    reservationId: 'RSV-0005',
    spacesList: ['SG-005', 'SG-045'],
    filesList: ['Taslak_Sozlesme_Mercedes.pdf'],
    installments: [
      { id: 'i8', installment: 'Tek Ödeme', dueDate: '15 Haz 2025', status: 'Bekliyor', amount: '₺7.900.000' }
    ],
    history: [],
    aiRiskAnalysis: [
      'Sözleşme taslağı onaylandı, hukuk departmanında imza sürecinde.',
      'Müşteri ıslak imza talep etti.'
    ],
    notes: [
      'Ajans aracılığıyla sözleşme evrakları kuryeyle gönderildi.'
    ],
    companyId: 'CMP-0005',
    offerId: 'OFF-0004',
    campaignId: 'CAM-0004'
  },
  {
    id: 'CON-0005',
    contractNo: 'OC-2025-00155',
    clientName: 'LC Waikiki',
    logo: 'L',
    value: '₺4.500.000',
    valueNumeric: 4500000,
    startDate: '01 Nis 2025',
    endDate: '15 Tem 2025',
    daysLeft: 38,
    status: 'Yenileme Bekleyen',
    progress: 75,
    crmTier: 'Standard',
    aiRiskScore: 5.2,
    mediaAgency: 'OMD',
    campaignName: 'Yurt Dışı İndirim',
    proposalId: 'OFF-0005',
    reservationId: 'RSV-0004',
    spacesList: [],
    filesList: ['LCW_Yurtdisi_2025.pdf'],
    installments: [
      { id: 'i9', installment: 'Peşinat', dueDate: '10 Nis 2025', status: 'Ödendi', amount: '₺2.250.000' },
      { id: 'i10', installment: 'Kapanış', dueDate: '15 Tem 2025', status: 'Bekliyor', amount: '₺2.250.000' }
    ],
    history: [],
    aiRiskAnalysis: [
      'Sözleşme sonuna 38 gün kaldı, yenileme şartnamesi gönderildi.',
      'Yenileme ihtimali %68.'
    ],
    notes: [
      'Kombinasyon teklifleri talep ettiler, yenilemede dijital billboard eklenecek.'
    ],
    companyId: 'CMP-0004',
    offerId: 'OFF-0005',
    campaignId: 'CAM-0005'
  }
];
export const contractsList = contracts; // alias
