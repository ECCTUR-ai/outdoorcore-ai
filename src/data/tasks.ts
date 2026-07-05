export interface TaskItem {
  id: string;
  clientName: string;
  logo: string;
  logoUrl?: string;
  taskTitle: string;
  priority: 'Kritik' | 'Yüksek' | 'Orta' | 'Düşük';
  dueDate: string;
  assignee: string;
  module: 'Sözleşme' | 'Teklif' | 'Kampanya' | 'Finans' | 'Rezervasyon' | 'Bakım';
  status: 'Yapılacak' | 'Devam Ediyor' | 'Bekliyor' | 'Tamamlandı';
  // Global Relations
  companyId?: string;
  linkId?: string;
}

export const tasksList: TaskItem[] = [
  {
    id: 'TSK-0001',
    clientName: 'Türk Hava Yolları',
    logo: 'T',
    logoUrl: '/logos/thy.svg',
    taskTitle: 'Sözleşme şartnamesini hukuk birimiyle paylaş.',
    priority: 'Kritik',
    dueDate: '10 Haz 2025',
    assignee: 'Ahmet Y.',
    module: 'Sözleşme',
    status: 'Yapılacak',
    companyId: 'CMP-0003',
    linkId: 'CON-0003'
  },
  {
    id: 'TSK-0002',
    clientName: 'Samsung Electronics',
    logo: 'S',
    logoUrl: '/logos/samsung.svg',
    taskTitle: 'Galaxy AI lansmanı için LED reklam alanlarını doğrula.',
    priority: 'Yüksek',
    dueDate: '12 Haz 2025',
    assignee: 'Ayşe K.',
    module: 'Kampanya',
    status: 'Devam Ediyor',
    companyId: 'CMP-0001',
    linkId: 'CAM-0001'
  },
  {
    id: 'TSK-0003',
    clientName: 'Mercedes-Benz Türkiye',
    logo: 'M',
    logoUrl: '/logos/mercedes.svg',
    taskTitle: 'EQ Serisi teklif revizesini tamamla.',
    priority: 'Orta',
    dueDate: '14 Haz 2025',
    assignee: 'Mehmet S.',
    module: 'Teklif',
    status: 'Bekliyor',
    companyId: 'CMP-0005',
    linkId: 'OFF-0004'
  },
  {
    id: 'TSK-0004',
    clientName: 'Turkcell',
    logo: 'T',
    logoUrl: '/logos/turkcell.svg',
    taskTitle: 'Geciken faturalar için mutabakat toplantısı yap.',
    priority: 'Kritik',
    dueDate: '08 Haz 2025',
    assignee: 'Ahmet Y.',
    module: 'Finans',
    status: 'Yapılacak',
    companyId: 'CMP-0002',
    linkId: 'CON-0002'
  },
  {
    id: 'TSK-0005',
    clientName: 'Pegasus Airlines',
    logo: 'P',
    logoUrl: '/logos/pegasus.svg',
    taskTitle: 'Yaz uçuşları rezervasyon planını onayla.',
    priority: 'Orta',
    dueDate: '15 Haz 2025',
    assignee: 'Ayşe K.',
    module: 'Rezervasyon',
    status: 'Tamamlandı',
    companyId: 'CMP-0006',
    linkId: 'RSV-0004'
  }
];
