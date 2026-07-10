import { RegistryEntity } from '@/data/entityRegistry';
import { advertisingSpaces as defaultSpaces } from '@/data/advertisingSpaces';
import { contracts as defaultContracts } from '@/data/contracts';
import { offers as defaultOffers } from '@/data/offers';
import { companies as defaultCompanies } from '@/data/companies';

export interface CopilotResponse {
  answerText: string;
  relatedEntities: RegistryEntity[];
  suggestedActions: { label: string; actionType: string; route?: string; searchParam?: string }[];
  confidenceScore: number;
  sourceModules: string[];
}

// Local storage lookup utility
const getMockData = <T>(key: string, fallback: T[]): T[] => {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(`outdoorcore_mock_${key}`);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error(`Error loading mock ${key} in Copilot:`, e);
  }
  return fallback;
};

export function runCopilotQuery(query: string): CopilotResponse {
  const normalized = query.toLowerCase().trim();

  // Load latest state dynamically
  const spaces = getMockData('advertisingSpaces', defaultSpaces);
  const allContracts = getMockData('contracts', defaultContracts);
  const allOffers = getMockData('offers', defaultOffers);
  const allCompanies = getMockData('companies', defaultCompanies);

  const getEntities = (ids: string[]): RegistryEntity[] => {
    return ids.map(id => {
      if (id.startsWith('SPC-') || id.startsWith('SG-')) {
        const s = spaces.find(x => x.id === id || x.code === id);
        return {
          id: s?.id || id,
          type: 'space' as const,
          label: s ? `${s.code} - ${s.name}` : id,
          route: `/reklam-alanlari?spaceId=${s?.id || id}`,
          keywords: []
        };
      }
      if (id.startsWith('CON-')) {
        const c = allContracts.find(x => x.id === id || x.contractNo === id);
        return {
          id: c?.id || id,
          type: 'contract' as const,
          label: c ? `${c.contractNo} - ${c.clientName}` : id,
          route: `/sozlesmeler?contractId=${c?.id || id}`,
          keywords: []
        };
      }
      if (id.startsWith('OFF-') || id.startsWith('TEK-')) {
        const o = allOffers.find(x => x.id === id);
        return {
          id: o?.id || id,
          type: 'offer' as const,
          label: o ? `${o.id} - ${o.clientName}` : id,
          route: `/teklifler?offerId=${o?.id || id}`,
          keywords: []
        };
      }
      // Default company fallback
      const comp = allCompanies.find(x => x.id === id || x.name.toLowerCase().includes(id.toLowerCase()));
      return {
        id: comp?.id || id,
        type: 'company' as const,
        label: comp?.name || id,
        route: `/firmalar-markalar?companyId=${comp?.id || id}`,
        keywords: []
      };
    });
  };

  // 1. "Boş premium alanları göster"
  if (normalized.includes('boş premium') || normalized.includes('boş premium alan') || (normalized.includes('boş') && normalized.includes('premium'))) {
    // Premium spaces: priceNumeric >= 50000 and status === 'bos'
    const premiumFree = spaces.filter(s => s.status === 'bos' && (parseFloat(s.price.replace(/[^\d]/g, '')) || 0) >= 50000);
    const topPremium = premiumFree.slice(0, 4);

    if (topPremium.length === 0) {
      return {
        answerText: `Şu anda sistemde kiralık durumda **boş premium reklam alanı bulunmuyor**. Mevcut tüm premium alanlar kiralanmış durumdadır.`,
        relatedEntities: [],
        suggestedActions: [
          { label: 'Envantere Git', actionType: 'space', route: 'reklam-alanlari' }
        ],
        confidenceScore: 98,
        sourceModules: ['Reklam Alanları']
      };
    }

    let answer = `Şu anda kiralama için müsait durumda olan **premium boş reklam alanları** tespit edildi:\n\n`;
    topPremium.forEach(s => {
      answer += `*   **${s.code}** | ${s.name} | ${s.location} — **${s.price} / Ay** (Günlük Trafik: ${s.traffic.toLocaleString('tr-TR')} yolcu)\n`;
    });
    answer += `\nBu alanlar yüksek görünürlük skoruna sahiptir ve yeni kampanya teklifleri için uygundur.`;

    return {
      answerText: answer,
      relatedEntities: getEntities(topPremium.map(s => s.id)),
      suggestedActions: [
        { label: 'Yeni Teklif Oluştur', actionType: 'offer', route: 'teklifler' },
        { label: 'Envanter Listesi', actionType: 'inventory', route: 'inventory' }
      ],
      confidenceScore: 99,
      sourceModules: ['Reklam Alanları', 'Teklifler']
    };
  }

  // 2. "Bu ay bitecek sözleşmeler"
  if (normalized.includes('bitecek sözleşme') || normalized.includes('bitecek') || normalized.includes('süresi dolacak')) {
    // filter active contracts ending soon (endDate containing '.06.2026' or daysLeft < 45)
    const expiring = allContracts.filter(c => 
      c.status !== 'cancelled' && 
      c.status !== 'İptal' &&
      (c.endDate.includes('.06.2026') || (c.daysLeft !== undefined && c.daysLeft <= 45))
    );

    if (expiring.length === 0) {
      return {
        answerText: `Önümüzdeki 30 gün içerisinde **süresi dolacak aktif sözleşme kaydı bulunmuyor**.`,
        relatedEntities: [],
        suggestedActions: [
          { label: 'Tüm Sözleşmeler', actionType: 'contract', route: 'sozlesmeler' }
        ],
        confidenceScore: 96,
        sourceModules: ['Sözleşmeler']
      };
    }

    let answer = `Önümüzdeki günlerde **süresi dolacak/yenileme bekleyen** reklam sözleşmeleri listelenmiştir:\n\n`;
    expiring.forEach(c => {
      answer += `*   **${c.contractNo}** | ${c.clientName} — ${c.campaignName} — Bitiş: **${c.endDate}** (${c.daysLeft || 0} Gün Kalan)\n`;
    });
    answer += `\nBu VIP cari hesaplar için hızlı yenileme teklifleri hazırlanması tavsiye edilmektedir.`;

    return {
      answerText: answer,
      relatedEntities: getEntities(expiring.map(c => c.id)),
      suggestedActions: [
        { label: 'Sözleşmeleri İncele', actionType: 'contract', route: 'sozlesmeler' },
        { label: 'Yenileme Teklifi Hazırla', actionType: 'offer', route: 'teklifler' }
      ],
      confidenceScore: 98,
      sourceModules: ['Sözleşmeler', 'Müşteriler']
    };
  }

  // 3. "En yüksek ciro üreten alanlar"
  if (normalized.includes('yüksek ciro') || normalized.includes('ciro üreten') || normalized.includes('en yüksek gelir')) {
    // Sort spaces by priceNumeric descending
    const occupiedSpaces = spaces.filter(s => s.status === 'dolu');
    const sorted = [...occupiedSpaces].sort((a, b) => {
      const aVal = parseFloat(a.price.replace(/[^\d]/g, '')) || 0;
      const bVal = parseFloat(b.price.replace(/[^\d]/g, '')) || 0;
      return bVal - aVal;
    });

    const topCiro = sorted.slice(0, 4);

    if (topCiro.length === 0) {
      return {
        answerText: `Portföyünüzde şu anda aktif ciro üreten dolu reklam alanı bulunamadı.`,
        relatedEntities: [],
        suggestedActions: [
          { label: 'Envanter Listesi', actionType: 'space', route: 'reklam-alanlari' }
        ],
        confidenceScore: 95,
        sourceModules: ['Reklam Alanları', 'Finans']
      };
    }

    let answer = `Sistemdeki **en yüksek aylık ciro getiren aktif reklam alanları**:\n\n`;
    topCiro.forEach((s, idx) => {
      answer += `${idx + 1}.  **${s.code}** | ${s.name} — **${s.price} / Ay** (Kiralayan: ${s.client})\n`;
    });
    answer += `\nBu premium lokasyonlar envanter verimliliğinizin temel direğidir.`;

    return {
      answerText: answer,
      relatedEntities: getEntities(topCiro.map(s => s.id)),
      suggestedActions: [
        { label: 'Ciro Analiz Raporu', actionType: 'report', route: 'raporlar' },
        { label: 'Finansal Tahsilatlar', actionType: 'finance', route: 'finans' }
      ],
      confidenceScore: 99,
      sourceModules: ['Reklam Alanları', 'Finans', 'Raporlar']
    };
  }

  // 4. "Doluluk oranı düşük alanlar"
  if (normalized.includes('doluluk oranı düşük') || normalized.includes('doluluk düşük') || normalized.includes('düşük doluluk')) {
    const totalLED = spaces.filter(s => s.type === 'LED').length;
    const activeLED = spaces.filter(s => s.type === 'LED' && s.status === 'dolu').length;
    const rateLED = totalLED > 0 ? Math.round((activeLED / totalLED) * 100) : 0;

    const totalLightbox = spaces.filter(s => s.type === 'Lightbox').length;
    const activeLightbox = spaces.filter(s => s.type === 'Lightbox' && s.status === 'dolu').length;
    const rateLightbox = totalLightbox > 0 ? Math.round((activeLightbox / totalLightbox) * 100) : 0;

    let answer = `**Envanter Gruplarına Göre Doluluk Kıyaslaması**:\n\n`;
    answer += `*   **LED Ekran Grubu**: %${rateLED} Doluluk (${activeLED}/${totalLED})\n`;
    answer += `*   **Lightbox Grubu**: %${rateLightbox} Doluluk (${activeLightbox}/${totalLightbox})\n\n`;
    
    if (rateLightbox < rateLED) {
      answer += `**Lightbox grubu doluluk oranı daha düşük seyrediyor.** Satış ekiplerinin bu gruba özel çapraz satış paketleri hazırlaması önerilir.`;
    } else {
      answer += `**LED Ekran doluluk oranı daha düşük seviyede.** Dijital envanter satışı için tekliflerin önceliklendirilmesi önerilir.`;
    }

    return {
      answerText: answer,
      relatedEntities: [],
      suggestedActions: [
        { label: 'Envanter Analitiği', actionType: 'report', route: 'reklam-alanlari' },
        { label: 'Boş Alan Satışı', actionType: 'space', route: 'reklam-alanlari' }
      ],
      confidenceScore: 97,
      sourceModules: ['Reklam Alanları', 'Raporlar']
    };
  }

  // 5. "Riskli sözleşmeleri göster"
  if (normalized.includes('riskli sözleşme') || normalized.includes('riskli kontrat') || normalized.includes('riskli')) {
    const risky = allContracts.filter(c => 
      (c.aiRiskScore && c.aiRiskScore >= 7) && 
      c.status !== 'cancelled' && 
      c.status !== 'İptal'
    );

    if (risky.length === 0) {
      return {
        answerText: `Şu anda sistemde **kritik düzeyde risk puanı (>=7) bulunan aktif bir sözleşme tespit edilmedi**.`,
        relatedEntities: [],
        suggestedActions: [
          { label: 'Sözleşme Listesi', actionType: 'contract', route: 'sozlesmeler' }
        ],
        confidenceScore: 96,
        sourceModules: ['Sözleşmeler']
      };
    }

    let answer = `Yapay zeka asistanı tarafından **kritik riskli** olarak belirlenen reklam sözleşmeleri:\n\n`;
    risky.forEach(c => {
      answer += `*   **${c.contractNo}** | ${c.clientName} — Risk Skoru: **${c.aiRiskScore}/10** (${c.notes[0] || 'Vadesi gecikmiş ödeme planı'})\n`;
    });
    answer += `\nCari mutabakat ve risk azaltma toplantılarının planlanması önerilmektedir.`;

    return {
      answerText: answer,
      relatedEntities: getEntities(risky.map(c => c.id)),
      suggestedActions: [
        { label: 'Finansal Cari Durum', actionType: 'finance', route: 'finans' },
        { label: 'Sözleşme Detayları', actionType: 'contract', route: 'sozlesmeler' }
      ],
      confidenceScore: 98,
      sourceModules: ['Sözleşmeler', 'Finans']
    };
  }

  // 6. "Teklif bekleyen premium alanlar"
  if (normalized.includes('teklif bekleyen') || normalized.includes('teklif aşamasındaki premium') || (normalized.includes('teklif') && normalized.includes('premium'))) {
    const spacesInOffer = spaces.filter(s => s.status === 'teklif' && (parseFloat(s.price.replace(/[^\d]/g, '')) || 0) >= 40000);

    if (spacesInOffer.length === 0) {
      return {
        answerText: `Şu anda teklif aşamasında (opsiyonda) bekleyen **premium bir reklam alanı bulunmuyor**.`,
        relatedEntities: [],
        suggestedActions: [
          { label: 'Teklif Yönetimi', actionType: 'offer', route: 'teklifler' }
        ],
        confidenceScore: 95,
        sourceModules: ['Reklam Alanları', 'Teklifler']
      };
    }

    let answer = `Şu anda aktif teklif/pazarlık aşamasında olan **premium reklam alanları** listelenmiştir:\n\n`;
    spacesInOffer.forEach(s => {
      answer += `*   **${s.code}** | ${s.name} | ${s.location} — **${s.price} / Ay** (Müşteri: ${s.client || 'Pazarlıkta'})\n`;
    });
    answer += `\nSatış yöneticileri ile iletişime geçilerek teklif onay süreçlerinin hızlandırılması önerilir.`;

    return {
      answerText: answer,
      relatedEntities: getEntities(spacesInOffer.map(s => s.id)),
      suggestedActions: [
        { label: 'Teklif Listesini Aç', actionType: 'offer', route: 'teklifler' }
      ],
      confidenceScore: 97,
      sourceModules: ['Reklam Alanları', 'Teklifler']
    };
  }

  // 7. "Hangi alanların fiyatını artırabiliriz?"
  if (normalized.includes('fiyatını artırabilir') || normalized.includes('fiyat artışı') || normalized.includes('fiyat artırabiliriz')) {
    // Sort occupied spaces by traffic descending
    const highlyPopulated = spaces.filter(s => 
      s.status === 'dolu' && 
      s.traffic >= 60000 && 
      (parseFloat(s.price.replace(/[^\d]/g, '')) || 0) <= 90000
    );

    if (highlyPopulated.length === 0) {
      return {
        answerText: `Mevcut envanterinizde ciro/trafik oranı dengesiz olan (fiyatı çok düşük kalan) belirgin bir alan bulunmamaktadır. Fiyatlandırma politikanız dengelidir.`,
        relatedEntities: [],
        suggestedActions: [
          { label: 'Envanter Raporu', actionType: 'report', route: 'raporlar' }
        ],
        confidenceScore: 92,
        sourceModules: ['Reklam Alanları']
      };
    }

    let answer = `Yüksek yolcu trafiğine rağmen **fiyatlandırması düşük kalan (yenileme döneminde fiyat artırılması gereken)** alanlar:\n\n`;
    highlyPopulated.slice(0, 3).forEach(s => {
      answer += `*   **${s.code}** | ${s.name} — Trafik: **${s.traffic.toLocaleString('tr-TR')}/gün** — Mevcut: **${s.price}** (Tavsiye Edilen Artış: **+%15-20**)\n`;
    });
    answer += `\nBu alanlar yüksek talep görmektedir ve fiyat güncellemesi gelir artışına doğrudan katkı sağlayacaktır.`;

    return {
      answerText: answer,
      relatedEntities: getEntities(highlyPopulated.map(s => s.id)),
      suggestedActions: [
        { label: 'Sözleşmeleri Gör', actionType: 'contract', route: 'sozlesmeler' }
      ],
      confidenceScore: 96,
      sourceModules: ['Reklam Alanları', 'Sözleşmeler']
    };
  }

  // 8. "En yoğun terminal hangisi?"
  if (normalized.includes('yoğun terminal') || normalized.includes('yolcu terminal') || normalized.includes('en yoğun terminal')) {
    const innerTraffic = spaces
      .filter(s => {
        const term = s.terminal || (s.location.includes('İç') ? 'İç Hatlar' : 'Dış Hatlar');
        return term.includes('İç');
      })
      .reduce((sum, s) => sum + s.traffic, 0);

    const outerTraffic = spaces
      .filter(s => {
        const term = s.terminal || (s.location.includes('İç') ? 'İç Hatlar' : 'Dış Hatlar');
        return term.includes('Dış');
      })
      .reduce((sum, s) => sum + s.traffic, 0);

    let answer = `İstanbul Havalimanı terminal grubu yolcu sirkülasyon analiz sonucu:\n\n`;
    answer += `*   **Dış Hatlar Terminali**: Günlük ortalama **${outerTraffic.toLocaleString('tr-TR')}** yolcu hareketi\n`;
    answer += `*   **İç Hatlar Terminali**: Günlük ortalama **${innerTraffic.toLocaleString('tr-TR')}** yolcu hareketi\n\n`;
    
    if (outerTraffic > innerTraffic) {
      answer += `**Dış Hatlar Terminali açık ara en yoğun terminal konumundadır.** Uluslararası markaların bütçelerinin bu bölgedeki premium LED ünitelerine yönlendirilmesi tavsiye edilir.`;
    } else {
      answer += `**İç Hatlar Terminali daha yoğun yolcu trafiğine sahiptir.** Lojistik, bankacılık ve perakende markaları için bu bölge önceliklendirilmelidir.`;
    }

    return {
      answerText: answer,
      relatedEntities: [],
      suggestedActions: [
        { label: 'Raporlar ve Analitik', actionType: 'report', route: 'raporlar' }
      ],
      confidenceScore: 98,
      sourceModules: ['Reklam Alanları', 'Raporlar']
    };
  }

  // Default Fallback
  return {
    answerText: `Merhaba, ben **OutdoorCore AI Pilot** asistanınız. 
    
Sorunuza göre veritabanımızda anlık bir eşleşme bulamadım. Müşteri demosu için lütfen aşağıdaki örnek enterprise komutlarını girin:

*   "Boş premium alanları göster"
*   "Bu ay bitecek sözleşmeler"
*   "En yüksek ciro üreten alanlar"
*   "Doluluk oranı düşük alanlar"
*   "Riskli sözleşmeleri göster"
*   "Teklif bekleyen premium alanlar"
*   "Hangi alanların fiyatını artırabiliriz?"
*   "En yoğun terminal hangisi?"`,
    relatedEntities: [],
    suggestedActions: [
      { label: 'Dashboard Paneli', actionType: 'dashboard', route: 'dashboard' },
      { label: 'Reklam Envanteri', actionType: 'space', route: 'reklam-alanlari' }
    ],
    confidenceScore: 80,
    sourceModules: ['Sistem']
  };
}
