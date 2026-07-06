import { AutomationRule } from './workflowTypes';

export const automationRules: AutomationRule[] = [
  {
    eventType: 'offer.approved',
    actions: [
      {
        actionType: 'create_contract_draft',
        targetEntityType: 'contract',
        payload: { title: 'Sözleşme Taslağı Hazırla', notes: 'Teklif onayına istinaden sözleşme taslağı oluşturuldu.' }
      },
      {
        actionType: 'create_task',
        targetEntityType: 'task',
        payload: { title: 'Sözleşme Taslağını İmzaya Gönder', priority: 'Kritik', category: 'Sözleşme' }
      },
      {
        actionType: 'create_notification',
        targetEntityType: 'notification',
        payload: { message: 'Teklif onaylandı, sözleşme taslağı otomatik oluşturuldu.', type: 'info' }
      },
      {
        actionType: 'write_activity_log',
        targetEntityType: 'system',
        payload: { description: 'Teklif onaylandı, sözleşme taslağı oluşturuldu.', module: 'offers' }
      }
    ]
  },
  {
    eventType: 'contract.signed',
    actions: [
      {
        actionType: 'create_reservation',
        targetEntityType: 'reservation',
        payload: { title: 'Alan Rezervasyon Kaydı', notes: 'Sözleşme imzalanmasına istinaden alanlar rezerve edildi.' }
      },
      {
        actionType: 'create_notification',
        targetEntityType: 'notification',
        payload: { message: 'Sözleşme imzalandı, alan rezervasyonları onay sürecine gönderildi.', type: 'success' }
      },
      {
        actionType: 'write_activity_log',
        targetEntityType: 'system',
        payload: { description: 'Sözleşme imzalandı, alan rezervasyonları oluşturuldu.', module: 'contracts' }
      }
    ]
  },
  {
    eventType: 'reservation.approved',
    actions: [
      {
        actionType: 'create_campaign_draft',
        targetEntityType: 'campaign',
        payload: { title: 'Kampanya Taslağı', notes: 'Rezervasyon onayına istinaden kampanya planlama taslağı oluşturuldu.' }
      },
      {
        actionType: 'create_notification',
        targetEntityType: 'notification',
        payload: { message: 'Rezervasyon onaylandı, kampanya taslağı oluşturuldu.', type: 'success' }
      },
      {
        actionType: 'write_activity_log',
        targetEntityType: 'system',
        payload: { description: 'Rezervasyon onaylandı, kampanya taslağı oluşturuldu.', module: 'reservations' }
      }
    ]
  },
  {
    eventType: 'campaign.started',
    actions: [
      {
        actionType: 'create_invoice_draft',
        targetEntityType: 'invoice',
        payload: { title: 'Fatura Taslağı', notes: 'Kampanya başlamasına istinaden ilk fatura taslağı oluşturuldu.' }
      },
      {
        actionType: 'create_notification',
        targetEntityType: 'notification',
        payload: { message: 'Kampanya yayını başladı, fatura taslağı oluşturuldu.', type: 'info' }
      }
    ]
  },
  {
    eventType: 'invoice.due_soon',
    actions: [
      {
        actionType: 'create_task',
        targetEntityType: 'task',
        payload: { title: 'Tahsilat Takibi Yap', priority: 'Yüksek', category: 'Finans' }
      },
      {
        actionType: 'create_notification',
        targetEntityType: 'notification',
        payload: { message: 'Fatura vadesi yaklaşıyor, tahsilat görevi oluşturuldu.', type: 'warning' }
      }
    ]
  },
  {
    eventType: 'contract.expiring_30',
    actions: [
      {
        actionType: 'create_task',
        targetEntityType: 'task',
        payload: { title: 'Sözleşme Yenileme Görüşmesi Yap', priority: 'Yüksek', category: 'Satış' }
      },
      {
        actionType: 'create_notification',
        targetEntityType: 'notification',
        payload: { message: 'Sözleşme 30 gün içinde sona eriyor, satış yenileme görevi atandı.', type: 'warning' }
      }
    ]
  }
];
