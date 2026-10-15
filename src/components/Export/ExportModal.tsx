import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Download, Upload, RotateCcw, FileText, CheckCircle2 } from 'lucide-react';
import { Task, TeamMember } from '../../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { tasks, teamMembers, resetToDemoData, importBackup, showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Export full JSON
  const handleExportJSON = () => {
    const data = {
      version: '2.4.0',
      exportedAt: new Date().toISOString(),
      tasks,
      teamMembers,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `operon-flow-backup-${Date.now()}.json`;
    link.click();
    showToast('Tam sistem yedeği JSON olarak indirildi.', 'success');
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = 'ID,Baslik,Durum,Oncelik,Kategori,AtananID,TeslimTarihi,TahminiSaat,HarcananSaat\n';
    const rows = tasks
      .map(
        (t) =>
          `"${t.id}","${t.title.replace(/"/g, '""')}","${t.status}","${t.priority}","${t.category}","${t.assigneeId}","${t.dueDate}","${t.estimatedHours}","${t.loggedHours}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `operon-tasks-${Date.now()}.csv`;
    link.click();
    showToast('Görevler CSV olarak indirildi.', 'success');
  };

  // Import JSON backup
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed && Array.isArray(parsed.tasks)) {
          importBackup(parsed.tasks, parsed.teamMembers || []);
          onClose();
        } else {
          showToast('Geçersiz yedek dosyası formatı!', 'error');
        }
      } catch {
        showToast('Dosya okunurken hata oluştu!', 'error');
      }
    };
    reader.readAsText(file);
  };

  // Print summary
  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-150 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white">Veri Yönetimi & Dışa Aktarım</h3>
            <p className="text-xs text-slate-400 mt-0.5">Yedekleme, CSV dökümü veya fabrika ayarlarına sıfırlama</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options list */}
        <div className="space-y-3">
          
          <button
            onClick={handleExportJSON}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-800/40 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Tam JSON Yedeği İndir</h4>
                <p className="text-xs text-slate-400">Tüm görevleri, alt görevleri ve ekip verilerini depolar</p>
              </div>
            </div>
          </button>

          <button
            onClick={handleExportCSV}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-800/40 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Görev Listesi CSV İndir</h4>
                <p className="text-xs text-slate-400">Excel veya Google Sheets için tablo biçiminde dışa aktar</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800/40 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">JSON Yedek Dosyası Geri Yükle</h4>
                <p className="text-xs text-slate-400">Önceden indirilmiş bir yedeği sisteme aktarın</p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </button>

          <button
            onClick={() => {
              if (window.confirm('Tüm değişiklikler sıfırlanıp fabrika demo verileri yüklenecektir. Onaylıyor musunuz?')) {
                resetToDemoData();
                onClose();
              }
            }}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-rose-500/20 hover:border-rose-500/40 hover:bg-rose-500/5 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 group-hover:scale-110 transition-transform">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Demo Verilerine Sıfırla</h4>
                <p className="text-xs text-slate-400">İlk başlangıç veritabanı durumuna geri döner</p>
              </div>
            </div>
          </button>

        </div>

        <div className="pt-2 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
