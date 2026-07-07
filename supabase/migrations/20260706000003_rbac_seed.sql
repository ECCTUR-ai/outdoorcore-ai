-- Seed default permission groups
INSERT INTO permission_groups (id, name) VALUES
  ('dashboard', 'Ana Sayfa & Panel Yetkileri'),
  ('companies', 'Firma ve Marka Yönetimi'),
  ('spaces', 'Reklam Alanları & Harita'),
  ('offers', 'Teklif Süreçleri'),
  ('contracts', 'Sözleşme & Hukuk'),
  ('campaigns', 'Kampanya & Kreatif Yönetimi'),
  ('finance', 'Finans & Fatura Yönetimi'),
  ('reports', 'Raporlama & Analiz'),
  ('media', 'Medya Kütüphanesi'),
  ('maintenance', 'Teknik Servis & Bakım'),
  ('settings', 'Sistem Ayarları'),
  ('roles', 'Rol ve Yetki Yönetimi')
ON CONFLICT (id) DO NOTHING;

-- Seed default permissions
INSERT INTO permissions (id, key, description, group_id) VALUES
  ('dashboard.view', 'dashboard.view', 'Panelleri görüntüleme yetkisi', 'dashboard'),
  ('dashboard.export', 'dashboard.export', 'Panel verilerini dışa aktarma yetkisi', 'dashboard'),
  ('companies.view', 'companies.view', 'Firmaları görüntüleme yetkisi', 'companies'),
  ('companies.create', 'companies.create', 'Yeni firma ekleme yetkisi', 'companies'),
  ('companies.update', 'companies.update', 'Firma bilgilerini güncelleme yetkisi', 'companies'),
  ('companies.delete', 'companies.delete', 'Firma silme yetkisi', 'companies'),
  ('spaces.view', 'spaces.view', 'Reklam alanlarını görüntüleme yetkisi', 'spaces'),
  ('spaces.create', 'spaces.create', 'Yeni reklam alanı ekleme yetkisi', 'spaces'),
  ('spaces.update', 'spaces.update', 'Reklam alanı güncelleme yetkisi', 'spaces'),
  ('offers.view', 'offers.view', 'Teklifleri görüntüleme yetkisi', 'offers'),
  ('offers.create', 'offers.create', 'Yeni teklif oluşturma yetkisi', 'offers'),
  ('offers.approve', 'offers.approve', 'Teklif onaylama/reddetme yetkisi', 'offers'),
  ('contracts.view', 'contracts.view', 'Sözleşmeleri görüntüleme yetkisi', 'contracts'),
  ('contracts.sign', 'contracts.sign', 'Sözleşme imzalama/onaylama yetkisi', 'contracts'),
  ('contracts.cancel', 'contracts.cancel', 'Sözleşme iptal etme yetkisi', 'contracts'),
  ('campaigns.view', 'campaigns.view', 'Kampanyaları görüntüleme yetkisi', 'campaigns'),
  ('campaigns.publish', 'campaigns.publish', 'Kampanya yayınlama yetkisi', 'campaigns'),
  ('campaigns.pause', 'campaigns.pause', 'Kampanya duraklatma yetkisi', 'campaigns'),
  ('finance.view', 'finance.view', 'Finansal ekranları görüntüleme yetkisi', 'finance'),
  ('finance.invoice.create', 'finance.invoice.create', 'Fatura kesme yetkisi', 'finance'),
  ('finance.payment.create', 'finance.payment.create', 'Tahsilat/Ödeme kaydı girme yetkisi', 'finance'),
  ('finance.export', 'finance.export', 'Finansal verileri Excel aktarma yetkisi', 'finance'),
  ('reports.view', 'reports.view', 'Raporları görüntüleme yetkisi', 'reports'),
  ('reports.export', 'reports.export', 'Raporları PDF/Excel aktarma yetkisi', 'reports'),
  ('media.upload', 'media.upload', 'Medya dosyası yükleme yetkisi', 'media'),
  ('media.delete', 'media.delete', 'Medya dosyası silme yetkisi', 'media'),
  ('maintenance.assign', 'maintenance.assign', 'Tekniker/İş emri atama yetkisi', 'maintenance'),
  ('maintenance.close', 'maintenance.close', 'Teknik iş emrini kapatma yetkisi', 'maintenance'),
  ('users.view', 'users.view', 'Kullanıcıları görüntüleme yetkisi', 'settings'),
  ('users.create', 'users.create', 'Kullanıcı davet etme yetkisi', 'settings'),
  ('users.update', 'users.update', 'Kullanıcı yetkilerini düzenleme yetkisi', 'settings'),
  ('users.delete', 'users.delete', 'Kullanıcı hesabı silme yetkisi', 'settings'),
  ('roles.manage', 'roles.manage', 'Rol ve yetki matrisini yönetme yetkisi', 'roles'),
  ('settings.manage', 'settings.manage', 'Sistem ayarlarını yönetme yetkisi', 'settings'),
  ('audit.view', 'audit.view', 'Audit log kayıtlarını görüntüleme yetkisi', 'settings'),
  ('activity.view', 'activity.view', 'Aktivite loglarını görüntüleme yetkisi', 'settings'),
  ('ai.use', 'ai.use', 'AI Copilot asistanını kullanma yetkisi', 'dashboard'),
  ('executive.view', 'executive.view', 'CEO Executive Terminali görüntüleme yetkisi', 'dashboard')
ON CONFLICT (id) DO NOTHING;

-- Seed default enterprise roles
INSERT INTO enterprise_roles (id, organization_id, name, description, is_custom, created_by) VALUES
  ('Super Admin', NULL, 'Super Admin', 'Tüm sistem ve organizasyonlar üzerinde mutlak yetkili rol.', FALSE, 'System'),
  ('CEO', NULL, 'CEO', 'Şirket genelinde tam yetkili, raporlama ve onay süreçlerini yöneten rol.', FALSE, 'System'),
  ('Sales Director', NULL, 'Sales Director', 'Satış ekibini yöneten, teklif ve sözleşme onaylama yetkili rol.', FALSE, 'System'),
  ('Sales Representative', NULL, 'Sales Representative', 'Teklif oluşturan ve firmaları yöneten satış temsilcisi rol.', FALSE, 'System'),
  ('Finance Manager', NULL, 'Finance Manager', 'Finansal akış, fatura ve tahsilat süreçlerini yöneten müdür rol.', FALSE, 'System'),
  ('Finance Staff', NULL, 'Finance Staff', 'Fatura oluşturan ve tahsilat durumlarını giren çalışan rol.', FALSE, 'System'),
  ('Marketing Manager', NULL, 'Marketing Manager', 'Kampanyaları ve yaratıcı kreatif onay süreçlerini yöneten rol.', FALSE, 'System'),
  ('Operations Manager', NULL, 'Operations Manager', 'Operasyon planlama ve rezervasyonları yöneten rol.', FALSE, 'System'),
  ('Technical Manager', NULL, 'Technical Manager', 'Teknik bakım süreçlerini ve ekip atamalarını yöneten müdür rol.', FALSE, 'System'),
  ('Technical Staff', NULL, 'Technical Staff', 'Saha teknik arızalarını gideren ve kapatan teknisyen rol.', FALSE, 'System'),
  ('Customer', NULL, 'Customer', 'Reklam veren firmaların kendi yayınlarını izlediği kısıtlı müşteri rol.', FALSE, 'System'),
  ('Read Only', NULL, 'Read Only', 'Sadece izleme/görüntüleme yetkisine sahip kısıtlı rol.', FALSE, 'System')
ON CONFLICT (id) DO NOTHING;
