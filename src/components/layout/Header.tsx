import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Bell, Mail, ChevronDown, Calendar, Search, Menu } from 'lucide-react';
import { Avatar } from '../design-system/Avatar';
import { Badge } from '../design-system/Badge';
import { notificationRepository as newNotifRepo } from '@/notifications/notificationRepository';
import { taskRepository as newTaskRepo } from '@/notifications/taskRepository';
import { useAuth } from '@/auth/useAuth';
import { ProfileDrawer } from '../design-system/ProfileDrawer';

export function Header() {
  const { setCommandPaletteOpen, mobileSidebarOpen, setMobileSidebarOpen, setCurrentRoute } = useApp();
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { currentUser, logout, organization, permissions } = useAuth();

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

        {/* Date Selector range */}
        <div className="hidden md:flex items-center gap-2 px-3 h-9 bg-white/5 border border-white/5 rounded-xl text-slate-300 font-bold text-[9.5px] uppercase tracking-wider">
          <Calendar size={11} className="text-slate-400 shrink-0" />
          <span>01 Mayıs 2025 - 31 Mayıs 2025</span>
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
