import React, { useState } from 'react';
import { Contract } from '@/data/contracts';
import { ContractStatusBadge } from './ContractStatusBadge';
import { Badge } from './Badge';
import { Label } from './Form';
import { Button } from './Button';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Coins, 
  Sparkles, 
  Paperclip, 
  FileText,
  FileSignature,
  Percent,
  CheckSquare,
  Clock,
  History,
  FolderOpen,
  AlertTriangle
} from 'lucide-react';
import { EntityLink } from './EntityLink';
import { FileUpload } from './FileUpload';
import { contractRepository, activityLogRepository, reservationRepository } from '@/repositories';
import { createWorkflowEvent } from '@/automation/workflowEvents';
import { workflowEngine } from '@/automation/workflowEngine';

interface ContractDetailPanelProps {
  contract: Contract;
  onDelete?: (id: string) => void;
}

export function ContractDetailPanel({ contract: initialContract, onDelete }: ContractDetailPanelProps) {
  const defaultContract: Contract = {
    id: initialContract?.id || '',
    contractNo: initialContract?.contractNo || '',
    clientName: initialContract?.clientName || 'Belirtilmedi',
    status: initialContract?.status || 'draft',
    value: initialContract?.value || '₺0',
    daysLeft: initialContract?.daysLeft || 0,
    startDate: initialContract?.startDate || '',
    endDate: initialContract?.endDate || '',
    notes: initialContract?.notes || [],
    installments: initialContract?.installments || [],
    spacesList: initialContract?.spacesList || [],
    filesList: initialContract?.filesList || [],
    history: initialContract?.history || [],
    aiRiskAnalysis: initialContract?.aiRiskAnalysis || [],
    logo: initialContract?.logo || '',
    valueNumeric: initialContract?.valueNumeric || 0,
    progress: initialContract?.progress || 0,
    crmTier: initialContract?.crmTier || 'Standard',
    aiRiskScore: initialContract?.aiRiskScore || 0,
    mediaAgency: initialContract?.mediaAgency || '',
    campaignName: initialContract?.campaignName || '',
    proposalId: initialContract?.proposalId || '',
    reservationId: initialContract?.reservationId || ''
  };

  const [contract, setContract] = useState<Contract>(defaultContract);

  React.useEffect(() => {
    setContract({
      ...defaultContract,
      ...initialContract
    });
  }, [initialContract]);

  const tabs = [
    { key: 'general', label: 'Genel' },
    { key: 'payments', label: 'Ödeme Planı' },
    { key: 'invoices', label: 'Faturalar' },
    { key: 'spaces', label: 'Alanlar' },
    { key: 'files', label: 'Dosyalar' },
    { key: 'history', label: 'Geçmiş' }
  ] as const;

  const [activeTab, setActiveTab] = useState<typeof tabs[number]['key']>('general');

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-5 text-left lg:sticky lg:top-[95px] lg:max-h-[calc(100vh-130px)] overflow-y-auto">
      {/* Header Profile Title info */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[9px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/10 uppercase tracking-widest inline-block select-none">
            {contract.contractNo || 'SÖZLEŞME YOK'}
          </span>
          <h4 className="text-sm font-black text-white leading-tight uppercase truncate max-w-[200px]">{contract.clientName || 'Belirtilmedi'}</h4>
          <span className="text-[8.5px] text-slate-550 font-bold uppercase tracking-wider block">{contract.campaignName || 'Kampanya'}</span>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <ContractStatusBadge status={contract.status} />
          {contract.crmTier === 'VIP' && (
            <span className="text-[7.5px] bg-rose-500/10 text-rose-450 border border-rose-500/10 px-2 py-0.5 rounded font-black uppercase tracking-wider">VIP CLIENT</span>
          )}
        </div>
      </div>

      {/* Contract Core Metrics */}
      <div className="grid grid-cols-2 gap-3.5 border-t border-b border-white/5 py-4 text-[10.5px] font-semibold text-slate-400">
        <div className="flex items-center gap-2">
          <Coins size={12} className="text-slate-500 shrink-0" />
          <span className="text-emerald-455 font-bold">{contract.value || '₺0'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={12} className="text-slate-500 shrink-0" />
          <span>Kalan: <span className="text-white font-extrabold">{contract.daysLeft || 0} Gün</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={12} className="text-slate-500 shrink-0" />
          <span>{contract.startDate || '-'} - {contract.endDate || '-'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Building2 size={12} className="text-slate-500 shrink-0" />
          <span className="truncate">{contract.mediaAgency || 'Ajans Belirtilmedi'}</span>
        </div>
      </div>

      {/* Warning banner for orphan contracts (missing proposal/reservation) */}
      {(!contract.proposalId || !contract.reservationId || contract.proposalId === 'Bulunamadı' || contract.reservationId === 'Bulunamadı') && (
        <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[10px] text-rose-400 font-bold flex items-start gap-2 select-none">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          <div>
            <span className="block font-black uppercase text-rose-450 mb-0.5">BAĞLI KAYIT EKSİK (ORPHAN CONTRACT)</span>
            Bu sözleşmeye ait teklif veya kesin rezervasyon kaydı bulunamadı. Silinmeli veya kontrol edilmeli.
          </div>
        </div>
      )}

      {/* Embedded Subtabs Nav */}
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

      {/* Subtab contents mapping */}
      <div className="text-left pt-1 min-h-[120px]">
        {activeTab === 'general' && (
          <div className="grid grid-cols-2 gap-3.5 text-[10px] font-semibold text-slate-400">
            <div className="space-y-0.5">
              <span>Bağlı Teklif ID:</span>
              <span className="text-white block font-extrabold uppercase">{contract.proposalId || 'Bulunamadı'}</span>
            </div>
            <div className="space-y-0.5">
              <span>Bağlı Rezervasyon ID:</span>
              <span className="text-white block font-extrabold uppercase">{contract.reservationId || 'Bulunamadı'}</span>
            </div>
            <div className="space-y-0.5 col-span-2 border-t border-white/3 pt-2">
              <span>Kampanya Bilgisi:</span>
              <span className="text-slate-300 block font-semibold">{contract.campaignName || 'Belirtilmedi'} - {contract.mediaAgency || 'Ajans Belirtilmedi'}</span>
            </div>
            <div className="space-y-0.5 col-span-2 border-t border-white/3 pt-2">
              <span>Sözleşme Notu:</span>
              <span className="text-slate-450 block italic">{contract.notes?.[0] || 'Not eklenmemiş.'}</span>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-2 text-[10px] font-semibold text-slate-400">
            {(contract.installments || []).map((inst, index) => (
              <div key={inst.id || index} className="flex justify-between items-center p-2 rounded-xl bg-white/3 border border-white/5">
                <div className="space-y-0.5 text-left leading-none">
                  <span className="text-white font-extrabold block leading-none">{inst.installment}</span>
                  <span className="text-[8px] text-slate-500 font-bold block mt-0.5 uppercase">Vade: {inst.dueDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-extrabold">{inst.amount}</span>
                  <Badge variant={inst.status === 'Ödendi' ? 'success' : inst.status === 'Gecikti' ? 'danger' : 'warning'}>
                    {inst.status}
                  </Badge>
                </div>
              </div>
            ))}
            {(contract.installments || []).length === 0 && (
              <span className="text-[9.5px] text-slate-500 font-bold italic block text-center py-4">Ödeme planı bulunmuyor.</span>
            )}
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="space-y-2 text-[10px] font-semibold text-slate-400">
            <div className="flex justify-between items-center p-2 rounded-xl bg-white/3 border border-white/5">
              <span>Toplam Kesilen Fatura:</span>
              <span className="text-white font-black">{(contract.installments || []).length} / {(contract.installments || []).length}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-xl bg-white/3 border border-white/5">
              <span>Tahsil Edilen Tutar:</span>
              <span className="text-emerald-450 font-black">
                {contract.status === 'Riskli' ? '₺3.100.000 (Gecikmeli)' : contract.value || '₺0'}
              </span>
            </div>
          </div>
        )}

        {activeTab === 'spaces' && (
          <div className="flex flex-wrap gap-1.5">
            {(contract.spacesList || []).length > 0 ? (
              (contract.spacesList || []).map(code => (
                <span key={code} className="px-2 py-1 rounded-xl bg-white/3 border border-white/5 text-[9.5px] font-black text-blue-400 tracking-tighter">
                  {code}
                </span>
              ))
            ) : (
              <span className="text-[9.5px] text-slate-500 font-bold italic">Alan atanmamış.</span>
            )}
          </div>
        )}

        {activeTab === 'files' && (
          <div className="space-y-3">
            <div className="space-y-2">
              {(contract.filesList || []).map((file, index) => (
                <div key={index} className="p-2.5 rounded-xl bg-white/3 border border-white/5 flex items-center justify-between text-[9.5px] hover:bg-white/5 duration-100">
                  <span className="text-slate-300 font-bold truncate max-w-[200px]">{file}</span>
                  <span className="text-[7.5px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-black uppercase">
                    {file.split('.').pop()?.toUpperCase()}
                  </span>
                </div>
              ))}
              {(contract.filesList || []).length === 0 && (
                <span className="text-[9.5px] text-slate-500 font-bold italic block text-center py-4">Ekli dosya bulunmuyor.</span>
              )}
            </div>

            <div className="pt-2 border-t border-white/5">
              <FileUpload
                bucket="contracts"
                label="Yeni PDF Sözleşme Yükle"
                allowedTypes={['application/pdf']}
                onUploadSuccess={async (url, path, file) => {
                  const filename = file ? file.name : url.split('/').pop() || 'sozlesme.pdf';
                  const updatedFiles = [...(contract.filesList || []), filename];
                  try {
                    const updated = await contractRepository.update(contract.id, {
                      filesList: updatedFiles
                    });
                    setContract(updated);
                    await activityLogRepository.log(`Sözleşme dosyası yüklendi: ${filename} (#${contract.contractNo})`, 'contract.file_uploaded');
                  } catch (e) {
                    console.error('Failed to update contract files:', e);
                  }
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3.5 pl-2 relative border-l border-white/5 text-[10px] font-semibold text-slate-400 mt-2">
            {(contract.history || []).map((hist, index) => (
              <div key={index} className="relative space-y-0.5">
                <span className="absolute -left-[12.5px] top-1.5 w-2 h-2 rounded-full bg-blue-500 border border-slate-950 shadow" />
                <div className="flex justify-between items-center leading-none">
                  <span className="text-white font-extrabold uppercase leading-none">{hist.year} - {hist.campaign}</span>
                  <span className="text-slate-400 font-bold pl-2">{hist.value}</span>
                </div>
              </div>
            ))}
            {(contract.history || []).length === 0 && (
              <span className="text-[9.5px] text-slate-500 font-bold italic block text-center py-4">Sözleşme geçmişi bulunmuyor.</span>
            )}
          </div>
        )}
      </div>

      {/* Global Linked References */}
      <div className="space-y-2.5 border-t border-white/5 pt-4">
        <Label>Modüller Arası Bağlı Kayıtlar</Label>
        <div className="flex flex-wrap gap-2.5">
          {contract.companyId ? (
            <EntityLink type="company" id={contract.companyId} label={`Firma: ${contract.clientName || 'Görüntüle'}`} />
          ) : (
            <span className="text-[9px] text-slate-500 italic">Firma: Bağlı kayıt bulunamadı</span>
          )}
          {contract.proposalId ? (
            <EntityLink type="offer" id={contract.proposalId} label={`Teklif: ${contract.proposalId}`} />
          ) : (
            <span className="text-[9px] text-slate-500 italic">Teklif: Bağlı kayıt bulunamadı</span>
          )}
          {contract.reservationId ? (
            <EntityLink type="reservation" id={contract.reservationId} label={`Rezervasyon: ${contract.reservationId}`} />
          ) : (
            <span className="text-[9px] text-slate-500 italic">Rezervasyon: Bağlı kayıt bulunamadı</span>
          )}
          {contract.campaignId ? (
            <EntityLink type="campaign" id={contract.campaignId} label={`Kampanya: ${contract.campaignId}`} />
          ) : (
            <span className="text-[9px] text-slate-500 italic">Kampanya: Bağlı kayıt bulunamadı</span>
          )}
        </div>
      </div>

      {/* AI Risk Analysis Suggestions block */}
      <div className="p-3.5 bg-gradient-to-br from-blue-950/20 to-indigo-950/30 border border-blue-500/10 rounded-2xl text-left select-none space-y-1.5">
        <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1.5 leading-none">
          <Sparkles size={11} className="animate-pulse" />
          AI Risk & Yenileme Analizi
        </span>
        <ul className="text-[9.5px] text-slate-400 space-y-1.5 pl-3 list-disc leading-normal font-semibold">
          {(contract.aiRiskAnalysis || []).map((risk, index) => (
            <li key={index}>{risk}</li>
          ))}
          {(contract.aiRiskAnalysis || []).length === 0 && (
            <li>AI Risk analizi yapılmamış.</li>
          )}
        </ul>
      </div>

      {/* Bottom CTA Action keys */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5">
        {(contract.status === 'pending' || contract.status === 'draft' || contract.status === 'İmza Bekleyen') && (
          <Button 
            variant="primary" 
            size="sm" 
            type="button"
            className="col-span-2 bg-gradient-to-r from-emerald-600 to-teal-650 hover:from-emerald-500 hover:to-teal-600 text-white font-black animate-pulse py-2.5"
            onClick={async () => {
              try {
                const updated = await contractRepository.update(contract.id, { status: 'signed' });
                
                // Find and update the related reservation
                try {
                  const resList = await reservationRepository.getAll();
                  const relatedRes = resList.find(r => r.contractId === contract.id || r.id === contract.reservationId);
                  if (relatedRes) {
                    await reservationRepository.update(relatedRes.id, {
                      status: 'SALES_APPROVAL_PENDING',
                      contractStatus: 'SIGNED',
                      salesApprovalStatus: 'PENDING',
                      auditLogDescription: 'Sözleşme imzalandı. Rezervasyon Satış Departmanı onayına gönderildi.'
                    });
                  }
                } catch (resErr) {
                  console.error('Failed to link and update reservation status on contract signature:', resErr);
                }

                alert('Sözleşme imzalandı! Rezervasyon durumu Satış Departmanı Onayı Bekliyor (SALES_APPROVAL_PENDING) olarak güncellendi.');
                
                const event = createWorkflowEvent('contract.signed', 'contract', contract.id, {
                  clientName: contract.clientName,
                  campaignName: contract.campaignName,
                  companyId: contract.companyId
                });
                workflowEngine.dispatchWorkflowEvent(event);
                
                window.location.reload();
              } catch (e) {
                console.error(e);
              }
            }}
          >
            Sözleşmeyi İmzala & Satış Onayına Gönder
          </Button>
        )}
        <Button variant="primary" size="sm" type="button" onClick={() => alert(`${contract.contractNo || 'CON'} düzenleme modalı açılacak.`)}>
          Sözleşmeyi Düzenle
        </Button>
        <Button variant="outline" size="sm" type="button" onClick={() => onDelete && onDelete(contract.id)} className="text-rose-455 hover:bg-rose-500 hover:text-white border-rose-500/20">
          Sözleşmeyi Sil
        </Button>
        <Button variant="outline" size="sm" leftIcon={<FileText size={12} />} onClick={() => alert('PDF Sözleşme belgesi oluşturuluyor...')}>
          PDF Oluştur
        </Button>
        <Button variant="minimal" size="sm" leftIcon={<FolderOpen size={12} />} className="col-span-2 text-[10px]" onClick={() => alert(`${contract.clientName || 'Müşteri'} CRM kartı açılıyor...`)}>
          Firma Kartını Aç
        </Button>
      </div>
    </div>
  );
}
