import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { authService } from './authService';
import { UserProfile, OrganizationInfo, UserRole } from './types';
import { sessionManager } from './session';
import { rememberMe } from './rememberMe';
import { roleService } from '@/permissions/roleService';
import { PermissionKey, EnterpriseRoleType } from '@/permissions/accessControl';
import { auditLogRepository } from '@/repositories';

interface AuthContextProps {
  currentUser: UserProfile | null;
  organization: OrganizationInfo | null;
  permissions: PermissionKey[];
  role: UserRole | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  can: (permission: PermissionKey) => boolean;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [organization, setOrganization] = useState<OrganizationInfo | null>(null);
  const [permissions, setPermissions] = useState<PermissionKey[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const syncProfile = (user: UserProfile, org: OrganizationInfo) => {
    setCurrentUser(user);
    setOrganization(org);
    
    // Resolve permissions dynamically from roleService Matrix (cached/live)
    const perms = roleService.getRolePermissions(user.role as EnterpriseRoleType);
    setPermissions(perms);
    
    sessionManager.setLastActivity();
  };

  // Restore session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const cachedSession = localStorage.getItem('outdoorcore_mock_session');
      if (cachedSession) {
        try {
          const { user, org } = JSON.parse(cachedSession);
          if (!sessionManager.isExpired()) {
            syncProfile(user, org);
            setLoading(false);
            return;
          } else {
            localStorage.removeItem('outdoorcore_mock_session');
            sessionManager.clearSession();
          }
        } catch {
          // ignore
        }
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          const email = session.user.email || '';
          const role: UserRole = (session.user.user_metadata?.role as UserRole) || 'Super Admin';
          const name = session.user.user_metadata?.name || email.split('@')[0];
          
          syncProfile(
            {
              id: session.user.id,
              email,
              name,
              role,
              organizationId: session.user.user_metadata?.organizationId || 'org-prod-0001',
              lastLogin: new Date().toLocaleString()
            },
            {
              id: session.user.user_metadata?.organizationId || 'org-prod-0001',
              name: session.user.user_metadata?.organizationName || 'OutdoorCore Client Org',
              tier: 'Tier A',
              licenseStatus: 'Aktif',
              licenseExpiry: '31.12.2026'
            }
          );
        }
      } catch (e) {
        console.error('Session restore error:', e);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setOrganization(null);
        setPermissions([]);
        localStorage.removeItem('outdoorcore_mock_session');
        sessionManager.clearSession();
      } else if (session && session.user) {
        const email = session.user.email || '';
        const role: UserRole = (session.user.user_metadata?.role as UserRole) || 'Super Admin';
        const name = session.user.user_metadata?.name || email.split('@')[0];

        syncProfile(
          {
            id: session.user.id,
            email,
            name,
            role,
            organizationId: session.user.user_metadata?.organizationId || 'org-prod-0001',
            lastLogin: new Date().toLocaleString()
          },
          {
            id: session.user.user_metadata?.organizationId || 'org-prod-0001',
            name: session.user.user_metadata?.organizationName || 'OutdoorCore Client Org',
            tier: 'Tier A',
            licenseStatus: 'Aktif',
            licenseExpiry: '31.12.2026'
          }
        );
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Monitor activity for auto-timeout checks
  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(() => {
      if (sessionManager.isExpired()) {
        console.warn('Session expired due to inactivity');
        logout();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const login = async (email: string, password: string, remember: boolean = false) => {
    setLoading(true);
    try {
      const { user, organization: org } = await authService.signIn(email, password);
      
      if (remember) {
        rememberMe.saveCredentials(email);
      } else {
        rememberMe.clearCredentials();
      }

      if (email.includes('outdoorcore.ai') || email.includes('admin')) {
        localStorage.setItem('outdoorcore_mock_session', JSON.stringify({ user, org }));
      }

      syncProfile(user, org);
      await auditLogRepository.log('Login Success', 'User', user.id);
    } catch (e: any) {
      await auditLogRepository.log('Login Failed', 'Attempt', email);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (currentUser) {
        await auditLogRepository.log('Logout', 'User', currentUser.id);
      }
      await authService.signOut();
      setCurrentUser(null);
      setOrganization(null);
      setPermissions([]);
      localStorage.removeItem('outdoorcore_mock_session');
      sessionManager.clearSession();
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    sessionManager.setLastActivity();
    if (currentUser) {
      await auditLogRepository.log('Session Refresh', 'User', currentUser.id);
    }
  };

  const can = (permission: PermissionKey): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'Super Admin') return true;
    return permissions.includes(permission);
  };

  const isAuthenticated = currentUser !== null;
  const role = currentUser ? (currentUser.role as UserRole) : null;

  return (
    <AuthContext.Provider value={{
      currentUser,
      organization,
      permissions,
      role,
      loading,
      isAuthenticated,
      login,
      logout,
      refreshSession,
      can
    }}>
      {children}
    </AuthContext.Provider>
  );
}
export default AuthProvider;
