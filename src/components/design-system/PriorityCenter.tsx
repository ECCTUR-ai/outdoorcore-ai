import React from 'react';
import { Sparkles, Calendar, TrendingUp, Users } from 'lucide-react';
import { Badge } from './Badge';

export function PriorityCenter() {
  const points = [
    { title: 'THY Sözleşme Revizesi', desc: 'Hukuk birimi onay süreci tamamlanmalıdır.', priority: 'Kritik' },
    { title: 'Samsung Fatura Mutabakatı', desc: 'Tahsilat vadesi yaklaşmaktadır.', priority: 'Tahsilat' },
    { title: 'Mercedes Kreatif Dosyaları', desc: 'SG-045 çözünürlük boyutu düzeltilmelidir.', priority: 'Eksik' },
    { title: 'Pegasus Kampanya Teklifi', desc: 'Ajans ve müşteri geri dönüşü beklenmektedir.', priority: 'Bekliyor' }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-950/40 to-indigo-950/40 border border-blue-500/15 rounded-3xl p-5 text-left select-none space-y-4 shadow-xl">
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div className="flex items-center gap-1.5 text-blue-400">
          <Sparkles size={14} className="animate-pulse" />
          <h4 className="text-xs font-black text-white uppercase tracking-wider">AI Öncelik Merkezi</h4>
        </div>
        <span className="text-[8.5px] bg-blue-500/10 text-blue-400 border border-blue-500/10 px-2 py-0.5 rounded font-black uppercase tracking-wider">Günlük Akıllı Sıralama</span>
      </div>

      <div className="space-y-2.5 pt-0.5">
        {points.map((pt, idx) => (
          <div 
            key={idx} 
            className="p-2.5 rounded-xl bg-[#08111f]/40 border border-white/5 flex items-center justify-between text-[9.5px] hover:bg-white/3 duration-100"
          >
            <div className="space-y-0.5 leading-none">
              <span className="text-white font-extrabold block leading-none">{pt.title}</span>
              <span className="text-[8px] text-slate-505 block mt-0.5 uppercase tracking-wide leading-none">{pt.desc}</span>
            </div>
            <div className="scale-[0.8] origin-right shrink-0">
              <Badge variant={
                pt.priority === 'Kritik' ? 'danger' :
                pt.priority === 'Tahsilat' ? 'success' :
                pt.priority === 'Eksik' ? 'danger' : 'warning'
              }>
                {pt.priority}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
