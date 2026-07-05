export interface RevenueHistoryPoint {
  period: string;
  revenue: number;
  occupancy: number;
}

export interface SpaceReportItem {
  spaceCode: string;
  revenue: number;
  occupancy: number;
  successRate: number;
}

export interface BrandReportItem {
  name: string;
  logo: string;
  logoUrl?: string;
  totalRevenue: string;
  activeCampaigns: number;
  totalSpaces: number;
  aiScore: number;
}

export interface FunnelStage {
  stage: string;
  count: number;
  value: string;
  valueNumeric: number;
}

export interface LiveActivity {
  id: string;
  time: string;
  type: 'Teklif' | 'Rezervasyon' | 'Kampanya' | 'Sözleşme' | 'Tahsilat' | 'Bakım';
  message: string;
  status: 'info' | 'success' | 'warning' | 'error';
}

export interface ActionItem {
  id: string;
  category: 'Aranacaklar' | 'Teklifler' | 'İmzalanacaklar' | 'Kreatifler' | 'Toplantılar';
  title: string;
  target: string;
}

export const reportsData = {
  revenueTrends: {
    monthly: [
      { period: 'Oca', revenue: 38.5, occupancy: 82 },
      { period: 'Şub', revenue: 39.8, occupancy: 84 },
      { period: 'Mar', revenue: 41.2, occupancy: 88 },
      { period: 'Nis', revenue: 42.0, occupancy: 91 },
      { period: 'May', revenue: 42.5, occupancy: 94 },
      { period: 'Haz', revenue: 42.8, occupancy: 96.8 }
    ],
    yearly: [
      { period: '2021', revenue: 380, occupancy: 72 },
      { period: '2022', revenue: 440, occupancy: 78 },
      { period: '2023', revenue: 510, occupancy: 83 },
      { period: '2024', revenue: 610, occupancy: 90 },
      { period: '2025', revenue: 684.5, occupancy: 96.8 }
    ]
  } as Record<string, RevenueHistoryPoint[]>,

  spacePerformance: [
    { spaceCode: 'SG-001', revenue: 14500000, occupancy: 98, successRate: 99 },
    { spaceCode: 'SG-021', revenue: 12800000, occupancy: 95, successRate: 98 },
    { spaceCode: 'SG-045', revenue: 11200000, occupancy: 92, successRate: 97 },
    { spaceCode: 'SG-017', revenue: 9500000, occupancy: 90, successRate: 94 },
    { spaceCode: 'SG-003', revenue: 8800000, occupancy: 88, successRate: 96 },
    { spaceCode: 'SG-010', revenue: 7900000, occupancy: 85, successRate: 99 },
    { spaceCode: 'SG-023', revenue: 6800000, occupancy: 82, successRate: 98 },
    { spaceCode: 'SG-004', revenue: 5400000, occupancy: 78, successRate: 91 },
    { spaceCode: 'SG-005', revenue: 4800000, occupancy: 75, successRate: 88 },
    { spaceCode: 'SG-006', revenue: 3900000, occupancy: 70, successRate: 95 }
  ] as SpaceReportItem[],

  brandPerformance: [
    { name: 'Samsung Electronics', logo: 'S', logoUrl: '/logos/samsung.svg', totalRevenue: '₺87.500.000', activeCampaigns: 4, totalSpaces: 18, aiScore: 9.4 },
    { name: 'Türk Hava Yolları', logo: 'T', logoUrl: '/logos/thy.svg', totalRevenue: '₺120.000.000', activeCampaigns: 5, totalSpaces: 22, aiScore: 9.6 },
    { name: 'Turkcell', logo: 'T', logoUrl: '/logos/turkcell.svg', totalRevenue: '₺65.000.000', activeCampaigns: 3, totalSpaces: 12, aiScore: 9.1 },
    { name: 'Mercedes-Benz Türkiye', logo: 'M', logoUrl: '/logos/mercedes.svg', totalRevenue: '₺45.000.000', activeCampaigns: 2, totalSpaces: 6, aiScore: 8.9 },
    { name: 'Pegasus Airlines', logo: 'P', logoUrl: '/logos/pegasus.svg', totalRevenue: '₺18.000.000', activeCampaigns: 2, totalSpaces: 4, aiScore: 7.2 },
    { name: 'Garanti BBVA', logo: 'G', logoUrl: '/logos/garanti.svg', totalRevenue: '₺38.000.000', activeCampaigns: 3, totalSpaces: 10, aiScore: 9.0 },
    { name: 'LC Waikiki', logo: 'L', logoUrl: '/logos/lcwaikiki.svg', totalRevenue: '₺32.000.000', activeCampaigns: 2, totalSpaces: 8, aiScore: 8.5 }
  ] as BrandReportItem[],

  funnelStages: [
    { stage: 'Lead', count: 48, value: '₺24.500.000', valueNumeric: 24500000 },
    { stage: 'Teklif', count: 32, value: '₺18.700.000', valueNumeric: 18700000 },
    { stage: 'Sunum', count: 21, value: '₺14.200.000', valueNumeric: 14200000 },
    { stage: 'Pazarlık', count: 14, value: '₺9.500.000', valueNumeric: 9500000 },
    { stage: 'Onay', count: 8, value: '₺8.100.000', valueNumeric: 8100000 },
    { stage: 'Sözleşme', count: 5, value: '₺12.000.000', valueNumeric: 12000000 },
    { stage: 'Rezervasyon', count: 4, value: '₺7.800.000', valueNumeric: 7800000 },
    { stage: 'Tamamlandı', count: 18, value: '₺94.750.000', valueNumeric: 94750000 }
  ] as FunnelStage[],

  activities: [
    { id: 'a1', time: '10:42', type: 'Sözleşme', message: 'Samsung Galaxy AI Sözleşmesi imzalandı.', status: 'success' },
    { id: 'a2', time: '11:15', type: 'Rezervasyon', message: 'Turkcell SG-003 alanına rezervasyon ekledi.', status: 'info' },
    { id: 'a3', time: '13:00', type: 'Bakım', message: 'SG-021 LED Panel arızası giderildi.', status: 'success' },
    { id: 'a4', time: '14:30', type: 'Tahsilat', message: 'Pegasus Airlines peşinat ödemesi alındı.', status: 'success' },
    { id: 'a5', time: '15:20', type: 'Teklif', message: 'Mercedes AMG Kampanya Teklifi gönderildi.', status: 'info' },
    { id: 'a6', time: '16:00', type: 'Kampanya', message: 'LC Waikiki kreatif dosyalarında revize istendi.', status: 'warning' },
    { id: 'a7', time: '17:15', type: 'Bakım', message: 'SG-045 lobi ekranında periyodik bakım başladı.', status: 'warning' }
  ] as LiveActivity[],

  actionItems: [
    { id: 'ac1', category: 'Aranacaklar', title: 'Pegasus Satış Temsilcisi', target: 'Yenileme Teklifi' },
    { id: 'ac2', category: 'Teklifler', title: 'Hepsiburada Teknoloji', target: '₺4.500.000 Hazırla' },
    { id: 'ac3', category: 'İmzalanacaklar', title: 'Mercedes-Benz Hukuk', target: 'Müşteri Islak İmza' },
    { id: 'ac4', category: 'Kreatifler', title: 'THY Global Miles', target: 'Yayın Onayı Ver' },
    { id: 'ac5', category: 'Toplantılar', title: 'Samsung Pazarlama Ekibi', target: '15:30 Zoom Görüşmesi' }
  ] as ActionItem[]
};
