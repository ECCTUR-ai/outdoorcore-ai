import React from 'react';
import { notificationRepository } from '@/repositories';
import { 
  FileText, 
  FileSignature, 
  Calendar, 
  Megaphone, 
  Coins, 
  Wrench, 
  FolderCheck, 
  Activity, 
  Clock,
  Sparkles
} from 'lucide-react';
import { EntityLink } from './EntityLink';

export function NotificationTimeline() {
  const notificationsList = notificationRepository.getAllSync();
  const getIcon = (category: string) => {
    switch (category) {
      case 'Teklif': return <FileText size={12} className="text-amber-400" />;
      case 'Sözleşme': return <FileSignature size={12} className="text-purple-400" />;
      case 'Rezervasyon': return <Calendar size={12} className="text-sky-400" />;
      case 'Kampanya': return <Megaphone size={12} className="text-blue-400" />;
      case 'Tahsilat': return <Coins size={12} className="text-emerald-450" />;
      case 'Bakım': return <Wrench size={12} className="text-rose-450" />;
      case 'Kreatif': return <FolderCheck size={12} className="text-sky-400" />;
      default: return <Activity size={12} className="text-slate-400" />;
    }
  };

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left select-none max-h-[420px] overflow-y-auto">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
        <Sparkles size={13} className="animate-pulse text-blue-400" />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Canlı Operasyon & Bildirim Timeline</h4>
      </div>

      <div className="space-y-4 pl-2 relative border-l border-white/5 text-[10px] font-semibold text-slate-400">
        {notificationsList.map(n => (
          <div key={n.id} className="relative pl-4 space-y-1">
            <span className={`absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full border border-slate-950 flex items-center justify-center bg-slate-900 ${
              n.status === 'critical' ? 'ring-2 ring-rose-500 bg-rose-500' :
              n.status === 'warning' ? 'ring-2 ring-amber-500 bg-amber-500' : 'bg-slate-800'
            }`} />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {getIcon(n.category)}
                <span className="text-white font-extrabold">{n.category}</span>
                <span className="text-slate-500">| {n.company}</span>
              </div>
              <span className="text-[8px] text-slate-550 flex items-center gap-0.5">
                <Clock size={8} />
                {n.time}
              </span>
            </div>
            
            <p className="text-slate-400 font-bold leading-normal">{n.message}</p>
            
            {/* Global Relation Entity Links */}
            <div className="flex flex-wrap gap-1 mt-1 pb-1">
              <span className="text-[7.5px] text-slate-500 font-extrabold flex items-center pr-1 uppercase">#{n.id}</span>
              {n.companyId && (
                <EntityLink type="company" id={n.companyId} label="Firma" />
              )}
              {n.linkId && (
                <EntityLink 
                  type={
                    n.category === 'Sözleşme' ? 'contract' :
                    n.category === 'Teklif' ? 'offer' :
                    n.category === 'Kampanya' ? 'campaign' :
                    n.category === 'Tahsilat' ? 'invoice' :
                    n.category === 'Rezervasyon' ? 'reservation' :
                    n.category === 'Bakım' ? 'space' : 'contract'
                  } 
                  id={n.linkId} 
                  label={n.category} 
                />
              )}
            </div>
            
            <div className="text-[7.5px] text-slate-500 font-black uppercase tracking-wider block">Yetkili: {n.user}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
