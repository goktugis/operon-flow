import React from 'react';
import { useApp } from '../../context/AppContext';
import { KanbanColumn } from './KanbanColumn';
import { TaskCategory, TaskPriority } from '../../types';
import { Search, Filter, X, Plus } from 'lucide-react';

export const KanbanView: React.FC = () => {
  const { 
    tasks, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory, 
    selectedPriority, 
    setSelectedPriority,
    setIsNewTaskModalOpen 
  } = useApp();

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description.toLowerCase().includes(q);
      const matchTags = task.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTags) return false;
    }

    // Category match
    if (selectedCategory !== 'all' && task.category !== selectedCategory) {
      return false;
    }

    // Priority match
    if (selectedPriority !== 'all' && task.priority !== selectedPriority) {
      return false;
    }

    return true;
  });

  const todoTasks = filteredTasks.filter((t) => t.status === 'todo' || t.status === 'backlog');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'in_progress');
  const reviewTasks = filteredTasks.filter((t) => t.status === 'review');
  const doneTasks = filteredTasks.filter((t) => t.status === 'done');

  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== 'all' || selectedPriority !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPriority('all');
  };

  return (
    <div className="space-y-4">
      
      {/* Top Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Görev adı, açıklama veya #etiket ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as TaskCategory | 'all')}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">Tüm Disiplinler</option>
            <option value="frontend">Frontend & UI</option>
            <option value="backend">Backend API</option>
            <option value="devops">DevOps & Bulut</option>
            <option value="security">Siber Güvenlik</option>
            <option value="design">UI/UX Tasarım</option>
            <option value="mobile">Mobil Uygulama</option>
            <option value="qa">QA & Test</option>
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value as TaskPriority | 'all')}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">Tüm Öncelikler</option>
            <option value="critical">Kritik Acil</option>
            <option value="high">Yüksek</option>
            <option value="medium">Orta</option>
            <option value="low">Düşük</option>
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium whitespace-nowrap transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Sıfırla</span>
            </button>
          )}

          {/* New Task Button */}
          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold whitespace-nowrap shadow-md shadow-indigo-600/30 transition-all hover:scale-105 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Görev</span>
          </button>
        </div>

      </div>

      {/* 4-Column Responsive Sprint Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 overflow-x-auto pb-4">
        
        {/* Column 1: Todo / Backlog */}
        <KanbanColumn
          id="todo"
          title="Yapılacaklar"
          tasks={todoTasks}
          color="bg-sky-400"
          badgeColor="bg-sky-500/10 text-sky-400 border border-sky-500/20"
        />

        {/* Column 2: In Progress */}
        <KanbanColumn
          id="in_progress"
          title="Devam Eden"
          tasks={inProgressTasks}
          color="bg-indigo-400"
          badgeColor="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
        />

        {/* Column 3: Review & QA */}
        <KanbanColumn
          id="review"
          title="İnceleme & QA"
          tasks={reviewTasks}
          color="bg-amber-400"
          badgeColor="bg-amber-500/10 text-amber-400 border border-amber-500/20"
        />

        {/* Column 4: Done */}
        <KanbanColumn
          id="done"
          title="Tamamlandı"
          tasks={doneTasks}
          color="bg-emerald-400"
          badgeColor="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
        />

      </div>

    </div>
  );
};
