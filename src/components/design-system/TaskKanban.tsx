import React, { useState, useEffect } from 'react';
import { taskRepository as newTaskRepo } from '@/notifications/taskRepository';
import { Task } from '@/notifications/notificationTypes';
import { Badge } from './Badge';
import { Calendar, CheckSquare, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { EntityLink } from './EntityLink';

export function TaskKanban() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = () => {
    setTasks(newTaskRepo.list());
  };

  useEffect(() => {
    loadTasks();
    window.addEventListener('tasks_updated', loadTasks);
    return () => {
      window.removeEventListener('tasks_updated', loadTasks);
    };
  }, []);

  const columns: Array<{ key: Task['status']; label: string }> = [
    { key: 'todo', label: 'Yapılacak' },
    { key: 'in_progress', label: 'Devam Ediyor' },
    { key: 'waiting', label: 'Bekliyor' },
    { key: 'completed', label: 'Tamamlandı' }
  ];

  const moveTask = (taskId: string, direction: 'prev' | 'next') => {
    const statusOrder: Task['status'][] = ['todo', 'in_progress', 'waiting', 'completed'];
    const task = tasks.find(t => t.taskId === taskId);
    if (!task) return;
    
    const currentIndex = statusOrder.indexOf(task.status);
    let nextIndex = currentIndex;
    if (direction === 'prev' && currentIndex > 0) nextIndex--;
    if (direction === 'next' && currentIndex < statusOrder.length - 1) nextIndex++;
    
    if (nextIndex !== currentIndex) {
      newTaskRepo.update(taskId, { status: statusOrder[nextIndex] });
      loadTasks();
    }
  };

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left select-none overflow-x-auto">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 min-w-[700px]">
        <CheckSquare size={13} className="text-slate-400" />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Görev Yönetim Kanbanı</h4>
      </div>

      <div className="grid grid-cols-4 gap-4 pt-2.5 min-w-[700px]">
        {columns.map(col => {
          const filtered = tasks.filter(t => t.status === col.key);
          return (
            <div key={col.key} className="p-3.5 rounded-2xl bg-[#08111f]/45 border border-white/3 space-y-3.5 min-h-[350px] flex flex-col">
              <div className="flex justify-between items-center select-none pb-1.5 border-b border-white/3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block leading-none">{col.label}</span>
                <span className="text-[8px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-full font-black">{filtered.length}</span>
              </div>

              <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[400px] pr-1">
                {filtered.map(t => (
                  <div 
                    key={t.taskId}
                    className="p-3 rounded-xl bg-[#0f172a]/60 border border-white/5 hover:border-white/10 duration-150 space-y-2.5 cursor-pointer relative group"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-[7.5px] font-extrabold text-slate-500 block uppercase font-mono">#{t.taskId}</span>
                        <h5 className="text-[10px] text-white font-extrabold leading-tight break-words">{t.title}</h5>
                      </div>
                      <Badge variant={
                        t.priority === 'critical' ? 'danger' :
                        t.priority === 'high' ? 'danger' :
                        t.priority === 'medium' ? 'warning' : 'success'
                      } className="scale-[0.8] origin-right shrink-0">
                        {t.priority}
                      </Badge>
                    </div>

                    <p className="text-[9px] text-slate-400 font-semibold leading-normal break-words">{t.description}</p>

                    <div className="flex flex-wrap gap-1">
                      {t.sourceEntityType && t.sourceEntityId && (
                        <EntityLink 
                          type={t.sourceEntityType as any} 
                          id={t.sourceEntityId} 
                          label={`${t.sourceEntityType.toUpperCase()} #${t.sourceEntityId}`} 
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[8px] font-bold text-slate-500 pt-2 border-t border-white/3 leading-none">
                      <span className="uppercase tracking-wider flex items-center gap-0.5">
                        <Calendar size={8} />
                        {t.dueDate}
                      </span>
                      <span className="flex items-center gap-1 bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                        <User size={8} />
                        {t.assignedTo || 'Atanmadı'}
                      </span>
                    </div>

                    <div className="flex justify-end gap-1.5 pt-1.5 border-t border-white/3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {t.status !== 'todo' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveTask(t.taskId, 'prev');
                          }}
                          className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-0 cursor-pointer flex items-center justify-center"
                          title="Önceki Aşamaya Taşı"
                        >
                          <ChevronLeft size={10} />
                        </button>
                      )}
                      {t.status !== 'completed' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveTask(t.taskId, 'next');
                          }}
                          className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-0 cursor-pointer flex items-center justify-center"
                          title="Sonraki Aşamaya Taşı"
                        >
                          <ChevronRight size={10} />
                        </button>
                      )}
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
