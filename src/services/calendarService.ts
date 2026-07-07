import { CalendarEvent } from '@/types/calendar';
import { 
  reservationRepository, 
  campaignRepository, 
  contractRepository, 
  financeRepository, 
  maintenanceRepository, 
  taskRepository 
} from '@/repositories';
import { workflowAuditRepository } from '@/automation/workflowAudit';

const LOCAL_STORAGE_KEY = 'outdoorcore_calendar_events_custom';

// Date parser helper to standard ISO YYYY-MM-DD
const parseTurkishDate = (str: string): string => {
  if (!str) return new Date().toISOString().split('T')[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  if (/^\d{4}-\d{2}-\d{2}T/.test(str)) return str.split('T')[0];
  
  if (str.includes('.')) {
    const parts = str.split('.');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
  }

  const months: Record<string, string> = {
    'oca': '01', 'şub': '02', 'mar': '03', 'nis': '04', 'may': '05', 'haz': '06',
    'tem': '07', 'ağu': '08', 'eyl': '09', 'eki': '10', 'kas': '11', 'ara': '12'
  };
  
  const cleanStr = str.toLowerCase().replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ç/g, 'c');
  const parts = cleanStr.split(' ');
  if (parts.length >= 3) {
    const day = parts[0].padStart(2, '0');
    let monthName = parts[1].substring(0, 3);
    // map Turkish month names
    if (monthName === 'nis') monthName = 'nis';
    if (monthName === 'may') monthName = 'may';
    if (monthName === 'haz') monthName = 'haz';
    if (monthName === 'tem') monthName = 'tem';
    if (monthName === 'agu') monthName = 'ağu';
    if (monthName === 'eyl') monthName = 'eyl';
    if (monthName === 'eki') monthName = 'eki';
    if (monthName === 'kas') monthName = 'kas';
    if (monthName === 'ara') monthName = 'ara';
    
    const month = months[monthName] || '01';
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  
  const d = new Date(str);
  return isNaN(d.getTime()) ? new Date().toISOString().split('T')[0] : d.toISOString().split('T')[0];
};

export const calendarService = {
  // Get custom created/edited events from localStorage
  getCustomEvents(): CalendarEvent[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  setCustomEvents(events: CalendarEvent[]) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
      console.error('Failed to save custom calendar events:', e);
    }
  },

  // Merge custom events with auto-generated events
  async getCalendarEvents(): Promise<CalendarEvent[]> {
    const reposEvents = await this.generateEventsFromRepositories();
    const customEvents = this.getCustomEvents();
    
    // Filter out overridden repository events by key
    const customEventIds = new Set(customEvents.map(e => e.eventId));
    const merged = [
      ...reposEvents.filter(e => !customEventIds.has(e.eventId)),
      ...customEvents
    ];

    // Conflict control for reservation type events
    this.flagConflicts(merged);

    return merged;
  },

  async getEventsByDateRange(start: string, end: string): Promise<CalendarEvent[]> {
    const all = await this.getCalendarEvents();
    const sDate = new Date(start);
    const eDate = new Date(end);
    return all.filter(e => {
      const evStart = new Date(e.start);
      const evEnd = new Date(e.end);
      return evStart <= eDate && evEnd >= sDate;
    });
  },

  async getEventsByType(type: CalendarEvent['type']): Promise<CalendarEvent[]> {
    const all = await this.getCalendarEvents();
    return all.filter(e => e.type === type);
  },

  async createCalendarEvent(input: Omit<CalendarEvent, 'eventId' | 'createdAt'>): Promise<CalendarEvent> {
    const id = 'EVT-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    const newEvent: CalendarEvent = {
      ...input,
      eventId: id,
      createdAt: new Date().toISOString()
    };
    
    const custom = this.getCustomEvents();
    custom.push(newEvent);
    this.setCustomEvents(custom);
    return newEvent;
  },

  async updateCalendarEvent(id: string, input: Partial<CalendarEvent>): Promise<CalendarEvent> {
    // Check if it exists in custom events
    const custom = this.getCustomEvents();
    const idx = custom.findIndex(e => e.eventId === id);
    
    if (idx !== -1) {
      custom[idx] = { ...custom[idx], ...input };
      this.setCustomEvents(custom);
      return custom[idx];
    } else {
      // If it's a repository event, fetch it, copy it to custom, and edit it
      const allRepos = await this.generateEventsFromRepositories();
      const reposEvent = allRepos.find(e => e.eventId === id);
      if (reposEvent) {
        const newCustom = { ...reposEvent, ...input };
        custom.push(newCustom);
        this.setCustomEvents(custom);
        return newCustom;
      }
    }
    throw new Error('Event not found');
  },

  async moveCalendarEvent(id: string, newStart: string, newEnd: string): Promise<CalendarEvent> {
    return this.updateCalendarEvent(id, { start: newStart, end: newEnd });
  },

  async deleteCalendarEvent(id: string): Promise<boolean> {
    const custom = this.getCustomEvents();
    const filtered = custom.filter(e => e.eventId !== id);
    if (filtered.length !== custom.length) {
      this.setCustomEvents(filtered);
      return true;
    }
    // If it's a repository event, we mark it as deleted by storing a deleted flag or just ignoring it.
    // To make it simple, we can add a delete marker in custom storage.
    const deletedIds = JSON.parse(localStorage.getItem('outdoorcore_calendar_deleted_ids') || '[]');
    deletedIds.push(id);
    localStorage.setItem('outdoorcore_calendar_deleted_ids', JSON.stringify(deletedIds));
    return true;
  },

  // Map and generate events from active data repositories
  async generateEventsFromRepositories(): Promise<CalendarEvent[]> {
    const events: CalendarEvent[] = [];
    const deletedIds = new Set<string>(JSON.parse(localStorage.getItem('outdoorcore_calendar_deleted_ids') || '[]'));

    try {
      // 1. Reservations
      const reservations = await reservationRepository.getAll();
      reservations.forEach((r: any) => {
        const startIso = parseTurkishDate(r.startDate);
        const endIso = parseTurkishDate(r.endDate);
        const eId = `rsv-${r.id}`;
        
        if (deletedIds.has(eId)) return;

        events.push({
          eventId: eId,
          title: `${r.clientName} - ${r.spaceCode}`,
          description: r.aiRecommendation || 'Açıkhava reklam alanı kiralama rezervasyonu.',
          type: 'reservation',
          start: startIso,
          end: endIso,
          status: r.status,
          priority: 'medium',
          sourceEntityType: 'reservation',
          sourceEntityId: r.id,
          companyId: r.companyId,
          spaceIds: r.spaceId ? [r.spaceId] : [],
          amount: parseFloat((r.budget || '').replace(/[^0-9]/g, '')) || 0
        });
      });

      // 2. Campaigns
      const campaigns = await campaignRepository.getAll();
      campaigns.forEach((c: any) => {
        const startIso = parseTurkishDate(c.startDate);
        const endIso = parseTurkishDate(c.endDate);
        const eId = `cam-${c.id}`;

        if (deletedIds.has(eId)) return;

        events.push({
          eventId: eId,
          title: `${c.clientName} - ${c.campaignName}`,
          description: `Kampanya Bütçesi: ${c.budget}. Ajans: ${c.mediaAgency}. Kreatif sayısı: ${c.creativesCount}.`,
          type: 'campaign',
          start: startIso,
          end: endIso,
          status: c.status,
          priority: 'high',
          sourceEntityType: 'campaign',
          sourceEntityId: c.id,
          companyId: c.companyId,
          spaceIds: c.spaceIds || []
        });
      });

      // 3. Contracts
      const contracts = await contractRepository.getAll();
      contracts.forEach((con: any) => {
        const endIso = parseTurkishDate(con.endDate);
        const eId = `con-${con.id}`;

        if (deletedIds.has(eId)) return;

        events.push({
          eventId: eId,
          title: `${con.clientName} - Sözleşme Bitiş`,
          description: `Sözleşme No: ${con.contractNo}. Toplam Değer: ${con.value}. Kalan Gün: ${con.daysLeft}.`,
          type: 'contract_expiry',
          start: endIso,
          end: endIso,
          status: con.status,
          priority: con.aiRiskScore > 7 ? 'critical' : 'medium',
          sourceEntityType: 'contract',
          sourceEntityId: con.id,
          companyId: con.companyId,
          spaceIds: con.spacesList || []
        });
      });

      // 4. Invoices/Payments
      const finance = await financeRepository.getFinanceData();
      if (finance && finance.accounts) {
        finance.accounts.forEach((acc: any) => {
          if (acc.invoices) {
            acc.invoices.forEach((inv: any) => {
              const startIso = parseTurkishDate(inv.date);
              const eId = `inv-${inv.id}`;

              if (deletedIds.has(eId)) return;

              events.push({
                eventId: eId,
                title: `${acc.name} - Fatura Vadesi`,
                description: `Fatura No: ${inv.invoiceNo}. Durum: ${inv.status}.`,
                type: 'invoice_due',
                start: startIso,
                end: startIso,
                status: inv.status,
                priority: inv.status === 'Gecikti' ? 'critical' : 'medium',
                sourceEntityType: 'invoice',
                sourceEntityId: inv.id,
                companyId: acc.companyId,
                amount: parseFloat((inv.amount || '').replace(/[^0-9]/g, '')) || 0
              });
            });
          }
        });
      }

      // 5. Maintenance
      const maintenance = await maintenanceRepository.getAll();
      maintenance.forEach((m: any) => {
        const startIso = parseTurkishDate(m.scheduledDate);
        const eId = `maint-${m.id}`;

        if (deletedIds.has(eId)) return;

        events.push({
          eventId: eId,
          title: `${m.spaceCode} - ${m.issue}`,
          description: `Teknisyen: ${m.assignedTechnician || 'Atanmadı'}. SLA Süresi: ${m.slaTimeMinutes} dk.`,
          type: 'maintenance',
          start: startIso,
          end: m.completionDate ? parseTurkishDate(m.completionDate) : startIso,
          status: m.status,
          priority: m.urgency === 'Kritik' || m.urgency === 'Yüksek' ? 'critical' : 'medium',
          sourceEntityType: 'maintenance',
          sourceEntityId: m.id
        });
      });

      // 6. Tasks
      const tasks = await taskRepository.getAll();
      tasks.forEach((t: any) => {
        const startIso = parseTurkishDate(t.dueDate);
        const eId = `task-${t.id}`;

        if (deletedIds.has(eId)) return;

        events.push({
          eventId: eId,
          title: `${t.taskTitle}`,
          description: `Sorumlu: ${t.assignee || 'Sistem'}. Kaynak Modül: ${t.module}.`,
          type: 'task',
          start: startIso,
          end: startIso,
          status: t.status,
          priority: t.priority === 'Kritik' || t.priority === 'Yüksek' ? 'critical' : 'medium',
          sourceEntityType: 'task',
          sourceEntityId: t.id,
          companyId: t.companyId
        });
      });

      // 7. Workflows
      const workflowLogs = workflowAuditRepository.getLogs();
      workflowLogs.forEach((w: any) => {
        const startIso = parseTurkishDate(w.createdAt);
        const eId = `wf-${w.eventId}`;

        if (deletedIds.has(eId)) return;

        events.push({
          eventId: eId,
          title: `${w.eventType} Akışı`,
          description: `İşlem Durumu: ${w.status}. İşlenen Aksiyonlar: ${w.processedActions.join(', ')}`,
          type: 'workflow',
          start: startIso,
          end: startIso,
          status: w.status,
          priority: 'low',
          sourceEntityType: 'workflow',
          sourceEntityId: w.sourceEntityId
        });
      });

    } catch (e) {
      console.error('Failed to build repository-driven events:', e);
    }

    return events;
  },

  // Identify date range overlaps and flag conflicts
  flagConflicts(events: CalendarEvent[]) {
    // Map of spaceId/spaceCode -> active reservation events
    const reservations = events.filter(e => e.type === 'reservation' && e.status !== 'İptal');
    
    for (let i = 0; i < reservations.length; i++) {
      const eA = reservations[i];
      if (!eA.spaceIds || eA.spaceIds.length === 0) continue;
      
      const startA = new Date(eA.start);
      const endA = new Date(eA.end);
      
      for (let j = i + 1; j < reservations.length; j++) {
        const eB = reservations[j];
        if (!eB.spaceIds || eB.spaceIds.length === 0) continue;

        // Check if they share any space ID
        const sharesSpace = eA.spaceIds.some(id => eB.spaceIds?.includes(id));
        if (sharesSpace) {
          const startB = new Date(eB.start);
          const endB = new Date(eB.end);

          // Check for date overlap
          if (startA <= endB && endA >= startB) {
            // Flag conflict!
            eA.color = 'red';
            eB.color = 'red';
            eA.status = 'Çakışma Riski';
            eB.status = 'Çakışma Riski';
            eA.description = `⚠️ ÇAKIŞMA UYARISI: Bu rezervasyon, ${eB.title} ile aynı reklam alanını (${eA.start} - ${eA.end}) aralığında paylaşıyor.`;
            eB.description = `⚠️ ÇAKIŞMA UYARISI: Bu rezervasyon, ${eA.title} ile aynı reklam alanını (${eB.start} - ${eB.end}) aralığında paylaşıyor.`;
          }
        }
      }
    }
  }
};
