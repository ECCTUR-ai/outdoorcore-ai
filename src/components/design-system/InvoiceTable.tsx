import React from 'react';
import { Table, TableRow, TableCell } from './Table';
import { Badge } from './Badge';
import { FileText, Send } from 'lucide-react';
import { Button } from './Button';
import { financeRepository } from '@/repositories';
import { EntityLink } from './EntityLink';

export function InvoiceTable() {
  const financeData = financeRepository.getFinanceDataSync();
  // Flatten all invoices from accounts with company info
  const allInvoices = financeData.accounts.flatMap(account => 
    account.invoices.map(inv => ({
      ...inv,
      companyId: account.companyId,
      client: account.name
    }))
  );

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left overflow-x-auto select-none">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 select-none text-slate-400">
        <FileText size={13} />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Son Kesilen Faturalar</h4>
      </div>

      <Table headers={['Fatura No', 'Firma', 'Tarih', 'Tutar', 'Durum', 'Aksiyonlar']}>
        {allInvoices.map((inv) => (
          <TableRow key={inv.id}>
            <TableCell className="font-black text-white">
              <EntityLink type="invoice" id={inv.id} label={inv.invoiceNo} />
            </TableCell>
            <TableCell className="font-extrabold text-slate-200">
              {inv.companyId ? (
                <EntityLink type="company" id={inv.companyId} label={inv.client} />
              ) : (
                inv.client
              )}
            </TableCell>
            <TableCell className="font-semibold text-slate-400">{inv.date}</TableCell>
            <TableCell className="font-black text-white">{inv.amount}</TableCell>
            <TableCell>
              <Badge variant={inv.status === 'Ödendi' ? 'success' : inv.status === 'Gecikti' ? 'danger' : 'warning'}>
                {inv.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-1.5 items-center">
                <Button variant="outline" size="xs" onClick={() => alert(`${inv.invoiceNo} PDF görüntleniyor...`)}>
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
