import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { authService } from './authService';
import { UserProfile, OrganizationInfo, Permission, UserRole } from './types';
import { sessionManager } from './session';
import { rememberMe } from './rememberMe';
import { roleCheck } from './roleCheck';
import { auditLogRepository } from '@/repositories';

interface AuthContextProps {
  currentUser: UserProfile | null;
  organization: OrganizationInfo | null;
  permissions: Permission[];
  role: UserRole | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  can: (permission: Permission) => boolean;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [organization, setOrganization] = useState<OrganizationInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getPermissionsForRole = (role: UserRole | null): Permission[] => {
    if (!role) return [];
    // SuperAdmin or CEO has all permissions
    if (role === 'SuperAdmin' || role === 'CEO') {
      return [
        'view_dashboard', 'manage_companies', 'manage_spaces', 'manage_offers',
        'manage_contracts', 'manage_reservations', 'manage_campaigns',
        'view_finance', 'manage_finance', 'view_reports', 'manage_maintenance',
        'view_competitors', 'manage_users', 'manage_settings'
      ];
    }
    if (role === 'OperationLeader') {
      return [
        'view_dashboard', 'manage_companies', 'manage_spaces', 'manage_offers',
        'manage_contracts', 'manage_reservations', 'manage_campaigns',
        'view_reports', 'manage_maintenance', 'view_competitors'
      ];
    }
    if (role === 'FinanceManager') {
      return ['view_dashboard', 'view_finance', 'manage_finance', 'view_reports', 'view_competitors'];
    }
    if (role === 'Technician') {
      return ['view_dashboard', 'manage_maintenance'];
    }
    return ['view_dashboard'];
  };

  const syncProfile = (user: UserProfile, org: OrganizationInfo) => {
    setCurrentUser(user);
    setOrganization(org);
    sessionManager.setLastActivity();
  };

  // Restore session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      // 1. Check if there's a cached mock demo session
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

      // 2. Real Supabase Session restore
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          const email = session.user.email || '';
          const role: UserRole = (session.user.user_metadata?.role as UserRole) || 'SuperAdmin';
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

    // 3. Listen to state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setOrganization(null);
        localStorage.removeItem('outdoorcore_mock_session');
        sessionManager.clearSession();
      } else if (session && session.user) {
        const email = session.user.email || '';
        const role: UserRole = (session.user.user_metadata?.role as UserRole) || 'SuperAdmin';
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
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [currentUser]);

  const login = async (email: string, password: string, remember: boolean = false) => {
    setLoading(true);
    try {
      const { user, organization: org } = await authService.signIn(email, password);
      
      // Save credentials for remember me
      if (remember) {
        rememberMe.saveCredentials(email);
      } else {
        rememberMe.clearCredentials();
      }

      // If it is mock/demo login, store session in localstorage
      if (user.id === 'usr-demo-0001' || email.includes('outdoorcore.ai')) {
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

  const can = (permission: Permission): boolean => {
    if (!currentUser) return false;
    return roleCheck.can(currentUser.role, permission);
  };

  const isAuthenticated = currentUser !== null;
  const role = currentUser ? currentUser.role : null;
  const permissions = getPermissionsForRole(role);

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
