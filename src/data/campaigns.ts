export interface CreativeFile {
  name: string;
  type: 'Video MP4' | 'Banner JPG' | 'Lightbox PDF' | 'Storyboard PDF' | 'Brand Guide PDF' | 'IMG' | 'PDF';
  uploadDate: string;
  status: 'Onaylandı' | 'Bekliyor' | 'Revize';
}

export interface Campaign {
  id: string;
  clientName: string;
  campaignName: string;
  status: 'Aktif' | 'Planlandı' | 'Onay Bekliyor' | 'Tamamlandı';
  startDate: string;
  endDate: string;
  daysLeft?: number;
  budget: string;
  spacesList: string[];
  successRate: number;
  creativesCount: number;
  aiScore: number;
  logo: string;
  logoUrl?: string;
  proposalId: string;
  contractId: string;
  reservationId: string;
  mediaAgency: string;
  creativeAgency: string;
  creativeFiles: CreativeFile[];
  aiAnalysisNotes: string[];
  impressions: string;
  reach: string;
  frequency: number;
  airtimeHours: number;
  bestSpace: string;
  riskySpace: string;
  // Global Relations
  companyId?: string;
  spaceIds?: string[];
  isDemo?: boolean;
  source?: string;
  seedVersion?: string;
}

export const campaigns: Campaign[] = [];
export const campaignsList = campaigns; // alias
