import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  DownloadCloud, 
  FileSpreadsheet, 
  Sparkles,
  Building2,
  Users,
  Layers,
  Coins,
  FileSignature
} from 'lucide-react';
import { Company } from '@/data/companies';
import { Campaign } from '@/data/campaigns';
import { Contract } from '@/data/contracts';
import { companyRepository, campaignRepository, contractRepository } from '@/repositories';
import { parseAnyDate } from '@/utils/dateHelper';
import { DarkKpiCard } from '@/components/design-system/DarkKpiCard';
import { CompanyCard } from '@/components/design-system/CompanyCard';
import { CompanyList } from '@/components/design-system/CompanyList';
import { CompanyDetailPanel } from '@/components/design-system/CompanyDetailPanel';
import { AiInsightDrawer } from '@/components/design-system/AiInsightDrawer';
import { Button } from '@/components/design-system/Button';
import { PermissionGate } from '@/components/design-system/PermissionGate';
import { CompanyModal } from '@/components/design-system/CompanyModal';

export function FirmalarMarkalar() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | undefined>(undefined);

  const fetchData = async (selectFirst = false) => {
    setLoading(true);
    try {
      const cos = await companyRepository.list();
      setCompanies(cos);

      const [camps, conts] = await Promise.all([
        campaignRepository.getAll(),
        contractRepository.getAll()
      ]);
      setCampaigns(camps);
      setContracts(conts);

      if (cos.length > 0) {
        if (selectFirst || !selectedId || !cos.some(c => c.id === selectedId)) {
          setSelectedId(cos[0].id);
        }
      } else {
        setSelectedId('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);

    const handleRefresh = () => {
      fetchData(false);
    };
    window.addEventListener('storage', handleRefresh);
    window.addEventListener('outdoorcore_data_updated', handleRefresh);
    return () => {
      window.removeEventListener('storage', handleRefresh);
      window.removeEventListener('outdoorcore_data_updated', handleRefresh);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const companyId = params.get('companyId');
    if (companyId && companies.some(c => c.id === companyId)) {
      setSelectedId(companyId);
    }
  }, [companies]);

  // Selected company lookup model
  const selectedCompany = companies.find(c => c.id === selectedId) || companies[0];

  const handleCreate = () => {
    setEditingCompany(undefined);
    setModalOpen(true);
  };

  const handleEdit = (comp: Company) => {
    setEditingCompany(comp);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu firmayı silmek istediğinize emin misiniz?')) {
      const success = await companyRepository.softDelete(id);
      if (success) {
        fetchData(true);
      }
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalBrands = companies.reduce((sum, c) => sum + (c.brands?.length || 0), 0);
  
  const currentMonthNewCompanies = companies.filter(c => {
    const dStr = c.created_at || c.createdAt;
    if (!dStr) return false;
    const d = new Date(dStr);
    return !isNaN(d.getTime()) && d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth();
  }).length;

  const totalBudgetAmt = contracts.reduce((sum, c) => sum + (c.valueNumeric || parseFloat((c.value || '0').replace(/[^0-9]/g, '')) || 0), 0);

  const upcomingCampaignsCount = campaigns.filter(c => {
    const d = parseAnyDate(c.startDate);
    return d && d.getTime() > today.getTime();
  }).length;

  const formatCurrency = (val: number) => {
    if (val === 0) return '₺0';
    if (val >= 1000000) return `₺ ${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `₺ ${(val / 1000).toFixed(0)}K`;
    return `₺ ${val.toLocaleString('tr-TR')}`;
  };

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

          <PermissionGate permission="companies.create">
            <Button 
              variant="outline" 
              size="sm" 
              leftIcon={<Plus size={13} />}
              onClick={handleCreate}
            >
              Yeni Firma
            </Button>
          </PermissionGate>

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
          value={loading ? '...' : String(companies.length)}
          percentage="%100"
          subtext="Kayıtlı portföy"
          icon={<Building2 size={15} />}
          iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/10"
        />
        <DarkKpiCard
          title="Aktif Firma"
          value={loading ? '...' : String(companies.filter(c => c.status === 'Aktif').length)}
          percentage={`${companies.length > 0 ? ((companies.filter(c => c.status === 'Aktif').length / companies.length) * 100).toFixed(1) : 0}%`}
          subtext="Aktif kiralama yapan"
          icon={<Users size={15} />}
          iconBgColor="bg-emerald-500/10 text-emerald-400 border-emerald-500/10"
          glowColor="green"
        />
        <DarkKpiCard
          title="Toplam Marka"
          value={loading ? '...' : String(totalBrands)}
          percentage={companies.length > 0 ? `x${(totalBrands / companies.length).toFixed(1)}` : '—'}
          subtext="Alt marka dağılımı"
          icon={<Layers size={15} />}
          iconBgColor="bg-amber-500/10 text-amber-400 border-amber-500/10"
          glowColor="yellow"
        />
        <DarkKpiCard
          title="Bu Ay Yeni Firma"
          value={loading ? '...' : String(currentMonthNewCompanies)}
          percentage="—"
          subtext="Müşteri kazanımı"
          icon={<Plus size={15} />}
          iconBgColor="bg-purple-500/10 text-purple-400 border-purple-500/10"
          glowColor="purple"
        />
        <DarkKpiCard
          title="Toplam Bütçe"
          value={loading ? '...' : formatCurrency(totalBudgetAmt)}
          percentage="—"
          subtext="Toplam potansiyel"
          icon={<Coins size={15} />}
          iconBgColor="bg-sky-500/10 text-sky-400 border-sky-500/10"
          glowColor="blue"
        />
        <DarkKpiCard
          title="Yaklaşan Kampanya"
          value={loading ? '...' : String(upcomingCampaignsCount)}
          percentage="—"
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
            {companies.length === 0 && !loading && (
              <div className="col-span-2 text-center text-slate-500 text-xs font-bold uppercase tracking-wider py-8">
                Firma Bulunamadı
              </div>
            )}
          </div>
        </div>

        {/* 3. Sağ: Detailed sticky overview panel */}
        <div className="order-3 lg:order-none lg:col-span-4">
          {selectedCompany && (
            <CompanyDetailPanel 
              company={selectedCompany} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {/* Company CRUD Modal */}
      <CompanyModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        company={editingCompany}
        onSuccess={() => fetchData(false)}
      />

      {/* AI Insight Drawer overlay dialog */}
      {selectedCompany && (
        <AiInsightDrawer 
          isOpen={aiDrawerOpen}
          onClose={() => setAiDrawerOpen(false)}
          selectedSpaceCode={selectedCompany.name}
        />
      )}
    </div>
  );
}
