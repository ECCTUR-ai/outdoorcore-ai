import { createWorkflowEvent } from './workflowEvents';
import { workflowEngine } from './workflowEngine';

export const workflowScheduler = {
  checkExpiringContracts() {
    // Simulate check for 30-day expiration
    const event = createWorkflowEvent('contract.expiring_30', 'contract', 'CON-0002', {
      clientName: 'Pegasus Airlines',
      campaignName: 'Yaz Kampanyası'
    });
    workflowEngine.dispatchWorkflowEvent(event);
  },

  checkUpcomingInvoices() {
    const event = createWorkflowEvent('invoice.due_soon', 'invoice', 'INV-8827', {
      clientName: 'Turkcell',
      amount: '₺450,000'
    });
    workflowEngine.dispatchWorkflowEvent(event);
  }
};
