import React from 'react';
import { Task, TaskStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  PRIORITY_COLORS, 
  PRIORITY_LABELS, 
  CATEGORY_COLORS, 
  CATEGORY_LABELS,
  formatDateTR 
} from '../../utils/formatters';
import { 
  CheckSquare, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  AlertTriangle,
  Sparkles
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { teamMembers, moveTaskStatus, logHours, setEditingTask } = useApp();

  const assignee = teamMembers.find((m) => m.id === task.assigneeId);
  const priColor = PRIORITY_COLORS[task.priority];
  const catColor = CATEGORY_COLORS[task.category];

  const totalSubtasks = task.subtasks.length;
  const completedSubtasks = task.subtasks.filter((st) => st.completed).length;

  const STATUS_FLOW: TaskStatus[] = ['backlog', 'todo', 'in_progress', 'review', 'done'];
  const currentIndex = STATUS_FLOW.indexOf(task.status);

  const canMovePrev = currentIndex > 0;
  const canMoveNext = currentIndex < STATUS_FLOW.length - 1;

  const handleMove = (e: React.MouseEvent, direction: 'prev' | 'next') => {
    e.stopPropagation();
    if (direction === 'prev' && canMovePrev) {
      moveTaskStatus(task.id, STATUS_FLOW[currentIndex - 1]);
    } else if (direction === 'next' && canMoveNext) {
      moveTaskStatus(task.id, STATUS_FLOW[currentIndex + 1]);
    }
  };

  const handleQuickLog = (e: React.MouseEvent) => {
    e.stopPropagation();
    logHours(task.id, 1);
  };

  return (
    <div
      onClick={() => setEditingTask(task)}
      className="group relative p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 shadow-lg hover:shadow-2xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
    >
      {/* Top Badges */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priColor.bg} ${priColor.text} ${priColor.border}`}
          >
            {PRIORITY_LABELS[task.priority]}
          </span>
          <span
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${catColor}`}
          >
            {CATEGORY_LABELS[task.category]}
          </span>
        </div>

        {task.aiGenerated && (
          <span
            className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20"
            title="Operon AI tarafından otomatik oluşturuldu"
          >
            <Sparkles className="w-2.5 h-2.5" />
            AI
          </span>
        )}
      </div>

      {/* Task Title */}
      <h4 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
        {task.title}
      </h4>

      {/* Task Description Preview */}
      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
        {task.description}
      </p>

      {/* Subtasks Progress */}
      {totalSubtasks > 0 && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <div className="flex items-center gap-1">
              <CheckSquare className="w-3 h-3 text-slate-500" />
              <span>Alt Görevler</span>
            </div>
            <span className="font-semibold text-slate-300">
              {completedSubtasks}/{totalSubtasks}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
              className={`h-full rounded-full transition-all duration-300 ${
                completedSubtasks === totalSubtasks ? 'bg-emerald-500' : 'bg-indigo-500'
              }`}
            />
          </div>
        </div>
      )}

      {/* Risk Badge if High Risk */}
      {task.riskScore && task.riskScore >= 60 && (
        <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
          <AlertTriangle className="w-3 h-3 shrink-0" />
          <span>Yüksek Mimari Risk Skoru: %{task.riskScore}</span>
        </div>
      )}

      {/* Footer Info: Assignee, Hours, Quick Actions */}
      <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        
        {/* Assignee & Due Date */}
        <div className="flex items-center gap-2 min-w-0">
          {assignee ? (
            <img
              src={assignee.avatar}
              alt={assignee.name}
              className="w-6 h-6 rounded-full object-cover border border-slate-700 shrink-0"
              title={`Atanan: ${assignee.name} (${assignee.role})`}
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-slate-800 text-[10px] flex items-center justify-center text-slate-400">
              ?
            </div>
          )}
          <span className="text-[11px] text-slate-400 truncate hidden sm:inline">
            {formatDateTR(task.dueDate)}
          </span>
        </div>

        {/* Hours & Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          
          {/* Quick Log Button */}
          <button
            onClick={handleQuickLog}
            className="flex items-center gap-1 px-1.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] transition-colors"
            title="1 Saat Çalışma Ekle"
          >
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{task.loggedHours}s</span>
            <Plus className="w-2.5 h-2.5 text-indigo-400" />
          </button>

          {/* Move Prev Button */}
          {canMovePrev && (
            <button
              onClick={(e) => handleMove(e, 'prev')}
              className="p-1 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
              title="Önceki Aşamaya Taşı"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Move Next Button */}
          {canMoveNext && (
            <button
              onClick={(e) => handleMove(e, 'next')}
              className="p-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white transition-colors"
              title="Sonraki Aşamaya Taşı"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
