import React, { useState, useEffect } from 'react';
import { DigitalScreen, PlaylistSlot } from '@/types/digitalSignage';
import { digitalScreenRepository } from '@/repositories/digitalScreenRepository';
import { companyRepository } from '@/repositories';
import { FormGroup, Label, Input, Select } from './Form';
import { Button } from './Button';
import { Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';

interface LedReservationFormProps {
  onSuccess: (createdSlot: PlaylistSlot) => void;
  onCancel: () => void;
  initialScreenId?: string;
  initialDateRange?: { startDate: string; endDate: string };
}

export function LedReservationForm({ onSuccess, onCancel, initialScreenId, initialDateRange }: LedReservationFormProps) {
  const screens = digitalScreenRepository.listScreens();
  const companies = companyRepository.getAllSync();

  // Form State
  const [companyId, setCompanyId] = useState('');
  const [screenId, setScreenId] = useState(initialScreenId || (screens[0]?.screenId || ''));
  const [startDate, setStartDate] = useState(initialDateRange?.startDate || '2025-06-15');
  const [endDate, setEndDate] = useState(initialDateRange?.endDate || '2025-07-15');
  const [durationSeconds, setDurationSeconds] = useState(15);
  const [creativeFileUrl, setCreativeFileUrl] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Computed State preview
  const [preview, setPreview] = useState({
    loopDurationSeconds: 120,
    usedSeconds: 0,
    availableSeconds: 120,
    occupancyPercent: 0,
    sharePercent: 0,
    estimatedPlaysPerDay: 720,
    price: 0
  });

  const selectedScreen = screens.find(s => s.screenId === screenId) || screens[0];

  // Refresh calculations on input change
  useEffect(() => {
    if (!screenId || !startDate || !endDate) return;

    try {
      const avail = digitalScreenRepository.getAvailability(screenId, startDate, endDate);
      const share = parseFloat(((durationSeconds / selectedScreen.loopDurationSeconds) * 100).toFixed(1));
      const plays = digitalScreenRepository.calculateEstimatedPlays(screenId);
      const calculatedPrice = digitalScreenRepository.calculateSlotPrice(screenId, durationSeconds, startDate, endDate);

      setPreview({
        loopDurationSeconds: selectedScreen.loopDurationSeconds,
        usedSeconds: avail.usedSeconds,
        availableSeconds: avail.availableSeconds,
        occupancyPercent: avail.occupancyPercent,
        sharePercent: isNaN(share) ? 0 : share,
        estimatedPlaysPerDay: plays,
        price: calculatedPrice
      });

      // Validation check
      if (durationSeconds > avail.availableSeconds) {
        setErrorMsg(`Bu LED ekranda seçilen tarih aralığında sadece ${avail.availableSeconds} saniye boş slot var.`);
      } else {
        setErrorMsg(null);
      }

    } catch (e) {
      console.error(e);
    }
  }, [screenId, startDate, endDate, durationSeconds, selectedScreen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) {
      setErrorMsg('Lütfen bir firma seçin.');
      return;
    }

    try {
      const company = companies.find(c => c.id === companyId);
      const created = await digitalScreenRepository.createPlaylistSlot({
        screenId,
        companyId,
        companyName: company ? company.name : 'Seçilen Müşteri',
        startDate,
        endDate,
        durationSeconds,
        creativeFileUrl,
        notes
      });
      onSuccess(created);
    } catch (err: any) {
      setErrorMsg(err.message || 'Slot oluşturulurken bir hata oluşdu.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left select-none text-xs">
      
      {errorMsg && (
        <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-start gap-2 select-none">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          <span className="font-extrabold text-[10px] leading-tight">{errorMsg}</span>
        </div>
      )}

      {/* Inputs grid */}
      <div className="grid grid-cols-2 gap-4">
        <FormGroup>
          <Label htmlFor="led-company">Müşteri Firma *</Label>
          <Select id="led-company" required value={companyId} onChange={e => setCompanyId(e.target.value)}>
            <option value="">Firma Seçin</option>
            {companies.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="led-screen">LED Ekran *</Label>
          <Select id="led-screen" required value={screenId} onChange={e => setScreenId(e.target.value)}>
            {screens.map(s => (
              <option key={s.screenId} value={s.screenId}>{s.screenCode} - {s.name}</option>
            ))}
          </Select>
        </FormGroup>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormGroup>
          <Label htmlFor="led-start">Başlangıç Tarihi *</Label>
          <Input id="led-start" type="date" required value={startDate} onChange={e => setStartDate(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="led-end">Bitiş Tarihi *</Label>
          <Input id="led-end" type="date" required value={endDate} onChange={e => setEndDate(e.target.value)} />
        </FormGroup>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormGroup>
          <Label htmlFor="led-duration">Reklam Yayın Süresi (Saniye) *</Label>
          <Input 
            id="led-duration" 
            type="number" 
            required 
            min={1} 
            max={selectedScreen.loopDurationSeconds} 
            value={durationSeconds} 
            onChange={e => setDurationSeconds(parseInt(e.target.value, 10) || 0)} 
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="led-creative">Kreatif Dosya Adı / URL</Label>
          <Input id="led-creative" placeholder="spot-video.mp4" value={creativeFileUrl} onChange={e => setCreativeFileUrl(e.target.value)} />
        </FormGroup>
      </div>

      {/* Realtime calculations preview bar */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/2 border border-slate-200 dark:border-white/5 space-y-3">
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1 leading-none select-none">
          <Sparkles size={11} className="text-blue-400" />
          Planlama Motoru Anlık Fiyatlandırma
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-[9.5px] font-bold text-slate-500 uppercase tracking-tight select-none">
          <div>
            <span className="text-[7.5px] text-slate-450 block">Loop Payı</span>
            <span className="text-slate-800 dark:text-slate-200 font-black">{preview.sharePercent}%</span>
          </div>
          <div>
            <span className="text-[7.5px] text-slate-450 block">Günlük Yayın Sayısı</span>
            <span className="text-slate-800 dark:text-slate-200 font-black">{preview.estimatedPlaysPerDay} kez / gün</span>
          </div>
          <div>
            <span className="text-[7.5px] text-slate-450 block">Hesaplanan Fiyat</span>
            <span className="text-emerald-500 font-black">₺{preview.price.toLocaleString('tr-TR')}</span>
          </div>
        </div>
      </div>

      <FormGroup>
        <Label htmlFor="led-notes">Planlama Notu</Label>
        <textarea
          id="led-notes"
          rows={2}
          placeholder="Ekran yayını planlama detayları..."
          className="w-full text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-white/3 border border-slate-250 dark:border-white/5 rounded-xl p-2 text-xs outline-none"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
      </FormGroup>

      <div className="flex justify-end gap-2.5 pt-2">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>İptal</Button>
        <Button 
          type="submit" 
          variant="primary" 
          size="sm" 
          disabled={!!errorMsg}
          className="bg-blue-650 hover:bg-blue-600 text-white font-bold"
        >
          Rezervasyon Oluştur
        </Button>
      </div>

    </form>
  );
}
