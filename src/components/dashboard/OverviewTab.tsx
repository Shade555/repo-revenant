'use client';

import React from 'react';
import { DossierReport } from '@/types';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { ConfidenceBadge } from '@/components/ui/Badge';
import {
  Compass,
  FileCheck2,
  Layers,
  Calendar,
  Code,
  Flame,
  Activity,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { sound } from '@/lib/audio/sound-synth';

export function OverviewTab({ dossier }: { dossier: DossierReport }) {
  const getCategoryColor = (score: number) => {
    if (score >= 75) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 50) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    if (score >= 30) return 'text-orange-400 border-orange-500/40 bg-orange-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  const getStratumBg = (idx: number) => {
    const bgs = [
      'bg-amber-600/40 border-amber-500/40 text-amber-200',
      'bg-violet-600/40 border-violet-500/40 text-violet-200',
      'bg-cyan-600/40 border-cyan-500/40 text-cyan-200',
      'bg-emerald-600/40 border-emerald-500/40 text-emerald-200',
      'bg-rose-600/40 border-rose-500/40 text-rose-200',
      'bg-blue-600/40 border-blue-500/40 text-blue-200',
    ];
    return bgs[idx % bgs.length];
  };

  return (
    <div className="space-y-8">
      {/* Top Grid: Health Score Ring + Stratum Core Drill + Archaeological Verdict */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Health Score Gauge & Subterranean Core Sample */}
        <div className="lg:col-span-5 bracket-box p-6 rounded-2xl bg-[#080b12] border border-slate-800 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  Overall Repository Health
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                0 - 100 HARNESS SCALE
              </span>
            </div>

            <ScoreRing score={dossier.healthScore} size={180} showCategories={false} />

            {/* Subterranean Stratigraphic Core Sample */}
            <div className="mt-6 pt-4 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-violet-400" />
                  <span>SEDIMENT CORE DRILL SAMPLE</span>
                </span>
                <span className="text-[10px] text-slate-500">6 LAYERS</span>
              </div>

              {/* Cylindrical Rock Strata Visualizer */}
              <div className="w-full h-8 rounded-lg overflow-hidden border border-slate-700/80 flex shadow-inner">
                {dossier.healthScore.categories.map((cat, idx) => (
                  <div
                    key={cat.id}
                    title={`${cat.name}: ${cat.score}/100`}
                    className={`h-full flex-1 border-r border-slate-900 last:border-r-0 flex items-center justify-center text-[10px] font-mono font-bold transition-all hover:scale-105 cursor-pointer ${getStratumBg(
                      idx
                    )}`}
                    onClick={() => sound.playClick(400 + idx * 80)}
                  >
                    {cat.score}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-[#05070c] border border-slate-800/80 text-[11px] font-mono text-slate-400">
              <div className="text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Scoring Formula Transparency:</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                {dossier.healthScore.calculationFormula}
              </p>
            </div>
          </div>
        </div>

        {/* Archaeological Verdict & Reconstructed Intent */}
        <div className="lg:col-span-7 bracket-box p-6 sm:p-7 rounded-2xl bg-[#080b12] border border-slate-800 flex flex-col justify-between shadow-2xl">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2 pb-1 border-b border-slate-800/60">
                <Compass className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  Reconstructed Original Intent
                </span>
                <ConfidenceBadge confidence="verified" className="ml-auto" />
              </div>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed bg-[#05070d] p-4 rounded-xl border border-slate-800/80 font-sans">
                {dossier.archaeologist.originalIntent}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2 pb-1 border-b border-slate-800/60">
                <Layers className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-mono font-bold text-violet-400 uppercase tracking-wider">
                  Historical Excavation Summary
                </span>
                <ConfidenceBadge confidence="inferred" className="ml-auto" />
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans">
                {dossier.historian.historicalSummary}
              </p>
            </div>
          </div>

          {/* Quick Stat Pill Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-slate-800/80 mt-4">
            <div className="p-2.5 rounded-xl bg-[#05070c] border border-slate-800/80">
              <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>GENESIS</span>
              </div>
              <div className="text-xs font-mono text-white font-semibold mt-1">
                {formatDate(dossier.createdAt)}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#05070c] border border-slate-800/80">
              <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                <Flame className="w-3 h-3 text-rose-400" />
                <span>LAST COMMIT</span>
              </div>
              <div className="text-xs font-mono text-amber-300 font-semibold mt-1">
                {formatDate(dossier.historian.lastCommitDate)}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#05070c] border border-slate-800/80">
              <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                <Code className="w-3 h-3 text-cyan-400" />
                <span>PRIMARY LANG</span>
              </div>
              <div className="text-xs font-mono text-cyan-300 font-semibold mt-1">
                {dossier.archaeologist.primaryLanguage}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#05070c] border border-slate-800/80">
              <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                <Cpu className="w-3 h-3 text-violet-400" />
                <span>PEAK ERA</span>
              </div>
              <div className="text-xs font-mono text-violet-300 font-semibold mt-1">
                {dossier.historian.peakActivityYear}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Six Transparent Category Score Panels */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold font-mono text-white flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-amber-400" />
            <span>Categorical Health Breakdown (0 - 100)</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            6 Dimensions Analyzed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dossier.healthScore.categories.map((cat, idx) => {
            return (
              <div
                key={cat.id}
                onMouseEnter={() => sound.playClick(300 + idx * 60)}
                className="bracket-box p-5 rounded-xl bg-[#070910] border border-slate-800/90 flex flex-col justify-between hover:border-amber-500/40 transition-all cursor-default group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold font-mono text-white group-hover:text-amber-300 transition-colors">
                      {cat.name}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border ${getCategoryColor(
                        cat.score
                      )}`}
                    >
                      {cat.score}/100
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {cat.rationale}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-500">Contribution Weight:</span>
                    <span className="text-slate-300 font-bold">{cat.weight}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all"
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
