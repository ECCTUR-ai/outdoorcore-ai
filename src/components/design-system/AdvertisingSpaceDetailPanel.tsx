import React, { useState } from 'react';
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
  Trash2,
  Calendar,
  Sparkles,
  TrendingUp,
  Image as ImageIcon,
  Plus
} from 'lucide-react';
import { PermissionGate } from './PermissionGate';

interface AdvertisingSpaceDetailPanelProps {
  space: AdvertisingSpace;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

export function AdvertisingSpaceDetailPanel({ space, onEdit, onDelete }: AdvertisingSpaceDetailPanelProps) {
  const tabs = [
    { key: 'general', label: 'Genel Bilgi' },
    { key: 'photos', label: 'Fotoğraflar' },
    { key: 'reservations', label: 'Rezervasyonlar' },
    { key: 'campaigns', label: 'Kampanyalar' },
    { key: 'contracts', label: 'Sözleşmeler' },
    { key: 'technical', label: 'Teknik Bilgiler' },
    { key: 'revenue', label: 'Gelir Geçmişi' },
    { key: 'ai', label: 'AI Analizi' }
  ] as const;

  const [activeTab, setActiveTab] = useState<typeof tabs[number]['key']>('general');

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-5 text-left lg:sticky lg:top-[95px] lg:max-h-[calc(100vh-130px)] overflow-y-auto">
      {/* Visual Header Banner */}
      <div className="relative h-32 w-full bg-slate-900 rounded-xl overflow-hidden border border-white/5 shadow-inner select-none">
        {space.image ? (
          <img 
            src={space.image} 
            alt={space.name} 
            className="w-full h-full object-cover opacity-80 hover:scale-105 duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500">
            <Tv size={32} className="opacity-40" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <SpaceStatusBadge status={space.status} />
        </div>
      </div>

      {/* Title block */}
      <div className="space-y-0.5 select-none">
        <span className="text-[8.5px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/10 uppercase tracking-widest inline-block leading-none">
          {space.code}
        </span>
        <h4 className="text-sm font-black text-white leading-tight uppercase truncate">{space.name}</h4>
      </div>

      {/* Tabs list navigation */}
      <div className="border-b border-white/5 flex gap-1 pb-px overflow-x-auto select-none no-scrollbar">
        {tabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-2 py-1.5 text-[8.5px] font-black uppercase tracking-wider transition-all duration-100 cursor-pointer border-b-2 shrink-0 ${
                isActive 
                  ? 'border-blue-500 text-white font-extrabold bg-white/1' 
                  : 'border-transparent text-slate-500 hover:text-slate-350'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="min-h-[160px] text-slate-300">
        {activeTab === 'general' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-[10.5px] border-b border-white/5 pb-3">
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin size={11} className="text-slate-500 shrink-0" />
                <span className="truncate">{space.location}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Tv size={11} className="text-slate-500 shrink-0" />
                <span>{space.type} Ekran</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Ruler size={11} className="text-slate-500 shrink-0" />
                <span>{space.size}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Users size={11} className="text-slate-500 shrink-0" />
                <span className="truncate">{space.traffic?.toLocaleString('tr-TR') || 0} / gün</span>
              </div>
            </div>

            <div className="space-y-2 text-[10px] text-slate-400">
              <div className="flex justify-between">
                <span>Görünürlük Endeksi:</span>
                <span className="text-white font-bold">{space.visibility || 'Yüksek'}</span>
              </div>
              <div className="flex justify-between">
                <span>Aylık Gösterim:</span>
                <span className="text-white font-bold">{space.impressions || '0'}</span>
              </div>
              <div className="flex justify-between">
                <span>Göz Teması Süresi:</span>
                <span className="text-white font-bold">{space.viewTime || '0 sn'}</span>
              </div>
              <div className="flex justify-between">
                <span>Tahmini Günlük Erişim:</span>
                <span className="text-white font-bold">{space.reach || '0'}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="grid grid-cols-2 gap-2 select-none">
            <div className="aspect-video rounded-xl bg-slate-900 border border-white/5 relative overflow-hidden flex items-center justify-center">
              {space.image ? (
                <img src={space.image} className="w-full h-full object-cover" alt="Main View" />
              ) : (
                <ImageIcon size={20} className="text-slate-600" />
              )}
              <span className="absolute bottom-1 left-1.5 text-[8px] bg-slate-950/80 px-1 rounded text-slate-400">Ana Görünüm</span>
            </div>
            <div className="aspect-video rounded-xl bg-slate-950 border border-white/5 border-dashed flex flex-col items-center justify-center text-slate-600 hover:text-slate-450 hover:bg-white/1 cursor-pointer">
              <Plus size={16} />
              <span className="text-[7.5px] font-black uppercase mt-1">Görsel Ekle</span>
            </div>
          </div>
        )}

        {activeTab === 'reservations' && (
          <div className="space-y-2 text-[10px] font-semibold text-slate-400">
            {space.client !== '-' ? (
              <div className="p-3 bg-white/3 border border-white/5 rounded-xl space-y-1.5">
                <div className="flex justify-between items-center text-white">
                  <span>Müşteri: {space.client}</span>
                  <span className="text-[8px] font-black uppercase text-blue-450 bg-blue-500/10 border border-blue-500/10 px-1.5 py-0.2 rounded">KESİN</span>
                </div>
                <div className="text-[9px] text-slate-500">
                  Rezervasyon Tarihi: {space.startDate} - {space.endDate}
                </div>
                {space.daysLeft && (
                  <div className="text-[9px] text-rose-455 font-black uppercase">
                    Yayın bitimine {space.daysLeft} gün kaldı.
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-white/1 border border-white/5 border-dashed rounded-xl text-center text-slate-500 italic">
                Aktif kesin rezervasyon kaydı bulunmuyor.
              </div>
            )}
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="space-y-2 text-[10px] font-semibold text-slate-400">
            {space.client !== '-' ? (
              <div className="p-3 bg-white/3 border border-white/5 rounded-xl space-y-1">
                <div className="text-white font-extrabold">{space.client} Yaz Kampanyası</div>
                <div>Ajans: {space.agency || 'Direkt Müşteri'}</div>
                <div>Yayın Kanalı: {space.type} Ağı</div>
              </div>
            ) : (
              <div className="p-4 bg-white/1 border border-white/5 border-dashed rounded-xl text-center text-slate-500 italic">
                Bu alanda aktif kampanya yayını bulunmuyor.
              </div>
            )}
          </div>
        )}

        {activeTab === 'contracts' && (
          <div className="space-y-2 text-[10px] font-semibold text-slate-400">
            {space.client !== '-' ? (
              <div className="p-3 bg-white/3 border border-white/5 rounded-xl space-y-2">
                <div className="flex justify-between text-white font-bold">
                  <span>Sözleşme No:</span>
                  <span className="text-blue-400 uppercase">CON-{space.code}</span>
                </div>
                <div className="flex justify-between">
                  <span>Aylık Fiyat:</span>
                  <span className="text-emerald-455 font-black">{space.price}</span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-white/1 border border-white/5 border-dashed rounded-xl text-center text-slate-500 italic">
                Bu alan için imzalanmış aktif sözleşme kaydı bulunmuyor.
              </div>
            )}
          </div>
        )}

        {activeTab === 'technical' && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-semibold text-slate-400 select-none">
            <div className="flex justify-between border-b border-white/3 pb-1">
              <span>Çözünürlük:</span>
              <span className="text-white font-bold">{space.resolution || 'HD'}</span>
            </div>
            <div className="flex justify-between border-b border-white/3 pb-1">
              <span>LED Pitch:</span>
              <span className="text-white font-bold">{space.pitch || '-'}</span>
            </div>
            <div className="flex justify-between border-b border-white/3 pb-1">
              <span>Çalışma Saati:</span>
              <span className="text-white font-bold">{space.workingHours || '24 Saat'}</span>
            </div>
            <div className="flex justify-between border-b border-white/3 pb-1">
              <span>Ses Desteği:</span>
              <span className="text-white font-bold">{space.audio || 'Yok'}</span>
            </div>
            <div className="flex justify-between border-b border-white/3 pb-1">
              <span>Güç:</span>
              <span className="text-white font-bold">{space.power || '-'}</span>
            </div>
            <div className="flex justify-between border-b border-white/3 pb-1">
              <span>Format:</span>
              <span className="text-white font-bold truncate max-w-[60px]">{space.fileFormat || 'MP4'}</span>
            </div>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="space-y-2 select-none">
            <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex justify-between items-center text-[10.5px]">
              <div className="space-y-0.5 text-left leading-none">
                <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Aylık Tahmini Gelir</span>
                <span className="text-white font-extrabold block mt-0.5">{space.price}</span>
              </div>
              <TrendingUp size={16} className="text-emerald-450" />
            </div>

            <div className="p-3.5 bg-white/3 border border-white/5 rounded-xl space-y-1.5 text-[9.5px]">
              <span className="block text-slate-400 font-bold uppercase tracking-wider text-[8px] mb-1">Geriye Dönük Ciro Hacmi</span>
              <div className="flex justify-between text-slate-450 border-b border-white/3 pb-1">
                <span>2024 Toplam Gelir:</span>
                <span className="text-white font-black">₺480,000</span>
              </div>
              <div className="flex justify-between text-slate-450 pb-0.5">
                <span>2025 Hedeflenen:</span>
                <span className="text-white font-black">₺600,000</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="p-3.5 bg-gradient-to-br from-blue-950/20 to-indigo-950/30 border border-blue-500/10 rounded-xl space-y-2 text-left select-none">
            <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1.5 leading-none">
              <Sparkles size={11} className="animate-pulse text-indigo-400" />
              AI Envanter & Loop Önerisi
            </span>
            <ul className="text-[9.5px] text-slate-450 space-y-1.5 pl-3.5 list-disc leading-normal font-semibold">
              <li>Mevcut trafik yoğunluğuna göre fiyatlandırma optimize edilebilir (%12 gelir artış potansiyeli).</li>
              <li>Ağırlıklı olarak iş seyahati yapan profil geçiş yapmakta; B2B reklam içerikleri yüksek dönüşüm alır.</li>
              <li>Doluluk oranı zayıf seyrediyorsa, çapraz satış paketlerine LED loop dahil edilmesi tavsiye edilir.</li>
            </ul>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-3.5 border-t border-white/5">
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
