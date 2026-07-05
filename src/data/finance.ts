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
  accounts: [
    {
      id: 'CMP-0001',
      name: 'Samsung Electronics',
      logo: 'S',
      logoUrl: '/logos/samsung.svg',
      totalDebt: '₺87.500.000',
      totalCollected: '₺80.000.000',
      balance: '₺7.500.000',
      riskScore: 1.5,
      crmTier: 'VIP',
      totalContracts: '₺87.500.000',
      totalInvoicesCount: 12,
      invoices: [
        { id: 'INV-0001', invoiceNo: 'INV-2025-00101', date: '01 Mar 2025', amount: '₺30.000.000', status: 'Ödendi' },
        { id: 'INV-0002', invoiceNo: 'INV-2025-00124', date: '15 May 2025', amount: '₺30.000.000', status: 'Ödendi' },
        { id: 'INV-0003', invoiceNo: 'INV-2025-00145', date: '15 Tem 2025', amount: '₺27.500.000', status: 'Bekliyor' }
      ],
      collections: [
        { id: 'PAY-0001', date: '15 Mar 2025', amount: '₺30.000.000', method: 'Havale / Banka' },
        { id: 'PAY-0002', date: '17 May 2025', amount: '₺30.000.000', method: 'Havale / Banka' }
      ],
      paymentPlan: [
        { installment: '1. Taksit', dueDate: '15 Mar 2025', amount: '₺30.000.000', status: 'Ödendi' },
        { installment: '2. Taksit', dueDate: '15 May 2025', amount: '₺30.000.000', status: 'Ödendi' },
        { installment: '3. Taksit', dueDate: '15 Tem 2025', amount: '₺27.500.000', status: 'Bekliyor' }
      ],
      receipts: [
        { id: 'rec1', name: 'Dekont_Samsung_1.pdf', date: '15 Mar 2025', size: '240 KB' },
        { id: 'rec2', name: 'Dekont_Samsung_2.pdf', date: '17 May 2025', size: '215 KB' }
      ],
      notes: [
        'Müşteri ödemeleri düzenli olarak takvimde yapmaktadır.',
        'VIP risk profili atanmıştır, tahsilat gecikme riski bulunmamaktadır.'
      ],
      companyId: 'CMP-0001',
      linkedContractIds: ['CON-0001']
    },
    {
      id: 'CMP-0002',
      name: 'Turkcell',
      logo: 'T',
      logoUrl: '/logos/turkcell.svg',
      totalDebt: '₺65.000.000',
      totalCollected: '₺35.000.000',
      balance: '₺30.000.000',
      riskScore: 7.2,
      crmTier: 'Gold',
      totalContracts: '₺65.000.000',
      totalInvoicesCount: 6,
      invoices: [
        { id: 'INV-0004', invoiceNo: 'INV-2025-00112', date: '15 Oca 2025', amount: '₺35.000.000', status: 'Ödendi' },
        { id: 'INV-0005', invoiceNo: 'INV-2025-00130', date: '15 Nis 2025', amount: '₺30.000.000', status: 'Gecikti' }
      ],
      collections: [
        { id: 'PAY-0003', date: '17 Oca 2025', amount: '₺35.000.000', method: 'EFT / Banka' }
      ],
      paymentPlan: [
        { installment: '1. Taksit', dueDate: '15 Oca 2025', amount: '₺35.000.000', status: 'Ödendi' },
        { installment: '2. Taksit', dueDate: '15 Nis 2025', amount: '₺30.000.000', status: 'Gecikti' }
      ],
      receipts: [
        { id: 'rec3', name: 'Dekont_Turkcell_1.pdf', date: '17 Oca 2025', size: '180 KB' }
      ],
      notes: [
        '2. Taksit ödemesi 80 gün gecikmiştir. Risk merkezi uyarı veriyor.',
        'Finans yetkilisi Ahmet Demir ile ihtarname süreci görüşülüyor.'
      ],
      companyId: 'CMP-0002',
      linkedContractIds: ['CON-0002']
    },
    {
      id: 'CMP-0003',
      name: 'Türk Hava Yolları',
      logo: 'T',
      logoUrl: '/logos/thy.svg',
      totalDebt: '₺120.000.000',
      totalCollected: '₺120.000.000',
      balance: '₺0',
      riskScore: 1.0,
      crmTier: 'VIP',
      totalContracts: '₺120.000.000',
      totalInvoicesCount: 2,
      invoices: [
        { id: 'INV-0006', invoiceNo: 'INV-2025-00095', date: '01 Oca 2025', amount: '₺60.000.000', status: 'Ödendi' },
        { id: 'INV-0007', invoiceNo: 'INV-2025-00110', date: '01 Haz 2025', amount: '₺60.000.000', status: 'Ödendi' }
      ],
      collections: [
        { id: 'PAY-0004', date: '02 Oca 2025', amount: '₺60.000.000', method: 'Banka Transfer' },
        { id: 'PAY-0005', date: '05 Haz 2025', amount: '₺60.000.000', method: 'Banka Transfer' }
      ],
      paymentPlan: [
        { installment: '1. Taksit', dueDate: '01 Oca 2025', amount: '₺60.000.000', status: 'Ödendi' },
        { installment: '2. Taksit', dueDate: '01 Haz 2025', amount: '₺60.000.000', status: 'Ödendi' }
      ],
      receipts: [
        { id: 'rec4', name: 'Dekont_THY_1.pdf', date: '02 Oca 2025', size: '310 KB' },
        { id: 'rec5', name: 'Dekont_THY_2.pdf', date: '05 Haz 2025', size: '298 KB' }
      ],
      notes: [
        'En istikrarlı cari hesap. Tüm ödemeler vaktinde tamamlanmıştır.'
      ],
      companyId: 'CMP-0003',
      linkedContractIds: ['CON-0003']
    },
    {
      id: 'CMP-0005',
      name: 'Mercedes-Benz Türkiye',
      logo: 'M',
      logoUrl: '/logos/mercedes.svg',
      totalDebt: '₺45.000.000',
      totalCollected: '₺37.100.000',
      balance: '₺7.900.000',
      riskScore: 5.4,
      crmTier: 'Gold',
      totalContracts: '₺45.000.000',
      totalInvoicesCount: 4,
      invoices: [
        { id: 'INV-0008', invoiceNo: 'INV-2025-00142', date: '15 Haz 2025', amount: '₺7.900.000', status: 'Bekliyor' }
      ],
      collections: [],
      paymentPlan: [
        { installment: 'Tek Ödeme', dueDate: '15 Haz 2025', amount: '₺7.900.000', status: 'Bekliyor' }
      ],
      receipts: [],
      notes: [
        'Sözleşme imza aşamasında olduğundan fatura beklemededir.'
      ],
      companyId: 'CMP-0005',
      linkedContractIds: ['CON-0004']
    },
    {
      id: 'CMP-0004',
      name: 'LC Waikiki',
      logo: 'L',
      logoUrl: '/logos/lcwaikiki.svg',
      totalDebt: '₺18.000.000',
      totalCollected: '₺15.750.000',
      balance: '₺2.250.000',
      riskScore: 3.8,
      crmTier: 'Standard',
      totalContracts: '₺18.000.000',
      totalInvoicesCount: 4,
      invoices: [
        { id: 'INV-0009', invoiceNo: 'INV-2025-00155', date: '10 Tem 2025', amount: '₺2.250.000', status: 'Bekliyor' }
      ],
      collections: [],
      paymentPlan: [
        { installment: 'Final Ödemesi', dueDate: '10 Tem 2025', amount: '₺2.250.000', status: 'Bekliyor' }
      ],
      receipts: [],
      notes: [
        'Peşinat ödemeleri vaktinde yapılmıştır, son taksit takvimdedir.'
      ],
      companyId: 'CMP-0004',
      linkedContractIds: ['CON-0005']
    }
  ] as FinancialAccount[],

  cashFlowTrends: [
    { month: 'Oca', incoming: 48.2, outgoing: 12.0, net: 36.2 },
    { month: 'Şub', incoming: 52.4, outgoing: 14.5, net: 37.9 },
    { month: 'Mar', incoming: 58.5, outgoing: 11.2, net: 47.3 },
    { month: 'Nis', incoming: 62.0, outgoing: 15.0, net: 47.0 },
    { month: 'May', incoming: 68.4, outgoing: 18.2, net: 50.2 },
    { month: 'Haz', incoming: 72.0, outgoing: 16.5, net: 55.5 }
  ] as CashFlowPoint[],

  collectionStatuses: [
    { name: 'Ödendi', value: 612000000, color: '#10b981' },
    { name: 'Bekliyor', value: 58000000, color: '#3b82f6' },
    { name: 'Vadesi Geçti', value: 14500000, color: '#ef4444' },
    { name: 'İptal', value: 2500000, color: '#64748b' }
  ] as CollectionDonutPoint[],

  upcomingPayments: [
    { clientName: 'Türk Hava Yolları', logo: 'T', logoUrl: '/logos/thy.svg', dueDate: '12 Tem 2025', daysLeft: 6, amount: '₺15.000.000', riskLevel: 'Düşük' },
    { clientName: 'Samsung Electronics', logo: 'S', logoUrl: '/logos/samsung.svg', dueDate: '15 Tem 2025', daysLeft: 9, amount: '₺27.500.000', riskLevel: 'Düşük' },
    { clientName: 'Turkcell', logo: 'T', logoUrl: '/logos/turkcell.svg', dueDate: '15 Nis 2025', daysLeft: -82, amount: '₺30.000.000', riskLevel: 'Kritik' },
    { clientName: 'Mercedes-Benz Türkiye', logo: 'M', logoUrl: '/logos/mercedes.svg', dueDate: '15 Haz 2025', daysLeft: -21, amount: '₺7.900.000', riskLevel: 'Yüksek' }
  ] as UpcomingPayment[],

  activities: [
    { id: 'f1', time: '09:15', message: 'THY için INV-2025-00110 nolu fatura kesildi.', type: 'Fatura' },
    { id: 'f2', time: '10:30', message: 'Samsung Electronics ₺30M taksit ödemesi banka hesabına geçti.', type: 'Tahsilat' },
    { id: 'f3', time: '11:45', message: 'Samsung için Dekont_Samsung_2.pdf cari karta yüklendi.', type: 'Dekont' },
    { id: 'f4', time: '14:00', message: 'Turkcell cari hesabı 80 gün gecikme nedeniyle Riskli olarak güncellendi.', type: 'Cari' },
    { id: 'f5', time: '16:30', message: 'Mercedes-Benz ₺7.9M vadesi geçen ödemesi için ajansa mail gönderildi.', type: 'Gecikme' }
  ]
};
