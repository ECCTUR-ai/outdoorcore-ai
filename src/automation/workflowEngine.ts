import { WorkflowEvent, WorkflowAction, WorkflowEventLog } from './workflowTypes';
import { automationRules } from './automationRules';
import { workflowActionsExecutor } from './workflowActions';
import { workflowAuditRepository } from './workflowAudit';

export const workflowEngine = {
  dispatchWorkflowEvent(event: WorkflowEvent) {
    console.log(`[WorkflowEngine] Dispatching Event: ${event.eventType} for Entity ${event.sourceEntityType}/${event.sourceEntityId}`);
    
    const matchedRules = this.processAutomationRules(event);
    if (matchedRules.length === 0) {
      // Log event trace as success with 0 processed actions
      workflowAuditRepository.logEvent(event, 'success', []);
      return;
    }

    const processedActions: string[] = [];
    let status: WorkflowEventLog['status'] = 'success';

    for (const rule of matchedRules) {
      try {
        const results = this.executeWorkflowActions(rule.actions, event);
        processedActions.push(...results);
      } catch (err) {
        console.error('[WorkflowEngine] Action execution failed:', err);
        status = 'error';
      }
    }

    workflowAuditRepository.logEvent(event, status, processedActions);
  },

  processAutomationRules(event: WorkflowEvent) {
    return automationRules.filter(rule => rule.eventType === event.eventType);
  },

  executeWorkflowActions(actions: WorkflowAction[], event: WorkflowEvent): string[] {
    const executed: string[] = [];
    const clientName = event.payload?.clientName || 'Samsung Electronics';
    const campaignName = event.payload?.campaignName || 'Lansman Kampanyası';

    for (const action of actions) {
      const payload = {
        ...action.payload,
        clientName,
        campaignName,
        proposalId: event.sourceEntityId,
        contractId: event.sourceEntityType === 'contract' ? event.sourceEntityId : undefined,
        reservationId: event.sourceEntityType === 'reservation' ? event.sourceEntityId : undefined,
        linkId: event.sourceEntityId,
        companyId: event.payload?.companyId
      };

      switch (action.actionType) {
        case 'create_contract_draft':
          const cId = workflowActionsExecutor.createContractDraft(payload);
          executed.push(`Sözleşme Taslağı Oluşturuldu (#${cId})`);
          break;
        case 'create_reservation':
          const rId = workflowActionsExecutor.createReservation(payload);
          executed.push(`Rezervasyon Oluşturuldu (#${rId})`);
          break;
        case 'create_campaign_draft':
          const camId = workflowActionsExecutor.createCampaignDraft(payload);
          executed.push(`Kampanya Taslağı Oluşturuldu (#${camId})`);
          break;
        case 'create_invoice_draft':
          const invNo = workflowActionsExecutor.createInvoiceDraft(payload);
          executed.push(`Fatura Taslağı Oluşturuldu (#${invNo})`);
          break;
        case 'create_task':
          const tId = workflowActionsExecutor.createTask(payload);
          executed.push(`Görev Atandı (#${tId})`);
          break;
        case 'create_notification':
          const nId = workflowActionsExecutor.createNotification(payload);
          executed.push(`Bildirim Gönderildi (#${nId})`);
          break;
        case 'write_activity_log':
          workflowActionsExecutor.logActivity(payload);
          executed.push(`Aktivite Kaydedildi`);
          break;
        case 'write_audit_log':
          workflowActionsExecutor.logAudit(payload);
          executed.push(`Denetim Kaydedildi`);
          break;
        default:
          console.warn(`[WorkflowEngine] Unknown action type: ${action.actionType}`);
      }
    }
    return executed;
  }
};
