import React from 'react';
import { 
  Activity, 
  KanbanSquare, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Plus, 
  Search,
  Command,
  Download
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';

interface HeaderProps {
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenExport }) => {
  const { 
    activeTab, 
    setActiveTab, 
    soundEnabled, 
    toggleSound, 
    setIsNewTaskModalOpen,
    setIsCommandPaletteOpen,
    tasks 
  } = useApp();

  const activeCount = tasks.filter((t) => t.status !== 'done').length;

  const tabs: { id: ActiveTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'dashboard', label: 'Kokpit', icon: Activity },
    { id: 'kanban', label: 'Sprint Panosu', icon: KanbanSquare, badge: activeCount },
    { id: 'ai_assistant', label: 'Operon AI', icon: Sparkles },
    { id: 'time_finance', label: 'Zaman & Maliyet', icon: Clock },
    { id: 'security_team', label: 'Güvenlik & Ekip', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Platform Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 p-[1px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  OPERON
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  v2.4 Core
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Akıllı Mühendislik & Operasyon Orkestratörü</p>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/60">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Center */}
          <div className="flex items-center gap-2">
            
            {/* Quick Command Palette Button */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 text-xs transition-colors"
              title="Komut Paletini Aç (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Hızlı Ara...</span>
              <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700">
                <Command className="w-2.5 h-2.5" /> K
              </kbd>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-lg border text-xs transition-colors ${
                soundEnabled
                  ? 'bg-slate-900 border-slate-800 text-indigo-400 hover:bg-slate-850'
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-400'
              }`}
              title={soundEnabled ? 'Sesleri Kapat' : 'Sesleri Aç'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Export Report */}
            <button
              onClick={onOpenExport}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              title="Rapor & Dışa Aktar"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* New Task Button */}
            <button
              onClick={() => setIsNewTaskModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Yeni Görev</span>
            </button>

            {/* User Profile Mini Badge */}
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Göktuğ İs"
                  className="w-8 h-8 rounded-full border border-indigo-500/50 object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-200 leading-tight">Göktuğ İs</p>
                <p className="text-[10px] text-indigo-400 leading-none">Lead Architect</p>
              </div>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-slate-800/50 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
