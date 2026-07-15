export interface DigitalScreen {
  screenId: string;
  screenCode: string;
  name: string;
  location: string;
  terminal: string;
  floor: string;
  totalM2: number;
  resolution: string;
  loopDurationSeconds: number;
  status: 'active' | 'maintenance' | 'inactive';
  monthlyBasePrice: number;
  dailyTraffic: number;
  visibility: 'Çok Yüksek' | 'Yüksek' | 'Orta';
  notes?: string;
  isDemo?: boolean;
  source?: string;
  seedVersion?: string;
  id?: string;
  advertisingSpaceId?: string;
  inventoryCode?: string;
}

export interface PlaylistSlot {
  slotId: string;
  screenId: string;
  companyId?: string;
  companyName?: string;
  campaignId?: string;
  reservationId?: string;
  startDate: string; // ISO date YYYY-MM-DD
  endDate: string;   // ISO date YYYY-MM-DD
  durationSeconds: number;
  sharePercent: number;
  estimatedPlaysPerDay: number;
  price: number;
  status: 'active' | 'pending' | 'cancelled';
  creativeFileUrl?: string;
  order?: number;
  isDemo?: boolean;
  source?: string;
  seedVersion?: string;
}

export interface DigitalScreenAvailability {
  screenId: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  loopDurationSeconds: number;
  usedSeconds: number;
  availableSeconds: number;
  occupancyPercent: number;
  slots: PlaylistSlot[];
}
