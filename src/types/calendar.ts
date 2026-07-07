export interface CalendarEvent {
  eventId: string;
  title: string;
  description: string;
  type: 'reservation' | 'campaign' | 'contract_expiry' | 'invoice_due' | 'maintenance' | 'task' | 'workflow';
  start: string; // ISO Date YYYY-MM-DD
  end: string;   // ISO Date YYYY-MM-DD
  status: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  sourceEntityType: 'reservation' | 'campaign' | 'contract' | 'invoice' | 'maintenance' | 'task' | 'workflow' | 'company' | 'space' | 'offer';
  sourceEntityId: string;
  relatedEntities?: any[];
  assignedTo?: string;
  location?: string;
  spaceIds?: string[];
  companyId?: string;
  amount?: number;
  color?: string;
  createdAt?: string;
}
