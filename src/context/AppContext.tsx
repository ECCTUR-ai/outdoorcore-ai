import React, { createContext, useContext, useState, useEffect } from 'react';

export type DateRangeType = 'today' | 'last-7-days' | 'last-15-days' | 'last-30-days' | 'all-time' | 'custom';

export interface DateRangeState {
  type: DateRangeType;
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
}

type RouteType = 
  | 'dashboard' 
  | 'reklam-alanlari' 
  | 'inventory'
  | 'inventory-digital'
  | 'inventory-digital-led'
  | 'inventory-static'
  | 'inventory-static-lightbox'
  | 'inventory-static-duratrans'
  | 'inventory-static-megalight'
  | 'inventory-static-foil'
  | 'inventory-static-panel'
  | 'inventory-special'
  | 'inventory-special-stand'
  | 'inventory-special-sponsorship'
  | 'alan-haritasi' 
  | 'map-dashboard'
  | 'firmalar-markalar' 
  | 'kampanyalar' 
  | 'teklifler' 
  | 'sozlesmeler' 
  | 'medya-kutuphanesi' 
  | 'raporlar' 
  | 'finans'
  | 'bildirimler'
  | 'ai-assistant' 
  | 'ayarlar'
  | 'design-system'
  | 'maintenance'
  | 'competitor-analysis'
  | 'executive-dashboard'
  | 'system-roles'
  | 'sales-wizard'
  | 'digital-signage'
  | 'proof-of-play'
  | 'rezervasyonlar'
  | 'pipeline';

const routeToPath: Record<RouteType, string> = {
  'dashboard': '/dashboard',
  'reklam-alanlari': '/inventory',
  'inventory': '/inventory',
  'inventory-digital': '/inventory/digital',
  'inventory-digital-led': '/inventory/digital/led',
  'inventory-static': '/inventory/static',
  'inventory-static-lightbox': '/inventory/static/lightbox',
  'inventory-static-duratrans': '/inventory/static/duratrans',
  'inventory-static-megalight': '/inventory/static/megalight',
  'inventory-static-foil': '/inventory/static/foil',
  'inventory-static-panel': '/inventory/static/panel',
  'inventory-special': '/inventory/special',
  'inventory-special-stand': '/inventory/special/stand',
  'inventory-special-sponsorship': '/inventory/special/sponsorship',
  'alan-haritasi': '/alan-haritasi',
  'map-dashboard': '/map-dashboard',
  'firmalar-markalar': '/firmalar-markalar',
  'kampanyalar': '/kampanyalar',
  'teklifler': '/teklifler',
  'sozlesmeler': '/sozlesmeler',
  'medya-kutuphanesi': '/medya-kutuphanesi',
  'raporlar': '/raporlar',
  'finans': '/finans',
  'bildirimler': '/bildirimler',
  'ai-assistant': '/ai-assistant',
  'ayarlar': '/ayarlar',
  'design-system': '/design-system',
  'maintenance': '/maintenance',
  'competitor-analysis': '/competitor-analysis',
  'executive-dashboard': '/executive-dashboard',
  'system-roles': '/system-roles',
  'sales-wizard': '/sales-wizard',
  'digital-signage': '/digital-signage',
  'proof-of-play': '/proof-of-play',
  'rezervasyonlar': '/rezervasyonlar',
  'pipeline': '/pipeline',
};

const getRouteFromPath = (path: string): RouteType => {
  if (path === '/' || path === '' || path === '/index.html') return 'dashboard';
  if (path === '/advertising-spaces' || path === '/reklam-alanlari') return 'inventory';
  
  for (const [route, p] of Object.entries(routeToPath)) {
    if (p === path) return route as RouteType;
  }
  return 'dashboard';
};

interface AppContextProps {
  currentRoute: RouteType;
  setCurrentRoute: (route: RouteType) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (val: boolean) => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (val: boolean) => void;
  notifications: Array<{ id: string; title: string; desc: string; time: string; type: 'info' | 'alert' | 'success' }>;
  setNotifications: React.Dispatch<React.SetStateAction<Array<{ id: string; title: string; desc: string; time: string; type: 'info' | 'alert' | 'success' }>>>;
  globalDateRange: DateRangeState;
  setGlobalDateRange: (val: DateRangeState) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentRoute, setCurrentRouteState] = useState<RouteType>(() => {
    if (typeof window !== 'undefined') {
      return getRouteFromPath(window.location.pathname);
    }
    return 'dashboard';
  });
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);

  const setCurrentRoute = (route: RouteType) => {
    setCurrentRouteState(route);
    if (typeof window !== 'undefined') {
      const targetPath = routeToPath[route] || '/';
      if (window.location.pathname !== targetPath) {
        const search = window.location.search;
        window.history.pushState(null, '', `${targetPath}${search}`);
      }
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      setCurrentRouteState(getRouteFromPath(window.location.pathname));
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; desc: string; time: string; type: 'info' | 'alert' | 'success' }>>([
    { id: '1', title: 'Yeni Rezervasyon Teklifi', desc: 'Acun Medya, Levent Billboard 4 için teklif gönderdi.', time: '5 dk önce', type: 'info' },
    { id: '2', title: 'Doluluk Oranı %85\'e Ulaştı', desc: 'Temmuz ayı AVM dijital ekran doluluk oranı hedefe yaklaştı.', time: '1 saat önce', type: 'success' },
    { id: '3', title: 'Sözleşme Onayı Bekliyor', desc: 'Türk Hava Yolları havalimanı reklam sözleşmesi onay bekliyor.', time: '2 saat önce', type: 'alert' }
  ]);

  const [globalDateRange, setGlobalDateRange] = useState<DateRangeState>({
    type: 'custom',
    start: '2026-01-01',
    end: '2026-12-31'
  });

  // Command palette keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AppContext.Provider value={{
      currentRoute,
      setCurrentRoute,
      sidebarCollapsed,
      setSidebarCollapsed,
      mobileSidebarOpen,
      setMobileSidebarOpen,
      searchQuery,
      setSearchQuery,
      commandPaletteOpen,
      setCommandPaletteOpen,
      notifications,
      setNotifications,
      globalDateRange,
      setGlobalDateRange
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
