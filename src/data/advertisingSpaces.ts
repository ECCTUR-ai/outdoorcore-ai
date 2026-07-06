export interface AdvertisingSpace {
  id: string;
  code: string;
  name: string;
  location: string;
  type: string;
  size: string;
  traffic: number;
  status: 'dolu' | 'bos' | 'teklif' | 'bakim' | 'yakinda';
  client: string;
  companyId?: string;
  startDate?: string;
  endDate?: string;
  price: string;
  visibility: string;
  resolution: string;
  pitch: string;
  workingHours: string;
  audio: string;
  power: string;
  fileFormat: string;
  maxFileSize: string;
  updateInterval: string;
  agency?: string;
  daysLeft?: number;
  impressions: string;
  viewTime: string;
  reach: string;
  frequency: number;
  image: string;
  terminal?: string;
  floor?: string;
  notes?: string;
  deleted_at?: string;
  deleted_by?: string;
}

export const advertisingSpaces: AdvertisingSpace[] = [
  {
    id: 'SPC-0001',
    code: 'SG-001',
    name: 'Giriş LED Ekran',
    location: 'İç Hatlar - Giriş',
    type: 'LED',
    size: '8.00 x 3.00 m',
    traffic: 28000,
    status: 'dolu',
    client: 'Samsung Electronics',
    companyId: 'CMP-0001',
    agency: 'Mindshare',
    startDate: '01 Mar 2025',
    endDate: '31 May 2025',
    daysLeft: 22,
    price: '₺2.450.000',
    visibility: 'Çok Yüksek',
    resolution: '3840 x 1440 px',
    pitch: 'P3.91',
    workingHours: '23:00',
    audio: 'Yok',
    power: '2.8 kW',
    fileFormat: 'MP4, AVI, JPG',
    maxFileSize: '2 GB',
    updateInterval: '15 sn',
    impressions: '840.000',
    viewTime: '3.2 sn',
    reach: '620.000',
    frequency: 1.35,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=60'
  },
  {
    id: 'SPC-0021',
    code: 'SG-002',
    name: 'Check-in Önü LED',
    location: 'İç Hatlar - Check-in',
    type: 'LED',
    size: '6.40 x 2.40 m',
    traffic: 21500,
    status: 'bos',
    client: '-',
    price: '₺1.850.000',
    visibility: 'Yüksek',
    resolution: '2880 x 1080 px',
    pitch: 'P2.5',
    workingHours: '24:00',
    audio: 'Yok',
    power: '2.1 kW',
    fileFormat: 'MP4, PNG',
    maxFileSize: '1.5 GB',
    updateInterval: '10 sn',
    impressions: '650.000',
    viewTime: '2.8 sn',
    reach: '480.000',
    frequency: 1.25,
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=60'
  },
  {
    id: 'SPC-0003',
    code: 'SG-003',
    name: 'Pasaport Kontrol Üstü',
    location: 'Dış Hatlar - Güvenlik',
    type: 'LED',
    size: '7.20 x 2.88 m',
    traffic: 19800,
    status: 'dolu',
    client: 'Turkcell',
    companyId: 'CMP-0002',
    agency: 'Starcom',
    startDate: '01 Oca 2025',
    endDate: '30 Haz 2025',
    daysLeft: 54,
    price: '₺1.950.000',
    visibility: 'Çok Yüksek',
    resolution: '3456 x 1382 px',
    pitch: 'P3.0',
    workingHours: '24:00',
    audio: 'Yok',
    power: '2.5 kW',
    fileFormat: 'MP4, JPG',
    maxFileSize: '2 GB',
    updateInterval: '20 sn',
    impressions: '720.000',
    viewTime: '3.5 sn',
    reach: '540.000',
    frequency: 1.45,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=60'
  },
  {
    id: 'SPC-0004',
    code: 'SG-004',
    name: 'Duty Free Yanı Lightbox',
    location: 'Dış Hatlar - Duty Free',
    type: 'Lightbox',
    size: '2.00 x 3.00 m',
    traffic: 15000,
    status: 'teklif',
    client: 'LC Waikiki',
    companyId: 'CMP-0004',
    agency: 'OMD',
    price: '₺1.250.000',
    visibility: 'Orta-Yüksek',
    resolution: 'Static Print',
    pitch: 'Yok',
    workingHours: '24:00',
    audio: 'Yok',
    power: '0.4 kW',
    fileFormat: 'PDF (Baskı Hazır)',
    maxFileSize: '500 MB',
    updateInterval: 'Ayda bir',
    impressions: '420.000',
    viewTime: '2.1 sn',
    reach: '310.000',
    frequency: 1.15,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=60'
  },
  {
    id: 'SPC-0045',
    code: 'SG-005',
    name: 'Yürüyen Bant Yanı',
    location: 'İç Hatlar - Bagaj',
    type: 'LED',
    size: '5.12 x 1.92 m',
    traffic: 17300,
    status: 'dolu',
    client: 'Mercedes-Benz',
    companyId: 'CMP-0005',
    agency: 'Wavemaker',
    startDate: '10 Nis 2025',
    endDate: '10 Tem 2025',
    daysLeft: 64,
    price: '₺1.600.000',
    visibility: 'Yüksek',
    resolution: '2048 x 768 px',
    pitch: 'P3.91',
    workingHours: '20:00',
    audio: 'Var (Opsiyonel)',
    power: '1.8 kW',
    fileFormat: 'MP4, AVI',
    maxFileSize: '1 GB',
    updateInterval: '15 sn',
    impressions: '580.000',
    viewTime: '2.9 sn',
    reach: '430.000',
    frequency: 1.28,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=600&auto=format&fit=crop&q=60'
  },
  {
    id: 'SPC-0006',
    code: 'SG-006',
    name: 'Bagaj Alım Salonu LED',
    location: 'İç Hatlar - Bagaj',
    type: 'LED',
    size: '9.60 x 3.20 m',
    traffic: 24600,
    status: 'bakim',
    client: '-',
    price: '₺1.800.000',
    visibility: 'Yüksek',
    resolution: '4096 x 1365 px',
    pitch: 'P4.0',
    workingHours: '23:00',
    audio: 'Yok',
    power: '3.4 kW',
    fileFormat: 'MP4, JPG',
    maxFileSize: '2.5 GB',
    updateInterval: '15 sn',
    impressions: '790.000',
    viewTime: '3.1 sn',
    reach: '580.000',
    frequency: 1.32,
    image: 'https://images.unsplash.com/photo-1490122417551-6ee9691429d0?w=600&auto=format&fit=crop&q=60'
  }
];
