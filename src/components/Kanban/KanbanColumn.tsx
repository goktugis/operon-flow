import React from 'react';
import { Task, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  color: string;
  badgeColor: string;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  tasks,
  color,
  badgeColor,
}) => {
  const { setIsNewTaskModalOpen } = useApp();

  return (
    <div className="flex flex-col h-full rounded-2xl bg-slate-950/40 border border-slate-800/80 p-3.5 sm:p-4 min-w-[280px] lg:min-w-0">
      
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            {title}
          </h3>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
            {tasks.length}
          </span>
        </div>

        {id !== 'done' && (
          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Bu Aşamaya Yeni Görev Ekle"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Task Cards Container */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-0.5 max-h-[calc(100vh-260px)] scrollbar-none">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}

        {tasks.length === 0 && (
          <div className="h-32 border-2 border-dashed border-slate-800/80 rounded-2xl flex flex-col items-center justify-center p-4 text-center">
            <p className="text-xs text-slate-500">Bu sütunda görev yok</p>
            {id !== 'done' && (
              <button
                onClick={() => setIsNewTaskModalOpen(true)}
                className="mt-2 text-[11px] text-indigo-400 hover:underline"
              >
                + Görev Ekle
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
