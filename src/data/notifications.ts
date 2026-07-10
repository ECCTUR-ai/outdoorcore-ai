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

export const notificationsList: SystemNotification[] = [];
