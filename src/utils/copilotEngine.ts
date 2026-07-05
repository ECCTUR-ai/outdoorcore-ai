import { entityRegistry, RegistryEntity } from '@/data/entityRegistry';

export interface CopilotResponse {
  answerText: string;
  relatedEntities: RegistryEntity[];
  suggestedActions: { label: string; actionType: string; route?: string; searchParam?: string }[];
  confidenceScore: number;
  sourceModules: string[];
}

export function runCopilotQuery(query: string): CopilotResponse {
  const normalized = query.toLowerCase().trim();

  // Helper to find entities by IDs
  const getEntities = (ids: string[]): RegistryEntity[] => {
    return entityRegistry.filter(e => ids.includes(e.id));
  };

  // Rule 1: samsung + alan
  if (normalized.includes('samsung') && (normalized.includes('alan') || normalized.includes('pano') || normalized.includes('ekran'))) {
    return {
      answerText: `**Samsung Electronics** için uygun premium reklam alanları başarıyla tespit edildi:

*   **SG-001** | Giriş LED Ekran | İç Hatlar (Yüksek görünürlük)
*   **SG-021** | Check-in Önü LED (Yüksek bekleme süresi)
*   **SG-045** | Duty Free Yanı LED (Uluslararası yolcu odaklı)

Bu alanlar, Samsung'un geçmiş reklam kampanyaları ve bütçe hacmiyle **%96** oranında yüksek uyum göstermektedir.`,
      relatedEntities: getEntities(['CMP-0001', 'SPC-0001', 'SPC-0021', 'SPC-0045', 'CAM-0001']),
      suggestedActions: [
        { label: 'Teklif Oluştur', actionType: 'offer', route: 'teklifler', searchParam: 'companyId=CMP-0001' },
        { label: 'Rezervasyon Aç', actionType: 'reservation', route: 'rezervasyonlar', searchParam: 'companyId=CMP-0001' },
        { label: 'Firma Kartına Git', actionType: 'company', route: 'firmalar-markalar', searchParam: 'companyId=CMP-0001' }
      ],
      confidenceScore: 96,
      sourceModules: ['Firma', 'Reklam Alanı', 'Kampanya']
    };
  }

  // Rule 2: thy + sözleşme
  if (normalized.includes('thy') || normalized.includes('türk hava') || normalized.includes('havayolları')) {
    if (normalized.includes('sözleşme') || normalized.includes('kontrat') || normalized.includes('bit')) {
      return {
        answerText: `**Türk Hava Yolları (THY)** ile aktif olarak devam eden reklam sözleşmesi **18 gün** içerisinde sona erecektir.

*   Sözleşme Kodu: **CON-0003**
*   Toplam Değer: **₺120.000.000**
*   Yenileme İhtimali: **%87** (VIP CRM Analizi)

Müşteri memnuniyeti üst seviyededir. Sürenin dolmasından önce yeni dönem için teklif gönderilmesi ve sözleşme yenileme görevi oluşturulması önerilir.`,
        relatedEntities: getEntities(['CMP-0003', 'OFF-0002', 'CON-0001']), // Fallback to available items
        suggestedActions: [
          { label: 'Sözleşmeyi İncele', actionType: 'contract', route: 'sozlesmeler', searchParam: 'contractId=CON-0001' },
          { label: 'Görev Oluştur', actionType: 'task', route: 'bildirimler', searchParam: 'taskId=TSK-0001' }
        ],
        confidenceScore: 87,
        sourceModules: ['Firma', 'Sözleşme', 'Teklif']
      };
    }
  }

  // Rule 3: tahsilat + risk / gecikme / borç
  if (normalized.includes('tahsilat') || normalized.includes('risk') || normalized.includes('gecik') || normalized.includes('borç')) {
    return {
      answerText: `Bu ay **tahsilat riski yüksek** ve vadesi geçen borçları bulunan cari hesaplar listelenmiştir:

1.  **Mercedes-Benz Türkiye** — **₺7.900.000** bakiye — Risk Derecesi: **%84** (Gecikmeli Fatura)
2.  **Turkcell** — **₺30.000.000** bakiye — Risk Derecesi: **%61** (80 Gün Gecikme)
3.  **Pegasus Airlines** — **₺2.250.000** bakiye — Risk Derecesi: **%48** (Vadesi Yaklaşıyor)

Öncelikli olarak **Turkcell** finans ekipleri ile ihtarname öncesi acil mutabakat başlatılması önerilir.`,
      relatedEntities: getEntities(['CMP-0005', 'CMP-0002', 'CMP-0006', 'CON-0002']),
      suggestedActions: [
        { label: 'Finans Paneli', actionType: 'finance', route: 'finans', searchParam: 'companyId=CMP-0002' },
        { label: 'Hatırlatma Görevi', actionType: 'task', route: 'bildirimler', searchParam: 'taskId=TSK-0004' }
      ],
      confidenceScore: 92,
      sourceModules: ['Finans', 'Cari', 'Sözleşme']
    };
  }

  // Rule 4: bugün + ne yap / görev
  if (normalized.includes('bugün') || normalized.includes('yap') || normalized.includes('görev') || normalized.includes('task')) {
    return {
      answerText: `Bugün tamamlamanız gereken **kritik operasyonel görevler**:

*   **TSK-0001** | THY Sözleşme şartnamesini hukuk birimiyle paylaş. (Öncelik: Kritik)
*   **TSK-0004** | Turkcell geciken faturalar için mutabakat toplantısı yap. (Öncelik: Kritik)
*   **TSK-0002** | Galaxy AI lansmanı için LED reklam alanlarını doğrula. (Öncelik: Yüksek)

Toplam **3 adet** kritik/yüksek öncelikli görev bulunmaktadır. Diğer listelere gitmek için aksiyonları kullanabilirsiniz.`,
      relatedEntities: getEntities(['CMP-0003', 'CMP-0002', 'CMP-0001']),
      suggestedActions: [
        { label: 'Görev Merkezi', actionType: 'task', route: 'bildirimler', searchParam: 'taskId=TSK-0001' },
        { label: 'Yeni Görev Ekle', actionType: 'task', route: 'bildirimler' }
      ],
      confidenceScore: 95,
      sourceModules: ['Görev', 'Bildirim']
    };
  }

  // Rule 5: boş + led / müsait
  if (normalized.includes('boş') || normalized.includes('müsait') || normalized.includes('serbest') || normalized.includes('kiralık')) {
    return {
      answerText: `Şu anda kiralama için müsait durumda olan **boş premium LED ekranlar**:

*   **SG-001** | Giriş LED Ekran | İç Hatlar Giden Yolcu (Aylık ₺30M)
*   **SG-003** | Pasaport Geçiş LED | Dış Hatlar Giden Yolcu (Aylık ₺60M)
*   **SG-017** | İç Hatlar Giden LED | Lobi Asma Kat (Aylık ₺9.5M)

Bu alanlar için portföyünüzdeki **Turkcell** ve **Samsung** markaları hedeflenerek çapraz satış teklifleri hazırlanabilir.`,
      relatedEntities: getEntities(['SPC-0001', 'SPC-0003', 'SPC-0017', 'CMP-0002', 'CMP-0001']),
      suggestedActions: [
        { label: 'Envantere Git', actionType: 'space', route: 'reklam-alanlari', searchParam: 'spaceId=SPC-0001' },
        { label: 'Hızlı Teklif', actionType: 'offer', route: 'teklifler' }
      ],
      confidenceScore: 91,
      sourceModules: ['Reklam Alanı', 'Firma', 'Teklif']
    };
  }

  // Rule 6: ciro / gelir / kazanç
  if (normalized.includes('ciro') || normalized.includes('gelir') || normalized.includes('kazanç') || normalized.includes('para')) {
    return {
      answerText: `OutdoorCore portföyünde **en yüksek ciro getirisi sağlayan** reklam alanları:

1.  **SG-001** (Giriş LED) — **₺14.500.000** yıllık ciro — %98 Doluluk Oranı
2.  **SG-021** (Check-in Önü LED) — **₺12.800.000** yıllık ciro — %95 Doluluk Oranı
3.  **SG-045** (Duty Free LED) — **₺11.200.000** yıllık ciro — %92 Doluluk Oranı

Bu alanların doluluk oranları zirve seviyede olup, yenileme döneminde fiyat artışı yapılması önerilir.`,
      relatedEntities: getEntities(['SPC-0001', 'SPC-0021', 'SPC-0045']),
      suggestedActions: [
        { label: 'Rapor Merkezi', actionType: 'report', route: 'raporlar' },
        { label: 'Ciro Analizini Aç', actionType: 'report', route: 'raporlar' }
      ],
      confidenceScore: 97,
      sourceModules: ['Raporlar', 'Reklam Alanı', 'Finans']
    };
  }

  // Rule 7: kampanya + eksik / kreatif
  if (normalized.includes('kampanya') || normalized.includes('eksik') || normalized.includes('kreatif') || normalized.includes('dosya')) {
    return {
      answerText: `Yayında olan veya planlanan kampanyalarda **kreatif dosya eksikliği** veya onay bekleme durumları tespit edildi:

*   **CAM-0002** | Turkcell Yaz İletişimi — Kreatif dosya eksik, yayın askıda.
*   **CAM-0003** | THY Global Miles — Kreatif revize istendi, ajans dönüşü bekleniyor.

İlgili müşteri temsilcileri ve kreatif ajanslar ile doğrudan temasa geçilmesi operasyonel başarıyı artıracaktır.`,
      relatedEntities: getEntities(['CAM-0002', 'CMP-0003', 'CMP-0002']),
      suggestedActions: [
        { label: 'Kampanyaları Gör', actionType: 'campaign', route: 'kampanyalar', searchParam: 'campaignId=CAM-0002' },
        { label: 'Medya Yükle', actionType: 'campaign', route: 'kampanyalar' }
      ],
      confidenceScore: 93,
      sourceModules: ['Kampanya', 'Firma']
    };
  }

  // Default Fallback
  return {
    answerText: `Merhaba, ben **OutdoorCore AI Copilot** asistanınız. 

Girmek istediğiniz komutla tam bir veri eşleşmesi sağlayamadım. Lütfen sol paneldeki hızlı prompt chip'lerini kullanın veya aşağıdaki örnekler gibi sorgular girin:

*   "Samsung için boş alanları göster"
*   "THY sözleşmesi ne zaman bitiyor?"
*   "Bu ay tahsilat riski olan firmalar"
*   "Müsait LED ekranlar hangileri?"
*   "Bugün yapmam gereken işler"`,
    relatedEntities: getEntities(['CMP-0001', 'CMP-0003', 'SPC-0001']),
    suggestedActions: [
      { label: 'Genel Bakışa Git', actionType: 'dashboard', route: 'dashboard' },
      { label: 'AI Asistan Danışmanı', actionType: 'assistant', route: 'dashboard' }
    ],
    confidenceScore: 80,
    sourceModules: ['Sistem']
  };
}
