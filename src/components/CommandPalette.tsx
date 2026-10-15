import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  Activity, 
  KanbanSquare, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Plus, 
  RotateCcw, 
  Volume2, 
  ArrowRight,
  FileCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveTab, Task } from '../types';

export const CommandPalette: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    setActiveTab, 
    setIsNewTaskModalOpen,
    tasks, 
    setEditingTask,
    toggleSound,
    resetToDemoData,
    showToast
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsCommandPaletteOpen(false);
  };

  const handleOpenTask = (task: Task) => {
    setEditingTask(task);
    setIsCommandPaletteOpen(false);
  };

  const filteredTasks = query.trim()
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase()) ||
          t.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5)
    : [];

  const quickActions = [
    {
      id: 'act-new-task',
      title: 'Yeni Görev Oluştur',
      icon: Plus,
      action: () => {
        setIsCommandPaletteOpen(false);
        setIsNewTaskModalOpen(true);
      },
    },
    {
      id: 'act-sound',
      title: 'Ses Efektlerini Değiştir (Aç / Kapat)',
      icon: Volume2,
      action: () => {
        toggleSound();
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'act-security-scan',
      title: 'Sistem Güvenlik Taraması Başlat',
      icon: ShieldCheck,
      action: () => {
        setActiveTab('security_team');
        setIsCommandPaletteOpen(false);
        showToast('Güvenlik modülü açıldı, tarama başlatılıyor...', 'info');
      },
    },
    {
      id: 'act-reset',
      title: 'Veritabanını Demo Haline Sıfırla',
      icon: RotateCcw,
      action: () => {
        setIsCommandPaletteOpen(false);
        resetToDemoData();
      },
    },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsCommandPaletteOpen(false)}
    >
      <div 
        className="relative w-full max-w-2xl rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-950/50">
          <Search className="w-5 h-5 text-indigo-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Komut ara, göreve git veya işlem yap..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button 
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command Body */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          
          {/* Quick Page Navigations */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
              Sayfalara Git
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleSelectTab('dashboard')}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Activity className="w-4 h-4 text-indigo-400" />
                <span>Kokpit (Dashboard)</span>
              </button>
              <button
                onClick={() => handleSelectTab('kanban')}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <KanbanSquare className="w-4 h-4 text-sky-400" />
                <span>Sprint Panosu</span>
              </button>
              <button
                onClick={() => handleSelectTab('ai_assistant')}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Operon AI Asistan</span>
              </button>
              <button
                onClick={() => handleSelectTab('time_finance')}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Zaman & Maliyet</span>
              </button>
              <button
                onClick={() => handleSelectTab('security_team')}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span>Güvenlik & Ekip</span>
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
              Hızlı İşlemler
            </p>
            <div className="space-y-1">
              {quickActions.map((act) => {
                const Icon = act.icon;
                return (
                  <button
                    key={act.id}
                    onClick={act.action}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
                      <span>{act.title}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Result Tasks */}
          {query.trim() && (
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                Eşleşen Görevler ({filteredTasks.length})
              </p>
              {filteredTasks.length > 0 ? (
                <div className="space-y-1">
                  {filteredTasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => handleOpenTask(task)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors text-left"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <FileCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="truncate">{task.title}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                        {task.status.toUpperCase()}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 px-2 py-2">
                  "{query}" ile eşleşen bir görev bulunamadı.
                </p>
              )}
            </div>
          )}

        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Seçmek için tıkla</span>
          <div className="flex items-center gap-3">
            <span>Esc ile Kapat</span>
            <span>Ctrl + K</span>
          </div>
        </div>
      </div>
    </div>
  );
};
