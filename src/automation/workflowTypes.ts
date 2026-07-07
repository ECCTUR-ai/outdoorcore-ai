export type WorkflowEventType =
  | 'offer.created'
  | 'offer.stage_changed'
  | 'offer.approved'
  | 'offer.rejected'
  | 'contract.created'
  | 'contract.signed'
  | 'contract.expiring_90'
  | 'contract.expiring_60'
  | 'contract.expiring_30'
  | 'contract.expiring_7'
  | 'reservation.created'
  | 'reservation.approved'
  | 'reservation.conflict_detected'
  | 'campaign.created'
  | 'campaign.ready'
  | 'campaign.started'
  | 'campaign.ended'
  | 'campaign.creative_missing'
  | 'invoice.created'
  | 'invoice.due_soon'
  | 'invoice.overdue'
  | 'payment.received'
  | 'maintenance.created'
  | 'maintenance.completed'
  | 'digital_slot.created';

export interface WorkflowEvent {
  eventId: string;
  eventType: WorkflowEventType;
  sourceEntityType: 'offer' | 'contract' | 'reservation' | 'campaign' | 'invoice' | 'payment' | 'maintenance' | 'system' | 'digital_slot';
  sourceEntityId: string;
  organizationId?: string;
  userId?: string;
  payload?: any;
  createdAt: string;
}

export type WorkflowActionType =
  | 'create_contract_draft'
  | 'create_reservation'
  | 'create_campaign_draft'
  | 'create_invoice_draft'
  | 'create_task'
  | 'create_notification'
  | 'write_activity_log'
  | 'write_audit_log';

export interface WorkflowAction {
  actionType: WorkflowActionType;
  targetEntityType: string;
  payload: any;
}

export interface AutomationRule {
  eventType: WorkflowEventType;
  actions: WorkflowAction[];
}

export interface WorkflowEventLog {
  eventId: string;
  eventType: WorkflowEventType;
  sourceEntityType: string;
  sourceEntityId: string;
  organizationId?: string;
  userId?: string;
  payload?: any;
  createdAt: string;
  status: 'success' | 'pending' | 'error';
  processedActions: string[];
}
