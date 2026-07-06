import { Notification } from './notificationTypes';

const NOTIFICATIONS_KEY = 'outdoorcore_notifications';

const initialSeedNotifications = (): Notification[] => {
  const now = new Date();
  const createPastDate = (hoursAgo: number) => {
    const d = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
    return d.toISOString();
  };

  return [
    {
      notificationId: 'NTF-SEED-01',
      organizationId: 'org-1',
      userId: 'usr-demo',
      title: 'Sözleşme Bitiş Uyarısı',
      message: 'Samsung Electronics sözleşmesi 30 gün içinde sona erecek.',
      type: 'warning',
      priority: 'high',
      category: 'contract',
      sourceEntityType: 'contract',
      sourceEntityId: 'CON-0001',
      relatedEntities: [],
      isRead: false,
      isArchived: false,
      channel: 'in_app',
      createdAt: createPastDate(1)
    },
    {
      notificationId: 'NTF-SEED-02',
      organizationId: 'org-1',
      userId: 'usr-demo',
      title: 'Vade Yaklaşıyor',
      message: 'Türk Hava Yolları faturası 5 gün içinde ödenecek.',
      type: 'info',
      priority: 'medium',
      category: 'finance',
      sourceEntityType: 'invoice',
      sourceEntityId: 'INV-8812',
      relatedEntities: [],
      isRead: false,
      isArchived: false,
      channel: 'in_app',
      createdAt: createPastDate(3)
    },
    {
      notificationId: 'NTF-SEED-03',
      organizationId: 'org-1',
      userId: 'usr-demo',
      title: 'Kreatif Eksik',
      message: 'Mercedes-Benz kreatif dosyaları sisteme henüz yüklenmedi.',
      type: 'danger',
      priority: 'high',
      category: 'campaign',
      sourceEntityType: 'campaign',
      sourceEntityId: 'CAM-0002',
      relatedEntities: [],
      isRead: false,
      isArchived: false,
      channel: 'in_app',
      createdAt: createPastDate(5)
    },
    {
      notificationId: 'NTF-SEED-04',
      organizationId: 'org-1',
      userId: 'usr-demo',
      title: 'Teklif Onay Bekliyor',
      message: 'Pegasus Airlines teklifi müşteri onayı bekliyor.',
      type: 'info',
      priority: 'medium',
      category: 'offer',
      sourceEntityType: 'offer',
      sourceEntityId: 'PRP-0002',
      relatedEntities: [],
      isRead: false,
      isArchived: false,
      channel: 'in_app',
      createdAt: createPastDate(8)
    },
    {
      notificationId: 'NTF-SEED-05',
      organizationId: 'org-1',
      userId: 'usr-demo',
      title: 'Bakım Tamamlandı',
      message: 'SG-021 kodlu billboard bakım işlemi başarıyla tamamlandı.',
      type: 'success',
      priority: 'low',
      category: 'maintenance',
      sourceEntityType: 'maintenance',
      sourceEntityId: 'MNT-391',
      relatedEntities: [],
      isRead: true,
      readAt: createPastDate(10),
      isArchived: false,
      channel: 'in_app',
      createdAt: createPastDate(12)
    },
    {
      notificationId: 'NTF-SEED-06',
      organizationId: 'org-1',
      userId: 'usr-demo',
      title: 'Kampanya Yayında',
      message: 'Turkcell LTE lansman kampanyası tüm dijital alanlarda yayına alındı.',
      type: 'success',
      priority: 'medium',
      category: 'campaign',
      sourceEntityType: 'campaign',
      sourceEntityId: 'CAM-0001',
      relatedEntities: [],
      isRead: true,
      readAt: createPastDate(14),
      isArchived: false,
      channel: 'in_app',
      createdAt: createPastDate(16)
    }
  ];
};

export const notificationRepository = {
  getAllSync(): Notification[] {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    const seeded = initialSeedNotifications();
    this.saveAll(seeded);
    return seeded;
  },

  saveAll(list: Notification[]) {
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list));
      window.dispatchEvent(new Event('notifications_updated'));
    } catch (e) {
      console.error(e);
    }
  },

  list(): Notification[] {
    return this.getAllSync().filter(n => !n.isArchived);
  },

  listUnread(): Notification[] {
    return this.getAllSync().filter(n => !n.isRead && !n.isArchived);
  },

  getById(id: string): Notification | undefined {
    return this.getAllSync().find(n => n.notificationId === id);
  },

  create(input: Partial<Notification>): Notification {
    const list = this.getAllSync();
    const newNotif: Notification = {
      notificationId: 'NTF-' + Math.floor(100000 + Math.random() * 900000),
      organizationId: input.organizationId || 'org-1',
      userId: input.userId || 'usr-demo',
      title: input.title || 'Bildirim',
      message: input.message || '',
      type: input.type || 'info',
      priority: input.priority || 'medium',
      category: input.category || 'system',
      sourceEntityType: input.sourceEntityType || 'system',
      sourceEntityId: input.sourceEntityId || '0',
      relatedEntities: input.relatedEntities || [],
      isRead: false,
      isArchived: false,
      actionUrl: input.actionUrl,
      actionLabel: input.actionLabel,
      channel: input.channel || 'in_app',
      createdAt: new Date().toISOString(),
      expiresAt: input.expiresAt
    };
    list.unshift(newNotif);
    this.saveAll(list);
    return newNotif;
  },

  createBulk(inputs: Partial<Notification>[]): Notification[] {
    const list = this.getAllSync();
    const created: Notification[] = [];
    for (const input of inputs) {
      const newNotif: Notification = {
        notificationId: 'NTF-' + Math.floor(100000 + Math.random() * 900000),
        organizationId: input.organizationId || 'org-1',
        userId: input.userId || 'usr-demo',
        title: input.title || 'Bildirim',
        message: input.message || '',
        type: input.type || 'info',
        priority: input.priority || 'medium',
        category: input.category || 'system',
        sourceEntityType: input.sourceEntityType || 'system',
        sourceEntityId: input.sourceEntityId || '0',
        relatedEntities: input.relatedEntities || [],
        isRead: false,
        isArchived: false,
        actionUrl: input.actionUrl,
        actionLabel: input.actionLabel,
        channel: input.channel || 'in_app',
        createdAt: new Date().toISOString(),
        expiresAt: input.expiresAt
      };
      list.unshift(newNotif);
      created.push(newNotif);
    }
    this.saveAll(list);
    return created;
  },

  markAsRead(id: string) {
    const list = this.getAllSync();
    const found = list.find(n => n.notificationId === id);
    if (found) {
      found.isRead = true;
      found.readAt = new Date().toISOString();
      this.saveAll(list);
    }
  },

  markAllAsRead() {
    const list = this.getAllSync();
    let updated = false;
    for (const n of list) {
      if (!n.isRead) {
        n.isRead = true;
        n.readAt = new Date().toISOString();
        updated = true;
      }
    }
    if (updated) {
      this.saveAll(list);
    }
  },

  archive(id: string) {
    const list = this.getAllSync();
    const found = list.find(n => n.notificationId === id);
    if (found) {
      found.isArchived = true;
      found.archivedAt = new Date().toISOString();
      this.saveAll(list);
    }
  },

  delete(id: string) {
    const list = this.getAllSync();
    const filtered = list.filter(n => n.notificationId !== id);
    if (filtered.length !== list.length) {
      this.saveAll(filtered);
    }
  }
};
