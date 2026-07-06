import { notificationRepository } from './notificationRepository';
import { taskRepository } from './taskRepository';
import { Notification, Task } from './notificationTypes';

export const notificationRulesEngine = {
  processEventRules(eventType: string, payload: any) {
    const orgId = payload?.organizationId || 'org-1';
    const userId = payload?.userId || 'usr-demo';
    
    switch (eventType) {
      case 'offer.approved':
        notificationRepository.create({
          organizationId: orgId,
          userId: userId,
          title: 'Teklif Onaylandı',
          message: `${payload?.clientName || 'Firma'} teklifi onaylandı, sözleşme taslağı hazırlandı.`,
          type: 'success',
          priority: 'high',
          category: 'offer',
          sourceEntityType: 'offer',
          sourceEntityId: payload?.proposalId || '0',
          channel: 'in_app'
        });
        break;

      case 'contract.expiring_30':
        taskRepository.create({
          organizationId: orgId,
          title: `${payload?.clientName || 'Müşteri'} Sözleşme Yenileme Görüşmesi Planla`,
          description: `Sözleşme bitimine 30 gün kaldı. ${payload?.clientName || 'Müşteri'} için yenileme fırsatı oluşturup görüşme planlayın.`,
          status: 'todo',
          priority: 'high',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
          sourceEntityType: 'contract',
          sourceEntityId: payload?.contractId || '0'
        });
        break;

      case 'invoice.due_soon':
        notificationRepository.create({
          organizationId: orgId,
          userId: userId,
          title: 'Fatura Vadesi Yaklaşıyor',
          message: `${payload?.clientName || 'Firma'} faturası 5 gün içinde vadeye düşecek. Tutar: ${payload?.amount || 'Belirtilmedi'}`,
          type: 'warning',
          priority: 'medium',
          category: 'finance',
          sourceEntityType: 'invoice',
          sourceEntityId: payload?.linkId || '0',
          channel: 'in_app'
        });
        break;
      
      default:
        break;
    }
  }
};
