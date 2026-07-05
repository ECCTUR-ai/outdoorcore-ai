import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/design-system/Card';
import { Table, TableRow, TableCell } from '@/components/design-system/Table';
import { Badge } from '@/components/design-system/Badge';

export function Sozlesmeler() {
  const list = [
    { id: 'CTR-90', client: 'Türk Hava Yolları', range: '01.07.2026 - 31.12.2026', type: 'Havalimanı Kiralama', amount: '₺1.500.000', status: 'Yürürlükte' },
    { id: 'CTR-89', client: 'Trendyol Group', range: '15.06.2026 - 15.09.2026', type: 'Billboard Ağı', amount: '₺540.000', status: 'Yürürlükte' },
    { id: 'CTR-88', client: 'Acun Medya', range: '01.01.2026 - 30.06.2026', type: 'Stadyum LED', amount: '₺720.000', status: 'Süresi Doldu' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Sözleşmeler & Hukuki Takip</CardTitle>
            <CardDescription>Onaylanan reklam alanları kiralama sözleşmelerinin yürürlük ve bitiş süreleri.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Table headers={['Sözleşme Kodu', 'Müşteri Firma', 'Süreç Dönemi', 'Sözleşme Kapsamı', 'Toplam Tutar', 'Yürürlük Durumu']}>
            {list.map(c => (
              <TableRow key={c.id}>
                <TableCell className="font-extrabold text-slate-400">{c.id}</TableCell>
                <TableCell className="font-extrabold text-slate-800 dark:text-slate-200">{c.client}</TableCell>
                <TableCell className="font-semibold">{c.range}</TableCell>
                <TableCell>{c.type}</TableCell>
                <TableCell className="font-black text-slate-800 dark:text-slate-200">{c.amount}</TableCell>
                <TableCell>
                  <Badge variant={c.status === 'Yürürlükte' ? 'success' : 'muted'}>
                    {c.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
