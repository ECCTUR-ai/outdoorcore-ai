import { WorkflowEventLog, WorkflowEvent } from './workflowTypes';

const EVENT_LOGS_KEY = 'outdoorcore_workflow_events';

export const workflowAuditRepository = {
  getLogs(): WorkflowEventLog[] {
    try {
      const stored = localStorage.getItem(EVENT_LOGS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  logEvent(event: WorkflowEvent, status: WorkflowEventLog['status'], processedActions: string[]) {
    try {
      const logs = this.getLogs();
      const newLog: WorkflowEventLog = {
        eventId: event.eventId,
        eventType: event.eventType,
        sourceEntityType: event.sourceEntityType,
        sourceEntityId: event.sourceEntityId,
        organizationId: event.organizationId,
        userId: event.userId,
        payload: event.payload,
        createdAt: event.createdAt,
        status,
        processedActions
      };
      const updated = [newLog, ...logs].slice(0, 50); // Keep last 50 events
      localStorage.setItem(EVENT_LOGS_KEY, JSON.stringify(updated));
      
      // Dispatch a window event to trigger re-renders in UI widgets in real-time
      window.dispatchEvent(new Event('workflow_logs_updated'));
    } catch (e) {
      console.error('Failed to save workflow audit log:', e);
    }
  }
};
