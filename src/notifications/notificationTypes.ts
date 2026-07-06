export interface Notification {
  notificationId: string;
  organizationId: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger' | 'system' | 'ai';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'offer' | 'contract' | 'reservation' | 'campaign' | 'finance' | 'maintenance' | 'media' | 'workflow' | 'system' | 'ai';
  sourceEntityType: string;
  sourceEntityId: string;
  relatedEntities: string[];
  isRead: boolean;
  readAt?: string;
  isArchived: boolean;
  archivedAt?: string;
  actionUrl?: string;
  actionLabel?: string;
  channel: 'in_app' | 'email' | 'whatsapp' | 'sms' | 'push';
  createdAt: string;
  expiresAt?: string;
}

export interface Task {
  taskId: string;
  organizationId: string;
  assignedTo?: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'waiting' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: string;
  sourceEntityType?: string;
  sourceEntityId?: string;
  relatedEntities?: string[];
  createdBy?: string;
  createdAt: string;
  completedAt?: string;
}

export interface NotificationPreference {
  category: Notification['category'];
  in_app: boolean;
  email: boolean;
  whatsapp: boolean;
  sms: boolean;
  push: boolean;
  enabled: boolean;
}
