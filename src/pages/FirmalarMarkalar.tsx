import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/design-system/Card';
import { Table, TableRow, TableCell } from '@/components/design-system/Table';
import { Avatar } from '@/components/design-system/Avatar';
import { Badge } from '@/components/design-system/Badge';

export function FirmalarMarkalar() {
  const clients = [
    { id: '1', name: 'Acun Medya Grubu', segment: 'Medya & Yayıncılık', rep: 'Kaan Demir', status: 'Aktif', spending: '₺750.000' },
    { id: '2', name: 'Trendyol Alışveriş', segment: 'E-Ticaret', rep: 'Derya Çelik', status: 'Aktif', spending: '₺1.200.000' },
    { id: '3', name: 'Türk Hava Yolları', segment: 'Havayolu Ulaşım', rep: 'Murat Yıldız', status: 'Aktif', spending: '₺2.400.000' },
    { id: '4', name: 'Getir Teknoloji', segment: 'Hızlı Teslimat', rep: 'Berna Kaya', status: 'Pasif', spending: '₺320.000' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Müşteri Firmalar & Markalar Portalı</CardTitle>
            <CardDescription>Açık hava reklam kampanyası kiralayan partner ajans ve kurumsal müşterilerin listesi.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Table headers={['Logo', 'Firma Adı', 'Sektör', 'Temsilci Yetkili', 'Durum', 'Toplam Hacim']}>
            {clients.map(c => (
              <TableRow key={c.id}>
                <TableCell>
                  <Avatar name={c.name} size="sm" />
                </TableCell>
                <TableCell className="font-extrabold text-slate-800 dark:text-slate-200">{c.name}</TableCell>
                <TableCell>{c.segment}</TableCell>
                <TableCell className="font-semibold">{c.rep}</TableCell>
                <TableCell>
                  <Badge variant={c.status === 'Aktif' ? 'success' : 'muted'}>
                    {c.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-extrabold text-slate-800 dark:text-slate-200">{c.spending}</TableCell>
              </TableRow>
            ))}
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
