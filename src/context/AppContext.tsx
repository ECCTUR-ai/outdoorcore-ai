import React, { createContext, useContext, useState, useEffect } from 'react';

type RouteType = 
  | 'dashboard' 
  | 'reklam-alanlari' 
  | 'alan-haritasi' 
  | 'map-dashboard'
  | 'firmalar-markalar' 
  | 'takvim' 
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
  | 'sales-wizard';

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
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentRoute, setCurrentRoute] = useState<RouteType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; desc: string; time: string; type: 'info' | 'alert' | 'success' }>>([
    { id: '1', title: 'Yeni Rezervasyon Teklifi', desc: 'Acun Medya, Levent Billboard 4 için teklif gönderdi.', time: '5 dk önce', type: 'info' },
    { id: '2', title: 'Doluluk Oranı %85\'e Ulaştı', desc: 'Temmuz ayı AVM dijital ekran doluluk oranı hedefe yaklaştı.', time: '1 saat önce', type: 'success' },
    { id: '3', title: 'Sözleşme Onayı Bekliyor', desc: 'Türk Hava Yolları havalimanı reklam sözleşmesi onay bekliyor.', time: '2 saat önce', type: 'alert' }
  ]);



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
      setNotifications
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
