'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HealthScore } from '@/types';
import { AlertTriangle, CheckCircle2, History } from 'lucide-react';

interface ScoreRingProps {
  score: HealthScore;
  size?: number;
  strokeWidth?: number;
  showCategories?: boolean;
}

export function ScoreRing({
  score,
  size = 180,
  strokeWidth = 12,
  showCategories = false,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, score.total));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getColor = (val: number) => {
    if (val >= 75) return '#10b981'; // Emerald
    if (val >= 50) return '#fbbf24'; // Marigold Gold
    if (val >= 30) return '#f97316'; // Amber / Orange
    return '#ef4444'; // Red
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Preserved':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'Dormant Classic':
      case 'Moderate Stagnation':
        return <History className="w-4 h-4 text-amber-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
    }
  };

  const ringColor = getColor(score.total);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.07)"
            strokeWidth={strokeWidth}
          />
          {/* Progress Ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 8px ${ringColor}80)`,
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
          <span className="text-4xl font-extrabold tracking-tight text-white font-mono">
            {score.total}
          </span>
          <span className="text-xs uppercase tracking-widest text-slate-400 font-mono mt-0.5">
            / 100
          </span>
          <div className="flex items-center gap-1 mt-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700/60">
            {getStatusIcon(score.status)}
            <span style={{ color: ringColor }}>{score.status}</span>
          </div>
        </div>
      </div>

      {showCategories && (
        <div className="w-full mt-6 space-y-3">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
            Health Vector Breakdown
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {score.categories.map((cat) => {
              const catColor = getColor(cat.score);
              return (
                <div
                  key={cat.id}
                  className="p-2.5 rounded-lg bg-[#0e121a]/90 border border-slate-800/80 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">{cat.name}</span>
                    <span className="font-mono font-bold" style={{ color: catColor }}>
                      {cat.score}%
                    </span>
                  </div>
                  {/* Category mini bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1.5">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${cat.score}%`,
                        backgroundColor: catColor,
                        boxShadow: `0 0 6px ${catColor}60`,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{cat.verdict}</span>
                    <span className="text-[10px] text-slate-500">wt {cat.weight * 100}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
