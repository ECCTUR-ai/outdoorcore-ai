import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Bell, Mail, ChevronDown, Calendar, Search } from 'lucide-react';
import { Avatar } from '../design-system/Avatar';
import { Badge } from '../design-system/Badge';

export function Header() {
  const { notifications, setCommandPaletteOpen } = useApp();
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  return (
    <header className="h-[75px] bg-[#070913]/60 backdrop-blur-md border-b border-white/5 px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Welcome Left section */}
      <div className="text-left space-y-0.5">
        <h1 className="text-xs font-black text-white uppercase tracking-wider m-0 leading-none">
          Hoş geldiniz, Cemil Sezgin
        </h1>
        <p className="text-[9.5px] text-slate-500 font-bold uppercase tracking-wider m-0">
          OutdoorCore AI Reklam Yönetim Paneli
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3.5">
        {/* Quick Command Palette Button */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-2.5 h-9 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all text-slate-400 font-bold cursor-pointer"
          title="Komut Paleti (Ctrl+K)"
        >
          <Search size={12} />
        </button>

        {/* Date Selector range */}
        <div className="flex items-center gap-2 px-3 h-9 bg-white/5 border border-white/5 rounded-xl text-slate-300 font-bold text-[9.5px] uppercase tracking-wider">
          <Calendar size={11} className="text-slate-400 shrink-0" />
          <span>01 Mayıs 2025 - 31 Mayıs 2025</span>
        </div>

        {/* Message Icon */}
        <button 
          className="w-9 h-9 border border-white/5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 cursor-pointer flex items-center justify-center transition-all shrink-0"
          title="Mesajlar"
        >
          <Mail size={13} />
        </button>

        {/* Notifications Dropdown Toggle */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="w-9 h-9 border border-white/5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 cursor-pointer flex items-center justify-center transition-all relative shrink-0"
            title="Bildirimler"
          >
            <Bell size={13} />
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-blue-500 glow-blue" />
            )}
          </button>

          {showNotifMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotifMenu(false)} 
              />
              <div className="absolute right-0 mt-2 w-80 dark-glass-card rounded-2xl shadow-2xl p-4 z-50 animate-scale-in">
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5 mb-3">
                  <h4 className="text-[10px] font-black text-white uppercase tracking-wider m-0">Bildirimler</h4>
                  <Badge variant="info">{notifications.length}</Badge>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="text-left space-y-1 border-b border-white/5 pb-2.5 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10.5px] font-bold text-white leading-tight">{n.title}</span>
                        <span className="text-[8px] text-slate-500 font-bold shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[9.5px] text-slate-400 leading-normal font-semibold">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Card Dropdown */}
        <div className="flex items-center gap-2 border-l border-white/5 pl-3.5 shrink-0">
          <Avatar 
            name="Cemil Sezgin" 
            size="sm" 
            status="online" 
            className="font-black text-slate-200"
          />
          <ChevronDown size={11} className="text-slate-500 cursor-pointer hover:text-slate-350 transition-colors" />
        </div>
      </div>
    </header>
  );
}
