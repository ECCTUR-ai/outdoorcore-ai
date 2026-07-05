import React from 'react';
import { reportsData, BrandReportItem } from '@/data/reports';
import { Table, TableRow, TableCell } from './Table';
import { Award, Sparkles } from 'lucide-react';

function BrandRowLogo({ item }: { item: BrandReportItem }) {
  const [imageError, setImageError] = React.useState(false);
  if (item.logoUrl && !imageError) {
    return (
      <img 
        src={item.logoUrl} 
        onError={() => setImageError(true)} 
        className="w-7 h-7 rounded-lg object-contain border border-white/5 bg-slate-950 p-0.5 shrink-0" 
        alt={item.name} 
      />
    );
  }
  return (
    <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-[10px] flex items-center justify-center shrink-0">
      {item.logo}
    </div>
  );
}

export function BrandPerformanceTable() {
  const sorted = [...reportsData.brandPerformance].sort((a, b) => b.aiScore - a.aiScore);

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left overflow-x-auto select-none">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 select-none text-slate-400">
        <Award size={13} />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">En Değerli Reklam Veren Firmalar</h4>
      </div>

      <Table headers={['Firma', 'Toplam Ciro', 'Aktif Kampanya', 'Toplam Alan', 'AI Skoru']}>
        {sorted.map((item, idx) => (
          <TableRow key={idx}>
            <TableCell>
              <div className="flex items-center gap-2.5">
                <BrandRowLogo item={item} />
                <span className="font-extrabold text-white">{item.name}</span>
              </div>
            </TableCell>
            <TableCell className="font-black text-white">{item.totalRevenue}</TableCell>
            <TableCell className="font-semibold text-slate-400">{item.activeCampaigns} adet</TableCell>
            <TableCell className="font-bold text-slate-350">{item.totalSpaces} alan</TableCell>
            <TableCell>
              <span className="px-2 py-0.5 rounded-lg border border-blue-500/10 bg-blue-500/10 text-blue-400 text-[9.5px] font-black inline-flex items-center gap-1">
                <Sparkles size={9} />
                {item.aiScore}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  );
}
