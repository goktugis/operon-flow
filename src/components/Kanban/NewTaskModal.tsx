import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskCategory, TaskPriority, TaskStatus } from '../../types';
import { X, Plus, Sparkles, Check } from 'lucide-react';

export const NewTaskModal: React.FC = () => {
  const { isNewTaskModalOpen, setIsNewTaskModalOpen, addTask, teamMembers } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [category, setCategory] = useState<TaskCategory>('frontend');
  const [assigneeId, setAssigneeId] = useState(teamMembers[0]?.id || '');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [estimatedHours, setEstimatedHours] = useState(8);
  const [tagInput, setTagInput] = useState('');

  if (!isNewTaskModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (tags.length === 0) {
      tags.push(category.toUpperCase());
    }

    addTask({
      title: title.trim(),
      description: description.trim() || 'Açıklama belirtilmedi.',
      status,
      priority,
      category,
      assigneeId,
      dueDate,
      estimatedHours: Number(estimatedHours) || 4,
      loggedHours: 0,
      subtasks: [
        { id: `sub-1`, title: 'Gereksinim analizi ve mimari plan', completed: false },
        { id: `sub-2`, title: 'Uygulama ve kod geliştirme', completed: false },
        { id: `sub-3`, title: 'Birim testleri ve doğrulama', completed: false },
      ],
      tags,
      riskScore: priority === 'critical' ? 85 : priority === 'high' ? 60 : 30,
    });

    setIsNewTaskModalOpen(false);
    // Reset form
    setTitle('');
    setDescription('');
    setTagInput('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsNewTaskModalOpen(false)}
    >
      <div
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white">Yeni Mühendislik Görevi Ekle</h3>
            <p className="text-xs text-slate-400 mt-0.5">Sprint kapsamına yeni bir görev veya özellik tanımlayın</p>
          </div>
          <button
            onClick={() => setIsNewTaskModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Görev Başlığı *
            </label>
            <input
              type="text"
              required
              placeholder="Örn: GraphQL Gateway Önbellekleme Katmanı"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Detaylı Açıklama & Kapsam
            </label>
            <textarea
              rows={3}
              placeholder="Görevin teknik detaylarını ve kabul kriterlerini yazın..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Grid row: Status, Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Başlangıç Durumu
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="backlog">Bekleme Havuzu (Backlog)</option>
                <option value="todo">Yapılacaklar (Todo)</option>
                <option value="in_progress">Devam Eden (In Progress)</option>
                <option value="review">İnceleme & QA</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Öncelik Seviyesi
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="low">Düşük</option>
                <option value="medium">Orta</option>
                <option value="high">Yüksek</option>
                <option value="critical">Kritik Acil</option>
              </select>
            </div>
          </div>

          {/* Grid row: Category, Assignee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Disiplin / Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="frontend">Frontend & UI</option>
                <option value="backend">Backend API</option>
                <option value="devops">DevOps & Cloud</option>
                <option value="security">Siber Güvenlik</option>
                <option value="design">UI/UX Tasarım</option>
                <option value="mobile">Mobil Uygulama</option>
                <option value="qa">QA & Test</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Atanan Mühendis
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid row: Due Date, Estimated Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Teslim Tarihi
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tahmini Efor (Saat)
              </label>
              <input
                type="number"
                min={1}
                max={120}
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Etiketler (Virgülle ayırın)
            </label>
            <input
              type="text"
              placeholder="React, GraphQL, Redis, Cache"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsNewTaskModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Görevi Oluştur</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
