import React, { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { ActiveTab, AuditLogEntry, Subtask, Task, TaskCategory, TaskPriority, TaskStatus, TeamMember } from '../types';
import { INITIAL_AUDIT_LOGS, INITIAL_TASKS, INITIAL_TEAM_MEMBERS } from '../services/mockData';
import { sound } from '../utils/audio';
import { sanitizeInput } from '../utils/security';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  tasks: Task[];
  teamMembers: TeamMember[];
  auditLogs: AuditLogEntry[];
  activeTab: ActiveTab;
  searchQuery: string;
  selectedCategory: TaskCategory | 'all';
  selectedPriority: TaskPriority | 'all';
  isCommandPaletteOpen: boolean;
  isNewTaskModalOpen: boolean;
  editingTask: Task | null;
  soundEnabled: boolean;
  toasts: Toast[];

  setActiveTab: (tab: ActiveTab) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (cat: TaskCategory | 'all') => void;
  setSelectedPriority: (pri: TaskPriority | 'all') => void;
  setIsCommandPaletteOpen: (open: boolean) => void;
  setIsNewTaskModalOpen: (open: boolean) => void;
  setEditingTask: (task: Task | null) => void;
  toggleSound: () => void;
  showToast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;

  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  moveTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  logHours: (taskId: string, hours: number) => void;
  addAuditLog: (action: AuditLogEntry['action'], details: string, severity?: AuditLogEntry['severity']) => void;
  resetToDemoData: () => void;
  importBackup: (tasks: Task[], team: TeamMember[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TASKS: 'operon_tasks_v1',
  TEAM: 'operon_team_v1',
  LOGS: 'operon_logs_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return INITIAL_TASKS;
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TEAM);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return INITIAL_TEAM_MEMBERS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return INITIAL_AUDIT_LOGS;
  });

  const [activeTab, setActiveTabState] = useState<ActiveTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | 'all'>('all');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [soundEnabled, setSoundEnabledState] = useState(sound.isSoundEnabled());
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(teamMembers));
    } catch {
      // ignore
    }
  }, [teamMembers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(auditLogs));
    } catch {
      // ignore
    }
  }, [auditLogs]);

  // Global keyboard shortcut for Command Palette (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        sound.playClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    sound.setSoundEnabled(next);
    setSoundEnabledState(next);
    if (next) sound.playClick();
    showToast(next ? 'Ses efektleri aktifleştirildi.' : 'Ses efektleri sessize alındı.', 'info');
  };

  const setActiveTab = (tab: ActiveTab) => {
    setActiveTabState(tab);
    sound.playClick();
  };

  const addAuditLog = (
    action: AuditLogEntry['action'],
    details: string,
    severity: AuditLogEntry['severity'] = 'info'
  ) => {
    const newEntry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userName: 'Göktuğ İs (Sen)',
      action,
      details,
      severity,
    };
    setAuditLogs((prev) => [newEntry, ...prev.slice(0, 99)]);
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...taskData,
      id: `tsk-${Date.now().toString(36)}`,
      title: sanitizeInput(taskData.title),
      description: sanitizeInput(taskData.description),
      createdAt: now,
      updatedAt: now,
    };

    setTasks((prev) => [newTask, ...prev]);
    addAuditLog('TASK_CREATE', `Yeni görev oluşturuldu: "${newTask.title}"`, 'success');
    showToast(`"${newTask.title}" başarıyla eklendi!`, 'success');
    sound.playSuccess();
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    const now = new Date().toISOString();
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updated: Task = {
            ...t,
            ...updates,
            updatedAt: now,
          };
          if (updates.title) updated.title = sanitizeInput(updates.title);
          if (updates.description) updated.description = sanitizeInput(updates.description);
          return updated;
        }
        return t;
      })
    );
    addAuditLog('TASK_UPDATE', `Görev güncellendi: ID ${taskId}`, 'info');
    showToast('Görev güncellendi.', 'info');
    sound.playClick();
  };

  const deleteTask = (taskId: string) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    addAuditLog('TASK_DELETE', `Görev silindi: "${taskToDelete?.title || taskId}"`, 'warning');
    showToast('Görev kaldırıldı.', 'warning');
    sound.playDelete();
  };

  const moveTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    const prevStatus = task.status;
    updateTask(taskId, { status: newStatus });
    addAuditLog('STATUS_CHANGE', `"${task.title}" görevi [${prevStatus}] -> [${newStatus}] durumuna taşındı.`, 'info');

    if (newStatus === 'done') {
      sound.playSuccess();
      try {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.75 },
          colors: ['#6366f1', '#10b981', '#38bdf8', '#f59e0b'],
        });
      } catch {
        // Confetti unsupported or blocked
      }
      showToast(`Tebrikler! "${task.title}" tamamlandı! 🚀`, 'success');
    }
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedSubtasks: Subtask[] = t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          return {
            ...t,
            subtasks: updatedSubtasks,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );
    sound.playClick();
  };

  const logHours = (taskId: string, hours: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            loggedHours: Math.max(0, t.loggedHours + hours),
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );
    addAuditLog('TASK_UPDATE', `Göreve ${hours} saat çalışma loglandı (ID: ${taskId})`, 'info');
    showToast(`${hours} saat başarıyla kaydedildi.`, 'info');
    sound.playClick();
  };

  const resetToDemoData = () => {
    setTasks(INITIAL_TASKS);
    setTeamMembers(INITIAL_TEAM_MEMBERS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.TEAM);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    addAuditLog('SECURITY_SCAN', 'Sistem demo durumuna sıfırlandı.', 'warning');
    showToast('Tüm veriler varsayılan demo haline sıfırlandı.', 'info');
    sound.playScan();
  };

  const importBackup = (newTasks: Task[], newTeam: TeamMember[]) => {
    setTasks(newTasks);
    if (newTeam && newTeam.length > 0) setTeamMembers(newTeam);
    addAuditLog('DATA_EXPORT', `${newTasks.length} adet görev yedekten geri yüklendi.`, 'success');
    showToast('Yedek başarıyla içeri aktarıldı!', 'success');
    sound.playSuccess();
  };

  return (
    <AppContext.Provider
      value={{
        tasks,
        teamMembers,
        auditLogs,
        activeTab,
        searchQuery,
        selectedCategory,
        selectedPriority,
        isCommandPaletteOpen,
        isNewTaskModalOpen,
        editingTask,
        soundEnabled,
        toasts,
        setActiveTab,
        setSearchQuery,
        setSelectedCategory,
        setSelectedPriority,
        setIsCommandPaletteOpen,
        setIsNewTaskModalOpen,
        setEditingTask,
        toggleSound,
        showToast,
        dismissToast,
        addTask,
        updateTask,
        deleteTask,
        moveTaskStatus,
        toggleSubtask,
        logHours,
        addAuditLog,
        resetToDemoData,
        importBackup,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
