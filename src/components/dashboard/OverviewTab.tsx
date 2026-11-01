'use client';

import React from 'react';
import { DossierReport } from '@/types';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { ConfidenceBadge } from '@/components/ui/Badge';
import {
  Compass,
  FileCheck2,
  Layers,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export function OverviewTab({ dossier }: { dossier: DossierReport }) {

  return (
    <div className="space-y-8">
      {/* Top Grid: Health Score Ring + Archaeological Verdict */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Health Score Gauge */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Overall Repository Health
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Transparent Metric
              </span>
            </div>

            <ScoreRing score={dossier.healthScore} size={190} showCategories={false} />

            <div className="mt-6 p-3 rounded-xl bg-[#090d14] border border-slate-800/80 text-[11px] font-mono text-slate-400">
              <div className="text-slate-300 font-semibold mb-1">
                Scoring Formula Rationale:
              </div>
              <p className="text-slate-400 leading-relaxed">
                {dossier.healthScore.calculationFormula}
              </p>
            </div>
          </div>
        </div>

        {/* Archaeological Verdict & Original Purpose */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-2xl border-slate-800 flex flex-col justify-between">
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Compass className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  Reconstructed Original Intent
                </span>
                <ConfidenceBadge confidence="verified" className="ml-auto" />
              </div>
              <p className="text-white text-sm sm:text-base leading-relaxed bg-[#0a0d15]/80 p-4 rounded-xl border border-slate-800">
                {dossier.archaeologist.originalIntent}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-mono font-bold text-violet-400 uppercase tracking-wider">
                  Historical Excavation Summary
                </span>
                <ConfidenceBadge confidence="inferred" className="ml-auto" />
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {dossier.historian.historicalSummary}
              </p>
            </div>
          </div>

          {/* Quick Stat Pill Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80 mt-4">
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">Created</div>
              <div className="text-xs font-mono text-white font-semibold mt-0.5">
                {formatDate(dossier.createdAt)}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">Last Commit</div>
              <div className="text-xs font-mono text-amber-300 font-semibold mt-0.5">
                {formatDate(dossier.historian.lastCommitDate)}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">Primary Language</div>
              <div className="text-xs font-mono text-cyan-300 font-semibold mt-0.5">
                {dossier.archaeologist.primaryLanguage}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">Peak Era</div>
              <div className="text-xs font-mono text-violet-300 font-semibold mt-0.5">
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
            <span>Category Health Assessment (0 - 100)</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            6 Dimensions Analyzed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dossier.healthScore.categories.map((cat) => {
            const getColor = (s: number) => {
              if (s >= 75) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
              if (s >= 50) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
              if (s >= 30) return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
              return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
            };

            return (
              <div
                key={cat.id}
                className="glass-panel p-5 rounded-xl border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold font-mono text-white">
                      {cat.name}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${getColor(
                        cat.score
                      )}`}
                    >
                      {cat.score} / 100
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full rounded-full transition-all duration-700 bg-amber-400"
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>

                  <div className="text-xs font-medium text-amber-300/90 mb-1">
                    {cat.verdict}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {cat.rationale}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Weight: {cat.weight * 100}%</span>
                  <span>ID: {cat.id}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
