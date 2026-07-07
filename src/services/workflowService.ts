import { WorkflowState } from '@/types/workflow';
import { 
  companyRepository, 
  spaceRepository, 
  offerRepository,
  financeRepository,
  activityLogRepository
} from '@/repositories';

export const workflowService = {
  async commitSalesWorkflow(state: WorkflowState): Promise<{ success: boolean; data?: any; error?: string }> {
    const { company, selectedSpaces, offer, contract, reservation, campaign, finance } = state.data;
    if (!company || selectedSpaces.length === 0 || !offer || !contract || !reservation || !campaign || !finance) {
      return { success: false, error: 'Eksik adım bilgisi. Lütfen tüm adımları doldurun.' };
    }

    try {
      // 1. Save or Update Company (already handled by CompanyStep UI)
      
      // 2. Save Offer in OfferRepository
      const spaceIds = selectedSpaces.map(s => s.id);
      const createdOffer = await offerRepository.create({
        companyId: company.id,
        campaignName: offer.campaignName,
        value: offer.value,
        valueNumeric: offer.valueNumeric,
        stage: 'Onay Bekleniyor',
        closeProbability: offer.closeProbability,
        closingDate: offer.closingDate,
        owner: 'Cemil Sezgin', // default owner
        spaceIds,
        details: offer.notes,
        notes: 'Yeni Satış Sihirbazı tarafından otomatik oluşturuldu.'
      });

      // 3. Update Spaces Status in spaceRepository in parallel
      await Promise.all(
        selectedSpaces.map(space => 
          spaceRepository.update(space.id, {
            ...space,
            status: 'teklif'
          })
        )
      );

      // 4. Save Contract via Local Fallback
      const mockContractId = 'CON-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      const newContract = {
        id: mockContractId,
        contractNo: contract.contractNo,
        companyId: company.id,
        clientName: company.name,
        campaignId: 'CAM-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
        campaignName: campaign.name,
        status: 'Onay Bekliyor' as const,
        crmTier: company.crmStatus || 'Lead',
        value: offer.value,
        daysLeft: 30,
        startDate: contract.startDate,
        endDate: contract.endDate,
        mediaAgency: company.mediaAgency || '-',
        proposalId: createdOffer.id,
        reservationId: 'RES-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
        notes: [contract.notes].filter(Boolean),
        installments: [
          { id: 'INST-1', installment: '1. Taksit', dueDate: contract.startDate, amount: offer.value, status: 'Bekliyor' as const }
        ],
        spacesList: selectedSpaces.map(s => s.code),
        filesList: [],
        history: [],
        aiRiskAnalysis: []
      };

      try {
        const storedContracts = localStorage.getItem('outdoorcore_mock_contracts');
        const list = storedContracts ? JSON.parse(storedContracts) : [];
        list.push(newContract);
        localStorage.setItem('outdoorcore_mock_contracts', JSON.stringify(list));
      } catch (e) {
        console.error('Failed to append to local contracts:', e);
      }

      // 5. Save Reservation to Calendar via Local Fallback
      const newReservation = {
        id: newContract.reservationId,
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

      // 6. Save Campaign via Local Fallback
      const newCampaign = {
        id: newContract.campaignId,
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
      try {
        const storedCampaigns = localStorage.getItem('outdoorcore_mock_campaigns');
        const list = storedCampaigns ? JSON.parse(storedCampaigns) : [];
        list.push(newCampaign);
        localStorage.setItem('outdoorcore_mock_campaigns', JSON.stringify(list));
      } catch (e) {
        console.error('Failed to append to local campaigns:', e);
      }

      // 7. Save Finance/Invoices via Local Fallback
      const financeData = financeRepository.getFinanceDataSync();
      let account = financeData.accounts.find((a: any) => a.companyId === company.id);
      
      const newInvoice = {
        id: 'INV-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
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

      // 8. Create Activity Log
      await activityLogRepository.log(`Yeni satış sihirbazı süreci tamamlandı: ${company.name} - ${campaign.name}`, 'sales.wizard_complete');

      return {
        success: true,
        data: {
          offerId: createdOffer.id,
          contractId: mockContractId,
          reservationId: newReservation.id,
          campaignId: newCampaign.id,
          invoiceId: newInvoice.id
        }
      };
    } catch (e: any) {
      console.error('Error committing sales workflow:', e);
      return { success: false, error: e.message || 'Satış süreci kaydedilirken bir hata oluştu.' };
    }
  }
};
