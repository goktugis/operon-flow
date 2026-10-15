import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  color: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky';
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color,
}) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      text: 'text-indigo-400',
      glow: 'hover:border-indigo-500/40 hover:shadow-indigo-500/10',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      glow: 'hover:border-emerald-500/40 hover:shadow-emerald-500/10',
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'text-amber-400',
      glow: 'hover:border-amber-500/40 hover:shadow-amber-500/10',
    },
    rose: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      text: 'text-rose-400',
      glow: 'hover:border-rose-500/40 hover:shadow-rose-500/10',
    },
    sky: {
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/20',
      text: 'text-sky-400',
      glow: 'hover:border-sky-500/40 hover:shadow-sky-500/10',
    },
  };

  const c = colorMap[color];

  return (
    <div
      className={`p-5 rounded-2xl bg-slate-900/60 border ${c.border} transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 ${c.glow}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={`p-2 rounded-xl ${c.bg} ${c.text}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {value}
        </h3>
        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend.positive
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
    </div>
  );
};
