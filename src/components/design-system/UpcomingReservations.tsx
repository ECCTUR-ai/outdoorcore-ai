import React from 'react';
import { Reservation } from '@/data/reservations';
import { Table, TableRow, TableCell } from './Table';
import { Badge } from './Badge';

interface UpcomingReservationsProps {
  reservations: Reservation[];
  onSelect: (code: string) => void;
}

export function UpcomingReservations({ reservations, onSelect }: UpcomingReservationsProps) {
  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-3.5 text-left">
      <div className="flex justify-between items-center pb-2 border-b border-white/5 select-none">
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Yaklaşan Rezervasyon Planları</h4>
        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Sisteme kayıtlı ilk 10 planlama</span>
      </div>

      <Table headers={['Firma / Müşteri', 'Reklam Ünitesi', 'Lokasyon', 'Başlangıç', 'Bitiş', 'Durum', 'Süre', 'İşlem']}>
        {reservations.map(res => (
          <TableRow 
            key={res.id}
            onClick={() => onSelect(res.spaceCode)}
            className="cursor-pointer"
          >
            <TableCell className="font-black text-white">{res.clientName}</TableCell>
            <TableCell className="font-extrabold text-blue-400">#{res.spaceCode}</TableCell>
            <TableCell>{res.location}</TableCell>
            <TableCell className="font-semibold text-slate-350">{res.startDate}</TableCell>
            <TableCell className="font-semibold text-slate-350">{res.endDate}</TableCell>
            <TableCell>
              <Badge variant={res.status === 'Aktif' ? 'success' : 'primary'}>
                {res.status}
              </Badge>
            </TableCell>
            <TableCell className="font-bold text-slate-400">{res.durationDays} Gün</TableCell>
            <TableCell>
              <span className="text-[10px] text-blue-400 font-black hover:underline uppercase tracking-wider">Detay</span>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  );
}
