import React from 'react';
import { AdvertisingSpace } from '@/data/advertisingSpaces';
import { SpaceStatusBadge } from './SpaceStatusBadge';
import { Label } from './Form';
import { Button } from './Button';
import { 
  Tv, 
  MapPin, 
  Ruler, 
  Users, 
  Eye, 
  Activity, 
  Cpu, 
  DownloadCloud, 
  FileText, 
  Bookmark, 
  Edit3,
  Trash2
} from 'lucide-react';
import { PermissionGate } from './PermissionGate';

interface AdvertisingSpaceDetailPanelProps {
  space: AdvertisingSpace;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

export function AdvertisingSpaceDetailPanel({ space, onEdit, onDelete }: AdvertisingSpaceDetailPanelProps) {
  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-5 text-left lg:sticky lg:top-[95px] lg:max-h-[calc(100vh-130px)] overflow-y-auto">
      {/* Visual Placeholder card box */}
      <div className="relative h-40 w-full bg-slate-900 rounded-xl overflow-hidden border border-white/5 shadow-inner">
        {space.image ? (
          <img 
            src={space.image} 
            alt={space.name} 
            className="w-full h-full object-cover opacity-85 hover:scale-105 duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500">
            <Tv size={36} className="opacity-40" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <SpaceStatusBadge status={space.status} />
        </div>
      </div>

      {/* Main title metadata */}
      <div className="space-y-1">
        <span className="text-[9px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/10 uppercase tracking-widest inline-block">
          {space.code}
        </span>
        <h4 className="text-sm font-black text-white leading-tight uppercase truncate">{space.name}</h4>
      </div>

      {/* Core details grid */}
      <div className="grid grid-cols-2 gap-3.5 border-t border-b border-white/5 py-3.5 text-[10.5px]">
        <div className="flex items-center gap-2 text-slate-400 font-semibold">
          <MapPin size={12} className="text-slate-500 shrink-0" />
          <span className="truncate">{space.location}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 font-semibold">
          <Tv size={12} className="text-slate-500 shrink-0" />
          <span>{space.type} Ekran</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 font-semibold">
          <Ruler size={12} className="text-slate-500 shrink-0" />
          <span>{space.size}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 font-semibold">
          <Users size={12} className="text-slate-500 shrink-0" />
          <span className="truncate">{space.traffic.toLocaleString('tr-TR')} / gün</span>
        </div>
        <div className="col-span-2 flex items-center gap-2 text-slate-400 font-semibold">
          <Eye size={12} className="text-slate-500 shrink-0" />
          <span>Görünürlük: <span className="text-white font-bold">{space.visibility}</span></span>
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="space-y-2 text-left">
        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 leading-none mb-2.5">
          <Cpu size={11} className="text-blue-400" />
          Teknik Bilgiler
        </h5>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-semibold text-slate-450">
          <div className="flex justify-between border-b border-white/3 pb-1">
            <span>Çözünürlük:</span>
            <span className="text-white font-bold">{space.resolution}</span>
          </div>
          <div className="flex justify-between border-b border-white/3 pb-1">
            <span>LED Pitch:</span>
            <span className="text-white font-bold">{space.pitch}</span>
          </div>
          <div className="flex justify-between border-b border-white/3 pb-1">
            <span>Çalışma Süresi:</span>
            <span className="text-white font-bold">{space.workingHours}</span>
          </div>
          <div className="flex justify-between border-b border-white/3 pb-1">
            <span>Ses Desteği:</span>
            <span className="text-white font-bold">{space.audio}</span>
          </div>
          <div className="flex justify-between border-b border-white/3 pb-1">
            <span>Güç Tüketimi:</span>
            <span className="text-white font-bold">{space.power}</span>
          </div>
          <div className="flex justify-between border-b border-white/3 pb-1">
            <span>Dosya Formatı:</span>
            <span className="text-white font-bold truncate max-w-[50px]">{space.fileFormat}</span>
          </div>
          <div className="flex justify-between border-b border-white/3 pb-1 col-span-2">
            <span>Dosya Boyutu:</span>
            <span className="text-white font-bold">{space.maxFileSize}</span>
          </div>
          <div className="flex justify-between border-b border-white/3 pb-1 col-span-2">
            <span>Güncelleme Döngüsü:</span>
            <span className="text-white font-bold">{space.updateInterval}</span>
          </div>
        </div>
      </div>

      {/* Rent / Client Info */}
      <div className="space-y-2 text-left pt-1 border-t border-white/5">
        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2.5">
          Kiralayan Bilgisi
        </h5>
        {space.client !== '-' ? (
          <div className="space-y-2 text-[10.5px] font-semibold text-slate-400">
            <div className="flex justify-between">
              <span>Müşteri Marka:</span>
              <span className="text-white font-bold">{space.client}</span>
            </div>
            {space.agency && (
              <div className="flex justify-between">
                <span>Medya Ajansı:</span>
                <span className="text-white font-bold">{space.agency}</span>
              </div>
            )}
            {space.startDate && space.endDate && (
              <div className="flex justify-between">
                <span>Kiralama Dönemi:</span>
                <span className="text-slate-300 font-bold">{space.startDate} - {space.endDate}</span>
              </div>
            )}
            {space.daysLeft && (
              <div className="flex justify-between items-center bg-rose-500/10 border border-rose-500/10 p-2 rounded-xl text-rose-450 mt-1">
                <span>Kalan Süre:</span>
                <span className="font-black uppercase tracking-wider text-[10px]">{space.daysLeft} gün kaldı</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider italic">Bu alan henüz kiralanmamış.</p>
        )}
      </div>

      {/* Performance Statistics */}
      <div className="space-y-2 text-left pt-1 border-t border-white/5">
        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 leading-none mb-2.5">
          <Activity size={11} className="text-emerald-400" />
          Performans Göstergeleri
        </h5>
        <div className="grid grid-cols-2 gap-3 text-[10.5px] font-bold">
          <div className="p-2.5 rounded-xl bg-white/3 border border-white/5 space-y-0.5">
            <span className="text-[9px] text-slate-500 block uppercase tracking-wider">Aylık Gösterim</span>
            <span className="text-slate-200 block text-xs font-black">{space.impressions}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/3 border border-white/5 space-y-0.5">
            <span className="text-[9px] text-slate-500 block uppercase tracking-wider">Ort. Bakış</span>
            <span className="text-slate-200 block text-xs font-black">{space.viewTime}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/3 border border-white/5 space-y-0.5">
            <span className="text-[9px] text-slate-500 block uppercase tracking-wider">Tahmini Erişim</span>
            <span className="text-slate-200 block text-xs font-black">{space.reach}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/3 border border-white/5 space-y-0.5">
            <span className="text-[9px] text-slate-500 block uppercase tracking-wider">Frekans</span>
            <span className="text-slate-200 block text-xs font-black">{space.frequency}</span>
          </div>
        </div>
      </div>

      {/* Bottom CTA Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5">
        <Button variant="primary" size="sm" leftIcon={<FileText size={12} />} onClick={() => alert(`${space.code} için teklif oluşturma modalı tetiklenecek.`)}>
          Teklif Oluştur
        </Button>
        <Button variant="outline" size="sm" leftIcon={<Bookmark size={12} />} onClick={() => alert(`${space.code} için rezervasyon modalı tetiklenecek.`)}>
          Rezerve Et
        </Button>
        
        <PermissionGate permission="spaces.update">
          <Button variant="minimal" size="sm" leftIcon={<Edit3 size={11} />} onClick={onEdit}>
            Düzenle
          </Button>
        </PermissionGate>
        
        <PermissionGate permission="spaces.delete">
          <Button variant="danger" size="sm" leftIcon={<Trash2 size={11} />} onClick={() => onDelete(space.id)}>
            Sil
          </Button>
        </PermissionGate>

        <Button variant="ghost" size="sm" leftIcon={<DownloadCloud size={12} />} className="col-span-2 text-[10px]" onClick={() => alert(`${space.code} Medya Kiti (.zip) indiriliyor...`)}>
          Medya Kit İndir
        </Button>
      </div>
    </div>
  );
}
