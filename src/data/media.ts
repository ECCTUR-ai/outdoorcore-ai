export interface MediaAsset {
  id: string;
  name: string;
  type: 'video' | 'image' | 'pdf' | 'document';
  size: string;
  resolution: string;
  uploadedBy: string;
  uploadedDate: string;
  version: 'v1' | 'v2' | 'v3';
  aiTags: string[];
  companyId: string;
  campaignId: string;
  spaceIds: string[];
  status: 'Approved' | 'Pending' | 'Revision';
  versionsList: Array<{ version: string; date: string; file: string; uploader: string }>;
}

export const mediaAssets: MediaAsset[] = [
  {
    id: 'MED-0001',
    name: 'thy_global_miles_banner.mp4',
    type: 'video',
    size: '18.5 MB',
    resolution: '1920x1080',
    uploadedBy: 'Ahmet Yılmaz',
    uploadedDate: '28.04.2025',
    version: 'v3',
    aiTags: ['Ulaşım', 'Mavi', 'Gökyüzü', 'Modern', 'Lansman'],
    companyId: 'CMP-0003',
    campaignId: 'CAM-0003',
    spaceIds: ['SPC-0001', 'SPC-0021'],
    status: 'Approved',
    versionsList: [
      { version: 'v3', date: '28.04.2025', file: 'thy_global_miles_banner_final.mp4', uploader: 'Ahmet Yılmaz' },
      { version: 'v2', date: '25.04.2025', file: 'thy_global_miles_banner_v2.mp4', uploader: 'Ahmet Yılmaz' },
      { version: 'v1', date: '20.04.2025', file: 'thy_global_miles_banner_draft.mp4', uploader: 'Ahmet Yılmaz' }
    ]
  },
  {
    id: 'MED-0002',
    name: 'samsung_galaxy_ai_intro.jpg',
    type: 'image',
    size: '4.2 MB',
    resolution: '3840x2160',
    uploadedBy: 'Caner Özdemir',
    uploadedDate: '01.05.2025',
    version: 'v2',
    aiTags: ['Teknoloji', 'AI', 'Samsung', 'Lansman', 'Karanlık'],
    companyId: 'CMP-0001',
    campaignId: 'CAM-0001',
    spaceIds: ['SPC-0001', 'SPC-0003', 'SPC-0045'],
    status: 'Approved',
    versionsList: [
      { version: 'v2', date: '01.05.2025', file: 'samsung_galaxy_ai_intro.jpg', uploader: 'Caner Özdemir' },
      { version: 'v1', date: '29.04.2025', file: 'samsung_galaxy_ai_intro_old.jpg', uploader: 'Caner Özdemir' }
    ]
  },
  {
    id: 'MED-0003',
    name: 'turkcell_yaz_festivali.png',
    type: 'image',
    size: '2.8 MB',
    resolution: '1200x800',
    uploadedBy: 'Ayşe Kaya',
    uploadedDate: '04.05.2025',
    version: 'v1',
    aiTags: ['Gençlik', 'Sarı', 'Konser', 'Yaz', 'Kampanya'],
    companyId: 'CMP-0002',
    campaignId: 'CAM-0002',
    spaceIds: ['SPC-0003', 'SPC-0017'],
    status: 'Pending',
    versionsList: [
      { version: 'v1', date: '04.05.2025', file: 'turkcell_yaz_festivali.png', uploader: 'Ayşe Kaya' }
    ]
  },
  {
    id: 'MED-0004',
    name: 'mercedes_eqs_lansman.mp4',
    type: 'video',
    size: '24.1 MB',
    resolution: '1920x1080',
    uploadedBy: 'Bülent Ecevit',
    uploadedDate: '02.05.2025',
    version: 'v2',
    aiTags: ['Premium', 'Otomobil', 'Elektrikli', 'Siyah', 'Lüks'],
    companyId: 'CMP-0005',
    campaignId: 'CAM-0001', // samsung placeholder cross linked
    spaceIds: ['SPC-0021', 'SPC-0045'],
    status: 'Revision',
    versionsList: [
      { version: 'v2', date: '02.05.2025', file: 'mercedes_eqs_lansman_v2.mp4', uploader: 'Bülent Ecevit' },
      { version: 'v1', date: '28.04.2025', file: 'mercedes_eqs_lansman_draft.mp4', uploader: 'Bülent Ecevit' }
    ]
  },
  {
    id: 'MED-0005',
    name: 'pegasus_yaz_rotalari.pdf',
    type: 'pdf',
    size: '8.4 MB',
    resolution: 'A4 Multi-page',
    uploadedBy: 'Selin Yurt',
    uploadedDate: '05.05.2025',
    version: 'v1',
    aiTags: ['Seyahat', 'Pegasus', 'Uçuş', 'Yaz', 'Broşür'],
    companyId: 'CMP-0006',
    campaignId: 'CAM-0001',
    spaceIds: ['SPC-0017'],
    status: 'Approved',
    versionsList: [
      { version: 'v1', date: '05.05.2025', file: 'pegasus_yaz_rotalari.pdf', uploader: 'Selin Yurt' }
    ]
  },
  {
    id: 'MED-0006',
    name: 'lcwaikiki_okul_donusu.png',
    type: 'image',
    size: '3.5 MB',
    resolution: '1080x1920',
    uploadedBy: 'Mert Aksoy',
    uploadedDate: '06.05.2025',
    version: 'v1',
    aiTags: ['Giyim', 'Çocuk', 'Mavi', 'Okul', 'Perakende'],
    companyId: 'CMP-0004',
    campaignId: 'CAM-0002',
    spaceIds: ['SPC-0021'],
    status: 'Pending',
    versionsList: [
      { version: 'v1', date: '06.05.2025', file: 'lcwaikiki_okul_donusu.png', uploader: 'Mert Aksoy' }
    ]
  }
];
