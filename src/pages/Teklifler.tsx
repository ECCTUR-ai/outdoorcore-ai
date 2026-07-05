import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/design-system/Card';
import { Table, TableRow, TableCell } from '@/components/design-system/Table';
import { Badge } from '@/components/design-system/Badge';

export function Teklifler() {
  const list = [
    { id: 'T201', client: 'Acun Medya', rep: 'Kaan Demir', date: '06.07.2026', amount: '₺120.000', status: 'Görüşülüyor' },
    { id: 'T202', client: 'Trendyol', rep: 'Derya Çelik', date: '05.07.2026', amount: '₺380.000', status: 'Onaylandı' },
    { id: 'T203', client: 'Getir', rep: 'Berna Kaya', date: '02.07.2026', amount: '₺85.000', status: 'Reddedildi' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Teklifler & Satış Süreçleri</CardTitle>
            <CardDescription>Müşterilere sunulan reklam alanı kiralama teklifleri ve güncel revizyon durumları.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Table headers={['Teklif No', 'Reklamveren / Temsilci', 'Oluşturma Tarihi', 'Öngörülen Bütçe', 'Süreç Durumu']}>
            {list.map(t => (
              <TableRow key={t.id}>
                <TableCell className="font-extrabold text-slate-400">#{t.id}</TableCell>
                <TableCell className="font-extrabold text-slate-800 dark:text-slate-200">
                  {t.client}
                  <span className="text-[9.5px] text-slate-400 block font-normal">{t.rep}</span>
                </TableCell>
                <TableCell>{t.date}</TableCell>
                <TableCell className="font-black text-slate-800 dark:text-slate-200">{t.amount}</TableCell>
                <TableCell>
                  {t.status === 'Onaylandı' && <Badge variant="success">Teklif Onaylandı</Badge>}
                  {t.status === 'Görüşülüyor' && <Badge variant="warning">Revizyon Bekliyor</Badge>}
                  {t.status === 'Reddedildi' && <Badge variant="danger">İptal Edildi</Badge>}
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
