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
  revenueTrends: {} as Record<string, RevenueHistoryPoint[]>,
  spacePerformance: [] as SpaceReportItem[],
  brandPerformance: [] as BrandReportItem[],
  funnelStages: [] as FunnelStage[],
  activities: [] as LiveActivity[],
  actionItems: [] as ActionItem[]
};
