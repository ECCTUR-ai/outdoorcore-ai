export interface SystemNotification {
  id: string;
  time: string;
  user: string;
  company: string;
  message: string;
  category: 'Teklif' | 'Sözleşme' | 'Rezervasyon' | 'Kampanya' | 'Tahsilat' | 'Bakım' | 'Kreatif' | 'Sistem';
  status: 'critical' | 'info' | 'success' | 'warning';
}

export const notificationsList: SystemNotification[] = [
  {
    id: 'n1',
    time: '09:30',
    user: 'Ahmet Y.',
    company: 'Samsung Electronics',
    message: 'Samsung Galaxy AI Sözleşmesi imzalanmak üzere gönderildi.',
    category: 'Sözleşme',
    status: 'info'
  },
  {
    id: 'n2',
    time: '10:15',
    user: 'Ayşe K.',
    company: 'Türk Hava Yolları',
    message: 'THY Global Miles kampanyası için kreatif dosyaları yükledi.',
    category: 'Kreatif',
    status: 'warning'
  },
  {
    id: 'n3',
    time: '11:00',
    user: 'Mehmet S.',
    company: 'Turkcell',
    message: 'Turkcell cari hesabında 80 günlük vadesi geçmiş ödeme uyarısı.',
    category: 'Tahsilat',
    status: 'critical'
  },
  {
    id: 'n4',
    time: '12:30',
    user: 'Sistem',
    company: 'Terminal Alanı',
    message: 'SG-021 check-in LED ekranı periyodik bakımı tamamlandı.',
    category: 'Bakım',
    status: 'success'
  },
  {
    id: 'n5',
    time: '14:00',
    user: 'Caner Ö.',
    company: 'Pegasus Airlines',
    message: 'Pegasus Yaz Uçuşları için yeni rezervasyon talebi oluşturuldu.',
    category: 'Rezervasyon',
    status: 'info'
  },
  {
    id: 'n6',
    time: '15:15',
    user: 'Ahmet Y.',
    company: 'Mercedes-Benz Türkiye',
    message: 'Mercedes EQ lansman teklifi müşteri onayı bekliyor.',
    category: 'Teklif',
    status: 'warning'
  },
  {
    id: 'n7',
    time: '16:00',
    user: 'Ayşe K.',
    company: 'Garanti BBVA',
    message: 'Garanti Seyahat Kartı kampanyası başarıyla tamamlandı.',
    category: 'Kampanya',
    status: 'success'
  },
  {
    id: 'n8',
    time: '17:30',
    user: 'Sistem',
    company: 'Hukuk Dep.',
    message: 'Sözleşme şablonlarında yapılan değişiklikler sisteme tanımlandı.',
    category: 'Sistem',
    status: 'success'
  }
];
