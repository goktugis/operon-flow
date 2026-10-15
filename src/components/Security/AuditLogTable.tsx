import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatTimeTR, formatDateTR } from '../../utils/formatters';
import { Search, ShieldAlert, CheckCircle, Info, AlertTriangle, Download } from 'lucide-react';

export const AuditLogTable: React.FC = () => {
  const { auditLogs } = useApp();
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchLog, setSearchLog] = useState<string>('');

  const filteredLogs = auditLogs.filter((log) => {
    if (filterSeverity !== 'all' && log.severity !== filterSeverity) return false;
    if (searchLog.trim()) {
      const q = searchLog.toLowerCase();
      return (
        log.details.toLowerCase().includes(q) ||
        log.userName.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'success':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'warning':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'alert':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default:
        return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
    }
  };

  const exportLogsAsCSV = () => {
    const headers = 'ID,Tarih,Kullanici,Islem,Detay,Seviye\n';
    const rows = filteredLogs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.userName}","${l.action}","${l.details.replace(/"/g, '""')}","${l.severity}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `operon-audit-logs-${Date.now()}.csv`;
    link.click();
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white">Güvenlik & Değişiklik Denetim İzi (Audit Trail)</h3>
          <p className="text-xs text-slate-400 mt-0.5">Sistemdeki her veri ekleme, silme, güncelleme ve güvenlik taraması kriptografik olarak kaydedilir.</p>
        </div>

        <button
          onClick={exportLogsAsCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>CSV Olarak İndir</span>
        </button>
      </div>

      {/* Filter and search */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Loglarda ara..."
            value={searchLog}
            onChange={(e) => setSearchLog(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
        >
          <option value="all">Tüm Seviyeler</option>
          <option value="info">Bilgi (Info)</option>
          <option value="success">Başarılı (Success)</option>
          <option value="warning">Uyarı (Warning)</option>
          <option value="alert">Kritik Alarm</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="pb-2.5">Zaman</th>
              <th className="pb-2.5">Kullanıcı</th>
              <th className="pb-2.5">Eylem</th>
              <th className="pb-2.5">Detay</th>
              <th className="pb-2.5 text-right">Seviye</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-2.5 pr-3 text-slate-400 font-mono whitespace-nowrap text-[11px]">
                  {formatTimeTR(log.timestamp)}
                </td>
                <td className="py-2.5 pr-3 font-semibold text-slate-200 whitespace-nowrap">
                  {log.userName}
                </td>
                <td className="py-2.5 pr-3 whitespace-nowrap">
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {log.action}
                  </span>
                </td>
                <td className="py-2.5 pr-3 text-slate-300 max-w-md truncate">
                  {log.details}
                </td>
                <td className="py-2.5 text-right whitespace-nowrap">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSeverityBadge(log.severity)}`}>
                    {log.severity.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
