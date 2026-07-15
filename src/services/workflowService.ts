import { WorkflowState } from '@/types/workflow';
import { 
  companyRepository, 
  spaceRepository, 
  offerRepository,
  financeRepository,
  activityLogRepository,
  reservationRepository,
  reservationAuditRepository,
  digitalScreenRepository,
  campaignRepository
} from '@/repositories';

import { parseDDMMYYYY, calculateCampaignDays } from '@/utils/dateHelper';

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

      // 2b. If LED mode, create playlist slots in DigitalSignage DB
      if (state.data.reklamTipi === 'led' && state.data.ledSlots) {
        await Promise.all(
          state.data.ledSlots.map(slot => 
            digitalScreenRepository.createPlaylistSlot({
              screenId: slot.screenId,
              companyId: company.id,
              companyName: company.name,
              campaignId: mockCampaignId,
              startDate: reservation.startDate,
              endDate: reservation.endDate,
              durationSeconds: slot.durationSeconds,
              notes: 'Satış sihirbazı ile oluşturuldu.'
            })
          )
        );
      }

      // 3. Save Reservation to Calendar (Kritik)
      const startRes = performance.now();
      const optionDuration = Number(localStorage.getItem('outdoorcore_option_duration_hours') || '72');
      const optionStartedAt = new Date().toISOString();
      const expDate = new Date();
      expDate.setHours(expDate.getHours() + optionDuration);
      const optionExpiresAt = expDate.toISOString();

      const newReservation = {
        id: mockReservationId,
        contractId: mockContractId,
        clientName: company.name,
        campaignName: campaign.name,
        startDate: reservation.startDate,
        endDate: reservation.endDate,
        spaceCode: selectedSpaces[0]?.code || '',
        spaceName: selectedSpaces[0]?.name || '',
        location: selectedSpaces[0]?.location || '',
        agencyName: company.mediaAgency || '-',
        durationDays: 30,
        budget: offer.value,
        creativeFiles: [],
        aiRecommendation: 'Planlama sihirbazı tarafından otomatik oluşturuldu.',
        spaceCodes: selectedSpaces.map(s => s.code),
        spaceIds: selectedSpaces.map(s => s.id),
        
        // MGA Akışı Durumları
        status: 'OPTIONED',
        contractStatus: 'DRAFT',
        salesApprovalStatus: 'PENDING',
        
        // Opsiyon Bilgileri
        optionStartedAt,
        optionExpiresAt,
        optionDurationHours: optionDuration,
        optionCreatedBy: 'ceo@outdoorcore.ai',
        optionExtensionCount: 0,
        notes: reservation.notes
      };

      try {
        const storedReservations = localStorage.getItem('outdoorcore_mock_reservations');
        const list = storedReservations ? JSON.parse(storedReservations) : [];
        list.push(newReservation);
        localStorage.setItem('outdoorcore_mock_reservations', JSON.stringify(list));
        reservationAuditRepository.log(
          mockReservationId, 
          'NONE', 
          'OPTIONED', 
          `Rezervasyon Satış Sihirbazı üzerinden oluşturuldu. Opsiyon Süresi: ${optionDuration} Saat.`, 
          'ceo@outdoorcore.ai'
        );
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
  },

  async commitReservationWorkflow(payload: {
    workflowId: string;
    companyId: string;
    campaignName: string;
    startDate: string;
    endDate: string;
    productType: 'dijital' | 'statik' | 'ozel';
    spaceIds: string[];
    reservedNetworkCount?: number;
    durationSeconds?: number;
    unitPrice: number;
    discountRate: number;
    notes?: string;
  }): Promise<{ success: boolean; data?: any; error?: string }> {
    const idpKey = 'outdoorcore_idp_' + payload.workflowId;
    const cachedResult = localStorage.getItem(idpKey);
    if (cachedResult) {
      console.log('Workflow bypassed due to idempotency hit:', payload.workflowId);
      return JSON.parse(cachedResult);
    }

    const company = companyRepository.getByIdSync(payload.companyId);
    if (!company) {
      return { success: false, error: 'Belirtilen firma sistemde bulunamadı.' };
    }
    if (!payload.campaignName || payload.campaignName.trim().length < 2) {
      return { success: false, error: 'Lütfen geçerli bir kampanya adı girin.' };
    }
    if (!payload.startDate || !payload.endDate) {
      return { success: false, error: 'Lütfen kampanya tarih aralığını seçin.' };
    }
    const startD = new Date(payload.startDate);
    const endD = new Date(payload.endDate);
    if (endD < startD) {
      return { success: false, error: 'Kampanya bitiş tarihi başlangıç tarihinden önce olamaz.' };
    }
    if (payload.spaceIds.length === 0) {
      return { success: false, error: 'Lütfen en az bir reklam alanı seçin.' };
    }
    if (payload.unitPrice <= 0) {
      return { success: false, error: 'Birim fiyat 0 veya daha küçük olamaz. Lütfen geçerli bir fiyat girin.' };
    }

    const allSpaces = spaceRepository.getAllSync();
    for (const spaceId of payload.spaceIds) {
      const space = allSpaces.find(s => s.id === spaceId);
      if (!space) {
        return { success: false, error: `Seçilen reklam alanı (${spaceId}) bulunamadı.` };
      }
      const isAvailable = reservationRepository.isSpaceAvailableSync(spaceId, space.code, payload.startDate, payload.endDate);
      if (payload.productType === 'dijital') {
        const reqNetwork = payload.reservedNetworkCount || 1;
        const availableNet = (reservationRepository as any).getAvailableNetworkCapacity(spaceId, space.code, payload.startDate, payload.endDate);
        if (reqNetwork > availableNet) {
          return { success: false, error: `${space.code} LED ekranında seçilen tarihlerde yeterli network kapasitesi yok. Mevcut Müsait Kapasite: ${availableNet}` };
        }
      } else {
        if (!isAvailable) {
          return { success: false, error: `${space.code} reklam alanı seçilen tarihlerde başka bir rezervasyon tarafından doludur.` };
        }
      }
    }

    const keysToBackup = [
      'outdoorcore_mock_companies',
      'outdoorcore_mock_advertisingSpaces',
      'outdoorcore_mock_offers',
      'outdoorcore_mock_reservations',
      'outdoorcore_mock_contracts',
      'outdoorcore_mock_campaigns',
      'outdoorcore_playlist_slots',
      'outdoorcore_mock_finance_data'
    ];
    const snapshot: Record<string, string | null> = {};
    for (const key of keysToBackup) {
      snapshot[key] = localStorage.getItem(key);
    }

    try {
      const diffDays = calculateCampaignDays(payload.startDate, payload.endDate) || 1;

      const discountAmount = Math.round(payload.unitPrice * (payload.discountRate / 100));
      const netAmount = Math.round(payload.unitPrice - discountAmount);
      const vatAmount = Math.round(netAmount * 0.20);
      const grandTotal = Math.round(netAmount + vatAmount);

      const mockOfferId = 'OFF-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      const mockContractId = 'CON-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      const mockCampaignId = 'CAM-' + Math.random().toString(36).substring(2, 6).toUpperCase();

      const newCampaign = {
        id: mockCampaignId,
        companyId: company.id,
        campaignName: payload.campaignName,
        clientName: company.name,
        budget: `₺${grandTotal.toLocaleString('tr-TR')}`,
        objective: 'Genel Tanıtım',
        targetAudience: 'Havalimanı Yolcuları',
        status: 'Hazırlık' as const,
        startDate: payload.startDate,
        endDate: payload.endDate,
        spacesCount: payload.spaceIds.length,
        creativeCount: 0,
        aiScore: 85,
        offerId: mockOfferId,
        contractId: mockContractId
      };
      const storedCampaigns = localStorage.getItem('outdoorcore_mock_campaigns');
      const campaignsList = storedCampaigns ? JSON.parse(storedCampaigns) : [];
      campaignsList.push(newCampaign);
      localStorage.setItem('outdoorcore_mock_campaigns', JSON.stringify(campaignsList));

      const reservationIds: string[] = [];
      const storedReservations = localStorage.getItem('outdoorcore_mock_reservations');
      const resList = storedReservations ? JSON.parse(storedReservations) : [];

      for (const spaceId of payload.spaceIds) {
        const space = allSpaces.find(s => s.id === spaceId)!;
        const mockResId = 'RES-' + Math.random().toString(36).substring(2, 6).toUpperCase();
        
        const newRes = {
          id: mockResId,
          contractId: mockContractId,
          offerId: mockOfferId,
          campaignId: mockCampaignId,
          companyId: company.id,
          spaceId: space.id,
          spaceCode: space.code,
          spaceName: space.name,
          location: space.location || 'İstanbul',
          clientName: company.name,
          startDate: payload.startDate,
          endDate: payload.endDate,
          durationDays: diffDays,
          status: 'REZERVE',
          contractStatus: 'DRAFT',
          salesApprovalStatus: 'APPROVED',
          budget: `₺${grandTotal.toLocaleString('tr-TR')}`,
          reservedNetworkCount: payload.productType === 'dijital' ? (payload.reservedNetworkCount || 1) : undefined,
          durationSeconds: payload.productType === 'dijital' ? (payload.durationSeconds || 15) : undefined,
          notes: payload.notes || ''
        };
        resList.push(newRes);
        reservationIds.push(mockResId);

        if (payload.productType === 'dijital') {
          await digitalScreenRepository.createPlaylistSlot({
            screenId: space.id,
            companyId: company.id,
            companyName: company.name,
            campaignId: mockCampaignId,
            startDate: payload.startDate,
            endDate: payload.endDate,
            durationSeconds: payload.durationSeconds || 15,
            notes: 'Rezervasyon ile oluşturuldu.'
          });
        }

        await spaceRepository.update(space.id, { status: 'rezerve' });
      }
      localStorage.setItem('outdoorcore_mock_reservations', JSON.stringify(resList));

      const createdOffer = await offerRepository.create({
        companyId: company.id,
        campaignName: payload.campaignName,
        value: `₺${grandTotal.toLocaleString('tr-TR')}`,
        valueNumeric: grandTotal,
        stage: 'Rezerve',
        closeProbability: 90,
        closingDate: payload.startDate,
        campaignStartDate: payload.startDate,
        campaignEndDate: payload.endDate,
        owner: 'Cemil Sezgin',
        spaceIds: payload.spaceIds,
        discountRate: payload.discountRate,
        discountAmount,
        netAmount,
        vatAmount,
        grandTotal,
        details: payload.notes || 'Operasyonel rezervasyon teklifi.',
        notes: 'Sistem tarafından otomatik oluşturuldu.',
        contractId: mockContractId,
        reservationId: reservationIds[0],
        campaignId: mockCampaignId
      });

      const newContract = {
        id: mockContractId,
        contractNo: 'CTR-2026-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
        companyId: company.id,
        clientName: company.name,
        campaignId: mockCampaignId,
        campaignName: payload.campaignName,
        status: 'draft',
        crmTier: company.crmStatus || 'Gold',
        value: `₺${grandTotal.toLocaleString('tr-TR')}`,
        valueNumeric: grandTotal,
        daysLeft: 30,
        startDate: payload.startDate,
        endDate: payload.endDate,
        mediaAgency: company.mediaAgency || '-',
        proposalId: createdOffer.id,
        offerId: createdOffer.id,
        reservationId: reservationIds[0],
        notes: [payload.notes].filter(Boolean),
        installments: [
          { id: 'INST-1', installment: '1. Taksit', dueDate: payload.startDate, amount: grandTotal, status: 'Bekliyor' }
        ],
        spacesList: payload.spaceIds.map(sid => allSpaces.find(s => s.id === sid)?.code || ''),
        filesList: [],
        history: [],
        aiRiskAnalysis: []
      };
      const storedContracts = localStorage.getItem('outdoorcore_mock_contracts');
      const contractsList = storedContracts ? JSON.parse(storedContracts) : [];
      contractsList.push(newContract);
      localStorage.setItem('outdoorcore_mock_contracts', JSON.stringify(contractsList));

      const financeData = financeRepository.getFinanceDataSync();
      let account = financeData.accounts.find((a: any) => a.companyId === company.id);
      const newInvoice = {
        id: 'INV-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
        invoiceNo: 'FTR-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
        date: new Date().toLocaleDateString('tr-TR'),
        amount: `₺${grandTotal.toLocaleString('tr-TR')}`,
        status: 'Bekliyor' as const
      };
      if (!account) {
        account = {
          id: 'ACC-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
          name: company.name,
          logo: company.name.charAt(0).toUpperCase(),
          totalDebt: `₺${grandTotal.toLocaleString('tr-TR')}`,
          totalCollected: '₺0',
          balance: `₺${grandTotal.toLocaleString('tr-TR')}`,
          riskScore: 20,
          crmTier: company.crmStatus === 'VIP' ? 'VIP' : 'Gold',
          totalContracts: '1',
          totalInvoicesCount: 1,
          invoices: [newInvoice],
          collections: [],
          paymentPlan: [],
          receipts: [],
          notes: ['Rezervasyon ile fatura hesabı otomatik açıldı.'],
          companyId: company.id
        };
        financeData.accounts.push(account);
      } else {
        account.invoices.push(newInvoice);
        account.totalInvoicesCount += 1;
      }
      localStorage.setItem('outdoorcore_mock_finance_data', JSON.stringify(financeData));

      await activityLogRepository.log(`Kesin Rezervasyon oluşturuldu: ${company.name} - ${payload.campaignName}`, 'reservations');

      window.dispatchEvent(new Event('companies_updated'));
      window.dispatchEvent(new Event('spaces_updated'));
      window.dispatchEvent(new Event('offers_updated'));
      window.dispatchEvent(new Event('reservations_updated'));
      window.dispatchEvent(new Event('contracts_updated'));
      window.dispatchEvent(new Event('campaigns_updated'));

      const response = {
        success: true,
        data: {
          offerId: createdOffer.id,
          reservationIds
        }
      };

      localStorage.setItem(idpKey, JSON.stringify(response));
      return response;

    } catch (e: any) {
      console.error('Workflow commit failed! Executing compensating rollback...', e);
      for (const key of keysToBackup) {
        const val = snapshot[key];
        if (val === null) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, val);
        }
      }
      return { success: false, error: e.message || 'Sözleşme/Rezervasyon işlemi kaydedilirken bir hata oluştu.' };
    }
  }
};
