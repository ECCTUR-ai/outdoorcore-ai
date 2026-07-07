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
  status: 'Aktif' | 'İmza Bekleyen' | 'Yenileme Bekleyen' | 'Süresi Dolmuş' | 'Riskli' | 'active' | 'signed' | 'pending' | 'cancelled' | 'expired' | 'draft' | 'İptal' | string;
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
  spaceIds?: string[];
}

export const contracts: Contract[] = [];
export const contractsList = contracts; // alias
