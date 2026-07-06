import { Notification } from './notificationTypes';
import { activityLogRepository } from '@/repositories';

export const notificationChannels = {
  sendInApp(notif: Notification) {
    console.log(`[Notification Engine - In-App] ${notif.title}: ${notif.message}`);
  },

  async sendEmailPlaceholder(notif: Notification) {
    const desc = `[E-Posta Gönderildi] Kategori: ${notif.category}, Alıcı: user-${notif.userId}, Konu: ${notif.title}`;
    console.log(desc);
    await activityLogRepository.log(desc, 'notifications');
  },

  async sendWhatsAppPlaceholder(notif: Notification) {
    const desc = `[WhatsApp Gönderildi] Alıcı: user-${notif.userId}, Mesaj: ${notif.message}`;
    console.log(desc);
    await activityLogRepository.log(desc, 'notifications');
  },

  async sendSmsPlaceholder(notif: Notification) {
    const desc = `[SMS Gönderildi] Alıcı: user-${notif.userId}, Mesaj: ${notif.message}`;
    console.log(desc);
    await activityLogRepository.log(desc, 'notifications');
  },

  async sendPushPlaceholder(notif: Notification) {
    const desc = `[Mobil Push Gönderildi] Başlık: ${notif.title}, İçerik: ${notif.message}`;
    console.log(desc);
    await activityLogRepository.log(desc, 'notifications');
  }
};
