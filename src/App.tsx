import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { CommandPalette } from './components/CommandPalette';
import { ToastContainer } from './components/ToastContainer';
import { DashboardView } from './components/Dashboard/DashboardView';
import { KanbanView } from './components/Kanban/KanbanView';
import { AIAssistantView } from './components/AI/AIAssistantView';
import { TimeFinanceView } from './components/TimeFinance/TimeFinanceView';
import { SecurityView } from './components/Security/SecurityView';
import { TaskModal } from './components/Kanban/TaskModal';
import { NewTaskModal } from './components/Kanban/NewTaskModal';
import { ExportModal } from './components/Export/ExportModal';
import { ShieldCheck, Sparkles, Terminal, Heart } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Top Header */}
      <Header onOpenExport={() => setIsExportOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'kanban' && <KanbanView />}
        {activeTab === 'ai_assistant' && <AIAssistantView />}
        {activeTab === 'time_finance' && <TimeFinanceView />}
        {activeTab === 'security_team' && <SecurityView />}
      </main>

      {/* Modals & Overlays */}
      <TaskModal />
      <NewTaskModal />
      <CommandPalette />
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
      <ToastContainer />

      {/* Modern Developer Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-400 font-medium">Operon Flow Core</span>
            <span>•</span>
            <span>Tüm Güvenlik Protokolleri Aktif</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Geliştirici:</span>
            <strong className="text-slate-200">Göktuğ İs</strong>
            <span>•</span>
            <span className="text-indigo-400 font-medium">Senior Software & Cloud Architect Portföyü</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span>React 19</span>
            <span>•</span>
            <span>TypeScript</span>
            <span>•</span>
            <span>Tailwind CSS</span>
            <span>•</span>
            <span>Vitest</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
