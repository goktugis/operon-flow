import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskPriority, TaskStatus } from '../../types';
import { 
  X, 
  Trash2, 
  Clock, 
  Calendar, 
  CheckSquare, 
  Plus, 
  AlertTriangle,
  Sparkles,
  Save
} from 'lucide-react';
import { 
  PRIORITY_LABELS, 
  STATUS_LABELS, 
  CATEGORY_LABELS,
  formatDateTR,
  formatTimeTR 
} from '../../utils/formatters';

export const TaskModal: React.FC = () => {
  const { 
    editingTask, 
    setEditingTask, 
    updateTask, 
    deleteTask, 
    toggleSubtask, 
    teamMembers,
    moveTaskStatus,
    logHours
  } = useApp();

  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isEditingText, setIsEditingText] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  if (!editingTask) return null;

  const assignee = teamMembers.find((m) => m.id === editingTask.assigneeId);

  const handleStartEdit = () => {
    setEditedTitle(editingTask.title);
    setEditedDescription(editingTask.description);
    setIsEditingText(true);
  };

  const handleSaveEdit = () => {
    updateTask(editingTask.id, {
      title: editedTitle,
      description: editedDescription,
    });
    setIsEditingText(false);
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    const newSubtask = {
      id: `sub-${Date.now().toString(36)}`,
      title: newSubtaskTitle.trim(),
      completed: false,
    };

    updateTask(editingTask.id, {
      subtasks: [...editingTask.subtasks, newSubtask],
    });
    setNewSubtaskTitle('');
  };

  const handleDelete = () => {
    if (window.confirm(`"${editingTask.title}" görevini silmek istediğinize emin misiniz?`)) {
      deleteTask(editingTask.id);
      setEditingTask(null);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setEditingTask(null)}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
              {CATEGORY_LABELS[editingTask.category]}
            </span>
            <span className="text-xs uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {PRIORITY_LABELS[editingTask.priority]}
            </span>
            {editingTask.aiGenerated && (
              <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <Sparkles className="w-3 h-3" />
                Operon AI Tarafından Üretildi
              </span>
            )}
          </div>

          <button
            onClick={() => setEditingTask(null)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title & Description */}
        {isEditingText ? (
          <div className="space-y-3 mb-6">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-lg focus:outline-none focus:border-indigo-500"
            />
            <textarea
              rows={4}
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveEdit}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Kaydet</span>
              </button>
              <button
                onClick={() => setIsEditingText(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                İptal
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white leading-tight">
              {editingTask.title}
            </h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
              {editingTask.description}
            </p>
            <button
              onClick={handleStartEdit}
              className="mt-2 text-xs text-indigo-400 hover:underline"
            >
              Başlık & Açıklamayı Düzenle
            </button>
          </div>
        )}

        {/* Status & Priority Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 mb-6">
          
          {/* Status Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Aşama (Status)
            </label>
            <select
              value={editingTask.status}
              onChange={(e) => moveTaskStatus(editingTask.id, e.target.value as TaskStatus)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="backlog">Bekleme Havuzu (Backlog)</option>
              <option value="todo">Yapılacaklar (Todo)</option>
              <option value="in_progress">Devam Ediyor (In Progress)</option>
              <option value="review">İnceleme & QA (Review)</option>
              <option value="done">Tamamlandı (Done)</option>
            </select>
          </div>

          {/* Priority Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Öncelik Derecesi
            </label>
            <select
              value={editingTask.priority}
              onChange={(e) => updateTask(editingTask.id, { priority: e.target.value as TaskPriority })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="low">Düşük</option>
              <option value="medium">Orta</option>
              <option value="high">Yüksek</option>
              <option value="critical">Kritik Acil</option>
            </select>
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Atanan Mühendis
            </label>
            <select
              value={editingTask.assigneeId}
              onChange={(e) => updateTask(editingTask.id, { assigneeId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              {teamMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.role})
                </option>
              ))}
            </select>
          </div>

          {/* Hours Logger */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Harcanan / Planlanan Efor
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white px-3 py-2 rounded-xl bg-slate-900 border border-slate-700">
                {editingTask.loggedHours} / {editingTask.estimatedHours} saat
              </span>
              <button
                onClick={() => logHours(editingTask.id, 1)}
                className="px-2.5 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold transition-colors"
                title="1 saat ekle"
              >
                +1 sa
              </button>
              <button
                onClick={() => logHours(editingTask.id, 2)}
                className="px-2.5 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold transition-colors"
                title="2 saat ekle"
              >
                +2 sa
              </button>
            </div>
          </div>

        </div>

        {/* Subtasks Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-indigo-400" />
              <span>Alt Görevler & Kontrol Listesi</span>
            </h4>
            <span className="text-xs text-slate-400">
              {editingTask.subtasks.filter((s) => s.completed).length} / {editingTask.subtasks.length} Tamamlandı
            </span>
          </div>

          <div className="space-y-2 mb-3">
            {editingTask.subtasks.map((st) => (
              <label
                key={st.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  st.completed
                    ? 'bg-slate-950/40 border-slate-800 text-slate-500 line-through'
                    : 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={st.completed}
                  onChange={() => toggleSubtask(editingTask.id, st.id)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-0 bg-slate-900 border-slate-700 cursor-pointer"
                />
                <span className="text-sm leading-snug">{st.title}</span>
              </label>
            ))}
          </div>

          {/* Add Subtask input */}
          <form onSubmit={handleAddSubtask} className="flex gap-2">
            <input
              type="text"
              placeholder="Yeni alt kontrol maddesi ekleyin..."
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Ekle</span>
            </button>
          </form>
        </div>

        {/* Risk Score & Audit Metadata */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>Teslim Tarihi: <strong className="text-slate-200">{formatDateTR(editingTask.dueDate)}</strong></span>
          </div>
          {editingTask.riskScore && (
            <div className="flex items-center gap-1.5 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <span>Risk Puanı: %{editingTask.riskScore}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-colors border border-rose-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Görevi Sil</span>
          </button>

          <button
            onClick={() => setEditingTask(null)}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
