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
  stage: 'Rezerve' | 'Teklif Gönderildi' | 'Müşteri Onayı' | 'Sözleşme Bekliyor' | 'Sözleşme İmzalandı' | 'Yayında' | 'Tamamlandı' | 'İptal';
  closingDate: string;
  campaignStartDate?: string;
  campaignEndDate?: string;
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
  isDemo?: boolean;
  source?: string;
  seedVersion?: string;
  discount_rate?: number;
  discount_amount?: number;
  net_amount?: number;
  vat_amount?: number;
  grand_total?: number;
  customer_budget?: number;
}

export const offers: Offer[] = [];
export const offersList = offers; // alias
