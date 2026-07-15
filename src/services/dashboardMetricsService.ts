import { parseAnyDate } from '@/utils/dateHelper';

export const dashboardMetricsService = {
  calculateAll(
    companies: any[],
    spaces: any[],
    offers: any[],
    contracts: any[],
    reservations: any[],
    campaigns: any[],
    finance: any,
    screens: any[],
    slots: any[],
    pops: any[],
    maintenance: any[]
  ) {
    const isSystemEmpty = companies.length === 0 && spaces.length === 0 && offers.length === 0;

    // 1. Kesinleşmiş Ciro
    const confirmedRes = reservations.filter(r => r.status === 'REZERVE' || r.status === 'YAYINDA' || r.status === 'CONFIRMED');
    const ciro = confirmedRes.reduce((sum, r) => {
      const val = parseFloat((r.budget || '').replace(/[^0-9]/g, '')) || 0;
      return sum + val;
    }, 0);

    // 2. Aktif Pipeline
    const pipeline = offers
      .filter(o => !['Sözleşme İmzalandı', 'Yayında', 'Tamamlandı', 'İptal'].includes(o.stage))
      .reduce((sum, o) => sum + (o.valueNumeric || 0), 0);

    // 3. Tahsilat Bekleyen
    let pendingCollections = 0;
    if (finance && finance.accounts) {
      finance.accounts.forEach((acc: any) => {
        const bal = parseFloat(acc.balance.replace(/[^\d]/g, '')) || 0;
        pendingCollections += bal;
      });
    }

    // 4. Aktif Sözleşme
    const activeContractsCount = contracts.filter(c => c.status === 'signed' || c.status === 'active' || c.status === 'Aktif').length;

    // 5. Aktif Kampanya
    const activeCampaignsCount = campaigns.filter(c => c.status === 'Aktif' || c.status === 'active').length;

    // 6. Envanter Doluluk Oranı
    const totalSpaces = spaces.length;
    const busySpaces = spaces.filter(s => s.status === 'dolu' || s.status === 'rezerve').length;
    const occupancyRate = totalSpaces > 0 ? (busySpaces / totalSpaces * 100) : 0;

    // AI Executive Insights Generation
    const aiInsights: string[] = [];
    if (!isSystemEmpty) {
      // 1. En önemli satış gelişmesi
      const pendingOffers = offers.filter(o => o.stage === 'Teklif Gönderildi' || o.stage === 'Müşteri Onayı');
      if (pendingOffers.length > 0) {
        const sumVal = pendingOffers.reduce((sum, o) => sum + (o.valueNumeric || 0), 0);
        const formattedVal = sumVal >= 1000000 ? `₺${(sumVal / 1000000).toFixed(1)}M` : `₺${(sumVal / 1000).toFixed(0)}K`;
        aiInsights.push(`${pendingOffers.length} teklif onay ve imza sürecinde bekliyor (Toplam ${formattedVal}).`);
      } else {
        const draftOffers = offers.filter(o => o.stage === 'Rezerve');
        if (draftOffers.length > 0) {
          aiInsights.push(`${draftOffers.length} adet yeni teklif rezerve aşamasında takip ediliyor.`);
        }
      }

      // 2. En kritik tahsilat riski
      let overdueAmount = 0;
      if (finance && finance.accounts) {
        finance.accounts.forEach((acc: any) => {
          if (acc.paymentPlan) {
            acc.paymentPlan.forEach((p: any) => {
              if (p.status === 'Gecikti') {
                const amt = parseFloat(p.amount.replace(/[^\d]/g, '')) || 0;
                overdueAmount += amt;
              }
            });
          }
        });
      }
      if (overdueAmount > 0) {
        const formattedOverdue = overdueAmount >= 1000000 ? `₺${(overdueAmount / 1000000).toFixed(1)}M` : `₺${(overdueAmount / 1000).toFixed(0)}K`;
        aiInsights.push(`Vadesi gecikmiş ${formattedOverdue} tutarında tahsilat riski bulunmaktadır.`);
      } else {
        aiInsights.push(`Önümüzdeki 30 gün içinde vadesi gelen tahsilat takipleri sorunsuz seyrediyor.`);
      }

      // 3. Yaklaşan sözleşme/opsiyon süresi
      const expiringContracts = contracts.filter(c => c.status !== 'cancelled' && c.status !== 'İptal' && c.daysLeft !== undefined && c.daysLeft <= 30);
      if (expiringContracts.length > 0) {
        aiInsights.push(`${expiringContracts.length} sözleşmenin bitimine 30 günden az kaldı, yenileme takibi gerekiyor.`);
      } else {
        const activeOptions = reservations.filter(r => r.status === 'OPTIONED');
        if (activeOptions.length > 0) {
          aiInsights.push(`${activeOptions.length} adet aktif rezervasyon opsiyon süresi dolmak üzere.`);
        }
      }

      // 4. En önemli operasyon aksiyonu
      const activeCamps = campaigns.filter(c => c.status === 'Aktif').length;
      if (activeCamps > 0) {
        aiInsights.push(`${activeCamps} adet aktif kampanya yayında olup Proof-of-Play takibi yapılıyor.`);
      } else if (spaces.filter(s => s.status === 'bos').length > 0) {
        aiInsights.push(`Kiralama için uygun ${spaces.filter(s => s.status === 'bos').length} adet boş reklam alanı mevcuttur.`);
      }
    }

    // Pipeline stages mapper
    const funnelStages = [
      { name: 'Rezerve', count: offers.filter(o => o.stage === 'Rezerve').length, value: offers.filter(o => o.stage === 'Rezerve').reduce((s, o) => s + (o.valueNumeric || 0), 0) },
      { name: 'Teklif Gönderildi', count: offers.filter(o => o.stage === 'Teklif Gönderildi').length, value: offers.filter(o => o.stage === 'Teklif Gönderildi').reduce((s, o) => s + (o.valueNumeric || 0), 0) },
      { name: 'Müşteri Onayı / Sözleşme Bekliyor', count: offers.filter(o => o.stage === 'Müşteri Onayı' || o.stage === 'Sözleşme Bekliyor').length, value: offers.filter(o => o.stage === 'Müşteri Onayı' || o.stage === 'Sözleşme Bekliyor').reduce((s, o) => s + (o.valueNumeric || 0), 0) },
      { name: 'Sözleşme İmzalandı', count: offers.filter(o => o.stage === 'Sözleşme İmzalandı').length, value: offers.filter(o => o.stage === 'Sözleşme İmzalandı').reduce((s, o) => s + (o.valueNumeric || 0), 0) }
    ];

    const totalActiveOffers = offers.filter(o => o.stage !== 'İptal').length;
    const signedOffers = offers.filter(o => o.stage === 'Sözleşme İmzalandı' || o.stage === 'Yayında').length;
    const winRateText = totalActiveOffers > 0 ? `%${Math.round((signedOffers / totalActiveOffers) * 100)}` : '—';

    // Upcoming Actions list (Offers needing action)
    const upcomingActions: any[] = [];
    offers.forEach(o => {
      if (o.stage === 'Teklif Gönderildi') {
        upcomingActions.push({ type: 'Teklif', title: `${o.clientName} - Müşteri Onayı Bekliyor`, sub: o.campaignName, value: o.value, color: 'text-amber-400' });
      } else if (o.stage === 'Müşteri Onayı' || o.stage === 'Sözleşme Bekliyor') {
        upcomingActions.push({ type: 'Sözleşme', title: `${o.clientName} - İmza Bekliyor`, sub: o.campaignName, value: o.value, color: 'text-blue-400' });
      }
    });
    reservations.forEach(r => {
      if (r.status === 'OPTIONED') {
        upcomingActions.push({ type: 'Opsiyon', title: `${r.clientName} - Opsiyon Süresi`, sub: r.spaceCode, value: r.budget, color: 'text-red-400' });
      }
    });

    const sortedUpcomingActions = upcomingActions.slice(0, 5);

    // Cashflow and Risks
    let collectedPast30 = 0;
    let expectedNext30 = 0;
    let overdueFinance = 0;

    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    const thirtyDaysAhead = new Date();
    thirtyDaysAhead.setDate(today.getDate() + 30);
    const sevenDaysAhead = new Date();
    sevenDaysAhead.setDate(today.getDate() + 7);

    const riskiestAccounts: any[] = [];

    if (finance && finance.accounts) {
      finance.accounts.forEach((acc: any) => {
        const bal = parseFloat(acc.balance.replace(/[^\d]/g, '')) || 0;
        if (bal > 0) {
          riskiestAccounts.push({ name: acc.name, balance: bal, balanceText: acc.balance, riskScore: acc.riskScore || 0 });
        }

        if (acc.collections) {
          acc.collections.forEach((col: any) => {
            const d = parseAnyDate(col.date);
            if (d && d >= thirtyDaysAgo && d <= today) {
              const amt = parseFloat(col.amount.replace(/[^\d]/g, '')) || 0;
              collectedPast30 += amt;
            }
          });
        }

        if (acc.paymentPlan) {
          acc.paymentPlan.forEach((p: any) => {
            const d = parseAnyDate(p.dueDate);
            if (p.status === 'Gecikti') {
              const amt = parseFloat(p.amount.replace(/[^\d]/g, '')) || 0;
              overdueFinance += amt;
            } else if (p.status === 'Bekliyor' && d && d >= today && d <= thirtyDaysAhead) {
              const amt = parseFloat(p.amount.replace(/[^\d]/g, '')) || 0;
              expectedNext30 += amt;
            }
          });
        }
      });
    }

    riskiestAccounts.sort((a, b) => b.balance - a.balance);

    // Detaillierte Risk Statistics
    let dueWithin7 = 0;
    let dueWithin30 = 0;
    if (finance && finance.accounts) {
      finance.accounts.forEach((acc: any) => {
        if (acc.paymentPlan) {
          acc.paymentPlan.forEach((p: any) => {
            if (p.status === 'Bekliyor') {
              const d = parseAnyDate(p.dueDate);
              if (d && d >= today) {
                const amt = parseFloat(p.amount.replace(/[^\d]/g, '')) || 0;
                if (d <= sevenDaysAhead) {
                  dueWithin7 += amt;
                }
                if (d <= thirtyDaysAhead) {
                  dueWithin30 += amt;
                }
              }
            }
          });
        }
      });
    }

    // Inventory operations
    const inventory = {
      total: spaces.length,
      dolu: spaces.filter(s => s.status === 'dolu').length,
      opsiyonlu: reservations.filter(r => r.status === 'OPTIONED').length,
      bos: spaces.filter(s => s.status === 'bos').length
    };

    const campaignOps = {
      active: campaigns.filter(c => c.status === 'Aktif' || c.status === 'active').length,
      planned: campaigns.filter(c => c.status === 'Planlandı' || c.status === 'planned').length,
      startsThisWeek: 0,
      endsThisWeek: 0
    };

    campaigns.forEach(c => {
      const start = parseAnyDate(c.startDate);
      const end = parseAnyDate(c.endDate);
      if (start && start >= today && start <= sevenDaysAhead) {
        campaignOps.startsThisWeek++;
      }
      if (end && end >= today && end <= sevenDaysAhead) {
        campaignOps.endsThisWeek++;
      }
    });

    const digitalPublish = {
      activeScreens: screens.filter(s => s.status === 'active').length,
      playlistCount: slots.length,
      todayPlays: pops.reduce((sum, p) => sum + (p.playsPerDay || 0), 0),
      popOk: pops.filter(p => p.status === 'Yayınlanıyor').length
    };

    // Tabbed Deadline List
    const deadlines: any[] = [];
    reservations.forEach(r => {
      if (r.status === 'OPTIONED' && r.optionExpiresAt) {
        const d = parseAnyDate(r.optionExpiresAt);
        if (d) {
          const days = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          deadlines.push({ type: 'Opsiyon', client: r.clientName, subject: `Opsiyon Bitişi (${r.spaceCode})`, days, value: r.budget, rawDate: d });
        }
      }
    });

    contracts.forEach(c => {
      if ((c.status === 'signed' || c.status === 'active' || c.status === 'Aktif') && c.endDate) {
        const d = parseAnyDate(c.endDate);
        if (d) {
          const days = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          deadlines.push({ type: 'Sözleşme', client: c.clientName, subject: `Sözleşme Sonu (${c.contractNo})`, days, value: c.value, rawDate: d });
        }
      }
    });

    if (finance && finance.accounts) {
      finance.accounts.forEach((acc: any) => {
        if (acc.paymentPlan) {
          acc.paymentPlan.forEach((p: any) => {
            if (p.status === 'Bekliyor') {
              const d = parseAnyDate(p.dueDate);
              if (d) {
                const days = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                deadlines.push({ type: 'Tahsilat', client: acc.name, subject: `${p.installment} Vadesi`, days, value: p.amount, rawDate: d });
              }
            }
          });
        }
      });
    }

    campaigns.forEach(c => {
      if (c.endDate) {
        const d = parseAnyDate(c.endDate);
        if (d) {
          const days = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          deadlines.push({ type: 'Kampanya', client: c.clientName, subject: `Yayın Sonu (${c.campaignName})`, days, value: c.budget, rawDate: d });
        }
      }
    });

    deadlines.sort((a, b) => a.days - b.days);

    return {
      isSystemEmpty,
      ciro,
      pipeline,
      tahsilatBekleyen: pendingCollections,
      activeContractsCount,
      activeCampaignsCount,
      occupancyRate,
      aiInsights,
      funnelStages,
      winRateText,
      sortedUpcomingActions,
      collectedPast30,
      expectedNext30,
      overdueFinance,
      riskiestAccounts,
      dueWithin7,
      dueWithin30,
      inventory,
      campaignOps,
      digitalPublish,
      deadlines
    };
  }
};
