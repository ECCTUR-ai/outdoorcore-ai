import { DigitalScreen, PlaylistSlot, DigitalScreenAvailability } from '@/types/digitalSignage';
import { digitalScreens as defaultScreens, playlistSlots as defaultSlots } from '@/data/digitalScreens';
import { createWorkflowEvent } from '@/automation/workflowEvents';
import { workflowEngine } from '@/automation/workflowEngine';
import { notificationRepository } from '@/notifications/notificationRepository';
import { auditLogRepository, activityLogRepository, spaceRepository } from './index';
import { calculateCampaignDays } from '@/utils/dateHelper';

const SCREENS_STORAGE_KEY = 'outdoorcore_digital_screens';
const SLOTS_STORAGE_KEY = 'outdoorcore_playlist_slots';

const getLocalData = <T>(key: string, initialData: T[]): T[] => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(key, JSON.stringify(initialData));
  } catch (e) {
    console.error(`Error reading ${key}:`, e);
  }
  return initialData;
};

const setLocalData = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error writing ${key}:`, e);
  }
};

const parseDDMMYYYY = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  // If YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return new Date(dateStr);
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

export const digitalScreenRepository = {
  listScreens(): DigitalScreen[] {
    const spaces = spaceRepository.getAllSync();
    const storedScreens = getLocalData<DigitalScreen>(SCREENS_STORAGE_KEY, defaultScreens);
    const storedMap = new Map(storedScreens.map(s => [s.screenCode, s]));

    // Filter digital/LED spaces
    const digitalSpaces = spaces.filter((s: any) => 
      s.isDigital || 
      String(s.type || '').toUpperCase() === 'LED' ||
      String(s.mediaType || '').toLowerCase().includes('dijital')
    );

    return digitalSpaces.map((s: any) => {
      const stored = storedMap.get(s.code);
      const res = s.resolution && s.resolution !== '-' ? s.resolution : (stored?.resolution || '3840x2160 (4K UHD)');
      const loopDuration = stored?.loopDurationSeconds || 120;
      
      // Total M2
      let totalM2 = 0;
      if (s.width && s.height) {
        totalM2 = parseFloat((s.width * s.height).toFixed(2));
      } else if (s.size) {
        const match = s.size.match(/([\d,.]+)\s*[*x×]\s*([\d,.]+)/);
        if (match) {
          const w = parseFloat(match[1].replace(',', '.'));
          const h = parseFloat(match[2].replace(',', '.'));
          if (!isNaN(w) && !isNaN(h)) {
            totalM2 = parseFloat((w * h).toFixed(2));
          }
        }
      }
      if (!totalM2 && stored?.totalM2) {
        totalM2 = stored.totalM2;
      }

      return {
        screenId: s.id,
        screenCode: s.code,
        name: s.name,
        location: s.location || '-',
        terminal: s.terminal || s.location || '-',
        floor: s.floor || '-',
        totalM2: totalM2 || 0,
        resolution: res,
        loopDurationSeconds: loopDuration,
        status: s.status === 'bakim' ? 'maintenance' : (s.isActive ? 'active' : 'inactive'),
        monthlyBasePrice: s.priceNumeric || 0,
        dailyTraffic: s.traffic || 0,
        visibility: s.visibility === 'Yüksek' ? 'Yüksek' : (s.visibility === 'Çok Yüksek' ? 'Çok Yüksek' : 'Orta'),
        notes: s.notes || ''
      };
    });
  },

  createScreen(input: {
    screenCode: string;
    name: string;
    location: string;
    terminal: string;
    floor: string;
    totalM2?: number;
    resolution?: string;
    loopDurationSeconds?: number;
    monthlyBasePrice: number;
    dailyTraffic?: number;
    visibility: 'Çok Yüksek' | 'Yüksek' | 'Orta';
    status: 'active' | 'maintenance' | 'inactive';
    notes?: string;
  }): DigitalScreen {
    const screens = this.listScreens();
    const existing = screens.find(s => s.screenCode === input.screenCode);
    if (existing) {
      return this.updateScreen(existing.screenId, input);
    }

    const newScreen: DigitalScreen = {
      screenId: input.screenCode,
      screenCode: input.screenCode,
      name: input.name,
      location: input.location,
      terminal: input.terminal,
      floor: input.floor,
      totalM2: input.totalM2 || 0,
      resolution: input.resolution || '3840x2160 (4K UHD)',
      loopDurationSeconds: input.loopDurationSeconds || 120,
      monthlyBasePrice: input.monthlyBasePrice,
      dailyTraffic: input.dailyTraffic || 0,
      visibility: input.visibility,
      status: 'active',
      notes: input.notes || ''
    };

    screens.push(newScreen);
    setLocalData(SCREENS_STORAGE_KEY, screens);
    return newScreen;
  },

  updateScreen(id: string, input: Partial<DigitalScreen>): DigitalScreen {
    const screens = this.listScreens();
    const idx = screens.findIndex(s => s.screenId === id);
    if (idx === -1) {
      throw new Error('LED Ekran bulunamadı.');
    }

    screens[idx] = {
      ...screens[idx],
      ...input,
      screenId: id,
      screenCode: input.screenCode || screens[idx].screenCode
    };

    setLocalData(SCREENS_STORAGE_KEY, screens);
    return screens[idx];
  },

  dedupePlaylistSlots(slots: PlaylistSlot[]): PlaylistSlot[] {
    const seenIds = new Set<string>();
    const seenKeys = new Set<string>();
    const deduped: PlaylistSlot[] = [];

    for (const slot of slots) {
      const uniqueKey = `${slot.screenId}_${slot.companyId}_${slot.startDate}_${slot.endDate}_${slot.durationSeconds}_${slot.creativeFileUrl}`;
      if (seenIds.has(slot.slotId) || seenKeys.has(uniqueKey)) {
        continue;
      }
      seenIds.add(slot.slotId);
      seenKeys.add(uniqueKey);
      deduped.push(slot);
    }
    return deduped;
  },

  listPlaylistSlots(screenId?: string, dateRange?: { startDate: string; endDate: string }): PlaylistSlot[] {
    let slots = getLocalData(SLOTS_STORAGE_KEY, defaultSlots);
    
    const deduped = this.dedupePlaylistSlots(slots);
    if (deduped.length !== slots.length) {
      setLocalData(SLOTS_STORAGE_KEY, deduped);
      slots = deduped;
    }
    
    if (screenId) {
      slots = slots.filter(s => s.screenId === screenId);
    }
    
    if (dateRange) {
      const filterStart = parseDDMMYYYY(dateRange.startDate);
      const filterEnd = parseDDMMYYYY(dateRange.endDate);
      
      if (filterStart && filterEnd) {
        slots = slots.filter(s => {
          const slotStart = parseDDMMYYYY(s.startDate);
          const slotEnd = parseDDMMYYYY(s.endDate);
          if (slotStart && slotEnd) {
            return slotStart < filterEnd && slotEnd > filterStart;
          }
          return true;
        });
      }
    }
    
    return slots;
  },

  cancelPlaylistSlots(campaignId: string, screenId?: string) {
    let slots = getLocalData<PlaylistSlot>(SLOTS_STORAGE_KEY, defaultSlots);
    slots = slots.map(s => {
      if (s.campaignId === campaignId && (!screenId || s.screenId === screenId)) {
        return { ...s, status: 'cancelled' };
      }
      return s;
    });
    setLocalData(SLOTS_STORAGE_KEY, slots);
  },

  getAvailability(screenId: string, startDate: string, endDate: string): DigitalScreenAvailability {
    const screens = this.listScreens();
    const screen = screens.find(s => s.screenId === screenId) || screens[0];
    
    // Find active slots on this screen that overlap with target date range
    const overlappingSlots = this.listPlaylistSlots(screenId, { startDate, endDate })
      .filter(s => s.status === 'active');
    
    const usedSeconds = overlappingSlots.reduce((sum, s) => sum + s.durationSeconds, 0);
    const availableSeconds = Math.max(0, screen.loopDurationSeconds - usedSeconds);
    const occupancyPercent = Math.min(100, Math.round((usedSeconds / screen.loopDurationSeconds) * 100));
    
    return {
      screenId,
      dateRange: { startDate, endDate },
      loopDurationSeconds: screen.loopDurationSeconds,
      usedSeconds,
      availableSeconds,
      occupancyPercent,
      slots: overlappingSlots
    };
  },

  calculateSlotPrice(screenId: string, durationSeconds: number, startDate: string, endDate: string): number {
    const screens = this.listScreens();
    const screen = screens.find(s => s.screenId === screenId);
    if (!screen) return 0;
    
    // Base formula: monthlyBasePrice * (durationSeconds / loopDurationSeconds)
    const baseMonthlyPrice = screen.monthlyBasePrice * (durationSeconds / screen.loopDurationSeconds);
    
    // Calculate date range proportion relative to 30 days
    const diffDays = calculateCampaignDays(startDate, endDate);
    if (diffDays > 0) {
      const dayProportion = diffDays / 30;
      return Math.round(baseMonthlyPrice * dayProportion);
    }
    
    return Math.round(baseMonthlyPrice);
  },

  calculateEstimatedPlays(screenId: string): number {
    const screens = this.listScreens();
    const screen = screens.find(s => s.screenId === screenId);
    if (!screen) return 0;
    
    // 24 hours * 60 minutes * 60 seconds = 86400 seconds per day
    return Math.round(86400 / screen.loopDurationSeconds);
  },

  async createPlaylistSlot(input: {
    screenId: string;
    companyId: string;
    companyName: string;
    campaignId?: string;
    startDate: string;
    endDate: string;
    durationSeconds: number;
    creativeFileUrl?: string;
    notes?: string;
  }): Promise<PlaylistSlot> {
    const screens = this.listScreens();
    const screen = screens.find(s => s.screenId === input.screenId);
    if (!screen) throw new Error('LED Ekran bulunamadı.');

    const allSlots = getLocalData<PlaylistSlot>(SLOTS_STORAGE_KEY, defaultSlots);
    const existingSlot = allSlots.find(s => 
      s.screenId === input.screenId &&
      s.companyId === input.companyId &&
      s.startDate === input.startDate &&
      s.endDate === input.endDate &&
      s.durationSeconds === input.durationSeconds &&
      s.creativeFileUrl === (input.creativeFileUrl || 'creative-placeholder.mp4')
    );

    if (existingSlot) {
      console.log("LED reservation submit ignored duplicate", existingSlot);
      return existingSlot;
    }

    // 1. Validation
    const availability = this.getAvailability(input.screenId, input.startDate, input.endDate);
    if (input.durationSeconds > availability.availableSeconds) {
      throw new Error(`Bu LED ekranda seçilen tarih aralığında sadece ${availability.availableSeconds} saniye boş slot var.`);
    }

    // 2. Calculations
    const sharePercent = parseFloat(((input.durationSeconds / screen.loopDurationSeconds) * 100).toFixed(1));
    const estimatedPlaysPerDay = this.calculateEstimatedPlays(input.screenId);
    const price = this.calculateSlotPrice(input.screenId, input.durationSeconds, input.startDate, input.endDate);

    const slotId = 'SLT-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    
    const newSlot: PlaylistSlot = {
      slotId,
      screenId: input.screenId,
      companyId: input.companyId,
      companyName: input.companyName,
      campaignId: input.campaignId,
      startDate: input.startDate,
      endDate: input.endDate,
      durationSeconds: input.durationSeconds,
      sharePercent,
      estimatedPlaysPerDay,
      price,
      status: 'active',
      creativeFileUrl: input.creativeFileUrl || 'creative-placeholder.mp4',
      order: allSlots.filter(s => s.screenId === input.screenId).length + 1
    };

    allSlots.push(newSlot);
    setLocalData(SLOTS_STORAGE_KEY, allSlots);

    // 3. Workflow triggers & Notification dispatch
    try {
      const wfEvent = createWorkflowEvent(
        'digital_slot.created', 
        'digital_slot', 
        slotId, 
        {
          clientName: input.companyName,
          companyId: input.companyId,
          screenCode: screen.screenCode,
          durationSeconds: input.durationSeconds
        }
      );
      workflowEngine.dispatchWorkflowEvent(wfEvent);
      
      // Dispatch notification
      notificationRepository.create({
        organizationId: '00000000-0000-0000-0000-000000000001',
        userId: 'usr-demo',
        title: 'LED Slotu Oluşturuldu',
        message: `${input.companyName} için ${screen.screenCode} üzerinde ${input.durationSeconds} saniyelik yayın slotu oluşturuldu.`,
        type: 'success',
        priority: 'high',
        category: 'workflow',
        sourceEntityType: 'reservation',
        sourceEntityId: slotId,
        channel: 'in_app'
      });

      // Audit Log
      await auditLogRepository.log('digital_slot.created', 'digital_slot', slotId);
      await activityLogRepository.log(`LED playlist slotu oluşturuldu.`, 'spaces');

    } catch (e) {
      console.warn('Failed to dispatch digital slot workflow/notification:', e);
    }

    console.log("LED reservation created once", newSlot);
    return newSlot;
  }
};
