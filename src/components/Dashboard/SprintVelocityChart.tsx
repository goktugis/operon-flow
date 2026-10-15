import React, { useState } from 'react';
import { TrendingUp, Calendar } from 'lucide-react';

interface DataPoint {
  day: string;
  planned: number;
  actual: number;
}

const SPRINT_DATA: DataPoint[] = [
  { day: 'Pzt', planned: 12, actual: 14 },
  { day: 'Sal', planned: 24, actual: 26 },
  { day: 'Çar', planned: 40, actual: 38 },
  { day: 'Per', planned: 55, actual: 58 },
  { day: 'Cum', planned: 72, actual: 70 },
  { day: 'Cmt', planned: 85, actual: 88 },
  { day: 'Paz', planned: 100, actual: 95 },
];

export const SprintVelocityChart: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const width = 500;
  const height = 200;
  const padding = 35;

  const maxVal = 100;
  const stepX = (width - padding * 2) / (SPRINT_DATA.length - 1);

  // Generate SVG path points
  const plannedPoints = SPRINT_DATA.map((d, i) => {
    const x = padding + i * stepX;
    const y = height - padding - (d.planned / maxVal) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const actualPoints = SPRINT_DATA.map((d, i) => {
    const x = padding + i * stepX;
    const y = height - padding - (d.actual / maxVal) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  // Gradient area points for actual
  const firstX = padding;
  const lastX = padding + (SPRINT_DATA.length - 1) * stepX;
  const bottomY = height - padding;
  const areaPoints = `${firstX},${bottomY} ${actualPoints} ${lastX},${bottomY}`;

  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-white">Sprint Hızı & Tamamlanma Eğrisi</h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Sprint 26
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Planlanan efor ve kümülatif tamamlanma yüzdesi</p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
            <span className="text-slate-400">Planlanan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
            <span className="text-indigo-300 font-medium">Gerçekleşen (%95)</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-48 overflow-visible"
        >
          <defs>
            <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((val) => {
            const y = height - padding - (val / maxVal) * (height - padding * 2);
            return (
              <g key={val}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={padding - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="10"
                >
                  %{val}
                </text>
              </g>
            );
          })}

          {/* Area under curve */}
          <polygon points={areaPoints} fill="url(#actualGradient)" />

          {/* Planned Line (Dotted Gray) */}
          <polyline
            points={plannedPoints}
            fill="none"
            stroke="#64748b"
            strokeWidth="2"
            strokeDasharray="5 5"
          />

          {/* Actual Line (Glowing Indigo) */}
          <polyline
            points={actualPoints}
            fill="none"
            stroke="#818cf8"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Data Nodes */}
          {SPRINT_DATA.map((d, i) => {
            const x = padding + i * stepX;
            const y = height - padding - (d.actual / maxVal) * (height - padding * 2);
            const isHovered = hoveredIndex === i;

            return (
              <g key={d.day}>
                <text
                  x={x}
                  y={height - 12}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="11"
                  fontWeight={isHovered ? 'bold' : 'normal'}
                >
                  {d.day}
                </text>

                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : 4}
                  fill="#6366f1"
                  stroke="#ffffff"
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  className="transition-all cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredIndex !== null && (
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs shadow-lg flex items-center gap-3 pointer-events-none"
          >
            <span className="font-semibold text-white">{SPRINT_DATA[hoveredIndex].day}:</span>
            <span className="text-slate-300">Planlanan: %{SPRINT_DATA[hoveredIndex].planned}</span>
            <span className="text-indigo-400 font-bold">Gerçekleşen: %{SPRINT_DATA[hoveredIndex].actual}</span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>Sprint Süresi: 10 - 24 Ekim 2026</span>
        </div>
        <div className="flex items-center gap-1 text-emerald-400 font-medium">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Takım hedef hızın %4 önünde</span>
        </div>
      </div>
    </div>
  );
};
