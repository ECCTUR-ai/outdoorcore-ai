export type Permission = 
  | 'view_dashboard'
  | 'manage_companies'
  | 'manage_spaces'
  | 'manage_offers'
  | 'manage_contracts'
  | 'manage_reservations'
  | 'manage_campaigns'
  | 'view_finance'
  | 'manage_finance'
  | 'view_reports'
  | 'manage_maintenance'
  | 'view_competitors'
  | 'manage_users'
  | 'manage_settings';

export type UserRole = 
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

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  organizationId: string;
  lastLogin?: string;
}

export interface OrganizationInfo {
  id: string;
  name: string;
  tier: 'Tier A' | 'Tier B' | 'Tier C';
  licenseStatus: 'Aktif' | 'Askıda' | 'Süresi Doldu';
  licenseExpiry: string;
}
