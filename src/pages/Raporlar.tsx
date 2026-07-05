import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/design-system/Card';
import { AreaChart } from '@/components/charts/AreaChart';
import { BarChart } from '@/components/charts/BarChart';

export function Raporlar() {
  const revenueData = [
    { date: 'Nis', hasilat: 450 },
    { date: 'May', hasilat: 580 },
    { date: 'Haz', hasilat: 820 },
    { date: 'Tem', hasilat: 1200 }
  ];

  const categoryShare = [
    { name: 'Billboard', deger: 45 },
    { name: 'Dijital Ekran', deger: 35 },
    { name: 'Havalimanı', deger: 15 },
    { name: 'AVM Raket', deger: 10 }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Gelir & Satış Performansı</CardTitle>
            <CardDescription>Aylara göre toplam reklam kira cirosu (₺ bin).</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <AreaChart 
            data={revenueData} 
            xKey="date" 
            yKey="hasilat" 
            color="#10b981"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Ürün Grubu Payları</CardTitle>
            <CardDescription>Mecraların toplam gelir içerisindeki yüzdesel dilimi.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <BarChart 
            data={categoryShare} 
            xKey="name" 
            yKey="deger" 
            color="#4f46e5"
          />
        </CardContent>
      </Card>
    </div>
  );
}
