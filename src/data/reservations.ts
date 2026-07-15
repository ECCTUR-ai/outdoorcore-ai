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
  status: 'DRAFT' | 'OPTIONED' | 'CONTRACT_PENDING' | 'SALES_APPROVAL_PENDING' | 'CONFIRMED' | 'CANCELLED' | 'OPTION_EXPIRED' | string;
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
  campaignName?: string;

  // Opsiyon verileri
  optionStartedAt?: string;
  optionExpiresAt?: string;
  optionDurationHours?: number;
  optionCreatedBy?: string;
  optionExtendedAt?: string;
  optionExtendedBy?: string;
  optionExtensionCount?: number;

  // Sözleşme durumu
  contractStatus?: 'DRAFT' | 'SIGNED' | 'CANCELLED' | string;

  // Satış onay verileri
  salesApprovalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVISION_REQUESTED';
  salesApprovedBy?: string;
  salesApprovedAt?: string;
  salesRejectionReason?: string;
  salesRevisionNote?: string;

  // Konfirmasyon verileri
  confirmedAt?: string;
  confirmedBy?: string;
  inventoryLockedAt?: string;
  isDemo?: boolean;
  source?: string;
  seedVersion?: string;
  reservedNetworkCount?: number;
  durationSeconds?: number;
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
