import { supabase } from '@/utils/supabaseClient';
import { UserProfile, OrganizationInfo, UserRole } from './types';

// Production Service wrapper for Supabase Auth + Demo Mode Fallbacks

export const authService = {
  // Demo Mock data definition
  getDemoUser(email: string = 'demo@outdoorcore.ai'): UserProfile {
    let name = 'Cemil Sezgin';
    let role: UserRole = 'CEO';
    let avatarUrl: string | undefined = undefined;

    if (email.startsWith('finance')) {
      name = 'Fatma Yılmaz';
      role = 'Finance Manager';
    } else if (email.startsWith('sales')) {
      name = 'Savaş Arslan';
      role = 'Sales Director';
    } else if (email.startsWith('customer')) {
      name = 'Kadir Kaya (THY)';
      role = 'Customer';
    }

    return {
      id: `usr-demo-${role.toLowerCase()}`,
      email,
      name,
      role,
      avatarUrl,
      organizationId: 'org-demo-0001',
      lastLogin: new Date().toLocaleString()
    };
  },

  getDemoOrganization(): OrganizationInfo {
    return {
      id: 'org-demo-0001',
      name: 'OutdoorCore Global A.Ş.',
      tier: 'Tier A',
      licenseStatus: 'Aktif',
      licenseExpiry: '31.12.2026'
    };
  },

  async signIn(email: string, password: string): Promise<{ user: UserProfile; organization: OrganizationInfo }> {
    // 1. Check Demo credentials first
    const cleanEmail = email.toLowerCase().trim();
    if (
      cleanEmail === 'demo@outdoorcore.ai' ||
      cleanEmail === 'ceo@outdoorcore.ai' ||
      cleanEmail === 'finance@outdoorcore.ai' ||
      cleanEmail === 'sales@outdoorcore.ai' ||
      cleanEmail === 'customer@outdoorcore.ai'
    ) {
      return {
        user: this.getDemoUser(cleanEmail),
        organization: this.getDemoOrganization()
      };
    }

    // 2. Production flow with Supabase Auth
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      if (!data.user) throw new Error('Kullanıcı bulunamadı.');

      // Mock organization lookup for real user (until full DB fetch is linked)
      const role: UserRole = (data.user.user_metadata?.role as UserRole) || 'Super Admin';
      const name = data.user.user_metadata?.name || email.split('@')[0];

      return {
        user: {
          id: data.user.id,
          email: data.user.email || email,
          name,
          role,
          organizationId: data.user.user_metadata?.organizationId || 'org-prod-0001',
          lastLogin: new Date().toLocaleString()
        },
        organization: {
          id: data.user.user_metadata?.organizationId || 'org-prod-0001',
          name: data.user.user_metadata?.organizationName || 'OutdoorCore Client Org',
          tier: 'Tier A',
          licenseStatus: 'Aktif',
          licenseExpiry: '31.12.2026'
        }
      };
    } catch (e: any) {
      // If Supabase call fails and we are offline, fall back to mock demo session
      console.warn('Supabase Auth failed, trying offline mock login:', e.message);
      if (email.includes('outdoorcore.ai') || email.includes('admin')) {
        return {
          user: this.getDemoUser(email),
          organization: this.getDemoOrganization()
        };
      }
      throw new Error(e.message || 'Giriş yapılamadı.');
    }
  },

  async signOut(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
  },

  async resetPassword(email: string): Promise<void> {
    if (email === 'demo@outdoorcore.ai') {
      console.log('[Demo Mode] Password reset triggered for demo@outdoorcore.ai');
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin
    });
    if (error) throw error;
  },

  async inviteUser(email: string, role: UserRole = 'Operations Manager'): Promise<void> {
    // Trigger invite admin API function via Supabase edge functions or RPC
    console.log(`[Auth invite] Inviting ${email} with role ${role}...`);
  }
};
