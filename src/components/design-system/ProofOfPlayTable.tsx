import React from 'react';
import { Table, TableRow, TableCell } from './Table';
import { Badge } from './Badge';
import { Play, CheckCircle2 } from 'lucide-react';

export function ProofOfPlayTable() {
  const popData = [
    { company: 'Samsung Electronics', screen: 'LED-001 - İç Hatlar Ana LED Wall', playsPerDay: 720, impressions: 14800, successRate: '99.9%', lastPlay: '21:03:15', status: 'Yayınlanıyor' },
    { company: 'Turkcell', screen: 'LED-001 - İç Hatlar Ana LED Wall', playsPerDay: 720, impressions: 14800, successRate: '100.0%', lastPlay: '21:03:30', status: 'Yayınlanıyor' },
    { company: 'Türk Hava Yolları', screen: 'LED-001 - İç Hatlar Ana LED Wall', playsPerDay: 720, impressions: 14800, successRate: '99.8%', lastPlay: '21:02:50', status: 'Yayınlanıyor' },
    { company: 'Mercedes-Benz Türkiye', screen: 'LED-002 - Dış Hatlar Duty Free LED', playsPerDay: 720, impressions: 11200, successRate: '100.0%', lastPlay: '21:03:02', status: 'Yayınlanıyor' },
    { company: 'Pegasus Airlines', screen: 'LED-003 - Check-in Video Wall', playsPerDay: 960, impressions: 12500, successRate: '99.7%', lastPlay: '21:01:45', status: 'Tamamlandı' },
    { company: 'LC Waikiki', screen: 'LED-004 - Bagaj Alanı LED', playsPerDay: 1440, impressions: 8400, successRate: '99.9%', lastPlay: '20:59:12', status: 'Tamamlandı' }
  ];

  return (
    <div className="space-y-4 text-left select-none">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
          <CheckCircle2 size={11} className="text-emerald-450" />
          Proof of Play (PoP) Donanım Log Doğrulaması
        </span>
        <Badge variant="primary" className="text-[7.5px] py-0 px-1 font-black bg-blue-500/10 text-blue-400 border-blue-500/20 uppercase">CANLI SENSOR BAĞLANTISI</Badge>
      </div>

      <Table headers={['Yayıncı Firma', 'LED Ünitesi', 'Günlük Yayın Adedi', 'Tahmini Gösterim', 'PoP Başarı Oranı', 'Son Oynatma', 'Durum']}>
        {popData.map((row, idx) => (
          <TableRow key={idx} className="border-b border-slate-100 dark:border-white/2 hover:bg-slate-50/50 dark:hover:bg-white/1">
            <TableCell className="font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
              <Play size={9} className="text-blue-500 fill-blue-500/30" />
              {row.company}
            </TableCell>
            <TableCell className="font-semibold text-slate-400">{row.screen}</TableCell>
            <TableCell className="font-black text-slate-700 dark:text-slate-350">{row.playsPerDay} Oynatma</TableCell>
            <TableCell className="font-semibold text-slate-400">{row.impressions.toLocaleString('tr-TR')} Kişi</TableCell>
            <TableCell className="font-black text-emerald-500">{row.successRate}</TableCell>
            <TableCell className="font-bold text-slate-500">{row.lastPlay}</TableCell>
            <TableCell>
              <Badge variant={row.status === 'Yayınlanıyor' ? 'success' : 'primary'} className="text-[7.5px] py-0.5 px-1.5 uppercase font-bold">
                {row.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  );
}
