import React from 'react';
import { Eye, Users, RefreshCw } from 'lucide-react';

export function CampaignPerformanceHeatmap() {
  const rowChannels = ['LED Ekranlar', 'Megaboard', 'Lightbox Pano', 'Billboard', 'CIP Salon'];
  const columnsTerminals = ['Dış Hatlar Giden', 'Dış Hatlar Gelen', 'İç Hatlar Giden', 'İç Hatlar Gelen', 'CIP Terminal'];

  // Mock percentage performance values
  const matrix = [
    [98, 95, 96, 94, 99],
    [92, 88, 91, 85, 96],
    [94, 92, 90, 88, 95],
    [87, 85, 89, 82, 90],
    [99, 98, 97, 96, 99]
  ];

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left select-none overflow-x-auto">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 min-w-[500px]">
        <Eye size={13} className="text-slate-400" />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Yayın Kanalları Başarı Matrisi (Heatmap)</h4>
      </div>

      <div className="pt-2 min-w-[500px]">
        <div className="grid grid-cols-6 gap-2 text-center text-[8.5px] font-black text-slate-500 uppercase tracking-wider mb-2">
          <div>Kanal / Pano</div>
          {columnsTerminals.map(col => <div key={col}>{col}</div>)}
        </div>

        <div className="space-y-2">
          {rowChannels.map((row, rowIdx) => (
            <div key={row} className="grid grid-cols-6 gap-2 items-center text-center">
              <div className="text-[8.5px] font-black text-slate-400 text-left truncate leading-tight">{row}</div>
              {columnsTerminals.map((col, colIdx) => {
                const val = matrix[rowIdx][colIdx];
                let colorClass = 'bg-slate-800 text-slate-400';
                if (val >= 97) colorClass = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20';
                else if (val >= 92) colorClass = 'bg-blue-500/20 text-blue-400 border border-blue-500/20';
                else if (val >= 88) colorClass = 'bg-amber-500/20 text-amber-400 border border-amber-500/20';
                else colorClass = 'bg-rose-500/20 text-rose-450 border border-rose-500/20';

                return (
                  <div 
                    key={col} 
                    className={`p-2 rounded-xl text-[10px] font-black leading-none ${colorClass}`}
                  >
                    %{val}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
