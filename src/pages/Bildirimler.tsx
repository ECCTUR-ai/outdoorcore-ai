import React, { useState } from 'react';
import { 
  Plus, 
  SlidersHorizontal, 
  Sparkles,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Bell,
  Users,
  Award
} from 'lucide-react';
import { DarkKpiCard } from '@/components/design-system/DarkKpiCard';
import { NotificationSummaryCard } from '@/components/design-system/NotificationSummaryCard';
import { NotificationTimeline } from '@/components/design-system/NotificationTimeline';
import { TaskKanban } from '@/components/design-system/TaskKanban';
import { TodayCalendar } from '@/components/design-system/TodayCalendar';
import { DeadlineWidget } from '@/components/design-system/DeadlineWidget';
import { ApprovalCenter } from '@/components/design-system/ApprovalCenter';
import { PriorityCenter } from '@/components/design-system/PriorityCenter';
import { UserPerformance } from '@/components/design-system/UserPerformance';
import { TeamActivity } from '@/components/design-system/TeamActivity';
import { QuickTaskActions } from '@/components/design-system/QuickTaskActions';
import { AiInsightDrawer } from '@/components/design-system/AiInsightDrawer';
import { Button } from '@/components/design-system/Button';
import { AutomationActivityPanel } from '@/components/design-system/AutomationActivityPanel';
import { createWorkflowEvent } from '@/automation/workflowEvents';
import { workflowEngine } from '@/automation/workflowEngine';

export function Bildirimler() {
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [highlightedEntity, setHighlightedEntity] = useState<{ type: 'task' | 'notification'; id: string } | null>(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const taskId = params.get('taskId');
    const notificationId = params.get('notificationId');
    if (taskId) {
      setHighlightedEntity({ type: 'task', id: taskId });
    } else if (notificationId) {
      setHighlightedEntity({ type: 'notification', id: notificationId });
    }
  }, []);

  return (
    <div className="space-y-6 select-none pb-12">
      {highlightedEntity && (
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-between text-left animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <Sparkles size={16} />
            </span>
            <div className="space-y-0.5">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Odaklanmış Kayıt Detayı Yüklendi</h4>
              <p className="text-[10px] text-slate-400 font-semibold leading-normal">
                {highlightedEntity.type === 'task' ? 'Görev' : 'Bildirim'} referansı <strong>#{highlightedEntity.id}</strong> ile eşleşen operasyonel kayıtlar listelendi.
              </p>
            </div>
          </div>
          <Button variant="minimal" size="xs" onClick={() => setHighlightedEntity(null)}>
            Temizle
          </Button>
        </div>
      )}
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 p-5 rounded-3xl border border-white/5 shadow-sm text-left">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">Bildirim & Görev Merkezi</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">OutdoorCore AI tarafından oluşturulan canlı bildirimler, görevler ve operasyon merkezi.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* OutdoorCore AI Button */}
          <Button 
            variant="primary" 
            size="sm" 
            leftIcon={<Sparkles size={13} className="animate-pulse" />}
            className="bg-gradient-to-r from-blue-650 to-indigo-650 hover:from-blue-600 hover:to-indigo-600 text-white font-black"
            onClick={() => setAiDrawerOpen(true)}
          >
            OutdoorCore AI
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            leftIcon={<Plus size={13} />}
            onClick={() => alert('Yeni görev oluşturma formu açılacak.')}
          >
            Yeni Görev
          </Button>

          <Button 
            variant="minimal" 
            size="sm" 
            leftIcon={<Calendar size={13} />}
            onClick={() => alert('Takvim görünümü açılıyor...')}
          >
            Takvim
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            leftIcon={<SlidersHorizontal size={13} />}
            onClick={() => alert('Filtreleme ayarları açıldı.')}
          >
            Filtre
          </Button>
        </div>
      </div>

      {/* Upper Pipeline KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <DarkKpiCard
          title="Toplam Bildirim"
          value="148"
          percentage="%100"
          subtext="Canlı gelen akışlar"
          icon={<Bell size={15} />}
          iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/10"
        />
        <DarkKpiCard
          title="Kritik Uyarı"
          value="12"
          percentage="ALARM"
          subtext="Gecikme & arızalar"
          icon={<AlertTriangle size={15} />}
          iconBgColor="bg-rose-500/10 text-rose-450 border-rose-550/10"
          glowColor="red"
        />
        <DarkKpiCard
          title="Bugünkü Görev"
          value="26"
          percentage="AKTİF"
          subtext="Bugün bitmesi gereken"
          icon={<Clock size={15} />}
          iconBgColor="bg-sky-500/10 text-sky-400 border-sky-500/10"
          glowColor="blue"
        />
        <DarkKpiCard
          title="Tamamlanan"
          value="18"
          percentage="%69.2"
          subtext="Kapatılan task adeti"
          icon={<CheckCircle size={15} />}
          iconBgColor="bg-emerald-500/10 text-emerald-450 border-emerald-450/10"
          glowColor="green"
        />
        <DarkKpiCard
          title="Geciken"
          value="5"
          percentage="ASILDI"
          subtext="Süresi aşılmış olanlar"
          icon={<AlertTriangle size={15} />}
          iconBgColor="bg-rose-500/10 text-rose-450 border-rose-500/10"
          glowColor="red"
        />
        <DarkKpiCard
          title="AI Öncelik Skoru"
          value="9.6"
          percentage="MAKS"
          subtext="Yapay zeka verimliliği"
          icon={<Sparkles size={15} />}
          iconBgColor="bg-purple-500/10 text-purple-400 border-purple-400/10"
          glowColor="purple"
          sparkline={true}
        />
      </div>

      {/* Section 1: AI Görev Özeti */}
      <NotificationSummaryCard />

      {/* Grid Layout: Timeline, Kanban */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="order-2 lg:order-none lg:col-span-4">
          <NotificationTimeline />
        </div>
        <div className="order-1 lg:order-none lg:col-span-8">
          <TaskKanban />
        </div>
      </div>

      {/* Grid Layout: Schedules, Deadlines, Approvals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TodayCalendar />
        <DeadlineWidget />
        <ApprovalCenter />
      </div>

      {/* Grid Layout: AI Priorities, Performance, Team Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <PriorityCenter />
        </div>
        <div className="lg:col-span-3">
          <UserPerformance />
        </div>
        <div className="lg:col-span-3">
          <TeamActivity />
        </div>
      </div>

      {/* Simulation Button Bar & Automation Activity log */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-indigo-950/20 p-5 rounded-3xl border border-indigo-500/15 text-left">
          <div className="space-y-1">
            <h3 className="text-xs font-black text-white uppercase tracking-widest leading-none flex items-center gap-1.5">
              <Sparkles size={12} className="text-indigo-400" />
              Demo Workflow Tetikleyici (Simülasyon)
            </h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Aşağıdaki butonları kullanarak satış otomasyon kurallarını tetikleyebilir ve sonuçları anında izleyebilirsiniz.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="xs"
              type="button"
              onClick={() => {
                const event = createWorkflowEvent('offer.approved', 'offer', 'PRP-1002', {
                  clientName: 'Samsung Electronics',
                  campaignName: 'Galaxy S26 Lansmanı'
                });
                workflowEngine.dispatchWorkflowEvent(event);
              }}
            >
              Teklif Onaylandı
            </Button>
            <Button
              variant="outline"
              size="xs"
              type="button"
              onClick={() => {
                const event = createWorkflowEvent('contract.signed', 'contract', 'CON-2005', {
                  clientName: 'Türk Hava Yolları',
                  campaignName: 'Global Gateway 2026'
                });
                workflowEngine.dispatchWorkflowEvent(event);
              }}
            >
              Sözleşme İmzalandı
            </Button>
            <Button
              variant="outline"
              size="xs"
              type="button"
              onClick={() => {
                const event = createWorkflowEvent('reservation.approved', 'reservation', 'RES-3008', {
                  clientName: 'Mercedes-Benz',
                  campaignName: 'EQS Premium Showcase'
                });
                workflowEngine.dispatchWorkflowEvent(event);
              }}
            >
              Rezervasyon Onaylandı
            </Button>
            <Button
              variant="outline"
              size="xs"
              type="button"
              onClick={() => {
                const event = createWorkflowEvent('campaign.started', 'campaign', 'CAM-4012', {
                  clientName: 'PepsiCo Turkey',
                  campaignName: 'Yaz Ferahlığı 2026'
                });
                workflowEngine.dispatchWorkflowEvent(event);
              }}
            >
              Kampanya Başladı
            </Button>
            <Button
              variant="outline"
              size="xs"
              type="button"
              onClick={() => {
                const event = createWorkflowEvent('invoice.due_soon', 'invoice', 'FTR-5067', {
                  clientName: 'Vodafone Turkey',
                  campaignName: 'Red Paket Tanıtımı'
                });
                workflowEngine.dispatchWorkflowEvent(event);
              }}
            >
              Fatura Vadesi Yaklaştı
            </Button>
          </div>
        </div>

        <AutomationActivityPanel />
      </div>

      {/* Quick shortcuts action center */}
      <QuickTaskActions />

      {/* Sliding AI Panel Drawer */}
      <AiInsightDrawer 
        isOpen={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
        selectedSpaceCode="Yönetici Görev Kontrol Merkezi"
      />
    </div>
  );
}
