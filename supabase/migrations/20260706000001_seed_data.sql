-- Seed Initial Mock/Demo Data for OutdoorCore AI

-- 1. Insert default organization
INSERT INTO organizations (id, name, created_by)
VALUES ('00000000-0000-0000-0000-000000000001', 'OutdoorCore Global Organization', 'System')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert default roles
INSERT INTO roles (id, organization_id, name, created_by)
VALUES 
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'Yönetici (CEO)', 'System'),
  ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000001', 'Operasyon Lideri', 'System'),
  ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000001', 'Finans Müdürü', 'System')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert default users
INSERT INTO users (id, organization_id, email, name, role_id, created_by)
VALUES 
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'cemil@outdoorcore.ai', 'Cemil Sezgin', '00000000-0000-0000-0000-000000000011', 'System')
ON CONFLICT (id) DO NOTHING;

-- 4. Insert companies
INSERT INTO companies (id, organization_id, name, sector, city, crm_tier, total_deal_value, logo, logo_url, created_by)
VALUES 
  ('CMP-0001', '00000000-0000-0000-0000-000000000001', 'Türk Hava Yolları', 'Havacılık', 'İstanbul', 'Tier A', 245000000.00, 'T', '/logos/thy.svg', 'System'),
  ('CMP-0002', '00000000-0000-0000-0000-000000000001', 'Turkcell', 'Telekomünikasyon', 'İstanbul', 'Tier A', 186000000.00, 'T', '/logos/turkcell.svg', 'System'),
  ('CMP-0003', '00000000-0000-0000-0000-000000000001', 'Samsung Electronics', 'Teknoloji', 'İstanbul', 'Tier B', 94000000.00, 'S', '/logos/samsung.svg', 'System')
ON CONFLICT (id) DO NOTHING;

-- 5. Insert spaces
INSERT INTO spaces (id, organization_id, code, name, type, location, size, status, traffic, image, created_by)
VALUES 
  ('SPC-0001', '00000000-0000-0000-0000-000000000001', 'SG-001', 'Giriş LED Ekran', 'LED', 'Terminal Ana Giriş', '6x4m', 'Dolu', 120000, '/images/led-main.jpg', 'System'),
  ('SPC-0002', '00000000-0000-0000-0000-000000000001', 'SG-021', 'Check-in Önü LED', 'LED', 'Check-in Kontuarı Karşısı', '4x3m', 'Dolu', 85000, '/images/checkin-led.jpg', 'System'),
  ('SPC-0003', '00000000-0000-0000-0000-000000000001', 'SG-045', 'Duty Free Yanı LED', 'LED', 'Dış Hatlar Duty Free', '5x3m', 'Boş', 98000, NULL, 'System')
ON CONFLICT (id) DO NOTHING;

-- 6. Insert offers
INSERT INTO offers (id, organization_id, client_name, company_id, campaign_name, budget, value_numeric, stage, probability, owner, created_by)
VALUES 
  ('OFF-0001', '00000000-0000-0000-0000-000000000001', 'Türk Hava Yolları', 'CMP-0001', 'Yaz Kampanyası', '₺42.5M', 42500000.00, 'Teklif Hazırlandı', 85, 'Mehmet Can', 'System'),
  ('OFF-0002', '00000000-0000-0000-0000-000000000001', 'Samsung Electronics', 'CMP-0003', 'Galaxy S25 Tanıtımı', '₺18.2M', 18200000.00, 'Pazarlık', 70, 'Selin Yılmaz', 'System')
ON CONFLICT (id) DO NOTHING;

-- 7. Insert contracts
INSERT INTO contracts (id, organization_id, contract_no, client_name, company_id, campaign_name, campaign_id, start_date, end_date, value, status, created_by)
VALUES 
  ('CON-0001', '00000000-0000-0000-0000-000000000001', 'OC-2025-001', 'Türk Hava Yolları', 'CMP-0001', 'Yaz Kampanyası', 'CAM-0001', '01 Haz 2025', '31 Ağu 2025', 125000000.00, 'Aktif', 'System'),
  ('CON-0002', '00000000-0000-0000-0000-000000000001', 'OC-2025-042', 'Turkcell', 'CMP-0002', 'Süper Lig Sponsorluğu', 'CAM-0002', '01 Haz 2025', '31 Eyl 2025', 85000000.00, 'Onaylandı', 'System')
ON CONFLICT (id) DO NOTHING;

-- 8. Insert reservations
INSERT INTO reservations (id, organization_id, client_name, company_id, space_code, space_name, start_date, end_date, status, created_by)
VALUES 
  ('RSV-0001', '00000000-0000-0000-0000-000000000001', 'Türk Hava Yolları', 'CMP-0001', 'SG-001', 'Giriş LED Ekran', '01 Haz 2025', '31 Ağu 2025', 'Onaylandı', 'System')
ON CONFLICT (id) DO NOTHING;
