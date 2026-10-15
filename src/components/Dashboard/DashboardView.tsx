import React from 'react';
import { useApp } from '../../context/AppContext';
import { KpiCard } from './KpiCard';
import { SprintVelocityChart } from './SprintVelocityChart';
import { EffortDistributionChart } from './EffortDistributionChart';
import { RecentActivityList } from './RecentActivityList';
import { 
  CheckCircle2, 
  Flame, 
  Wallet, 
  ShieldCheck, 
  Sparkles, 
  Plus, 
  ArrowUpRight,
  Users
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const DashboardView: React.FC = () => {
  const { tasks, teamMembers, setActiveTab, setIsNewTaskModalOpen } = useApp();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const criticalTasks = tasks.filter((t) => t.priority === 'critical' && t.status !== 'done').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate total logged hours & cost
  const totalLoggedHours = tasks.reduce((sum, t) => sum + t.loggedHours, 0);
  const totalEstimatedHours = tasks.reduce((sum, t) => sum + t.estimatedHours, 0);

  const totalBudgetSpent = tasks.reduce((sum, task) => {
    const member = teamMembers.find((m) => m.id === task.assigneeId);
    const rate = member ? member.hourlyRate : 1500;
    return sum + task.loggedHours * rate;
  }, 0);

  return (
    <div className="space-y-6">
      
      {/* Hero Executive Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-slate-950 border border-indigo-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-60 h-60 rounded-full bg-sky-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Mühendislik Operasyon Kokpiti
              </span>
              <span className="text-xs text-slate-400">Sprint 26 • Canlı İzleme</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Hoş Geldiniz, <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-200 bg-clip-text text-transparent">Göktuğ</span>
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Tüm ekipler senkronize. <span className="text-emerald-400 font-semibold">%95 sprint tamamlama</span> ritmi ile hedeflerin önündesiniz. Hiçbir güvenlik sızıntısı veya kritik blokaj bulunmuyor.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('ai_assistant')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-indigo-500/30 text-indigo-300 hover:text-white hover:bg-indigo-950/40 text-xs font-semibold shadow-lg transition-all"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Operon AI Asistan</span>
            </button>
            <button
              onClick={() => setIsNewTaskModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Görev Oluştur</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Sprint Tamamlanma"
          value={`%${completionRate}`}
          subtitle={`${completedTasks} / ${totalTasks} Görev Bitti`}
          icon={CheckCircle2}
          color="emerald"
          trend={{ value: '+12% bu hafta', positive: true }}
        />
        <KpiCard
          title="Aktif & Kritik Yük"
          value={`${inProgressTasks} Görev`}
          subtitle={`${criticalTasks} Kritik Öncelikli Bekliyor`}
          icon={Flame}
          color={criticalTasks > 0 ? 'rose' : 'sky'}
          trend={{ value: criticalTasks > 0 ? 'Dikkat' : 'Dengeli', positive: criticalTasks === 0 }}
        />
        <KpiCard
          title="Tüketilen Bütçe"
          value={formatCurrency(totalBudgetSpent)}
          subtitle={`${totalLoggedHours} sa / ${totalEstimatedHours} sa Planlanan`}
          icon={Wallet}
          color="indigo"
          trend={{ value: 'Bütçe Dahilinde', positive: true }}
        />
        <KpiCard
          title="Sistem Güvenlik İndeksi"
          value="%100"
          subtitle="Sıfır Açık • Korumalı API & Veriler"
          icon={ShieldCheck}
          color="indigo"
          trend={{ value: 'OWASP Onaylı', positive: true }}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SprintVelocityChart />
        <EffortDistributionChart />
      </div>

      {/* Team Workload & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Team Members Workload Matrix */}
        <div className="lg:col-span-1 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-semibold text-white">Ekip & Kaynak Dağılımı</h4>
              <p className="text-xs text-slate-400 mt-0.5">Mühendis kapasite doluluk oranları</p>
            </div>
            <div className="p-2 rounded-xl bg-slate-800/60 text-slate-400">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-3.5">
            {teamMembers.map((member) => {
              const memberTasks = tasks.filter((t) => t.assigneeId === member.id && t.status !== 'done');
              return (
                <div key={member.id} className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/50">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-200 truncate">{member.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{member.role}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-slate-200">%{member.currentLoad}</span>
                      <p className="text-[10px] text-slate-500">{memberTasks.length} aktif görev</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      style={{ width: `${member.currentLoad}%` }}
                      className={`h-full rounded-full ${
                        member.currentLoad > 80
                          ? 'bg-rose-500'
                          : member.currentLoad > 60
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setActiveTab('security_team')}
            className="w-full mt-4 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-xs font-medium text-slate-300 hover:text-white border border-slate-700/60 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Ekip ve Yetki Yönetimini İncele</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live Activity Stream */}
        <div className="lg:col-span-2">
          <RecentActivityList />
        </div>

      </div>

    </div>
  );
};
