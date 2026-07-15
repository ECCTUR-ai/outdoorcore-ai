import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { FloatingAiPilot } from '@/components/design-system/FloatingAiPilot';
import { AuthProvider } from '@/auth/AuthProvider';
import { useAuth } from '@/auth/useAuth';
import { Login } from '@/pages/Login';
import { PermissionGate } from '@/components/design-system/PermissionGate';
import { AlertTriangle, Tv, Image, Sparkles } from 'lucide-react';
import { InventoryListPage } from '@/pages/InventoryListPage';

function AccessDenied() {
  return (
    <div className="dark-glass-card border border-rose-500/10 p-8 rounded-3xl text-center max-w-md mx-auto my-12 space-y-4 select-none">
      <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto text-rose-500">
        <AlertTriangle size={24} />
      </div>
      <h4 className="text-sm font-black text-white uppercase tracking-wider">Yetkisiz Erişim</h4>
      <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
        Bu sayfayı görüntülemek için gerekli yetkilere sahip değilsiniz. Lütfen sistem yöneticinizle iletişime geçin.
      </p>
    </div>
  );
}

// Pages
import { Dashboard } from '@/pages/Dashboard';
import { ReklamAlanlari } from '@/pages/ReklamAlanlari';
import { AlanHaritasi } from '@/pages/AlanHaritasi';
import { MapDashboard } from '@/pages/MapDashboard';
import { FirmalarMarkalar } from '@/pages/FirmalarMarkalar';
import { Kampanyalar } from '@/pages/Kampanyalar';
import { Teklifler } from '@/pages/Teklifler';
import { PipelinePage } from '@/pages/Pipeline';
import { Rezervasyonlar } from '@/pages/Rezervasyonlar';
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
import { SystemRoles } from '@/pages/SystemRoles';
import { SalesWizard } from '@/pages/SalesWizard';
import { DigitalSignage } from '@/pages/DigitalSignage';
import { ProofOfPlayTable } from '@/components/design-system/ProofOfPlayTable';


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
      case 'inventory':
        return <ReklamAlanlari />;
      case 'inventory-digital':
        return (
          <InventoryListPage
            title="Dijital Ekranlar"
            subtitle="LED ve dijital yayın yapılan reklam alanlarını yönetin."
            mediaTypeFilter={["LED", "DIGITAL", "DIGITAL_SCREEN", "LED_SCREEN", "DIGITAL_NETWORK"]}
            categoryType="digital"
            columns={['code', 'name', 'terminal', 'size', 'adet', 'face', 'network', 'status', 'actions']}
            icon={<Tv size={16} className="text-blue-500" />}
            emptyState="Kayıtlı dijital reklam alanı bulunmamaktadır."
          />
        );
      case 'inventory-digital-led':
        return (
          <InventoryListPage
            title="LED Ekranlar"
            subtitle="LED reklam alanlarının fiziksel envanterini yönetin."
            mediaTypeFilter={["LED", "LED_SCREEN", "DIGITAL_LED"]}
            categoryType="led"
            defaultType="LED"
            columns={['code', 'name', 'terminal', 'size', 'adet', 'face', 'network', 'status', 'actions']}
            icon={<Tv size={16} className="text-blue-500" />}
            emptyState="Kayıtlı LED reklam alanı bulunmamaktadır."
          />
        );
      case 'inventory-static':
        return (
          <InventoryListPage
            title="Statik Reklam Alanları"
            subtitle="Lightbox, Duratrans, Megalight, Folyo ve statik pano envanterini yönetin."
            mediaTypeFilter={["LIGHTBOX", "DURATRANS", "MEGALIGHT", "FOIL", "STATIC_PANEL", "STATIC"]}
            categoryType="static"
            columns={['code', 'name', 'terminal', 'size', 'adet', 'face', 'type', 'status', 'actions']}
            icon={<Image size={16} className="text-blue-500" />}
            emptyState="Kayıtlı statik reklam alanı bulunmamaktadır."
          />
        );
      case 'inventory-static-lightbox':
        return (
          <InventoryListPage
            title="Lightbox"
            subtitle="Lightbox reklam alanları envanteri."
            mediaTypeFilter={["LIGHTBOX"]}
            categoryType="lightbox"
            defaultType="Lightbox"
            columns={['code', 'name', 'terminal', 'size', 'adet', 'face', 'status', 'actions']}
            icon={<Image size={16} className="text-blue-500" />}
            emptyState="Kayıtlı Lightbox reklam alanı bulunmamaktadır."
          />
        );
      case 'inventory-static-duratrans':
        return (
          <InventoryListPage
            title="Duratrans"
            subtitle="Duratrans reklam alanları envanteri."
            mediaTypeFilter={["DURATRANS"]}
            categoryType="duratrans"
            defaultType="Duratrans"
            columns={['code', 'name', 'terminal', 'size', 'adet', 'face', 'status', 'actions']}
            icon={<Image size={16} className="text-blue-500" />}
            emptyState="Kayıtlı Duratrans reklam alanı bulunmamaktadır."
          />
        );
      case 'inventory-static-megalight':
        return (
          <InventoryListPage
            title="Megalight"
            subtitle="Megalight reklam alanları envanteri."
            mediaTypeFilter={["MEGALIGHT"]}
            categoryType="megalight"
            defaultType="Megalight"
            columns={['code', 'name', 'terminal', 'size', 'adet', 'face', 'status', 'actions']}
            icon={<Image size={16} className="text-blue-500" />}
            emptyState="Kayıtlı Megalight reklam alanı bulunmamaktadır."
          />
        );
      case 'inventory-static-foil':
        return (
          <InventoryListPage
            title="Folyo Alanları"
            subtitle="Folyo ve vinyl reklam alanları envanteri."
            mediaTypeFilter={["FOIL", "FOLYO", "VINYL"]}
            categoryType="foil"
            defaultType="Foil"
            columns={['code', 'name', 'terminal', 'size', 'adet', 'face', 'status', 'actions']}
            icon={<Image size={16} className="text-blue-500" />}
            emptyState="Kayıtlı folyo reklam alanı bulunmamaktadır."
          />
        );
      case 'inventory-static-panel':
        return (
          <InventoryListPage
            title="Statik Panolar"
            subtitle="Statik pano reklam alanları envanteri."
            mediaTypeFilter={["STATIC_PANEL", "STATIC", "PANEL"]}
            categoryType="panel"
            defaultType="Static Panel"
            columns={['code', 'name', 'terminal', 'size', 'adet', 'face', 'status', 'actions']}
            icon={<Image size={16} className="text-blue-500" />}
            emptyState="Kayıtlı statik pano reklam alanı bulunmamaktadır."
          />
        );
      case 'inventory-special':
        return (
          <InventoryListPage
            title="Özel Reklam Alanları"
            subtitle="Stand, deneyim ve sponsorluk alanlarını yönetin."
            mediaTypeFilter={["STAND", "POPUP", "EXPERIENCE_AREA", "SPONSORSHIP", "AREA_SPONSORSHIP"]}
            categoryType="special"
            columns={['code', 'name', 'terminal', 'size', 'type', 'client', 'status', 'actions']}
            icon={<Sparkles size={16} className="text-blue-500" />}
            emptyState="Kayıtlı özel reklam alanı bulunmamaktadır."
          />
        );
      case 'inventory-special-stand':
        return (
          <InventoryListPage
            title="Stand Alanları"
            subtitle="Stand ve deneyim alanları envanteri."
            mediaTypeFilter={["STAND", "POPUP", "EXPERIENCE_AREA"]}
            categoryType="stand"
            defaultType="Stand"
            columns={['code', 'name', 'terminal', 'size', 'client', 'status', 'actions']}
            icon={<Sparkles size={16} className="text-blue-500" />}
            emptyState="Kayıtlı stand reklam alanı bulunmamaktadır."
          />
        );
      case 'inventory-special-sponsorship':
        return (
          <InventoryListPage
            title="Sponsorluk Alanları"
            subtitle="Sponsorluk alanları envanteri."
            mediaTypeFilter={["SPONSORSHIP", "AREA_SPONSORSHIP"]}
            categoryType="sponsorship"
            defaultType="Sponsorship"
            columns={['code', 'name', 'terminal', 'size', 'client', 'status', 'actions']}
            icon={<Sparkles size={16} className="text-blue-500" />}
            emptyState="Kayıtlı sponsorluk reklam alanı bulunmamaktadır."
          />
        );
      case 'alan-haritasi':
        return <AlanHaritasi />;
      case 'map-dashboard':
        return <MapDashboard />;
      case 'firmalar-markalar':
        return <FirmalarMarkalar />;
      case 'kampanyalar':
        return <CampaignsPageWrapper />;
      case 'teklifler':
        return <Teklifler />;
      case 'pipeline':
        return <PipelinePage />;
      case 'rezervasyonlar':
        return <Rezervasyonlar />;
      case 'sozlesmeler':
        return <Sozlesmeler />;
      case 'medya-kutuphanesi':
        return <MedyaKutuphanesi />;
      case 'raporlar':
        return <Raporlar />;
      case 'finans':
        return (
          <PermissionGate permission="finance.view" fallback={<AccessDenied />}>
            <Finans />
          </PermissionGate>
        );
      case 'bildirimler':
        return <Bildirimler />;
      case 'ai-assistant':
        return <AiAssistant />;
      case 'maintenance':
        return <Maintenance />;
      case 'competitor-analysis':
        return <CompetitorAnalysis />;
      case 'executive-dashboard':
        return (
          <PermissionGate permission="executive.view" fallback={<AccessDenied />}>
            <ExecutiveDashboard />
          </PermissionGate>
        );
      case 'ayarlar':
        return (
          <PermissionGate permission="roles.manage" fallback={<AccessDenied />}>
            <Ayarlar />
          </PermissionGate>
        );
      case 'system-roles':
        return (
          <PermissionGate permission="roles.manage" fallback={<AccessDenied />}>
            <SystemRoles />
          </PermissionGate>
        );
      case 'sales-wizard':
        return <SalesWizard />;
      case 'digital-signage':
        return (
          <PermissionGate permission="spaces.view" fallback={<AccessDenied />}>
            <DigitalSignage />
          </PermissionGate>
        );
      case 'proof-of-play':
        return (
          <div className="space-y-6 text-left select-none">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">Proof of Play Raporlama Terminali</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Dijital ekranların gerçek zamanlı yayın loglarını ve oynatma kanıtlarını inceleyin.</p>
            </div>
            <div className="bg-[#0b0f19] border border-white/5 p-6 rounded-3xl">
              <ProofOfPlayTable />
            </div>
          </div>
        );
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
    <div className="flex min-h-screen bg-transparent text-foreground transition-colors duration-200 font-sans">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        <Header />
        {/* Page Content area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full overflow-x-hidden">
          {renderActivePage()}
        </main>
      </div>

      {/* Global Command Palette dialog shortcut */}
      <CommandPalette />

      {/* Global Floating AI Pilot Assistant */}
      <FloatingAiPilot />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
