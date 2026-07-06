import { supabase } from '@/utils/supabaseClient';
import { PermissionKey, EnterpriseRoleType, ROLE_PERMISSIONS_MATRIX } from './accessControl';

export const permissionService = {
  // Check if a specific role has a permission key
  hasPermission(role: EnterpriseRoleType, permission: PermissionKey): boolean {
    const list = ROLE_PERMISSIONS_MATRIX[role];
    return list ? list.includes(permission) : false;
  },

  // Asynchronous DB call to verify role permissions
  async getRolePermissions(roleId: string): Promise<PermissionKey[]> {
    try {
      const { data, error } = await supabase
        .from('role_permissions')
        .select('permission_id')
        .eq('role_id', roleId);
      
      if (error || !data) throw error;
      return data.map((d: any) => d.permission_id as PermissionKey);
    } catch {
      // Fallback
      return ROLE_PERMISSIONS_MATRIX[roleId as EnterpriseRoleType] || [];
    }
  }
};
