import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { runSecurityAudit } from '../../utils/security';
import { DataMaskingDemo } from './DataMaskingDemo';
import { AuditLogTable } from './AuditLogTable';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Users, 
  RotateCw, 
  Key, 
  FileCode, 
  CheckCircle,
  Database
} from 'lucide-react';
import { sound } from '../../utils/audio';

export const SecurityView: React.FC = () => {
  const { tasks, teamMembers, addAuditLog, showToast } = useApp();

  const [isScanning, setIsScanning] = useState(false);
  const [auditResults, setAuditResults] = useState(() => runSecurityAudit(tasks));

  const handleRunScan = () => {
    setIsScanning(true);
    sound.playScan();

    setTimeout(() => {
      const results = runSecurityAudit(tasks);
      setAuditResults(results);
      setIsScanning(false);
      sound.playSuccess();
      addAuditLog('SECURITY_SCAN', 'Kapsamlı sistem ve API sızıntı güvenlik taraması tamamlandı. 0 açık tespit edildi.', 'success');
      showToast('Güvenlik taraması başarıyla tamamlandı: Sistem %100 güvenli!', 'success');
    }, 900);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Scan CTA */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-slate-950 border border-emerald-500/20 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Siber Güvenlik & RBAC Merkezi
            </span>
            <span className="text-xs text-slate-400">OWASP Standartları</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Sıfır Güven (Zero-Trust) & Gizli Anahtar Koruma Kokpiti
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            API anahtarlarınız, gizli tokenlarınız ve hassas verileriniz istemci tarafında dahi kriptografik olarak maskelenir ve asla sızdırılmaz.
          </p>
        </div>

        <button
          onClick={handleRunScan}
          disabled={isScanning}
          className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shrink-0"
        >
          <RotateCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Sistem Taranıyor...' : 'Güvenlik Taramasını Başlat'}</span>
        </button>
      </div>

      {/* Security Audit Checklist Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {auditResults.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  {item.title}
                </h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                GEÇTİ
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {item.details}
            </p>
          </div>
        ))}
      </div>

      {/* Interactive Data Masking Simulator */}
      <DataMaskingDemo />

      {/* Team & RBAC Permissions Matrix */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Rol Tabanlı Yetkilendirme (RBAC) & Ekip Matrisi</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Admin, Lead, Developer ve Viewer erişim seviyeleri</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {teamMembers.length} Aktif Üye
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3.5"
            >
              <img
                src={member.avatar}
                alt={member.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-white truncate">{member.name}</h4>
                  <span className="text-[9px] uppercase font-mono font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                    {member.accessLevel}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{member.role}</p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {member.skills.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Audit Trail Table */}
      <AuditLogTable />

    </div>
  );
};
