export interface MaintenanceTask {
  id: string;
  spaceCode: string;
  spaceId: string;
  assignedTechnician: { name: string; avatar: string; phone: string };
  issue: string;
  status: 'Açık İş Emri' | 'Parça Bekliyor' | 'Tamamlandı';
  urgency: 'Kritik' | 'Yüksek' | 'Orta' | 'Düşük';
  replacedParts: string[];
  slaTimeMinutes: number;
  scheduledDate: string;
  completionDate?: string;
  qrCode: string;
  aiRiskScore: number;
  photoUrl?: string;
}

export const maintenanceTasks: MaintenanceTask[] = [
  {
    id: 'TSK-M001',
    spaceCode: 'SG-021',
    spaceId: 'SPC-0021',
    assignedTechnician: { name: 'Ahmet Kaya (Kıdemli Tekniker)', avatar: 'AK', phone: '+90 532 999 1111' },
    issue: 'Check-in Önü LED panelinde piksel yanması ve renk kayması.',
    status: 'Açık İş Emri',
    urgency: 'Kritik',
    replacedParts: ['LED Modül P2.5', 'Güç Kablosu'],
    slaTimeMinutes: 45,
    scheduledDate: '06.05.2025',
    qrCode: 'QR-SPC-0021-M01',
    aiRiskScore: 88
  },
  {
    id: 'TSK-M002',
    spaceCode: 'SG-001',
    spaceId: 'SPC-0001',
    assignedTechnician: { name: 'Mehmet Demir (Teknisyen)', avatar: 'MD', phone: '+90 532 999 2222' },
    issue: 'Giriş LED Ekranında periyodik fan bakımı ve toz temizliği.',
    status: 'Tamamlandı',
    urgency: 'Orta',
    replacedParts: ['Filtre Bezi', 'Soğutucu Fan'],
    slaTimeMinutes: 120,
    scheduledDate: '04.05.2025',
    completionDate: '04.05.2025',
    qrCode: 'QR-SPC-0001-M02',
    aiRiskScore: 12
  },
  {
    id: 'TSK-M003',
    spaceCode: 'SG-045',
    spaceId: 'SPC-0045',
    assignedTechnician: { name: 'Hakan Şahin (Elektrik Mühendisi)', avatar: 'HŞ', phone: '+90 532 999 3333' },
    issue: 'Duty Free Yanı LED ekranında güç kaynağı dalgalanması arızası.',
    status: 'Parça Bekliyor',
    urgency: 'Kritik',
    replacedParts: ['Güç Kaynağı Meanwell 5V'],
    slaTimeMinutes: 180,
    scheduledDate: '07.05.2025',
    qrCode: 'QR-SPC-0045-M03',
    aiRiskScore: 92
  },
  {
    id: 'TSK-M004',
    spaceCode: 'SG-003',
    spaceId: 'SPC-0003',
    assignedTechnician: { name: 'Mehmet Demir (Teknisyen)', avatar: 'MD', phone: '+90 532 999 2222' },
    issue: 'Pasaport Geçiş LED panosunda HDMI sinyal kopukluğu ve titreme.',
    status: 'Açık İş Emri',
    urgency: 'Yüksek',
    replacedParts: ['HDMI Fiber Optik Kablo 15m'],
    slaTimeMinutes: 90,
    scheduledDate: '06.05.2025',
    qrCode: 'QR-SPC-0003-M04',
    aiRiskScore: 65
  },
  {
    id: 'TSK-M005',
    spaceCode: 'SG-017',
    spaceId: 'SPC-0017',
    assignedTechnician: { name: 'Ahmet Kaya (Kıdemli Tekniker)', avatar: 'AK', phone: '+90 532 999 1111' },
    issue: 'İç Hatlar Giden LED panelinde arka kapak kilit mekanizması değişimi.',
    status: 'Tamamlandı',
    urgency: 'Düşük',
    replacedParts: ['Mekanik Kilit Askısı'],
    slaTimeMinutes: 240,
    scheduledDate: '05.05.2025',
    completionDate: '05.05.2025',
    qrCode: 'QR-SPC-0017-M05',
    aiRiskScore: 5
  }
];

export const maintenanceKpis = {
  totalFaults: 18,
  activeWorkOrders: 6,
  todaysMaintenance: 4,
  criticalIssues: 2,
  pendingParts: 3,
  slaPercentage: "%97.8"
};
