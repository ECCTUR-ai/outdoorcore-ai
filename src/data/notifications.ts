export interface SystemNotification {
  id: string;
  time: string;
  user: string;
  company: string;
  message: string;
  category: 'Teklif' | 'Sözleşme' | 'Rezervasyon' | 'Kampanya' | 'Tahsilat' | 'Bakım' | 'Kreatif' | 'Sistem';
  status: 'critical' | 'info' | 'success' | 'warning';
  // Global Relations
  companyId?: string;
  linkId?: string;
}

export const notificationsList: SystemNotification[] = [
  {
    id: 'NTF-0001',
    time: '09:30',
    user: 'Ahmet Y.',
    company: 'Samsung Electronics',
    message: 'Samsung Galaxy AI Sözleşmesi imzalanmak üzere gönderildi.',
    category: 'Sözleşme',
    status: 'info',
    companyId: 'CMP-0001',
    linkId: 'CON-0001'
  },
  {
    id: 'NTF-0002',
    time: '10:15',
    user: 'Ayşe K.',
    company: 'Türk Hava Yolları',
    message: 'THY Global Miles kampanyası için kreatif dosyaları yükledi.',
    category: 'Kreatif',
    status: 'warning',
    companyId: 'CMP-0003',
    linkId: 'CAM-0003'
  },
  {
    id: 'NTF-0003',
    time: '11:00',
    user: 'Mehmet S.',
    company: 'Turkcell',
    message: 'Turkcell cari hesabında 80 günlük vadesi geçmiş ödeme uyarısı.',
    category: 'Tahsilat',
    status: 'critical',
    companyId: 'CMP-0002',
    linkId: 'CON-0002'
  },
  {
    id: 'NTF-0004',
    time: '12:30',
    user: 'Sistem',
    company: 'Terminal Alanı',
    message: 'SG-021 check-in LED ekranı periyodik bakımı tamamlandı.',
    category: 'Bakım',
    status: 'success',
    linkId: 'SPC-0021'
  },
  {
    id: 'NTF-0005',
    time: '14:00',
    user: 'Caner Ö.',
    company: 'Pegasus Airlines',
    message: 'Pegasus Yaz Uçuşları için yeni rezervasyon talebi oluşturuldu.',
    category: 'Rezervasyon',
    status: 'info',
    companyId: 'CMP-0006',
    linkId: 'RSV-0004'
  },
  {
    id: 'NTF-0006',
    time: '15:15',
    user: 'Ahmet Y.',
    company: 'Mercedes-Benz Türkiye',
    message: 'Mercedes EQ lansman teklifi müşteri onayı bekliyor.',
    category: 'Teklif',
    status: 'warning',
    companyId: 'CMP-0005',
    linkId: 'OFF-0004'
  },
  {
    id: 'NTF-0007',
    time: '16:00',
    user: 'Ayşe K.',
    company: 'Garanti BBVA',
    message: 'Garanti Seyahat Kartı kampanyası başarıyla tamamlandı.',
    category: 'Kampanya',
    status: 'success',
    companyId: 'CMP-0007'
  },
  {
    id: 'NTF-0008',
    time: '17:30',
    user: 'Sistem',
    company: 'Hukuk Dep.',
    message: 'Sözleşme şablonlarında yapılan değişiklikler sisteme tanımlandı.',
    category: 'Sistem',
    status: 'success'
  }
];
