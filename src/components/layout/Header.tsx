import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Search, Bell, Sun, Moon, Keyboard } from 'lucide-react';
import { Avatar } from '../design-system/Avatar';
import { Badge } from '../design-system/Badge';

export function Header() {
  const { currentRoute, notifications, setCommandPaletteOpen, theme, setTheme } = useApp();
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const getPageTitle = () => {
    switch (currentRoute) {
      case 'dashboard': return 'Dashboard';
      case 'reklam-alanlari': return 'Reklam Alanları';
      case 'alan-haritasi': return 'Alan Haritası';
      case 'firmalar-markalar': return 'Firmalar & Markalar';
      case 'rezervasyonlar': return 'Rezervasyonlar';
      case 'kampanyalar': return 'Kampanyalar';
      case 'teklifler': return 'Teklifler';
      case 'sozlesmeler': return 'Sözleşmeler';
      case 'medya-kutuphanesi': return 'Medya Kütüphanesi';
      case 'raporlar': return 'Raporlar';
      case 'ai-assistant': return 'AI Assistant';
      case 'design-system': return 'Design System Showcase';
      case 'ayarlar': return 'Ayarlar';
      default: return 'OutdoorCore AI';
    }
  };

  return (
    <header className="h-[70px] bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-850 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Breadcrumb Info */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest">OutdoorCore</span>
        <span className="text-slate-300 dark:text-slate-700 text-[10px]">/</span>
        <h1 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider m-0 leading-none">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Quick Search */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2.5 px-3 py-1.5 w-48 sm:w-60 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-200/50 dark:border-slate-800 rounded-xl transition-all text-left text-slate-400 font-bold select-none cursor-pointer"
        >
          <Search size={13} className="shrink-0" />
          <span className="text-[10px] uppercase tracking-wider flex-1">Komut Paleti...</span>
          <div className="flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[8px] font-black text-slate-400 select-none shadow-xs shrink-0">
            <span>⌘K</span>
          </div>
        </button>

        {/* Theme Switcher */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="w-9 h-9 border border-slate-200/50 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900 hover:bg-slate-100/50 dark:hover:bg-slate-850 text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 cursor-pointer flex items-center justify-center transition-all shadow-xs shrink-0"
        >
          {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
        </button>

        {/* Notifications Dropdown Toggle */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="w-9 h-9 border border-slate-200/50 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900 hover:bg-slate-100/50 dark:hover:bg-slate-850 text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 cursor-pointer flex items-center justify-center transition-all shadow-xs relative"
          >
            <Bell size={14} />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-650" />
            )}
          </button>

          {showNotifMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotifMenu(false)} 
              />
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl shadow-xl p-4 z-50 animate-scale-in">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-2 mb-3">
                  <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider m-0">Bildirimler</h4>
                  <Badge variant="primary">{notifications.length}</Badge>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="text-left space-y-0.5 border-b border-slate-50 dark:border-slate-900 pb-2 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10.5px] font-bold text-slate-800 dark:text-slate-200 leading-tight">{n.title}</span>
                        <span className="text-[8px] text-slate-400 font-bold shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[9.5px] text-slate-450 dark:text-slate-500 leading-normal font-semibold">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Card */}
        <div className="flex items-center gap-2 border-l border-slate-150/30 dark:border-slate-800 pl-4 shrink-0">
          <Avatar 
            name="OutdoorCore Admin" 
            size="sm" 
            status="online" 
          />
          <div className="hidden lg:block space-y-0.5 text-left">
            <h5 className="text-[10.5px] font-black text-slate-800 dark:text-slate-200 leading-none m-0 uppercase">Yönetici</h5>
            <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-widest block">Enterprise</span>
          </div>
        </div>
      </div>
    </header>
  );
}
