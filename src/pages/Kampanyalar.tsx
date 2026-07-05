import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/design-system/Card';
import { Table, TableRow, TableCell } from '@/components/design-system/Table';
import { Badge } from '@/components/design-system/Badge';

export function Kampanyalar() {
  const list = [
    { id: 'C901', name: 'Yaz Fırsatları Kampanyası', brand: 'Trendyol', spacesCount: '15 Billboard', reach: '2.4M Kişi', status: 'Aktif' },
    { id: 'C902', name: 'Global Ulaşım Duyurusu', brand: 'Türk Hava Yolları', spacesCount: '4 Airport LED', reach: '5.2M Kişi', status: 'Aktif' },
    { id: 'C903', name: '10 Dakikada Kapıda Lansman', brand: 'Getir', spacesCount: '12 AVM Raket', reach: '800K Kişi', status: 'Beklemede' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Aktif & Planlanan Reklam Kampanyaları</CardTitle>
            <CardDescription>Açık havada canlı gösterimde olan veya yayına girmeyi bekleyen kampanyalar.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Table headers={['Kampanya Kodu', 'Kampanya Adı', 'Reklamveren Marka', 'Kullanılan Alan Sayısı', 'Tahmini Erişim', 'Durum']}>
            {list.map(c => (
              <TableRow key={c.id}>
                <TableCell className="font-extrabold text-slate-400">#{c.id}</TableCell>
                <TableCell className="font-extrabold text-slate-800 dark:text-slate-200">{c.name}</TableCell>
                <TableCell className="font-semibold">{c.brand}</TableCell>
                <TableCell>{c.spacesCount}</TableCell>
                <TableCell className="font-bold text-slate-600 dark:text-slate-450">{c.reach}</TableCell>
                <TableCell>
                  <Badge variant={c.status === 'Aktif' ? 'success' : 'warning'}>
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
