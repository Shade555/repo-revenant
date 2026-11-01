'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  GitBranch,
  Flame,
  Sparkles,
  Radio,
  ShieldCheck,
  Compass,
  CheckCircle2,
  Lock,
  Zap,
} from 'lucide-react';
import { sound } from '@/lib/audio/sound-synth';
import { cn } from '@/lib/utils';

interface StratumPhase {
  stratum: string;
  depth: string;
  title: string;
  actor: string;
  mastraStep: string;
  desc: string;
  icon: typeof Globe;
  accentColor: string;
  badgeColor: string;
  borderColor: string;
  inputArtifact: string;
  outputArtifact: string;
  securityPact: string;
}

const STRATA: StratumPhase[] = [
  {
    stratum: 'STRATUM 0',
    depth: '0m [SURFACE INGESTION]',
    title: 'Target URI Handshake & Barrier',
    actor: 'THE SUMMONER',
    mastraStep: 'validateAndInitializeStep',
    desc: 'Validates target repository URL format, performs GitHub API handshake, verifies public repository visibility, and initialises the isolated telemetry harness.',
    icon: Globe,
    accentColor: 'text-amber-400',
    badgeColor: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    borderColor: 'border-amber-500/40',
    inputArtifact: 'Public GitHub URL + Rate Limit Check',
    outputArtifact: 'Validated Repo Context & Commit Range',
    securityPact: 'Strict read-only GitHub API ingestion; no auth write permissions asked.',
  },
  {
    stratum: 'STRATUM I',
    depth: '-180m [PARALLEL EXCAVATION]',
    title: 'Dual-Core Chrono & AST Drilling',
    actor: 'HISTORIAN & ARCHAEOLOGIST',
    mastraStep: 'parallelHistoricalExcavationStep',
    desc: 'Simultaneously drills through git commit logs, author turnover, and issue closures while deconstructing package manifests, language topology, and primary entry points.',
    icon: GitBranch,
    accentColor: 'text-violet-400',
    badgeColor: 'border-violet-500/30 bg-violet-500/10 text-violet-300',
    borderColor: 'border-violet-500/40',
    inputArtifact: 'Raw commit log arrays + Tree directory manifests',
    outputArtifact: 'Chronological timeline + Original intent statement',
    securityPact: 'Parallel execution forks with strict memory boundaries.',
  },
  {
    stratum: 'STRATUM II',
    depth: '-420m [PATHOLOGY CHAMBER]',
    title: 'Static Bitrot & Necrosis Triage',
    actor: 'THE EXORCIST',
    mastraStep: 'exorciseBitrotStep',
    desc: 'Analyzes manifest version deltas against known compiler shifts, locates abandoned TODO/FIXME markers in the source AST, and verifies CI/CD pipeline absence.',
    icon: Flame,
    accentColor: 'text-rose-400',
    badgeColor: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
    borderColor: 'border-rose-500/40',
    inputArtifact: 'Manifest dependencies & code comment AST tokens',
    outputArtifact: 'Bitrot severity score + Outdated package delta matrix',
    securityPact: 'Zero remote code execution. No arbitrary repository scripts are ever run.',
  },
  {
    stratum: 'STRATUM III',
    depth: '-690m [ALCHEMICAL FORGE]',
    title: 'Resurrection Strategy & Onboarding',
    actor: 'THE REVIVALIST',
    mastraStep: 'synthesizeRevivalPlanStep',
    desc: 'Synthesizes all prior excavated artifacts into an actionable 3-phase roadmap, ranks the Top 5 highest-ROI remediation tasks, and constructs a 10-minute newcomer guide.',
    icon: Sparkles,
    accentColor: 'text-emerald-400',
    badgeColor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    borderColor: 'border-emerald-500/40',
    inputArtifact: 'Excavated timeline, tech stack, and bitrot findings',
    outputArtifact: 'Phase 1-3 roadmap + 5 prioritized implementation tasks',
    securityPact: 'Evidence-grounded recommendations only; zero speculative fabrications.',
  },
  {
    stratum: 'STRATUM IV',
    depth: '-950m [SPECTRAL CONCLAVE]',
    title: 'Dossier Synthesis & Séance Chamber',
    actor: 'THE COUNCIL',
    mastraStep: 'compileDossierAndUnlockSeance',
    desc: 'Computes the transparent 6-category Health Score, binds factual citations to the Evidence Ledger, stores the investigation in MongoDB Atlas, and opens the Developer Séance.',
    icon: Radio,
    accentColor: 'text-cyan-400',
    badgeColor: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
    borderColor: 'border-cyan-500/40',
    inputArtifact: 'Consolidated agent outputs & evidence anchors',
    outputArtifact: 'Complete Revival Dossier + Interactive Séance Session',
    securityPact: 'Cryptographic grounding stamps for verified findings vs inferences.',
  },
];

export function WorkflowVisualizer() {
  const [activeStratum, setActiveStratum] = useState<StratumPhase>(STRATA[1]);

  const handleStratumClick = (stratum: StratumPhase, index: number) => {
    sound.playClick(500 + index * 100);
    setActiveStratum(stratum);
  };

  return (
    <section id="workflow" className="py-24 border-t border-slate-800/80 relative bg-[#06080e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-mono text-violet-300 mb-3">
            <GitBranch className="w-3.5 h-3.5 text-violet-400" />
            <span>EXCAVATION PIPELINE STRATIGRAPHY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            How The Harness Drills Through Code History
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            From initial URL handshake to the subterranean Séance chamber. Every phase is coordinated
            via a typed Mastra workflow with deterministic contracts.
          </p>
        </div>

        {/* Stratigraphic Drill Pipeline Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Stratum Flow List */}
          <div className="lg:col-span-6 space-y-3 relative">
            {/* Vertical Subterranean Core Guide Line */}
            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-amber-500/40 via-violet-500/40 via-rose-500/40 via-emerald-500/40 to-cyan-500/40 hidden sm:block pointer-events-none" />

            {STRATA.map((item, index) => {
              const Icon = item.icon;
              const isSelected = activeStratum.stratum === item.stratum;

              return (
                <div
                  key={item.stratum}
                  onClick={() => handleStratumClick(item, index)}
                  className={cn(
                    'relative sm:pl-14 p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer group',
                    isSelected
                      ? `${item.borderColor} bg-[#0c101b] shadow-[0_0_30px_rgba(0,0,0,0.6)]`
                      : 'border-slate-800/80 bg-[#080b12]/60 hover:border-slate-700 hover:bg-[#0a0e18]'
                  )}
                >
                  {/* Stratum Depth Node Marker */}
                  <div
                    className={cn(
                      'hidden sm:flex absolute left-3 top-5 w-6 h-6 rounded-full border items-center justify-center text-[10px] font-mono font-bold transition-all',
                      isSelected
                        ? `${item.borderColor} bg-slate-900 ${item.accentColor} shadow-[0_0_10px_currentColor]`
                        : 'border-slate-800 bg-[#07090e] text-slate-500 group-hover:border-slate-600'
                    )}
                  >
                    0{index}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={cn('text-xs font-mono font-bold', item.accentColor)}>
                        {item.stratum}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {item.depth}
                      </span>
                    </div>

                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold border',
                        item.badgeColor
                      )}
                    >
                      {item.actor}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-white font-mono font-bold text-sm sm:text-base">
                    <Icon className={cn('w-4 h-4 shrink-0', item.accentColor)} />
                    <span>{item.title}</span>
                  </div>

                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right: Detailed Stratum Telemetry & Contract Box */}
          <div className="lg:col-span-6 sticky top-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStratum.stratum}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  'rounded-2xl border p-6 sm:p-7 bg-[#090d16] relative overflow-hidden shadow-2xl',
                  activeStratum.borderColor
                )}
              >
                {/* Stratum Header */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn('text-xs font-mono font-bold', activeStratum.accentColor)}>
                        {activeStratum.stratum}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {'// '}{activeStratum.depth}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold font-mono text-white">
                      {activeStratum.title}
                    </h3>
                  </div>

                  <div
                    className={cn(
                      'p-3 rounded-xl border bg-slate-900/80',
                      activeStratum.borderColor,
                      activeStratum.accentColor
                    )}
                  >
                    <activeStratum.icon className="w-6 h-6" />
                  </div>
                </div>

                {/* Workflow Function Binding */}
                <div className="my-5 p-3 rounded-xl bg-[#06080e] border border-slate-800 font-mono text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>MASTRA WORKFLOW FUNCTION:</span>
                  </div>
                  <span className="text-amber-300 font-bold">
                    {activeStratum.mastraStep}()
                  </span>
                </div>

                {/* Data Contracts In/Out */}
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-[#070910] border border-slate-800/80 space-y-1">
                    <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1.5">
                      <Compass className="w-3 h-3 text-amber-400" />
                      <span>INGESTION ARTIFACT</span>
                    </div>
                    <div className="text-xs font-mono text-slate-200">
                      {activeStratum.inputArtifact}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#070910] border border-slate-800/80 space-y-1">
                    <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>EXCAVATED DELIVERABLE</span>
                    </div>
                    <div className="text-xs font-mono text-slate-200">
                      {activeStratum.outputArtifact}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#070910] border border-slate-800/80 space-y-1">
                    <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-cyan-400" />
                      <span>ISOLATION & SECURITY PACT</span>
                    </div>
                    <div className="text-xs text-slate-400 leading-relaxed">
                      {activeStratum.securityPact}
                    </div>
                  </div>
                </div>

                {/* Footer Assurance */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>DETERMINISTIC RETRY PROTOCOL</span>
                  <span className="text-emerald-400">ACTIVE</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Technical Guarantee Banner */}
        <div className="mt-16 p-5 rounded-2xl bg-[#080b12] border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Strict Zero-RCE Security Standard
              </h5>
              <p className="text-xs text-slate-400 mt-0.5">
                RepoRevenant inspects ASTs, manifests, and commit objects statically. Untrusted build scripts or package hooks are NEVER invoked on the host machine.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Air-Gapped Static Analysis</span>
          </div>
        </div>
      </div>
    </section>
  );
}
