import React, { useState } from 'react';
import { 
  Plus, 
  DownloadCloud, 
  FileSpreadsheet, 
  SlidersHorizontal, 
  Sparkles,
  Building2,
  Users,
  Layers,
  Coins,
  CalendarDays,
  FileSignature
} from 'lucide-react';
import { Company } from '@/data/companies';
import { companyRepository } from '@/repositories';
import { DarkKpiCard } from '@/components/design-system/DarkKpiCard';
import { DarkDashboardCard } from '@/components/design-system/DarkDashboardCard';
import { CompanyCard } from '@/components/design-system/CompanyCard';
import { CompanyList } from '@/components/design-system/CompanyList';
import { CompanyDetailPanel } from '@/components/design-system/CompanyDetailPanel';
import { AiInsightDrawer } from '@/components/design-system/AiInsightDrawer';
import { Button } from '@/components/design-system/Button';

export function FirmalarMarkalar() {
  const companies = companyRepository.getAllSync();
  const [selectedId, setSelectedId] = useState<string>('CMP-0001');
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const companyId = params.get('companyId');
    if (companyId && companies.some(c => c.id === companyId)) {
      setSelectedId(companyId);
    }
  }, []);

  // Selected company lookup model
  const selectedCompany = companies.find(c => c.id === selectedId) || companies[0];

  return (
    <div className="space-y-6 select-none pb-12">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 p-5 rounded-3xl border border-white/5 shadow-sm text-left">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">Firmalar & Markalar</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">OutdoorCore AI içerisinde bulunan reklam veren firmaları, markaları ve reklam geçmişlerini yönetin.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* OutdoorCore AI Button */}
          <Button 
            variant="primary" 
            size="sm" 
            leftIcon={<Sparkles size={13} className="animate-pulse" />}
            className="bg-gradient-to-r from-blue-650 to-indigo-650 hover:from-blue-600 hover:to-indigo-600 text-white font-black"
            onClick={() => setAiDrawerOpen(true)}
          >
            OutdoorCore AI
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            leftIcon={<Plus size={13} />}
            onClick={() => alert('Yeni firma ekleme mockup formu açılacak.')}
          >
            Yeni Firma
          </Button>

          <Button 
            variant="minimal" 
            size="sm" 
            leftIcon={<DownloadCloud size={13} />}
            onClick={() => alert('Firma CRM Raporu (.pdf) indiriliyor...')}
          >
            Rapor İndir
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            leftIcon={<FileSpreadsheet size={13} />}
            onClick={() => alert('CRM Excel Raporu (.xlsx) aktarılıyor...')}
          >
            Excel
          </Button>
        </div>
      </div>

      {/* Upper CRM KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <DarkKpiCard
          title="Toplam Firma"
          value="248"
          percentage="%100"
          subtext="Kayıtlı portföy"
          icon={<Building2 size={15} />}
          iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/10"
        />
        <DarkKpiCard
          title="Aktif Firma"
          value="196"
          percentage="%79.0"
          subtext="Aktif kiralama yapan"
          icon={<Users size={15} />}
          iconBgColor="bg-emerald-500/10 text-emerald-400 border-emerald-500/10"
          glowColor="green"
        />
        <DarkKpiCard
          title="Toplam Marka"
          value="642"
          percentage="x2.5"
          subtext="Alt marka dağılımı"
          icon={<Layers size={15} />}
          iconBgColor="bg-amber-500/10 text-amber-400 border-amber-500/10"
          glowColor="yellow"
        />
        <DarkKpiCard
          title="Bu Ay Yeni Firma"
          value="18"
          percentage="+%12.0"
          subtext="Müşteri kazanımı"
          icon={<Plus size={15} />}
          iconBgColor="bg-purple-500/10 text-purple-400 border-purple-500/10"
          glowColor="purple"
        />
        <DarkKpiCard
          title="Toplam Bütçe"
          value="₺847.5M"
          percentage="%100"
          subtext="Toplam potansiyel"
          icon={<Coins size={15} />}
          iconBgColor="bg-sky-500/10 text-sky-400 border-sky-500/10"
          glowColor="blue"
        />
        <DarkKpiCard
          title="Yaklaşan Kampanya"
          value="27"
          percentage="+5 yeni"
          subtext="Rezerve takvimi"
          icon={<FileSignature size={15} />}
          iconBgColor="bg-rose-500/10 text-rose-400 border-rose-500/10"
          glowColor="red"
        />
      </div>

      {/* Main CRM split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. Sol: Filter & Company List scroll box */}
        <div className="order-2 lg:order-none lg:col-span-3">
          <CompanyList 
            companies={companies}
            selectedId={selectedId}
            onSelect={(id) => setSelectedId(id)}
          />
        </div>

        {/* 2. Orta: Company cards display catalog */}
        <div className="order-1 lg:order-none lg:col-span-5 space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Firma Kartları Portalı</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {companies.map(c => (
              <CompanyCard 
                key={c.id} 
                company={c} 
                isActive={selectedId === c.id}
                onClick={() => setSelectedId(c.id)}
              />
            ))}
          </div>
        </div>

        {/* 3. Sağ: Detailed sticky overview panel */}
        <div className="order-3 lg:order-none lg:col-span-4">
          <CompanyDetailPanel company={selectedCompany} />
        </div>
      </div>

      {/* AI Insight Drawer overlay dialog */}
      <AiInsightDrawer 
        isOpen={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
        selectedSpaceCode={selectedCompany.name}
      />
    </div>
  );
}
