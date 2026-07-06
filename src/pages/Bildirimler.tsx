import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckSquare, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Sparkles, 
  SlidersHorizontal, 
  Plus, 
  Calendar, 
  Settings, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Eye, 
  Archive,
  UserPlus
} from 'lucide-react';
import { notificationRepository } from '@/notifications/notificationRepository';
import { taskRepository } from '@/notifications/taskRepository';
import { notificationPreferencesManager } from '@/notifications/notificationPreferences';
import { createWorkflowEvent } from '@/automation/workflowEvents';
import { workflowEngine } from '@/automation/workflowEngine';
import { Notification, Task, NotificationPreference } from '@/notifications/notificationTypes';

import { DarkKpiCard } from '@/components/design-system/DarkKpiCard';
import { TaskKanban } from '@/components/design-system/TaskKanban';
import { Button } from '@/components/design-system/Button';
import { AutomationActivityPanel } from '@/components/design-system/AutomationActivityPanel';
import { Badge } from '@/components/design-system/Badge';
import { QuickTaskActions } from '@/components/design-system/QuickTaskActions';
import { AiInsightDrawer } from '@/components/design-system/AiInsightDrawer';

export function Bildirimler() {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'critical' | 'tasks' | 'today' | 'overdue' | 'archive'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [showPrefs, setShowPrefs] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  // Filters State
  const [catFilter, setCatFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');

  const loadData = () => {
    setNotifications(notificationRepository.getAllSync());
    setTasks(taskRepository.list());
    setPreferences(notificationPreferencesManager.getPreferences());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('notifications_updated', loadData);
    window.addEventListener('tasks_updated', loadData);
    window.addEventListener('notification_preferences_updated', loadData);
    return () => {
      window.removeEventListener('notifications_updated', loadData);
      window.removeEventListener('tasks_updated', loadData);
      window.removeEventListener('notification_preferences_updated', loadData);
    };
  }, []);

  const handleTogglePreference = (category: Notification['category'], channel: 'in_app' | 'email' | 'whatsapp' | 'sms' | 'push') => {
    const updated = preferences.map(pref => {
      if (pref.category === category) {
        return { ...pref, [channel]: !pref[channel] };
      }
      return pref;
    });
    notificationPreferencesManager.savePreferences(updated);
  };

  const handleToggleEnabled = (category: Notification['category']) => {
    const updated = preferences.map(pref => {
      if (pref.category === category) {
        return { ...pref, enabled: !pref.enabled };
      }
      return pref;
    });
    notificationPreferencesManager.savePreferences(updated);
  };

  // Convert a notification to a task
  const handleConvertToTask = (notif: Notification) => {
    taskRepository.create({
      title: `${notif.title} Takibi`,
      description: notif.message,
      status: 'todo',
      priority: notif.priority,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      sourceEntityType: notif.sourceEntityType,
      sourceEntityId: notif.sourceEntityId,
      assignedTo: 'Ahmet Y.'
    });
    alert('Bildirim başarıyla göreve dönüştürüldü!');
  };

  // Filtering Notifications
  const getFilteredNotifications = () => {
    let filtered = [...notifications];
    
    // Tab filter
    if (activeTab === 'unread') {
      filtered = filtered.filter(n => !n.isRead && !n.isArchived);
    } else if (activeTab === 'critical') {
      filtered = filtered.filter(n => n.priority === 'critical' && !n.isRead && !n.isArchived);
    } else if (activeTab === 'archive') {
      filtered = filtered.filter(n => n.isArchived);
    } else {
      filtered = filtered.filter(n => !n.isArchived);
    }

    // Dropdown filters
    if (catFilter !== 'all') {
      filtered = filtered.filter(n => n.category === catFilter);
    }
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(n => n.priority === priorityFilter);
    }

    return filtered;
  };

  // Filtering Tasks
  const getFilteredTasks = () => {
    let filtered = [...tasks];

    // Tab filter
    if (activeTab === 'today') {
      filtered = taskRepository.listToday();
    } else if (activeTab === 'overdue') {
      filtered = taskRepository.listOverdue();
    }

    // Dropdown filters
    if (assigneeFilter !== 'all') {
      filtered = filtered.filter(t => t.assignedTo === assigneeFilter);
    }
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(t => t.priority === priorityFilter);
    }

    return filtered;
  };

  // Calculations for KPIs
  const totalNotifications = notifications.filter(n => !n.isArchived).length;
  const unreadNotifications = notifications.filter(n => !n.isRead && !n.isArchived).length;
  const criticalNotifications = notifications.filter(n => n.priority === 'critical' && !n.isRead && !n.isArchived).length;
  const activeTasks = tasks.filter(t => t.status !== 'completed').length;
  const overdueTasksCount = taskRepository.listOverdue().length;
  const todayTasksCount = taskRepository.listToday().length;

  return (
    <div className="space-y-6 select-none pb-12 text-left">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 p-5 rounded-3xl border border-white/5 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">Bildirim & Görev Yönetim Merkezi</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Otomasyon kuralları, canlı bildirim tercihleri ve operasyonel görev panosu.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            variant={showPrefs ? 'primary' : 'outline'} 
            size="sm" 
            leftIcon={<Settings size={13} />}
            onClick={() => setShowPrefs(!showPrefs)}
          >
            Bildirim Ayarları
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            leftIcon={<Plus size={13} />}
            onClick={() => {
              const title = prompt('Görev Başlığı:');
              if (title) {
                taskRepository.create({
                  title,
                  description: 'Manuel oluşturulan operasyonel görev.',
                  status: 'todo',
                  priority: 'medium',
                  assignedTo: 'Ayşe K.'
                });
              }
            }}
          >
            Yeni Görev
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <DarkKpiCard
          title="Tüm Bildirimler"
          value={totalNotifications.toString()}
          percentage="%100"
          subtext="Toplam aktif akış"
          icon={<Bell size={15} />}
          iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/10"
        />
        <DarkKpiCard
          title="Okunmamış"
          value={unreadNotifications.toString()}
          percentage="CANLI"
          subtext="Bekleyen bildirimler"
          icon={<Bell size={15} className="animate-pulse" />}
          iconBgColor="bg-sky-500/10 text-sky-400 border-sky-550/10"
          glowColor="blue"
        />
        <DarkKpiCard
          title="Kritik Bildirimler"
          value={criticalNotifications.toString()}
          percentage="ALARM"
          subtext="Kritik sistem uyarıları"
          icon={<AlertTriangle size={15} />}
          iconBgColor="bg-rose-500/10 text-rose-450 border-rose-500/10"
          glowColor="red"
        />
        <DarkKpiCard
          title="Aktif Görevler"
          value={activeTasks.toString()}
          percentage="TASK"
          subtext="Atanmış açık işler"
          icon={<Clock size={15} />}
          iconBgColor="bg-amber-500/10 text-amber-400 border-amber-500/10"
          glowColor="purple"
        />
        <DarkKpiCard
          title="Bugünkü Görevler"
          value={todayTasksCount.toString()}
          percentage="BUGÜN"
          subtext="Bugün bitmesi gereken"
          icon={<Calendar size={15} />}
          iconBgColor="bg-teal-500/10 text-teal-400 border-teal-500/10"
          glowColor="green"
        />
        <DarkKpiCard
          title="Geciken Görevler"
          value={overdueTasksCount.toString()}
          percentage="ASILDI"
          subtext="Vadesi geçmiş işler"
          icon={<AlertTriangle size={15} />}
          iconBgColor="bg-rose-500/10 text-rose-400 border-rose-500/10"
          glowColor="red"
        />
      </div>

      {/* Preferences panel card */}
      {showPrefs && (
        <div className="dark-glass-card border border-white/10 rounded-3xl p-6 space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Settings className="text-blue-400" size={16} />
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest leading-none">Bildirim Kanalları Tercih Ayarları</h3>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">Hangi modül olayı hangi iletişim kanalından iletilecek?</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {preferences.map(pref => (
              <div 
                key={pref.category}
                className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 flex flex-col justify-between space-y-3 hover:border-white/10 transition-colors"
              >
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-[10px] font-black text-white uppercase tracking-wider">{pref.category}</span>
                  <button
                    type="button"
                    onClick={() => handleToggleEnabled(pref.category)}
                    className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${pref.enabled ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'}`}
                  >
                    {pref.enabled ? 'Açık' : 'Kapalı'}
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2 text-center text-slate-400">
                  <button 
                    type="button"
                    onClick={() => handleTogglePreference(pref.category, 'in_app')}
                    className={`p-1.5 rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-white/5 border-0 ${pref.in_app && pref.enabled ? 'text-blue-400 bg-blue-500/10' : 'opacity-40'}`}
                    title="Uygulama İçi Bildirim"
                  >
                    <Bell size={11} />
                    <span className="text-[6.5px] font-black">APP</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleTogglePreference(pref.category, 'email')}
                    className={`p-1.5 rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-white/5 border-0 ${pref.email && pref.enabled ? 'text-blue-400 bg-blue-500/10' : 'opacity-40'}`}
                    title="E-Posta Bildirimi"
                  >
                    <Mail size={11} />
                    <span className="text-[6.5px] font-black">MAIL</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleTogglePreference(pref.category, 'whatsapp')}
                    className={`p-1.5 rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-white/5 border-0 ${pref.whatsapp && pref.enabled ? 'text-blue-400 bg-blue-500/10' : 'opacity-40'}`}
                    title="WhatsApp Bildirimi"
                  >
                    <MessageSquare size={11} />
                    <span className="text-[6.5px] font-black">WA</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleTogglePreference(pref.category, 'sms')}
                    className={`p-1.5 rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-white/5 border-0 ${pref.sms && pref.enabled ? 'text-blue-400 bg-blue-500/10' : 'opacity-40'}`}
                    title="SMS Bildirimi"
                  >
                    <Smartphone size={11} />
                    <span className="text-[6.5px] font-black">SMS</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleTogglePreference(pref.category, 'push')}
                    className={`p-1.5 rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-white/5 border-0 ${pref.push && pref.enabled ? 'text-blue-400 bg-blue-500/10' : 'opacity-40'}`}
                    title="Mobil Push Bildirimi"
                  >
                    <Smartphone size={11} />
                    <span className="text-[6.5px] font-black">PUSH</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-white/5 overflow-x-auto no-scrollbar gap-1.5">
        {[
          { key: 'all', label: 'Tüm Bildirimler', icon: <Bell size={12} /> },
          { key: 'unread', label: 'Okunmamış', icon: <Bell size={12} className="animate-pulse" /> },
          { key: 'critical', label: 'Kritik', icon: <AlertTriangle size={12} /> },
          { key: 'tasks', label: 'Tüm Görevler', icon: <CheckSquare size={12} /> },
          { key: 'today', label: 'Bugünküler', icon: <Calendar size={12} /> },
          { key: 'overdue', label: 'Gecikenler', icon: <Clock size={12} /> },
          { key: 'archive', label: 'Arşiv', icon: <Archive size={12} /> }
        ].map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-[10.5px] font-black uppercase tracking-wider transition-all duration-150 border-b-2 cursor-pointer ${
              activeTab === tab.key 
                ? 'border-blue-500 text-white bg-white/3' 
                : 'border-transparent text-slate-400 hover:text-white hover:bg-white/1'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters row for selected view */}
      <div className="flex flex-wrap items-center gap-4 bg-white/2 p-4 rounded-2xl border border-white/5">
        <span className="text-[9.5px] font-black text-slate-500 uppercase tracking-widest leading-none">Filtreleme:</span>
        
        {activeTab !== 'tasks' && activeTab !== 'today' && activeTab !== 'overdue' ? (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Kategori</label>
              <select 
                value={catFilter}
                onChange={e => setCatFilter(e.target.value)}
                className="bg-[#0f172a] border border-white/5 rounded-lg px-2.5 py-1 text-[9.5px] text-slate-350 font-bold focus:outline-none"
              >
                <option value="all">TÜMÜ</option>
                <option value="offer">TEKLİF</option>
                <option value="contract">SÖZLEŞME</option>
                <option value="reservation">REZERVASYON</option>
                <option value="campaign">KAMPANYA</option>
                <option value="finance">FİNANS</option>
                <option value="maintenance">BAKIM</option>
                <option value="system">SİSTEM</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Öncelik</label>
              <select 
                value={priorityFilter}
                onChange={e => setPriorityFilter(e.target.value)}
                className="bg-[#0f172a] border border-white/5 rounded-lg px-2.5 py-1 text-[9.5px] text-slate-350 font-bold focus:outline-none"
              >
                <option value="all">TÜMÜ</option>
                <option value="low">DÜŞÜK</option>
                <option value="medium">ORTA</option>
                <option value="high">YÜKSEK</option>
                <option value="critical">KRİTİK</option>
              </select>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Sorumlu</label>
              <select 
                value={assigneeFilter}
                onChange={e => setAssigneeFilter(e.target.value)}
                className="bg-[#0f172a] border border-white/5 rounded-lg px-2.5 py-1 text-[9.5px] text-slate-350 font-bold focus:outline-none"
              >
                <option value="all">TÜMÜ</option>
                <option value="Ahmet Y.">AHMET Y.</option>
                <option value="Ayşe K.">AYŞE K.</option>
                <option value="Mehmet S.">MEHMET S.</option>
                <option value="Atanmadı">ATANMADI</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Öncelik</label>
              <select 
                value={priorityFilter}
                onChange={e => setPriorityFilter(e.target.value)}
                className="bg-[#0f172a] border border-white/5 rounded-lg px-2.5 py-1 text-[9.5px] text-slate-350 font-bold focus:outline-none"
              >
                <option value="all">TÜMÜ</option>
                <option value="low">DÜŞÜK</option>
                <option value="medium">ORTA</option>
                <option value="high">YÜKSEK</option>
                <option value="critical">KRİTİK</option>
              </select>
            </div>
          </>
        )}
      </div>

      {/* Main List Layouts based on active tabs */}
      {activeTab === 'tasks' || activeTab === 'today' || activeTab === 'overdue' ? (
        <div className="space-y-6">
          {/* Display Interactive Kanban */}
          <TaskKanban />
        </div>
      ) : (
        <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-3.5">
          <div className="flex items-center gap-1.5 pb-2 border-b border-white/5">
            <Bell size={13} className="text-slate-400" />
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Canlı Bildirim Listesi</h4>
          </div>

          <div className="space-y-2.5">
            {getFilteredNotifications().length === 0 ? (
              <div className="p-8 text-center text-xs font-bold text-slate-500 uppercase">
                Bu kritere uyan bildirim kaydı bulunamadı.
              </div>
            ) : (
              getFilteredNotifications().map(n => (
                <div 
                  key={n.notificationId}
                  className={`p-4 rounded-2xl bg-[#08111f]/35 border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${!n.isRead ? 'border-l-2 border-l-blue-500 pl-3' : ''}`}
                >
                  <div className="space-y-1.5 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-white uppercase font-mono tracking-tighter">#{n.notificationId}</span>
                      <Badge variant="muted" className="text-[7.5px] font-extrabold uppercase py-0 border-white/10 text-slate-400">
                        {n.category}
                      </Badge>
                      <span className="text-[8px] text-slate-500 font-semibold">{new Date(n.createdAt).toLocaleString('tr-TR')}</span>
                    </div>
                    <h5 className="text-[10.5px] font-black text-white leading-tight uppercase">{n.title}</h5>
                    <p className="text-[10px] text-slate-400 font-semibold leading-normal">{n.message}</p>
                    <div className="flex items-center gap-1.5 pt-1.5">
                      <span className="text-[8px] text-slate-550 font-black uppercase">Kanal: {n.channel}</span>
                      <span className="text-slate-700 font-bold">&bull;</span>
                      <span className="text-[8px] text-slate-550 font-black uppercase">Öncelik: {n.priority}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${n.priority === 'critical' ? 'bg-rose-500 animate-pulse' : n.priority === 'high' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {!n.isRead && (
                      <Button
                        variant="primary"
                        size="xs"
                        type="button"
                        className="bg-blue-600 hover:bg-blue-500 text-white"
                        onClick={() => {
                          notificationRepository.markAsRead(n.notificationId);
                          loadData();
                        }}
                      >
                        Okundu
                      </Button>
                    )}
                    {!n.isArchived && (
                      <Button
                        variant="outline"
                        size="xs"
                        type="button"
                        onClick={() => {
                          notificationRepository.archive(n.notificationId);
                          loadData();
                        }}
                      >
                        Arşivle
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="xs"
                      type="button"
                      leftIcon={<Plus size={10} />}
                      onClick={() => handleConvertToTask(n)}
                    >
                      Göreve Çevir
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Simulations dashboard at the bottom */}
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
                const event = createWorkflowEvent('contract.expiring_30', 'contract', 'CON-2005', {
                  clientName: 'Türk Hava Yolları',
                  campaignName: 'Global Gateway 2026'
                });
                workflowEngine.dispatchWorkflowEvent(event);
              }}
            >
              Sözleşme Bitiş (30 Gün)
            </Button>
            <Button
              variant="outline"
              size="xs"
              type="button"
              onClick={() => {
                const event = createWorkflowEvent('invoice.due_soon', 'invoice', 'FTR-5067', {
                  clientName: 'Vodafone Turkey',
                  amount: '₺450,000'
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
