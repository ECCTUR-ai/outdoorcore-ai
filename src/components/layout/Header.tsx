import React, { useState } from 'react';
import { useApp, DateRangeType, DateRangeState } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';
import { Bell, Mail, ChevronDown, Calendar, Search, Menu, Sun, Moon, Sparkles } from 'lucide-react';
import { Avatar } from '../design-system/Avatar';
import { Badge } from '../design-system/Badge';
import { notificationRepository as newNotifRepo } from '@/notifications/notificationRepository';
import { taskRepository as newTaskRepo } from '@/notifications/taskRepository';
import { useAuth } from '@/auth/useAuth';
import { ProfileDrawer } from '../design-system/ProfileDrawer';

const calculateDateRangeValues = (type: DateRangeType, customStart?: string, customEnd?: string): { start: string; end: string } => {
  const mockToday = new Date('2025-06-15');
  const formatDate = (d: Date) => d.toISOString().substring(0, 10);
  
  switch (type) {
    case 'today':
      return { start: formatDate(mockToday), end: formatDate(mockToday) };
    case 'last-7-days': {
      const start = new Date(mockToday);
      start.setDate(mockToday.getDate() - 7);
      return { start: formatDate(start), end: formatDate(mockToday) };
    }
    case 'last-15-days': {
      const start = new Date(mockToday);
      start.setDate(mockToday.getDate() - 15);
      return { start: formatDate(start), end: formatDate(mockToday) };
    }
    case 'last-30-days': {
      const start = new Date(mockToday);
      start.setDate(mockToday.getDate() - 30);
      return { start: formatDate(start), end: formatDate(mockToday) };
    }
    case 'all-time':
      return { start: '1970-01-01', end: '2099-12-31' };
    case 'custom':
      return { start: customStart || '2025-05-01', end: customEnd || '2025-05-31' };
    default:
      return { start: '2025-05-01', end: '2025-05-31' };
  }
};

export function Header() {
  const { setCommandPaletteOpen, mobileSidebarOpen, setMobileSidebarOpen, setCurrentRoute, globalDateRange, setGlobalDateRange } = useApp();
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const { currentUser, logout, organization, permissions } = useAuth();

  const getFormatLabel = (state: DateRangeState) => {
    switch (state.type) {
      case 'today': return 'Bugün';
      case 'last-7-days': return 'Son 7 Gün';
      case 'last-15-days': return 'Son 15 Gün';
      case 'last-30-days': return 'Son 30 Gün';
      case 'all-time': return 'Tüm Zamanlar';
      case 'custom': {
        const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
        const formatSingle = (dateStr: string) => {
          if (!dateStr) return '';
          const parts = dateStr.split('-');
          if (parts.length !== 3) return dateStr;
          const day = parseInt(parts[2], 10);
          const monthIdx = parseInt(parts[1], 10) - 1;
          const year = parts[0];
          return `${day} ${months[monthIdx]} ${year}`;
        };
        return `${formatSingle(state.start)} - ${formatSingle(state.end)}`;
      }
      default: return 'Tarih Aralığı';
    }
  };

  const [notificationsList, setNotificationsList] = useState<any[]>([]);
  const [tasksList, setTasksList] = useState<any[]>([]);

  const loadNotificationData = () => {
    setNotificationsList(newNotifRepo.list());
    setTasksList(newTaskRepo.list());
  };

  React.useEffect(() => {
    loadNotificationData();
    window.addEventListener('notifications_updated', loadNotificationData);
    window.addEventListener('tasks_updated', loadNotificationData);
    return () => {
      window.removeEventListener('notifications_updated', loadNotificationData);
      window.removeEventListener('tasks_updated', loadNotificationData);
    };
  }, []);

  const unreadCount = notificationsList.filter(n => !n.isRead).length;
  const criticalCount = notificationsList.filter(n => n.priority === 'critical' && !n.isRead).length;
  const taskCount = tasksList.filter(t => t.status !== 'completed').length;

  // Sort: unread first, critical first, then date
  const latestNotifs = [...notificationsList]
    .sort((a, b) => {
      if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
      if (a.priority === 'critical' && b.priority !== 'critical') return -1;
      if (b.priority === 'critical' && a.priority !== 'critical') return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, 10);

  return (
    <header className="h-[75px] bg-[#0f172a]/60 backdrop-blur-md border-b border-white/5 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Welcome Left section with responsive hamburger */}
      <div className="flex items-center min-w-0">
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 mr-2.5 rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:text-white md:hidden cursor-pointer flex items-center justify-center shrink-0"
          title="Menüyü Aç"
        >
          <Menu size={13} />
        </button>
        
        <div className="text-left space-y-0.5 truncate leading-none">
          <h1 className="text-[10px] md:text-xs font-black text-white uppercase tracking-wider m-0 leading-none truncate">
            Cemil Sezgin
          </h1>
          <p className="hidden md:block text-[9.5px] text-slate-500 font-bold uppercase tracking-wider m-0">
            OutdoorCore AI Reklam Yönetim Paneli
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3.5">
        {/* Quick Command Palette Button */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-2.5 h-9 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all text-slate-400 font-bold cursor-pointer"
          title="Komut Paleti (Ctrl+K)"
        >
          <Search size={12} />
        </button>

        {/* Purple Outdoor AI Pilot Button */}
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent('toggle_ai_pilot'));
          }}
          className="flex items-center gap-1.5 px-3 h-9 bg-purple-600/15 hover:bg-purple-600/25 border border-purple-500/25 rounded-xl text-purple-400 font-black text-[9.5px] uppercase tracking-wider cursor-pointer transition-all shrink-0"
          title="Outdoor AI Pilot"
        >
          <Sparkles size={11} className="animate-pulse" />
          <span className="hidden sm:inline">AI Pilot</span>
        </button>

        {/* Demo Reset Button */}
        <button
          onClick={() => {
            if (confirm('Tüm veritabanı demo verileriyle sıfırlanacaktır. Emin misiniz?')) {
              import('@/services/demoSeedingService').then(({ demoSeedingService }) => {
                demoSeedingService.resetDemoData();
                alert('Demo verisi başarıyla yüklendi ve tüm modüller senkronize edildi.');
                window.location.reload();
              });
            }
          }}
          className="flex items-center gap-1.5 px-3 h-9 bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/25 rounded-xl text-emerald-450 font-black text-[9.5px] uppercase tracking-wider cursor-pointer transition-all shrink-0"
          title="Demo Veriyi Sıfırla"
        >
          <span>Demo Sıfırla</span>
        </button>

        {/* Date Selector range */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setShowDateDropdown(!showDateDropdown)}
            className="flex items-center gap-2 px-3 h-9 bg-white/5 border border-white/5 hover:border-white/10 rounded-xl text-slate-300 hover:text-white font-black text-[9.5px] uppercase tracking-wider cursor-pointer transition-all animate-fade-in"
          >
            <Calendar size={11} className="text-slate-400 shrink-0" />
            <span>{getFormatLabel(globalDateRange)}</span>
            <ChevronDown size={10} className="text-slate-500 shrink-0 animate-pulse" />
          </button>

          {showDateDropdown && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowDateDropdown(false)} 
              />
              <div className="absolute right-0 mt-2 w-64 dark-glass-card border border-white/10 rounded-2xl shadow-2xl p-3.5 z-50 animate-scale-in space-y-2.5">
                <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block border-b border-white/5 pb-1.5 mb-1.5">
                  Tarih Filtresi Seçin
                </span>
                <div className="space-y-1">
                  {[
                    { key: 'today', label: 'Bugün' },
                    { key: 'last-7-days', label: 'Son 7 Gün' },
                    { key: 'last-15-days', label: 'Son 15 Gün' },
                    { key: 'last-30-days', label: 'Son 30 Gün' },
                    { key: 'all-time', label: 'Tüm Zamanlar' },
                    { key: 'custom', label: 'Özel Tarih Aralığı' }
                  ].map(option => (
                    <button
                      key={option.key}
                      onClick={() => {
                        if (option.key !== 'custom') {
                          const range = calculateDateRangeValues(option.key as DateRangeType);
                          setGlobalDateRange({
                            type: option.key as DateRangeType,
                            start: range.start,
                            end: range.end
                          });
                          setShowDateDropdown(false);
                        } else {
                          setGlobalDateRange({
                            ...globalDateRange,
                            type: 'custom'
                          });
                        }
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-between ${
                        globalDateRange.type === option.key 
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/10' 
                          : 'text-slate-400 hover:text-white hover:bg-white/3 border border-transparent'
                      }`}
                    >
                      <span>{option.label}</span>
                      {globalDateRange.type === option.key && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                    </button>
                  ))}
                </div>

                {globalDateRange.type === 'custom' && (
                  <div className="bg-[#0b0f19] p-3 rounded-xl border border-white/5 space-y-2 text-left mt-2 animate-fade-in">
                    <span className="text-[7.5px] font-black text-slate-500 uppercase tracking-wider block">
                      Özel Tarih Seçimi
                    </span>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[8px] font-bold text-slate-400 uppercase">Başlangıç:</span>
                        <input
                          type="date"
                          value={globalDateRange.start}
                          onChange={(e) => setGlobalDateRange({
                            ...globalDateRange,
                            start: e.target.value
                          })}
                          className="bg-white/5 border border-white/5 rounded px-1.5 py-0.5 text-[9px] font-bold text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                        />
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[8px] font-bold text-slate-400 uppercase">Bitiş:</span>
                        <input
                          type="date"
                          value={globalDateRange.end}
                          onChange={(e) => setGlobalDateRange({
                            ...globalDateRange,
                            end: e.target.value
                          })}
                          className="bg-white/5 border border-white/5 rounded px-1.5 py-0.5 text-[9px] font-bold text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                        />
                      </div>
                      <button
                        onClick={() => setShowDateDropdown(false)}
                        className="w-full mt-1.5 bg-blue-500 hover:bg-blue-600 text-white font-black text-[8px] uppercase tracking-wider py-1 rounded-lg transition-all cursor-pointer text-center"
                      >
                        Uygula
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Message Icon */}
        <button 
          className="w-9 h-9 border border-white/5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 cursor-pointer flex items-center justify-center transition-all shrink-0"
          title="Mesajlar"
        >
          <Mail size={13} />
        </button>

        {/* Notifications Dropdown Toggle */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="w-9 h-9 border border-white/5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 cursor-pointer flex items-center justify-center transition-all relative shrink-0"
            title="Bildirimler"
            type="button"
          >
            <Bell size={13} />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-blue-500 glow-blue animate-pulse" />
            )}
          </button>

          {showNotifMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotifMenu(false)} 
              />
              <div className="absolute right-0 mt-2 w-72 sm:w-80 dark-glass-card border border-white/10 rounded-2xl shadow-2xl p-4 z-50 animate-scale-in max-h-[420px] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5 mb-3">
                  <h4 className="text-[10px] font-black text-white uppercase tracking-wider m-0">Canlı Bildirimler</h4>
                  <div className="flex items-center gap-1.5">
                    {criticalCount > 0 && (
                      <span className="text-[7.5px] bg-rose-500/10 text-rose-450 border border-rose-500/10 px-2 py-0.5 rounded font-black uppercase tracking-wider">{criticalCount} Kritik</span>
                    )}
                    {unreadCount > 0 && (
                      <button 
                        type="button"
                        onClick={() => {
                          newNotifRepo.markAllAsRead();
                          loadNotificationData();
                        }}
                        className="text-[7.5px] text-blue-400 hover:text-blue-300 font-black uppercase tracking-wider bg-transparent border-0 cursor-pointer"
                      >
                        Tümünü Oku
                      </button>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  {latestNotifs.length === 0 ? (
                    <div className="p-6 text-center text-[9px] text-slate-500 font-bold uppercase">
                      Bildirim bulunmuyor.
                    </div>
                  ) : (
                    latestNotifs.map(n => (
                      <div 
                        key={n.notificationId} 
                        className={`text-left space-y-1 border-b border-white/5 pb-2.5 last:border-0 last:pb-0 cursor-pointer hover:bg-white/3 p-1.5 rounded-xl transition-all relative ${!n.isRead ? 'bg-blue-950/10 border-l-2 border-l-blue-500 pl-2' : ''}`}
                        onClick={() => {
                          newNotifRepo.markAsRead(n.notificationId);
                          setShowNotifMenu(false);
                          loadNotificationData();
                          if (n.sourceEntityType === 'contract') {
                            setCurrentRoute('sozlesmeler');
                          } else if (n.sourceEntityType === 'offer') {
                            setCurrentRoute('teklifler');
                          } else if (n.sourceEntityType === 'campaign') {
                            setCurrentRoute('kampanyalar');
                          } else {
                            setCurrentRoute('bildirimler');
                          }
                        }}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[9px] font-black text-white leading-tight uppercase truncate">{n.category} | {n.title}</span>
                          <span className="text-[7.5px] text-slate-550 font-bold shrink-0">{new Date(n.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-[9px] text-slate-400 leading-normal font-semibold">{n.message}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-[7px] text-slate-500 font-black uppercase">Öncelik: {n.priority}</span>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            n.priority === 'critical' ? 'bg-rose-500 glow-red' :
                            n.priority === 'high' ? 'bg-amber-500' : 'bg-emerald-500'
                          }`} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="border-t border-white/5 pt-2.5 mt-3 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentRoute('bildirimler');
                      setShowNotifMenu(false);
                    }}
                    className="text-[8px] text-slate-400 hover:text-white font-black uppercase tracking-widest cursor-pointer w-full bg-transparent border-0 py-1"
                  >
                    Tüm Bildirimleri Göster &rarr;
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Card Dropdown */}
        <div className="flex items-center gap-1.5 border-l border-white/5 pl-2.5 md:pl-3.5 shrink-0 relative">
          <div 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-all select-none"
          >
            <Avatar 
              name={currentUser?.name || 'Cemil Sezgin'} 
              size="sm" 
              status="online" 
              className="font-black text-slate-200"
            />
            <ChevronDown size={11} className="text-slate-500 hover:text-slate-350 transition-colors" />
          </div>

          {showUserMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowUserMenu(false)} 
              />
              <div className="absolute right-0 top-10 mt-2 w-48 dark-glass-card border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-scale-in text-left">
                {/* User info header */}
                <div className="px-3.5 py-2.5 border-b border-white/5 mb-1.5 select-none space-y-1">
                  <span className="text-[10px] font-black text-white block leading-none truncate">{currentUser?.name}</span>
                  <span className="text-[7px] text-slate-550 font-bold block truncate">{currentUser?.email}</span>
                  <div className="pt-1.5 space-y-1 select-none">
                    <div className="flex justify-between items-center text-[6.5px] uppercase font-bold text-slate-450">
                      <span>Rol:</span>
                      <span className="text-white font-black">{currentUser?.role}</span>
                    </div>
                    <div className="flex justify-between items-center text-[6.5px] uppercase font-bold text-slate-450">
                      <span>Şirket:</span>
                      <span className="text-white font-black truncate max-w-[80px]">{organization?.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-[6.5px] uppercase font-bold text-slate-450">
                      <span>Lisans:</span>
                      <span className="text-emerald-450 font-black">{organization?.licenseStatus} ({organization?.tier})</span>
                    </div>
                    <div className="flex justify-between items-center text-[6.5px] uppercase font-bold text-slate-450">
                      <span>Yetkiler:</span>
                      <span className="text-blue-400 font-black">{permissions?.length} İzin</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    setProfileOpen(true);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-[9px] font-black uppercase text-slate-400 hover:text-white hover:bg-white/3 transition-all cursor-pointer block"
                >
                  Profil & Hesabım
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    setCurrentRoute('ayarlar');
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-[9px] font-black uppercase text-slate-400 hover:text-white hover:bg-white/3 transition-all cursor-pointer block"
                >
                  Sistem Ayarları
                </button>
                <button
                  onClick={async () => {
                    setShowUserMenu(false);
                    await logout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-[9px] font-black uppercase text-rose-450 hover:text-rose-400 hover:bg-rose-500/5 transition-all cursor-pointer block border-t border-white/3 mt-1.5 pt-2"
                >
                  Çıkış Yap
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Profile details slideover */}
      <ProfileDrawer open={profileOpen} onClose={() => setProfileOpen(false)} />
    </header>
  );
}

function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="flex items-center gap-1.5 px-2 py-1.5 bg-[#0b0f19]/60 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-full cursor-pointer hover:border-slate-350 dark:hover:border-white/10 transition-all select-none h-8.5 shrink-0 outline-none"
      title={isDark ? "Açık Temaya Geç" : "Koyu Temaya Geç"}
    >
      <div className="flex items-center gap-1 shrink-0">
        <Moon size={10.5} className={`transition-colors duration-200 ${isDark ? 'text-blue-400' : 'text-slate-400'}`} />
        <span className="text-[8px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 leading-none select-none">
          Dark
        </span>
      </div>
      
      {/* Toggle Track and Thumb */}
      <div className={`relative w-6.5 h-3.5 rounded-full border transition-colors duration-200 shrink-0 ${
        isDark 
          ? 'bg-blue-600/30 border-blue-500/20' 
          : 'bg-slate-200 border-slate-300'
      }`}>
        <div className={`absolute top-0.25 left-0.25 w-2.5 h-2.5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
          isDark ? 'translate-x-0' : 'translate-x-3'
        }`} />
      </div>

      <Sun size={10.5} className={`transition-colors duration-200 ${!isDark ? 'text-amber-500' : 'text-slate-500'} shrink-0`} />
    </button>
  );
}
