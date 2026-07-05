import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';

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
import { AiAssistant } from '@/pages/AiAssistant';
import { Ayarlar } from '@/pages/Ayarlar';
import { DesignSystemDemo } from '@/pages/DesignSystemDemo';

function AppContent() {
  const { currentRoute } = useApp();

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
        return <Kampanyalar />;
      case 'teklifler':
        return <Teklifler />;
      case 'sozlesmeler':
        return <Sozlesmeler />;
      case 'medya-kutuphanesi':
        return <MedyaKutuphanesi />;
      case 'raporlar':
        return <Raporlar />;
      case 'ai-assistant':
        return <AiAssistant />;
      case 'ayarlar':
        return <Ayarlar />;
      case 'design-system':
        return <DesignSystemDemo />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-200 font-sans">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        {/* Page Content area */}
        <main className="flex-1 p-6 md:p-8 max-w-[1600px] mx-auto w-full">
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
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
