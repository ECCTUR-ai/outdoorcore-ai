import React, { useState } from 'react';
import { Table, TableRow, TableCell } from './Table';
import { Badge } from './Badge';
import { FileText, Send } from 'lucide-react';
import { Button } from './Button';
import { financeRepository, activityLogRepository } from '@/repositories';
import { EntityLink } from './EntityLink';
import { Modal } from './Modal';
import { FileUpload } from './FileUpload';

export function InvoiceTable() {
  const [financeData, setFinanceData] = useState(() => financeRepository.getFinanceDataSync());
  const [activeInvoice, setActiveInvoice] = useState<any | null>(null);

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
                {(inv as any).pdfUrl ? (
                  <Button variant="outline" size="xs" onClick={() => window.open((inv as any).pdfUrl, '_blank')}>
                    PDF
                  </Button>
                ) : (
                  <Button variant="outline" size="xs" className="text-amber-500 border-amber-500/30 hover:bg-amber-500/10" onClick={() => setActiveInvoice(inv)}>
                    PDF Yükle
                  </Button>
                )}
                {(inv as any).pdfUrl && (
                  <button 
                    onClick={() => setActiveInvoice(inv)} 
                    className="p-1 text-slate-405 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer text-[10px]"
                    title="PDF Güncelle"
                  >
                    🔄
                  </button>
                )}
                <Button variant="minimal" size="xs" leftIcon={<Send size={10} />} onClick={() => alert('Fatura maili müşteriye gönderildi.')}>
                  Gönder
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </Table>

      {activeInvoice && (
        <Modal
          isOpen={!!activeInvoice}
          onClose={() => setActiveInvoice(null)}
          title={`Fatura PDF Yükle: ${activeInvoice.invoiceNo}`}
          size="md"
        >
          <div className="space-y-4 text-left p-1">
            <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
              <strong>{activeInvoice.client}</strong> firmasına ait <strong>{activeInvoice.invoiceNo}</strong> numaralı fatura veya ödeme dekontu belgesini PDF olarak yükleyin.
            </p>
            
            <FileUpload
              bucket="invoices"
              label="PDF Belgesi Seçin"
              allowedTypes={['application/pdf']}
              currentFileUrl={activeInvoice.pdfUrl}
              onUploadSuccess={async (url, path, file) => {
                try {
                  await financeRepository.updateInvoicePdf(activeInvoice.id, url);
                  
                  const fileName = file ? file.name : url.split('/').pop() || 'fatura.pdf';
                  await activityLogRepository.log(`Fatura PDF belgesi yüklendi: ${fileName} (#${activeInvoice.invoiceNo})`, 'invoice.file_uploaded');
                  
                  setFinanceData(financeRepository.getFinanceDataSync());
                  setActiveInvoice(null);
                } catch (e) {
                  console.error('Failed to save invoice PDF:', e);
                }
              }}
              onRemove={async () => {
                try {
                  await financeRepository.updateInvoicePdf(activeInvoice.id, '');
                  setFinanceData(financeRepository.getFinanceDataSync());
                  setActiveInvoice(null);
                } catch (e) {
                  console.error('Failed to clear invoice PDF:', e);
                }
              }}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
