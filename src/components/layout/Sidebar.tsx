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
  Tv,
  Users,
  CalendarPlus,
  Layers
} from 'lucide-react';

import { usePermission } from '@/permissions/permissionHooks';
import { PermissionKey } from '@/permissions/accessControl';
import { notificationRepository as newNotifRepo } from '@/notifications/notificationRepository';
import { spaceRepository } from '@/repositories';
import { isSpaceInFilter } from '@/utils/mediaTypeHelper';

export function Sidebar() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [digitalExpanded, setDigitalExpanded] = useState(false);
  const [staticExpanded, setStaticExpanded] = useState(false);
  const [specialExpanded, setSpecialExpanded] = useState(false);

  const [yonetimExpanded, setYonetimExpanded] = useState(true);
  const [envanterExpanded, setEnvanterExpanded] = useState(false);
  const [satisExpanded, setSatisExpanded] = useState(false);
  const [operasyonExpanded, setOperasyonExpanded] = useState(false);
  const [finansExpanded, setFinansExpanded] = useState(false);
  const [sistemExpanded, setSistemExpanded] = useState(false);

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
            setCurrentRoute('dashboard');
          } else {
            setCurrentRoute(routeKey);
          }
          setMobileSidebarOpen(false);
        }}
        className={`w-full flex items-center gap-3 px-3 rounded-xl transition-all duration-200 cursor-pointer text-left select-none border border-transparent ${
          isSubItem ? 'pl-6 text-[9px] py-1' : 'text-[10px] py-1.5'
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

  // Render collapsible accordion group header with dual actions
  const renderAccordionHeader = (
    routeKey: any, 
    label: string, 
    icon: React.ReactNode, 
    expanded: boolean, 
    setExpanded: (val: boolean) => void,
    subActive: boolean,
    badgeCount?: number
  ) => {
    const isActive = currentRoute === routeKey;
    const isRealRoute = !routeKey.endsWith('-group');

    return (
      <div
        className={`w-full flex items-center justify-between rounded-xl transition-all duration-200 select-none text-[10px] border border-transparent ${
          isActive
            ? 'bg-gradient-to-r from-blue-600 to-indigo-650 border-blue-550/20 text-white shadow-md shadow-blue-600/10 font-black'
            : subActive && !expanded
            ? 'bg-gradient-to-r from-blue-600/20 to-indigo-650/10 border-blue-550/10 text-white font-extrabold'
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 font-semibold'
        }`}
      >
        {/* Navigation Button */}
        <button
          onClick={() => {
            if (isRealRoute) {
              setCurrentRoute(routeKey);
            } else {
              setExpanded(!expanded);
            }
            setMobileSidebarOpen(false);
            if (sidebarCollapsed && !mobileSidebarOpen) {
              setSidebarCollapsed(false);
              setExpanded(true);
            }
          }}
          className="flex-1 flex items-center gap-3 px-3 py-1.5 text-left cursor-pointer truncate"
          title={sidebarCollapsed && !mobileSidebarOpen ? label : undefined}
        >
          <span className={`shrink-0 flex items-center justify-center ${isActive ? 'scale-[1.08] text-[inherit]' : 'text-slate-500'}`}>
            {icon}
          </span>
          {(!sidebarCollapsed || mobileSidebarOpen) && (
            <span className="text-[10px] uppercase tracking-wider flex items-center gap-1.5 truncate font-extrabold">
              <span className="truncate">{label}</span>
              {badgeCount !== undefined && (
                <span className={`text-[8px] font-black px-1.5 py-0.2 rounded-full shrink-0 leading-none ${
                  isActive ? 'bg-white/20 text-white' : 'bg-blue-550/15 text-blue-400'
                }`}>
                  {countsLoading ? '...' : badgeCount}
                </span>
              )}
            </span>
          )}
        </button>

        {/* Chevron Expand/Collapse Trigger */}
        {(!sidebarCollapsed || mobileSidebarOpen) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="p-1.5 hover:bg-white/5 rounded-lg cursor-pointer text-slate-500 hover:text-slate-250 transition-colors flex items-center justify-center shrink-0 mr-1"
          >
            <ChevronDown size={11} className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
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
          <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-3 no-scrollbar text-left">
            {/* GROUP 1: YÖNETİM */}
            <div className="space-y-0.5">
              {(!sidebarCollapsed || mobileSidebarOpen) && (
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest px-3 block mb-1">
                  YÖNETİM
                </span>
              )}
              {showDashboard && renderSidebarItem('dashboard', 'Dashboard', <Home size={13} />)}
              {renderSidebarItem('executive-dashboard', 'CEO Ekranı', <Eye size={13} />)}
              {showReports && renderSidebarItem('raporlar', 'Raporlar', <BarChart3 size={13} />)}
            </div>

            {/* GROUP 2: ENVANTER */}
            <div className="space-y-0.5">
              {renderAccordionHeader(
                'inventory-group',
                'ENVANTER',
                <MapPin size={13} />,
                envanterExpanded,
                setEnvanterExpanded,
                currentRoute === 'inventory' || currentRoute === 'reklam-alanlari' || currentRoute === 'inventory-digital' || currentRoute === 'digital-signage',
                counts.all
              )}
              {envanterExpanded && (!sidebarCollapsed || mobileSidebarOpen) && (
                <div className="space-y-0.5 pl-3 border-l border-white/5 animate-slide-in duration-200">
                  {showSpaces && renderSidebarItem('inventory', 'Reklam Alanları', <MapPin size={11} className="opacity-60" />, true, counts.all)}
                  {showSpaces && renderSidebarItem('inventory-digital', 'Dijital Ekranlar', <Tv size={11} className="opacity-60" />, true, counts.digital)}
                  {renderSidebarItem('digital-signage', 'Playlist', <Tv size={11} className="opacity-60" />, true)}
                </div>
              )}
            </div>

            {/* GROUP 3: SATIŞ */}
            <div className="space-y-0.5">
              {renderAccordionHeader(
                'sales-group',
                'SATIŞ',
                <Coins size={13} />,
                satisExpanded,
                setSatisExpanded,
                currentRoute === 'sales-wizard' || currentRoute === 'rezervasyonlar' || currentRoute === 'teklifler' || currentRoute === 'pipeline' || currentRoute === 'sozlesmeler',
                undefined
              )}
              {satisExpanded && (!sidebarCollapsed || mobileSidebarOpen) && (
                <div className="space-y-0.5 pl-3 border-l border-white/5 animate-slide-in duration-200">
                  {renderSidebarItem('sales-wizard', 'Rezervasyon Yap', <CalendarPlus size={11} className="opacity-60" />, true)}
                  {renderSidebarItem('rezervasyonlar', 'Rezervasyonlar', <Calendar size={11} className="opacity-60" />, true)}
                  {showOffers && renderSidebarItem('teklifler', 'Teklifler', <FileText size={11} className="opacity-60" />, true)}
                  {renderSidebarItem('pipeline', 'Pipeline', <Layers size={11} className="opacity-60" />, true)}
                  {showContracts && renderSidebarItem('sozlesmeler', 'Sözleşmeler', <FileSignature size={11} className="opacity-60" />, true)}
                </div>
              )}
            </div>

            {/* GROUP 4: OPERASYON */}
            <div className="space-y-0.5">
              {renderAccordionHeader(
                'ops-group',
                'OPERASYON',
                <Megaphone size={13} />,
                operasyonExpanded,
                setOperasyonExpanded,
                currentRoute === 'kampanyalar' || currentRoute === 'proof-of-play' || currentRoute === 'maintenance',
                undefined
              )}
              {operasyonExpanded && (!sidebarCollapsed || mobileSidebarOpen) && (
                <div className="space-y-0.5 pl-3 border-l border-white/5 animate-slide-in duration-200">
                  {showCampaigns && renderSidebarItem('kampanyalar', 'Kampanyalar', <Megaphone size={11} className="opacity-60" />, true)}
                  {renderSidebarItem('proof-of-play', 'Proof of Play', <Eye size={11} className="opacity-60" />, true)}
                  {renderSidebarItem('maintenance', 'Bakım / Servis', <Wrench size={11} className="opacity-60" />, true)}
                </div>
              )}
            </div>

            {/* GROUP 5: FİNANS */}
            <div className="space-y-0.5">
              {(!sidebarCollapsed || mobileSidebarOpen) && (
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest px-3 block mb-1">
                  FİNANS
                </span>
              )}
              {showFinance && renderSidebarItem('finans', 'Finans & Tahsilat', <Coins size={13} />)}
            </div>

            {/* GROUP 6: SİSTEM */}
            <div className="space-y-0.5">
              {renderAccordionHeader(
                'system-group',
                'SİSTEM',
                <Settings size={13} />,
                sistemExpanded,
                setSistemExpanded,
                currentRoute === 'ayarlar' || currentRoute === 'system-roles',
                undefined
              )}
              {sistemExpanded && (!sidebarCollapsed || mobileSidebarOpen) && (
                <div className="space-y-0.5 pl-3 border-l border-white/5 animate-slide-in duration-200">
                  {showSettings && renderSidebarItem('system-roles', 'Kullanıcılar', <Users size={11} className="opacity-60" />, true)}
                  {showSettings && renderSidebarItem('ayarlar', 'Ayarlar', <Settings size={11} className="opacity-60" />, true)}
                </div>
              )}
            </div>
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
