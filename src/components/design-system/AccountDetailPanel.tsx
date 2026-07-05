import React, { useState } from 'react';
import { FinancialAccount } from '@/data/finance';
import { Badge } from './Badge';
import { Button } from './Button';
import { 
  Building2, 
  Coins, 
  Sparkles, 
  Paperclip, 
  FileText,
  FileCheck,
  CalendarCheck,
  FolderOpen,
  Mail,
  AlertTriangle
} from 'lucide-react';
import { EntityLink } from './EntityLink';
import { Label } from './Form';

interface AccountDetailPanelProps {
  account: FinancialAccount;
}

export function AccountDetailPanel({ account }: AccountDetailPanelProps) {
  const tabs = [
    { key: 'general', label: 'Genel' },
    { key: 'invoices', label: 'Faturalar' },
    { key: 'collections', label: 'Tahsilatlar' },
    { key: 'plan', label: 'Ödeme Planı' },
    { key: 'receipts', label: 'Dekontlar' }
  ] as const;

  const [activeTab, setActiveTab] = useState<typeof tabs[number]['key']>('general');
  const [imageError, setImageError] = React.useState(false);

  React.useEffect(() => {
    setImageError(false);
  }, [account.id]);

  const renderLogo = () => {
    if (account.logoUrl && !imageError) {
      return (
        <img 
          src={account.logoUrl} 
          onError={() => setImageError(true)} 
          className="w-18 h-18 rounded-2xl object-contain border border-white/5 bg-slate-950 p-2 shrink-0 shadow-sm" 
          alt={account.name} 
        />
      );
    }
    return (
      <div className="w-18 h-18 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-xl flex items-center justify-center shrink-0 shadow-sm">
        {account.logo}
      </div>
    );
  };

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-6 text-left sticky top-[95px] max-h-[calc(100vh-130px)] overflow-y-auto select-none">
      {/* Header Profile Title */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3.5">
          {renderLogo()}
          <div className="space-y-0.5">
            <h4 className="text-sm font-black text-white leading-tight uppercase truncate max-w-[150px]">{account.name}</h4>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{account.crmTier} Cari</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <Badge variant={account.balance === '₺0' ? 'success' : account.riskScore > 5 ? 'danger' : 'warning'}>
            {account.balance === '₺0' ? 'Kapatıldı' : 'Açık Bakiye'}
          </Badge>
          <span className="text-[9px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/10 flex items-center gap-0.8">
            <Sparkles size={8} />
            AI Risk: {account.riskScore}
          </span>
        </div>
      </div>

      {/* Financial Core stats */}
      <div className="grid grid-cols-3 gap-2 text-center text-[9px] font-bold text-slate-500 border-t border-b border-white/5 py-3.5">
        <div className="p-2 rounded-xl bg-white/2 border border-white/5">
          <span className="block text-slate-500 uppercase">Toplam Ciro</span>
          <span className="block text-white uppercase font-black mt-0.5">{account.totalDebt}</span>
        </div>
        <div className="p-2 rounded-xl bg-white/2 border border-white/5">
          <span className="block text-slate-500 uppercase">Tahsil Edilen</span>
          <span className="block text-emerald-450 uppercase font-black mt-0.5">{account.totalCollected}</span>
        </div>
        <div className="p-2 rounded-xl bg-white/2 border border-white/5">
          <span className="block text-slate-500 uppercase">Kalan Borç</span>
          <span className="block text-rose-450 uppercase font-black mt-0.5">{account.balance}</span>
        </div>
      </div>

      {/* Subtabs Nav */}
      <div className="border-b border-white/5 flex gap-1 pb-px overflow-x-auto select-none no-scrollbar">
        {tabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wider transition-all duration-150 cursor-pointer border-b-2 shrink-0 ${
                isActive 
                  ? 'border-blue-500 text-white font-extrabold' 
                  : 'border-transparent text-slate-500 hover:text-slate-350'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Subtab Contents mapping */}
      <div className="text-left pt-1 min-h-[120px]">
        {activeTab === 'general' && (
          <div className="grid grid-cols-2 gap-3 text-[10px] font-semibold text-slate-400">
            <div className="space-y-0.5">
              <span>Sözleşme Toplamı:</span>
              <span className="text-white block font-extrabold uppercase">{account.totalContracts}</span>
            </div>
            <div className="space-y-0.5">
              <span>Toplam Fatura Tutar:</span>
              <span className="text-white block font-extrabold uppercase">{account.totalDebt}</span>
            </div>
            <div className="space-y-0.5 col-span-2 border-t border-white/3 pt-2">
              <span>Cari Finans Notu:</span>
              <span className="text-slate-455 block italic">{account.notes[0] || 'Not eklenmemiş.'}</span>
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="space-y-2 text-[10px] font-semibold text-slate-400">
            {account.invoices.map(inv => (
              <div key={inv.id} className="flex justify-between items-center p-2 rounded-xl bg-white/3 border border-white/5">
                <div className="space-y-0.5 leading-none">
                  <span className="text-white font-extrabold block leading-none">{inv.invoiceNo}</span>
                  <span className="text-[8px] text-slate-500 font-bold block mt-0.5 uppercase">Tarih: {inv.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-extrabold">{inv.amount}</span>
                  <Badge variant={inv.status === 'Ödendi' ? 'success' : inv.status === 'Gecikti' ? 'danger' : 'warning'}>
                    {inv.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'collections' && (
          <div className="space-y-2 text-[10px] font-semibold text-slate-400">
            {account.collections.length > 0 ? (
              account.collections.map(col => (
                <div key={col.id} className="flex justify-between items-center p-2 rounded-xl bg-white/3 border border-white/5">
                  <div className="space-y-0.5 leading-none">
                    <span className="text-emerald-450 font-extrabold block leading-none">{col.amount}</span>
                    <span className="text-[8px] text-slate-500 font-bold block mt-0.5 uppercase">Tarih: {col.date}</span>
                  </div>
                  <span className="text-[8px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-black uppercase">{col.method}</span>
                </div>
              ))
            ) : (
              <span className="text-[9.5px] text-slate-555 italic block">Tahsilat kaydı bulunmuyor.</span>
            )}
          </div>
        )}

        {activeTab === 'plan' && (
          <div className="space-y-2 text-[10px] font-semibold text-slate-400">
            {account.paymentPlan.map((p, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 rounded-xl bg-white/3 border border-white/5">
                <div className="space-y-0.5 leading-none">
                  <span className="text-white font-extrabold block leading-none">{p.installment}</span>
                  <span className="text-[8px] text-slate-505 font-bold block mt-0.5 uppercase">Vade: {p.dueDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-extrabold">{p.amount}</span>
                  <Badge variant={p.status === 'Ödendi' ? 'success' : p.status === 'Gecikti' ? 'danger' : 'warning'}>
                    {p.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'receipts' && (
          <div className="space-y-2">
            {account.receipts.length > 0 ? (
              account.receipts.map(rec => (
                <div key={rec.id} className="p-2.5 rounded-xl bg-white/3 border border-white/5 flex items-center justify-between text-[9.5px] hover:bg-white/5 duration-100">
                  <span className="text-slate-350 font-bold truncate max-w-[150px]">{rec.name}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-slate-550 font-bold text-[8px]">{rec.size}</span>
                    <span className="text-[7.5px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-black uppercase">PDF</span>
                  </div>
                </div>
              ))
            ) : (
              <span className="text-[9.5px] text-slate-555 italic block">Yüklenmiş dekont bulunmuyor.</span>
            )}
          </div>
        )}
      </div>

      {/* Global Linked References */}
      <div className="space-y-2.5 border-t border-white/5 pt-4">
        <Label>Modüller Arası Bağlı Kayıtlar</Label>
        <div className="flex flex-wrap gap-2.5">
          {account.companyId && (
            <EntityLink type="company" id={account.companyId} label={`Firma Kartı`} />
          )}
          {account.linkedContractIds?.map(cId => (
            <EntityLink key={cId} type="contract" id={cId} label={`Sözleşme: ${cId}`} />
          ))}
          {account.invoices.map(inv => (
            <EntityLink key={inv.id} type="invoice" id={inv.id} label={`Fatura: ${inv.invoiceNo}`} />
          ))}
          {account.collections.map(col => (
            <EntityLink key={col.id} type="payment" id={col.id} label={`Makbuz: ${col.id}`} />
          ))}
        </div>
      </div>

      {/* AI Risk Alarm warnings */}
      {account.riskScore > 5 && (
        <div className="p-3.5 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex items-start gap-2.5">
          <AlertTriangle size={15} className="text-rose-450 shrink-0 mt-0.5 animate-bounce" />
          <div className="space-y-0.5 text-left leading-normal">
            <span className="text-[9.5px] font-black text-rose-450 uppercase tracking-widest block leading-none">Cari Hesap Risk Uyarısı</span>
            <p className="text-[9.5px] text-slate-400 font-bold leading-normal mt-1">Ödeme gecikmesi 80 günü bulmuştur. Hukuki takip öncesi ajans ve marka finansörleri ile acil mutabakat yapılması önerilir.</p>
          </div>
        </div>
      )}

      {/* Bottom CTA Action keys */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5">
        <Button variant="primary" size="sm" onClick={() => alert('Yeni ödeme makbuzu giriliyor...')}>
          Tahsilat Gir
        </Button>
        <Button variant="outline" size="sm" leftIcon={<Mail size={12} />} onClick={() => alert('Cari bakiye hatırlatma maili gönderiliyor...')}>
          Mail Gönder
        </Button>
        <Button variant="minimal" size="sm" leftIcon={<FileText size={12} />} className="col-span-2 text-[10px]" onClick={() => alert('Detaylı cari hesap ekstresi PDF oluşturuluyor...')}>
          Cari Ekstre Oluştur
        </Button>
      </div>
    </div>
  );
}
