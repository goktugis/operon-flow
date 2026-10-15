import React from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORY_LABELS } from '../../utils/formatters';
import { TaskCategory } from '../../types';
import { Layers } from 'lucide-react';

export const EffortDistributionChart: React.FC = () => {
  const { tasks } = useApp();

  const categories: TaskCategory[] = ['frontend', 'backend', 'devops', 'security', 'design', 'qa'];

  const categoryStats = categories.map((cat) => {
    const catTasks = tasks.filter((t) => t.category === cat);
    const totalHours = catTasks.reduce((acc, t) => acc + t.estimatedHours, 0);
    const loggedHours = catTasks.reduce((acc, t) => acc + t.loggedHours, 0);
    return {
      category: cat,
      label: CATEGORY_LABELS[cat],
      count: catTasks.length,
      totalHours,
      loggedHours,
    };
  });

  const totalAllHours = categoryStats.reduce((acc, c) => acc + c.totalHours, 0) || 1;

  const colorPalette: Record<TaskCategory, { bar: string; dot: string; text: string }> = {
    frontend: { bar: 'bg-indigo-500', dot: 'bg-indigo-400', text: 'text-indigo-400' },
    backend: { bar: 'bg-purple-500', dot: 'bg-purple-400', text: 'text-purple-400' },
    devops: { bar: 'bg-cyan-500', dot: 'bg-cyan-400', text: 'text-cyan-400' },
    security: { bar: 'bg-emerald-500', dot: 'bg-emerald-400', text: 'text-emerald-400' },
    design: { bar: 'bg-pink-500', dot: 'bg-pink-400', text: 'text-pink-400' },
    qa: { bar: 'bg-yellow-500', dot: 'bg-yellow-400', text: 'text-yellow-400' },
    mobile: { bar: 'bg-orange-500', dot: 'bg-orange-400', text: 'text-orange-400' },
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-white">Disiplin & Efor Dağılımı</h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {totalAllHours} Saat Toplam
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Departmanlara göre ayrılan sprint geliştirme gücü</p>
        </div>
        <div className="p-2 rounded-xl bg-slate-800/60 text-slate-400">
          <Layers className="w-4 h-4" />
        </div>
      </div>

      {/* Segmented Progress Bar */}
      <div className="w-full h-3 rounded-full bg-slate-800 flex overflow-hidden mb-5">
        {categoryStats.map((item) => {
          const pct = (item.totalHours / totalAllHours) * 100;
          if (pct === 0) return null;
          return (
            <div
              key={item.category}
              style={{ width: `${pct}%` }}
              className={`h-full ${colorPalette[item.category].bar} transition-all duration-500 hover:opacity-85`}
              title={`${item.label}: ${item.totalHours} saat (%${Math.round(pct)})`}
            />
          );
        })}
      </div>

      {/* Department Breakdown List */}
      <div className="space-y-3">
        {categoryStats.map((item) => {
          const pct = Math.round((item.totalHours / totalAllHours) * 100);
          const completionPct = item.totalHours > 0 ? Math.round((item.loggedHours / item.totalHours) * 100) : 0;
          return (
            <div key={item.category} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${colorPalette[item.category].dot}`} />
                <span className="text-slate-300 font-medium">{item.label}</span>
                <span className="text-slate-500">({item.count} görev)</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-slate-400">{item.loggedHours} / {item.totalHours} sa</span>
                <span className="w-12 text-right font-semibold text-slate-200">%{pct}</span>
                <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden hidden sm:block">
                  <div
                    style={{ width: `${Math.min(100, completionPct)}%` }}
                    className={`h-full ${colorPalette[item.category].bar}`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>En Yüksek Yük: Güvenlik & Backend</span>
        <span className="text-indigo-400 font-medium">Kapasite: %82 Optimum</span>
      </div>
    </div>
  );
};
