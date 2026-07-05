import React from 'react';
import { Table, TableRow, TableCell } from './Table';
import { Badge } from './Badge';
import { FileText, Send } from 'lucide-react';
import { Button } from './Button';

export function InvoiceTable() {
  const invoices = [
    { no: 'INV-2025-00101', client: 'Samsung Electronics', date: '01 Mar 2025', amount: '₺30.000.000', status: 'Ödendi' },
    { no: 'INV-2025-00112', client: 'Turkcell', date: '15 Oca 2025', amount: '₺35.000.000', status: 'Ödendi' },
    { no: 'INV-2025-00124', client: 'Samsung Electronics', date: '15 May 2025', amount: '₺30.000.000', status: 'Ödendi' },
    { no: 'INV-2025-00130', client: 'Turkcell', date: '15 Nis 2025', amount: '₺30.000.000', status: 'Gecikti' },
    { no: 'INV-2025-00142', client: 'Mercedes-Benz Türkiye', date: '15 Haz 2025', amount: '₺7.900.000', status: 'Bekliyor' },
    { no: 'INV-2025-00155', client: 'Pegasus Airlines', date: '10 Tem 2025', amount: '₺2.250.000', status: 'Bekliyor' }
  ];

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left overflow-x-auto select-none">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 select-none text-slate-400">
        <FileText size={13} />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Son Kesilen Faturalar</h4>
      </div>

      <Table headers={['Fatura No', 'Firma', 'Tarih', 'Tutar', 'Durum', 'Aksiyonlar']}>
        {invoices.map((inv, idx) => (
          <TableRow key={idx}>
            <TableCell className="font-black text-white">{inv.no}</TableCell>
            <TableCell className="font-extrabold text-slate-200">{inv.client}</TableCell>
            <TableCell className="font-semibold text-slate-400">{inv.date}</TableCell>
            <TableCell className="font-black text-white">{inv.amount}</TableCell>
            <TableCell>
              <Badge variant={inv.status === 'Ödendi' ? 'success' : inv.status === 'Gecikti' ? 'danger' : 'warning'}>
                {inv.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-1.5 items-center">
                <Button variant="outline" size="xs" onClick={() => alert('Fatura PDF görüntüleniyor...')}>
                  PDF
                </Button>
                <Button variant="minimal" size="xs" leftIcon={<Send size={10} />} onClick={() => alert('Fatura maili müşteriye gönderildi.')}>
                  Gönder
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  );
}
