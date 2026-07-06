-- Initial Migration - Init Multi-Tenant Schema for OutdoorCore AI

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Organizations (Multi-Tenant Root)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- 2. Roles
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- 3. Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- 4. Companies
CREATE TABLE IF NOT EXISTS companies (
    id VARCHAR(50) PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sector VARCHAR(100),
    city VARCHAR(100),
    crm_tier VARCHAR(10),
    total_deal_value NUMERIC(15, 2),
    logo VARCHAR(5),
    logo_url VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- 5. Spaces (Advertising Spaces)
CREATE TABLE IF NOT EXISTS spaces (
    id VARCHAR(50) PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    location VARCHAR(255),
    size VARCHAR(50),
    status VARCHAR(50),
    traffic INTEGER,
    image VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- 6. Offers
CREATE TABLE IF NOT EXISTS offers (
    id VARCHAR(50) PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    client_name VARCHAR(255) NOT NULL,
    company_id VARCHAR(50) REFERENCES companies(id) ON DELETE SET NULL,
    campaign_name VARCHAR(255),
    budget VARCHAR(50),
    value_numeric NUMERIC(15, 2),
    stage VARCHAR(50),
    probability INTEGER,
    owner VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- 7. Contracts
CREATE TABLE IF NOT EXISTS contracts (
    id VARCHAR(50) PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    contract_no VARCHAR(50) UNIQUE NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    company_id VARCHAR(50) REFERENCES companies(id) ON DELETE SET NULL,
    campaign_name VARCHAR(255),
    campaign_id VARCHAR(50),
    start_date VARCHAR(50),
    end_date VARCHAR(50),
    value NUMERIC(15, 2),
    status VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- 8. Reservations
CREATE TABLE IF NOT EXISTS reservations (
    id VARCHAR(50) PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    client_name VARCHAR(255) NOT NULL,
    company_id VARCHAR(50) REFERENCES companies(id) ON DELETE SET NULL,
    space_code VARCHAR(50) REFERENCES spaces(code) ON DELETE SET NULL,
    space_name VARCHAR(255),
    start_date VARCHAR(50),
    end_date VARCHAR(50),
    status VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- 9. Campaigns
CREATE TABLE IF NOT EXISTS campaigns (
    id VARCHAR(50) PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    client_name VARCHAR(255) NOT NULL,
    campaign_name VARCHAR(255) NOT NULL,
    status VARCHAR(50),
    start_date VARCHAR(50),
    end_date VARCHAR(50),
    budget VARCHAR(50),
    success_rate NUMERIC(5, 2),
    creatives_count INTEGER,
    ai_score NUMERIC(5, 2),
    logo VARCHAR(5),
    logo_url VARCHAR(255),
    proposal_id VARCHAR(50),
    contract_id VARCHAR(50) REFERENCES contracts(id) ON DELETE SET NULL,
    reservation_id VARCHAR(50) REFERENCES reservations(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- 10. Finance (Accounts summary)
CREATE TABLE IF NOT EXISTS finance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    company_id VARCHAR(50) REFERENCES companies(id) ON DELETE SET NULL,
    total_invoiced NUMERIC(15, 2),
    total_collected NUMERIC(15, 2),
    balance NUMERIC(15, 2),
    risk_index VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- 11. Invoices
CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(50) PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    invoice_no VARCHAR(50) UNIQUE NOT NULL,
    company_id VARCHAR(50) REFERENCES companies(id) ON DELETE SET NULL,
    client_name VARCHAR(255),
    date VARCHAR(50),
    due_date VARCHAR(50),
    amount NUMERIC(15, 2),
    status VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- 12. Payments
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(50) PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    invoice_id VARCHAR(50) REFERENCES invoices(id) ON DELETE CASCADE,
    amount NUMERIC(15, 2),
    date VARCHAR(50),
    status VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- 13. Media Assets
CREATE TABLE IF NOT EXISTS media (
    id VARCHAR(50) PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    size VARCHAR(50),
    resolution VARCHAR(50),
    version VARCHAR(20),
    status VARCHAR(50),
    company_id VARCHAR(50) REFERENCES companies(id) ON DELETE SET NULL,
    campaign_id VARCHAR(50) REFERENCES campaigns(id) ON DELETE SET NULL,
    uploaded_by VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- 14. Tasks
CREATE TABLE IF NOT EXISTS tasks (
    id VARCHAR(50) PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    task_title VARCHAR(255) NOT NULL,
    client_name VARCHAR(255),
    priority VARCHAR(20),
    due_date VARCHAR(50),
    assignee VARCHAR(255),
    module VARCHAR(50),
    status VARCHAR(50),
    company_id VARCHAR(50) REFERENCES companies(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- 15. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(50) PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    category VARCHAR(100),
    company VARCHAR(255),
    message TEXT,
    time VARCHAR(50),
    status VARCHAR(50),
    "user" VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- 16. Maintenance
CREATE TABLE IF NOT EXISTS maintenance (
    id VARCHAR(50) PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    space_id VARCHAR(50) REFERENCES spaces(id) ON DELETE SET NULL,
    space_code VARCHAR(50) REFERENCES spaces(code) ON DELETE SET NULL,
    issue TEXT NOT NULL,
    status VARCHAR(50),
    urgency VARCHAR(20),
    assigned_technician_name VARCHAR(255),
    assigned_technician_phone VARCHAR(50),
    scheduled_date VARCHAR(50),
    completion_date VARCHAR(50),
    qr_code VARCHAR(100),
    ai_risk_score INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- 17. Competitors
CREATE TABLE IF NOT EXISTS competitors (
    id VARCHAR(50) PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    logo VARCHAR(5),
    website VARCHAR(255),
    estimated_occupancy INTEGER,
    average_price VARCHAR(50),
    active_campaigns_count INTEGER,
    led_count INTEGER,
    billboard_count INTEGER,
    lightbox_count INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- 18. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    actor_email VARCHAR(255),
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100),
    entity_id VARCHAR(100),
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- 19. Activity Logs
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_email VARCHAR(255),
    description TEXT NOT NULL,
    module VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- 20. Settings
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    key VARCHAR(255) NOT NULL,
    value TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);
