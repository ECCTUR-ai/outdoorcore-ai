import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { AuthProvider } from '@/auth/AuthProvider';
import { useAuth } from '@/auth/useAuth';
import { Login } from '@/pages/Login';

// Pages
import { Dashboard } from '@/pages/Dashboard';
import { ReklamAlanlari } from '@/pages/ReklamAlanlari';
import { AlanHaritasi } from '@/pages/AlanHaritasi';
import { FirmalarMarkalar } from '@/pages/FirmalarMarkalar';
import { Rezervasyonlar } from '@/pages/Rezervasyonlar';
import { Kampanyalar } from '@/pages/Kampanyalar';
import { Teklifler } from '@/pages/Teklifler';
import { Sozlesmeler } from '@/pages/Sozlesmeler';
import { MedyaKutuphanesi } from '@/pages/MedyaKutuphanesi';
import { Raporlar } from '@/pages/Raporlar';
import { Finans } from '@/pages/Finans';
import { Bildirimler } from '@/pages/Bildirimler';
import { AiAssistant } from '@/pages/AiAssistant';
import { Ayarlar } from '@/pages/Ayarlar';
import { DesignSystemDemo } from '@/pages/DesignSystemDemo';

// Sprint 11-14 Pages
import { Maintenance } from '@/pages/Maintenance';
import { CompetitorAnalysis } from '@/pages/CompetitorAnalysis';
import { ExecutiveDashboard } from '@/pages/ExecutiveDashboard';

function AppContent() {
  const { currentRoute } = useApp();
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#08111f] flex flex-col items-center justify-center text-slate-400 select-none">
        <div className="w-10 h-10 border-4 border-blue-500/25 border-t-blue-500 rounded-full animate-spin mb-4" />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">OutdoorCore Yükleniyor...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderActivePage = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <Dashboard />;
      case 'reklam-alanlari':
        return <ReklamAlanlari />;
      case 'alan-haritasi':
        return <AlanHaritasi />;
      case 'firmalar-markalar':
        return <FirmalarMarkalar />;
      case 'rezervasyonlar':
        return <Rezervasyonlar />;
      case 'kampanyalar':
        return <CampaignsPageWrapper />;
      case 'teklifler':
        return <Teklifler />;
      case 'sozlesmeler':
        return <Sozlesmeler />;
      case 'medya-kutuphanesi':
        return <MedyaKutuphanesi />;
      case 'raporlar':
        return <Raporlar />;
      case 'finans':
        return <Finans />;
      case 'bildirimler':
        return <Bildirimler />;
      case 'ai-assistant':
        return <AiAssistant />;
      case 'maintenance':
        return <Maintenance />;
      case 'competitor-analysis':
        return <CompetitorAnalysis />;
      case 'executive-dashboard':
        return <ExecutiveDashboard />;
      case 'ayarlar':
        return <Ayarlar />;
      case 'design-system':
        return <DesignSystemDemo />;
      default:
        return <Dashboard />;
    }
  };

  // Helper alias to bypass campaigns naming collision if any
  function CampaignsPageWrapper() {
    return <Kampanyalar />;
  }

  return (
    <div className="flex min-h-screen bg-[#08111f] text-slate-200 transition-colors duration-200 font-sans">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a]">
        <Header />
        {/* Page Content area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full overflow-x-hidden">
          {renderActivePage()}
        </main>
      </div>

      {/* Global Command Palette dialog shortcut */}
      <CommandPalette />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
