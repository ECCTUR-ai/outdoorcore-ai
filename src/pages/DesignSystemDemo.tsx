import React, { useState } from 'react';
import { Button } from '@/components/design-system/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/design-system/Card';
import { Badge } from '@/components/design-system/Badge';
import { Avatar } from '@/components/design-system/Avatar';
import { Label, Input, Select, Textarea, Switch, FormGroup } from '@/components/design-system/Form';
import { Modal } from '@/components/design-system/Modal';
import { EmptyState } from '@/components/design-system/EmptyState';
import { Skeleton, CardSkeleton } from '@/components/design-system/Skeleton';
import { Notification } from '@/components/design-system/Notification';
import { Sparkles, Trash, Check, AlertCircle, Plus, Terminal } from 'lucide-react';

export function DesignSystemDemo() {
  const [modalOpen, setModalOpen] = useState(false);
  const [switchState, setSwitchState] = useState(true);
  const [inputValue, setInputValue] = useState('Premium SaaS');

  return (
    <div className="space-y-8 pb-12">
      {/* Introduction */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50/50 dark:from-slate-900 dark:to-slate-950 p-6 rounded-3xl border border-indigo-100/50 dark:border-slate-850">
        <h2 className="text-sm font-black text-indigo-950 dark:text-indigo-200 uppercase tracking-widest flex items-center gap-2 m-0">
          <Sparkles className="text-indigo-600 animate-pulse" size={16} />
          OutdoorCore Design System
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-2 leading-relaxed max-w-3xl">
          Linear, Stripe ve Apple arayüzlerinden ilham alan, son derece ferah, minimal ve yüksek kontrastlı Enterprise SaaS tasarım kütüphanesi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Buttons Library */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Button Library</CardTitle>
              <CardDescription>Farklı varyant, boyut ve ikon kombinasyonlarına sahip butonlar.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2.5">
              <Button variant="primary" size="sm">Primary Sm</Button>
              <Button variant="primary">Primary Md</Button>
              <Button variant="primary" size="lg">Primary Lg</Button>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Button variant="secondary" size="sm">Secondary</Button>
              <Button variant="outline" size="sm">Outline</Button>
              <Button variant="minimal" size="sm">Minimal</Button>
              <Button variant="ghost" size="sm">Ghost</Button>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Button variant="success" size="sm" leftIcon={<Check size={12} />}>Başarılı</Button>
              <Button variant="danger" size="sm" leftIcon={<Trash size={12} />}>Tehlikeli</Button>
              <Button variant="outline" size="sm" loading>Yükleniyor</Button>
            </div>
          </CardContent>
        </Card>

        {/* Badges Library */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Badge Library</CardTitle>
              <CardDescription>Durum ve etiket tanımlayıcı mikro etiketler.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">Primary Soft</Badge>
              <Badge variant="success">Success Soft</Badge>
              <Badge variant="warning">Warning Soft</Badge>
              <Badge variant="danger">Danger Soft</Badge>
              <Badge variant="info">Info Soft</Badge>
              <Badge variant="muted">Muted Soft</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary" styleType="solid">Primary Solid</Badge>
              <Badge variant="success" styleType="solid">Success Solid</Badge>
              <Badge variant="warning" styleType="solid">Warning Solid</Badge>
              <Badge variant="danger" styleType="solid">Danger Solid</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary" styleType="outline">Primary Outline</Badge>
              <Badge variant="success" styleType="outline">Success Outline</Badge>
              <Badge variant="muted" styleType="outline">Muted Outline</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Form Controls */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Form Library</CardTitle>
              <CardDescription>Temiz tipografi ve iç gölgelere sahip form kontrolleri.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormGroup>
              <Label>Arama Girişi (Left Icon)</Label>
              <Input 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)}
                leftIcon={<Terminal size={13} className="text-slate-400" />}
                placeholder="Metin yazın..."
              />
            </FormGroup>
            <FormGroup>
              <Label>Seçim Kutusu</Label>
              <Select>
                <option value="1">Billboard Reklamı</option>
                <option value="2">AVM Dijital Ekran</option>
                <option value="3">Havalimanı Panosu</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Detay Açıklaması</Label>
              <Textarea placeholder="Ekran lokasyonu hakkında notlar yazın..." />
            </FormGroup>
            <Switch 
              label="E-Posta Bildirimlerini Aktif Et" 
              checked={switchState}
              onChange={() => setSwitchState(!switchState)}
            />
          </CardContent>
        </Card>

        {/* Avatars & Skeletons */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Avatar & Skeletons</CardTitle>
              <CardDescription>Yüklenme durumları ve kullanıcı monogramları.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-3">
              <Avatar name="Acun Medya" size="xs" status="online" />
              <Avatar name="Trendyol Group" size="sm" status="away" />
              <Avatar name="THY Air" size="md" status="busy" />
              <Avatar name="Outdoor Core" size="lg" status="offline" />
            </div>
            <div className="border-t border-slate-100 dark:border-slate-850 pt-4 space-y-3">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Yüklenme İskeleti (Skeleton)</span>
              <div className="space-y-2">
                <Skeleton variant="text" className="w-1/2 h-3" />
                <Skeleton variant="text" className="w-3/4 h-2.5" />
                <Skeleton variant="rect" className="h-12 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals & Banners */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Modals & Notifications</CardTitle>
              <CardDescription>Kullanıcı etkileşimli pencereler ve bilgi kutuları.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3 pb-4 border-b border-slate-100 dark:border-slate-850">
              <Button onClick={() => setModalOpen(true)}>
                Etkileşimli Modalı Aç
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <Notification 
                title="Bilgi Mesajı" 
                description="Haziran ayı doluluk verileri başarıyla analiz edildi." 
                type="info" 
              />
              <Notification 
                title="İşlem Başarılı" 
                description="Yeni kampanya teklifi onaylandı." 
                type="success" 
              />
              <Notification 
                title="Kritik Uyarı" 
                description="3 sözleşmenin vadesi dolmak üzere." 
                type="alert" 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Empty States Sandbox */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Empty States Showcase</CardTitle>
            <CardDescription>Veri bulunmadığında gösterilen premium tasarım kartı.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <EmptyState 
            icon={<AlertCircle size={20} />} 
            title="Rezervasyon Kaydı Bulunmuyor" 
            description="Seçilen tarihler arasında henüz aktif bir reklam rezervasyonu eklenmemiş." 
            actionText="Rezervasyon Ekle"
            onAction={() => alert('Rezervasyon oluşturma modalı tetiklenecek.')}
          />
        </CardContent>
      </Card>

      {/* Custom Modal Demo */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Yeni Reklam Alanı Ekle"
        footerActions={
          <>
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>Vazgeç</Button>
            <Button variant="primary" size="sm" onClick={() => {
              alert('Başarıyla eklendi mockup!');
              setModalOpen(false);
            }}>Ekle</Button>
          </>
        }
      >
        <div className="space-y-4 text-left">
          <p className="m-0 text-slate-500 font-semibold mb-3">Bu form üzerinden yeni bir billboard veya dijital ekran reklam alanı tanımlayabilirsiniz.</p>
          <FormGroup>
            <Label>Lokasyon Adı</Label>
            <Input placeholder="Örn: Maslak Metro Çıkışı Billboard A" />
          </FormGroup>
          <FormGroup>
            <Label>Ekran Türü</Label>
            <Select>
              <option value="bb">Billboard</option>
              <option value="db">Dijital Billboard</option>
              <option value="ab">AVM Raket</option>
            </Select>
          </FormGroup>
        </div>
      </Modal>
    </div>
  );
}
