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

export const companies: Company[] = [];
export const companiesList = companies; // alias
