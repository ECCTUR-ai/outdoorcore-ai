import React from 'react';
import { Badge } from './Badge';
import { AlertCircle } from 'lucide-react';

interface TimelineRow {
  spaceCode: string;
  spaceName: string;
  client: string;
  color: string;
  offset: string; // margin-left approximation
  width: string;  // width percentage approximation
  month: string;  // active month
  hasConflict?: boolean;
  budget: string;
  dates: string;
}

interface ReservationTimelineProps {
  selectedSpaceCode: string;
  onSelectSpaceCode: (code: string) => void;
}

export function ReservationTimeline({ selectedSpaceCode, onSelectSpaceCode }: ReservationTimelineProps) {
  const rows: TimelineRow[] = [
    { spaceCode: 'SG-001', spaceName: 'Giriş LED Ekran', client: 'Samsung Electronics', color: 'bg-emerald-500 glow-green', offset: 'ml-[5%]', width: 'w-[45%]', month: 'Haziran', budget: '₺2.45M', dates: '01 Haz - 30 Haz' },
    { spaceCode: 'SG-002', spaceName: 'Check-in Önü LED', client: 'Turkcell', color: 'bg-blue-500 glow-blue', offset: 'ml-[15%]', width: 'w-[20%]', month: 'Haziran', budget: '₺850K', dates: '05 Haz - 15 Haz' },
    { spaceCode: 'SG-003', spaceName: 'Pasaport Kontrol Üstü', client: 'Türk Hava Yolları', color: 'bg-purple-500 glow-purple', offset: 'ml-[5%]', width: 'w-[32%]', month: 'Haziran', budget: '₺1.95M', dates: '01 Haz - 20 Haz' },
    { spaceCode: 'SG-004', spaceName: 'Duty Free Yanı Lightbox', client: 'LC Waikiki', color: 'bg-amber-500 glow-yellow', offset: 'ml-[25%]', width: 'w-[10%]', month: 'Haziran', budget: '₺450K', dates: '15 Haz - 20 Haz' },
    { spaceCode: 'SG-005', spaceName: 'Yürüyen Bant Yanı LED', client: 'Mercedes-Benz Türkiye', color: 'bg-emerald-500 glow-green', offset: 'ml-[35%]', width: 'w-[28%]', month: 'Temmuz', budget: '₺1.60M', dates: '10 Tem - 25 Tem' },
    { spaceCode: 'SG-010', spaceName: 'Giden Yolcu Lobi LED', client: 'Pegasus Airlines', color: 'bg-blue-500 glow-blue', offset: 'ml-[5%]', width: 'w-[30%]', month: 'Temmuz', budget: '₺1.10M', dates: '01 Tem - 15 Tem' },
    { spaceCode: 'SG-012', spaceName: 'CIP Salonu Dijital Ekran', client: 'Garanti BBVA', color: 'bg-purple-500 glow-purple', offset: 'ml-[40%]', width: 'w-[35%]', month: 'Temmuz', budget: '₺980K', dates: '12 Tem - 30 Tem' },
    { spaceCode: 'SG-017', spaceName: 'Duty Free Merkez Lightbox', client: 'Akbank', color: 'bg-amber-500 glow-yellow', offset: 'ml-[5%] ', width: 'w-[30%]', month: 'Ağustos', budget: '₺1.25M', dates: '01 Ağu - 15 Ağu' },
    { spaceCode: 'SG-018', spaceName: 'Pasaport Çıkış Dijital Pano', client: 'Papara', color: 'bg-sky-500 glow-blue', offset: 'ml-[45%]', width: 'w-[30%]', month: 'Ağustos', budget: '₺850K', dates: '15 Ağu - 30 Ağu' },
    { spaceCode: 'SG-021', spaceName: 'Check-in Desk B Panel', client: 'Çakışma Riski (Samsung & Turkcell)', color: 'bg-rose-500 glow-red animate-pulse', offset: 'ml-[5%]', width: 'w-[60%]', month: 'Temmuz', hasConflict: true, budget: '₺3.20M', dates: '01 Tem - 30 Tem' },
    { spaceCode: 'SG-023', spaceName: 'Bagaj Alım Giriş LED', client: 'Hepsiburada', color: 'bg-indigo-500 glow-purple', offset: 'ml-[5%]', width: 'w-[25%]', month: 'Eylül', budget: '₺1.40M', dates: '01 Eyl - 15 Eyl' },
    { spaceCode: 'SG-045', spaceName: 'Duty Free Lobi LED', client: 'Çakışma Riski (Mercedes & THY)', color: 'bg-rose-500 glow-red animate-pulse', offset: 'ml-[20%]', width: 'w-[50%]', month: 'Ağustos', hasConflict: true, budget: '₺2.10M', dates: '05 Ağu - 31 Ağu' }
  ];

  const months = ['Haziran', 'Temmuz', 'Ağustos', 'Eylül'];

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left overflow-x-auto min-w-[700px]">
      <div className="flex justify-between items-center pb-2 border-b border-white/5 select-none">
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Rezervasyon Gantt Timeline</h4>
        <div className="flex items-center gap-3">
          {['Müsait', 'Rezervasyon', 'Çakışma Uyarısı'].map((l, i) => (
            <div key={l} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full border border-white/5 ${
                i === 0 ? 'bg-slate-700/30' : i === 1 ? 'bg-blue-500 glow-blue' : 'bg-rose-500 glow-red'
              }`} />
              <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider">{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Month column headers */}
      <div className="grid grid-cols-12 gap-2 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-white/3 pb-2 select-none">
        <div className="col-span-3 text-left pl-2">Reklam Ünitesi</div>
        <div className="col-span-9 grid grid-cols-4 gap-1">
          {months.map(m => (
            <div key={m} className="border-l border-white/5 py-1 bg-white/1 rounded">
              {m}
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Rows */}
      <div className="space-y-2">
        {rows.map(row => {
          const isSelected = selectedSpaceCode === row.spaceCode;
          return (
            <div
              key={row.spaceCode}
              onClick={() => onSelectSpaceCode(row.spaceCode)}
              className={`grid grid-cols-12 gap-2 items-center p-1.5 rounded-xl border transition-all cursor-pointer group ${
                isSelected 
                  ? 'bg-white/5 border-blue-500/30' 
                  : 'bg-transparent border-transparent hover:bg-white/2 hover:border-white/5'
              }`}
            >
              {/* Space Name Tag */}
              <div className="col-span-3 text-left pl-2">
                <span className="text-[10px] font-extrabold text-blue-400 block uppercase">#{row.spaceCode}</span>
                <span className="text-[10px] font-black text-white block truncate leading-tight mt-0.5">{row.spaceName}</span>
              </div>

              {/* Progress bars timeline track container */}
              <div className="col-span-9 h-7 rounded-xl bg-slate-900/40 relative flex items-center border border-white/3 overflow-hidden">
                {/* Visual grid ticks */}
                <div className="absolute inset-0 grid grid-cols-4 gap-0 pointer-events-none">
                  <div className="border-r border-white/3 h-full" />
                  <div className="border-r border-white/3 h-full" />
                  <div className="border-r border-white/3 h-full" />
                  <div className="h-full" />
                </div>

                {/* Reservation fill bar progress */}
                <div className={`h-4.5 rounded-lg flex items-center justify-between px-2 text-[8px] font-black text-white shrink-0 shadow-lg ${row.offset} ${row.width} ${row.color}`}>
                  <span className="truncate uppercase">{row.client}</span>
                  {row.hasConflict && (
                    <AlertCircle size={10} className="text-white animate-bounce shrink-0" />
                  )}

                  {/* Hover tooltip */}
                  <div className="absolute scale-0 group-hover:scale-100 transition-all origin-bottom bg-slate-950/95 border border-white/10 rounded-xl p-2.5 shadow-2xl w-48 text-left z-30 pointer-events-none bottom-8 left-1/2 -translate-x-1/2">
                    <span className="text-[9.5px] font-black text-white block uppercase tracking-wider">{row.spaceCode} | {row.spaceName}</span>
                    <div className="space-y-1.5 mt-1.5 pt-1.5 border-t border-white/5 text-[9.5px] font-semibold text-slate-400">
                      <div className="flex justify-between">
                        <span>Firma:</span>
                        <span className="text-white font-bold">{row.client}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bütçe:</span>
                        <span className="text-emerald-400 font-bold">{row.budget}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dönem:</span>
                        <span className="text-blue-400 font-bold">{row.dates}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
