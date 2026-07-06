import { tasksList, TaskItem } from '@/data/tasks';
import { notificationsList, SystemNotification } from '@/data/notifications';
import { activityLogRepository, auditLogRepository } from '@/repositories';
import { contracts } from '@/data/contracts';
import { reservations } from '@/data/reservations';
import { campaigns } from '@/data/campaigns';
import { financeData } from '@/data/finance';
import { taskRepository as newTaskRepo } from '@/notifications/taskRepository';
import { notificationEngine } from '@/notifications/notificationEngine';

// Helper to read/write localStorage mock arrays
const getMockData = <T>(key: string, fallback: T[]): T[] => {
  try {
    const stored = localStorage.getItem(`outdoorcore_mock_${key}`);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const saveMockData = <T>(key: string, data: T[]) => {
  try {
    localStorage.setItem(`outdoorcore_mock_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save mock data:', e);
  }
};

export const workflowActionsExecutor = {
  createTask(payload: any) {
    const newTask = newTaskRepo.create({
      organizationId: 'org-1',
      assignedTo: payload.assignee || 'Ahmet Y.',
      title: payload.title || 'Otomasyon Görevi',
      description: payload.notes || 'Otomasyon akışı sonucu atanan görev.',
      status: 'todo',
      priority: payload.priority === 'Kritik' ? 'critical' : payload.priority === 'Yüksek' ? 'high' : payload.priority === 'Orta' ? 'medium' : 'low',
      dueDate: payload.dueDate || '10.07.2026',
      sourceEntityType: payload.category === 'Sözleşme' ? 'contract' : payload.category === 'Teklif' ? 'offer' : payload.category === 'Kampanya' ? 'campaign' : 'system',
      sourceEntityId: payload.linkId || '0'
    });
    return newTask.taskId;
  },

  createNotification(payload: any) {
    const categoryMapping: Record<string, any> = {
      'Teklif': 'offer',
      'Sözleşme': 'contract',
      'Rezervasyon': 'reservation',
      'Kampanya': 'campaign',
      'Tahsilat': 'finance',
      'Bakım': 'maintenance',
      'Sistem': 'system'
    };
    notificationEngine.dispatchNotification({
      organizationId: 'org-1',
      userId: 'usr-demo',
      title: payload.company || 'Sistem Bildirimi',
      message: payload.message || 'Otomasyon bildirimi.',
      type: payload.type === 'critical' ? 'danger' : payload.type === 'warning' ? 'warning' : payload.type === 'success' ? 'success' : 'info',
      priority: payload.type === 'critical' ? 'critical' : 'medium',
      category: categoryMapping[payload.category] || 'system',
      sourceEntityType: 'system',
      sourceEntityId: payload.linkId || '0',
      channel: 'in_app'
    });
    return 'NTF-MOCKED';
  },

  async logActivity(payload: any) {
    await activityLogRepository.log(payload.description, payload.module || 'automation');
  },

  async logAudit(payload: any) {
    await auditLogRepository.log(payload.action, payload.entityType, payload.entityId);
  },

  createContractDraft(payload: any) {
    const localContracts = getMockData('contracts', contracts);
    const newContract: any = {
      id: 'CON-' + Math.floor(1000 + Math.random() * 9000),
      contractNo: 'SOZ-2026-' + Math.floor(1000 + Math.random() * 9000),
      clientName: payload.clientName || 'Yeni Müşteri A.Ş.',
      logo: (payload.clientName || 'N')[0].toUpperCase(),
      value: '₺1,200,000',
      valueNumeric: 1200000,
      startDate: '06.07.2026',
      endDate: '06.08.2026',
      daysLeft: 30,
      status: 'İmza Bekleyen',
      progress: 10,
      crmTier: 'Standard',
      aiRiskScore: 12,
      mediaAgency: 'Direct',
      campaignName: payload.campaignName || 'Lansman Kampanyası',
      proposalId: payload.proposalId || 'PRP-0001',
      reservationId: 'RES-0001',
      spacesList: ['SG-001', 'SG-002'],
      filesList: [],
      installments: [],
      history: [],
      aiRiskAnalysis: ['Ödeme vadesi 30 gün olarak belirlendi.', 'Hukuki risk bulunmamaktadır.'],
      notes: [payload.notes || 'Otomatik oluşturulan sözleşme taslağı.']
    };
    localContracts.unshift(newContract);
    saveMockData('contracts', localContracts);
    return newContract.id;
  },

  createReservation(payload: any) {
    const localReservations = getMockData('reservations', reservations);
    const newReservation: any = {
      id: 'RES-' + Math.floor(1000 + Math.random() * 9000),
      clientName: payload.clientName || 'Müşteri A.Ş.',
      spaceCode: 'SG-021',
      spaceId: 'space-21',
      startDate: '06.07.2026',
      endDate: '06.08.2026',
      status: 'Onaylandı',
      price: '₺450,000',
      proposalId: payload.proposalId || 'PRP-001',
      contractId: payload.contractId || 'CON-001',
      campaignId: 'CAM-' + Math.floor(1000 + Math.random() * 9000)
    };
    localReservations.unshift(newReservation);
    saveMockData('reservations', localReservations);
    return newReservation.id;
  },

  createCampaignDraft(payload: any) {
    const newCampaign: any = {
      id: 'CAM-' + Math.floor(1000 + Math.random() * 9000),
      clientName: payload.clientName || 'Müşteri A.Ş.',
      campaignName: payload.campaignName || 'Yeni Lansman Kampanyası',
      status: 'Planlandı',
      startDate: '06.07.2026',
      endDate: '06.08.2026',
      budget: '₺450,000',
      spacesList: ['SG-021'],
      successRate: 85,
      creativesCount: 0,
      aiScore: 9.2,
      logo: (payload.clientName || 'M')[0].toUpperCase(),
      proposalId: payload.proposalId || 'PRP-001',
      contractId: payload.contractId || 'CON-001',
      reservationId: payload.reservationId || 'RES-001',
      mediaAgency: 'Direct',
      creativeAgency: 'Müşteri Dahili',
      creativeFiles: [],
      aiAnalysisNotes: ['İlk hedef kitle Samsung lansmanı için uygundur.'],
      impressions: '1.2M',
      reach: '450K',
      frequency: 2.1,
      airtimeHours: 24,
      bestSpace: 'SG-021',
      riskySpace: ''
    };
    campaigns.unshift(newCampaign);
    saveMockData('campaigns', campaigns);
    return newCampaign.id;
  },

  createInvoiceDraft(payload: any) {
    try {
      const storedFinance = localStorage.getItem('outdoorcore_mock_finance_data');
      const data = storedFinance ? JSON.parse(storedFinance) : financeData;
      
      const newInvoice = {
        id: 'INV-' + Math.floor(10000 + Math.random() * 90000),
        invoiceNo: 'FTR-2026-' + Math.floor(10000 + Math.random() * 90000),
        dueDate: '06.08.2026',
        issueDate: '06.07.2026',
        amount: '₺450,000',
        status: 'Bekliyor' as const,
        pdfUrl: ''
      };

      // Add to first active account or fallback
      if (data.accounts && data.accounts.length > 0) {
        data.accounts[0].invoices.unshift(newInvoice);
      }
      localStorage.setItem('outdoorcore_mock_finance_data', JSON.stringify(data));
      return newInvoice.invoiceNo;
    } catch (e) {
      console.error(e);
      return 'FTR-2026-MOCK';
    }
  }
};
