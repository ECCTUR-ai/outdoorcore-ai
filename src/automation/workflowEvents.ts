import { WorkflowEvent, WorkflowEventType } from './workflowTypes';

export function createWorkflowEvent(
  eventType: WorkflowEventType,
  sourceEntityType: WorkflowEvent['sourceEntityType'],
  sourceEntityId: string,
  payload?: any
): WorkflowEvent {
  return {
    eventId: 'EVT-' + Math.floor(100000 + Math.random() * 900000),
    eventType,
    sourceEntityType,
    sourceEntityId,
    payload,
    createdAt: new Date().toISOString()
  };
}
