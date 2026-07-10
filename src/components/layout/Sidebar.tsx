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
  ChevronDown,
  Tv
} from 'lucide-react';

import { usePermission } from '@/permissions/permissionHooks';
import { PermissionKey } from '@/permissions/accessControl';
import { notificationRepository as newNotifRepo } from '@/notifications/notificationRepository';
import { spaceRepository } from '@/repositories';
import { isSpaceInFilter } from '@/utils/mediaTypeHelper';

export function Sidebar() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [digitalExpanded, setDigitalExpanded] = useState(true);
  const [staticExpanded, setStaticExpanded] = useState(true);
  const [specialExpanded, setSpecialExpanded] = useState(true);

  // Dynamic counts for each category
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [countsLoading, setCountsLoading] = useState(true);

  const calculateCounts = async () => {
    try {
      const spaces = await spaceRepository.list();
      
      const countsMap: Record<string, number> = {
        'all': spaces.length,
        'digital': spaces.filter(s => isSpaceInFilter(s, ["LED", "DIGITAL", "DIGITAL_SCREEN", "LED_SCREEN", "DIGITAL_NETWORK"])).length,
        'led': spaces.filter(s => isSpaceInFilter(s, ["LED", "LED_SCREEN", "DIGITAL_LED"])).length,
        'static': spaces.filter(s => isSpaceInFilter(s, ["LIGHTBOX", "DURATRANS", "MEGALIGHT", "FOIL", "STATIC_PANEL", "STATIC"])).length,
        'lightbox': spaces.filter(s => isSpaceInFilter(s, ["LIGHTBOX"])).length,
        'duratrans': spaces.filter(s => isSpaceInFilter(s, ["DURATRANS"])).length,
        'megalight': spaces.filter(s => isSpaceInFilter(s, ["MEGALIGHT"])).length,
        'foil': spaces.filter(s => isSpaceInFilter(s, ["FOIL", "FOLYO", "VINYL"])).length,
        'panel': spaces.filter(s => isSpaceInFilter(s, ["STATIC_PANEL", "STATIC", "PANEL"])).length,
        'special': spaces.filter(s => isSpaceInFilter(s, ["STAND", "POPUP", "EXPERIENCE_AREA", "SPONSORSHIP", "AREA_SPONSORSHIP"])).length,
        'stand': spaces.filter(s => isSpaceInFilter(s, ["STAND", "POPUP", "EXPERIENCE_AREA"])).length,
        'sponsorship': spaces.filter(s => isSpaceInFilter(s, ["SPONSORSHIP", "AREA_SPONSORSHIP"])).length,
      };
      
      setCounts(countsMap);
    } catch (err) {
      console.error("Error calculating sidebar counts", err);
    } finally {
      setCountsLoading(false);
    }
  };

  useEffect(() => {
    const updateCount = () => {
      setUnreadCount(newNotifRepo.listUnread().length);
    };
    updateCount();
    calculateCounts();

    window.addEventListener('notifications_updated', updateCount);
    window.addEventListener('spaces_updated', calculateCounts);
    window.addEventListener('storage', calculateCounts);
    
    return () => {
      window.removeEventListener('notifications_updated', updateCount);
      window.removeEventListener('spaces_updated', calculateCounts);
      window.removeEventListener('storage', calculateCounts);
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

  // Permissions checks
  const showDashboard = usePermission('dashboard.view');
  const showSpaces = usePermission('spaces.view');
  const showOffers = usePermission('offers.view');
  const showContracts = usePermission('contracts.view');
  const showCalendar = usePermission('calendar.view');
  const showCampaigns = usePermission('campaigns.view');
  const showFinance = usePermission('finance.view');
  const showReports = usePermission('reports.view');
  const showCompanies = usePermission('companies.view');
  const showSettings = usePermission('roles.manage');

  // Render a standard menu item button
  const renderSidebarItem = (
    routeKey: any, 
    label: string, 
    icon: React.ReactNode, 
    isSubItem: boolean = false, 
    badgeCount?: number
  ) => {
    const isActive = currentRoute === routeKey;
    return (
      <button
        key={routeKey}
        onClick={() => {
          if (routeKey === 'rezervasyonlar') {
            setCurrentRoute('takvim');
          } else {
            setCurrentRoute(routeKey);
          }
          setMobileSidebarOpen(false);
        }}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer text-left select-none border border-transparent ${
          isSubItem ? 'pl-8 text-[9px] py-1.5' : 'text-[10px]'
        } ${
          isActive
            ? 'bg-gradient-to-r from-blue-600 to-indigo-650 border-blue-550/20 text-white shadow-md shadow-blue-600/10 font-black'
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 font-semibold'
        }`}
        title={sidebarCollapsed && !mobileSidebarOpen ? label : undefined}
      >
        <span className={`shrink-0 relative ${isActive ? 'scale-[1.08] text-[inherit]' : 'text-slate-500'} flex items-center justify-center`}>
          {icon}
          {routeKey === 'bildirimler' && unreadCount > 0 && sidebarCollapsed && !mobileSidebarOpen && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          )}
        </span>
        {(!sidebarCollapsed || mobileSidebarOpen) && (
          <span className="text-[10px] uppercase tracking-wider flex items-center justify-between w-full truncate">
            <span>{label}</span>
            {badgeCount !== undefined && (
              <span className={`text-[8px] font-black px-1.5 py-0.2 rounded-full shrink-0 leading-none ${
                isActive ? 'bg-white/20 text-white' : 'bg-blue-550/15 text-blue-400'
              }`}>
                {countsLoading ? '...' : badgeCount}
              </span>
            )}
            {routeKey === 'bildirimler' && unreadCount > 0 && (
              <span className="text-[8px] font-black bg-blue-500 text-white px-1.5 py-0.2 rounded-full shrink-0 leading-none">
                {unreadCount}
              </span>
            )}
          </span>
        )}
      </button>
    );
  };

  // Render collapsible accordion group header
  const renderAccordionHeader = (
    key: string, 
    label: string, 
    icon: React.ReactNode, 
    expanded: boolean, 
    setExpanded: (val: boolean) => void,
    subActive: boolean,
    badgeCount?: number
  ) => {
    return (
      <button
        onClick={() => {
          if (sidebarCollapsed && !mobileSidebarOpen) {
            // Expand first, or navigate
            setSidebarCollapsed(false);
            setExpanded(true);
          } else {
            setExpanded(!expanded);
          }
        }}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer text-left select-none text-[10px] border border-transparent ${
          subActive && !expanded
            ? 'bg-gradient-to-r from-blue-600/20 to-indigo-650/10 border-blue-550/10 text-white font-extrabold'
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 font-semibold'
        }`}
        title={sidebarCollapsed && !mobileSidebarOpen ? label : undefined}
      >
        <div className="flex items-center gap-3">
          <span className="text-slate-500 flex items-center justify-center">{icon}</span>
          {(!sidebarCollapsed || mobileSidebarOpen) && (
            <span className="text-[10px] uppercase tracking-wider flex items-center justify-between w-full truncate">
              <span className="flex items-center gap-2">
                {label}
                {badgeCount !== undefined && (
                  <span className="text-[8px] font-black bg-blue-550/15 text-blue-400 px-1.5 py-0.2 rounded-full leading-none">
                    {countsLoading ? '...' : badgeCount}
                  </span>
                )}
              </span>
            </span>
          )}
        </div>
        {(!sidebarCollapsed || mobileSidebarOpen) && (
          <ChevronDown size={11} className={`text-slate-500 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        )}
      </button>
    );
  };

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
            {showDashboard && renderSidebarItem('dashboard', 'Genel Bakış', <Home size={13} />)}

            {/* Reklam Envanteri Categorized Accordion Section */}
            {showSpaces && (
              <div className="space-y-0.5 border-t border-b border-white/5 py-2 my-2">
                {(!sidebarCollapsed || mobileSidebarOpen) && (
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest px-3 block mb-1">
                    REKLAM ENVANTERİ
                  </span>
                )}
                
                {/* 1. Tüm Alanlar */}
                {renderSidebarItem('inventory', 'Tüm Alanlar', <MapPin size={13} />, false, counts.all)}

                {/* 2. Harita Görünümü */}
                {renderSidebarItem('map-dashboard', 'Harita Görünümü', <Map size={13} />)}

                {/* 3. Dijital Ekranlar Group */}
                <div className="space-y-0.5">
                  {renderAccordionHeader(
                    'digital', 
                    'Dijital Ekranlar', 
                    <Tv size={13} />, 
                    digitalExpanded, 
                    setDigitalExpanded,
                    currentRoute === 'inventory-digital' || currentRoute === 'inventory-digital-led',
                    counts.digital
                  )}
                  {digitalExpanded && (!sidebarCollapsed || mobileSidebarOpen) && (
                    <div className="space-y-0.5 animate-slide-in duration-200">
                      {renderSidebarItem('inventory-digital', 'Genel Liste', <Tv size={11} className="opacity-60" />, true, counts.digital)}
                      {renderSidebarItem('inventory-digital-led', 'LED Ekranlar', <Tv size={11} className="opacity-60" />, true, counts.led)}
                    </div>
                  )}
                </div>

                {/* 4. Statik Alanlar Group */}
                <div className="space-y-0.5">
                  {renderAccordionHeader(
                    'static', 
                    'Statik Alanlar', 
                    <Image size={13} />, 
                    staticExpanded, 
                    setStaticExpanded,
                    currentRoute.startsWith('inventory-static'),
                    counts.static
                  )}
                  {staticExpanded && (!sidebarCollapsed || mobileSidebarOpen) && (
                    <div className="space-y-0.5 animate-slide-in duration-200">
                      {renderSidebarItem('inventory-static', 'Genel Liste', <Image size={11} className="opacity-60" />, true, counts.static)}
                      {renderSidebarItem('inventory-static-lightbox', 'Lightbox', <Image size={11} className="opacity-60" />, true, counts.lightbox)}
                      {renderSidebarItem('inventory-static-duratrans', 'Duratrans', <Image size={11} className="opacity-60" />, true, counts.duratrans)}
                      {renderSidebarItem('inventory-static-megalight', 'Megalight', <Image size={11} className="opacity-60" />, true, counts.megalight)}
                      {renderSidebarItem('inventory-static-foil', 'Folyo Alanları', <Image size={11} className="opacity-60" />, true, counts.foil)}
                      {renderSidebarItem('inventory-static-panel', 'Statik Panolar', <FileText size={11} className="opacity-60" />, true, counts.panel)}
                    </div>
                  )}
                </div>

                {/* 5. Özel Alanlar Group */}
                <div className="space-y-0.5">
                  {renderAccordionHeader(
                    'special', 
                    'Özel Alanlar', 
                    <Sparkles size={13} />, 
                    specialExpanded, 
                    val => setSpecialExpanded(val),
                    currentRoute.startsWith('inventory-special'),
                    counts.special
                  )}
                  {specialExpanded && (!sidebarCollapsed || mobileSidebarOpen) && (
                    <div className="space-y-0.5 animate-slide-in duration-200">
                      {renderSidebarItem('inventory-special', 'Genel Liste', <Sparkles size={11} className="opacity-60" />, true, counts.special)}
                      {renderSidebarItem('inventory-special-stand', 'Stand Alanları', <Building2 size={11} className="opacity-60" />, true, counts.stand)}
                      {renderSidebarItem('inventory-special-sponsorship', 'Sponsorluk Alanları', <FileSignature size={11} className="opacity-60" />, true, counts.sponsorship)}
                    </div>
                  )}
                </div>

                {/* 6. Dijital Yayın (Digital Signage) */}
                {renderSidebarItem('digital-signage', 'Dijital Yayın', <Tv size={13} />)}
              </div>
            )}

            {/* Standard Modules */}
            {showOffers && renderSidebarItem('teklifler', 'Teklifler', <FileText size={13} />)}
            {showContracts && renderSidebarItem('sozlesmeler', 'Sözleşmeler', <FileSignature size={13} />)}
            {showCalendar && renderSidebarItem('rezervasyonlar', 'Rezervasyonlar', <Calendar size={13} />)}
            {showCampaigns && renderSidebarItem('kampanyalar', 'Kampanyalar', <Megaphone size={13} />)}
            {showCalendar && renderSidebarItem('takvim', 'Planlama', <Calendar size={13} />)}
            {showFinance && renderSidebarItem('finans', 'Finans & Tahsilat', <Coins size={13} />)}
            {showReports && renderSidebarItem('raporlar', 'Raporlar', <BarChart3 size={13} />)}
            {showCompanies && renderSidebarItem('firmalar-markalar', 'Firmalar & Markalar', <Building2 size={13} />)}
            {showSettings && renderSidebarItem('ayarlar', 'Ayarlar', <Settings size={13} />)}
          </nav>
        </div>

        {/* AI Asistan promo card */}
        {(!sidebarCollapsed || mobileSidebarOpen) && (
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('toggle_ai_pilot'));
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
