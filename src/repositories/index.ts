import { supabase, isSupabaseConfigured } from '@/utils/supabaseClient';
import { companies } from '@/data/companies';
import { advertisingSpaces } from '@/data/advertisingSpaces';
import { offers } from '@/data/offers';
import { contracts, Contract } from '@/data/contracts';
import { reservations, conflicts } from '@/data/reservations';
import { campaigns } from '@/data/campaigns';
import { financeData } from '@/data/finance';
import { mediaAssets } from '@/data/media';
import { tasksList } from '@/data/tasks';
import { notificationsList } from '@/data/notifications';
import { maintenanceTasks } from '@/data/maintenance';
import { competitorsList, competitorKpis } from '@/data/competitors';
import { notificationRepository as newNotifRepo } from '@/notifications/notificationRepository';
import { taskRepository as newTaskRepo } from '@/notifications/taskRepository';

import resetTimeConfig from '@/data/resetTime.json';

if (typeof window !== 'undefined') {
  // Idempotent Production Reset: Clear only mock keys once
  const resetDone = localStorage.getItem('outdoorcore_production_reset_done_v1');
  if (!resetDone) {
    const keysToClear = [
      'outdoorcore_mock_companies',
      'outdoorcore_mock_advertisingSpaces',
      'outdoorcore_mock_offers',
      'outdoorcore_mock_reservations',
      'outdoorcore_mock_contracts',
      'outdoorcore_mock_campaigns',
      'outdoorcore_digital_screens',
      'outdoorcore_playlist_slots',
      'outdoorcore_mock_proofOfPlays',
      'outdoorcore_mock_finance_data',
      'outdoorcore_mock_mediaAssets',
      'outdoorcore_mock_tasks',
      'outdoorcore_mock_notifications',
      'outdoorcore_mock_maintenance',
      'outdoorcore_mock_competitors',
      'outdoorcore_demo_last_reset_time',
      'outdoorcore_calendar_events_custom',
      'outdoorcore_calendar_deleted_ids'
    ];
    keysToClear.forEach(key => {
      // Safely preserve user configurations, theme, auth, settings
      if (key !== 'outdoorcore_theme' && key !== 'outdoorcore_mock_session') {
        localStorage.removeItem(key);
      }
    });
    localStorage.setItem('outdoorcore_production_reset_done_v1', 'true');
  }
  
  if (!localStorage.getItem('outdoorcore_mock_companies')) {
    // Production initialization with empty tables
    localStorage.setItem('outdoorcore_mock_companies', JSON.stringify([]));
    localStorage.setItem('outdoorcore_mock_advertisingSpaces', JSON.stringify([]));
    localStorage.setItem('outdoorcore_mock_offers', JSON.stringify([]));
    localStorage.setItem('outdoorcore_mock_reservations', JSON.stringify([]));
    localStorage.setItem('outdoorcore_mock_contracts', JSON.stringify([]));
    localStorage.setItem('outdoorcore_mock_campaigns', JSON.stringify([]));
    localStorage.setItem('outdoorcore_digital_screens', JSON.stringify([]));
    localStorage.setItem('outdoorcore_playlist_slots', JSON.stringify([]));
    localStorage.setItem('outdoorcore_mock_proofOfPlays', JSON.stringify([]));
    localStorage.setItem('outdoorcore_mock_finance_data', JSON.stringify({
      accounts: [],
      cashFlowTrends: [],
      collectionStatuses: [],
      upcomingPayments: [],
      activities: []
    }));
    localStorage.setItem('outdoorcore_mock_mediaAssets', JSON.stringify([]));
    localStorage.setItem('outdoorcore_mock_tasks', JSON.stringify([]));
    localStorage.setItem('outdoorcore_mock_notifications', JSON.stringify([]));
    localStorage.setItem('outdoorcore_mock_maintenance', JSON.stringify([]));
    localStorage.setItem('outdoorcore_mock_competitors', JSON.stringify([]));
  }
}

// One-time run: Cancel associated reservations & campaigns of cancelled offers + Supabase cleanup for Tatilbudur
if (typeof window !== 'undefined') {
  const runTatilbudurCleanup = async () => {
    try {
      // 1. Local storage cleanup
      const localOffersStr = localStorage.getItem('outdoorcore_mock_offers');
      if (localOffersStr) {
        const localOffers = JSON.parse(localOffersStr);
        
        // Find Tatilbudur offer
        const tatilbudurOffer = localOffers.find((o: any) => o.clientName && o.clientName.toLowerCase().includes('tatilbudur'));
        if (tatilbudurOffer) {
          if (tatilbudurOffer.stage !== 'İptal') {
            tatilbudurOffer.stage = 'İptal';
            localStorage.setItem('outdoorcore_mock_offers', JSON.stringify(localOffers));
          }
        }

        const cancelledOfferIds = new Set(
          localOffers
            .filter((o: any) => o.stage === 'İptal' || o.status === 'cancelled')
            .map((o: any) => o.id)
        );

        // Clean up reservations
        const localResStr = localStorage.getItem('outdoorcore_mock_reservations');
        if (localResStr) {
          let changed = false;
          const localRes = JSON.parse(localResStr);
          localRes.forEach((r: any) => {
            if (r.offerId && cancelledOfferIds.has(r.offerId) && r.status !== 'İptal') {
              r.status = 'İptal';
              changed = true;
            }
          });
          if (changed) {
            localStorage.setItem('outdoorcore_mock_reservations', JSON.stringify(localRes));
          }
        }

        // Clean up campaigns
        const localCamStr = localStorage.getItem('outdoorcore_mock_campaigns');
        if (localCamStr) {
          let changed = false;
          const localCam = JSON.parse(localCamStr);
          localCam.forEach((c: any) => {
            if (c.offerId && cancelledOfferIds.has(c.offerId) && c.status !== 'İptal') {
              c.status = 'İptal';
              changed = true;
            }
          });
          if (changed) {
            localStorage.setItem('outdoorcore_mock_campaigns', JSON.stringify(localCam));
          }
        }
      }

      // 2. Supabase cleanup (if configured)
      if (isSupabaseConfigured()) {
        console.log("RUNNING SUPABASE CLEANUP FOR TATILBUDUR...");
        const { data: dbOffers, error: offersErr } = await supabase
          .from('offers')
          .select('id, contract_id')
          .ilike('client_name', '%tatilbudur%');
        
        if (offersErr) throw offersErr;
        
        if (dbOffers && dbOffers.length > 0) {
          const tbOfferIds = dbOffers.map(o => o.id);
          const tbContractIds = dbOffers.map(o => o.contract_id).filter(Boolean);
          
          // Update offers stage to 'İptal'
          await supabase
            .from('offers')
            .update({ stage: 'İptal', updated_at: new Date().toISOString() })
            .in('id', tbOfferIds);

          // Update reservations to 'İptal'
          await supabase
            .from('reservations')
            .update({ status: 'İptal', updated_at: new Date().toISOString() })
            .in('offer_id', tbOfferIds);

          if (tbContractIds.length > 0) {
            await supabase
              .from('reservations')
              .update({ status: 'İptal', updated_at: new Date().toISOString() })
              .in('contract_id', tbContractIds);
              
            // Update contracts to 'cancelled'
            await supabase
              .from('contracts')
              .update({ status: 'cancelled', updated_at: new Date().toISOString() })
              .in('id', tbContractIds);
          }

          // Update campaigns to 'İptal'
          await supabase
            .from('campaigns')
            .update({ status: 'İptal', updated_at: new Date().toISOString() })
            .in('proposal_id', tbOfferIds);

          if (tbContractIds.length > 0) {
            await supabase
              .from('campaigns')
              .update({ status: 'İptal', updated_at: new Date().toISOString() })
              .in('contract_id', tbContractIds);
          }
          console.log("SUPABASE CLEANUP FOR TATILBUDUR SUCCESSFUL.");
        }
      }
    } catch (err) {
      console.error('One-time cancellation cleanup failed:', err);
    }
  };

  setTimeout(runTatilbudurCleanup, 1000);
}

// ----------------------------------------------------
// PERSISTENCE AND CONTEXT HELPERS FOR FALLBACK DEMO
// ----------------------------------------------------

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

const getLocalDataObject = <T>(key: string, initialData: T): T => {
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

const setLocalDataObject = <T>(key: string, data: T): void => {
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
    campaignStartDate: db.campaign_start_date || db.campaign_start || '',
    campaignEndDate: db.campaign_end_date || db.campaign_end || '',
    details: db.details || '',
    priority: (db.probability && db.probability >= 80) ? 'Yüksek' : (db.probability && db.probability >= 50) ? 'Orta' : 'Düşük',
    companyId: db.company_id || undefined,
    spaceIds: [],
    notes: db.notes || '',
    deleted_at: db.deleted_at,
    deleted_by: db.deleted_by,
    discountRate: db.discount_rate ? parseFloat(db.discount_rate) : 0,
    discountAmount: db.discount_amount ? parseFloat(db.discount_amount) : 0,
    netAmount: db.net_amount ? parseFloat(db.net_amount) : 0,
    vatAmount: db.vat_amount ? parseFloat(db.vat_amount) : 0,
    grandTotal: db.grand_total ? parseFloat(db.grand_total) : 0,
    customerBudget: db.customer_budget ? parseFloat(db.customer_budget) : 0
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
    campaign_start_date: ui.campaignStartDate || null,
    campaign_end_date: ui.campaignEndDate || null,
    spaces_list: ui.spacesList || [],
    details: ui.details || null,
    updated_at: new Date().toISOString(),
    updated_by: email,
    discount_rate: ui.discountRate || 0,
    discount_amount: ui.discountAmount || 0,
    net_amount: ui.netAmount || 0,
    vat_amount: ui.vatAmount || 0,
    grand_total: ui.grandTotal || 0,
    customer_budget: ui.customerBudget || 0
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
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('spaces_updated'));
          }
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
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('spaces_updated'));
    }
    return mockSpace;
  },
  async update(id: string, input: any) {
    const { organizationId, email } = getSessionInfo();
    const currentSpace = await this.getById(id);
    
    // Duplicate check - only if code is modified and different
    if (input.code && currentSpace.code.toLowerCase() !== input.code.toLowerCase()) {
      const allSpaces = await this.list();
      if (allSpaces.some(s => s.id !== id && s.code.toLowerCase() === input.code.toLowerCase())) {
        throw new Error('Bu alan kodu zaten kullanılmakta.');
      }
    }

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
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('spaces_updated'));
          }
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
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('spaces_updated'));
      }
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
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('spaces_updated'));
        }
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
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('spaces_updated'));
      }
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
      const resolvedSpaces = await Promise.all(
        input.spaceIds.map((spaceId: string) => spaceRepository.getById(spaceId))
      );
      input.spacesList = resolvedSpaces.filter(Boolean).map((s: any) => s.code);
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
      const resolvedSpaces = await Promise.all(
        input.spaceIds.map((spaceId: string) => spaceRepository.getById(spaceId))
      );
      input.spacesList = resolvedSpaces.filter(Boolean).map((s: any) => s.code);
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
        if (local[idx].stage === 'Onaya Gönderildi') {
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

const normalizeContractStatus = (status: string | null | undefined): string => {
  if (!status) return 'draft';
  const s = status.trim().toLowerCase();
  if (s === 'aktif' || s === 'active') return 'active';
  if (s === 'sozlesme imzalandi' || s === 'sözleşme imzalandı' || s === 'signed' || s === 'imzalandı' || s === 'imzalandi') return 'signed';
  if (s === 'sozlesme bekliyor' || s === 'sözleşme bekliyor' || s === 'pending') return 'pending';
  if (s === 'iptal' || s === 'cancelled' || s === 'iptal edildi') return 'cancelled';
  if (s === 'expired' || s === 'süresi dolmuş' || s === 'süresi doldu') return 'expired';
  if (s === 'draft' || s === 'taslak') return 'draft';
  return s;
};

export const contractRepository = {
  getAllSync() {
    const data = getLocalData('contracts', contracts);
    return data.map((d: any) => ({
      id: d.id || '',
      contractNo: d.contractNo || '',
      companyId: d.companyId || '',
      clientName: d.clientName || 'Bilinmeyen Müşteri',
      campaignId: d.campaignId || '',
      campaignName: d.campaignName || '',
      status: normalizeContractStatus(d.status),
      crmTier: d.crmTier || '',
      value: d.value || '₺0',
      daysLeft: d.daysLeft || 0,
      startDate: d.startDate || '',
      endDate: d.endDate || '',
      logo: d.logo || '',
      valueNumeric: d.valueNumeric || 0,
      progress: d.progress || 0,
      aiRiskScore: d.aiRiskScore || 0,
      mediaAgency: d.mediaAgency || '',
      proposalId: d.proposalId || '',
      reservationId: d.reservationId || '',
      notes: Array.isArray(d.notes) ? d.notes : [d.notes].filter(Boolean),
      installments: Array.isArray(d.installments) ? d.installments : [],
      spacesList: Array.isArray(d.spacesList) ? d.spacesList : [],
      filesList: Array.isArray(d.filesList) ? d.filesList : [],
      history: Array.isArray(d.history) ? d.history : [],
      aiRiskAnalysis: Array.isArray(d.aiRiskAnalysis) ? d.aiRiskAnalysis : []
    })) as Contract[];
  },
  getByIdSync(id: string) {
    const local = this.getAllSync();
    return local.find(c => c.id === id) || local[0];
  },
  async getAll() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('contracts').select('*');
        if (error) throw error;
        if (data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id || '',
            contractNo: d.contract_no || '',
            companyId: d.company_id || '',
            clientName: d.client_name || 'Bilinmeyen Müşteri',
            campaignId: d.campaign_id || '',
            campaignName: d.campaign_name || '',
            status: normalizeContractStatus(d.status),
            crmTier: d.crm_tier || '',
            value: d.value || '₺0',
            daysLeft: d.days_left || 0,
            startDate: d.start_date || '',
            endDate: d.end_date || '',
            logo: d.logo || '',
            valueNumeric: d.value_numeric || 0,
            progress: d.progress || 0,
            aiRiskScore: d.ai_risk_score || 0,
            mediaAgency: d.media_agency || '',
            proposalId: d.proposal_id || '',
            reservationId: d.reservation_id || '',
            notes: Array.isArray(d.notes) ? d.notes : [d.notes].filter(Boolean),
            installments: Array.isArray(d.installments) ? d.installments : [],
            spacesList: Array.isArray(d.spaces_list) ? d.spaces_list : [],
            filesList: Array.isArray(d.files_list) ? d.files_list : [],
            history: Array.isArray(d.history) ? d.history : [],
            aiRiskAnalysis: Array.isArray(d.ai_risk_analysis) ? d.ai_risk_analysis : []
          })) as Contract[];
        }
      } catch (e) {
        console.warn('Supabase contracts fetch failed, using local fallback:', e);
      }
    }
    return this.getAllSync();
  },
  async update(id: string, input: any) {
    const { organizationId, email } = getSessionInfo();
    
    if (isSupabaseConfigured()) {
      try {
        const payload = {
          files_list: input.filesList,
          status: input.status,
          notes: input.notes,
          updated_at: new Date().toISOString(),
          updated_by: email
        };
        const { error } = await supabase
          .from('contracts')
          .update(payload)
          .eq('id', id);
        if (error) throw error;
      } catch (e) {
        console.warn('Supabase contract update failed:', e);
      }
    }

    const local = getLocalData('contracts', contracts);
    const idx = local.findIndex((c: any) => c.id === id);
    if (idx !== -1) {
      local[idx] = {
        ...local[idx],
        ...input,
        updated_at: new Date().toISOString(),
        updated_by: email
      };
      setLocalData('contracts', local);
      return local[idx];
    }
    throw new Error('Sözleşme bulunamadı.');
  },
  async create(input: any) {
    const { organizationId, email } = getSessionInfo();
    const newId = input.id || 'CON-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    
    if (isSupabaseConfigured()) {
      try {
        const payload = {
          id: newId,
          organization_id: organizationId,
          contract_no: input.contractNo,
          client_name: input.clientName,
          campaign_name: input.campaignName,
          status: input.status,
          start_date: input.startDate,
          end_date: input.endDate,
          value_numeric: input.valueNumeric,
          spaces_list: input.spacesList,
          created_by: email,
          created_at: new Date().toISOString()
        };
        const { error } = await supabase
          .from('contracts')
          .insert([payload]);
        if (error) throw error;
      } catch (e) {
        console.warn('Supabase contract create failed:', e);
      }
    }

    const local = getLocalData('contracts', contracts);
    const newRecord = {
      id: newId,
      ...input,
      created_at: new Date().toISOString(),
      created_by: email
    };
    local.push(newRecord);
    setLocalData('contracts', local);
    
    // Sync in-memory contracts
    contracts.push(newRecord);
    
    return newRecord;
  },
  async delete(id: string) {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('contracts')
          .delete()
          .eq('id', id);
        if (error) throw error;
      } catch (e) {
        console.warn('Supabase contract delete failed:', e);
      }
    }

    const local = getLocalData('contracts', contracts);
    const filtered = local.filter((c: any) => c.id !== id);
    setLocalData('contracts', filtered);

    // Sync in-memory contracts
    const inMemIdx = contracts.findIndex(c => c.id === id);
    if (inMemIdx !== -1) {
      contracts.splice(inMemIdx, 1);
    }
    return true;
  }
};

const parseDDMMYYYY = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  const parts = dateStr.split('.');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
};

// ----------------------------------------------------
// RESERVATION AUDIT LOG REPOSITORY
// ----------------------------------------------------

export interface ReservationAuditLog {
  id: string;
  reservationId: string;
  user: string;
  date: string;
  oldStatus: string;
  newStatus: string;
  description: string;
}

export const reservationAuditRepository = {
  getLogs(): ReservationAuditLog[] {
    try {
      const stored = localStorage.getItem('outdoorcore_reservation_audit_logs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },
  log(reservationId: string, oldStatus: string, newStatus: string, description: string, user?: string) {
    try {
      const logs = this.getLogs();
      const sessionUser = getSessionInfo().email || user || 'Sistem';
      const newLog: ReservationAuditLog = {
        id: 'AUD-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
        reservationId,
        user: sessionUser,
        date: new Date().toLocaleString('tr-TR'),
        oldStatus,
        newStatus,
        description
      };
      logs.unshift(newLog);
      localStorage.setItem('outdoorcore_reservation_audit_logs', JSON.stringify(logs.slice(0, 100)));
      window.dispatchEvent(new Event('reservation_audit_logs_updated'));
    } catch (e) {
      console.error('Failed to log reservation audit:', e);
    }
  }
};

export const normalizeReservationStatus = (status: string): string => {
  const s = (status || '').toUpperCase();
  if (s === 'AKTİF' || s === 'ACTIVE' || s === 'CONFIRMED' || s === 'KESİNLEŞTİ' || s === 'REZERVE') {
    return 'CONFIRMED';
  }
  if (s === 'YAKLAŞAN' || s === 'OPTIONED' || s === 'OPSİYONLU') {
    return 'OPTIONED';
  }
  if (s === 'İPTAL' || s === 'CANCELLED') {
    return 'CANCELLED';
  }
  if (s === 'DRAFT' || s === 'TASLAK') {
    return 'DRAFT';
  }
  if (s === 'CONTRACT_PENDING' || s === 'SÖZLEŞME BEKLİYOR') {
    return 'CONTRACT_PENDING';
  }
  if (s === 'SALES_APPROVAL_PENDING' || s === 'SATIŞ ONAYI BEKLİYOR') {
    return 'SALES_APPROVAL_PENDING';
  }
  if (s === 'OPTION_EXPIRED' || s === 'OPSİYON SÜRESİ DOLDU') {
    return 'OPTION_EXPIRED';
  }
  return status || 'OPTIONED';
};

export const reservationRepository = {
  checkAndExpireOptionsSync() {
    try {
      const list = getLocalData('reservations', reservations);
      let changed = false;
      const now = new Date();
      
      const updatedList = list.map((r: any) => {
        // Kural: Sözleşme imzalanmamışsa (contractStatus !== 'SIGNED') opsiyon süresi dolduğunda otomatik OPTION_EXPIRED yapılır.
        if (r.status === 'OPTIONED' && r.contractStatus !== 'SIGNED' && r.optionExpiresAt) {
          const expireDate = new Date(r.optionExpiresAt);
          if (now > expireDate) {
            changed = true;
            reservationAuditRepository.log(
              r.id, 
              r.status, 
              'OPTION_EXPIRED', 
              'Opsiyon süresi doldu. Sistem tarafından otomatik olarak serbest bırakıldı.', 
              'Sistem'
            );
            
            // Sistem bildirimi oluştur
            try {
              const notifsStr = localStorage.getItem('outdoorcore_mock_notifications');
              const notifs = notifsStr ? JSON.parse(notifsStr) : [];
              notifs.unshift({
                id: 'NTF-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
                title: 'Opsiyon Süresi Doldu',
                desc: `${r.clientName} firmasına ait ${r.spaceCode} opsiyonunun süresi dolduğu için serbest bırakıldı.`,
                time: 'Şimdi',
                type: 'alert'
              });
              localStorage.setItem('outdoorcore_mock_notifications', JSON.stringify(notifs.slice(0, 50)));
            } catch (e) {
              console.error(e);
            }
            
            return { ...r, status: 'OPTION_EXPIRED' };
          }
        }
        return r;
      });

      if (changed) {
        localStorage.setItem('outdoorcore_mock_reservations', JSON.stringify(updatedList));
        reservations.length = 0;
        reservations.push(...updatedList);
        window.dispatchEvent(new Event('storage'));
      }
    } catch (e) {
      console.error('Failed to run checkAndExpireOptionsSync:', e);
    }
  },
  getAllSync() {
    this.checkAndExpireOptionsSync();
    const data = getLocalData('reservations', reservations);
    return data.map((d: any) => ({
      ...d,
      status: normalizeReservationStatus(d.status)
    }));
  },
  getConflictsSync() {
    return conflicts;
  },
  async getAll() {
    this.checkAndExpireOptionsSync();
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('reservations').select('*');
        if (error) throw error;
        if (data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            spaceCode: d.space_code,
            spaceName: d.space_name,
            location: d.location,
            clientName: d.client_name,
            agencyName: d.agency_name,
            startDate: d.start_date,
            endDate: d.end_date,
            durationDays: d.duration_days,
            status: normalizeReservationStatus(d.status),
            budget: d.budget,
            creativeFiles: d.creative_files || [],
            aiRecommendation: d.ai_recommendation,
            companyId: d.company_id,
            spaceId: d.space_id,
            offerId: d.offer_id,
            contractId: d.contract_id,
            campaignId: d.campaign_id,
            optionStartedAt: d.option_started_at,
            optionExpiresAt: d.option_expires_at,
            optionDurationHours: d.option_duration_hours,
            optionCreatedBy: d.option_created_by,
            optionExtendedAt: d.option_extended_at,
            optionExtendedBy: d.option_extended_by,
            optionExtensionCount: d.option_extension_count,
            contractStatus: d.contract_status || 'DRAFT',
            salesApprovalStatus: d.sales_approval_status || 'PENDING',
            salesApprovedBy: d.sales_approved_by,
            salesApprovedAt: d.sales_approved_at,
            salesRejectionReason: d.sales_rejection_reason,
            salesRevisionNote: d.sales_revision_note,
            confirmedAt: d.confirmed_at,
            confirmedBy: d.confirmed_by,
            inventoryLockedAt: d.inventory_locked_at
          }));
        }
      } catch (e) {
        console.warn('Supabase reservations fetch failed, using local:', e);
      }
    }
    const data = getLocalData('reservations', reservations);
    return data.map((d: any) => ({
      ...d,
      status: normalizeReservationStatus(d.status)
    }));
  },
  isSpaceAvailableSync(spaceId: string, spaceCode: string, startDateStr: string, endDateStr: string, excludeReservationId?: string): boolean {
    const startA = parseDDMMYYYY(startDateStr);
    const endA = parseDDMMYYYY(endDateStr);
    if (!startA || !endA) return true;

    // Her denetimde süresi biten opsiyonları kapat
    this.checkAndExpireOptionsSync();

    const list = getLocalData('reservations', reservations);
    for (const r of list) {
      if (excludeReservationId && r.id === excludeReservationId) continue;
      
      const normalizedStatus = normalizeReservationStatus(r.status);
      // Müsaitliği engelleyen statüler: OPTIONED, CONTRACT_PENDING, SALES_APPROVAL_PENDING, CONFIRMED
      const consumesCapacity = normalizedStatus === 'OPTIONED' || 
                               normalizedStatus === 'CONTRACT_PENDING' || 
                               normalizedStatus === 'SALES_APPROVAL_PENDING' || 
                               normalizedStatus === 'CONFIRMED';
      if (!consumesCapacity) continue;

      const matchSpace = (r.spaceId && r.spaceId === spaceId) || (r.spaceCode && r.spaceCode === spaceCode);
      if (matchSpace) {
        const startB = parseDDMMYYYY(r.startDate);
        const endB = parseDDMMYYYY(r.endDate);
        if (startB && endB) {
          if (startA <= endB && endA >= startB) {
            return false;
          }
        }
      }
    }
    return true;
  },
  async update(id: string, input: any) {
    const { email } = getSessionInfo();
    
    // Yalnızca değişen alanları güncellemeden önce eski durumu saklayalım (Audit log için)
    const local = getLocalData('reservations', reservations);
    const idx = local.findIndex(r => r.id === id);
    if (idx !== -1) {
      const oldRecord = local[idx];
      const oldStatus = oldRecord.status;
      const newStatus = input.status !== undefined ? normalizeReservationStatus(input.status) : oldStatus;
      
      const updatedRecord = { 
        ...oldRecord, 
        ...input,
        status: newStatus 
      };

      if (isSupabaseConfigured()) {
        try {
          const payload: any = {};
          if (input.spaceCode !== undefined) payload.space_code = input.spaceCode;
          if (input.spaceName !== undefined) payload.space_name = input.spaceName;
          if (input.location !== undefined) payload.location = input.location;
          if (input.clientName !== undefined) payload.client_name = input.clientName;
          if (input.agencyName !== undefined) payload.agency_name = input.agencyName;
          if (input.startDate !== undefined) payload.start_date = input.startDate;
          if (input.endDate !== undefined) payload.end_date = input.endDate;
          if (input.durationDays !== undefined) payload.duration_days = input.durationDays;
          if (input.status !== undefined) payload.status = newStatus;
          if (input.budget !== undefined) payload.budget = input.budget;
          if (input.creativeFiles !== undefined) payload.creative_files = input.creativeFiles;
          if (input.aiRecommendation !== undefined) payload.ai_recommendation = input.aiRecommendation;
          if (input.companyId !== undefined) payload.company_id = input.companyId;
          if (input.spaceId !== undefined) payload.space_id = input.spaceId;
          if (input.offerId !== undefined) payload.offer_id = input.offerId;
          if (input.contractId !== undefined) payload.contract_id = input.contractId;
          if (input.campaignId !== undefined) payload.campaign_id = input.campaignId;
          if (input.contractStatus !== undefined) payload.contract_status = input.contractStatus;
          if (input.salesApprovalStatus !== undefined) payload.sales_approval_status = input.salesApprovalStatus;
          if (input.salesApprovedBy !== undefined) payload.sales_approved_by = input.salesApprovedBy;
          if (input.salesApprovedAt !== undefined) payload.sales_approved_at = input.salesApprovedAt;
          if (input.salesRejectionReason !== undefined) payload.sales_rejection_reason = input.salesRejectionReason;
          if (input.salesRevisionNote !== undefined) payload.sales_revision_note = input.salesRevisionNote;
          if (input.confirmedAt !== undefined) payload.confirmed_at = input.confirmedAt;
          if (input.confirmedBy !== undefined) payload.confirmed_by = input.confirmedBy;
          if (input.inventoryLockedAt !== undefined) payload.inventory_locked_at = input.inventoryLockedAt;
          
          payload.updated_at = new Date().toISOString();
          payload.updated_by = email;

          const { error } = await supabase
            .from('reservations')
            .update(payload)
            .eq('id', id);
          if (error) throw error;
        } catch (e) {
          console.warn('Supabase reservation update failed:', e);
        }
      }

      local[idx] = updatedRecord;
      localStorage.setItem('outdoorcore_mock_reservations', JSON.stringify(local));
      
      const resIdx = reservations.findIndex(r => r.id === id);
      if (resIdx !== -1) {
        reservations[resIdx] = updatedRecord;
      }

      // Log status transition if changed
      if (oldStatus !== newStatus || input.auditLogDescription) {
        const desc = input.auditLogDescription || `${oldStatus} durumundan ${newStatus} durumuna geçildi.`;
        reservationAuditRepository.log(id, oldStatus, newStatus, desc, email);
      }

      window.dispatchEvent(new Event('storage'));
      return updatedRecord;
    }
    throw new Error('Reservation not found');
  },
  async create(input: any) {
    const { organizationId, email } = getSessionInfo();
    const newId = input.id || 'RSV-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    
    // Varsayılan opsiyon süresi ayardan okunur
    const optionDuration = Number(localStorage.getItem('outdoorcore_option_duration_hours') || '72');
    const optionStartedAt = new Date().toISOString();
    let optionExpiresAt = input.optionExpiresAt;
    if (!optionExpiresAt) {
      const expDate = new Date();
      expDate.setHours(expDate.getHours() + optionDuration);
      optionExpiresAt = expDate.toISOString();
    }

    const defaultStatus = normalizeReservationStatus(input.status || 'OPTIONED');

    // Müsaitlik kontrolü (Super Admin override edebilmeli)
    const isAvail = this.isSpaceAvailableSync(
      input.spaceId || '', 
      input.spaceCode || '', 
      input.startDate || '', 
      input.endDate || '', 
      newId
    );

    if (!isAvail && !input.overrideConflict) {
      throw new Error('Seçilen mecra belirtilen tarihlerde dolu veya opsiyonludur.');
    }

    const newRecord: any = {
      id: newId,
      spaceCode: input.spaceCode || '',
      spaceName: input.spaceName || '',
      location: input.location || '',
      clientName: input.clientName || '',
      agencyName: input.agencyName || '-',
      startDate: input.startDate || '',
      endDate: input.endDate || '',
      durationDays: input.durationDays || 30,
      status: defaultStatus,
      budget: input.budget || '₺0',
      creativeFiles: input.creativeFiles || [],
      aiRecommendation: input.aiRecommendation || 'Planlama yapıldı.',
      companyId: input.companyId || '',
      spaceId: input.spaceId || '',
      offerId: input.offerId || '',
      contractId: input.contractId || '',
      campaignId: input.campaignId || '',
      
      // Opsiyon verileri
      optionStartedAt,
      optionExpiresAt,
      optionDurationHours: optionDuration,
      optionCreatedBy: email,
      optionExtensionCount: 0,

      // Durum verileri
      contractStatus: input.contractStatus || 'DRAFT',
      salesApprovalStatus: input.salesApprovalStatus || 'PENDING'
    };

    if (isSupabaseConfigured()) {
      try {
        const payload: any = {
          id: newId,
          organization_id: organizationId,
          created_by: email,
          created_at: new Date().toISOString(),
          space_code: newRecord.spaceCode,
          space_name: newRecord.spaceName,
          location: newRecord.location,
          client_name: newRecord.clientName,
          agency_name: newRecord.agencyName,
          start_date: newRecord.startDate,
          end_date: newRecord.endDate,
          duration_days: newRecord.durationDays,
          status: newRecord.status,
          budget: newRecord.budget,
          creative_files: newRecord.creativeFiles,
          ai_recommendation: newRecord.aiRecommendation,
          company_id: newRecord.companyId,
          space_id: newRecord.spaceId,
          offer_id: newRecord.offerId,
          contract_id: newRecord.contractId,
          campaign_id: newRecord.campaignId,
          option_started_at: newRecord.optionStartedAt,
          option_expires_at: newRecord.optionExpiresAt,
          option_duration_hours: newRecord.optionDurationHours,
          option_created_by: newRecord.optionCreatedBy,
          contract_status: newRecord.contractStatus,
          sales_approval_status: newRecord.salesApprovalStatus
        };

        const { error } = await supabase
          .from('reservations')
          .insert([payload]);
        if (error) throw error;
      } catch (e) {
        console.warn('Supabase reservation create failed:', e);
      }
    }

    const local = getLocalData('reservations', reservations);
    local.push(newRecord);
    localStorage.setItem('outdoorcore_mock_reservations', JSON.stringify(local));
    reservations.push(newRecord);

    // Audit log
    const desc = input.overrideConflict 
      ? `Rezervasyon oluşturuldu. Opsiyon Süresi: ${optionDuration} Saat. ⚠️ KAPASİTE ÇAKIŞMASI BİLİNÇLİ AŞILDI. Gerekçe: ${input.conflictOverrideReason || 'Belirtilmedi'}`
      : `Rezervasyon oluşturuldu. Durum: ${newRecord.status}. Opsiyon Süresi: ${optionDuration} Saat.`;
    reservationAuditRepository.log(newId, 'NONE', newRecord.status, desc, email);

    window.dispatchEvent(new Event('storage'));
    return newRecord;
  }
};

export const campaignRepository = {
  getAllSync() {
    return getLocalData('campaigns', campaigns);
  },
  getByIdSync(id: string) {
    const local = this.getAllSync();
    return local.find(c => c.id === id) || local[0];
  },
  async getAll() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('campaigns').select('*');
        if (error) throw error;
        if (data && data.length > 0) {
          return data;
        }
      } catch (e) {
        console.warn('Supabase campaigns fetch failed, using local fallback:', e);
      }
    }
    return getLocalData('campaigns', campaigns);
  },

  async update(id: string, input: any) {
    const { organizationId, email } = getSessionInfo();
    
    if (isSupabaseConfigured()) {
      try {
        const payload: any = {};
        if (input.clientName !== undefined) payload.client_name = input.clientName;
        if (input.campaignName !== undefined) payload.campaign_name = input.campaignName;
        if (input.status !== undefined) payload.status = input.status;
        if (input.startDate !== undefined) payload.start_date = input.startDate;
        if (input.endDate !== undefined) payload.end_date = input.endDate;
        if (input.budget !== undefined) payload.budget = input.budget;
        if (input.mediaAgency !== undefined) payload.media_agency = input.mediaAgency;
        if (input.creativeAgency !== undefined) payload.creative_agency = input.creativeAgency;
        if (input.companyId !== undefined) payload.company_id = input.companyId;
        if (input.contractId !== undefined) payload.contract_id = input.contractId;
        if (input.proposalId !== undefined) payload.proposal_id = input.proposalId;
        if (input.reservationId !== undefined) payload.reservation_id = input.reservationId;
        
        payload.updated_at = new Date().toISOString();
        payload.updated_by = email;

        const { error } = await supabase
          .from('campaigns')
          .update(payload)
          .eq('id', id);
        if (error) throw error;
      } catch (e) {
        console.warn('Supabase campaign update failed:', e);
      }
    }

    const local = getLocalData('campaigns', campaigns);
    const idx = local.findIndex(c => c.id === id);
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...input };
      localStorage.setItem('outdoorcore_mock_campaigns', JSON.stringify(local));
      
      // Sync in-memory mutations
      const cIdx = campaigns.findIndex(c => c.id === id);
      if (cIdx !== -1) {
        campaigns[cIdx] = { ...campaigns[cIdx], ...input };
      }
      return local[idx];
    }
    throw new Error('Campaign not found');
  },
  async create(input: any) {
    const { organizationId, email } = getSessionInfo();
    const newId = input.id || 'CAM-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    
    if (isSupabaseConfigured()) {
      try {
        const payload: any = {
          id: newId,
          organization_id: organizationId,
          created_by: email,
          created_at: new Date().toISOString()
        };
        if (input.clientName !== undefined) payload.client_name = input.clientName;
        if (input.campaignName !== undefined) payload.campaign_name = input.campaignName;
        if (input.status !== undefined) payload.status = input.status;
        if (input.startDate !== undefined) payload.start_date = input.startDate;
        if (input.endDate !== undefined) payload.end_date = input.endDate;
        if (input.budget !== undefined) payload.budget = input.budget;
        if (input.mediaAgency !== undefined) payload.media_agency = input.mediaAgency;
        if (input.creativeAgency !== undefined) payload.creative_agency = input.creativeAgency;
        if (input.companyId !== undefined) payload.company_id = input.companyId;
        if (input.contractId !== undefined) payload.contract_id = input.contractId;
        if (input.proposalId !== undefined) payload.proposal_id = input.proposalId;
        if (input.reservationId !== undefined) payload.reservation_id = input.reservationId;

        const { error } = await supabase
          .from('campaigns')
          .insert([payload]);
        if (error) throw error;
      } catch (e) {
        console.warn('Supabase campaign create failed:', e);
      }
    }

    const local = getLocalData('campaigns', campaigns);
    const newRecord = {
      id: newId,
      ...input
    };
    local.push(newRecord);
    localStorage.setItem('outdoorcore_mock_campaigns', JSON.stringify(local));
    
    // Sync in-memory mutations
    campaigns.push(newRecord);
    
    return newRecord;
  }
};

export const financeRepository = {
  getFinanceDataSync() {
    return getLocalDataObject('finance_data', financeData);
  },
  async getFinanceData() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('finance_data').select('*').single();
        if (error) throw error;
        if (data) return data;
      } catch (e) {
        console.warn('Supabase finance fetch failed, using local:', e);
      }
    }
    return getLocalDataObject('finance_data', financeData);
  },
  async updateInvoicePdf(invoiceId: string, pdfUrl: string) {
    const data = getLocalDataObject('finance_data', financeData);
    let found = false;
    for (const acc of data.accounts) {
      const inv = acc.invoices.find((i: any) => i.id === invoiceId);
      if (inv) {
        (inv as any).pdfUrl = pdfUrl;
        found = true;
        break;
      }
    }
    if (found) {
      setLocalDataObject('finance_data', data);
      
      if (isSupabaseConfigured()) {
        try {
          await supabase.from('invoices').update({ pdf_url: pdfUrl }).eq('id', invoiceId);
        } catch (e) {
          console.warn('Failed to update invoice PDF in Supabase:', e);
        }
      }
      return true;
    }
    throw new Error('Fatura bulunamadı.');
  },
  async createPaymentPlan(companyId: string, clientName: string, amount: number, contractId: string) {
    const data = getLocalDataObject('finance_data', financeData);
    let acc = data.accounts.find((a: any) => a.companyId === companyId || a.id === companyId);
    
    const formattedAmount = `₺ ${amount.toLocaleString('tr-TR')}`;
    const dateStr = new Date().toLocaleDateString('tr-TR');
    
    const newInvoice = {
      id: 'INV-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
      invoiceNo: 'INV-2026-' + Math.floor(10000 + Math.random() * 90000),
      date: dateStr,
      amount: formattedAmount,
      status: 'Bekliyor' as const
    };

    const newInstallment = {
      installment: '1. Taksit',
      dueDate: dateStr,
      amount: formattedAmount,
      status: 'Bekliyor' as const
    };

    if (acc) {
      acc.invoices.push(newInvoice);
      acc.paymentPlan.push(newInstallment);
      if (!acc.linkedContractIds) acc.linkedContractIds = [];
      acc.linkedContractIds.push(contractId);
      const numericDebt = (parseFloat(acc.totalDebt.replace(/[^\d]/g, '')) || 0) + amount;
      const numericBalance = (parseFloat(acc.balance.replace(/[^\d]/g, '')) || 0) + amount;
      acc.totalDebt = `₺ ${numericDebt.toLocaleString('tr-TR')}`;
      acc.balance = `₺ ${numericBalance.toLocaleString('tr-TR')}`;
    } else {
      const newAcc: any = {
        id: companyId,
        name: clientName,
        logo: clientName.charAt(0),
        logoUrl: '',
        totalDebt: formattedAmount,
        totalCollected: '₺ 0',
        balance: formattedAmount,
        riskScore: 1.0,
        crmTier: 'Standard',
        totalContracts: formattedAmount,
        totalInvoicesCount: 1,
        invoices: [newInvoice],
        collections: [],
        paymentPlan: [newInstallment],
        receipts: [],
        notes: ['Yeni finans ödeme planı başlatıldı.'],
        companyId: companyId,
        linkedContractIds: [contractId]
      };
      acc = newAcc;
      data.accounts.push(newAcc);
    }

    setLocalDataObject('finance_data', data);
    return acc;
  }
};

export const mediaRepository = {
  getAllSync() {
    return getLocalData('media', mediaAssets);
  },
  async getAll() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('media').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            name: d.name,
            type: d.type || 'image',
            size: d.size || '0 KB',
            resolution: d.resolution || '1920x1080',
            uploadedBy: d.uploaded_by || '',
            uploadedDate: d.created_at ? new Date(d.created_at).toLocaleDateString('tr-TR') : '',
            version: d.version || 'v1',
            aiTags: Array.isArray(d.ai_tags) ? d.ai_tags : [],
            companyId: d.company_id || '',
            campaignId: d.campaign_id || '',
            spaceIds: Array.isArray(d.space_ids) ? d.space_ids : [],
            status: d.status || 'Pending',
            versionsList: Array.isArray(d.versions_list) ? d.versions_list : [],
            notes: d.notes || ''
          }));
        }
      } catch (e) {
        console.warn('Supabase media fetch failed, fallback to local:', e);
      }
    }
    return getLocalData('media', mediaAssets);
  },
  async create(input: any) {
    const { organizationId, email } = getSessionInfo();
    const newId = 'MED-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    
    const uiAsset = {
      id: newId,
      name: input.name,
      type: input.type || 'image',
      size: input.size || '0 KB',
      resolution: input.resolution || '1920x1080',
      uploadedBy: email,
      uploadedDate: new Date().toLocaleDateString('tr-TR'),
      version: input.version || 'v1',
      aiTags: input.aiTags || [],
      companyId: input.companyId || '',
      campaignId: input.campaignId || '',
      spaceIds: input.spaceIds || [],
      status: 'Pending' as const,
      versionsList: [{
        version: input.version || 'v1',
        date: new Date().toLocaleDateString('tr-TR'),
        file: input.fileUrl || '',
        uploader: email
      }],
      notes: input.notes || ''
    };

    if (isSupabaseConfigured()) {
      try {
        const payload = {
          id: newId,
          organization_id: organizationId,
          name: input.name,
          type: input.type,
          size: input.size,
          resolution: input.resolution || '1920x1080',
          uploaded_by: email,
          version: input.version || 'v1',
          ai_tags: input.aiTags || [],
          company_id: input.companyId || null,
          campaign_id: input.campaignId || null,
          space_ids: input.spaceIds || [],
          status: 'Pending',
          file_url: input.fileUrl || '',
          notes: input.notes || '',
          created_at: new Date().toISOString()
        };
        const { data, error } = await supabase.from('media').insert([payload]).select().single();
        if (error) throw error;
      } catch (e) {
        console.warn('Supabase media creation failed, using mock fallback:', e);
      }
    }

    const local = getLocalData('media', mediaAssets);
    local.unshift(uiAsset);
    setLocalData('media', local);
    return uiAsset;
  }
};

export const taskRepository = {
  getAllSync() {
    return newTaskRepo.list().map(t => ({
      id: t.taskId,
      clientName: t.assignedTo || 'Sistem',
      logo: (t.assignedTo || 'S')[0],
      taskTitle: t.title,
      priority: t.priority === 'low' ? 'Düşük' : t.priority === 'medium' ? 'Orta' : t.priority === 'high' ? 'Yüksek' : 'Kritik' as any,
      dueDate: t.dueDate,
      assignee: t.assignedTo || 'Atanmadı',
      module: t.sourceEntityType === 'contract' ? 'Sözleşme' : t.sourceEntityType === 'offer' ? 'Teklif' : t.sourceEntityType === 'campaign' ? 'Kampanya' : t.sourceEntityType === 'finance' ? 'Finans' : 'Bakım' as any,
      status: t.status === 'todo' ? 'Yapılacak' : t.status === 'in_progress' ? 'Devam Ediyor' : t.status === 'waiting' ? 'Bekliyor' : 'Tamamlandı' as any,
      companyId: t.sourceEntityType === 'company' ? t.sourceEntityId : undefined,
      linkId: t.sourceEntityId
    }));
  },
  async getAll() {
    return this.getAllSync();
  }
};

export const notificationRepository = {
  getAllSync() {
    return newNotifRepo.list().map(n => ({
      id: n.notificationId,
      time: new Date(n.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      user: 'Sistem',
      company: n.title,
      message: n.message,
      category: n.category.toUpperCase(),
      status: (n.type === 'danger' ? 'critical' : n.type === 'info' ? 'info' : n.type === 'success' ? 'success' : 'warning') as any,
      companyId: n.sourceEntityType === 'company' ? n.sourceEntityId : undefined,
      linkId: n.sourceEntityId
    }));
  },
  async getAll() {
    return this.getAllSync();
  }
};

export const maintenanceRepository = {
  getAllSync() {
    return getLocalData('maintenance', maintenanceTasks);
  },
  async getAll() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('maintenance').select('*');
        if (error) throw error;
        if (data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            spaceCode: d.space_code,
            spaceId: d.space_id,
            assignedTechnician: d.assigned_technician,
            issue: d.issue,
            status: d.status,
            urgency: d.urgency,
            replacedParts: d.replaced_parts || [],
            slaTimeMinutes: d.sla_time_minutes || 0,
            scheduledDate: d.scheduled_date,
            completionDate: d.completion_date,
            qrCode: d.qr_code,
            aiRiskScore: d.ai_risk_score || 0,
            photoUrl: d.photo_url || undefined
          }));
        }
      } catch (e) {
        console.warn('Supabase maintenance fetch failed, using local:', e);
      }
    }
    return getLocalData('maintenance', maintenanceTasks);
  },
  async update(id: string, input: any) {
    const { organizationId, email } = getSessionInfo();
    
    if (isSupabaseConfigured()) {
      try {
        const payload = {
          photo_url: input.photoUrl,
          status: input.status,
          replaced_parts: input.replacedParts,
          updated_at: new Date().toISOString(),
          updated_by: email
        };
        const { error } = await supabase
          .from('maintenance')
          .update(payload)
          .eq('id', id);
        if (error) throw error;
      } catch (e) {
        console.warn('Supabase maintenance update failed:', e);
      }
    }

    const local = getLocalData('maintenance', maintenanceTasks);
    const idx = local.findIndex((c: any) => c.id === id);
    if (idx !== -1) {
      local[idx] = {
        ...local[idx],
        ...input,
        updated_at: new Date().toISOString(),
        updated_by: email
      };
      setLocalData('maintenance', local);
      return local[idx];
    }
    throw new Error('Bakım görevi bulunamadı.');
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

export { digitalScreenRepository } from './digitalScreenRepository';
