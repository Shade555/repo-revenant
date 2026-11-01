'use client';

import React from 'react';
import { DossierReport, PriorityTask } from '@/types';
import {
  Compass,
  Terminal,
  ListOrdered,
  Layers,
  ArrowRight,
  GitPullRequest,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { sound } from '@/lib/audio/sound-synth';

export function RoadmapTab({ dossier }: { dossier: DossierReport }) {
  const { revivalist } = dossier;

  const getDifficultyBadge = (diff: PriorityTask['difficulty']) => {
    switch (diff) {
      case 'Novice':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40';
      case 'Intermediate':
        return 'bg-amber-950/60 text-amber-300 border-amber-500/40';
      case 'Advanced':
        return 'bg-violet-950/60 text-violet-300 border-violet-500/40';
      default:
        return 'bg-rose-950/60 text-rose-300 border-rose-500/40';
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
      <div className="bracket-box p-6 sm:p-7 rounded-2xl bg-[#080b12] border border-emerald-500/40 relative overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.12)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 blur-[80px] pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                THE REVIVALIST ALCHEMICAL BLUEPRINT
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30">
              ACTIONABLE ROADMAP
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-mono text-white">
            Reconstructed Project Destiny & Future
          </h3>

          <p className="text-sm text-slate-200 leading-relaxed bg-[#05070c] p-4 rounded-xl border border-slate-800 font-sans">
            {revivalist.vision}
          </p>
        </div>
      </div>

      {/* Top 5 Highest-Priority Revivals */}
      <div className="bracket-box p-6 sm:p-8 rounded-2xl bg-[#080b12] border border-slate-800 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-800 gap-2">
          <div>
            <h3 className="text-base font-bold font-mono text-white flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-amber-400" />
              <span>Five Highest-Priority Resurrection Tasks</span>
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Ranked in execution order based on blocker severity, dependency graph, and return-on-investment.
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 w-fit">
            CURATED ORDER
          </span>
        </div>

        <div className="space-y-5">
          {revivalist.topPriorities.map((task, idx) => (
            <div
              key={task.rank}
              onClick={() => sound.playClick(600 + idx * 80)}
              className="p-5 rounded-xl bg-[#05070c] border border-slate-800/90 hover:border-slate-700 transition-all space-y-3.5 shadow-md cursor-default group"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-mono font-bold flex items-center justify-center">
                    0{task.rank}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold font-mono text-white group-hover:text-amber-300 transition-colors">
                    {task.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2.5">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${getDifficultyBadge(
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

              <p className="text-xs text-slate-300 leading-relaxed font-sans">{task.description}</p>

              {/* Implementation Steps */}
              <div className="p-4 rounded-lg bg-[#020408] border border-slate-800/80 space-y-2">
                <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Recommended Execution Steps:</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                  {task.implementationSteps.map((step, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-2">
                      <span className="text-amber-500 font-mono select-none">▸</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {task.supportingEvidence && (
                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 pt-1">
                  <span className="text-slate-500">Excavation Evidence:</span>
                  <span className="text-amber-400/90 italic font-mono">
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
        <div className="lg:col-span-6 bracket-box p-6 rounded-2xl bg-[#080b12] border border-slate-800 shadow-2xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                Three-Phase Resurrection Protocol
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">CHRONO-ALCHEMICAL FORGE</span>
          </div>

          <div className="space-y-4">
            {revivalist.suggestedRoadmap.map((phase) => (
              <div
                key={phase.phase}
                className="p-4 rounded-xl bg-[#05070c] border border-slate-800/90 space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-400 font-bold uppercase tracking-wider">
                    Phase {phase.phase}: {phase.title}
                  </span>
                  <span className="text-slate-500 text-[10px]">{phase.timeframe}</span>
                </div>

                <ul className="space-y-1.5 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                  {phase.tasks.map((task, tIdx) => (
                    <li key={tIdx} className="flex items-start gap-2">
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 10-Minute Newcomer Onboarding Guide */}
        <div className="lg:col-span-6 bracket-box p-6 rounded-2xl bg-[#080b12] border border-slate-800 shadow-2xl space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                  Newcomer 10-Minute Onboarding Compendium
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                FAST-TRACK
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans mb-3">
              {revivalist.newcomerGuide.summary}
            </p>

            {/* Setup Steps */}
            <div className="p-3.5 rounded-xl bg-[#020408] border border-slate-800/90 space-y-2 mb-3">
              <div className="text-[10px] font-mono text-amber-400 uppercase font-semibold">
                Setup & Bootstrap Steps:
              </div>
              <ol className="space-y-1 text-xs font-mono text-slate-200">
                {revivalist.newcomerGuide.setupSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 select-none">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Verification Command */}
            <div className="p-2.5 rounded-lg bg-[#05070c] border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center justify-between mb-3">
              <span className="text-slate-500 text-[10px]">VERIFY:</span>
              <code>{revivalist.newcomerGuide.firstVerificationCommand}</code>
            </div>

            {/* Curated Good First Contributions */}
            <div className="mt-4 space-y-2">
              <div className="text-[11px] font-mono text-amber-400 font-bold uppercase flex items-center gap-1.5">
                <GitPullRequest className="w-3.5 h-3.5 text-amber-400" />
                <span>Curated Good First Contributions:</span>
              </div>
              <div className="space-y-2">
                {revivalist.goodFirstContributions.map((fc, fcIdx) => (
                  <div
                    key={fcIdx}
                    className="p-3 rounded-lg bg-[#05070c] border border-slate-800/90 space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-white">
                      <span>{fc.title}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-sans">{fc.description}</p>
                    {fc.filesToTouch && fc.filesToTouch.length > 0 && (
                      <div className="text-[10px] font-mono text-slate-500">
                        Touch: {fc.filesToTouch.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>TESTED REPRODUCIBILITY GUARANTEE</span>
            </span>
            <span className="text-slate-400">READY FOR FORK</span>
          </div>
        </div>
      </div>
    </div>
  );
}
