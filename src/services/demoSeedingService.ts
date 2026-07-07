import { Company } from '@/data/companies';
import { AdvertisingSpace } from '@/data/advertisingSpaces';
import { Offer } from '@/data/offers';
import { Contract } from '@/data/contracts';
import { Reservation } from '@/data/reservations';
import { Campaign } from '@/data/campaigns';
import { DigitalScreen, PlaylistSlot } from '@/types/digitalSignage';
import { FinancialAccount } from '@/data/finance';

const COMPANY_NAMES = [
  'Turkish Airlines', 'Pegasus', 'AJet', 'Tatilbudur', 'ETS Tur', 
  'Jolly', 'Setur', 'Turkcell', 'Vodafone', 'Türk Telekom', 
  'Garanti BBVA', 'Akbank', 'İş Bankası', 'QNB', 'Mercedes', 
  'BMW', 'Audi', 'Toyota', 'Samsung', 'Apple', 
  'LC Waikiki', 'Migros', 'CarrefourSA', 'Hepsiburada', 'Amazon Türkiye', 
  'Papara', 'Getir', 'Yemeksepeti', 'Starbucks', 'Burger King', 
  'McDonald\'s', 'MediaMarkt', 'Trendyol', 'Coca-Cola', 'Efes Pilsen'
];

const SECTORS = [
  'Ulaşım & Havacılık', 'Ulaşım & Havacılık', 'Ulaşım & Havacılık', 'Turizm & Seyahat', 'Turizm & Seyahat',
  'Turizm & Seyahat', 'Turizm & Seyahat', 'Telekomünikasyon', 'Telekomünikasyon', 'Telekomünikasyon',
  'Finans & Bankacılık', 'Finans & Bankacılık', 'Finans & Bankacılık', 'Finans & Bankacılık', 'Otomotiv',
  'Otomotiv', 'Otomotiv', 'Otomotiv', 'Elektronik', 'Elektronik',
  'Tekstil & Perakende', 'Gıda & Retail', 'Gıda & Retail', 'E-Ticaret', 'E-Ticaret',
  'Fintech', 'Hızlı Teslimat', 'Gıda İletişimi', 'Gıda İletişimi', 'Hızlı Servis',
  'Hızlı Servis', 'Elektronik Perakende', 'E-Ticaret', 'Hızlı Tüketim', 'Hızlı Tüketim'
];

export const demoSeedingService = {
  resetDemoData() {
    console.log('RESETTING DEMO DATA STATE...');

    // Clear local storage keys
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
      'outdoorcore_mock_finance_data'
    ];
    keysToClear.forEach(k => localStorage.removeItem(k));

    // 1. Generate 35 Companies
    const generatedCompanies: Company[] = COMPANY_NAMES.map((name, index) => {
      const id = `CMP-${String(index + 1).padStart(4, '0')}`;
      const crmStatus = index < 5 ? 'VIP' : index < 15 ? 'Gold' : index < 28 ? 'Silver' : 'Lead';
      
      return {
        id,
        name,
        sector: SECTORS[index] || 'Diğer',
        city: 'İstanbul',
        status: 'Aktif',
        campaignsCount: 0,
        totalSpend: '₺0',
        activeSpacesCount: 0,
        lastCampaign: '-',
        upcomingCampaign: '-',
        aiScore: Math.floor(70 + Math.random() * 25),
        logo: name.charAt(0),
        logoUrl: '',
        headquarters: 'İstanbul, Türkiye',
        website: `www.${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.tr`,
        phone: `+90 212 ${Math.floor(1000000 + Math.random() * 9000000)}`,
        email: `info@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.tr`,
        taxNo: String(Math.floor(1000000000 + Math.random() * 9000000000)),
        taxOffice: 'Büyük Mükellefler',
        crmStatus,
        mediaAgency: `${name} Media Agency`,
        creativeAgency: `${name} Creative Group`,
        budget: `₺${Math.floor(5 + Math.random() * 95)}M`,
        brands: [name, `${name} Plus`],
        campaignList: [],
        spacesList: [],
        offersList: [],
        contractsList: [],
        filesList: [
          { type: 'PDF', name: 'Kurumsal Medya Kiti' },
          { type: 'IMG', name: 'Logo Vektörel' }
        ],
        notesList: ['Demo verisi olarak otomatik oluşturuldu.'],
        contacts: [
          { name: `Ahmet ${name} Yöneticisi`, role: 'Pazarlama Direktörü' }
        ],
        linkedOfferIds: [],
        linkedContractIds: [],
        linkedReservationIds: [],
        linkedCampaignIds: [],
        linkedInvoiceIds: []
      };
    });

    // 2. Generate 120 Advertising Spaces
    const categories = ['LED Ekran', 'Lightbox', 'Billboard', 'Megalight', 'Raket'];
    const types = ['LED', 'Lightbox', 'Billboard', 'Megalight', 'Raket'];
    const sizes = ['8m x 3m', '2.5m x 1.5m', '12m x 4m', '2m x 1.5m', '1.8m x 1.2m'];
    const terminals = ['İç Hatlar', 'Dış Hatlar'];
    const locations = ['Giden Yolcu Pasaport Kontrol', 'Geliş Körük Çıkışı', 'Duty Free Ana Meydan', 'Check-in Kontuar Üstü', 'Bagaj Alım Peronları'];

    const generatedSpaces: AdvertisingSpace[] = Array.from({ length: 120 }).map((_, idx) => {
      const code = `SG-${String(idx + 1).padStart(3, '0')}`;
      const terminal = terminals[idx % 2];
      const type = types[idx % types.length];
      const size = sizes[idx % sizes.length];
      const location = `${terminal} - ${locations[idx % locations.length]} ${Math.floor(idx / 5) + 1}`;
      const category = categories[idx % categories.length];

      // Dynamic price mapping
      let priceVal = 12000 + (idx % 10) * 8000;
      if (type === 'LED') priceVal += 65000;
      if (type === 'Lightbox') priceVal += 15000;
      const price = `₺${priceVal.toLocaleString('tr-TR')}`;

      return {
        id: code,
        code,
        name: `${type} Reklam Ünitesi ${idx + 1}`,
        location,
        terminal,
        type,
        size,
        price,
        status: 'bos', // default
        client: '-',
        endDate: '-',
        latitude: 41.0082 + (Math.random() - 0.5) * 0.1,
        longitude: 28.9784 + (Math.random() - 0.5) * 0.1,
        priceNumeric: priceVal,
        gazeTime: 3 + (idx % 8),
        traffic: 20000 + (idx % 12) * 8500,
        visibilityIndex: 80 + (idx % 20),
        
        // Required properties
        visibility: `${80 + (idx % 20)}%`,
        resolution: '3840x2160',
        pitch: '1.8mm',
        workingHours: '24 Saat',
        audio: 'Var',
        power: '3.2kW',
        fileFormat: 'MP4, JPG',
        maxFileSize: '100MB',
        updateInterval: 'Hemen',
        impressions: `${Math.round((20000 + (idx % 12) * 8500) * 0.3 * 30).toLocaleString('tr-TR')}K`,
        viewTime: `${3 + (idx % 8)}s`,
        reach: '90K',
        frequency: 2.4,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80'
      };
    });

    // 3. Generate 45 Offers
    const stages: Offer['stage'][] = [];
    for (let i = 0; i < 18; i++) stages.push('Sözleşme İmzalandı');
    for (let i = 0; i < 7; i++) stages.push('Sözleşme Bekliyor');
    for (let i = 0; i < 10; i++) stages.push('Onaya Gönderildi');
    for (let i = 0; i < 5; i++) stages.push('Teklif Hazırlandı');
    for (let i = 0; i < 5; i++) stages.push('İptal');

    const generatedOffers: Offer[] = Array.from({ length: 45 }).map((_, idx) => {
      const id = `OFF-${String(idx + 1).padStart(3, '0')}`;
      const company = generatedCompanies[idx % generatedCompanies.length];
      const stage = stages[idx] || 'Teklif Hazırlandı';
      
      const spaceIdx1 = (idx * 3) % generatedSpaces.length;
      const spaceIdx2 = (idx * 3 + 1) % generatedSpaces.length;
      const space1 = generatedSpaces[spaceIdx1];
      const space2 = generatedSpaces[spaceIdx2];
      const selectedSpaces = idx % 2 === 0 ? [space1] : [space1, space2];

      const sumPrice = selectedSpaces.reduce((sum, s) => sum + (s.priceNumeric || 0), 0);
      const valText = `₺${sumPrice.toLocaleString('tr-TR')}`;

      const startDate = `01.${String(idx % 12 + 1).padStart(2, '0')}.2025`;
      const endDate = `30.${String(idx % 12 + 1).padStart(2, '0')}.2025`;

      if (!company.linkedOfferIds) company.linkedOfferIds = [];
      company.linkedOfferIds.push(id);

      return {
        id,
        clientName: company.name,
        campaignName: `${company.name} Lansman Kampanyası`,
        value: valText,
        valueNumeric: sumPrice,
        spacesList: selectedSpaces.map(s => s.code),
        owner: 'Demo Yöneticisi',
        lastActivity: 'Bugün',
        closeProbability: stage === 'Sözleşme İmzalandı' ? 100 : stage === 'İptal' ? 0 : 50 + (idx % 9) * 5,
        stage,
        closingDate: '20.06.2025',
        campaignStartDate: startDate,
        campaignEndDate: endDate,
        details: `${company.name} için terminal içi premium lansman yayını teklifi.`,
        priority: idx % 3 === 0 ? 'Yüksek' : 'Orta',
        companyId: company.id,
        spaceIds: selectedSpaces.map(s => s.id)
      };
    });

    // 4. Generate 18 Contracts and 25 Reservations
    const generatedContracts: Contract[] = [];
    const generatedReservations: Reservation[] = [];

    let contractIndex = 1;
    let resIndex = 1;

    generatedOffers.forEach((offer) => {
      const company = generatedCompanies.find(c => c.name === offer.clientName)!;
      const associatedSpaces = generatedSpaces.filter(s => offer.spacesList.includes(s.code));

      if (offer.stage === 'Sözleşme İmzalandı') {
        const contractId = `CON-${String(contractIndex).padStart(3, '0')}`;
        const contractNo = `CTR-2025-${String(100 + contractIndex)}`;
        contractIndex++;

        const newContract: Contract = {
          id: contractId,
          contractNo,
          clientName: offer.clientName,
          campaignName: offer.campaignName,
          spacesList: offer.spacesList,
          value: offer.value,
          valueNumeric: offer.valueNumeric,
          status: 'signed',
          startDate: offer.campaignStartDate || '01.06.2025',
          endDate: offer.campaignEndDate || '31.12.2025',
          daysLeft: 120 + (contractIndex * 10),
          notes: ['ERP Demo kapsamında imzalanmış aktif sözleşme.'],
          offerId: offer.id,
          proposalId: offer.id,
          companyId: company.id,
          spaceIds: offer.spaceIds,
          aiRiskScore: (offer.valueNumeric > 100000 && contractIndex % 4 === 0) ? 8 : 2,
          logo: offer.clientName.charAt(0),
          progress: 40,
          crmTier: company.crmStatus === 'VIP' ? 'VIP' : company.crmStatus === 'Gold' ? 'Gold' : 'Standard',
          mediaAgency: company.mediaAgency,
          reservationId: `RES-00${contractIndex}`,
          campaignId: `CAM-00${contractIndex}`,
          filesList: ['contract.pdf'],
          installments: [],
          history: [],
          aiRiskAnalysis: ['Ödeme gecikme olasılığı düşük.']
        };

        generatedContracts.push(newContract);
        offer.contractId = contractId;

        if (!company.linkedContractIds) company.linkedContractIds = [];
        company.linkedContractIds.push(contractId);

        // Bind space statuses to dolu & client name
        associatedSpaces.forEach(s => {
          s.status = 'dolu';
          s.client = offer.clientName;
          s.endDate = newContract.endDate;
        });

        // Add corresponding reservation
        const resId = `RES-${String(resIndex).padStart(3, '0')}`;
        resIndex++;

        const newRes: Reservation = {
          id: resId,
          spaceCode: associatedSpaces[0]?.code || 'SG-001',
          spaceName: associatedSpaces[0]?.name || 'Reklam Ünitesi',
          location: associatedSpaces[0]?.location || 'Terminal',
          clientName: offer.clientName,
          agencyName: company.mediaAgency,
          startDate: newContract.startDate,
          endDate: newContract.endDate,
          durationDays: 30,
          status: 'Aktif',
          budget: offer.value,
          creativeFiles: ['creative-video-1080p.mp4'],
          aiRecommendation: 'Yüksek verimli yayın saati planlaması yapıldı.',
          daysLeft: newContract.daysLeft,
          companyId: company.id,
          spaceId: associatedSpaces[0]?.id || 'SG-001',
          offerId: offer.id,
          contractId
        };
        generatedReservations.push(newRes);
        offer.reservationId = resId;

        if (!company.linkedReservationIds) company.linkedReservationIds = [];
        company.linkedReservationIds.push(resId);
      }

      else if (offer.stage === 'Sözleşme Bekliyor' || offer.stage === 'Onaya Gönderildi') {
        // Mark associated spaces status as teklif
        associatedSpaces.forEach(s => {
          if (s.status !== 'dolu') {
            s.status = 'teklif';
            s.client = offer.clientName;
          }
        });

        // Add pending reservation
        if (resIndex <= 25) {
          const resId = `RES-${String(resIndex).padStart(3, '0')}`;
          resIndex++;

          const newRes: Reservation = {
            id: resId,
            spaceCode: associatedSpaces[0]?.code || 'SG-001',
            spaceName: associatedSpaces[0]?.name || 'Reklam Ünitesi',
            location: associatedSpaces[0]?.location || 'Terminal',
            clientName: offer.clientName,
            agencyName: company.mediaAgency,
            startDate: offer.campaignStartDate || '01.06.2025',
            endDate: offer.campaignEndDate || '31.12.2025',
            durationDays: 30,
            status: 'Yaklaşan',
            budget: offer.value,
            creativeFiles: ['pending-creative.pdf'],
            aiRecommendation: 'Sözleşme onayından sonra yayına hazır hale gelecektir.',
            companyId: company.id,
            spaceId: associatedSpaces[0]?.id || 'SG-001',
            offerId: offer.id
          };
          generatedReservations.push(newRes);
          offer.reservationId = resId;

          if (!company.linkedReservationIds) company.linkedReservationIds = [];
          company.linkedReservationIds.push(resId);
        }
      }
    });

    // Make sure we have exactly 25 reservations
    while (generatedReservations.length < 25) {
      const idx = generatedReservations.length;
      const comp = generatedCompanies[idx % generatedCompanies.length];
      const space = generatedSpaces[idx % generatedSpaces.length];
      const resId = `RES-${String(idx + 1).padStart(3, '0')}`;

      generatedReservations.push({
        id: resId,
        spaceCode: space.code,
        spaceName: space.name,
        location: space.location,
        clientName: comp.name,
        agencyName: comp.mediaAgency,
        startDate: '01.08.2025',
        endDate: '31.08.2025',
        durationDays: 30,
        status: 'Yaklaşan',
        budget: '₺45.000',
        creativeFiles: ['banner-design.jpg'],
        aiRecommendation: 'Mevcut konum hedeflemesi uygundur.',
        companyId: comp.id,
        spaceId: space.id
      });
    }

    // 5. Generate 30 Campaigns
    const generatedCampaigns: Campaign[] = Array.from({ length: 30 }).map((_, idx) => {
      const id = `CAM-${String(idx + 1).padStart(3, '0')}`;
      const contract = generatedContracts[idx % generatedContracts.length];
      const company = generatedCompanies.find(c => c.name === contract.clientName)!;

      if (!company.linkedCampaignIds) company.linkedCampaignIds = [];
      company.linkedCampaignIds.push(id);

      return {
        id,
        clientName: contract.clientName,
        campaignName: contract.campaignName,
        status: idx % 2 === 0 ? 'Aktif' : 'Planlandı',
        startDate: contract.startDate,
        endDate: contract.endDate,
        daysLeft: contract.daysLeft,
        budget: contract.value,
        spacesList: contract.spacesList,
        successRate: 98 + (idx % 3) * 0.5,
        creativesCount: 2,
        aiScore: 90 + (idx % 10),
        logo: company.logo,
        logoUrl: '',
        proposalId: contract.offerId || 'OFF-001',
        contractId: contract.id,
        reservationId: `RES-00${(idx % 10) + 1}`,
        mediaAgency: company.mediaAgency,
        creativeAgency: company.creativeAgency,
        creativeFiles: [
          { name: 'ana-kampanya-tanitimi.mp4', type: 'Video MP4', uploadDate: '01.05.2025', status: 'Onaylandı' }
        ],
        aiAnalysisNotes: ['Göz temas süresi hedeflenenin üzerinde.'],
        impressions: `${(150 + idx * 45).toLocaleString('tr-TR')}K`,
        reach: `${(90 + idx * 30).toLocaleString('tr-TR')}K`,
        frequency: 2.4,
        airtimeHours: 240,
        bestSpace: contract.spacesList[0] || 'SG-001',
        riskySpace: '-',
        companyId: company.id,
        spaceIds: contract.spaceIds
      };
    });

    // 6. Generate 20 Digital Screens
    const generatedScreens: DigitalScreen[] = Array.from({ length: 20 }).map((_, idx) => {
      const code = `LED-${String(idx + 1).padStart(3, '0')}`;
      return {
        screenId: code,
        screenCode: code,
        name: `Ana Terminal LED Wall ${idx + 1}`,
        location: idx % 2 === 0 ? 'Giden Yolcu Pasaport Kontrol' : 'Duty Free Meydanı',
        terminal: idx % 2 === 0 ? 'İç Hatlar' : 'Dış Hatlar',
        floor: 'Gidiş Katı',
        totalM2: 24,
        resolution: '3840x2160 (4K UHD)',
        loopDurationSeconds: 120,
        monthlyBasePrice: 90000 + idx * 5000,
        dailyTraffic: 45000 + idx * 2500,
        visibility: idx % 3 === 0 ? 'Çok Yüksek' : 'Yüksek',
        status: 'active',
        notes: 'Proof of Play doğrulaması aktif.'
      };
    });

    // 7. Generate 12 Playlist Slots
    const generatedSlots: PlaylistSlot[] = Array.from({ length: 12 }).map((_, idx) => {
      const screen = generatedScreens[idx % generatedScreens.length];
      const comp = generatedCompanies[idx % generatedCompanies.length];
      return {
        slotId: `SLT-${String(idx + 1).padStart(3, '0')}`,
        screenId: screen.screenId,
        companyId: comp.id,
        companyName: comp.name,
        campaignId: `CAM-00${(idx % 5) + 1}`,
        startDate: '01.06.2025',
        endDate: '30.06.2025',
        durationSeconds: 15,
        sharePercent: 12.5,
        estimatedPlaysPerDay: 720,
        price: Math.round(screen.monthlyBasePrice * 0.125),
        status: 'active',
        creativeFileUrl: 'lansman-kreatif.mp4',
        order: idx + 1
      };
    });

    // 8. Generate 60 Proof Of Plays (PoP)
    const generatedPoPs = Array.from({ length: 60 }).map((_, idx) => {
      const comp = generatedCompanies[idx % generatedCompanies.length];
      const screen = generatedScreens[idx % generatedScreens.length];
      return {
        company: comp.name,
        screen: `${screen.screenCode} - ${screen.name}`,
        playsPerDay: 720 + (idx % 12) * 20,
        impressions: 12000 + (idx % 25) * 800,
        successRate: `${(99.4 + (idx % 7) * 0.1).toFixed(1)}%`,
        lastPlay: `21:${String(idx % 60).padStart(2, '0')}:15`,
        status: idx % 2 === 0 ? 'Yayınlanıyor' : 'Tamamlandı'
      };
    });

    // 9. Generate 40 Finance Invoices inside financeData
    const generatedFinanceAccounts: FinancialAccount[] = generatedCompanies.slice(0, 35).map((comp, idx) => {
      const compContracts = generatedContracts.filter(c => c.clientName === comp.name);
      const totalContractsVal = compContracts.reduce((sum, c) => sum + c.valueNumeric, 0);

      const collectedNum = Math.round(totalContractsVal * 0.6);
      const balanceNum = totalContractsVal - collectedNum;

      const formattedDebt = `₺ ${totalContractsVal.toLocaleString('tr-TR')}`;
      const formattedCollected = `₺ ${collectedNum.toLocaleString('tr-TR')}`;
      const formattedBalance = `₺ ${balanceNum.toLocaleString('tr-TR')}`;

      const invoices = compContracts.map((c, iIdx) => {
        return {
          id: `INV-${c.id}-${iIdx}`,
          invoiceNo: `INV-2025-${10000 + idx * 100 + iIdx}`,
          date: '05.06.2025',
          amount: `₺ ${(c.valueNumeric).toLocaleString('tr-TR')}`,
          status: iIdx % 2 === 0 ? 'Ödendi' as const : 'Bekliyor' as const
        };
      });

      const collections = compContracts.filter((_, iIdx) => iIdx % 2 === 0).map((c, iIdx) => {
        return {
          id: `COL-${c.id}-${iIdx}`,
          date: '10.06.2025',
          amount: `₺ ${(c.valueNumeric).toLocaleString('tr-TR')}`,
          method: 'Banka Havalesi (EFT)'
        };
      });

      const paymentPlan = compContracts.map((c, iIdx) => {
        return {
          installment: '1. Taksit',
          dueDate: '25.06.2025',
          amount: `₺ ${(c.valueNumeric).toLocaleString('tr-TR')}`,
          status: iIdx % 2 === 0 ? 'Ödendi' as const : 'Bekliyor' as const
        };
      });

      return {
        id: comp.id,
        name: comp.name,
        logo: comp.logo,
        logoUrl: '',
        totalDebt: formattedDebt,
        totalCollected: formattedCollected,
        balance: formattedBalance,
        riskScore: compContracts.length > 0 ? (idx % 5 === 0 ? 3.5 : 1.2) : 0,
        crmTier: comp.crmStatus === 'VIP' ? 'VIP' as const : comp.crmStatus === 'Gold' ? 'Gold' as const : 'Standard' as const,
        totalContracts: formattedDebt,
        totalInvoicesCount: invoices.length,
        invoices,
        collections,
        paymentPlan,
        receipts: [],
        notes: ['Ödeme ve mutabakat süreci planlandı.'],
        companyId: comp.id,
        linkedContractIds: compContracts.map(c => c.id)
      };
    });

    const totalRevenue = generatedContracts.reduce((sum, c) => sum + c.valueNumeric, 0);
    const totalCollected = Math.round(totalRevenue * 0.6);
    const outstanding = totalRevenue - totalCollected;

    // Set storage
    localStorage.setItem('outdoorcore_mock_companies', JSON.stringify(generatedCompanies));
    localStorage.setItem('outdoorcore_mock_advertisingSpaces', JSON.stringify(generatedSpaces));
    localStorage.setItem('outdoorcore_mock_offers', JSON.stringify(generatedOffers));
    localStorage.setItem('outdoorcore_mock_reservations', JSON.stringify(generatedReservations));
    localStorage.setItem('outdoorcore_mock_contracts', JSON.stringify(generatedContracts));
    localStorage.setItem('outdoorcore_mock_campaigns', JSON.stringify(generatedCampaigns));
    localStorage.setItem('outdoorcore_digital_screens', JSON.stringify(generatedScreens));
    localStorage.setItem('outdoorcore_playlist_slots', JSON.stringify(generatedSlots));
    localStorage.setItem('outdoorcore_mock_proofOfPlays', JSON.stringify(generatedPoPs));

    const completeFinanceData = {
      accounts: generatedFinanceAccounts,
      cashFlowTrends: [
        { month: 'Ocak', incoming: 12000000, outgoing: 8000000, net: 4000000 },
        { month: 'Şubat', incoming: 15000000, outgoing: 8500000, net: 6500000 },
        { month: 'Mart', incoming: 18000000, outgoing: 9000000, net: 9000000 },
        { month: 'Nisan', incoming: 22000000, outgoing: 10000000, net: 12000000 },
        { month: 'Mayıs', incoming: totalCollected, outgoing: 12000000, net: totalCollected - 12000000 }
      ],
      collectionStatuses: [
        { name: 'Tahsil Edilen', value: totalCollected, color: '#10b981' },
        { name: 'Kalan Denge', value: outstanding, color: '#3b82f6' }
      ],
      upcomingPayments: generatedFinanceAccounts.filter(a => a.linkedContractIds && a.linkedContractIds.length > 0).slice(0, 5).map(a => {
        return {
          clientName: a.name,
          logo: a.logo,
          dueDate: '25.06.2025',
          daysLeft: 17,
          amount: a.balance,
          riskLevel: a.riskScore > 3 ? 'Kritik' as const : 'Düşük' as const
        };
      }),
      activities: [
        { id: 'ACT-01', type: 'collection', message: 'Turkish Airlines ₺12.000.000 tahsilat gerçekleştirildi.', time: '1 saat önce' }
      ]
    };

    localStorage.setItem('outdoorcore_mock_finance_data', JSON.stringify(completeFinanceData));

    console.log('DEMO DATA STATE SEEDED SUCCESSFUL!');
    
    // Dispatch window storage event to notify other contexts / pages immediately!
    window.dispatchEvent(new Event('storage'));
  }
};
