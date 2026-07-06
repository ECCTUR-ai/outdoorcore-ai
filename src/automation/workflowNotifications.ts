import { workflowActionsExecutor } from './workflowActions';

export const workflowNotificationsManager = {
  send(message: string, type: 'info' | 'success' | 'warning' | 'critical', companyName?: string, linkId?: string) {
    return workflowActionsExecutor.createNotification({
      message,
      type,
      company: companyName || 'Sistem',
      category: 'Sistem',
      linkId
    });
  }
};
