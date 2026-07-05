import React, { useState } from 'react';
import { 
  MapPin, 
  CheckSquare, 
  Circle, 
  FileText, 
  Wrench, 
  TrendingUp, 
  Calendar,
  Sparkles,
  ChevronDown,
  PlusSquare,
  FileSpreadsheet,
  UploadCloud,
  FilePlus,
  Bookmark
} from 'lucide-react';
import { DarkKpiCard } from '@/components/design-system/DarkKpiCard';
import { DarkDashboardCard } from '@/components/design-system/DarkDashboardCard';
import { TerminalMapMock } from '@/components/design-system/TerminalMapMock';
import { Badge } from '@/components/design-system/Badge';
import { Button } from '@/components/design-system/Button';
import { Table, TableRow, TableCell } from '@/components/design-system/Table';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

export function Dashboard() {
  const [terminalSelector, setTerminalSelector] = useState('İç Hatlar - Giriş Kat');

  // Donut 1 - Alan Durumu Dağılımı
  const spaceStatusData = [
    { name: 'Dolu', value: 92, color: '#10b981' },
    { name: 'Boş', value: 34, color: '#f59e0b' },
    { name: 'Teklif', value: 18, color: '#8b5cf6' },
    { name: 'Bakımda', value: 6, color: '#ef4444' }
  ];

  // Donut 2 - Gelir Dağılımı Alan Tipi
  const spaceTypeRevenueData = [
    { name: 'LED Ekran', value: 55, color: '#3b82f6' },
    { name: 'Lightbox', value: 20, color: '#8b5cf6' },
    { name: 'Dijital Panel', value: 15, color: '#f59e0b' },
    { name: 'Baskı', value: 10, color: '#ef4444' }
  ];

  // Line Chart - Aylık Gelir
  const monthlyRevenueData = [
    { name: 'Oca', gelir: 8.5 },
    { name: 'Şub', gelir: 9.8 },
    { name: 'Mar', gelir: 11.2 },
    { name: 'Nis', gelir: 12.8 },
    { name: 'May', gelir: 14.75 },
    { name: 'Haz', gelir: 15.6 }
  ];

  // Marka Progress Bars
  const topBrands = [
    { name: 'Turkcell', value: 8, total: 10, color: 'bg-blue-500' },
    { name: 'Samsung', value: 6, total: 10, color: 'bg-emerald-500' },
    { name: 'THY', value: 5, total: 10, color: 'bg-purple-500' },
    { name: 'LC Waikiki', value: 4, total: 10, color: 'bg-amber-500' },
    { name: 'Mercedes-Benz', value: 4, total: 10, color: 'bg-rose-500' }
  ];

  // Teklif Pipeline steps
  const pipelineSteps = [
    { name: 'Lead', count: 25, budget: '₺2.45M' },
    { name: 'Teklif', count: 18, budget: '₺1.87M' },
    { name: 'Sunum', count: 12, budget: '₺1.25M' },
    { name: 'Görüşme', count: 7, budget: '₺980K' },
    { name: 'Sözleşme', count: 5, budget: '₺750K' }
  ];

  const recentContracts = [
    { code: 'SG-021', name: 'Check-in Önü LED', brand: 'Samsung Electronics', daysLeft: 15, date: '21 May 2025', avatar: 'S' },
    { code: 'SG-045', name: 'Duty Free Yanı LED', brand: 'Mercedes-Benz', daysLeft: 22, date: '28 May 2025', avatar: 'M' },
    { code: 'SG-067', name: 'Pasaport Kontrolü Üstü', brand: 'LC Waikiki', daysLeft: 30, date: '05 Haz 2025', avatar: 'L' },
    { code: 'SG-003', name: 'Giriş LED Ekran', brand: 'Turkcell', daysLeft: 35, date: '10 Haz 2025', avatar: 'T' }
  ];

  return (
    <div className="space-y-6 select-none pb-12">
      {/* 6 KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <DarkKpiCard
          title="Toplam Reklam Alanı"
          value="150"
          percentage="%100"
          subtext="Tüm alanlar"
          icon={<MapPin size={15} />}
          iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/10"
          glowColor="blue"
        />
        <DarkKpiCard
          title="Dolu Alan"
          value="92"
          percentage="%61.3"
          subtext="Aktif sözleşmeler"
          icon={<CheckSquare size={15} />}
          iconBgColor="bg-emerald-500/10 text-emerald-400 border-emerald-500/10"
          glowColor="green"
        />
        <DarkKpiCard
          title="Boş Alan"
          value="34"
          percentage="%22.7"
          subtext="Kiralanabilir alanlar"
          icon={<Circle size={15} />}
          iconBgColor="bg-amber-500/10 text-amber-400 border-amber-500/10"
          glowColor="yellow"
        />
        <DarkKpiCard
          title="Teklif Aşamasında"
          value="18"
          percentage="%12.0"
          subtext="Görüşme aşamasındaki"
          icon={<FileText size={15} />}
          iconBgColor="bg-purple-500/10 text-purple-400 border-purple-500/10"
          glowColor="purple"
        />
        <DarkKpiCard
          title="Bakımda"
          value="6"
          percentage="%4.0"
          subtext="Serviste olan alanlar"
          icon={<Wrench size={15} />}
          iconBgColor="bg-rose-500/10 text-rose-400 border-rose-500/10"
          glowColor="red"
        />
        <DarkKpiCard
          title="Doluluk Oranı"
          value="%61.3"
          percentage="%8.7 yükseliş"
          subtext="Aylık trend"
          icon={<TrendingUp size={15} />}
          iconBgColor="bg-sky-500/10 text-sky-400 border-sky-500/10"
          glowColor="blue"
          sparkline={true}
        />
      </div>

      {/* Main Grid: Map and Side lists */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sol Üst: Terminal Haritası */}
        <DarkDashboardCard
          title="Terminal Haritası"
          description="Sabiha Gökçen Havalimanı reklam üniteleri yerleşim krokisi"
          className="lg:col-span-8"
          headerActions={
            <div className="relative">
              <select
                value={terminalSelector}
                onChange={(e) => setTerminalSelector(e.target.value)}
                className="bg-white/5 border border-white/5 rounded-xl px-3.5 py-1.5 text-[9.5px] font-black text-slate-300 focus:outline-none uppercase tracking-wider cursor-pointer appearance-none pr-7"
              >
                <option value="İç Hatlar - Giriş Kat">İç Hatlar - Giriş Kat</option>
                <option value="Dış Hatlar - Gidiş Lobi">Dış Hatlar - Gidiş Lobi</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[8px]">
                ▼
              </div>
            </div>
          }
        >
          <div className="space-y-4 text-left">
            <TerminalMapMock />
            {/* Map Legend */}
            <div className="flex flex-wrap items-center justify-start gap-4 pt-1.5">
              {[
                { label: 'Dolu', color: 'bg-emerald-500 glow-green' },
                { label: 'Boş (Müsait)', color: 'bg-amber-500 glow-yellow' },
                { label: 'Teklif Aşamasında', color: 'bg-purple-500 glow-purple' },
                { label: 'Bakımda / Arıza', color: 'bg-rose-500 glow-red' },
                { label: 'Yakında Boşalacak', color: 'bg-blue-500 glow-blue' }
              ].map(leg => (
                <div key={leg.label} className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full border border-white/5 ${leg.color}`} />
                  <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider">{leg.label}</span>
                </div>
              ))}
            </div>
          </div>
        </DarkDashboardCard>

        {/* Sağ Üst: Yakında Biten Sözleşmeler */}
        <DarkDashboardCard
          title="Yakında Biten Sözleşmeler"
          description="Önümüzdeki 45 gün içinde kiralama süresi dolacak üniteler"
          className="lg:col-span-4"
        >
          <div className="space-y-3.5 text-left">
            {recentContracts.map(row => (
              <div 
                key={row.code} 
                className="flex items-center justify-between p-3 rounded-2xl bg-white/3 border border-white/5 hover:bg-white/5 duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                    {row.avatar}
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black text-white uppercase">{row.code} | {row.name}</span>
                    <p className="text-[9px] text-slate-450 font-bold uppercase">{row.brand}</p>
                  </div>
                </div>
                <div className="text-right space-y-0.5 shrink-0">
                  <span className="text-[9.5px] font-black text-rose-450 uppercase block">{row.daysLeft} gün kaldı</span>
                  <span className="text-[8px] text-slate-500 font-bold uppercase block">{row.date}</span>
                </div>
              </div>
            ))}
          </div>
        </DarkDashboardCard>
      </div>

      {/* Grid: Charts (Donuts & Monthly line charts) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        {/* Alan Durumu Dağılımı Donut */}
        <DarkDashboardCard
          title="Alan Durumu Dağılımı"
          description="Reklam alanlarının kullanım payları"
          className="md:col-span-1 lg:col-span-4"
        >
          <div className="flex items-center justify-between gap-2 h-44 text-left">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={spaceStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {spaceStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#0b0f19',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '10px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-2.5">
              {spaceStatusData.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{item.name}</span>
                  </div>
                  <span className="text-xs font-black text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </DarkDashboardCard>

        {/* Aylık Gelir Line Chart */}
        <DarkDashboardCard
          title="Aylık Gelir"
          description="Aylara göre toplam kiralama hacmi (₺ Milyon)"
          className="md:col-span-1 lg:col-span-4"
          headerActions={
            <div className="text-right">
              <span className="text-sm font-black text-emerald-450 leading-none block">₺14.75M</span>
              <span className="text-[8px] text-slate-500 font-black uppercase tracking-wider block">Mayıs Geliri</span>
            </div>
          }
        >
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} style={{ fontSize: '9px', fill: '#64748b' }} dy={6} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: '9px', fill: '#64748b' }} dx={-6} />
                <Tooltip
                  contentStyle={{
                    background: '#0b0f19',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '10px'
                  }}
                />
                <Line type="monotone" dataKey="gelir" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DarkDashboardCard>

        {/* Gelir Dağılımı - Alan Tipi Donut */}
        <DarkDashboardCard
          title="Gelir Dağılımı"
          description="Alan tiplerine göre yüzde dağılımları"
          className="md:col-span-1 lg:col-span-4"
        >
          <div className="flex items-center justify-between gap-2 h-44 text-left">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={spaceTypeRevenueData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {spaceTypeRevenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#0b0f19',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '10px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-2.5">
              {spaceTypeRevenueData.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{item.name}</span>
                  </div>
                  <span className="text-xs font-black text-white">%{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </DarkDashboardCard>
      </div>

      {/* Grid: Top Brands & Proposal Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sol: En Çok Reklam Veren Markalar */}
        <DarkDashboardCard
          title="En Çok Reklam Veren Markalar"
          description="Aktif kampanya sayısına göre ilk 5 marka"
          className="lg:col-span-6"
        >
          <div className="space-y-4 text-left pt-2">
            {topBrands.map(brand => (
              <div key={brand.name} className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
                  <span className="text-slate-350">{brand.name}</span>
                  <span className="text-white">{brand.value} Alan</span>
                </div>
                {/* Progress bar container */}
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${brand.color}`} 
                    style={{ width: `${(brand.value / brand.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </DarkDashboardCard>

        {/* Sağ: Teklif Pipeline */}
        <DarkDashboardCard
          title="Teklif Pipeline"
          description="Satış süreçlerindeki potansiyel fırsatlar ve bütçeleri"
          className="lg:col-span-6"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3.5 pt-2 text-center">
            {pipelineSteps.map((step, idx) => (
              <div 
                key={step.name} 
                className="p-3.5 rounded-2xl bg-white/3 border border-white/5 flex flex-col justify-between h-36 hover:bg-white/5 duration-150"
              >
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block leading-none">{step.name}</span>
                <div className="space-y-1 my-auto">
                  <span className="text-base font-black text-white block leading-none">{step.count}</span>
                  <span className="text-[8px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-black uppercase tracking-wide inline-block">Fırsat</span>
                </div>
                <span className="text-[10px] font-black text-emerald-450 block leading-none">{step.budget}</span>
              </div>
            ))}
          </div>
        </DarkDashboardCard>
      </div>

      {/* Bottom Grid: Active campaigns and Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sol Alt: Son Aktif Kampanyalar */}
        <DarkDashboardCard
          title="Son Aktif Kampanyalar"
          description="Terminal genelinde yayında olan reklam kampanyaları"
          className="lg:col-span-8"
        >
          <div className="overflow-x-auto select-none no-scrollbar">
            <Table headers={['Alan Kodu', 'Alan Adı', 'Marka / Reklamveren', 'Başlangıç', 'Bitiş', 'Durum', 'İlerleme']}>
              <TableRow>
                <TableCell className="font-extrabold text-slate-500">SG-001</TableCell>
                <TableCell className="font-black text-white">Giriş LED Ekran</TableCell>
                <TableCell className="font-semibold text-slate-300">Turkcell</TableCell>
                <TableCell>01 May 2025</TableCell>
                <TableCell>31 May 2025</TableCell>
                <TableCell>
                  <Badge variant="success">Aktif</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden shrink-0">
                      <div className="h-full bg-emerald-500 rounded-full w-full" />
                    </div>
                    <span className="text-[9px] font-black text-white">%100</span>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-extrabold text-slate-500">SG-021</TableCell>
                <TableCell className="font-black text-white">Check-in Önü LED</TableCell>
                <TableCell className="font-semibold text-slate-300">Samsung</TableCell>
                <TableCell>01 Nis 2025</TableCell>
                <TableCell>15 Haz 2025</TableCell>
                <TableCell>
                  <Badge variant="success">Aktif</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden shrink-0">
                      <div className="h-full bg-emerald-500 rounded-full w-3/4" />
                    </div>
                    <span className="text-[9px] font-black text-white">%75</span>
                  </div>
                </TableCell>
              </TableRow>
            </Table>
          </div>
        </DarkDashboardCard>

        {/* Sağ Alt: Hızlı İşlemler */}
        <DarkDashboardCard
          title="Hızlı İşlemler"
          description="Sık kullanılan operasyon butonları"
          className="lg:col-span-4"
        >
          <div className="grid grid-cols-3 gap-3 pt-1">
            {[
              { label: 'Yeni Teklif', icon: <PlusSquare size={16} />, color: 'text-blue-400 bg-blue-500/10 border-blue-500/10 hover:bg-blue-500/15' },
              { label: 'Alan Rezervasyon', icon: <Bookmark size={16} />, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/10 hover:bg-emerald-500/15' },
              { label: 'Rapor Oluştur', icon: <FileSpreadsheet size={16} />, color: 'text-amber-400 bg-amber-500/10 border-amber-500/10 hover:bg-amber-500/15' },
              { label: 'Medya Gönder', icon: <UploadCloud size={16} />, color: 'text-purple-400 bg-purple-500/10 border-purple-500/10 hover:bg-purple-500/15' },
              { label: 'Sözleşme Ekle', icon: <FilePlus size={16} />, color: 'text-rose-400 bg-rose-500/10 border-rose-500/10 hover:bg-rose-500/15' }
            ].map(action => (
              <button
                key={action.label}
                onClick={() => alert(`${action.label} operasyon paneli açılacak mockup.`)}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2.5 transition-all text-center select-none cursor-pointer h-24 duration-150 ${action.color}`}
              >
                <div className="shrink-0">{action.icon}</div>
                <span className="text-[9.5px] font-black leading-tight uppercase tracking-wider">{action.label}</span>
              </button>
            ))}
          </div>
        </DarkDashboardCard>
      </div>
    </div>
  );
}
