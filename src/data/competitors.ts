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

export const competitorsList: Competitor[] = [
  {
    id: 'CMP-C001',
    name: 'Stroer Kentvizyon',
    logo: 'SK',
    website: 'www.stroer.com.tr',
    estimatedOccupancy: 78,
    averagePrice: '₺42.000',
    ledCount: 45,
    billboardCount: 320,
    lightboxCount: 140,
    activeCampaignsCount: 22,
    strengths: ['Geniş billboard ağı', 'Uluslararası bağlantılar', 'Köklü marka bilinirliği'],
    weaknesses: ['Yüksek fiyatlandırma', 'LED ekranlarda eski teknolojiler', 'Bürokratik operasyonlar'],
    regions: ['İstanbul', 'Ankara', 'İzmir', 'Antalya']
  },
  {
    id: 'CMP-C002',
    name: 'Açıkhava Reklamcılık',
    logo: 'AR',
    website: 'www.acikhavareklam.com',
    estimatedOccupancy: 65,
    averagePrice: '₺28.000',
    ledCount: 18,
    billboardCount: 190,
    lightboxCount: 80,
    activeCampaignsCount: 14,
    strengths: ['Agresif fiyat indirimleri', 'Esnek kiralama paketleri', 'Hızlı kurulum'],
    weaknesses: ['Terminal alanlarında yetersizlik', 'Düşük ciro kalitesi', 'AI optimizasyonu yok'],
    regions: ['Ankara', 'Bursa', 'Adana', 'Gaziantep']
  },
  {
    id: 'CMP-C003',
    name: 'Wall Decaux Türkiye',
    logo: 'WD',
    website: 'www.walldecaux.com.tr',
    estimatedOccupancy: 82,
    averagePrice: '₺60.000',
    ledCount: 30,
    billboardCount: 110,
    lightboxCount: 220,
    activeCampaignsCount: 19,
    strengths: ['Premium şehir mobilyaları', 'Dizayn ödüllü CLP üniteleri', 'Yüksek doluluk'],
    weaknesses: ['Çok dar coğrafi kapsam', 'Yerel markalara kapalı fiyatlar', 'Sözleşme esnekliği yok'],
    regions: ['İstanbul', 'İzmir']
  },
  {
    id: 'CMP-C004',
    name: 'Mepa Medya',
    logo: 'MM',
    website: 'www.mepamedya.com',
    estimatedOccupancy: 71,
    averagePrice: '₺32.000',
    ledCount: 25,
    billboardCount: 240,
    lightboxCount: 60,
    activeCampaignsCount: 11,
    strengths: ['Anadolu genelinde güçlü lokasyonlar', 'Karayolu CLP tekeli'],
    weaknesses: ['Yetersiz teknik izleme altyapısı', 'Kreatif optimizasyon eksikliği'],
    regions: ['Antalya', 'Muğla', 'Bursa', 'Denizli']
  }
];

export const competitorKpis = {
  totalCompetitors: 14,
  competitorSpaces: 1420,
  competitorCampaigns: 186,
  averageOccupancy: "%74.2",
  averagePriceIndex: "₺40.500",
  marketShareOutdoorCore: "%36.8"
};
