import { WorkflowState } from '@/types/workflow';
import { 
  companyRepository, 
  spaceRepository, 
  offerRepository,
  financeRepository,
  activityLogRepository
} from '@/repositories';

function safeBackgroundTask(name: string, fn: () => Promise<any>) {
  setTimeout(() => {
    fn().catch(err => {
      console.error(`Background task [${name}] failed:`, err);
    });
  }, 0);
}

export const workflowService = {
  async commitSalesWorkflow(state: WorkflowState): Promise<{ success: boolean; data?: any; error?: string }> {
    const startTotal = performance.now();
    console.log("commitSalesWorkflow started", state.data);

    const { company, selectedSpaces, offer, contract, reservation, campaign, finance } = state.data;
    if (!company || selectedSpaces.length === 0 || !offer || !contract || !reservation || !campaign || !finance) {
      return { success: false, error: 'Eksik adım bilgisi. Lütfen tüm adımları doldurun.' };
    }

    try {
      // 1. Save Offer in OfferRepository (Kritik)
      const startOffer = performance.now();
      const spaceIds = selectedSpaces.map(s => s.id);
      const createdOffer = await offerRepository.create({
        companyId: company.id,
        campaignName: offer.campaignName,
        value: offer.value,
        valueNumeric: offer.valueNumeric,
        stage: 'Onay Bekleniyor',
        closeProbability: offer.closeProbability,
        closingDate: offer.closingDate,
        owner: 'Cemil Sezgin',
        spaceIds,
        details: offer.notes,
        notes: 'Yeni Satış Sihirbazı tarafından otomatik oluşturuldu.'
      });
      console.log(`commitSalesWorkflow Step 1: Save Offer took ${(performance.now() - startOffer).toFixed(2)} ms`);

      // 2. Update Spaces Status in spaceRepository in parallel (Kritik)
      const startSpaces = performance.now();
      await Promise.all(
        selectedSpaces.map(space => 
          spaceRepository.update(space.id, {
            ...space,
            status: 'teklif'
          })
        )
      );
      console.log(`commitSalesWorkflow Step 2: Update Space Statuses took ${(performance.now() - startSpaces).toFixed(2)} ms`);

      const mockContractId = 'CON-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      const mockReservationId = 'RES-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      const mockCampaignId = 'CAM-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      const mockInvoiceId = 'INV-' + Math.random().toString(36).substring(2, 6).toUpperCase();

      // 3. Save Reservation to Calendar (Kritik)
      const startRes = performance.now();
      const newReservation = {
        id: mockReservationId,
        contractId: mockContractId,
        clientName: company.name,
        campaignName: campaign.name,
        startDate: reservation.startDate,
        endDate: reservation.endDate,
        spaceCodes: selectedSpaces.map(s => s.code),
        spaceIds: selectedSpaces.map(s => s.id),
        status: 'Rezerve' as const,
        notes: reservation.notes
      };
      try {
        const storedReservations = localStorage.getItem('outdoorcore_mock_reservations');
        const list = storedReservations ? JSON.parse(storedReservations) : [];
        list.push(newReservation);
        localStorage.setItem('outdoorcore_mock_reservations', JSON.stringify(list));
      } catch (e) {
        console.error('Failed to append to local reservations:', e);
      }
      console.log(`commitSalesWorkflow Step 3: Save Reservation took ${(performance.now() - startRes).toFixed(2)} ms`);

      // --- Background tasks (B) ---

      // Background Step 4: Save Contract
      safeBackgroundTask("Save Contract", async () => {
        const startContract = performance.now();
        const newContract = {
          id: mockContractId,
          contractNo: contract.contractNo,
          companyId: company.id,
          clientName: company.name,
          campaignId: mockCampaignId,
          campaignName: campaign.name,
          status: 'Onay Bekliyor' as const,
          crmTier: company.crmStatus || 'Lead',
          value: offer.value,
          daysLeft: 30,
          startDate: contract.startDate,
          endDate: contract.endDate,
          mediaAgency: company.mediaAgency || '-',
          proposalId: createdOffer.id,
          reservationId: mockReservationId,
          notes: [contract.notes].filter(Boolean),
          installments: [
            { id: 'INST-1', installment: '1. Taksit', dueDate: contract.startDate, amount: offer.value, status: 'Bekliyor' as const }
          ],
          spacesList: selectedSpaces.map(s => s.code),
          filesList: [],
          history: [],
          aiRiskAnalysis: []
        };
        const storedContracts = localStorage.getItem('outdoorcore_mock_contracts');
        const list = storedContracts ? JSON.parse(storedContracts) : [];
        list.push(newContract);
        localStorage.setItem('outdoorcore_mock_contracts', JSON.stringify(list));
        console.log(`commitSalesWorkflow Background Step 4: Save Contract took ${(performance.now() - startContract).toFixed(2)} ms`);
      });

      // Background Step 5: Save Campaign
      safeBackgroundTask("Save Campaign", async () => {
        const startCamp = performance.now();
        const newCampaign = {
          id: mockCampaignId,
          companyId: company.id,
          campaignName: campaign.name,
          clientName: company.name,
          budget: campaign.budget,
          objective: campaign.objective,
          targetAudience: campaign.targetAudience,
          status: 'Hazırlık' as const,
          startDate: contract.startDate,
          endDate: contract.endDate,
          spacesCount: selectedSpaces.length,
          creativeCount: 0,
          aiScore: 90
        };
        const storedCampaigns = localStorage.getItem('outdoorcore_mock_campaigns');
        const list = storedCampaigns ? JSON.parse(storedCampaigns) : [];
        list.push(newCampaign);
        localStorage.setItem('outdoorcore_mock_campaigns', JSON.stringify(list));
        console.log(`commitSalesWorkflow Background Step 5: Save Campaign took ${(performance.now() - startCamp).toFixed(2)} ms`);
      });

      // Background Step 6: Save Finance
      safeBackgroundTask("Save Finance", async () => {
        const startFin = performance.now();
        const financeData = financeRepository.getFinanceDataSync();
        let account = financeData.accounts.find((a: any) => a.companyId === company.id);
        
        const newInvoice = {
          id: mockInvoiceId,
          invoiceNo: 'FTR-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
          date: new Date().toLocaleDateString('tr-TR'),
          amount: offer.value,
          status: 'Bekliyor' as const
        };

        if (!account) {
          account = {
            id: 'ACC-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
            name: company.name,
            logo: company.name.charAt(0).toUpperCase(),
            totalDebt: offer.value,
            totalCollected: '₺0',
            balance: offer.value,
            riskScore: 20,
            crmTier: company.crmStatus === 'VIP' ? 'VIP' : 'Gold',
            totalContracts: '1',
            totalInvoicesCount: 1,
            invoices: [newInvoice],
            collections: [],
            paymentPlan: [],
            receipts: [],
            notes: ['Yeni Satış Sihirbazı ile fatura hesabı otomatik açıldı.'],
            companyId: company.id
          };
          financeData.accounts.push(account);
        } else {
          account.invoices.push(newInvoice);
          account.totalInvoicesCount += 1;
        }
        
        localStorage.setItem('outdoorcore_mock_finance_data', JSON.stringify(financeData));
        console.log(`commitSalesWorkflow Background Step 6: Save Finance took ${(performance.now() - startFin).toFixed(2)} ms`);
      });

      // Background Step 7: Activity Log & Audit logs
      safeBackgroundTask("Activity Log", async () => {
        const startLog = performance.now();
        await activityLogRepository.log(`Yeni satış sihirbazı süreci tamamlandı: ${company.name} - ${campaign.name}`, 'sales.wizard_complete');
        console.log(`commitSalesWorkflow Background Step 7: Log Activity took ${(performance.now() - startLog).toFixed(2)} ms`);
      });

      console.log(`commitSalesWorkflow Total execution took ${(performance.now() - startTotal).toFixed(2)} ms`);

      return {
        success: true,
        data: {
          opportunityId: 'OPP-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
          offerId: createdOffer.id,
          reservationIds: [mockReservationId]
        }
      };
    } catch (e: any) {
      console.error('Error committing sales workflow:', e);
      return { success: false, error: e.message || 'Satış süreci kaydedilerken bir hata oluştu.' };
    }
  }
};
