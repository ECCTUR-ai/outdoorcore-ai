import React from 'react';
import { Button } from './Button';
import { 
  FileText, 
  UserPlus, 
  Mail, 
  MessageSquare, 
  Calendar,
  Sparkles
} from 'lucide-react';

export function QuickTaskActions() {
  const actions = [
    { label: 'Yeni Görev', icon: <FileText size={12} />, action: () => alert('Mockup yeni görev ekleme formu açılacak.') },
    { label: 'Yeni Bildirim', icon: <Sparkles size={12} />, action: () => alert('Mockup bildirim ekleme paneli tetiklendi.') },
    { label: 'Takvim Aç', icon: <Calendar size={12} />, action: () => alert('Rezervasyon ve görev takvimi açılıyor...') },
    { label: 'Görev Ata', icon: <UserPlus size={12} />, action: () => alert('Takım arkadaşına görev atama kartı açıldı.') },
    { label: 'Mail Gönder', icon: <Mail size={12} />, action: () => alert('Görev özeti mail taslağı oluşturuldu.') },
    { label: 'WhatsApp', icon: <MessageSquare size={12} />, action: () => alert('WhatsApp entegrasyonu tetiklendi.') }
  ];

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left select-none">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
        <Sparkles size={13} />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Hızlı Görev İşlemleri</h4>
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
