export interface FinancialAccount {
  id: string;
  name: string;
  logo: string;
  logoUrl?: string;
  totalDebt: string;
  totalCollected: string;
  balance: string;
  riskScore: number;
  crmTier: 'VIP' | 'Gold' | 'Silver' | 'Standard';
  totalContracts: string;
  totalInvoicesCount: number;
  invoices: Array<{ id: string; invoiceNo: string; date: string; amount: string; status: 'Ödendi' | 'Bekliyor' | 'Gecikti' | 'İptal' }>;
  collections: Array<{ id: string; date: string; amount: string; method: string }>;
  paymentPlan: Array<{ installment: string; dueDate: string; amount: string; status: 'Ödendi' | 'Bekliyor' | 'Gecikti' }>;
  receipts: Array<{ id: string; name: string; date: string; size: string }>;
  notes: string[];
  // Global Relations
  companyId?: string;
  linkedContractIds?: string[];
  isDemo?: boolean;
  source?: string;
  seedVersion?: string;
}

export interface CashFlowPoint {
  month: string;
  incoming: number;
  outgoing: number;
  net: number;
}

export interface CollectionDonutPoint {
  name: string;
  value: number;
  color: string;
}

export interface UpcomingPayment {
  clientName: string;
  logo: string;
  logoUrl?: string;
  dueDate: string;
  daysLeft: number;
  amount: string;
  riskLevel: 'Kritik' | 'Yüksek' | 'Orta' | 'Düşük';
}

export const financeData = {
  accounts: [] as FinancialAccount[],
  cashFlowTrends: [] as CashFlowPoint[],
  collectionStatuses: [] as CollectionDonutPoint[],
  upcomingPayments: [] as UpcomingPayment[],
  activities: [] as any[]
};
