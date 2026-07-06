import { supabase } from '@/utils/supabaseClient';
import { companies } from '@/data/companies';
import { advertisingSpaces } from '@/data/advertisingSpaces';
import { offers } from '@/data/offers';
import { contracts } from '@/data/contracts';
import { reservations, conflicts } from '@/data/reservations';
import { campaigns } from '@/data/campaigns';
import { financeData } from '@/data/finance';
import { mediaAssets } from '@/data/media';
import { tasksList } from '@/data/tasks';
import { notificationsList } from '@/data/notifications';
import { maintenanceTasks } from '@/data/maintenance';
import { competitorsList, competitorKpis } from '@/data/competitors';

// Central Repository Pattern definitions for Supabase with Demo fallback

export const companyRepository = {
  getAllSync() {
    return companies;
  },
  getByIdSync(id: string) {
    return companies.find(c => c.id === id) || companies[0];
  },
  async getAll() {
    try {
      const { data, error } = await supabase.from('companies').select('*');
      if (error || !data || data.length === 0) throw error || new Error('No data');
      return data;
    } catch {
      return companies;
    }
  },
  async getById(id: string) {
    try {
      const { data, error } = await supabase.from('companies').select('*').eq('id', id).single();
      if (error || !data) throw error;
      return data;
    } catch {
      return this.getByIdSync(id);
    }
  }
};

export const spaceRepository = {
  getAllSync() {
    return advertisingSpaces;
  },
  getByIdSync(id: string) {
    return advertisingSpaces.find(s => s.id === id || s.code === id) || advertisingSpaces[0];
  },
  async getAll() {
    try {
      const { data, error } = await supabase.from('spaces').select('*');
      if (error || !data || data.length === 0) throw error || new Error('No data');
      return data;
    } catch {
      return advertisingSpaces;
    }
  }
};

export const offerRepository = {
  getAllSync() {
    return offers;
  },
  getByIdSync(id: string) {
    return offers.find(o => o.id === id) || offers[0];
  },
  async getAll() {
    try {
      const { data, error } = await supabase.from('offers').select('*');
      if (error || !data || data.length === 0) throw error || new Error('No data');
      return data;
    } catch {
      return offers;
    }
  }
};

export const contractRepository = {
  getAllSync() {
    return contracts;
  },
  getByIdSync(id: string) {
    return contracts.find(c => c.id === id) || contracts[0];
  },
  async getAll() {
    try {
      const { data, error } = await supabase.from('contracts').select('*');
      if (error || !data || data.length === 0) throw error || new Error('No data');
      return data;
    } catch {
      return contracts;
    }
  }
};

export const reservationRepository = {
  getAllSync() {
    return reservations;
  },
  getConflictsSync() {
    return conflicts;
  },
  async getAll() {
    try {
      const { data, error } = await supabase.from('reservations').select('*');
      if (error || !data || data.length === 0) throw error || new Error('No data');
      return data;
    } catch {
      return reservations;
    }
  }
};

export const campaignRepository = {
  getAllSync() {
    return campaigns;
  },
  getByIdSync(id: string) {
    return campaigns.find(c => c.id === id) || campaigns[0];
  },
  async getAll() {
    try {
      const { data, error } = await supabase.from('campaigns').select('*');
      if (error || !data || data.length === 0) throw error || new Error('No data');
      return data;
    } catch {
      return campaigns;
    }
  }
};

export const financeRepository = {
  getFinanceDataSync() {
    return financeData;
  },
  async getAll() {
    try {
      const { data, error } = await supabase.from('finance').select('*');
      if (error || !data || data.length === 0) throw error || new Error('No data');
      return data;
    } catch {
      return financeData;
    }
  }
};

export const mediaRepository = {
  getAllSync() {
    return mediaAssets;
  },
  async getAll() {
    try {
      const { data, error } = await supabase.from('media').select('*');
      if (error || !data || data.length === 0) throw error || new Error('No data');
      return data;
    } catch {
      return mediaAssets;
    }
  }
};

export const taskRepository = {
  getAllSync() {
    return tasksList;
  },
  async getAll() {
    try {
      const { data, error } = await supabase.from('tasks').select('*');
      if (error || !data || data.length === 0) throw error || new Error('No data');
      return data;
    } catch {
      return tasksList;
    }
  }
};

export const notificationRepository = {
  getAllSync() {
    return notificationsList;
  },
  async getAll() {
    try {
      const { data, error } = await supabase.from('notifications').select('*');
      if (error || !data || data.length === 0) throw error || new Error('No data');
      return data;
    } catch {
      return notificationsList;
    }
  }
};

export const maintenanceRepository = {
  getAllSync() {
    return maintenanceTasks;
  },
  async getAll() {
    try {
      const { data, error } = await supabase.from('maintenance').select('*');
      if (error || !data || data.length === 0) throw error || new Error('No data');
      return data;
    } catch {
      return maintenanceTasks;
    }
  }
};

export const competitorRepository = {
  getAllSync() {
    return competitorsList;
  },
  getKpisSync() {
    return competitorKpis;
  },
  async getAll() {
    try {
      const { data, error } = await supabase.from('competitors').select('*');
      if (error || !data || data.length === 0) throw error || new Error('No data');
      return data;
    } catch {
      return competitorsList;
    }
  }
};

export const auditLogRepository = {
  async log(action: string, entityType: string, entityId: string) {
    try {
      await supabase.from('audit_logs').insert([{ action, entity_type: entityType, entity_id: entityId }]);
    } catch {
      console.log(`[AuditLog Mock] Action: ${action}, Entity: ${entityType}/${entityId}`);
    }
  }
};

export const activityLogRepository = {
  async log(description: string, moduleName: string) {
    try {
      await supabase.from('activity_logs').insert([{ description, module: moduleName }]);
    } catch {
      console.log(`[ActivityLog Mock] ${moduleName}: ${description}`);
    }
  }
};export const settingRepository = {
  getSync(key: string, defaultValue: string = '') {
    return defaultValue;
  },
  async get(key: string, defaultValue: string = '') {
    try {
      const { data, error } = await supabase.from('settings').select('value').eq('key', key).single();
      if (error || !data) throw error;
      return data.value;
    } catch {
      return defaultValue;
    }
  }
};
