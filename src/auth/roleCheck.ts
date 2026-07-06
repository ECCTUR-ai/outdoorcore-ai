import { UserRole } from './types';

export const roleCheck = {
  isSuperAdmin(role: UserRole): boolean {
    return role === 'Super Admin';
  },

  isOrganizationAdmin(role: UserRole): boolean {
    return role === 'Super Admin' || role === 'CEO';
  },

  isCEO(role: UserRole): boolean {
    return role === 'CEO';
  }
};
export default roleCheck;
