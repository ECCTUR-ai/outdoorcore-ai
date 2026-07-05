import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/design-system/Card';
import { Button } from '@/components/design-system/Button';
import { Label, Input, Switch, FormGroup } from '@/components/design-system/Form';

export function Ayarlar() {
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms] = useState(false);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Platform Ayarları</CardTitle>
            <CardDescription>OutdoorCore sistem genel yapılandırma paneli.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-left">
          <FormGroup>
            <Label>Şirket Resmi Unvanı</Label>
            <Input defaultValue="OutdoorCore AI Medya Ltd. Şti." />
          </FormGroup>
          <FormGroup>
            <Label>Destek E-Posta Adresi</Label>
            <Input defaultValue="destek@outdoorcore.ai" />
          </FormGroup>
          <div className="border-t border-slate-100 dark:border-slate-850 pt-4 space-y-3">
            <Label>Bildirim Kanalları</Label>
            <Switch 
              label="E-Posta Bildirimleri" 
              checked={notifyEmail} 
              onChange={() => setNotifyEmail(!notifyEmail)} 
            />
            <Switch 
              label="SMS Bildirimleri" 
              checked={notifySms} 
              onChange={() => setNotifySms(!notifySms)} 
            />
          </div>
          <div className="border-t border-slate-100 dark:border-slate-850 pt-4 flex justify-end">
            <Button variant="primary" size="sm" onClick={() => alert('Ayarlar başarıyla kaydedildi mockup!')}>
              Ayarları Kaydet
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
