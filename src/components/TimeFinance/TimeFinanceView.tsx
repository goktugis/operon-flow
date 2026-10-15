import React from 'react';
import { useApp } from '../../context/AppContext';
import { PomodoroTimer } from './PomodoroTimer';
import { formatCurrency } from '../../utils/formatters';
import { Wallet, TrendingDown, DollarSign, Clock, Users, ArrowUpRight } from 'lucide-react';

export const TimeFinanceView: React.FC = () => {
  const { tasks, teamMembers } = useApp();

  const totalSprintBudget = 250000; // ₺ 250.000

  // Calculate actual costs per member
  const memberCosts = teamMembers.map((member) => {
    const memberTasks = tasks.filter((t) => t.assigneeId === member.id);
    const loggedHours = memberTasks.reduce((acc, t) => acc + t.loggedHours, 0);
    const estimatedHours = memberTasks.reduce((acc, t) => acc + t.estimatedHours, 0);
    const totalCost = loggedHours * member.hourlyRate;
    return {
      member,
      taskCount: memberTasks.length,
      loggedHours,
      estimatedHours,
      totalCost,
    };
  });

  const totalBudgetSpent = memberCosts.reduce((acc, mc) => acc + mc.totalCost, 0);
  const remainingBudget = Math.max(0, totalSprintBudget - totalBudgetSpent);
  const totalLoggedHours = memberCosts.reduce((acc, mc) => acc + mc.loggedHours, 0);
  const totalEstimatedHours = memberCosts.reduce((acc, mc) => acc + mc.estimatedHours, 0);
  const budgetBurnPercentage = Math.round((totalBudgetSpent / totalSprintBudget) * 100);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Finansal Kaynak & Zaman Optimizasyonu</h2>
            <p className="text-xs text-slate-400">Gerçek zamanlı harcanan saatler, adam/gün maliyetleri ve bütçe tüketim hızı.</p>
          </div>
        </div>
      </div>

      {/* KPI Cards: Budget, Spent, Remaining, Hours */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Toplam Sprint Bütçesi</span>
          <h3 className="text-2xl font-black text-white mt-2">{formatCurrency(totalSprintBudget)}</h3>
          <p className="text-xs text-slate-500 mt-1">Sabit ayrılan mühendislik havuzu</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-indigo-500/20">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Gerçekleşen Harcama</span>
          <h3 className="text-2xl font-black text-indigo-300 mt-2">{formatCurrency(totalBudgetSpent)}</h3>
          <p className="text-xs text-slate-400 mt-1">%{budgetBurnPercentage} bütçe tüketildi</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-emerald-500/20">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Kalan Bütçe Rezervi</span>
          <h3 className="text-2xl font-black text-emerald-300 mt-2">{formatCurrency(remainingBudget)}</h3>
          <p className="text-xs text-slate-400 mt-1">Güvenli marj dahilinde</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Harcanan Efor</span>
          <h3 className="text-2xl font-black text-white mt-2">{totalLoggedHours} / {totalEstimatedHours} sa</h3>
          <p className="text-xs text-slate-500 mt-1">Ortalama ₺ 1.610 / saat</p>
        </div>

      </div>

      {/* Main Split: Pomodoro vs Team Cost Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Pomodoro Focus Timer (5 cols) */}
        <div className="lg:col-span-5">
          <PomodoroTimer />
        </div>

        {/* Right Column: Detailed Cost Breakdown Table (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>Mühendis Efor & Maliyet Tablosu</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Rol bazlı saatlik ücretler ve sprint gerçekleşmeleri</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Mühendis</th>
                    <th className="pb-3">Saatlik Ücret</th>
                    <th className="pb-3">Harcanan</th>
                    <th className="pb-3 text-right">Toplam Maliyet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {memberCosts.map(({ member, loggedHours, estimatedHours, totalCost }) => (
                    <tr key={member.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 pr-2">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-7 h-7 rounded-full object-cover border border-slate-700"
                          />
                          <div>
                            <p className="font-semibold text-slate-200">{member.name}</p>
                            <p className="text-[10px] text-slate-400">{member.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-slate-300 font-mono">
                        {formatCurrency(member.hourlyRate)}/sa
                      </td>
                      <td className="py-3 text-slate-300">
                        <span>{loggedHours} sa</span>
                        <span className="text-slate-500 text-[10px]"> ({estimatedHours} plan)</span>
                      </td>
                      <td className="py-3 text-right font-bold text-white font-mono">
                        {formatCurrency(totalCost)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>ROI Tahmini: %340 Sprint Getirisi</span>
            <span className="text-emerald-400 font-semibold">Tüm ödemeler onaylandı</span>
          </div>

        </div>

      </div>

    </div>
  );
};
