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
  deleted_at?: string;
  deleted_by?: string;
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
    name: 'ECCTUR',
    sector: 'Turizm & Havacılık',
    city: 'İstanbul',
    status: 'Aktif',
    campaignsCount: 0,
    totalSpend: '₺0',
    activeSpacesCount: 0,
    lastCampaign: '-',
    upcomingCampaign: '-',
    aiScore: 10.0,
    logo: 'E',
    logoUrl: '/logos/ecctur.svg',
    linkedOfferIds: [],
    linkedContractIds: [],
    linkedReservationIds: [],
    linkedCampaignIds: [],
    linkedInvoiceIds: [],
    headquarters: 'İstanbul (Merkez)',
    website: 'www.ecctur.com',
    phone: '+90 212 111 2233',
    email: 'info@ecctur.com',
    taxNo: '1234567890',
    taxOffice: 'Büyük Mükellefler',
    crmStatus: 'VIP',
    mediaAgency: 'ECCTUR Medya',
    creativeAgency: 'ECCTUR Kreatif',
    budget: '₺0',
    brands: ['ECCTUR Turizm', 'ECCTUR Havacılık'],
    campaignList: [],
    spacesList: [],
    offersList: [],
    contractsList: [],
    filesList: [],
    notesList: ['ECCTUR ana firması.'],
    contacts: [
      { name: 'ECCTUR Temsilcisi', role: 'Genel Müdür' }
    ]
  }
];
export const companiesList = companies; // alias
