import React from 'react';
import { useApp } from '../../context/AppContext';
import { generateSprintHealthReport } from '../../services/aiEngine';
import { 
  HeartPulse, 
  AlertCircle, 
  CheckCircle, 
  TrendingUp, 
  ShieldAlert, 
  Sparkles 
} from 'lucide-react';

export const SprintHealthSummary: React.FC = () => {
  const { tasks } = useApp();
  const report = generateSprintHealthReport(tasks);

  const statusColor = {
    excellent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    good: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    critical: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  }[report.status];

  return (
    <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Operon AI • Sprint Sağlık Raporu</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor}`}>
                %{report.healthScore} SKOR
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{report.headline}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400">Tamamlanan: </span>
            <strong className="text-emerald-400">%{report.metrics.completionPercentage}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400">Kritik Bekleyen: </span>
            <strong className={report.metrics.criticalPending > 0 ? 'text-rose-400' : 'text-slate-200'}>
              {report.metrics.criticalPending}
            </strong>
          </div>
        </div>
      </div>

      {/* Grid: Bottlenecks & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Identified Bottlenecks */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Tespit Edilen Tıkanıklıklar (Bottlenecks)</span>
          </h4>
          {report.bottlenecks.length > 0 ? (
            <ul className="space-y-1.5 text-xs text-slate-300">
              {report.bottlenecks.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-emerald-400 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Sprint akışında hiçbir kritik darboğaz bulunmuyor.</span>
            </p>
          )}
        </div>

        {/* AI Recommendations */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Optimizasyon Önerileri</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {report.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-indigo-400">✓</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};
