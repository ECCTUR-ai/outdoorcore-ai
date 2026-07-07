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

export const reservations: Reservation[] = [];
export const conflicts: Conflict[] = [];
export const reservationsList = reservations; // alias
