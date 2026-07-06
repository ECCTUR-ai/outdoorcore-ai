import React from 'react';
import { usePermission } from '@/permissions/permissionHooks';
import { PermissionKey } from '@/permissions/accessControl';

interface PermissionGateProps {
  permission: PermissionKey;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGate({ permission, children, fallback = null }: PermissionGateProps) {
  const hasAccess = usePermission(permission);
  
  if (!hasAccess) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}
export default PermissionGate;
