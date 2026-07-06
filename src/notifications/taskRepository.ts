import { Task } from './notificationTypes';

const TASKS_KEY = 'outdoorcore_notification_tasks';

const initialSeedTasks = (): Task[] => {
  const now = new Date();
  const formatDate = (daysFromNow: number) => {
    const d = new Date(now.getTime() + daysFromNow * 24 * 60 * 60 * 1000);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return [
    {
      taskId: 'TSK-SEED-01',
      organizationId: 'org-1',
      assignedTo: 'Ahmet Y.',
      title: 'Samsung Yenileme Görüşmesi Planla',
      description: 'Sözleşme bitimi yaklaşan Samsung Electronics ile 2026-2027 planlaması için görüşme ayarla.',
      status: 'todo',
      priority: 'high',
      dueDate: formatDate(3),
      sourceEntityType: 'contract',
      sourceEntityId: 'CON-0001',
      relatedEntities: [],
      createdBy: 'Sistem',
      createdAt: now.toISOString()
    },
    {
      taskId: 'TSK-SEED-02',
      organizationId: 'org-1',
      assignedTo: 'Ayşe K.',
      title: 'THY Tahsilat Araması Yap',
      description: 'THY vadesi yaklaşan faturası hakkında cari bilgilendirme araması yap.',
      status: 'in_progress',
      priority: 'medium',
      dueDate: formatDate(1),
      sourceEntityType: 'invoice',
      sourceEntityId: 'INV-8812',
      relatedEntities: [],
      createdBy: 'Sistem',
      createdAt: now.toISOString()
    },
    {
      taskId: 'TSK-SEED-03',
      organizationId: 'org-1',
      assignedTo: 'Mehmet S.',
      title: 'Mercedes Kreatif Dosyasını Kontrol Et',
      description: 'Mercedes-Benz kampanyası için eksik olan kreatiflerin çözünürlük doğruluğunu teyit et.',
      status: 'waiting',
      priority: 'high',
      dueDate: formatDate(0),
      sourceEntityType: 'campaign',
      sourceEntityId: 'CAM-0002',
      relatedEntities: [],
      createdBy: 'Sistem',
      createdAt: now.toISOString()
    },
    {
      taskId: 'TSK-SEED-04',
      organizationId: 'org-1',
      assignedTo: 'Ahmet Y.',
      title: 'Pegasus Teklif Revizesini Gönder',
      description: 'Pegasus Airlines için hazırlanan indirimli opsiyonel teklifi sisteme yükle ve PDF gönder.',
      status: 'todo',
      priority: 'medium',
      dueDate: formatDate(-2),
      sourceEntityType: 'offer',
      sourceEntityId: 'PRP-0002',
      relatedEntities: [],
      createdBy: 'Sistem',
      createdAt: now.toISOString()
    }
  ];
};

export const taskRepository = {
  getAllSync(): Task[] {
    try {
      const stored = localStorage.getItem(TASKS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    const seeded = initialSeedTasks();
    this.saveAll(seeded);
    return seeded;
  },

  saveAll(list: Task[]) {
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(list));
      window.dispatchEvent(new Event('tasks_updated'));
    } catch (e) {
      console.error(e);
    }
  },

  list(): Task[] {
    return this.getAllSync();
  },

  listToday(): Task[] {
    const todayStr = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.');
    return this.getAllSync().filter(t => t.dueDate === todayStr && t.status !== 'completed' && t.status !== 'cancelled');
  },

  listOverdue(): Task[] {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return this.getAllSync().filter(t => {
      if (t.status === 'completed' || t.status === 'cancelled') return false;
      const parts = t.dueDate.split('.');
      if (parts.length === 3) {
        const dDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
        return dDate < now;
      }
      return false;
    });
  },

  create(input: Partial<Task>): Task {
    const list = this.getAllSync();
    const newTask: Task = {
      taskId: 'TSK-' + Math.floor(100000 + Math.random() * 900000),
      organizationId: input.organizationId || 'org-1',
      assignedTo: input.assignedTo || 'Atanmadı',
      title: input.title || 'Görev',
      description: input.description || '',
      status: input.status || 'todo',
      priority: input.priority || 'medium',
      dueDate: input.dueDate || new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      sourceEntityType: input.sourceEntityType,
      sourceEntityId: input.sourceEntityId,
      relatedEntities: input.relatedEntities || [],
      createdBy: input.createdBy || 'Sistem',
      createdAt: new Date().toISOString()
    };
    list.unshift(newTask);
    this.saveAll(list);
    return newTask;
  },

  update(id: string, input: Partial<Task>): Task {
    const list = this.getAllSync();
    const idx = list.findIndex(t => t.taskId === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...input };
      if (input.status === 'completed') {
        list[idx].completedAt = new Date().toISOString();
      }
      this.saveAll(list);
      return list[idx];
    }
    throw new Error('Task not found');
  },

  complete(id: string) {
    this.update(id, { status: 'completed' });
  },

  assign(id: string, userId: string) {
    this.update(id, { assignedTo: userId });
  },

  archive(id: string) {
    const list = this.getAllSync().filter(t => t.taskId !== id);
    this.saveAll(list);
  }
};
