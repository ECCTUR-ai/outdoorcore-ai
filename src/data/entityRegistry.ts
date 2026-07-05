export interface RegistryEntity {
  id: string;
  type: string;
  label: string;
  route: string;
  keywords: string[];
}

export const entityRegistry: RegistryEntity[] = [
  // 1. Companies
  { id: 'CMP-0001', type: 'company', label: 'Samsung Electronics', route: '/firmalar-markalar?companyId=CMP-0001', keywords: ['samsung', 'electronics', 'elektronik', 'vip'] },
  { id: 'CMP-0002', type: 'company', label: 'Turkcell', route: '/firmalar-markalar?companyId=CMP-0002', keywords: ['turkcell', 'telekom', 'telekomünikasyon', 'gold'] },
  { id: 'CMP-0003', type: 'company', label: 'Türk Hava Yolları', route: '/firmalar-markalar?companyId=CMP-0003', keywords: ['thy', 'türk hava yolları', 'turkish airlines', 'ulaşım', 'vip'] },
  { id: 'CMP-0004', type: 'company', label: 'LC Waikiki', route: '/firmalar-markalar?companyId=CMP-0004', keywords: ['lcw', 'lc waikiki', 'perakende', 'tekstil', 'silver'] },
  { id: 'CMP-0005', type: 'company', label: 'Mercedes-Benz Türkiye', route: '/firmalar-markalar?companyId=CMP-0005', keywords: ['mercedes', 'benz', 'otomotiv', 'gold'] },
  { id: 'CMP-0006', type: 'company', label: 'Pegasus Airlines', route: '/firmalar-markalar?companyId=CMP-0006', keywords: ['pegasus', 'flypgs', 'ulaşım', 'lead'] },

  // 2. Advertising Spaces
  { id: 'SPC-0001', type: 'space', label: 'SG-001 Giriş LED Ekran', route: '/reklam-alanlari?spaceId=SPC-0001', keywords: ['sg-001', 'giriş', 'led', 'ekran'] },
  { id: 'SPC-0021', type: 'space', label: 'SG-021 Check-in Önü LED', route: '/reklam-alanlari?spaceId=SPC-0021', keywords: ['sg-021', 'check-in', 'led', 'ekran'] },
  { id: 'SPC-0045', type: 'space', label: 'SG-045 Duty Free Yanı LED', route: '/reklam-alanlari?spaceId=SPC-0045', keywords: ['sg-045', 'duty free', 'led', 'ekran'] },
  { id: 'SPC-0003', type: 'space', label: 'SG-003 Pasaport Geçiş LED', route: '/reklam-alanlari?spaceId=SPC-0003', keywords: ['sg-003', 'pasaport', 'led', 'ekran'] },
  { id: 'SPC-0017', type: 'space', label: 'SG-017 İç Hatlar Giden LED', route: '/reklam-alanlari?spaceId=SPC-0017', keywords: ['sg-017', 'iç hatlar', 'led', 'ekran'] },

  // 3. Offers
  { id: 'OFF-0001', type: 'offer', label: 'Samsung Galaxy AI Teklifi', route: '/teklifler?offerId=OFF-0001', keywords: ['off-0001', 'samsung', 'galaxy', 'ai', 'teklif'] },
  { id: 'OFF-0002', type: 'offer', label: 'THY Global Miles Teklifi', route: '/teklifler?offerId=OFF-0002', keywords: ['off-0002', 'thy', 'miles', 'teklif'] },
  { id: 'OFF-0003', type: 'offer', label: 'Turkcell Yaz Kampanyası Teklifi', route: '/teklifler?offerId=OFF-0003', keywords: ['off-0003', 'turkcell', 'yaz', 'teklif'] },

  // 4. Contracts
  { id: 'CON-0001', type: 'contract', label: 'Samsung Galaxy AI Sözleşmesi (OC-2025-00124)', route: '/sozlesmeler?contractId=CON-0001', keywords: ['con-0001', 'samsung', 'galaxy', 'sözleşme'] },
  { id: 'CON-0002', type: 'contract', label: 'Turkcell Yaz Sözleşmesi (OC-2025-00130)', route: '/sozlesmeler?contractId=CON-0002', keywords: ['con-0002', 'turkcell', 'sözleşme', 'riskli'] },

  // 5. Campaigns
  { id: 'CAM-0001', type: 'campaign', label: 'Samsung Galaxy AI Lansmanı', route: '/kampanyalar?campaignId=CAM-0001', keywords: ['cam-0001', 'samsung', 'galaxy', 'kampanya', 'lansman'] },
  { id: 'CAM-0002', type: 'campaign', label: 'Turkcell Yaz İletişimi', route: '/kampanyalar?campaignId=CAM-0002', keywords: ['cam-0002', 'turkcell', 'yaz', 'kampanya'] }
];
