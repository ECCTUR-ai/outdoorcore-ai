import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  LayoutDashboard, 
  MapPin, 
  Map, 
  Building2, 
  CalendarRange, 
  Megaphone, 
  FileText, 
  FileSignature, 
  Image, 
  BarChart3, 
  Sparkles, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Palette
} from 'lucide-react';

export function Sidebar() {
  const { currentRoute, setCurrentRoute, sidebarCollapsed, setSidebarCollapsed } = useApp();

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={14} /> },
    { key: 'reklam-alanlari', label: 'Reklam Alanları', icon: <MapPin size={14} /> },
    { key: 'alan-haritasi', label: 'Alan Haritası', icon: <Map size={14} /> },
    { key: 'firmalar-markalar', label: 'Firmalar & Markalar', icon: <Building2 size={14} /> },
    { key: 'rezervasyonlar', label: 'Rezervasyonlar', icon: <CalendarRange size={14} /> },
    { key: 'kampanyalar', label: 'Kampanyalar', icon: <Megaphone size={14} /> },
    { key: 'teklifler', label: 'Teklifler', icon: <FileText size={14} /> },
    { key: 'sozlesmeler', label: 'Sözleşmeler', icon: <FileSignature size={14} /> },
    { key: 'medya-kutuphanesi', label: 'Medya Kütüphanesi', icon: <Image size={14} /> },
    { key: 'raporlar', label: 'Raporlar', icon: <BarChart3 size={14} /> },
    { key: 'ai-assistant', label: 'AI Assistant', icon: <Sparkles size={14} className="text-violet-550 dark:text-violet-400" /> },
    { key: 'design-system', label: 'Design System', icon: <Palette size={14} className="text-pink-500" /> },
    { key: 'ayarlar', label: 'Ayarlar', icon: <Settings size={14} /> }
  ] as const;

  return (
    <aside
      className={`sidebar-glass border-r border-slate-100 dark:border-slate-850 h-screen shrink-0 sticky top-0 flex flex-col justify-between transition-all duration-300 z-40 bg-white dark:bg-slate-950 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex-1 flex flex-col min-h-0">
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between min-h-[70px]">
          {!sidebarCollapsed ? (
            <div className="space-y-0.5 animate-fade-in">
              <h2 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-1.5 m-0 leading-none">
                <Sparkles size={13} className="text-indigo-650" />
                OutdoorCore
                <span className="text-[8px] bg-indigo-50 text-indigo-650 px-1 py-0.2 rounded font-black dark:bg-indigo-950/20 dark:text-indigo-400">AI</span>
              </h2>
              <span className="text-[7.5px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-wider block">
                AI Powered Outdoor Platform
              </span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-150/40 rounded-xl flex items-center justify-center text-indigo-650 font-black text-xs select-none mx-auto">
              OC
            </div>
          )}

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer hidden md:flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {menuItems.map(item => {
            const isActive = currentRoute === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setCurrentRoute(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer text-left select-none border border-transparent ${
                  isActive
                    ? 'bg-slate-900 border-slate-950 dark:bg-white dark:border-slate-200 text-white dark:text-slate-900 shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/50 font-bold'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <span className={`shrink-0 ${isActive ? 'scale-[1.08] text-[inherit]' : 'text-slate-400 dark:text-slate-500'}`}>
                  {item.icon}
                </span>
                {!sidebarCollapsed && (
                  <span className="text-[11px] uppercase tracking-wider block truncate">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      {!sidebarCollapsed && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/10 text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest text-center">
          OutdoorCore v1.0.0
        </div>
      )}
    </aside>
  );
}
