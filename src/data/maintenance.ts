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

export const maintenanceTasks: MaintenanceTask[] = [];

export const maintenanceKpis = {
  totalFaults: 0,
  activeWorkOrders: 0,
  todaysMaintenance: 0,
  criticalIssues: 0,
  pendingParts: 0,
  slaPercentage: "%100.0"
};
