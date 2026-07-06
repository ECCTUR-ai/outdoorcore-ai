import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Bell, Mail, ChevronDown, Calendar, Search, Menu } from 'lucide-react';
import { Avatar } from '../design-system/Avatar';
import { Badge } from '../design-system/Badge';
import { notificationRepository, taskRepository } from '@/repositories';

import { useAuth } from '@/auth/useAuth';
import { ProfileDrawer } from '../design-system/ProfileDrawer';

export function Header() {
  const notificationsList = notificationRepository.getAllSync();
  const tasksList = taskRepository.getAllSync();
  const { setCommandPaletteOpen, mobileSidebarOpen, setMobileSidebarOpen, setCurrentRoute } = useApp();
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  const criticalCount = notificationsList.filter(n => n.status === 'critical').length;
  const taskCount = tasksList.length;
  const latestNotifs = notificationsList.slice(0, 10);

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
          >
            <Bell size={13} />
            {notificationsList.length > 0 && (
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-blue-500 glow-blue" />
            )}
          </button>

          {showNotifMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotifMenu(false)} 
              />
              <div className="absolute right-0 mt-2 w-72 sm:w-80 dark-glass-card border border-white/10 rounded-2xl shadow-2xl p-4 z-50 animate-scale-in max-h-[400px] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5 mb-3">
                  <h4 className="text-[10px] font-black text-white uppercase tracking-wider m-0">Canlı Bildirimler</h4>
                  <div className="flex items-center gap-1">
                    {criticalCount > 0 && (
                      <span className="text-[7px] bg-rose-500/10 text-rose-450 border border-rose-500/10 px-1 py-0.2 rounded font-black uppercase tracking-wider">{criticalCount} Kritik</span>
                    )}
                    <span className="text-[7px] bg-blue-500/10 text-blue-400 border border-blue-500/10 px-1 py-0.2 rounded font-black uppercase tracking-wider">{taskCount} Görev</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {latestNotifs.map(n => (
                    <div key={n.id} className="text-left space-y-1 border-b border-white/5 pb-2.5 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[9px] font-black text-white leading-tight uppercase truncate">{n.category} | {n.company}</span>
                        <span className="text-[7.5px] text-slate-500 font-bold shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[9px] text-slate-400 leading-normal font-semibold">{n.message}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[7px] text-slate-500 font-black uppercase">Sorumlu: {n.user}</span>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          n.status === 'critical' ? 'bg-rose-500' :
                          n.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                      </div>
                    </div>
                  ))}
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
                <div className="px-3.5 py-2.5 border-b border-white/5 mb-1.5 select-none leading-none">
                  <span className="text-[10px] font-black text-white block leading-none truncate">{currentUser?.name}</span>
                  <span className="text-[7.5px] text-slate-500 font-bold block mt-1.5 truncate">{currentUser?.email}</span>
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
