'use client';

import React from 'react';
import { DossierReport, PriorityTask } from '@/types';
import {
  Sparkles,
  Compass,
  Terminal,
  ListOrdered,
} from 'lucide-react';

export function RoadmapTab({ dossier }: { dossier: DossierReport }) {
  const { revivalist } = dossier;

  const getDifficultyBadge = (diff: PriorityTask['difficulty']) => {
    switch (diff) {
      case 'Novice':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30';
      case 'Intermediate':
        return 'bg-amber-950/60 text-amber-300 border-amber-500/30';
      case 'Advanced':
        return 'bg-violet-950/60 text-violet-300 border-violet-500/30';
      default:
        return 'bg-rose-950/60 text-rose-300 border-rose-500/30';
    }
  };

  const getImpactBadge = (impact: PriorityTask['impact']) => {
    switch (impact) {
      case 'Critical':
        return 'text-rose-400';
      case 'High':
        return 'text-amber-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-8">
      {/* Reconstructed Vision Banner */}
      <div className="glass-panel p-6 sm:p-7 rounded-2xl border-emerald-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 blur-[80px] pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              The Revivalist Vision
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-mono text-white">
            Reconstructed Project Future
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed bg-[#0a0d15]/80 p-4 rounded-xl border border-slate-800">
            {revivalist.vision}
          </p>
        </div>
      </div>

      {/* Top 5 Highest-Priority Revivals */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-slate-800">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold font-mono text-white flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-amber-400" />
              <span>Five Highest-Priority Resurrection Tasks</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked in execution order based on blocker severity and return-on-investment.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {revivalist.topPriorities.map((task) => (
            <div
              key={task.rank}
              className="p-5 rounded-xl bg-[#090d15] border border-slate-800/90 hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-mono font-bold flex items-center justify-center">
                    0{task.rank}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold font-mono text-white">
                    {task.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-mono uppercase border ${getDifficultyBadge(
                      task.difficulty
                    )}`}
                  >
                    {task.difficulty}
                  </span>
                  <span className={`text-xs font-mono font-bold ${getImpactBadge(task.impact)}`}>
                    ★ {task.impact} Impact
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{task.description}</p>

              {/* Implementation Steps */}
              <div className="p-3.5 rounded-lg bg-[#07090f] border border-slate-800/80 space-y-1.5">
                <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
                  Recommended Implementation Steps:
                </div>
                <ul className="space-y-1 text-xs text-slate-300">
                  {task.implementationSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-500 font-mono">▸</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {task.supportingEvidence && (
                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 pt-1">
                  <span className="text-slate-500">Supporting Evidence:</span>
                  <span className="text-amber-400/90 italic">
                    {task.supportingEvidence}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3-Phase Roadmap & Newcomer Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Roadmap Phases */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border-slate-800 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              Strategic Revival Roadmap
            </h3>
          </div>

          <div className="space-y-4">
            {revivalist.suggestedRoadmap.map((phase) => (
              <div
                key={phase.phase}
                className="p-4 rounded-xl bg-[#090d15] border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                    {phase.phase} • {phase.timeframe}
                  </span>
                </div>
                <h4 className="text-sm font-bold font-mono text-white">
                  {phase.title}
                </h4>
                <ul className="space-y-1 text-xs text-slate-400">
                  {phase.tasks.map((t, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 10-Minute Newcomer Onboarding Guide */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border-slate-800 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              10-Minute Newcomer Guide
            </h3>
          </div>

          <div className="p-4 rounded-xl bg-[#090d15] border border-slate-800 space-y-3">
            <p className="text-xs text-slate-300 leading-relaxed">
              {revivalist.newcomerGuide.summary}
            </p>

            <div className="space-y-1.5">
              <div className="text-[11px] font-mono text-slate-400 uppercase">
                Prerequisites:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {revivalist.newcomerGuide.prerequisites.map((p, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="text-[11px] font-mono text-slate-400 uppercase">
                Setup Steps:
              </div>
              <div className="p-3 rounded-lg bg-[#06080d] border border-slate-800 font-mono text-xs text-amber-300 space-y-1 overflow-x-auto">
                {revivalist.newcomerGuide.setupSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-slate-600 select-none">$</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <div className="text-[11px] font-mono text-slate-400 uppercase mb-1">
                First Verification Command:
              </div>
              <div className="p-2.5 rounded-lg bg-[#06080d] border border-emerald-500/30 font-mono text-xs text-emerald-400 flex items-center gap-2">
                <span className="text-slate-600 select-none">#</span>
                <span>{revivalist.newcomerGuide.firstVerificationCommand}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
