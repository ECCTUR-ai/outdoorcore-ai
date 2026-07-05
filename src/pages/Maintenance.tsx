import React, { useState } from 'react';
import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  User, 
  MapPin, 
  QrCode, 
  Search, 
  Filter, 
  Activity, 
  Cpu, 
  ShieldAlert, 
  Calendar,
  Sparkles,
  Zap
} from 'lucide-react';
import { maintenanceTasks, maintenanceKpis, MaintenanceTask } from '@/data/maintenance';
import { advertisingSpaces } from '@/data/advertisingSpaces';
import { EntityLink } from '@/components/design-system/EntityLink';
import { Badge } from '@/components/design-system/Badge';
import { Button } from '@/components/design-system/Button';
import { Table, TableRow, TableCell } from '@/components/design-system/Table';

export function Maintenance() {
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask>(maintenanceTasks[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [terminalFilter, setTerminalFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filtering spaces on the left
  const filteredTasks = maintenanceTasks.filter(task => {
    const matchesSearch = task.spaceCode.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.issue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'Kritik': return <Badge variant="danger" className="animate-pulse flex items-center gap-0.5"><AlertTriangle size={9} /> KRİTİK</Badge>;
      case 'Yüksek': return <Badge variant="danger">YÜKSEK</Badge>;
      case 'Orta': return <Badge variant="warning">ORTA</Badge>;
      default: return <Badge variant="primary">DÜŞÜK</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Açık İş Emri': return <Badge variant="warning">AÇIK İŞ EMRİ</Badge>;
      case 'Parça Bekliyor': return <Badge variant="danger">PARÇA BEKLİYOR</Badge>;
      case 'Tamamlandı': return <Badge variant="success">TAMAMLANDI</Badge>;
      default: return <Badge variant="primary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 text-left select-none pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 p-5 rounded-3xl border border-white/5 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">Bakım & Arıza Yönetim Merkezi</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            Reklam üniteleri teknik operasyon takibi, SLA süreleri, yedek parça envanteri ve canlı arıza takip merkezi.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="xs" leftIcon={<QrCode size={10} />} onClick={() => alert('QR Kod tarayıcı kamerası başlatıldı...')}>
            Barkod Tara
          </Button>
          <Button variant="primary" size="xs" leftIcon={<Wrench size={10} />} onClick={() => alert('Yeni teknik iş emri oluşturma paneli açıldı.')}>
            Yeni İş Emri Aç
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="dark-glass-card border border-white/5 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Toplam Arıza</span>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-md font-black text-white">{maintenanceKpis.totalFaults}</span>
            <span className="text-[8px] text-slate-500 font-bold">Kayıt</span>
          </div>
        </div>
        <div className="dark-glass-card border border-amber-500/10 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider text-amber-400">Açık İş Emri</span>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-md font-black text-white">{maintenanceKpis.activeWorkOrders}</span>
            <span className="text-[8px] text-amber-400 font-bold">Aktif</span>
          </div>
        </div>
        <div className="dark-glass-card border border-blue-500/10 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider text-blue-400">Bugünkü Bakım</span>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-md font-black text-white">{maintenanceKpis.todaysMaintenance}</span>
            <span className="text-[8px] text-blue-400 font-bold">Ünite</span>
          </div>
        </div>
        <div className="dark-glass-card border border-rose-500/10 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider text-rose-450">Kritik Arıza</span>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-md font-black text-white">{maintenanceKpis.criticalIssues}</span>
            <span className="text-[8px] text-rose-450 font-bold">Acil</span>
          </div>
        </div>
        <div className="dark-glass-card border border-white/5 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Bekleyen Parça</span>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-md font-black text-white">{maintenanceKpis.pendingParts}</span>
            <span className="text-[8px] text-slate-500 font-bold">Öğe</span>
          </div>
        </div>
        <div className="dark-glass-card border border-emerald-500/10 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider text-emerald-450">SLA Performansı</span>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-md font-black text-white">{maintenanceKpis.slaPercentage}</span>
            <span className="text-[8px] text-emerald-450 font-bold">Tepki</span>
          </div>
        </div>
      </div>

      {/* Main dashboard splits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sol Panel: Adverting spaces status list */}
        <div className="order-2 lg:order-none lg:col-span-3 space-y-4">
          <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
              <Search size={12} />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Arızalı Üniteler</h4>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Kod veya arıza ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#08111f]/60 border border-white/5 rounded-xl pl-9 pr-3 py-2 text-[10px] font-semibold text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Status filters */}
            <div className="space-y-1.5 text-left">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Durum Filtresi</span>
              <div className="flex flex-col gap-1">
                {[
                  { label: 'TÜMÜ', value: 'all' },
                  { label: 'AÇIK İŞ EMRİ', value: 'Açık İş Emri' },
                  { label: 'PARÇA BEKLİYOR', value: 'Parça Bekliyor' },
                  { label: 'TAMAMLANDI', value: 'Tamamlandı' }
                ].map(sf => (
                  <button
                    key={sf.value}
                    onClick={() => setStatusFilter(sf.value)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all cursor-pointer ${
                      statusFilter === sf.value 
                        ? 'bg-blue-600/10 border border-blue-500/20 text-blue-400' 
                        : 'text-slate-400 hover:text-white hover:bg-white/3'
                    }`}
                  >
                    {sf.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Orta Panel: Active Maintenance Cards */}
        <div className="order-1 lg:order-none lg:col-span-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTasks.map(task => {
              const isSelected = selectedTask.id === task.id;
              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className={`dark-glass-card border rounded-2xl p-4.5 cursor-pointer duration-200 select-none text-left space-y-3 ${
                    isSelected 
                      ? 'border-blue-500/35 bg-[#22314a]/10' 
                      : 'border-white/5 hover:border-slate-700 bg-slate-900/10'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-white uppercase tracking-wider">
                      Cihaz: {task.spaceCode}
                    </span>
                    <div className="flex flex-col items-end gap-1.5">
                      {getUrgencyBadge(task.urgency)}
                      {getStatusBadge(task.status)}
                    </div>
                  </div>

                  <p className="text-[10px] font-semibold text-slate-350 leading-relaxed truncate-2-lines min-h-[30px]">
                    {task.issue}
                  </p>

                  <div className="pt-2.5 border-t border-white/3 flex items-center justify-between text-[8px] text-slate-500 font-bold uppercase">
                    <div className="flex items-center gap-1.5">
                      <User size={10} className="text-blue-400" />
                      <span>{task.assignedTechnician.name.split(' ')[0]}</span>
                    </div>
                    <span>{task.scheduledDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sağ Panel: Maintenance task details view */}
        <div className="order-3 lg:order-none lg:col-span-3">
          <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left">
            <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
              <Activity size={12} />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">İş Emri Detayları</h4>
            </div>

            <div className="h-32 bg-[#08111f]/60 rounded-xl border border-white/5 flex flex-col justify-center items-center relative select-none">
              <QrCode size={40} className="text-slate-400" />
              <span className="text-[8px] font-black text-slate-500 mt-2 tracking-widest">{selectedTask.qrCode}</span>
              <span className="absolute top-2.5 right-2.5">
                {getUrgencyBadge(selectedTask.urgency)}
              </span>
            </div>

            <div className="space-y-3.5 text-[9.5px]">
              <div className="flex justify-between items-center py-1 border-b border-white/3">
                <span className="text-slate-500 font-bold uppercase">İş Emri ID</span>
                <span className="text-white font-extrabold">{selectedTask.id}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/3">
                <span className="text-slate-500 font-bold uppercase">Reklam Alanı</span>
                <EntityLink type="space" id={selectedTask.spaceId} label={selectedTask.spaceCode} />
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/3">
                <span className="text-slate-500 font-bold uppercase">Planlanan Tarih</span>
                <span className="text-white font-extrabold">{selectedTask.scheduledDate}</span>
              </div>
              {selectedTask.completionDate && (
                <div className="flex justify-between items-center py-1 border-b border-white/3">
                  <span className="text-slate-500 font-bold uppercase">Kapanış Tarihi</span>
                  <span className="text-emerald-450 font-extrabold">{selectedTask.completionDate}</span>
                </div>
              )}
              <div className="space-y-1">
                <span className="text-slate-500 font-bold uppercase block">Görevli Teknik Ekip</span>
                <div className="p-2.5 rounded bg-white/2 border border-white/3 space-y-1">
                  <span className="text-white font-extrabold block">{selectedTask.assignedTechnician.name}</span>
                  <span className="text-slate-500 block text-[8px]">{selectedTask.assignedTechnician.phone}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <span className="text-slate-500 font-bold uppercase block">Değişecek / Değişen Parçalar</span>
                <div className="flex flex-wrap gap-1">
                  {selectedTask.replacedParts.map((part, idx) => (
                    <span key={idx} className="bg-slate-800 text-slate-350 text-[8px] px-2 py-0.5 rounded font-bold">
                      {part}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Risk Analysis panel */}
            <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/10 space-y-2.5">
              <div className="flex items-center gap-1.5 text-indigo-400">
                <Sparkles size={11} className="animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-wider">AI Risk & Güvenilirlik Analizi</span>
              </div>
              <div className="flex justify-between items-center text-[9px]">
                <span className="text-slate-400 font-semibold">Gecikme/SLA Aşım Riski</span>
                <span className={`font-black ${
                  selectedTask.aiRiskScore > 75 ? 'text-rose-450' : 
                  selectedTask.aiRiskScore > 40 ? 'text-amber-450' : 'text-emerald-450'
                }`}>
                  %{selectedTask.aiRiskScore}
                </span>
              </div>
              <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    selectedTask.aiRiskScore > 75 ? 'bg-rose-500' : 
                    selectedTask.aiRiskScore > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} 
                  style={{ width: `${selectedTask.aiRiskScore}%` }} 
                />
              </div>
              <p className="text-[8px] text-slate-500 leading-normal font-semibold m-0">
                {selectedTask.aiRiskScore > 75 
                  ? 'Kritik yedek parça temini ve teknisyen yoğunluğu nedeniyle SLA aşım riski yüksektir.' 
                  : 'Arıza süreci normal seyrindedir. SLA süre limitleri içerisinde kalması bekleniyor.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alt panel: charts & dashboards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SLA Grafikleri / Timeline */}
        <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
            <Activity size={13} />
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Canlı SLA Yanıt Süreleri</h4>
          </div>
          <div className="space-y-3">
            {[
              { zone: 'İç Hatlar LED', avg: '32 dk', status: 'SLA Uyumlu' },
              { zone: 'Dış Hatlar LED', avg: '48 dk', status: 'SLA Uyumlu' },
              { zone: 'Check-in Salonu', avg: '110 dk', status: 'Riskli Alan' }
            ].map((sla, idx) => (
              <div key={idx} className="flex justify-between items-center text-[9.5px]">
                <div className="text-left space-y-0.5">
                  <span className="text-white font-extrabold block">{sla.zone}</span>
                  <span className="text-[7.5px] text-slate-500 block">Ortalama Yanıt: {sla.avg}</span>
                </div>
                <Badge variant={sla.status === 'SLA Uyumlu' ? 'success' : 'warning'}>{sla.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Teknik Ekip Durumu */}
        <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
            <User size={13} />
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Saha Teknik Kadrosu</h4>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Ahmet Kaya', role: 'Kıdemli Tekniker', load: '3 Açık İş', status: 'Saha Aktif' },
              { name: 'Mehmet Demir', role: 'Teknisyen', load: '1 Açık İş', status: 'Saha Aktif' },
              { name: 'Hakan Şahin', role: 'Elektrik Müh.', load: '2 Bekleyen Parça', status: 'Nöbetçi Ofis' }
            ].map((tech, idx) => (
              <div key={idx} className="flex justify-between items-center text-[9.5px]">
                <div className="text-left space-y-0.5">
                  <span className="text-white font-extrabold block">{tech.name}</span>
                  <span className="text-[7.5px] text-slate-500 block">{tech.role} | {tech.load}</span>
                </div>
                <span className="text-blue-400 font-bold text-[8.5px] uppercase tracking-wide">{tech.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Arıza Heatmap list */}
        <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
            <Cpu size={13} />
            <h4 className="text-xs font-black text-white uppercase tracking-wider">En Çok Arıza Yapan Donanımlar</h4>
          </div>
          <div className="space-y-3">
            {[
              { component: 'Meanwell LRS Güç Kaynakları', count: '6 arıza', rate: 'Yüksek Risk' },
              { component: 'P2.5 LED Alıcı Kartları (Receiver)', count: '4 arıza', rate: 'Orta Risk' },
              { component: 'HDMI Sinyal Kablo Konnektörleri', count: '3 arıza', rate: 'Düşük Risk' }
            ].map((hw, idx) => (
              <div key={idx} className="flex justify-between items-center text-[9.5px]">
                <div className="text-left space-y-0.5">
                  <span className="text-white font-extrabold block">{hw.component}</span>
                  <span className="text-[7.5px] text-slate-500 block">Son 30 gün: {hw.count}</span>
                </div>
                <span className={`font-black ${hw.rate === 'Yüksek Risk' ? 'text-rose-450' : 'text-slate-450'}`}>
                  {hw.rate}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
