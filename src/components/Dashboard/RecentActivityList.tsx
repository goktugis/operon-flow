import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatTimeTR } from '../../utils/formatters';
import { ShieldCheck, ArrowRightLeft, FileEdit, Trash2, Cpu, CheckCircle } from 'lucide-react';

export const RecentActivityList: React.FC = () => {
  const { auditLogs } = useApp();

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'SECURITY_SCAN':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'STATUS_CHANGE':
        return <ArrowRightLeft className="w-4 h-4 text-sky-400" />;
      case 'TASK_CREATE':
        return <CheckCircle className="w-4 h-4 text-indigo-400" />;
      case 'TASK_UPDATE':
        return <FileEdit className="w-4 h-4 text-amber-400" />;
      case 'TASK_DELETE':
        return <Trash2 className="w-4 h-4 text-rose-400" />;
      default:
        return <Cpu className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-white">Canlı Operasyon & Denetim Günlüğü</h4>
          <p className="text-xs text-slate-400 mt-0.5">Sistem içi değişiklikler ve güvenlik hareketleri</p>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          CANLI AKIŞ
        </span>
      </div>

      <div className="space-y-3">
        {auditLogs.slice(0, 5).map((log) => (
          <div
            key={log.id}
            className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/50 hover:border-slate-700 transition-colors"
          >
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
              {getActionIcon(log.action)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-200 truncate">
                  {log.userName}
                </span>
                <span className="text-[10px] text-slate-500 shrink-0">
                  {formatTimeTR(log.timestamp)}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                {log.details}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
