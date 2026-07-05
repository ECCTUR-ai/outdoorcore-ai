import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/design-system/Card';
import { Table, TableRow, TableCell } from '@/components/design-system/Table';
import { Badge } from '@/components/design-system/Badge';

export function Rezervasyonlar() {
  const list = [
    { id: 'R101', company: 'Acun Medya', space: 'TV8 Stadyum LED', dates: '01.07.2026 - 31.07.2026', total: '₺120.000', status: 'approved' },
    { id: 'R102', company: 'Trendyol Group', space: 'Levent Metro Dijital', dates: '10.07.2026 - 20.07.2026', total: '₺85.000', status: 'pending' },
    { id: 'R103', company: 'Türk Hava Yolları', space: 'İstanbul Airport Gelen Yolcu', dates: '01.07.2026 - 31.12.2026', total: '₺1.500.000', status: 'approved' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Rezervasyon Talepleri & Takvimi</CardTitle>
            <CardDescription>Açık hava mecraları için gelen rezervasyon tarih aralıkları ve onay süreçleri.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Table headers={['Rezervasyon No', 'Firma', 'Kiralanan Reklam Alanı', 'Kiralama Tarihleri', 'Bütçe Tutarı', 'Onay Durumu']}>
            {list.map(r => (
              <TableRow key={r.id}>
                <TableCell className="font-extrabold text-slate-400">#{r.id}</TableCell>
                <TableCell className="font-extrabold text-slate-800 dark:text-slate-200">{r.company}</TableCell>
                <TableCell>{r.space}</TableCell>
                <TableCell className="font-semibold text-slate-600 dark:text-slate-450">{r.dates}</TableCell>
                <TableCell className="font-extrabold text-slate-800 dark:text-slate-200">{r.total}</TableCell>
                <TableCell>
                  {r.status === 'approved' ? (
                    <Badge variant="success">Rezervasyon Onaylandı</Badge>
                  ) : (
                    <Badge variant="warning">Onay Bekliyor</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
