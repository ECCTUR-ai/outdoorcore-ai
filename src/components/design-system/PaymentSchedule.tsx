import React from 'react';
import { Table, TableRow, TableCell } from './Table';
import { Badge } from './Badge';
import { Coins } from 'lucide-react';

interface PaymentScheduleProps {
  contracts?: any[];
}

export function PaymentSchedule({ contracts = [] }: PaymentScheduleProps) {
  const schedules: any[] = [];
  
  contracts.forEach((c: any) => {
    if (c.installments && Array.isArray(c.installments)) {
      c.installments.forEach((inst: any) => {
        schedules.push({
          client: c.clientName,
          due: inst.dueDate,
          amount: inst.amount,
          status: inst.status,
          no: inst.installment
        });
      });
    }
  });

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left select-none">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
        <Coins size={13} />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Müşteri Ödeme Takvimi</h4>
      </div>

      {schedules.length > 0 ? (
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
      ) : (
        <div className="text-center py-8 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
          Mevcut ödeme planı bulunmuyor.
        </div>
      )}
    </div>
  );
}
