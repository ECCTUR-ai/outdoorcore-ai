import { NotificationPreference, Notification } from './notificationTypes';

const PREFERENCES_KEY = 'outdoorcore_notification_preferences';

const defaultCategories: Notification['category'][] = [
  'offer', 'contract', 'reservation', 'campaign', 'finance', 'maintenance', 'media', 'workflow', 'system', 'ai'
];

const createDefaultPreferences = (): NotificationPreference[] => {
  return defaultCategories.map(cat => ({
    category: cat,
    in_app: true,
    email: cat === 'contract' || cat === 'finance',
    whatsapp: cat === 'maintenance' || cat === 'finance',
    sms: false,
    push: true,
    enabled: true
  }));
};

export const notificationPreferencesManager = {
  getPreferences(): NotificationPreference[] {
    try {
      const stored = localStorage.getItem(PREFERENCES_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    const defaults = createDefaultPreferences();
    this.savePreferences(defaults);
    return defaults;
  },

  savePreferences(prefs: NotificationPreference[]) {
    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
      window.dispatchEvent(new Event('notification_preferences_updated'));
    } catch (e) {
      console.error(e);
    }
  },

  getCategoryPreference(category: Notification['category']): NotificationPreference {
    const prefs = this.getPreferences();
    return prefs.find(p => p.category === category) || {
      category,
      in_app: true,
      email: false,
      whatsapp: false,
      sms: false,
      push: false,
      enabled: true
    };
  }
};
