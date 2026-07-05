import React from 'react';
import { Button } from './Button';
import { 
  FileText, 
  Coins, 
  UserPlus, 
  Mail, 
  FileCheck, 
  DownloadCloud 
} from 'lucide-react';

export function QuickFinanceActions() {
  const actions = [
    { label: 'Yeni Fatura', icon: <FileText size={12} />, action: () => alert('Mockup Fatura formu açılacak.') },
    { label: 'Tahsilat Gir', icon: <Coins size={12} />, action: () => alert('Mockup Tahsilat formu açılacak.') },
    { label: 'Cari Aç', icon: <UserPlus size={12} />, action: () => alert('Yeni cari hesap tanımlama ekranı açılacak.') },
    { label: 'Mail Gönder', icon: <Mail size={12} />, action: () => alert('Hatırlatma maili taslağı hazırlandı.') },
    { label: 'PDF Oluştur', icon: <FileCheck size={12} />, action: () => alert('Finansal Rapor PDF formatında indiriliyor...') },
    { label: 'Excel Aktar', icon: <DownloadCloud size={12} />, action: () => alert('Mizan tablosu Excel dosyasına aktarılıyor...') }
  ];

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left select-none">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
        <FileCheck size={13} />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Hızlı Finansal İşlemler</h4>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {actions.map((act, idx) => (
          <Button 
            key={idx}
            variant="outline" 
            size="sm" 
            leftIcon={act.icon}
            onClick={act.action}
            className="text-[9.5px] font-black uppercase text-left justify-start border-white/5 hover:bg-[#22314a]/30 h-10 w-full"
          >
            {act.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
