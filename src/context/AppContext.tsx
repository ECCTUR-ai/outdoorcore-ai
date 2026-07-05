import React, { createContext, useContext, useState, useEffect } from 'react';

type RouteType = 
  | 'dashboard' 
  | 'reklam-alanlari' 
  | 'alan-haritasi' 
  | 'firmalar-markalar' 
  | 'rezervasyonlar' 
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
  | 'executive-dashboard';

interface AppContextProps {
  currentRoute: RouteType;
  setCurrentRoute: (route: RouteType) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (val: boolean) => void;
  notifications: Array<{ id: string; title: string; desc: string; time: string; type: 'info' | 'alert' | 'success' }>;
  setNotifications: React.Dispatch<React.SetStateAction<Array<{ id: string; title: string; desc: string; time: string; type: 'info' | 'alert' | 'success' }>>>;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentRoute, setCurrentRoute] = useState<RouteType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; desc: string; time: string; type: 'info' | 'alert' | 'success' }>>([
    { id: '1', title: 'Yeni Rezervasyon Teklifi', desc: 'Acun Medya, Levent Billboard 4 için teklif gönderdi.', time: '5 dk önce', type: 'info' },
    { id: '2', title: 'Doluluk Oranı %85\'e Ulaştı', desc: 'Temmuz ayı AVM dijital ekran doluluk oranı hedefe yaklaştı.', time: '1 saat önce', type: 'success' },
    { id: '3', title: 'Sözleşme Onayı Bekliyor', desc: 'Türk Hava Yolları havalimanı reklam sözleşmesi onay bekliyor.', time: '2 saat önce', type: 'alert' }
  ]);

  // Sync class for Tailwind
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

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
      searchQuery,
      setSearchQuery,
      commandPaletteOpen,
      setCommandPaletteOpen,
      notifications,
      setNotifications,
      theme,
      setTheme
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
