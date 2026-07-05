import React from 'react';
import { tasksList, TaskItem } from '@/data/tasks';
import { Badge } from './Badge';
import { Sparkles, Calendar, CheckSquare } from 'lucide-react';

function TaskRowLogo({ task }: { task: TaskItem }) {
  const [imageError, setImageError] = React.useState(false);
  if (task.logoUrl && !imageError) {
    return (
      <img 
        src={task.logoUrl} 
        onError={() => setImageError(true)} 
        className="w-6 h-6 rounded-lg object-contain border border-white/5 bg-slate-950 p-0.5 shrink-0" 
        alt={task.clientName} 
      />
    );
  }
  return (
    <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-[9px] flex items-center justify-center shrink-0">
      {task.logo}
    </div>
  );
}

export function TaskKanban() {
  const columns: Array<TaskItem['status']> = ['Yapılacak', 'Devam Ediyor', 'Bekliyor', 'Tamamlandı'];

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left select-none overflow-x-auto">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 min-w-[700px]">
        <CheckSquare size={13} className="text-slate-400" />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Görev Kanban Masası (Task Kanban Board)</h4>
      </div>

      <div className="grid grid-cols-4 gap-4 pt-2.5 min-w-[700px]">
        {columns.map(col => {
          const filtered = tasksList.filter(t => t.status === col);
          return (
            <div key={col} className="p-3.5 rounded-2xl bg-[#08111f]/45 border border-white/3 space-y-3.5 min-h-[300px]">
              <div className="flex justify-between items-center select-none pb-1.5 border-b border-white/3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block leading-none">{col}</span>
                <span className="text-[8px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-full font-black">{filtered.length}</span>
              </div>

              <div className="space-y-2.5">
                {filtered.map(t => (
                  <div 
                    key={t.id}
                    className="p-3 rounded-xl bg-[#0f172a]/60 border border-white/5 hover:border-white/10 duration-150 space-y-2.5 cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <TaskRowLogo task={t} />
                        <span className="text-[9.5px] font-extrabold text-slate-350 truncate">{t.clientName}</span>
                      </div>
                      <Badge variant={
                        t.priority === 'Kritik' ? 'danger' :
                        t.priority === 'Yüksek' ? 'danger' :
                        t.priority === 'Orta' ? 'warning' : 'success'
                      } className="scale-[0.8] origin-right">
                        {t.priority}
                      </Badge>
                    </div>

                    <p className="text-[9.5px] text-white font-extrabold leading-normal">{t.taskTitle}</p>

                    <div className="flex items-center justify-between text-[8px] font-bold text-slate-500 pt-2 border-t border-white/3 leading-none">
                      <span className="uppercase tracking-wider flex items-center gap-0.5">
                        <Calendar size={8} />
                        {t.dueDate}
                      </span>
                      <span className="bg-slate-800 text-slate-450 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">{t.module}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
