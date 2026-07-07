import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Home,
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
  Bell,
  ChevronDown
} from 'lucide-react';

import { usePermission } from '@/permissions/permissionHooks';
import { PermissionKey } from '@/permissions/accessControl';
import { notificationRepository as newNotifRepo } from '@/notifications/notificationRepository';

export function Sidebar() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [reklamExpanded, setReklamExpanded] = useState(true);

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

  const menuItems: { key: string; label: string; icon: React.ReactNode; route?: string; permission: PermissionKey; isSubItem?: boolean; parentKey?: string }[] = [
    { key: 'dashboard', label: 'Genel Bakış', icon: <Home size={13} />, permission: 'dashboard.view' },
    
    // Reklam Alanları Parent
    { key: 'reklam-alanlari-parent', label: 'Reklam Alanları', icon: <MapPin size={13} />, permission: 'spaces.view' },
    { key: 'map-dashboard', label: 'Harita Görünümü', icon: <Map size={13} />, permission: 'spaces.view', isSubItem: true, parentKey: 'reklam-alanlari-parent' },
    { key: 'reklam-alanlari', label: 'Liste Görünümü', icon: <MapPin size={13} />, permission: 'spaces.view', isSubItem: true, parentKey: 'reklam-alanlari-parent' },
    { key: 'alan-yonetimi', label: 'Alan Yönetimi', icon: <Settings size={13} />, permission: 'spaces.view', isSubItem: true, parentKey: 'reklam-alanlari-parent' },
    
    { key: 'teklifler', label: 'Teklifler', icon: <FileText size={13} />, permission: 'offers.view' },
    { key: 'sozlesmeler', label: 'Sözleşmeler', icon: <FileSignature size={13} />, permission: 'contracts.view' },
    { key: 'rezervasyonlar', label: 'Rezervasyonlar', icon: <Calendar size={13} />, permission: 'calendar.view' },
    { key: 'kampanyalar', label: 'Kampanyalar', icon: <Megaphone size={13} />, permission: 'campaigns.view' },
    { key: 'takvim', label: 'Planlama', icon: <Calendar size={13} />, permission: 'calendar.view' },
    { key: 'finans', label: 'Finans & Tahsilat', icon: <Coins size={13} />, permission: 'finance.view' },
    { key: 'raporlar', label: 'Raporlar', icon: <BarChart3 size={13} />, permission: 'reports.view' },
    { key: 'firmalar-markalar', label: 'Firmalar & Markalar', icon: <Building2 size={13} />, permission: 'companies.view' },
    { key: 'ayarlar', label: 'Ayarlar', icon: <Settings size={13} />, permission: 'roles.manage' }
  ];

  // Dynamic filter based on user permissions
  const filteredMenuItems = menuItems.filter(item => {
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
          <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-0.5 no-scrollbar">
            {filteredMenuItems.map(item => {
              // Hide sub-items if parent group is collapsed
              if (item.isSubItem && item.parentKey === 'reklam-alanlari-parent' && !reklamExpanded && !sidebarCollapsed) {
                return null;
              }

              // Hide sub-items entirely in collapsed sidebar view to prevent layout clutter
              if (item.isSubItem && sidebarCollapsed && !mobileSidebarOpen) {
                return null;
              }

              const mappedRoute = item.key;
              const isActive = currentRoute === mappedRoute;
              
              if (item.key === 'reklam-alanlari-parent') {
                return (
                  <div key={item.key} className="space-y-0.5">
                    <button
                      onClick={() => setReklamExpanded(!reklamExpanded)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer text-left select-none text-slate-400 hover:text-slate-200 hover:bg-white/5 font-semibold"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500">{item.icon}</span>
                        {(!sidebarCollapsed || mobileSidebarOpen) && (
                          <span className="text-[10px] uppercase tracking-wider">{item.label}</span>
                        )}
                      </div>
                      {(!sidebarCollapsed || mobileSidebarOpen) && (
                        <ChevronDown size={11} className={`text-slate-500 transition-transform ${reklamExpanded ? 'rotate-180' : ''}`} />
                      )}
                    </button>
                  </div>
                );
              }

              return (
                <button
                  key={item.key}
                  onClick={() => {
                    // Redirect alias routes
                    if (item.key === 'alan-yonetimi') {
                      setCurrentRoute('reklam-alanlari' as any);
                    } else if (item.key === 'rezervasyonlar') {
                      setCurrentRoute('takvim' as any);
                    } else {
                      setCurrentRoute(mappedRoute as any);
                    }
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer text-left select-none border border-transparent ${
                    item.isSubItem ? 'pl-8 text-[9px] py-1.5' : 'text-[10px]'
                  } ${
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

        {/* AI Asistan promo card */}
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
