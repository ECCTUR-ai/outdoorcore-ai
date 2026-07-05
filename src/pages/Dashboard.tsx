import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/design-system/Card';
import { Badge } from '@/components/design-system/Badge';
import { Button } from '@/components/design-system/Button';
import { Table, TableRow, TableCell } from '@/components/design-system/Table';
import { AreaChart } from '@/components/charts/AreaChart';
import { BarChart } from '@/components/charts/BarChart';
import { useApp } from '@/context/AppContext';
import { 
  Sparkles, 
  TrendingUp, 
  MapPin, 
  CalendarRange, 
  FileSignature, 
  Coins, 
  ArrowUpRight,
  TrendingDown,
  Activity
} from 'lucide-react';

export function Dashboard() {
  const { setCurrentRoute } = useApp();

  // Mock charts dataset
  const occupancyHistory = [
    { date: 'Oca', doluluk: 65 },
    { date: 'Şub', doluluk: 68 },
    { date: 'Mar', doluluk: 72 },
    { date: 'Nis', doluluk: 75 },
    { date: 'May', doluluk: 80 },
    { date: 'Haz', doluluk: 88 },
    { date: 'Tem', doluluk: 92 }
  ];

  const categoryShare = [
    { name: 'Billboard', deger: 45 },
    { name: 'Dijital Ekran', deger: 35 },
    { name: 'Havalimanı', deger: 15 },
    { name: 'AVM Raket', deger: 10 }
  ];

  const recentReservations = [
    { id: '1', company: 'Acun Medya', space: 'TV8 Stadyum LED', type: 'Stadyum LED', date: '06.07.2026', revenue: '₺120.000', status: 'approved' },
    { id: '2', company: 'Trendyol Group', space: 'Levent Metro Dijital', type: 'Dijital Billboard', date: '05.07.2026', revenue: '₺85.000', status: 'pending' },
    { id: '3', company: 'Türk Hava Yolları', space: 'İstanbul Airport Pano', type: 'Havalimanı Pano', date: '04.07.2026', revenue: '₺250.000', status: 'approved' },
    { id: '4', company: 'Getir Hizmetleri', space: 'Maslak Billboard 3', type: 'Billboard', date: '02.07.2026', revenue: '₺45.000', status: 'archived' }
  ];

  return (
    <div className="space-y-6">
      {/* AI Summary Banner */}
      <div className="bg-white border border-slate-100 dark:border-slate-850 p-6 rounded-3xl shadow-sm shadow-slate-100/50 relative overflow-hidden">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-4 mb-4">
          <span className="text-yellow-500 text-base select-none">⚡</span>
          <h2 className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider">AI Yönetici Özeti</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <span className="text-lg leading-none mt-0.5">📈</span>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block">Doluluk Artışı</span>
              <p className="text-[11px] font-semibold text-slate-650 dark:text-slate-400 leading-relaxed">Temmuz doluluk oranı %92 ile rekor seviyede seyrediyor.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <span className="text-lg leading-none mt-0.5">🔴</span>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block">Sözleşme Uyarısı</span>
              <p className="text-[11px] font-semibold text-slate-650 dark:text-slate-400 leading-relaxed">Türk Hava Yolları sözleşmesi 12 gün içinde bitiyor.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <span className="text-lg leading-none mt-0.5">⚠️</span>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block">Teklif Talebi</span>
              <p className="text-[11px] font-semibold text-slate-650 dark:text-slate-400 leading-relaxed">Acun Medya, Levent Billboard için fiyat teklifi bekliyor.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <span className="text-lg leading-none mt-0.5">✨</span>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block">AI Tavsiyesi</span>
              <p className="text-[11px] font-semibold text-slate-650 dark:text-slate-400 leading-relaxed">Maslak bölgesindeki billboard fiyatlarında %8 artış yapılabilir.</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { title: 'Reklam Alanı', val: '248', desc: 'Lokasyon adeti', color: 'bg-blue-50 text-blue-600', icon: <MapPin size={16} /> },
          { title: 'Doluluk Oranı', val: '%92.4', desc: 'Temmuz doluluk', color: 'bg-emerald-50 text-emerald-600', icon: <TrendingUp size={16} /> },
          { title: 'Bekleyen Teklif', val: '12', desc: 'Değerlendirmede', color: 'bg-amber-50 text-amber-600', icon: <CalendarRange size={16} /> },
          { title: 'Aktif Sözleşme', val: '45', desc: 'İmzalanan', color: 'bg-purple-50 text-purple-600', icon: <FileSignature size={16} /> },
          { title: 'Toplam Ciro', val: '₺1.2M', desc: 'Bu ay', color: 'bg-slate-50 text-slate-600', icon: <Coins size={16} /> },
          { title: 'AI Kampanya Skoru', val: '8.8 / 10', desc: 'Kampanya verimi', color: 'bg-violet-50 text-indigo-650', icon: <Sparkles size={16} /> }
        ].map(kpi => (
          <div key={kpi.title} className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 p-5 rounded-3xl shadow-sm flex flex-col justify-between">
            <span className="text-slate-400 dark:text-slate-550 text-[10px] font-bold uppercase tracking-wider">{kpi.title}</span>
            <div className="flex items-center justify-between mt-3.5">
              <div className="space-y-0.5">
                <span className="text-base font-black text-slate-900 dark:text-slate-200 leading-none block">{kpi.val}</span>
                <span className="text-[9px] text-slate-400 dark:text-slate-550 font-semibold">{kpi.desc}</span>
              </div>
              <div className={`p-2 rounded-xl ${kpi.color} shrink-0 border border-slate-100 dark:border-slate-800`}>
                {kpi.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8">
          <CardHeader>
            <div>
              <CardTitle>Reklam Doluluk Oranı Performansı</CardTitle>
              <CardDescription>2026 yılı aylık doluluk oranı gelişim tablosu.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <AreaChart 
              data={occupancyHistory} 
              xKey="date" 
              yKey="doluluk" 
              color="#4f46e5"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-4">
          <CardHeader>
            <div>
              <CardTitle>Ekran Dağılım Payı</CardTitle>
              <CardDescription>Cihaz / Reklam türlerine göre gelir payları.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <BarChart 
              data={categoryShare} 
              xKey="name" 
              yKey="deger" 
              color="#3b82f6"
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Reservations Table */}
      <Card>
        <CardHeader className="border-0 mb-0 pb-0">
          <div className="flex justify-between items-center w-full">
            <div>
              <CardTitle>Son Rezervasyonlar & Teklifler</CardTitle>
              <CardDescription>OutdoorCore üzerinden son 48 saatte alınan talepler.</CardDescription>
            </div>
            <Button variant="minimal" size="sm" rightIcon={<ArrowUpRight size={12} />} onClick={() => setCurrentRoute('rezervasyonlar')}>
              Tüm Rezervasyonları Gör
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <Table headers={['Firma / Müşteri', 'Lokasyon Alanı', 'Reklam Türü', 'Tarih', 'Bütçe', 'Durum']}>
            {recentReservations.map(row => (
              <TableRow key={row.id}>
                <TableCell className="font-extrabold text-slate-800 dark:text-slate-200">{row.company}</TableCell>
                <TableCell>{row.space}</TableCell>
                <TableCell>
                  <span className="text-[10px] bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-150/30 text-slate-655 font-bold">
                    {row.type}
                  </span>
                </TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell className="font-extrabold text-slate-800 dark:text-slate-200">{row.revenue}</TableCell>
                <TableCell>
                  {row.status === 'approved' && <Badge variant="success">Onaylandı</Badge>}
                  {row.status === 'pending' && <Badge variant="warning">Bekliyor</Badge>}
                  {row.status === 'archived' && <Badge variant="muted">Reddedildi</Badge>}
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
