import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/design-system/Card';
import { Button } from '@/components/design-system/Button';
import { Image, Upload, Trash } from 'lucide-react';

export function MedyaKutuphanesi() {
  const assets = [
    { id: '1', name: 'thy_global_lansman.jpg', size: '4.2 MB', dimension: '1920x1080', date: '04.07.2026' },
    { id: '2', name: 'trendyol_yaz_indirimi.png', size: '2.8 MB', dimension: '1200x800', date: '05.07.2026' },
    { id: '3', name: 'getir_10dk_banner.mp4', size: '18.5 MB', dimension: '1080x1920', date: '02.07.2026' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-slate-950 p-4 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm">
        <span className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest pl-2">Dosya Kütüphanesi</span>
        <Button variant="primary" size="sm" leftIcon={<Upload size={13} />} onClick={() => alert('Dosya yükleme mockup eylemi!')}>
          Medya Yükle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {assets.map(asset => (
          <Card key={asset.id} className="group relative overflow-hidden">
            <div className="h-32 bg-slate-100 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-850 flex items-center justify-center text-slate-400">
              <Image size={32} />
            </div>
            <CardContent className="pt-4">
              <h5 className="text-[11.5px] font-extrabold text-slate-800 dark:text-slate-200 truncate">{asset.name}</h5>
              <div className="flex justify-between text-[10px] font-bold text-slate-450 dark:text-slate-500 mt-2">
                <span>{asset.size}</span>
                <span>{asset.dimension}</span>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-850 mt-3 pt-3 flex justify-between items-center">
                <span className="text-[9px] text-slate-400 font-bold">{asset.date}</span>
                <Button variant="danger" size="xs" leftIcon={<Trash size={10} />} onClick={() => alert('Mockup silme eylemi!')}>
                  Sil
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
