import { UserRole, Permission } from './types';

// Map roles to list of allowed permissions
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  CEO: [
    'view_dashboard',
    'manage_companies',
    'manage_spaces',
    'manage_offers',
    'manage_contracts',
    'manage_reservations',
    'manage_campaigns',
    'view_finance',
    'manage_finance',
    'view_reports',
    'manage_maintenance',
    'view_competitors',
    'manage_users',
    'manage_settings'
  ],
  SuperAdmin: [
    'view_dashboard',
    'manage_companies',
    'manage_spaces',
    'manage_offers',
    'manage_contracts',
    'manage_reservations',
    'manage_campaigns',
    'view_finance',
    'manage_finance',
    'view_reports',
    'manage_maintenance',
    'view_competitors',
    'manage_users',
    'manage_settings'
  ],
  OperationLeader: [
    'view_dashboard',
    'manage_companies',
    'manage_spaces',
    'manage_offers',
    'manage_contracts',
    'manage_reservations',
    'manage_campaigns',
    'view_reports',
    'manage_maintenance',
    'view_competitors'
  ],
  FinanceManager: [
    'view_dashboard',
    'view_finance',
    'manage_finance',
    'view_reports',
    'view_competitors'
  ],
  Technician: [
    'view_dashboard',
    'manage_maintenance'
  ],
  Guest: [
    'view_dashboard',
    'view_reports'
  ]
};

export const roleCheck = {
  can(role: UserRole, permission: Permission): boolean {
    const list = ROLE_PERMISSIONS[role];
    return list ? list.includes(permission) : false;
  },

  hasRole(currentRole: UserRole, requiredRoles: UserRole[]): boolean {
    return requiredRoles.includes(currentRole);
  },

  isSuperAdmin(role: UserRole): boolean {
    return role === 'SuperAdmin';
  },

  isOrganizationAdmin(role: UserRole): boolean {
    return role === 'SuperAdmin' || role === 'CEO';
  },

  isCEO(role: UserRole): boolean {
    return role === 'CEO';
  }
};
export default roleCheck;
