export type CompanyId = string;
export type SpaceId = string;
export type OfferId = string;
export type ContractId = string;
export type ReservationId = string;
export type CampaignId = string;
export type InvoiceId = string;
export type PaymentId = string;
export type TaskId = string;
export type NotificationId = string;

export type EntityType =
  | 'company'
  | 'space'
  | 'offer'
  | 'contract'
  | 'reservation'
  | 'campaign'
  | 'invoice'
  | 'payment'
  | 'task'
  | 'notification';

export interface EntityReference {
  id: string;
  type: EntityType;
  label: string;
  route: string;
}
