import React, { useState } from 'react';
import { Company } from '@/data/companies';
import { Badge } from './Badge';
import { FileText, Link, Shield, MessageSquare, Box, Folder } from 'lucide-react';

interface CompanyTabsProps {
  company: Company;
}

export function CompanyTabs({ company }: CompanyTabsProps) {
  const tabs = [
    { key: 'general', label: 'Genel' },
    { key: 'brands', label: 'Markalar' },
    { key: 'contacts', label: 'Yetkililer' },
    { key: 'campaigns', label: 'Kampanyalar' },
    { key: 'offers', label: 'Teklifler' },
    { key: 'contracts', label: 'Sözleşmeler' },
    { key: 'spaces', label: 'Reklam Alanları' },
    { key: 'files', label: 'Dosyalar' },
    { key: 'notes', label: 'Notlar' }
  ] as const;

  const [activeTab, setActiveTab] = useState<typeof tabs[number]['key']>('general');

  return (
    <div className="space-y-4 text-left">
      {/* Scrollable Tab bar */}
      <div className="flex border-b border-white/5 gap-1 pb-px overflow-x-auto select-none no-scrollbar">
        {tabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-2 text-[9.5px] font-black uppercase tracking-wider transition-all duration-150 cursor-pointer border-b-2 shrink-0 ${
                isActive 
                  ? 'border-blue-500 text-white font-extrabold' 
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="pt-2">
        {activeTab === 'general' && (
          <div className="grid grid-cols-2 gap-4 text-[10.5px] font-semibold text-slate-400">
            <div className="space-y-1">
              <span className="text-[9px] text-slate-550 block uppercase tracking-wider">Şirket Sektörü</span>
              <span className="text-white block">{company.sector}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-slate-550 block uppercase tracking-wider">Vergi Numarası</span>
              <span className="text-white block">{company.taxNo} ({company.taxOffice})</span>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-slate-550 block uppercase tracking-wider">Telefon</span>
              <span className="text-white block">{company.phone}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-slate-550 block uppercase tracking-wider">E-Posta</span>
              <span className="text-white block truncate">{company.email}</span>
            </div>
            <div className="space-y-1 col-span-2">
              <span className="text-[9px] text-slate-550 block uppercase tracking-wider">Web Sitesi</span>
              <a href={`https://${company.website}`} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                {company.website}
                <Link size={10} />
              </a>
            </div>
          </div>
        )}

        {activeTab === 'brands' && (
          <div className="flex flex-wrap gap-2 pt-1">
            {company.brands.map(brand => (
              <Badge key={brand} variant="info" styleType="outline">
                {brand}
              </Badge>
            ))}
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {company.contacts.map(c => (
              <div key={c.name} className="p-3 bg-white/3 border border-white/5 rounded-xl text-left leading-tight">
                <span className="text-[10px] font-black text-white block uppercase">{c.name}</span>
                <span className="text-[8.5px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">{c.role}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="space-y-2.5 pt-1">
            {company.campaignList.map(camp => (
              <div key={camp} className="flex justify-between items-center p-2.5 rounded-xl bg-white/3 border border-white/5">
                <span className="text-[10.5px] font-black text-white uppercase">{camp}</span>
                <Badge variant="success">Aktif Gösterim</Badge>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'offers' && (
          <div className="space-y-2.5 pt-1">
            {company.offersList.map((offer, idx) => (
              <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl bg-white/3 border border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/10 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                    {offer.stage}
                  </span>
                  <span className="text-[10.5px] font-black text-white">Teklif İstemi</span>
                </div>
                <span className="text-xs font-black text-emerald-450">{offer.value}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'contracts' && (
          <div className="space-y-2.5 pt-1">
            {company.contractsList.map((ctr, idx) => (
              <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl bg-white/3 border border-white/5">
                <span className="text-[10.5px] font-black text-white uppercase truncate max-w-[200px]">{ctr.name}</span>
                <Badge variant={ctr.status === 'Aktif' ? 'success' : 'warning'}>
                  {ctr.status}
                </Badge>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'spaces' && (
          <div className="flex flex-wrap gap-2.5 pt-1">
            {company.spacesList.map(sp => (
              <span key={sp} className="px-2.5 py-1 rounded-xl bg-white/3 border border-white/5 text-[10px] font-black text-blue-400 tracking-tighter">
                {sp}
              </span>
            ))}
          </div>
        )}

        {activeTab === 'files' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            {company.filesList.map((file, idx) => (
              <div key={idx} className="p-3 bg-white/3 border border-white/5 rounded-xl flex items-center gap-3">
                <Folder size={16} className="text-slate-500 shrink-0" />
                <div className="space-y-0.5 truncate leading-none">
                  <span className="text-[10px] font-black text-white block uppercase truncate">{file.name}</span>
                  <span className="text-[7.5px] text-slate-550 font-bold block uppercase">{file.type} Dosyası</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-3.5 pt-1">
            {company.notesList.map((note, idx) => (
              <div key={idx} className="p-3 bg-slate-900 border border-white/5 rounded-xl relative">
                <span className="text-[8px] text-slate-500 font-bold block uppercase tracking-wider mb-1.5">Kayıt: #{idx + 1}</span>
                <p className="text-[10px] text-slate-300 font-semibold leading-relaxed m-0">{note}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
