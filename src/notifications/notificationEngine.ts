import { Notification } from './notificationTypes';
import { notificationPreferencesManager } from './notificationPreferences';
import { notificationChannels } from './notificationChannels';
import { notificationRulesEngine } from './notificationRules';
import { notificationRepository } from './notificationRepository';

export const notificationEngine = {
  dispatchNotification(input: Partial<Notification>) {
    const category = input.category || 'system';
    const pref = notificationPreferencesManager.getCategoryPreference(category);

    if (!pref.enabled) {
      console.log(`[Notification Engine] Notifications disabled for category: ${category}`);
      return;
    }

    let createdNotif: Notification | null = null;
    if (pref.in_app) {
      createdNotif = notificationRepository.create({
        ...input,
        channel: 'in_app'
      });
      notificationChannels.sendInApp(createdNotif);
    }

    const channelsToSend: ('email' | 'whatsapp' | 'sms' | 'push')[] = [];
    if (pref.email) channelsToSend.push('email');
    if (pref.whatsapp) channelsToSend.push('whatsapp');
    if (pref.sms) channelsToSend.push('sms');
    if (pref.push) channelsToSend.push('push');

    for (const channel of channelsToSend) {
      const payload: Notification = createdNotif || {
        notificationId: 'NTF-MOCK',
        organizationId: input.organizationId || 'org-1',
        userId: input.userId || 'usr-demo',
        title: input.title || 'Bildirim',
        message: input.message || '',
        type: input.type || 'info',
        priority: input.priority || 'medium',
        category,
        sourceEntityType: input.sourceEntityType || 'system',
        sourceEntityId: input.sourceEntityId || '0',
        relatedEntities: input.relatedEntities || [],
        isRead: false,
        isArchived: false,
        channel,
        createdAt: new Date().toISOString()
      };

      if (channel === 'email') notificationChannels.sendEmailPlaceholder(payload);
      if (channel === 'whatsapp') notificationChannels.sendWhatsAppPlaceholder(payload);
      if (channel === 'sms') notificationChannels.sendSmsPlaceholder(payload);
      if (channel === 'push') notificationChannels.sendPushPlaceholder(payload);
    }
  },

  handleWorkflowEvent(eventType: string, payload: any) {
    notificationRulesEngine.processEventRules(eventType, payload);
  }
};
