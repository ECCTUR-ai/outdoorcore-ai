import React, { useState } from 'react';
import { 
  FileText, 
  Video, 
  Image as ImageIcon, 
  Layers, 
  Trash2, 
  Upload, 
  Download, 
  FolderOpen, 
  Search,
  Filter, 
  Tag, 
  Eye, 
  Clock, 
  Building2, 
  Megaphone,
  CheckCircle,
  AlertCircle,
  XCircle,
  Server,
  Sparkles,
  Info
} from 'lucide-react';
import { mediaAssets, MediaAsset } from '@/data/media';
import { companies } from '@/data/companies';
import { campaigns } from '@/data/campaigns';
import { EntityLink } from '@/components/design-system/EntityLink';
import { Badge } from '@/components/design-system/Badge';
import { Button } from '@/components/design-system/Button';
import { Table, TableRow, TableCell } from '@/components/design-system/Table';

export function MedyaKutuphanesi() {
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset>(mediaAssets[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('all');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('all');

  // KPI calculations
  const totalFiles = mediaAssets.length;
  const totalVideos = mediaAssets.filter(a => a.type === 'video').length;
  const totalImages = mediaAssets.filter(a => a.type === 'image').length;
  const pendingApprovals = mediaAssets.filter(a => a.status === 'Pending').length;
  const revisionApprovals = mediaAssets.filter(a => a.status === 'Revision').length;
  const totalStorage = "61.5 MB";

  // Filter list
  const filteredAssets = mediaAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          asset.aiTags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || asset.type === selectedType;
    const matchesCompany = selectedCompanyFilter === 'all' || asset.companyId === selectedCompanyFilter;
    const matchesTag = selectedTagFilter === 'all' || asset.aiTags.includes(selectedTagFilter);
    return matchesSearch && matchesType && matchesCompany && matchesTag;
  });

  // Extract all tags for filter list
  const allTags = Array.from(new Set(mediaAssets.flatMap(a => a.aiTags)));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <Badge variant="success" className="flex items-center gap-0.5"><CheckCircle size={9} /> Onaylandı</Badge>;
      case 'Pending':
        return <Badge variant="warning" className="flex items-center gap-0.5"><Clock size={9} /> Onay Bekliyor</Badge>;
      case 'Revision':
        return <Badge variant="danger" className="flex items-center gap-0.5"><AlertCircle size={9} /> Revize</Badge>;
      default:
        return <Badge variant="primary">{status}</Badge>;
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video size={20} className="text-blue-400" />;
      case 'image': return <ImageIcon size={20} className="text-emerald-450" />;
      case 'pdf': return <FileText size={20} className="text-purple-400" />;
      default: return <Layers size={20} className="text-slate-400" />;
    }
  };

  // Find linked objects labels
  const getCompanyName = (cid: string) => companies.find(c => c.id === cid)?.name || cid;
  const getCampaignName = (camid: string) => campaigns.find(c => c.id === camid)?.campaignName || camid;

  return (
    <div className="space-y-6 text-left select-none pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 p-5 rounded-3xl border border-white/5 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">Medya Kütüphanesi</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            Yapay zekâ etiketleme, otomatik revizyon takibi ve çoklu modül entegrasyonlu dijital varlık yönetim merkezi.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="xs" leftIcon={<FolderOpen size={10} />} onClick={() => alert('Toplu arşiv indiriliyor...')}>
            Paket İndir
          </Button>
          <Button variant="primary" size="xs" leftIcon={<Upload size={10} />} onClick={() => alert('Yeni kreatif dosya yükleme paneli açıldı.')}>
            Yeni Medya Yükle
          </Button>
        </div>
      </div>

      {/* KPI Cards row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="dark-glass-card border border-white/5 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Toplam Dosya</span>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-md font-black text-white">{totalFiles}</span>
            <span className="text-[8px] text-slate-500 font-bold">Adet</span>
          </div>
        </div>
        <div className="dark-glass-card border border-blue-500/10 p-4 rounded-2xl flex flex-col justify-between shadow-sm shadow-blue-500/5">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider text-blue-400">Toplam Video</span>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-md font-black text-white">{totalVideos}</span>
            <span className="text-[8px] text-blue-400 font-bold">MP4</span>
          </div>
        </div>
        <div className="dark-glass-card border border-emerald-500/10 p-4 rounded-2xl flex flex-col justify-between shadow-sm shadow-emerald-500/5">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider text-emerald-450">Toplam Görsel</span>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-md font-black text-white">{totalImages}</span>
            <span className="text-[8px] text-emerald-450 font-bold">PNG/JPG</span>
          </div>
        </div>
        <div className="dark-glass-card border border-amber-500/10 p-4 rounded-2xl flex flex-col justify-between shadow-sm shadow-amber-500/5">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider text-amber-400">Onay Bekleyen</span>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-md font-black text-white">{pendingApprovals}</span>
            <span className="text-[8px] text-amber-400 font-bold">Kreatif</span>
          </div>
        </div>
        <div className="dark-glass-card border border-rose-500/10 p-4 rounded-2xl flex flex-col justify-between shadow-sm shadow-rose-500/5">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider text-rose-450">Revize Bekleyen</span>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-md font-black text-white">{revisionApprovals}</span>
            <span className="text-[8px] text-rose-450 font-bold">Reddedilen</span>
          </div>
        </div>
        <div className="dark-glass-card border border-white/5 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Toplam Depolama</span>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-md font-black text-white">{totalStorage}</span>
            <span className="text-[8px] text-slate-500 font-bold">/ 500 GB</span>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sol Panel: Folders and Filters */}
        <div className="order-2 lg:order-none lg:col-span-3 space-y-5">
          <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
              <Filter size={12} />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Navigasyon & Filtreler</h4>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Varlık adı veya etiket ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#08111f]/60 border border-white/5 rounded-xl pl-9 pr-3 py-2 text-[10px] font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-slate-700"
              />
            </div>

            {/* File Types Filters */}
            <div className="space-y-1.5 text-left">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Dosya Türü</span>
              <div className="flex flex-col gap-1">
                {[
                  { label: 'Tüm Dosyalar', value: 'all' },
                  { label: 'Videolar (MP4)', value: 'video' },
                  { label: 'Görseller (PNG/JPG)', value: 'image' },
                  { label: 'Belgeler (PDF)', value: 'pdf' }
                ].map(t => (
                  <button
                    key={t.value}
                    onClick={() => setSelectedType(t.value)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[9.5px] font-bold uppercase transition-all cursor-pointer ${
                      selectedType === t.value 
                        ? 'bg-blue-600/10 border border-blue-500/20 text-blue-400' 
                        : 'text-slate-400 hover:text-white hover:bg-white/3'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Companies Filters */}
            <div className="space-y-1.5 text-left">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Firma Seç</span>
              <select
                value={selectedCompanyFilter}
                onChange={(e) => setSelectedCompanyFilter(e.target.value)}
                className="w-full bg-[#08111f]/60 border border-white/5 rounded-xl px-2.5 py-2 text-[9.5px] font-semibold text-slate-350 focus:outline-none"
              >
                <option value="all">TÜM FİRMALAR</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>
                ))}
              </select>
            </div>

            {/* AI Tags Cloud */}
            <div className="space-y-2 text-left">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={9} className="text-blue-400" />
                AI Akıllı Etiketler
              </span>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setSelectedTagFilter('all')}
                  className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wider cursor-pointer ${
                    selectedTagFilter === 'all'
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/25'
                      : 'bg-white/3 text-slate-400 border border-white/3 hover:text-white'
                  }`}
                >
                  HEPSİ
                </button>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTagFilter(tag)}
                    className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wider cursor-pointer ${
                      selectedTagFilter === tag
                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/25'
                        : 'bg-white/3 text-slate-400 border border-white/3 hover:text-white'
                    }`}
                  >
                    {tag.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Orta Alan: Asset Grid list */}
        <div className="order-1 lg:order-none lg:col-span-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAssets.map(asset => {
              const isSelected = selectedAsset.id === asset.id;
              return (
                <div
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className={`dark-glass-card border rounded-2xl overflow-hidden cursor-pointer duration-200 select-none group text-left ${
                    isSelected 
                      ? 'border-blue-500/35 bg-[#22314a]/10' 
                      : 'border-white/5 hover:border-slate-700 bg-slate-900/10'
                  }`}
                >
                  {/* File preview mockup box */}
                  <div className="h-32 bg-[#08111f]/60 relative flex items-center justify-center border-b border-white/5">
                    {getFileIcon(asset.type)}
                    <span className="absolute top-2.5 left-2.5 text-[7px] bg-slate-950/80 text-slate-400 px-1.5 py-0.2 rounded font-black uppercase tracking-wider">
                      {asset.version}
                    </span>
                    <span className="absolute top-2.5 right-2.5">
                      {getStatusBadge(asset.status)}
                    </span>
                    <span className="absolute bottom-2.5 left-2.5 text-[8px] font-black text-slate-500 uppercase">
                      {asset.resolution}
                    </span>
                  </div>

                  {/* Info footer */}
                  <div className="p-3.5 space-y-2">
                    <h5 className="text-[10px] font-black text-white truncate m-0">{asset.name}</h5>
                    <div className="flex justify-between items-center text-[8.5px] text-slate-500 font-bold uppercase">
                      <span>{asset.size}</span>
                      <span>{asset.uploadedDate}</span>
                    </div>

                    {/* AI Tags badge list */}
                    <div className="flex flex-wrap gap-1 pt-1.5 border-t border-white/3">
                      {asset.aiTags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-[7px] text-slate-450 bg-white/3 px-1 py-0.2 rounded font-black uppercase">
                          #{tag}
                        </span>
                      ))}
                      {asset.aiTags.length > 3 && (
                        <span className="text-[7px] text-blue-400 font-black">+{asset.aiTags.length - 3}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredAssets.length === 0 && (
              <div className="col-span-2 p-12 text-center border border-dashed border-white/5 rounded-2xl select-none">
                <span className="text-[10px] text-slate-550 font-bold uppercase tracking-wider">Filtrelere uygun kreatif dosya bulunamadı.</span>
              </div>
            )}
          </div>
        </div>

        {/* Sağ Panel: Selected details */}
        <div className="order-3 lg:order-none lg:col-span-3">
          <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left">
            <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
              <Info size={12} />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Dosya Ayrıntıları</h4>
            </div>

            {/* Thumbnail preview large */}
            <div className="h-36 bg-[#08111f]/60 rounded-xl flex flex-col justify-center items-center relative border border-white/5 select-none">
              {getFileIcon(selectedAsset.type)}
              <span className="text-[9px] font-black text-white mt-3 uppercase tracking-wider">{selectedAsset.id}</span>
              <span className="text-[7.5px] font-semibold text-slate-500 block truncate max-w-[85%] mt-1">{selectedAsset.name}</span>
              <span className="absolute top-2 right-2">
                {getStatusBadge(selectedAsset.status)}
              </span>
            </div>

            {/* Metadata references */}
            <div className="space-y-3.5 text-[9.5px]">
              <div className="flex justify-between items-center py-1.5 border-b border-white/3">
                <span className="text-slate-500 font-bold uppercase">Bağlı Firma</span>
                <EntityLink type="company" id={selectedAsset.companyId} label={getCompanyName(selectedAsset.companyId)} />
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-white/3">
                <span className="text-slate-500 font-bold uppercase">Kampanya</span>
                <EntityLink type="campaign" id={selectedAsset.campaignId} label={getCampaignName(selectedAsset.campaignId)} />
              </div>
              <div className="space-y-1.5">
                <span className="text-slate-500 font-bold uppercase block">Kullanıldığı Reklam Alanları</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAsset.spaceIds.map(sid => (
                    <EntityLink key={sid} type="space" id={sid} label={sid} />
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-white/3">
                <span className="text-slate-500 font-bold uppercase">Dosya Boyutu</span>
                <span className="text-white font-extrabold">{selectedAsset.size}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-white/3">
                <span className="text-slate-500 font-bold uppercase">Yükleyen Yetkili</span>
                <span className="text-white font-extrabold">{selectedAsset.uploadedBy}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-white/3">
                <span className="text-slate-500 font-bold uppercase">Son Güncelleme</span>
                <span className="text-white font-extrabold">{selectedAsset.uploadedDate}</span>
              </div>
            </div>

            {/* Versioning list */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="text-[8.5px] font-black text-slate-550 uppercase tracking-widest block">Versiyon Geçmişi</span>
              <div className="space-y-1.5">
                {selectedAsset.versionsList.map((ver, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 rounded bg-slate-950/20 border border-white/3 text-[8.5px]">
                    <div className="space-y-0.5">
                      <span className="text-white font-black">{ver.version}</span>
                      <span className="text-slate-500 block">{ver.date} - {ver.uploader}</span>
                    </div>
                    <button 
                      onClick={() => alert(`${ver.file} indiriliyor...`)}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <Download size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alt panel: Widgets row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Son Yüklenen Dosyalar */}
        <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
            <Clock size={13} />
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Son Yüklenen Kreatifler</h4>
          </div>
          <div className="space-y-3">
            {mediaAssets.slice(0, 3).map(asset => (
              <div key={asset.id} className="flex justify-between items-center text-[9.5px]">
                <div className="flex items-center gap-2">
                  {getFileIcon(asset.type)}
                  <div className="text-left space-y-0.5">
                    <span className="text-white font-extrabold block truncate max-w-[150px]">{asset.name}</span>
                    <span className="text-[7.5px] text-slate-500 block">{asset.uploadedDate} - {asset.uploadedBy}</span>
                  </div>
                </div>
                <Badge variant={asset.status === 'Approved' ? 'success' : 'warning'}>{asset.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* En Çok Kullanılan Kreatifler */}
        <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
            <Layers size={13} />
            <h4 className="text-xs font-black text-white uppercase tracking-wider">En Çok Kullanılan Kreatifler</h4>
          </div>
          <div className="space-y-3">
            {[
              { name: 'thy_global_miles_banner.mp4', count: '18 alan', conversion: '%98' },
              { name: 'samsung_galaxy_ai_intro.jpg', count: '14 alan', conversion: '%95' },
              { name: 'pegasus_yaz_rotalari.pdf', count: '8 alan', conversion: '%89' }
            ].map((kr, idx) => (
              <div key={idx} className="flex justify-between items-center text-[9.5px]">
                <div className="text-left space-y-0.5">
                  <span className="text-white font-extrabold block truncate max-w-[160px]">{kr.name}</span>
                  <span className="text-[7.5px] text-slate-500 block">Kullanım: {kr.count}</span>
                </div>
                <span className="text-emerald-450 font-black">{kr.conversion} başarı</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Dosya Önerileri */}
        <div className="dark-glass-card border border-blue-500/10 rounded-2xl p-5 space-y-4 shadow-sm shadow-blue-500/5">
          <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
            <Sparkles size={13} className="text-blue-400 animate-pulse" />
            <h4 className="text-xs font-black text-white uppercase tracking-wider text-blue-400">AI Dosya Önerileri</h4>
          </div>
          <div className="space-y-3">
            {[
              { message: 'Samsung lansmanı için MED-0002 nolu görselin v3 versiyonu bekleniyor.', time: 'Yarın' },
              { message: 'Turkcell festival afişi eksik boyut uyarısı: SG-021 check-in LED boyutu yüklenmedi.', time: 'Acil' },
              { message: 'Mercedes video kreatif süresi LED limitini 4 saniye aşıyor.', time: 'İncele' }
            ].map((tip, idx) => (
              <div key={idx} className="text-left space-y-1 bg-white/2 border border-white/3 p-2 rounded-xl text-[9px]">
                <p className="text-slate-350 leading-relaxed font-semibold">{tip.message}</p>
                <div className="flex justify-between items-center text-[7.5px] font-black uppercase text-blue-400">
                  <span>Sistem Uyarısı</span>
                  <span>{tip.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
