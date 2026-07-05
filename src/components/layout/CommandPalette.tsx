import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Search, Sparkles, LayoutDashboard, MapPin, Map, Building2, Calendar, FileText, Settings, X, Terminal } from 'lucide-react';
import { Badge } from '../design-system/Badge';

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, setCurrentRoute, setTheme, theme } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  // Close helper
  const handleClose = () => {
    setCommandPaletteOpen(false);
    setSearchQuery('');
  };

  // Esc key close listener
  useEffect(() => {
    if (!commandPaletteOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const commands = [
    { category: 'Navigasyon', key: 'dashboard', label: 'Dashboard Sayfasına Git', icon: <LayoutDashboard size={13} />, action: () => setCurrentRoute('dashboard') },
    { category: 'Navigasyon', key: 'reklam-alanlari', label: 'Reklam Alanları Listesi', icon: <MapPin size={13} />, action: () => setCurrentRoute('reklam-alanlari') },
    { category: 'Navigasyon', key: 'alan-haritasi', label: 'Alan Haritası Görünümü', icon: <Map size={13} />, action: () => setCurrentRoute('alan-haritasi') },
    { category: 'Navigasyon', key: 'firmalar-markalar', label: 'Firmalar & Markalar Portalı', icon: <Building2 size={13} />, action: () => setCurrentRoute('firmalar-markalar') },
    { category: 'Navigasyon', key: 'rezervasyonlar', label: 'Rezervasyon Takvimi', icon: <Calendar size={13} />, action: () => setCurrentRoute('rezervasyonlar') },
    { category: 'Navigasyon', key: 'teklifler', label: 'Teklif & Talep Listesi', icon: <FileText size={13} />, action: () => setCurrentRoute('teklifler') },
    { category: 'Hızlı Eylemler', key: 'theme-toggle', label: `Temayı Değiştir (${theme === 'light' ? 'Koyu' : 'Açık'})`, icon: <Terminal size={13} />, action: () => setTheme(theme === 'light' ? 'dark' : 'light') },
    { category: 'Hızlı Eylemler', key: 'settings', label: 'Sistem Ayarları Paneli', icon: <Settings size={13} />, action: () => setCurrentRoute('ayarlar') }
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/20 dark:bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
        onClick={handleClose}
      />

      {/* Palette dialog */}
      <div className="w-full max-w-lg bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-3xl shadow-2xl overflow-hidden transform transition-all animate-scale-in duration-200 z-50">
        {/* Search Input bar */}
        <div className="relative border-b border-slate-100 dark:border-slate-850 flex items-center bg-slate-50/20 dark:bg-slate-900/10 h-12">
          <Search size={14} className="absolute left-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Bir komut veya sayfa adı arayın..."
            className="w-full pl-11 pr-12 h-full bg-transparent border-0 focus:outline-none text-xs font-semibold text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-650"
            autoFocus
          />
          <button 
            onClick={handleClose}
            className="absolute right-4 text-[10px] font-black text-slate-400 dark:text-slate-650 uppercase bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 rounded-lg flex items-center justify-center shrink-0 cursor-pointer shadow-xs"
          >
            ESC
          </button>
        </div>

        {/* Results list */}
        <div className="p-2.5 max-h-[340px] overflow-y-auto space-y-2">
          {filteredCommands.length > 0 ? (
            <div>
              {/* Group by category */}
              {['Navigasyon', 'Hızlı Eylemler'].map(cat => {
                const catCommands = filteredCommands.filter(c => c.category === cat);
                if (catCommands.length === 0) return null;
                return (
                  <div key={cat} className="space-y-1">
                    <span className="text-[8px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest pl-3 py-2 block select-none">
                      {cat}
                    </span>
                    {catCommands.map(cmd => (
                      <button
                        key={cmd.key}
                        onClick={() => {
                          cmd.action();
                          handleClose();
                        }}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors cursor-pointer text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 dark:text-slate-500 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors shrink-0">
                            {cmd.icon}
                          </span>
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-350 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                            {cmd.label}
                          </span>
                        </div>
                        <Badge variant="muted" styleType="soft" className="text-[9px] scale-[0.9] origin-right">Git</Badge>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400">
              <Sparkles size={18} className="text-indigo-400 animate-pulse mb-2" />
              <p className="text-[10px] font-bold uppercase tracking-wider">Komut Bulunamadı</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
