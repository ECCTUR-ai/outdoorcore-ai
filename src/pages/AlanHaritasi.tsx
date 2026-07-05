import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/design-system/Card';
import { Badge } from '@/components/design-system/Badge';
import { MapPin } from 'lucide-react';

export function AlanHaritasi() {
  const pins = [
    { id: 1, name: 'Levent Metro Billboard A', top: '35%', left: '42%', status: 'Dolu' },
    { id: 2, name: 'Maslak Büyükdere LED Ekran', top: '22%', left: '55%', status: 'Boş' },
    { id: 3, name: 'Zorlu Center AVM Raket B2', top: '55%', left: '38%', status: 'Boş' },
    { id: 4, name: 'Kadıköy Rıhtım Megaboard', top: '78%', left: '65%', status: 'Dolu' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Reklam Alan Haritası (Coğrafi Konumlar)</CardTitle>
            <CardDescription>Aktif ve müsait reklam alanlarının şehir haritası üzerindeki dağılımı.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-[500px] rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 flex items-center justify-center overflow-hidden">
            {/* Mock Map Vector Grid Background */}
            <div className="absolute inset-0 premium-grid-bg opacity-35" />
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/10 to-blue-50/5 opacity-40" />

            <div className="text-center space-y-2 select-none z-10">
              <span className="text-3xl">🗺️</span>
              <h4 className="text-xs font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest leading-none">İnteraktif Şehir Haritası Mockup</h4>
              <p className="text-[10px] text-slate-450 dark:text-slate-600 font-bold">Harita entegrasyonu (Google Maps / Mapbox) 2. Sprint\'te aktif edilecektir.</p>
            </div>

            {/* Pins */}
            {pins.map(pin => (
              <div 
                key={pin.id}
                style={{ top: pin.top, left: pin.left }}
                className="absolute flex flex-col items-center group cursor-pointer z-20"
              >
                <div className={`p-2 rounded-full shadow-md border animate-bounce ${
                  pin.status === 'Dolu' 
                    ? 'bg-rose-50 border-rose-200 text-rose-600' 
                    : 'bg-emerald-50 border-emerald-200 text-emerald-600'
                }`}>
                  <MapPin size={14} />
                </div>
                {/* Popup Tooltip */}
                <div className="absolute top-10 scale-0 group-hover:scale-100 transition-all origin-top bg-slate-900 dark:bg-slate-800 text-white rounded-xl p-2 shadow-lg w-40 text-left border border-slate-750 z-30">
                  <span className="text-[9.5px] font-bold block leading-normal">{pin.name}</span>
                  <Badge variant={pin.status === 'Dolu' ? 'danger' : 'success'} className="mt-1 scale-[0.8] origin-left">
                    {pin.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
