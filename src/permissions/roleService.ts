import { supabase } from '@/utils/supabaseClient';
import { EnterpriseRoleType, PermissionKey, ROLE_PERMISSIONS_MATRIX } from './accessControl';
import { auditLogRepository } from '@/repositories';

// Simple in-memory/localStorage cache for modified roles to make demo interactive
const CUSTOM_ROLES_KEY = 'outdoorcore_custom_roles_matrix';

const getCachedMatrix = (): Record<EnterpriseRoleType, PermissionKey[]> => {
  try {
    const cached = localStorage.getItem(CUSTOM_ROLES_KEY);
    if (cached) return JSON.parse(cached);
  } catch {
    // ignore
  }
  return { ...ROLE_PERMISSIONS_MATRIX };
};

const saveCachedMatrix = (matrix: Record<EnterpriseRoleType, PermissionKey[]>) => {
  try {
    localStorage.setItem(CUSTOM_ROLES_KEY, JSON.stringify(matrix));
  } catch {
    // ignore
  }
};

export const roleService = {
  getRolesList(): { id: string; name: string; description: string; isCustom: boolean }[] {
    const matrix = getCachedMatrix();
    return Object.keys(matrix).map(roleName => {
      const isCustom = roleName !== 'Super Admin' && roleName !== 'CEO' && roleName !== 'Read Only';
      return {
        id: roleName,
        name: roleName,
        description: `${roleName} rolü yetki matris tanımı.`,
        isCustom
      };
    });
  },

  getRolePermissions(role: EnterpriseRoleType): PermissionKey[] {
    const matrix = getCachedMatrix();
    return matrix[role] || [];
  },

  async updateRolePermissions(role: EnterpriseRoleType, permissions: PermissionKey[]): Promise<void> {
    const matrix = getCachedMatrix();
    matrix[role] = permissions;
    saveCachedMatrix(matrix);

    // 1. Audit Log log
    await auditLogRepository.log('Permission Change', 'Role', `${role}: mapped ${permissions.length} items`);

    // 2. Production Supabase sync trigger (non-blocking)
    try {
      // First clean old role mappings
      await supabase.from('role_permissions').delete().eq('role_id', role);
      // Bulk insert new mappings
      const records = permissions.map(p => ({ role_id: role, permission_id: p }));
      await supabase.from('role_permissions').insert(records);
    } catch {
      // Offline fallback silent
    }
  },

  async copyRole(sourceRole: EnterpriseRoleType, newRoleName: string): Promise<void> {
    const matrix = getCachedMatrix();
    const sourcePerms = matrix[sourceRole] || [];
    
    // Add new custom role entry to cache
    (matrix as any)[newRoleName] = [...sourcePerms];
    saveCachedMatrix(matrix);

    await auditLogRepository.log('Role Copy', 'Role', `${sourceRole} copied to ${newRoleName}`);

    try {
      await supabase.from('enterprise_roles').insert([{
        id: newRoleName,
        name: newRoleName,
        description: `Copied from ${sourceRole}`,
        is_custom: true
      }]);
      const records = sourcePerms.map(p => ({ role_id: newRoleName, permission_id: p }));
      await supabase.from('role_permissions').insert(records);
    } catch {
      // Silent fallback
    }
  },

  async createRole(name: string, description: string): Promise<void> {
    const matrix = getCachedMatrix();
    (matrix as any)[name] = ['dashboard.view']; // default view permission
    saveCachedMatrix(matrix);

    await auditLogRepository.log('Role Creation', 'Role', name);

    try {
      await supabase.from('enterprise_roles').insert([{
        id: name,
        name,
        description,
        is_custom: true
      }]);
    } catch {
      // Silent
    }
  },

  async deleteRole(role: EnterpriseRoleType): Promise<void> {
    const matrix = getCachedMatrix();
    delete (matrix as any)[role];
    saveCachedMatrix(matrix);

    await auditLogRepository.log('Role Deletion', 'Role', role);

    try {
      await supabase.from('enterprise_roles').delete().eq('id', role);
    } catch {
      // Silent
    }
  }
};
