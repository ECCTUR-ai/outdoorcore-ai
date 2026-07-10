import React, { useState, useEffect } from 'react';
import { useAuth } from '@/auth/useAuth';
import { usePermission } from '@/permissions/permissionHooks';
import { roleService } from '@/permissions/roleService';
import { ALL_PERMISSIONS_LIST, PermissionKey, EnterpriseRoleType, ROLE_PERMISSIONS_MATRIX } from '@/permissions/accessControl';
import { Shield, ShieldAlert, Users, Plus, Copy, Trash2, CheckCircle2, AlertTriangle, Key, Search, RefreshCw, Layers } from 'lucide-react';
import { Button } from '@/components/design-system/Button';
import { Badge } from '@/components/design-system/Badge';
import { Table, TableRow, TableCell } from '@/components/design-system/Table';

export function SystemRoles() {
  const { currentUser, refreshSession } = useAuth();
  
  // States
  const [activeTab, setActiveTab] = useState<'matrix' | 'users'>('matrix');
  const [roles, setRoles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Custom Role creation
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [showAddRole, setShowAddRole] = useState(false);
  const [copySource, setCopySource] = useState<string>('Read Only');

  // Load roles list on mount
  useEffect(() => {
    setRoles(roleService.getRolesList());
  }, []);

  const handleTogglePermission = async (roleName: EnterpriseRoleType, permKey: PermissionKey, currentlyHas: boolean) => {
    if (roleName === 'Super Admin') {
      alert('Super Admin yetkileri güvenlik gereği değiştirilemez.');
      return;
    }
    
    const activePerms = roleService.getRolePermissions(roleName);
    let updated: PermissionKey[];
    if (currentlyHas) {
      updated = activePerms.filter(p => p !== permKey);
    } else {
      updated = [...activePerms, permKey];
    }
    
    await roleService.updateRolePermissions(roleName, updated);
    // Refresh local lists
    setRoles(roleService.getRolesList());
    refreshSession(); // Refresh session auth state
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    try {
      await roleService.createRole(newRoleName.trim(), newRoleDesc);
      setRoles(roleService.getRolesList());
      setNewRoleName('');
      setNewRoleDesc('');
      setShowAddRole(false);
    } catch {
      alert('Rol oluşturulamadı.');
    }
  };

  const handleCopyRole = async (roleName: EnterpriseRoleType) => {
    const copyName = `${roleName} Kopya`;
    try {
      await roleService.copyRole(roleName, copyName);
      setRoles(roleService.getRolesList());
      alert(`"${roleName}" rolü "${copyName}" adıyla başarıyla kopyalandı.`);
    } catch {
      alert('Kopyalama işlemi başarısız oldu.');
    }
  };

  const handleDeleteRole = async (roleName: EnterpriseRoleType) => {
    if (roleName === 'Super Admin' || roleName === 'CEO' || roleName === 'Read Only') {
      alert('Sistem rolleri silinemez.');
      return;
    }

    if (window.confirm(`"${roleName}" rolünü kalıcı olarak silmek istediğinize emin misiniz?`)) {
      await roleService.deleteRole(roleName);
      setRoles(roleService.getRolesList());
    }
  };

  // Mock Active Users list for role management representation
  const mockUsersList = [
    { name: 'Cemil Sezgin', email: 'ceo@outdoorcore.ai', role: 'CEO', status: 'Aktif', twoFactor: true, lastLogin: '10 dk önce' },
    { name: 'Fatma Yılmaz', email: 'finance@outdoorcore.ai', role: 'Finance Manager', status: 'Aktif', twoFactor: true, lastLogin: '1 saat önce' },
    { name: 'Savaş Arslan', email: 'sales@outdoorcore.ai', role: 'Sales Director', status: 'Aktif', twoFactor: false, lastLogin: '3 saat önce' },
    { name: 'Kadir Kaya', email: 'customer@outdoorcore.ai', role: 'Customer', status: 'Aktif', twoFactor: false, lastLogin: 'Dün' }
  ];

  const handleDevRoleChange = (newRole: string) => {
    const cachedSession = localStorage.getItem('outdoorcore_mock_session');
    if (cachedSession) {
      try {
        const session = JSON.parse(cachedSession);
        session.user.role = newRole;
        localStorage.setItem('outdoorcore_mock_session', JSON.stringify(session));
        alert(`Aktif oturum rolünüz "${newRole}" olarak değiştirildi. Sayfa yenileniyor.`);
        window.location.reload();
      } catch (e) {
        console.error(e);
      }
    } else {
      const mockSession = {
        user: {
          id: 'mock-user-id',
          email: 'demo@outdoorcore.ai',
          name: 'Demo Kullanıcısı',
          role: newRole,
          organizationId: 'org-prod-0001',
          lastLogin: new Date().toLocaleString()
        },
        org: {
          id: 'org-prod-0001',
          name: 'MGA Production Org',
          tier: 'Tier A',
          licenseStatus: 'Aktif',
          licenseExpiry: '31.12.2026'
        }
      };
      localStorage.setItem('outdoorcore_mock_session', JSON.stringify(mockSession));
      alert(`Aktif oturum rolünüz "${newRole}" olarak değiştirildi. Sayfa yenileniyor.`);
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 text-left select-none pb-12">
      
      {/* Dev/Demo Active Role Switcher Alert */}
      <div className="p-4 rounded-3xl bg-blue-950/20 border border-blue-500/15 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-black text-blue-400 uppercase tracking-wider">
            <Key size={12} className="animate-pulse" />
            DEV / DEMO HIZLI YETKİ TEST PANELİ
          </div>
          <p className="text-[9.5px] text-slate-400 font-semibold m-0 leading-tight">
            Yeni MGA operasyonel akışını farklı yetki seviyelerinde test etmek için aktif kullanıcı rolünüzü anlık değiştirebilirsiniz.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[8.5px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Mevcut: <span className="text-white font-extrabold">{currentUser?.role || 'Super Admin'}</span></span>
          <select 
            value={currentUser?.role || 'Super Admin'}
            onChange={(e) => handleDevRoleChange(e.target.value)}
            className="bg-[#0b1329] border border-blue-500/30 rounded-xl px-3 py-1.5 text-[9.5px] font-black text-white focus:outline-none cursor-pointer uppercase tracking-wider select-none shrink-0"
          >
            <option value="Super Admin">SUPER ADMIN</option>
            <option value="CEO">CEO</option>
            <option value="Sales Director">SATIŞ MÜDÜRÜ (Sales Director)</option>
            <option value="Sales Representative">SATIŞ TEMSİLCİSİ (Sales Rep)</option>
            <option value="Finance Manager">FİNANS MÜDÜRÜ</option>
            <option value="Read Only">SALT OKUNUR (Read Only)</option>
          </select>
        </div>
      </div>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 p-5 rounded-3xl border border-white/5 shadow-sm text-left">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none flex items-center gap-1.5">
            <Shield size={14} className="text-amber-500" />
            Rol & Yetki Matrisi Paneli
          </h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            Sistem içindeki tüm kurumsal rolleri, granular modül işlemlerini, kullanıcı atamalarını ve güvenlik limitlerini yönetin.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="xs" 
            leftIcon={<RefreshCw size={10} />} 
            onClick={() => {
              setRoles(roleService.getRolesList());
              alert('Yetki listesi güncellendi.');
            }}
          >
            Yenile
          </Button>
          <Button 
            variant="primary" 
            size="xs" 
            leftIcon={<Plus size={10} />} 
            onClick={() => setShowAddRole(true)}
          >
            Yeni Rol Ekle
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2.5 border-b border-white/5 pb-2">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'matrix' 
              ? 'bg-blue-600/10 border border-blue-500/25 text-blue-400' 
              : 'text-slate-500 hover:text-white'
          }`}
        >
          Yetki Matris Tablosu
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'users' 
              ? 'bg-blue-600/10 border border-blue-500/25 text-blue-400' 
              : 'text-slate-500 hover:text-white'
          }`}
        >
          Kullanıcı Rol Atamaları
        </button>
      </div>

      {activeTab === 'matrix' && (
        <div className="space-y-6">
          {/* Excel-like Grid Matrix Card */}
          <div className="dark-glass-card border border-white/5 rounded-2xl p-5 overflow-x-auto text-left">
            <table className="w-full min-w-[900px] border-collapse text-[9.5px]">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="py-2.5 text-slate-500 font-black uppercase text-left w-64 select-none">Yetki / İzin Tanımı</th>
                  {roles.map(r => (
                    <th key={r.id} className="py-2.5 px-3 text-center text-slate-400 font-extrabold uppercase relative group w-28">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="truncate max-w-[85px]">{r.name}</span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleCopyRole(r.name)}
                            title="Kopyala"
                            className="p-0.5 rounded hover:bg-white/5 text-slate-500 hover:text-white cursor-pointer"
                          >
                            <Copy size={9} />
                          </button>
                          {r.isCustom && (
                            <button
                              onClick={() => handleDeleteRole(r.name)}
                              title="Sil"
                              className="p-0.5 rounded hover:bg-rose-500/10 text-slate-500 hover:text-rose-450 cursor-pointer"
                            >
                              <Trash2 size={9} />
                            </button>
                          )}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/3 font-semibold text-slate-350 select-none">
                {ALL_PERMISSIONS_LIST.map((perm) => (
                  <tr key={perm.key} className="hover:bg-white/2 transition-colors">
                    <td className="py-3 text-left">
                      <div className="space-y-0.5 leading-none">
                        <span className="text-white font-extrabold">{perm.name}</span>
                        <span className="text-[7.5px] text-slate-550 block mt-1 uppercase font-bold tracking-wide">
                          {perm.group} | {perm.key}
                        </span>
                      </div>
                    </td>
                    {roles.map((r) => {
                      const permissions = roleService.getRolePermissions(r.name);
                      const hasPerm = permissions.includes(perm.key);
                      return (
                        <td key={r.id} className="py-3 text-center">
                          <input
                            type="checkbox"
                            checked={hasPerm}
                            onChange={() => handleTogglePermission(r.name, perm.key, hasPerm)}
                            disabled={r.name === 'Super Admin'}
                            className="w-3.5 h-3.5 rounded border-white/5 bg-[#08111f] accent-blue-500 focus:ring-0 focus:outline-none cursor-pointer disabled:opacity-30"
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="dark-glass-card border border-white/5 rounded-2xl p-5 overflow-x-auto text-left">
            <div className="flex items-center gap-1.5 pb-2.5 border-b border-white/5 text-slate-400 select-none">
              <Users size={12} />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Aktif Kullanıcı Yetki Tanımları</h4>
            </div>

            <Table headers={['Kullanıcı Adı', 'E-Posta', 'Sistem Rolü', 'Son Giriş', 'Durum', '2FA Durumu']}>
              {mockUsersList.map((user, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-black text-white">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <select
                      value={user.role}
                      onChange={(e) => alert(`${user.name} rolü "${e.target.value}" olarak güncellendi. (Audit log oluştu)`)}
                      className="bg-[#08111f] border border-white/5 rounded-lg px-2.5 py-1 text-[9px] font-black text-white focus:outline-none cursor-pointer uppercase"
                    >
                      {roles.map(r => (
                        <option key={r.id} value={r.name}>{r.name.toUpperCase()}</option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell className="font-semibold text-slate-400">{user.lastLogin}</TableCell>
                  <TableCell>
                    <Badge variant="success">{user.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.twoFactor ? 'success' : 'warning'}>
                      {user.twoFactor ? '2FA AKTİF' : 'PASİF'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </div>
        </div>
      )}

      {/* Add Role Dialog Overlay */}
      {showAddRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="dark-glass-card border border-white/10 rounded-2xl max-w-sm w-full p-6 space-y-4 text-left relative animate-scale-in">
            <div className="space-y-1.5 select-none">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Yeni Özel Rol Ekle</h3>
              <p className="text-[9.2px] text-slate-500 uppercase tracking-widest leading-relaxed">
                Platform genelinde veya organizasyonunuza özel yeni bir kurumsal rol yetki taslağı oluşturun.
              </p>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Rol İsmi</label>
                <input
                  type="text"
                  placeholder="Örn: Saha Mühendisi"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full bg-[#08111f]/60 border border-white/5 rounded-xl px-3.5 py-2 text-[10px] font-semibold text-white placeholder-slate-600 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Açıklama</label>
                <textarea
                  placeholder="Rol yetki tanımlama kapsamı..."
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  className="w-full bg-[#08111f]/60 border border-white/5 rounded-xl px-3.5 py-2 text-[10px] font-semibold text-white placeholder-slate-600 focus:outline-none h-16 resize-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAddRole(false);
                    setNewRoleName('');
                    setNewRoleDesc('');
                  }}
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                >
                  Oluştur
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default SystemRoles;
