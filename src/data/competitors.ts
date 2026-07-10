export interface Competitor {
  id: string;
  name: string;
  logo: string;
  website: string;
  estimatedOccupancy: number;
  averagePrice: string;
  ledCount: number;
  billboardCount: number;
  lightboxCount: number;
  activeCampaignsCount: number;
  strengths: string[];
  weaknesses: string[];
  regions: string[];
}

export const competitorsList: Competitor[] = [];

export const competitorKpis = {
  totalCompetitors: 0,
  competitorSpaces: 0,
  competitorCampaigns: 0,
  averageOccupancy: "%0",
  averagePriceIndex: "₺0",
  marketShareOutdoorCore: "%0"
};
