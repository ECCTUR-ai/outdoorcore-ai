import { useAuth } from '@/auth/useAuth';
import { PermissionKey } from './accessControl';

export function usePermission(permission: PermissionKey): boolean {
  const { currentUser, permissions } = useAuth();
  
  if (!currentUser) return false;
  
  // Super Admin bypasses all checks
  if (currentUser.role === 'Super Admin') return true;
  
  return permissions.includes(permission as any);
}
