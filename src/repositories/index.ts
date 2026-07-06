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

// ----------------------------------------------------
// PERSISTENCE AND CONTEXT HELPERS FOR FALLBACK DEMO
// ----------------------------------------------------

const isSupabaseConfigured = (): boolean => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return !!(url && key && url !== 'https://placeholder.supabase.co' && key !== 'placeholder-key');
};

const getSessionInfo = () => {
  try {
    const cached = localStorage.getItem('outdoorcore_mock_session');
    if (cached) {
      const { user, org } = JSON.parse(cached);
      return {
        email: user?.email || 'demo@outdoorcore.ai',
        organizationId: org?.id || '00000000-0000-0000-0000-000000000001',
      };
    }
  } catch (e) {
    // Ignore
  }
  return {
    email: 'demo@outdoorcore.ai',
    organizationId: '00000000-0000-0000-0000-000000000001',
  };
};

const getLocalData = <T>(key: string, initialData: T[]): T[] => {
  try {
    const stored = localStorage.getItem(`outdoorcore_mock_${key}`);
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem(`outdoorcore_mock_${key}`, JSON.stringify(initialData));
  } catch (e) {
    console.error(`Error reading mock data for ${key}:`, e);
  }
  return initialData;
};

const setLocalData = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(`outdoorcore_mock_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error(`Error writing mock data for ${key}:`, e);
  }
};

const generateId = (prefix: string, list: { id: string }[]): string => {
  const nums = list
    .map(item => parseInt(item.id.replace(prefix + '-', ''), 10))
    .filter(n => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  const next = max + 1;
  return `${prefix}-${String(next).padStart(4, '0')}`;
};

// ----------------------------------------------------
// AUDIT & ACTIVITY LOG REPOSITORIES (HOISTED FOR USE)
// ----------------------------------------------------

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
};

// ----------------------------------------------------
// MAPPINGS FOR COMPANIES, SPACES, AND OFFERS
// ----------------------------------------------------

const mapDbCompanyToUi = (db: any): any => {
  return {
    id: db.id,
    name: db.name,
    sector: db.sector || '-',
    city: db.city || '-',
    status: db.crm_tier === 'Lead' ? 'Pasif' : 'Aktif',
    campaignsCount: 0,
    totalSpend: db.total_deal_value ? `₺${db.total_deal_value.toLocaleString('tr-TR')}` : '₺0',
    activeSpacesCount: 0,
    lastCampaign: '-',
    upcomingCampaign: '-',
    aiScore: 8.5,
    logo: db.logo || db.name.charAt(0).toUpperCase(),
    logoUrl: db.logo_url || undefined,
    headquarters: db.city ? `${db.city} (Merkez)` : '-',
    website: db.website || '',
    phone: db.phone || '',
    email: db.email || '',
    taxNo: db.tax_no || '',
    taxOffice: db.tax_office || '',
    crmStatus: db.crm_tier || 'Lead',
    mediaAgency: db.media_agency || '-',
    creativeAgency: db.creative_agency || '-',
    budget: db.total_deal_value ? `₺${db.total_deal_value.toLocaleString('tr-TR')}` : '₺0',
    brands: Array.isArray(db.brands) ? db.brands : [],
    campaignList: [],
    spacesList: [],
    offersList: [],
    contractsList: [],
    filesList: [],
    notesList: db.notes ? [db.notes] : [],
    contacts: Array.isArray(db.contacts) ? db.contacts : [],
    deleted_at: db.deleted_at,
    deleted_by: db.deleted_by
  };
};

const mapUiCompanyToDb = (id: string, organizationId: string, email: string, ui: any): any => {
  return {
    id: id,
    organization_id: organizationId,
    name: ui.name,
    sector: ui.sector,
    city: ui.city,
    crm_tier: ui.crmStatus,
    logo: ui.logo || ui.name.charAt(0).toUpperCase(),
    logo_url: ui.logoUrl || null,
    website: ui.website || null,
    phone: ui.phone || null,
    email: ui.email || null,
    tax_no: ui.taxNo || null,
    tax_office: ui.taxOffice || null,
    media_agency: ui.mediaAgency || null,
    creative_agency: ui.creativeAgency || null,
    notes: ui.notes || null,
    contacts: ui.contacts || [],
    brands: ui.brands || [],
    updated_at: new Date().toISOString(),
    updated_by: email
  };
};

const mapDbSpaceToUi = (db: any): any => {
  return {
    id: db.id,
    code: db.code,
    name: db.name,
    location: db.location || '-',
    type: db.type || 'LED',
    size: db.size || '-',
    traffic: db.traffic || 0,
    status: db.status || 'bos',
    client: '-',
    price: db.price || '₺0',
    visibility: db.visibility || 'Yüksek',
    resolution: db.resolution || '-',
    pitch: db.pitch || '-',
    workingHours: db.working_hours || '-',
    audio: db.audio || 'Yok',
    power: db.power || '-',
    fileFormat: db.file_format || '-',
    maxFileSize: db.max_file_size || '-',
    updateInterval: db.update_interval || '-',
    image: db.image || '',
    notes: db.notes || '',
    deleted_at: db.deleted_at,
    deleted_by: db.deleted_by,
    terminal: db.terminal || '',
    floor: db.floor || ''
  };
};

const mapUiSpaceToDb = (id: string, organizationId: string, email: string, ui: any): any => {
  return {
    id: id,
    organization_id: organizationId,
    code: ui.code,
    name: ui.name,
    type: ui.type,
    location: ui.location,
    size: ui.size,
    status: ui.status,
    traffic: ui.traffic ? parseInt(ui.traffic, 10) : 0,
    image: ui.image || null,
    terminal: ui.terminal || null,
    floor: ui.floor || null,
    price: ui.price || null,
    visibility: ui.visibility || null,
    notes: ui.notes || null,
    resolution: ui.resolution || null,
    pitch: ui.pitch || null,
    working_hours: ui.workingHours || null,
    audio: ui.audio || null,
    power: ui.power || null,
    file_format: ui.fileFormat || null,
    max_file_size: ui.maxFileSize || null,
    update_interval: ui.updateInterval || null,
    updated_at: new Date().toISOString(),
    updated_by: email
  };
};

const mapDbOfferToUi = (db: any): any => {
  return {
    id: db.id,
    clientName: db.client_name,
    campaignName: db.campaign_name || '',
    value: db.budget || '₺0',
    valueNumeric: db.value_numeric ? parseFloat(db.value_numeric) : 0,
    spacesList: Array.isArray(db.spaces_list) ? db.spaces_list : [],
    owner: db.owner || '-',
    lastActivity: 'Teklif detayları güncellendi',
    closeProbability: db.probability || 50,
    stage: db.stage || 'Lead',
    closingDate: db.closing_date || '',
    details: db.details || '',
    priority: (db.probability && db.probability >= 80) ? 'Yüksek' : (db.probability && db.probability >= 50) ? 'Orta' : 'Düşük',
    companyId: db.company_id || undefined,
    spaceIds: [],
    notes: db.notes || '',
    deleted_at: db.deleted_at,
    deleted_by: db.deleted_by
  };
};

const mapUiOfferToDb = (id: string, organizationId: string, email: string, ui: any): any => {
  return {
    id: id,
    organization_id: organizationId,
    client_name: ui.clientName || 'Bilinmeyen Firma',
    company_id: ui.companyId || null,
    campaign_name: ui.campaignName || null,
    budget: ui.value || null,
    value_numeric: ui.valueNumeric || 0,
    stage: ui.stage || 'Lead',
    probability: ui.closeProbability || 50,
    owner: ui.owner || '-',
    notes: ui.notes || null,
    closing_date: ui.closingDate || null,
    spaces_list: ui.spacesList || [],
    details: ui.details || null,
    updated_at: new Date().toISOString(),
    updated_by: email
  };
};

// ----------------------------------------------------
// CORE REPOSITORIES (SUPABASE WITH FALLBACK)
// ----------------------------------------------------

export const companyRepository = {
  getAllSync() {
    const local = getLocalData('companies', companies);
    return local.filter((c: any) => !c.deleted_at);
  },
  getByIdSync(id: string) {
    const local = getLocalData('companies', companies);
    return local.find((c: any) => c.id === id && !c.deleted_at) || local[0];
  },
  async list() {
    const { organizationId } = getSessionInfo();
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('organization_id', organizationId)
          .is('deleted_at', null);
        if (error) throw error;
        if (data && data.length > 0) {
          return data.map(mapDbCompanyToUi);
        }
      } catch (e) {
        console.warn('Supabase companies fetch failed, falling back to mock data:', e);
      }
    }
    const local = getLocalData('companies', companies);
    return local.filter((c: any) => !c.deleted_at);
  },
  async getById(id: string) {
    const { organizationId } = getSessionInfo();
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('organization_id', organizationId)
          .eq('id', id)
          .is('deleted_at', null)
          .single();
        if (error) throw error;
        if (data) return mapDbCompanyToUi(data);
      } catch (e) {
        console.warn(`Supabase getCompanyById(${id}) failed, falling back to mock:`, e);
      }
    }
    return this.getByIdSync(id);
  },
  async create(input: any) {
    const { organizationId, email } = getSessionInfo();
    
    // Duplicate check
    const existing = await this.search(input.name);
    if (existing.some(c => c.name.toLowerCase() === input.name.toLowerCase())) {
      throw new Error('Bu isimde bir firma zaten mevcut.');
    }

    if (isSupabaseConfigured()) {
      try {
        const newId = 'CMP-' + Math.random().toString(36).substring(2, 6).toUpperCase();
        const payload = mapUiCompanyToDb(newId, organizationId, email, input);
        const { data, error } = await supabase
          .from('companies')
          .insert([payload])
          .select()
          .single();
        if (error) throw error;
        if (data) {
          const created = mapDbCompanyToUi(data);
          await auditLogRepository.log('company.created', 'company', created.id);
          await activityLogRepository.log(`Yeni firma oluşturuldu: ${created.name}`, 'companies');
          return created;
        }
      } catch (e) {
        console.warn('Supabase company creation failed, using mock fallback:', e);
      }
    }

    const local = getLocalData('companies', companies);
    const newId = generateId('CMP', local);
    const mockCompany = {
      ...input,
      id: newId,
      campaignsCount: 0,
      totalSpend: '₺0',
      activeSpacesCount: 0,
      lastCampaign: '-',
      upcomingCampaign: '-',
      aiScore: 8.5,
      logo: input.name.charAt(0).toUpperCase(),
      brands: input.brands || [],
      campaignList: [],
      spacesList: [],
      offersList: [],
      contractsList: [],
      filesList: [],
      notesList: input.notes ? [input.notes] : [],
      contacts: input.contacts || [],
      created_at: new Date().toISOString(),
      created_by: email
    };
    local.push(mockCompany);
    setLocalData('companies', local);

    await auditLogRepository.log('company.created', 'company', newId);
    await activityLogRepository.log(`Yeni firma oluşturuldu (Demo): ${mockCompany.name}`, 'companies');
    return mockCompany;
  },
  async update(id: string, input: any) {
    const { organizationId, email } = getSessionInfo();
    
    // Duplicate check
    if (input.name) {
      const existing = await this.search(input.name);
      if (existing.some(c => c.id !== id && c.name.toLowerCase() === input.name.toLowerCase())) {
        throw new Error('Bu isimde bir firma zaten mevcut.');
      }
    }

    if (isSupabaseConfigured()) {
      try {
        const payload = mapUiCompanyToDb(id, organizationId, email, input);
        const { data, error } = await supabase
          .from('companies')
          .update(payload)
          .eq('id', id)
          .eq('organization_id', organizationId)
          .select()
          .single();
        if (error) throw error;
        if (data) {
          const updated = mapDbCompanyToUi(data);
          await auditLogRepository.log('company.updated', 'company', id);
          return updated;
        }
      } catch (e) {
        console.warn('Supabase company update failed, using mock fallback:', e);
      }
    }

    const local = getLocalData('companies', companies);
    const idx = local.findIndex((c: any) => c.id === id);
    if (idx !== -1) {
      local[idx] = {
        ...local[idx],
        ...input,
        notesList: input.notes && !local[idx].notesList.includes(input.notes)
          ? [input.notes, ...local[idx].notesList]
          : local[idx].notesList,
        updated_at: new Date().toISOString(),
        updated_by: email
      };
      setLocalData('companies', local);
      await auditLogRepository.log('company.updated', 'company', id);
      return local[idx];
    }
    throw new Error('Firma bulunamadı.');
  },
  async softDelete(id: string) {
    const { organizationId, email } = getSessionInfo();
    const timestamp = new Date().toISOString();

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('companies')
          .update({
            deleted_at: timestamp,
            deleted_by: email
          } as any)
          .eq('id', id)
          .eq('organization_id', organizationId);
        if (error) throw error;
        await auditLogRepository.log('company.deleted', 'company', id);
        return true;
      } catch (e) {
        console.warn('Supabase soft delete failed, using mock fallback:', e);
      }
    }

    const local = getLocalData('companies', companies);
    const idx = local.findIndex((c: any) => c.id === id);
    if (idx !== -1) {
      local[idx].deleted_at = timestamp;
      local[idx].deleted_by = email;
      setLocalData('companies', local);
      await auditLogRepository.log('company.deleted', 'company', id);
      return true;
    }
    return false;
  },
  async search(query: string) {
    const { organizationId } = getSessionInfo();
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('organization_id', organizationId)
          .is('deleted_at', null)
          .ilike('name', `%${query}%`);
        if (error) throw error;
        if (data && data.length > 0) return data.map(mapDbCompanyToUi);
      } catch (e) {
        console.warn('Supabase company search failed, using mock fallback:', e);
      }
    }
    const list = await this.list();
    return list.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
  }
};

export const spaceRepository = {
  getAllSync() {
    const local = getLocalData('advertisingSpaces', advertisingSpaces);
    return local.filter((s: any) => !s.deleted_at);
  },
  getByIdSync(id: string) {
    const local = getLocalData('advertisingSpaces', advertisingSpaces);
    return local.find((s: any) => (s.id === id || s.code === id) && !s.deleted_at) || local[0];
  },
  async list() {
    const { organizationId } = getSessionInfo();
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('spaces')
          .select('*')
          .eq('organization_id', organizationId)
          .is('deleted_at', null);
        if (error) throw error;
        if (data && data.length > 0) return data.map(mapDbSpaceToUi);
      } catch (e) {
        console.warn('Supabase spaces list failed, falling back:', e);
      }
    }
    const local = getLocalData('advertisingSpaces', advertisingSpaces);
    return local.filter((s: any) => !s.deleted_at);
  },
  async getById(id: string) {
    const { organizationId } = getSessionInfo();
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('spaces')
          .select('*')
          .eq('organization_id', organizationId)
          .or(`id.eq.${id},code.eq.${id}`)
          .is('deleted_at', null)
          .single();
        if (error) throw error;
        if (data) return mapDbSpaceToUi(data);
      } catch (e) {
        console.warn(`Supabase getSpaceById(${id}) failed, falling back:`, e);
      }
    }
    return this.getByIdSync(id);
  },
  async create(input: any) {
    const { organizationId, email } = getSessionInfo();
    
    // Duplicate check
    const allSpaces = await this.list();
    if (allSpaces.some(s => s.code.toLowerCase() === input.code.toLowerCase())) {
      throw new Error('Bu alan kodu zaten kullanılmakta.');
    }

    if (isSupabaseConfigured()) {
      try {
        const newId = 'SPC-' + Math.random().toString(36).substring(2, 6).toUpperCase();
        const payload = mapUiSpaceToDb(newId, organizationId, email, input);
        const { data, error } = await supabase
          .from('spaces')
          .insert([payload])
          .select()
          .single();
        if (error) throw error;
        if (data) {
          const created = mapDbSpaceToUi(data);
          await auditLogRepository.log('space.created', 'space', created.id);
          await activityLogRepository.log(`Yeni reklam alanı oluşturuldu: ${created.name} (${created.code})`, 'spaces');
          return created;
        }
      } catch (e) {
        console.warn('Supabase space create failed, using mock fallback:', e);
      }
    }

    const local = getLocalData('advertisingSpaces', advertisingSpaces);
    const newId = generateId('SPC', local);
    const mockSpace = {
      ...mapDbSpaceToUi(mapUiSpaceToDb(newId, organizationId, email, input)),
      created_at: new Date().toISOString(),
      created_by: email
    };
    local.push(mockSpace);
    setLocalData('advertisingSpaces', local);

    await auditLogRepository.log('space.created', 'space', newId);
    await activityLogRepository.log(`Yeni reklam alanı oluşturuldu (Demo): ${mockSpace.name} (${mockSpace.code})`, 'spaces');
    return mockSpace;
  },
  async update(id: string, input: any) {
    const { organizationId, email } = getSessionInfo();
    
    // Duplicate check
    if (input.code) {
      const allSpaces = await this.list();
      if (allSpaces.some(s => s.id !== id && s.code.toLowerCase() === input.code.toLowerCase())) {
        throw new Error('Bu alan kodu zaten kullanılmakta.');
      }
    }

    const currentSpace = await this.getById(id);
    const statusChanged = input.status && currentSpace.status !== input.status;

    if (isSupabaseConfigured()) {
      try {
        const payload = mapUiSpaceToDb(id, organizationId, email, input);
        const { data, error } = await supabase
          .from('spaces')
          .update(payload)
          .eq('id', id)
          .eq('organization_id', organizationId)
          .select()
          .single();
        if (error) throw error;
        if (data) {
          const updated = mapDbSpaceToUi(data);
          await auditLogRepository.log('space.updated', 'space', id);
          if (statusChanged) {
            await auditLogRepository.log('space.status_changed', 'space', id);
          }
          await activityLogRepository.log(`Reklam alanı güncellendi: ${updated.name}`, 'spaces');
          return updated;
        }
      } catch (e) {
        console.warn('Supabase space update failed, using mock fallback:', e);
      }
    }

    const local = getLocalData('advertisingSpaces', advertisingSpaces);
    const idx = local.findIndex((s: any) => s.id === id);
    if (idx !== -1) {
      const oldStatus = local[idx].status;
      local[idx] = {
        ...local[idx],
        ...input,
        updated_at: new Date().toISOString(),
        updated_by: email
      };
      setLocalData('advertisingSpaces', local);
      await auditLogRepository.log('space.updated', 'space', id);
      if (oldStatus !== local[idx].status) {
        await auditLogRepository.log('space.status_changed', 'space', id);
      }
      await activityLogRepository.log(`Reklam alanı güncellendi (Demo): ${local[idx].name}`, 'spaces');
      return local[idx];
    }
    throw new Error('Reklam alanı bulunamadı.');
  },
  async softDelete(id: string) {
    const { organizationId, email } = getSessionInfo();
    const timestamp = new Date().toISOString();

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('spaces')
          .update({
            deleted_at: timestamp,
            deleted_by: email
          } as any)
          .eq('id', id)
          .eq('organization_id', organizationId);
        if (error) throw error;
        await auditLogRepository.log('space.deleted', 'space', id);
        return true;
      } catch (e) {
        console.warn('Supabase space soft delete failed, using mock fallback:', e);
      }
    }

    const local = getLocalData('advertisingSpaces', advertisingSpaces);
    const idx = local.findIndex((s: any) => s.id === id);
    if (idx !== -1) {
      local[idx].deleted_at = timestamp;
      local[idx].deleted_by = email;
      setLocalData('advertisingSpaces', local);
      await auditLogRepository.log('space.deleted', 'space', id);
      return true;
    }
    return false;
  },
  async search(query: string) {
    const { organizationId } = getSessionInfo();
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('spaces')
          .select('*')
          .eq('organization_id', organizationId)
          .is('deleted_at', null)
          .or(`name.ilike.%${query}%,code.ilike.%${query}%`);
        if (error) throw error;
        if (data && data.length > 0) return data.map(mapDbSpaceToUi);
      } catch (e) {
        console.warn('Supabase space search failed, using mock fallback:', e);
      }
    }
    const list = await this.list();
    return list.filter(s => s.name.toLowerCase().includes(query.toLowerCase()) || s.code.toLowerCase().includes(query.toLowerCase()));
  }
};

export const offerRepository = {
  getAllSync() {
    const local = getLocalData('offers', offers);
    return local.filter((o: any) => !o.deleted_at);
  },
  getByIdSync(id: string) {
    const local = getLocalData('offers', offers);
    return local.find((o: any) => o.id === id && !o.deleted_at) || local[0];
  },
  async list() {
    const { organizationId } = getSessionInfo();
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('offers')
          .select('*')
          .eq('organization_id', organizationId)
          .is('deleted_at', null);
        if (error) throw error;
        if (data && data.length > 0) return data.map(mapDbOfferToUi);
      } catch (e) {
        console.warn('Supabase offers list failed, falling back:', e);
      }
    }
    const local = getLocalData('offers', offers);
    return local.filter((o: any) => !o.deleted_at);
  },
  async getById(id: string) {
    const { organizationId } = getSessionInfo();
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('offers')
          .select('*')
          .eq('organization_id', organizationId)
          .eq('id', id)
          .is('deleted_at', null)
          .single();
        if (error) throw error;
        if (data) return mapDbOfferToUi(data);
      } catch (e) {
        console.warn(`Supabase getOfferById(${id}) failed, falling back:`, e);
      }
    }
    return this.getByIdSync(id);
  },
  async create(input: any) {
    const { organizationId, email } = getSessionInfo();
    
    if (input.companyId) {
      const company = await companyRepository.getById(input.companyId);
      input.clientName = company ? company.name : 'Bilinmeyen Firma';
    }
    if (input.spaceIds) {
      const spaceListCodes: string[] = [];
      for (const spaceId of input.spaceIds) {
        const space = await spaceRepository.getById(spaceId);
        if (space) spaceListCodes.push(space.code);
      }
      input.spacesList = spaceListCodes;
    }

    if (isSupabaseConfigured()) {
      try {
        const newId = 'OFF-' + Math.random().toString(36).substring(2, 6).toUpperCase();
        const payload = mapUiOfferToDb(newId, organizationId, email, input);
        const { data, error } = await supabase
          .from('offers')
          .insert([payload])
          .select()
          .single();
        if (error) throw error;
        if (data) {
          const created = mapDbOfferToUi(data);
          await auditLogRepository.log('offer.created', 'offer', created.id);
          await activityLogRepository.log(`Yeni teklif oluşturuldu: ${created.clientName} - ${created.campaignName}`, 'offers');
          return created;
        }
      } catch (e) {
        console.warn('Supabase offer create failed, using mock fallback:', e);
      }
    }

    const local = getLocalData('offers', offers);
    const newId = generateId('OFF', local);
    const mockOffer = {
      ...mapDbOfferToUi(mapUiOfferToDb(newId, organizationId, email, input)),
      spaceIds: input.spaceIds || [],
      created_at: new Date().toISOString(),
      created_by: email
    };
    local.push(mockOffer);
    setLocalData('offers', local);

    await auditLogRepository.log('offer.created', 'offer', newId);
    await activityLogRepository.log(`Yeni teklif oluşturuldu (Demo): ${mockOffer.clientName} - ${mockOffer.campaignName}`, 'offers');
    return mockOffer;
  },
  async update(id: string, input: any) {
    const { organizationId, email } = getSessionInfo();
    
    if (input.companyId) {
      const company = await companyRepository.getById(input.companyId);
      input.clientName = company ? company.name : undefined;
    }
    if (input.spaceIds) {
      const spaceListCodes: string[] = [];
      for (const spaceId of input.spaceIds) {
        const space = await spaceRepository.getById(spaceId);
        if (space) spaceListCodes.push(space.code);
      }
      input.spacesList = spaceListCodes;
    }

    const currentOffer = await this.getById(id);
    const stageChanged = input.stage && currentOffer.stage !== input.stage;
    const isApproved = input.stage === 'Tamamlandı' || input.stage === 'Sözleşme' || input.approved;

    if (isSupabaseConfigured()) {
      try {
        const payload = mapUiOfferToDb(id, organizationId, email, input);
        const { data, error } = await supabase
          .from('offers')
          .update(payload)
          .eq('id', id)
          .eq('organization_id', organizationId)
          .select()
          .single();
        if (error) throw error;
        if (data) {
          const updated = mapDbOfferToUi(data);
          await auditLogRepository.log('offer.updated', 'offer', id);
          if (stageChanged) {
            await auditLogRepository.log('offer.stage_changed', 'offer', id);
            await activityLogRepository.log(`Teklif aşaması değişti: ${updated.clientName} - ${updated.stage}`, 'offers');
            if (updated.stage === 'Onay Bekleniyor') {
              await activityLogRepository.log(`Teklif onaya gönderildi: ${updated.clientName}`, 'offers');
            }
          }
          if (isApproved) {
            await auditLogRepository.log('offer.approved', 'offer', id);
          }
          return updated;
        }
      } catch (e) {
        console.warn('Supabase offer update failed, using mock fallback:', e);
      }
    }

    const local = getLocalData('offers', offers);
    const idx = local.findIndex((o: any) => o.id === id);
    if (idx !== -1) {
      const oldStage = local[idx].stage;
      local[idx] = {
        ...local[idx],
        ...input,
        updated_at: new Date().toISOString(),
        updated_by: email
      };
      setLocalData('offers', local);
      await auditLogRepository.log('offer.updated', 'offer', id);
      if (oldStage !== local[idx].stage) {
        await auditLogRepository.log('offer.stage_changed', 'offer', id);
        await activityLogRepository.log(`Teklif aşaması değişti (Demo): ${local[idx].clientName} - ${local[idx].stage}`, 'offers');
        if (local[idx].stage === 'Onay Bekleniyor') {
          await activityLogRepository.log(`Teklif onaya gönderildi (Demo): ${local[idx].clientName}`, 'offers');
        }
      }
      if (isApproved) {
        await auditLogRepository.log('offer.approved', 'offer', id);
      }
      return local[idx];
    }
    throw new Error('Teklif bulunamadı.');
  },
  async softDelete(id: string) {
    const { organizationId, email } = getSessionInfo();
    const timestamp = new Date().toISOString();

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('offers')
          .update({
            deleted_at: timestamp,
            deleted_by: email
          } as any)
          .eq('id', id)
          .eq('organization_id', organizationId);
        if (error) throw error;
        await auditLogRepository.log('offer.deleted', 'offer', id);
        return true;
      } catch (e) {
        console.warn('Supabase offer soft delete failed, using mock fallback:', e);
      }
    }

    const local = getLocalData('offers', offers);
    const idx = local.findIndex((o: any) => o.id === id);
    if (idx !== -1) {
      local[idx].deleted_at = timestamp;
      local[idx].deleted_by = email;
      setLocalData('offers', local);
      await auditLogRepository.log('offer.deleted', 'offer', id);
      return true;
    }
    return false;
  },
  async search(query: string) {
    const { organizationId } = getSessionInfo();
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('offers')
          .select('*')
          .eq('organization_id', organizationId)
          .is('deleted_at', null)
          .or(`client_name.ilike.%${query}%,campaign_name.ilike.%${query}%`);
        if (error) throw error;
        if (data && data.length > 0) return data.map(mapDbOfferToUi);
      } catch (e) {
        console.warn('Supabase offer search failed, using mock fallback:', e);
      }
    }
    const list = await this.list();
    return list.filter(o => o.clientName.toLowerCase().includes(query.toLowerCase()) || o.campaignName.toLowerCase().includes(query.toLowerCase()));
  }
};

// ----------------------------------------------------
// OTHER REPOSITORIES (PRESERVED MOCK WITH FALLBACK)
// ----------------------------------------------------

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

export const settingRepository = {
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
