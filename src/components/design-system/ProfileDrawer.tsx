import React from 'react';
import { useAuth } from '@/auth/useAuth';
import { X, User, Building, Shield, Clock, ShieldCheck, Key } from 'lucide-react';
import { Badge } from './Badge';

interface ProfileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function ProfileDrawer({ open, onClose }: ProfileDrawerProps) {
  const { currentUser, organization, permissions } = useAuth();

  if (!open || !currentUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none">
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-sm bg-[#0f172a] border-l border-white/5 h-full flex flex-col justify-between text-left p-6 shadow-2xl z-10 overflow-y-auto">
        <div className="space-y-6">
          
          {/* Header */}
          <div className="flex justify-between items-center pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <User size={14} className="text-blue-400" />
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Kullanıcı Profil Kartı</h3>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer transition-all"
            >
              <X size={13} />
            </button>
          </div>

          {/* User profile details info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-white/2 border border-white/3 p-4 rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-sm font-black flex items-center justify-center">
                {currentUser.name.charAt(0)}
              </div>
              <div className="space-y-0.5 leading-none">
                <span className="text-[11px] font-black text-white block leading-none">{currentUser.name}</span>
                <span className="text-[8.5px] text-slate-550 block mt-1">{currentUser.email}</span>
                <div className="pt-2 flex items-center gap-1.5">
                  <Badge variant="primary">{currentUser.role} Yetkisi</Badge>
                </div>
              </div>
            </div>

            {/* Profile Metadata details list */}
            <div className="space-y-3 pt-2 text-[9.5px]">
              <div className="flex justify-between items-center py-1 border-b border-white/3">
                <span className="text-slate-550 font-bold uppercase">Kullanıcı ID</span>
                <span className="text-white font-extrabold">{currentUser.id}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/3">
                <span className="text-slate-550 font-bold uppercase">Son Oturum Açma</span>
                <span className="text-white font-extrabold">{currentUser.lastLogin || 'Mevcut Oturum'}</span>
              </div>
            </div>
          </div>

          {/* Organization Details info block */}
          {organization && (
            <div className="space-y-3.5 pt-4 border-t border-white/5 text-[9.5px]">
              <div className="flex items-center gap-1.5 text-slate-400 select-none">
                <Building size={12} className="text-indigo-400" />
                <span className="text-[10px] font-black uppercase text-white tracking-wider">Bağlı Organizasyon</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/2 border border-white/3 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold uppercase">Şirket</span>
                  <span className="text-white font-black">{organization.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold uppercase">Hizmet Seviyesi</span>
                  <Badge variant="success">{organization.tier}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold uppercase">Lisans Durumu</span>
                  <span className="text-white font-extrabold">{organization.licenseStatus}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold uppercase">Bitiş Tarihi</span>
                  <span className="text-slate-400 font-extrabold">{organization.licenseExpiry}</span>
                </div>
              </div>
            </div>
          )}

          {/* Permissions summary */}
          <div className="space-y-2 pt-4 border-t border-white/5">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Shield size={12} className="text-emerald-400" />
              <span className="text-[10px] font-black uppercase text-white tracking-wider">Yetki & İzinler Matrisi</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {permissions.map((perm) => (
                <span 
                  key={perm} 
                  className="bg-slate-900 border border-white/3 text-slate-400 text-[8px] px-2 py-0.5 rounded font-black uppercase tracking-wide"
                >
                  {perm.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-white/5 text-center text-[8px] text-slate-650 font-black uppercase tracking-widest flex items-center justify-between">
          <span>OutdoorCore Enterprise</span>
          <span>Build: P2</span>
        </div>
      </div>
    </div>
  );
}
