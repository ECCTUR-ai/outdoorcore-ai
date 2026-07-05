import React from 'react';
import { Table, TableRow, TableCell } from './Table';
import { Badge } from './Badge';
import { Coins } from 'lucide-react';

export function PaymentSchedule() {
  const schedules = [
    { client: 'Samsung Electronics', due: '15 Tem 2025', amount: '₺2.500.000', status: 'Bekliyor', no: '3. Taksit' },
    { client: 'Turkcell', due: '15 Nis 2025', amount: '₺3.100.000', status: 'Gecikti', no: '2. Taksit' },
    { client: 'Pegasus Airlines', due: '15 Tem 2025', amount: '₺2.250.000', status: 'Bekliyor', no: 'Kapanış' },
    { client: 'Türk Hava Yolları', due: '01 Haz 2025', amount: '₺6.000.000', status: 'Ödendi', no: '2. Taksit' }
  ];

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 select-none text-slate-400">
        <Coins size={13} />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Müşteri Ödeme Takvimi</h4>
      </div>

      <Table headers={['Firma', 'Vade Bilgisi', 'Ödeme No', 'Tutar', 'Durum']}>
        {schedules.map((sc, idx) => (
          <TableRow key={idx}>
            <TableCell className="font-black text-white">{sc.client}</TableCell>
            <TableCell className="font-semibold text-slate-400">{sc.due}</TableCell>
            <TableCell className="font-bold text-slate-350">{sc.no}</TableCell>
            <TableCell className="font-black text-white">{sc.amount}</TableCell>
            <TableCell>
              <Badge variant={sc.status === 'Ödendi' ? 'success' : sc.status === 'Gecikti' ? 'danger' : 'warning'}>
                {sc.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  );
}
