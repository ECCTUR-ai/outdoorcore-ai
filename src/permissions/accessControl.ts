export type PermissionKey = 
  | 'dashboard.view'
  | 'dashboard.export'
  | 'companies.view'
  | 'companies.create'
  | 'companies.update'
  | 'companies.delete'
  | 'spaces.view'
  | 'spaces.create'
  | 'spaces.update'
  | 'spaces.delete'
  | 'offers.view'
  | 'offers.create'
  | 'offers.update'
  | 'offers.delete'
  | 'offers.approve'
  | 'contracts.view'
  | 'contracts.sign'
  | 'contracts.cancel'
  | 'campaigns.view'
  | 'campaigns.publish'
  | 'campaigns.pause'
  | 'finance.view'
  | 'finance.invoice.create'
  | 'finance.payment.create'
  | 'finance.export'
  | 'reports.view'
  | 'reports.export'
  | 'media.upload'
  | 'media.delete'
  | 'maintenance.assign'
  | 'maintenance.close'
  | 'users.view'
  | 'users.create'
  | 'users.update'
  | 'users.delete'
  | 'roles.manage'
  | 'settings.manage'
  | 'audit.view'
  | 'activity.view'
  | 'ai.use'
  | 'executive.view'
  | 'notifications.view'
  | 'notifications.manage'
  | 'tasks.view'
  | 'tasks.create'
  | 'tasks.assign'
  | 'tasks.complete'
  | 'calendar.view'
  | 'calendar.create'
  | 'calendar.update'
  | 'calendar.delete'
  | 'calendar.export'
  | 'reservations.create'
  | 'reservations.approve'
  | 'reservations.confirm';

export type EnterpriseRoleType = 
  | 'Super Admin'
  | 'CEO'
  | 'Sales Director'
  | 'Sales Representative'
  | 'Finance Manager'
  | 'Finance Staff'
  | 'Marketing Manager'
  | 'Operations Manager'
  | 'Technical Manager'
  | 'Technical Staff'
  | 'Customer'
  | 'Read Only';

// Static Matrix mapping roles to their allowed permissions list
export const ROLE_PERMISSIONS_MATRIX: Record<EnterpriseRoleType, PermissionKey[]> = {
  'Super Admin': [
    'dashboard.view', 'dashboard.export', 'companies.view', 'companies.create', 'companies.update', 'companies.delete',
    'spaces.view', 'spaces.create', 'spaces.update', 'spaces.delete', 'offers.view', 'offers.create', 'offers.update', 'offers.delete', 'offers.approve',
    'contracts.view', 'contracts.sign', 'contracts.cancel', 'campaigns.view', 'campaigns.publish', 'campaigns.pause',
    'finance.view', 'finance.invoice.create', 'finance.payment.create', 'finance.export', 'reports.view', 'reports.export',
    'media.upload', 'media.delete', 'maintenance.assign', 'maintenance.close', 'users.view', 'users.create',
    'users.update', 'users.delete', 'roles.manage', 'settings.manage', 'audit.view', 'activity.view', 'ai.use', 'executive.view',
    'notifications.view', 'notifications.manage', 'tasks.view', 'tasks.create', 'tasks.assign', 'tasks.complete',
    'calendar.view', 'calendar.create', 'calendar.update', 'calendar.delete', 'calendar.export',
    'reservations.create', 'reservations.approve', 'reservations.confirm'
  ],
  'CEO': [
    'dashboard.view', 'dashboard.export', 'companies.view', 'companies.create', 'companies.update', 'companies.delete',
    'spaces.view', 'spaces.create', 'spaces.update', 'spaces.delete', 'offers.view', 'offers.create', 'offers.update', 'offers.delete', 'offers.approve',
    'contracts.view', 'contracts.sign', 'contracts.cancel', 'campaigns.view', 'campaigns.publish',
    'finance.view', 'finance.invoice.create', 'finance.export', 'reports.view', 'reports.export',
    'media.upload', 'maintenance.close', 'users.view', 'users.create', 'roles.manage', 'settings.manage',
    'audit.view', 'activity.view', 'ai.use', 'executive.view',
    'notifications.view', 'notifications.manage', 'tasks.view', 'tasks.create', 'tasks.assign', 'tasks.complete',
    'calendar.view', 'calendar.create', 'calendar.update', 'calendar.delete', 'calendar.export',
    'reservations.create', 'reservations.approve', 'reservations.confirm'
  ],
  'Sales Director': [
    'dashboard.view', 'dashboard.export', 'companies.view', 'companies.create', 'companies.update',
    'spaces.view', 'offers.view', 'offers.create', 'offers.update', 'offers.delete', 'offers.approve',
    'contracts.view', 'contracts.sign', 'campaigns.view', 'media.upload',
    'reports.view', 'reports.export', 'ai.use', 'notifications.view', 'tasks.view', 'tasks.create', 'tasks.assign', 'tasks.complete',
    'calendar.view', 'calendar.create', 'calendar.update', 'calendar.export',
    'reservations.create', 'reservations.approve', 'reservations.confirm'
  ],
  'Sales Representative': [
    'dashboard.view', 'companies.view', 'companies.create',
    'spaces.view', 'offers.view', 'offers.create', 'offers.update',
    'contracts.view', 'campaigns.view', 'media.upload', 'ai.use', 'notifications.view', 'tasks.view',
    'calendar.view', 'calendar.create', 'calendar.update',
    'reservations.create'
  ],
  'Finance Manager': [
    'dashboard.view', 'dashboard.export', 'companies.view', 'contracts.view',
    'finance.view', 'finance.invoice.create', 'finance.payment.create', 'finance.export',
    'reports.view', 'reports.export', 'ai.use',
    'calendar.view', 'calendar.export'
  ],
  'Finance Staff': [
    'dashboard.view', 'companies.view',
    'finance.view', 'finance.invoice.create', 'finance.payment.create',
    'calendar.view'
  ],
  'Marketing Manager': [
    'dashboard.view', 'companies.view', 'campaigns.view', 'campaigns.publish', 'campaigns.pause',
    'media.upload', 'media.delete', 'reports.view', 'ai.use',
    'calendar.view', 'calendar.export'
  ],
  'Operations Manager': [
    'dashboard.view', 'companies.view', 'spaces.view', 'spaces.create', 'spaces.update', 'spaces.delete',
    'campaigns.view', 'media.upload', 'ai.use',
    'calendar.view', 'calendar.create', 'calendar.update', 'calendar.delete'
  ],
  'Technical Manager': [
    'dashboard.view', 'spaces.view', 'maintenance.assign', 'maintenance.close',
    'reports.view', 'ai.use',
    'calendar.view', 'calendar.create', 'calendar.update'
  ],
  'Technical Staff': [
    'dashboard.view', 'maintenance.close',
    'calendar.view'
  ],
  'Customer': [
    'dashboard.view', 'companies.view', 'contracts.view', 'campaigns.view',
    'calendar.view'
  ],
  'Read Only': [
    'dashboard.view', 'companies.view', 'spaces.view', 'offers.view', 'contracts.view', 'campaigns.view', 'finance.view', 'reports.view',
    'calendar.view'
  ]
};

export const ALL_PERMISSIONS_LIST: { key: PermissionKey; name: string; group: string }[] = [
  { key: 'dashboard.view', name: 'Paneli Görüntüle', group: 'Dashboard' },
  { key: 'dashboard.export', name: 'Veri Aktar', group: 'Dashboard' },
  { key: 'companies.view', name: 'Firmaları Listele', group: 'Companies' },
  { key: 'companies.create', name: 'Firma Ekle', group: 'Companies' },
  { key: 'companies.update', name: 'Firma Düzenle', group: 'Companies' },
  { key: 'companies.delete', name: 'Firma Sil', group: 'Companies' },
  { key: 'spaces.view', name: 'Envanter Görüntüle', group: 'Spaces' },
  { key: 'spaces.create', name: 'Ünite Ekle', group: 'Spaces' },
  { key: 'spaces.update', name: 'Ünite Düzenle', group: 'Spaces' },
  { key: 'spaces.delete', name: 'Ünite Sil', group: 'Spaces' },
  { key: 'offers.view', name: 'Teklifleri Listele', group: 'Offers' },
  { key: 'offers.create', name: 'Teklif Oluştur', group: 'Offers' },
  { key: 'offers.update', name: 'Teklif Düzenle', group: 'Offers' },
  { key: 'offers.delete', name: 'Teklif Sil', group: 'Offers' },
  { key: 'offers.approve', name: 'Teklif Karara Bağla', group: 'Offers' },
  { key: 'contracts.view', name: 'Kontratları Gör', group: 'Contracts' },
  { key: 'contracts.sign', name: 'Kontrat Onayla', group: 'Contracts' },
  { key: 'contracts.cancel', name: 'Kontrat İptal Et', group: 'Contracts' },
  { key: 'campaigns.view', name: 'Yayınları Gör', group: 'Campaigns' },
  { key: 'campaigns.publish', name: 'Yayın Başlat', group: 'Campaigns' },
  { key: 'campaigns.pause', name: 'Yayın Durdur', group: 'Campaigns' },
  { key: 'finance.view', name: 'Ciro & Cari Gör', group: 'Finance' },
  { key: 'finance.invoice.create', name: 'Fatura Düzenle', group: 'Finance' },
  { key: 'finance.payment.create', name: 'Tahsilat Ekle', group: 'Finance' },
  { key: 'finance.export', name: 'Mali Veri Dışa Aktar', group: 'Finance' },
  { key: 'reports.view', name: 'Raporları Aç', group: 'Reports' },
  { key: 'reports.export', name: 'Rapor PDF İndir', group: 'Reports' },
  { key: 'media.upload', name: 'Medya Yükle', group: 'Media' },
  { key: 'media.delete', name: 'Medya Sil', group: 'Media' },
  { key: 'maintenance.assign', name: 'İş Emri Ata', group: 'Maintenance' },
  { key: 'maintenance.close', name: 'İş Emri Kapat', group: 'Maintenance' },
  { key: 'users.view', name: 'Kullanıcıları Gör', group: 'Users' },
  { key: 'users.create', name: 'Kullanıcı Ekle', group: 'Users' },
  { key: 'users.update', name: 'Kullanıcı Güncelle', group: 'Users' },
  { key: 'users.delete', name: 'Kullanıcı Sil', group: 'Users' },
  { key: 'roles.manage', name: 'Rol ve Yetki Düzenle', group: 'Roles' },
  { key: 'settings.manage', name: 'Sistem Ayarları Değiştir', group: 'Settings' },
  { key: 'audit.view', name: 'Audit Log Görüntüle', group: 'Settings' },
  { key: 'activity.view', name: 'Aktivite Log Listele', group: 'Settings' },
  { key: 'ai.use', name: 'AI Copilot Kullan', group: 'AI' },
  { key: 'executive.view', name: 'Executive Dashboard Aç', group: 'Dashboard' },
  { key: 'notifications.view', name: 'Bildirimleri Görüntüle', group: 'Notifications' },
  { key: 'notifications.manage', name: 'Bildirim Tercihlerini Yönet', group: 'Notifications' },
  { key: 'tasks.view', name: 'Görevleri Listele', group: 'Tasks' },
  { key: 'tasks.create', name: 'Görev Ekle', group: 'Tasks' },
  { key: 'tasks.assign', name: 'Görev Sorumlusu Ata', group: 'Tasks' },
  { key: 'tasks.complete', name: 'Görevi Tamamla', group: 'Tasks' },
  { key: 'calendar.view', name: 'Takvimi Gör', group: 'Calendar' },
  { key: 'calendar.create', name: 'Planlama Eylemi Ekle', group: 'Calendar' },
  { key: 'calendar.update', name: 'Planlama Eylemi Güncelle', group: 'Calendar' },
  { key: 'calendar.delete', name: 'Planlama Eylemi Kaldır', group: 'Calendar' },
  { key: 'calendar.export', name: 'Takvimi Dışa Aktar', group: 'Calendar' },
  { key: 'reservations.create', name: 'Rezervasyon Oluştur', group: 'Reservations' },
  { key: 'reservations.approve', name: 'Satış Onayı Ver', group: 'Reservations' },
  { key: 'reservations.confirm', name: 'Kesin Satış Onayla (Confirme)', group: 'Reservations' }
];
