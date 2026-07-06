import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from './Modal';
import { Label, Input, Select, Textarea, FormGroup } from './Form';
import { Button } from './Button';
import { Notification } from './Notification';
import { spaceSchema, SpaceFormData } from '@/utils/schemas';
import { zodResolver } from '@/utils/resolver';
import { spaceRepository } from '@/repositories';
import { AdvertisingSpace } from '@/data/advertisingSpaces';

interface AdvertisingSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (space: AdvertisingSpace) => void;
  space?: AdvertisingSpace; // If passed, we are editing
}

export function AdvertisingSpaceModal({ isOpen, onClose, onSuccess, space }: AdvertisingSpaceModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showTechSpecs, setShowTechSpecs] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<SpaceFormData>({
    resolver: zodResolver(spaceSchema),
    defaultValues: {
      code: '',
      name: '',
      location: '',
      terminal: '',
      floor: '',
      type: 'LED',
      size: '',
      traffic: 0,
      status: 'bos',
      price: '',
      visibility: 'Yüksek',
      resolution: '',
      pitch: '',
      workingHours: '',
      audio: 'Yok',
      power: '',
      fileFormat: '',
      maxFileSize: '',
      updateInterval: '',
      image: '',
      notes: ''
    }
  });

  useEffect(() => {
    if (isOpen) {
      setSubmitError(null);
      setSubmitSuccess(false);
      if (space) {
        reset({
          code: space.code,
          name: space.name,
          location: space.location,
          terminal: space.terminal || '',
          floor: space.floor || '',
          type: space.type,
          size: space.size,
          traffic: space.traffic,
          status: space.status,
          price: space.price,
          visibility: space.visibility,
          resolution: space.resolution || '',
          pitch: space.pitch || '',
          workingHours: space.workingHours || '',
          audio: space.audio || 'Yok',
          power: space.power || '',
          fileFormat: space.fileFormat || '',
          maxFileSize: space.maxFileSize || '',
          updateInterval: space.updateInterval || '',
          image: space.image || '',
          notes: space.notes || ''
        });
      } else {
        reset({
          code: '',
          name: '',
          location: '',
          terminal: '',
          floor: '',
          type: 'LED',
          size: '',
          traffic: 0,
          status: 'bos',
          price: '',
          visibility: 'Yüksek',
          resolution: '',
          pitch: '',
          workingHours: '',
          audio: 'Yok',
          power: '',
          fileFormat: '',
          maxFileSize: '',
          updateInterval: '',
          image: '',
          notes: ''
        });
      }
    }
  }, [isOpen, space, reset]);

  const onSubmit = async (data: SpaceFormData) => {
    setLoading(true);
    setSubmitError(null);
    try {
      let result;
      if (space) {
        result = await spaceRepository.update(space.id, data);
      } else {
        result = await spaceRepository.create(data);
      }
      setSubmitSuccess(true);
      setTimeout(() => {
        onSuccess(result);
        onClose();
      }, 1200);
    } catch (err: any) {
      setSubmitError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const footerActions = (
    <div className="flex gap-2.5">
      <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
        İptal
      </Button>
      <Button variant="primary" size="sm" onClick={handleSubmit(onSubmit)} loading={loading}>
        Kaydet
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={space ? 'Reklam Alanını Düzenle' : 'Yeni Reklam Alanı Ekle'}
      footerActions={footerActions}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {submitSuccess && (
          <Notification
            title="Başarılı"
            description={space ? 'Reklam alanı başarıyla güncellendi.' : 'Yeni reklam alanı başarıyla eklendi.'}
            type="success"
          />
        )}

        {submitError && (
          <Notification
            title="Hata"
            description={submitError}
            type="alert"
            onClose={() => setSubmitError(null)}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormGroup>
            <Label htmlFor="code">Alan Kodu *</Label>
            <Input
              id="code"
              placeholder="SG-001"
              error={errors.code?.message}
              {...register('code')}
              disabled={!!space} // Usually code is unique and not editable, but update supports it
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="name">Alan Adı *</Label>
            <Input
              id="name"
              placeholder="Giriş LED Ekran"
              error={errors.name?.message}
              {...register('name')}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="location">Lokasyon *</Label>
            <Input
              id="location"
              placeholder="İç Hatlar - Giriş"
              error={errors.location?.message}
              {...register('location')}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="terminal">Terminal</Label>
            <Select id="terminal" error={errors.terminal?.message} {...register('terminal')}>
              <option value="">Seçin</option>
              <option value="İç Hatlar">İç Hatlar</option>
              <option value="Dış Hatlar">Dış Hatlar</option>
              <option value="Ortak Alan">Ortak Alan</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="floor">Kat</Label>
            <Input
              id="floor"
              placeholder="Zemin Kat / 1. Kat"
              error={errors.floor?.message}
              {...register('floor')}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="type">Ekran Tipi *</Label>
            <Select id="type" error={errors.type?.message} {...register('type')}>
              <option value="LED">LED Ekran</option>
              <option value="Lightbox">Lightbox</option>
              <option value="Billboard">Billboard</option>
              <option value="Megaboard">Megaboard</option>
              <option value="CLP">CLP Raket</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="size">Ölçü *</Label>
            <Input
              id="size"
              placeholder="8.00 x 3.00 m"
              error={errors.size?.message}
              {...register('size')}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="traffic">Günlük Yolcu Akışı *</Label>
            <Input
              id="traffic"
              type="number"
              placeholder="25000"
              error={errors.traffic?.message}
              {...register('traffic')}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="status">Durum *</Label>
            <Select id="status" error={errors.status?.message} {...register('status')}>
              <option value="bos">Boş</option>
              <option value="dolu">Dolu</option>
              <option value="teklif">Teklif Aşamasında</option>
              <option value="bakim">Bakımda</option>
              <option value="yakinda">Yakında</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="price">Aylık Fiyat (Yazılı) *</Label>
            <Input
              id="price"
              placeholder="₺1.850.000"
              error={errors.price?.message}
              {...register('price')}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="visibility">Görünürlük Sınıfı *</Label>
            <Select id="visibility" error={errors.visibility?.message} {...register('visibility')}>
              <option value="Çok Yüksek">Çok Yüksek</option>
              <option value="Yüksek">Yüksek</option>
              <option value="Orta">Orta</option>
              <option value="Standart">Standart</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="image">Resim URL (Görsel)</Label>
            <Input
              id="image"
              placeholder="https://unsplash.com/..."
              error={errors.image?.message}
              {...register('image')}
            />
          </FormGroup>
        </div>

        {/* Expandable Technical Specifications Section */}
        <div className="border-t border-slate-100 dark:border-slate-850 pt-4 mt-2">
          <button
            type="button"
            className="text-[10px] font-black text-blue-400 hover:text-blue-500 uppercase tracking-widest flex items-center gap-1.5 focus:outline-none mb-3 cursor-pointer select-none"
            onClick={() => setShowTechSpecs(!showTechSpecs)}
          >
            {showTechSpecs ? '▼ Teknik Özellikleri Gizle' : '▶ Teknik Özellikleri Göster'}
          </button>

          {showTechSpecs && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-in duration-200">
              <FormGroup>
                <Label htmlFor="resolution">Çözünürlük</Label>
                <Input
                  id="resolution"
                  placeholder="3840 x 1440 px"
                  error={errors.resolution?.message}
                  {...register('resolution')}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="pitch">LED Pitch</Label>
                <Input
                  id="pitch"
                  placeholder="P2.5 / P3.91"
                  error={errors.pitch?.message}
                  {...register('pitch')}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="workingHours">Çalışma Süresi</Label>
                <Input
                  id="workingHours"
                  placeholder="24:00 veya 20 saat"
                  error={errors.workingHours?.message}
                  {...register('workingHours')}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="audio">Ses Desteği</Label>
                <Select id="audio" error={errors.audio?.message} {...register('audio')}>
                  <option value="Yok">Yok</option>
                  <option value="Var">Var</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="power">Güç Tüketimi</Label>
                <Input
                  id="power"
                  placeholder="2.5 kW"
                  error={errors.power?.message}
                  {...register('power')}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="fileFormat">Dosya Formatı</Label>
                <Input
                  id="fileFormat"
                  placeholder="MP4, AVI, PNG"
                  error={errors.fileFormat?.message}
                  {...register('fileFormat')}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="maxFileSize">Maksimum Dosya Boyutu</Label>
                <Input
                  id="maxFileSize"
                  placeholder="2 GB"
                  error={errors.maxFileSize?.message}
                  {...register('maxFileSize')}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="updateInterval">Güncelleme Döngüsü</Label>
                <Input
                  id="updateInterval"
                  placeholder="15 sn"
                  error={errors.updateInterval?.message}
                  {...register('updateInterval')}
                />
              </FormGroup>
            </div>
          )}
        </div>

        <FormGroup className="pt-2">
          <Label htmlFor="notes">Notlar</Label>
          <Textarea
            id="notes"
            placeholder="Alan hakkında teknik veya konumsal notlar..."
            error={errors.notes?.message}
            {...register('notes')}
          />
        </FormGroup>
      </form>
    </Modal>
  );
}
