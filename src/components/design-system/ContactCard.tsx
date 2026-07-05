import React from 'react';
import { User, Shield } from 'lucide-react';

interface ContactCardProps {
  name: string;
  role: string;
}

export function ContactCard({ name, role }: ContactCardProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5 shadow-inner">
      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
        <User size={14} />
      </div>
      <div className="space-y-0.5 text-left min-w-0">
        <h5 className="text-[10.5px] font-black text-white uppercase truncate">{name}</h5>
        <span className="text-[8.5px] text-slate-500 font-bold uppercase tracking-wider block">{role}</span>
      </div>
    </div>
  );
}
