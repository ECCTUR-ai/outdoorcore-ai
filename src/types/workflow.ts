import { Company } from '@/data/companies';
import { AdvertisingSpace } from '@/data/advertisingSpaces';

export type WizardStepId = 
  | 'company'
  | 'spaces'
  | 'offer'
  | 'contract'
  | 'reservation'
  | 'campaign'
  | 'finance'
  | 'summary';

export interface WorkflowState {
  currentStep: WizardStepId;
  completedSteps: WizardStepId[];
  data: {
    company: Company | null;
    selectedSpaces: AdvertisingSpace[];
    offer: {
      campaignName: string;
      value: string;
      valueNumeric: number;
      closeProbability: number;
      closingDate: string;
      notes: string;
      id?: string;
    } | null;
    contract: {
      contractNo: string;
      startDate: string;
      endDate: string;
      notes: string;
    } | null;
    reservation: {
      startDate: string;
      endDate: string;
      notes: string;
    } | null;
    campaign: {
      name: string;
      budget: string;
      objective: string;
      targetAudience: string;
    } | null;
    finance: {
      paymentMethod: 'Kredi Kartı' | 'Havale/EFT' | 'Çek' | 'DBS';
      installmentCount: number;
      billingAddress: string;
      taxNo: string;
      taxOffice: string;
    } | null;
  };
}
