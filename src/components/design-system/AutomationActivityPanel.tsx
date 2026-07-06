import React, { useState, useEffect } from 'react';
import { workflowAuditRepository } from '@/automation/workflowAudit';
import { WorkflowEventLog } from '@/automation/workflowTypes';
import { Cpu, CheckCircle2, AlertCircle, Clock, RotateCcw } from 'lucide-react';
import { Badge } from './Badge';

export function AutomationActivityPanel() {
  const [logs, setLogs] = useState<WorkflowEventLog[]>([]);

  const loadLogs = () => {
    setLogs(workflowAuditRepository.getLogs());
  };

  useEffect(() => {
    loadLogs();
    
    // Listen to workflow update events
    window.addEventListener('workflow_logs_updated', loadLogs);
    return () => {
      window.removeEventListener('workflow_logs_updated', loadLogs);
    };
  }, []);

  const getStatusBadge = (status: WorkflowEventLog['status']) => {
    switch (status) {
      case 'success':
        return (
          <span className="flex items-center gap-1 text-[8.5px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg uppercase tracking-wider">
            <CheckCircle2 size={10} />
            Başarılı
          </span>
        );
      case 'error':
        return (
          <span className="flex items-center gap-1 text-[8.5px] font-black text-rose-450 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-lg uppercase tracking-wider">
            <AlertCircle size={10} />
            Hata
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[8.5px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg uppercase tracking-wider">
            <Clock size={10} />
            Bekliyor
          </span>
        );
    }
  };

  return (
    <div className="dark-glass-card border border-white/5 rounded-3xl p-6.5 text-left select-none space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Cpu size={16} className="animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest leading-none">Workflow Automation Engine</h4>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">Canlı Otomasyon Tetikleme & Log Kaydı</span>
          </div>
        </div>
        <button 
          type="button"
          onClick={() => {
            localStorage.removeItem('outdoorcore_workflow_events');
            loadLogs();
          }}
          className="p-1.5 hover:bg-white/5 text-slate-500 hover:text-white rounded-lg transition-colors cursor-pointer border-0 bg-transparent"
          title="Temizle"
        >
          <RotateCcw size={12} />
        </button>
      </div>

      <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
        {logs.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-white/5 rounded-2xl text-slate-500 text-xs font-bold bg-slate-900/10">
            Henüz tetiklenmiş bir otomasyon kaydı bulunmuyor. Demo butonlarıyla tetikleyebilirsiniz.
          </div>
        ) : (
          logs.map((log) => (
            <div 
              key={log.eventId}
              className="p-3.5 rounded-2xl bg-[#08111f]/35 border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-3 animate-fadeIn"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-white uppercase font-mono tracking-tighter">#{log.eventId}</span>
                  <Badge variant="primary" className="text-[7.5px] py-0 font-extrabold uppercase bg-indigo-650/40 text-indigo-400 border-indigo-500/10 font-sans tracking-wide">
                    {log.eventType}
                  </Badge>
                  <span className="text-[8px] text-slate-500 font-semibold">{new Date(log.createdAt).toLocaleTimeString('tr-TR')}</span>
                </div>
                <div className="text-[9px] font-semibold text-slate-400">
                  Kaynak: <strong className="text-slate-300 uppercase">{log.sourceEntityType} ({log.sourceEntityId})</strong>
                  {log.payload?.clientName && (
                    <span> | Firma: <strong className="text-white">{log.payload.clientName}</strong></span>
                  )}
                </div>
                {log.processedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5 pt-1.5 border-t border-white/3">
                    {log.processedActions.map((action, idx) => (
                      <span 
                        key={idx} 
                        className="text-[8px] bg-slate-900/50 border border-white/5 text-slate-400 px-2 py-0.5 rounded-md font-bold"
                      >
                        {action}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="shrink-0">
                {getStatusBadge(log.status)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
