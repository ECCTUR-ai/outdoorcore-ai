import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Home,
  Archive,
  MapPin, 
  Map, 
  Calendar, 
  FileSignature,
  Building2, 
  FileText, 
  Megaphone, 
  BarChart3, 
  Coins,
  Wrench,
  Image, 
  Eye,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Bell
} from 'lucide-react';

import { usePermission } from '@/permissions/permissionHooks';
import { PermissionKey } from '@/permissions/accessControl';
import { notificationRepository as newNotifRepo } from '@/notifications/notificationRepository';
import { useState, useEffect } from 'react';

export function Sidebar() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      setUnreadCount(newNotifRepo.listUnread().length);
    };
    updateCount();
    window.addEventListener('notifications_updated', updateCount);
    return () => {
      window.removeEventListener('notifications_updated', updateCount);
    };
  }, []);
  const { 
    currentRoute, 
    setCurrentRoute, 
    sidebarCollapsed, 
    setSidebarCollapsed,
    mobileSidebarOpen,
    setMobileSidebarOpen
  } = useApp();

  const menuItems: { key: string; label: string; icon: React.ReactNode; isMock?: boolean; route?: string; permission: PermissionKey }[] = [
    { key: 'dashboard', label: 'Ana Sayfa', icon: <Home size={13} />, permission: 'dashboard.view' },
    { key: 'executive-dashboard', label: 'CEO Dashboard', icon: <BarChart3 size={13} className="text-emerald-450" />, permission: 'executive.view' },
    { key: 'ai-assistant', label: 'AI Copilot', icon: <Sparkles size={13} className="text-blue-400" />, permission: 'ai.use' },
    { key: 'sales-wizard', label: 'Yeni Satış', icon: <Sparkles size={13} className="text-indigo-400 animate-pulse" />, permission: 'offers.view' },
    { key: 'reklam-alanlari-inv', label: 'Envanter', icon: <Archive size={13} />, isMock: true, route: 'reklam-alanlari', permission: 'spaces.view' },
    { key: 'alan-haritasi', label: 'Harita (Terminal)', icon: <Map size={13} />, permission: 'spaces.view' },
    { key: 'reklam-alanlari', label: 'Reklam Alanları', icon: <MapPin size={13} />, permission: 'spaces.view' },
    { key: 'rezervasyonlar', label: 'Takvim', icon: <Calendar size={13} />, permission: 'spaces.view' },
    { key: 'sozlesmeler', label: 'Sözleşmeler', icon: <FileSignature size={13} />, permission: 'contracts.view' },
    { key: 'firmalar-markalar', label: 'Firmalar & Markalar', icon: <Building2 size={13} />, permission: 'companies.view' },
    { key: 'teklifler', label: 'Teklifler', icon: <FileText size={13} />, permission: 'offers.view' },
    { key: 'kampanyalar', label: 'Kampanyalar', icon: <Megaphone size={13} />, permission: 'campaigns.view' },
    { key: 'raporlar', label: 'Raporlar', icon: <BarChart3 size={13} />, permission: 'reports.view' },
    { key: 'finans', label: 'Gelir & Faturalar', icon: <Coins size={13} />, permission: 'finance.view' },
    { key: 'bildirimler', label: 'Bildirim & Görev', icon: <Bell size={13} />, permission: 'dashboard.view' },
    { key: 'maintenance', label: 'Bakım & Arıza', icon: <Wrench size={13} />, permission: 'maintenance.close' },
    { key: 'medya-kutuphanesi', label: 'Medya Kütüphanesi', icon: <Image size={13} />, permission: 'media.upload' },
    { key: 'competitor-analysis', label: 'Rakip Analizi', icon: <Eye size={13} />, permission: 'dashboard.view' },
    { key: 'system-roles', label: 'Sistem Rolleri', icon: <Settings size={13} className="text-amber-500" />, permission: 'roles.manage' }
  ];

  // Dynamic filter based on user permissions
  const filteredMenuItems = menuItems.filter(item => {
    // SuperAdmin bypass is built inside hook
    return usePermission(item.permission);
  });

  return (
    <>
      {/* Mobile Sidebar backdrop screen overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={`dark-sidebar-gradient border-r border-white/5 h-screen shrink-0 sticky top-0 flex flex-col justify-between transition-all duration-300 z-50 bg-transparent ${
          sidebarCollapsed ? 'md:w-16' : 'md:w-64'
        } ${
          mobileSidebarOpen ? 'fixed inset-y-0 left-0 w-64 translate-x-0' : 'fixed md:sticky inset-y-0 left-0 -translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex-1 flex flex-col min-h-0">
          {/* Brand Header */}
          <div className="p-4.5 border-b border-white/5 flex items-center justify-between min-h-[70px]">
            {!sidebarCollapsed || mobileSidebarOpen ? (
              <div className="space-y-1 animate-fade-in text-left">
                <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5 m-0 leading-none">
                  <Sparkles size={13} className="text-blue-500" />
                  OutdoorCore
                  <span className="text-[8px] bg-blue-500/20 text-blue-400 px-1 py-0.2 rounded font-black">AI</span>
                </h2>
                <span className="text-[7.5px] font-black text-slate-500 uppercase tracking-wider block">
                  AI Powered Outdoor Platform
                </span>
              </div>
            ) : (
              <div className="w-8 h-8 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 font-black text-xs select-none mx-auto">
                OC
              </div>
            )}

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 rounded-lg border border-white/5 hover:bg-white/5 cursor-pointer hidden md:flex items-center justify-center text-slate-500 hover:text-slate-350 transition-colors"
            >
              {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-0.5">
            {filteredMenuItems.map(item => {
              const mappedRoute = item.isMock ? item.route : item.key;
              const isActive = currentRoute === mappedRoute && (!item.isMock || (item.isMock && currentRoute === item.route));
              
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setCurrentRoute(mappedRoute as any);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer text-left select-none border border-transparent ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-650 border-blue-550/20 text-white shadow-md shadow-blue-600/10 font-black'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 font-semibold'
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <span className={`shrink-0 relative ${isActive ? 'scale-[1.08] text-[inherit]' : 'text-slate-500'}`}>
                    {item.icon}
                    {item.key === 'bildirimler' && unreadCount > 0 && sidebarCollapsed && !mobileSidebarOpen && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    )}
                  </span>
                  {(!sidebarCollapsed || mobileSidebarOpen) && (
                    <span className="text-[10px] uppercase tracking-wider flex items-center justify-between w-full truncate">
                      <span>{item.label}</span>
                      {item.key === 'bildirimler' && unreadCount > 0 && (
                        <span className="text-[8px] font-black bg-blue-500 text-white px-1.5 py-0.2 rounded-full shrink-0 leading-none">
                          {unreadCount}
                        </span>
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* AI Assistant Promo Card */}
        {(!sidebarCollapsed || mobileSidebarOpen) && (
          <button
            onClick={() => {
              setCurrentRoute('ai-assistant');
              setMobileSidebarOpen(false);
            }}
            className="mx-3.5 mb-4 p-3.5 bg-gradient-to-br from-blue-950/20 to-indigo-950/30 border border-blue-500/10 rounded-2xl text-left select-none hover:border-blue-500/35 transition-all cursor-pointer block"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1">
                <Sparkles size={10} className="animate-pulse" />
                AI Asistan
              </span>
              <span className="text-[7.5px] bg-blue-500/25 text-blue-300 px-1 py-0.2 rounded font-black uppercase">Yeni</span>
            </div>
            <p className="text-[9px] text-slate-400 mt-1.5 font-bold leading-normal">
              Akıllı öneriler ve veri analizi
            </p>
          </button>
        )}
      </aside>
    </>
  );
}
