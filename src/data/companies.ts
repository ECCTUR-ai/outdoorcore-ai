export interface ContactPerson {
  name: string;
  role: string;
}

export interface Company {
  id: string;
  name: string;
  sector: string;
  city: string;
  status: 'Aktif' | 'Pasif';
  campaignsCount: number;
  totalSpend: string;
  activeSpacesCount: number;
  lastCampaign: string;
  upcomingCampaign: string;
  aiScore: number;
  logo: string;
  logoUrl?: string;
  // Relationship mappings
  linkedOfferIds?: string[];
  linkedContractIds?: string[];
  linkedReservationIds?: string[];
  linkedCampaignIds?: string[];
  linkedInvoiceIds?: string[];
  // Detail Panel specifics
  headquarters: string;
  website: string;
  phone: string;
  email: string;
  taxNo: string;
  taxOffice: string;
  crmStatus: 'VIP' | 'Gold' | 'Silver' | 'Lead';
  mediaAgency: string;
  creativeAgency: string;
  budget: string;
  brands: string[];
  campaignList: string[];
  spacesList: string[];
  offersList: Array<{ stage: 'Lead' | 'Teklif' | 'Sunum' | 'Pazarlık' | 'Sözleşme'; value: string }>;
  contractsList: Array<{ status: 'Aktif' | 'Yakında Bitecek' | 'Süresi Dolmuş'; name: string }>;
  filesList: Array<{ type: 'PDF' | 'PPT' | 'IMG'; name: string }>;
  notesList: string[];
  contacts: ContactPerson[];
}

export const companies: Company[] = [
  {
    id: 'CMP-0001',
    name: 'Samsung Electronics',
    sector: 'Elektronik',
    city: 'İstanbul',
    status: 'Aktif',
    campaignsCount: 42,
    totalSpend: '₺87.500.000',
    activeSpacesCount: 18,
    lastCampaign: 'Galaxy Fold',
    upcomingCampaign: 'Samsung AI TV',
    aiScore: 9.4,
    logo: 'S',
    logoUrl: '/logos/samsung.svg',
    linkedOfferIds: ['OFF-0001'],
    linkedContractIds: ['CON-0001'],
    linkedReservationIds: ['RSV-0001'],
    linkedCampaignIds: ['CAM-0001'],
    linkedInvoiceIds: ['INV-0001', 'INV-0002'],
    headquarters: 'İstanbul (Merkez)',
    website: 'www.samsung.com/tr',
    phone: '+90 212 366 3000',
    email: 'corporate.tr@samsung.com',
    taxNo: '7420038841',
    taxOffice: 'Büyük Mükellefler',
    crmStatus: 'VIP',
    mediaAgency: 'Mindshare',
    creativeAgency: 'Publicis',
    budget: '₺120.000.000',
    brands: ['Samsung Mobile', 'Galaxy S25', 'Neo QLED TV', 'Bespoke Beyaz Eşya', 'SmartThings'],
    campaignList: ['Galaxy S25 Lansmanı', 'Neo QLED Kampanyası', 'Galaxy Fold Tanıtımı', 'Flip Tasarım Günleri'],
    spacesList: ['SG-001', 'SG-010', 'SG-021', 'SG-045'],
    offersList: [
      { stage: 'Teklif', value: '₺2.450.000' },
      { stage: 'Pazarlık', value: '₺1.870.000' }
    ],
    contractsList: [
      { status: 'Aktif', name: 'Levent Metro Dijital Reklam Sözleşmesi' },
      { status: 'Yakında Bitecek', name: 'Terminal Giriş LED Kiralama' }
    ],
    filesList: [
      { type: 'PDF', name: 'samsung_kurumsal_kimlik_2026.pdf' },
      { type: 'PPT', name: 'lansman_sunumu_v2.pptx' },
      { type: 'IMG', name: 'galaxy_fold_banner.jpg' }
    ],
    notesList: [
      'Haziran ayı lansman bütçesi revize edilerek ₺15M arttırıldı.',
      'Son toplantıda havalimanı yolcu akışı verilerini talep ettiler.'
    ],
    contacts: [
      { name: 'Ahmet Demir', role: 'Marketing Director' },
      { name: 'Ayşe Kaya', role: 'Brand Manager' }
    ]
  },
  {
    id: 'CMP-0002',
    name: 'Turkcell',
    sector: 'Telekomünikasyon',
    city: 'İstanbul',
    status: 'Aktif',
    campaignsCount: 38,
    totalSpend: '₺65.000.000',
    activeSpacesCount: 12,
    lastCampaign: 'Turkcell Pasaport',
    upcomingCampaign: 'Fizy Yaz Konserleri',
    aiScore: 9.1,
    logo: 'T',
    logoUrl: '/logos/turkcell.svg',
    linkedOfferIds: ['OFF-0003'],
    linkedContractIds: ['CON-0002'],
    linkedReservationIds: ['RSV-0002'],
    linkedCampaignIds: ['CAM-0002'],
    linkedInvoiceIds: ['INV-0003'],
    headquarters: 'İstanbul (Merkez)',
    website: 'www.turkcell.com.tr',
    phone: '+90 212 313 1000',
    email: 'info@turkcell.com.tr',
    taxNo: '8790012290',
    taxOffice: 'Büyük Mükellefler',
    crmStatus: 'Gold',
    mediaAgency: 'Starcom',
    creativeAgency: 'Rafineri',
    budget: '₺95.000.000',
    brands: ['Turkcell Superonline', 'Fizy', 'GNÇ', 'Bip', 'Paycell'],
    campaignList: ['Turkcell Pasaport Lansmanı', 'Superonline Fiber Hız', 'GNÇ Gençlik Festivali'],
    spacesList: ['SG-003', 'SG-018', 'SG-023'],
    offersList: [
      { stage: 'Sözleşme', value: '₺1.950.000' }
    ],
    contractsList: [
      { status: 'Aktif', name: 'Terminal Pasaport Geçiş LED Sözleşmesi' }
    ],
    filesList: [
      { type: 'PDF', name: 'turkcell_fizy_banner_guide.pdf' }
    ],
    notesList: [
      'Superonline kampanyası için dijital ekranlarda rotasyon talep ediliyor.'
    ],
    contacts: [
      { name: 'Mehmet Yılmaz', role: 'Brand Director' }
    ]
  },
  {
    id: 'CMP-0003',
    name: 'Türk Hava Yolları',
    sector: 'Ulaşım',
    city: 'İstanbul',
    status: 'Aktif',
    campaignsCount: 56,
    totalSpend: '₺120.000.000',
    activeSpacesCount: 22,
    lastCampaign: 'Widen Your World',
    upcomingCampaign: 'Mil&Smiles Bonus',
    aiScore: 9.6,
    logo: 'T',
    logoUrl: '/logos/thy.svg',
    linkedOfferIds: ['OFF-0002'],
    linkedContractIds: ['CON-0003'],
    linkedReservationIds: ['RSV-0003'],
    linkedCampaignIds: ['CAM-0003'],
    linkedInvoiceIds: ['INV-0004'],
    headquarters: 'İstanbul (Merkez)',
    website: 'www.turkishairlines.com',
    phone: '+90 212 463 6300',
    email: 'corporate.sales@thy.com',
    taxNo: '8900021363',
    taxOffice: 'Büyük Mükellefler',
    crmStatus: 'VIP',
    mediaAgency: 'Starcom',
    creativeAgency: 'Publicis',
    budget: '₺150.000.000',
    brands: ['Miles&Smiles', 'AnadoluJet', 'THY Cargo'],
    campaignList: ['Widen Your World Global', 'Miles&Smiles Kredi Kartı', 'Cargo Hızlı Teslimat'],
    spacesList: ['SG-003', 'SG-012', 'SG-045', 'SG-067'],
    offersList: [
      { stage: 'Sunum', value: '₺4.500.000' }
    ],
    contractsList: [
      { status: 'Aktif', name: 'Airport Gelen Yolcu Kiralama Sözleşmesi' }
    ],
    filesList: [
      { type: 'PDF', name: 'thy_global_branding_2026.pdf' }
    ],
    notesList: [
      'Gelen yolcu bagaj alım salonundaki dev LED ekranı 6 ay süreyle sabitlediler.'
    ],
    contacts: [
      { name: 'Caner Öztürk', role: 'Corporate Advertising Manager' }
    ]
  },
  {
    id: 'CMP-0004',
    name: 'LC Waikiki',
    sector: 'Perakende & Tekstil',
    city: 'İstanbul',
    status: 'Aktif',
    campaignsCount: 24,
    totalSpend: '₺32.000.000',
    activeSpacesCount: 8,
    lastCampaign: 'Yaz Modası',
    upcomingCampaign: 'Okula Dönüş',
    aiScore: 8.5,
    logo: 'L',
    logoUrl: '/logos/lcwaikiki.svg',
    linkedOfferIds: [],
    linkedContractIds: ['CON-0005'],
    linkedReservationIds: [],
    linkedCampaignIds: ['CAM-0005'],
    linkedInvoiceIds: [],
    headquarters: 'İstanbul (Merkez)',
    website: 'www.lcwaikiki.com',
    phone: '+90 212 657 5555',
    email: 'info@lcwaikiki.com',
    taxNo: '5670038290',
    taxOffice: 'Halkalı Vergi Dairesi',
    crmStatus: 'Silver',
    mediaAgency: 'OMD',
    creativeAgency: 'Rafineri',
    budget: '₺45.000.000',
    brands: ['LCW Home', 'LCW Kids', 'LCW Dream'],
    campaignList: ['Yaz Trendleri Koleksiyonu', 'Bayram Kampanyası'],
    spacesList: ['SG-004', 'SG-017'],
    offersList: [
      { stage: 'Lead', value: '₺1.250.000' }
    ],
    contractsList: [
      { status: 'Süresi Dolmuş', name: 'Maslak Billboard Paket Kiralama' }
    ],
    filesList: [
      { type: 'PDF', name: 'lcw_yaz_moda_rehberi.pdf' }
    ],
    notesList: [
      'Kombin reklamları için dijital lightbox panolarını tercih ediyorlar.'
    ],
    contacts: [
      { name: 'Sibel Can', role: 'Media Planning Lead' }
    ]
  },
  {
    id: 'CMP-0005',
    name: 'Mercedes-Benz Türkiye',
    sector: 'Otomotiv',
    city: 'İstanbul',
    status: 'Aktif',
    campaignsCount: 30,
    totalSpend: '₺45.000.000',
    activeSpacesCount: 6,
    lastCampaign: 'EQE SUV Lansman',
    upcomingCampaign: 'AMG Performance',
    aiScore: 8.9,
    logo: 'M',
    logoUrl: '/logos/mercedes.svg',
    linkedOfferIds: [],
    linkedContractIds: ['CON-0004'],
    linkedReservationIds: [],
    linkedCampaignIds: ['CAM-0004'],
    linkedInvoiceIds: [],
    headquarters: 'İstanbul (Merkez)',
    website: 'www.mercedes-benz.com.tr',
    phone: '+90 212 867 3000',
    email: 'info.tr@mercedes-benz.com',
    taxNo: '6200037300',
    taxOffice: 'Büyük Mükellefler',
    crmStatus: 'Gold',
    mediaAgency: 'Wavemaker',
    creativeAgency: 'Publicis',
    budget: '₺55.000.000',
    brands: ['Mercedes-EQ', 'Mercedes-AMG', 'Mercedes Vans'],
    campaignList: ['EQE Elektrikli SUV Lansmanı', 'C-Class Sedan Tanıtımı'],
    spacesList: ['SG-005', 'SG-045'],
    offersList: [
      { stage: 'Sunum', value: '₺1.600.000' }
    ],
    contractsList: [
      { status: 'Aktif', name: 'VIP Bagaj Alım Alanı Pano Kiralama' }
    ],
    filesList: [
      { type: 'PDF', name: 'eqe_suv_branding_specs.pdf' }
    ],
    notesList: [
      'VIP yolcuların çıkış yaptığı CIP lobi alanına odaklanmak istiyorlar.'
    ],
    contacts: [
      { name: 'Murat Erdem', role: 'Marketing Communication Manager' }
    ]
  },
  {
    id: 'CMP-0006',
    name: 'Pegasus Airlines',
    sector: 'Ulaşım',
    city: 'İstanbul',
    status: 'Pasif',
    campaignsCount: 15,
    totalSpend: '₺18.000.000',
    activeSpacesCount: 0,
    lastCampaign: 'Uç Adana Uç',
    upcomingCampaign: 'Yurt Dışı %40 İndirim',
    aiScore: 7.2,
    logo: 'P',
    logoUrl: '/logos/pegasus.svg',
    linkedOfferIds: [],
    linkedContractIds: [],
    linkedReservationIds: [],
    linkedCampaignIds: [],
    linkedInvoiceIds: [],
    headquarters: 'İstanbul (Merkez)',
    website: 'www.flypgs.com',
    phone: '+90 216 560 7000',
    email: 'corporate@flypgs.com',
    taxNo: '7250029981',
    taxOffice: 'Pendik Vergi Dairesi',
    crmStatus: 'Lead',
    mediaAgency: 'Mindshare',
    creativeAgency: 'OMD',
    budget: '₺25.000.000',
    brands: ['Pegasus Cargo', 'Pegasus Cafe'],
    campaignList: ['Yurt Dışı Uçuş Günleri', 'Pegasus BolBol Üyelik'],
    spacesList: [],
    offersList: [
      { stage: 'Lead', value: '₺850.000' }
    ],
    contractsList: [],
    filesList: [],
    notesList: [
      'Bütçe kısıtı nedeniyle billboard kiralama teklifleri askıya alındı.'
    ],
    contacts: [
      { name: 'Ebru Yıldız', role: 'Brand & Marketing Manager' }
    ]
  }
];
export const companiesList = companies; // alias
