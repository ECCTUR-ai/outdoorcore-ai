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

export const tasksList: TaskItem[] = [];
