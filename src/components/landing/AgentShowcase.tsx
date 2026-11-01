'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
  History,
  Pickaxe,
  Flame,
  Sparkles,
  FileCode,
  CheckCircle2,
  Terminal,
  Activity,
  Cpu,
  Radio,
  Sliders,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { sound } from '@/lib/audio/sound-synth';

interface AgentSpec {
  id: string;
  name: string;
  role: string;
  badge: string;
  frequency: string;
  register: string;
  icon: typeof Crown;
  colorName: string;
  borderColor: string;
  glowColor: string;
  accentColor: string;
  badgeBorder: string;
  asciiSigil: string[];
  summary: string;
  inputs: string[];
  outputs: string[];
  telemetryLogs: string[];
  quote: string;
}

const AGENTS: AgentSpec[] = [
  {
    id: 'summoner',
    name: 'THE SUMMONER',
    role: 'Central Agent Orchestrator',
    badge: 'ORCHESTRATION MASTER',
    frequency: '13.37 MHz',
    register: '0x00A1',
    icon: Crown,
    colorName: 'amber',
    borderColor: 'border-amber-500/50',
    glowColor: 'from-amber-500/15 via-amber-950/20 to-transparent',
    accentColor: 'text-amber-400',
    badgeBorder: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    asciiSigil: [
      '    ▲    ',
      '  ◄ ⬡ ►  ',
      '    ▼    ',
      '[SOVEREIGN]',
    ],
    summary:
      'Coordinates the multi-agent investigation workflow, manages parallel agent pipelines, enforces data contracts, and synthesizes the final Revival Dossier.',
    inputs: [
      'Public GitHub Repository URL',
      'Optional GitHub Token (higher rate limits)',
      'Deterministic execution timeout configuration',
    ],
    outputs: [
      'Validated metadata & file trees',
      'Revival Dossier Synthesis Report',
      'MongoDB persistent investigation record',
    ],
    telemetryLogs: [
      '[0x00A1] INGESTING TARGET GITHUB REPOSITORY URI...',
      '[0x00A2] COMMENCING PARALLEL FORK: HISTORIAN & ARCHAEOLOGIST...',
      '[0x00A3] AGGREGATING INTERMEDIATE FINDINGS INTO EVIDENCE RETRIEVER...',
      '[0x00A4] SUMMONING EXORCIST FOR ISOLATED STATIC BITROT TRIAGE...',
      '[0x00A5] CONVERGING EVIDENCE INTO THE REVIVALIST BLUEPRINT FORGE.',
    ],
    quote:
      'I awaken the dormant watchers and command the synthesis of forgotten wisdom.',
  },
  {
    id: 'historian',
    name: 'THE HISTORIAN',
    role: 'Chronological Archaeology',
    badge: 'TIMELINE & COMMITS',
    frequency: '42.08 MHz',
    register: '0x01B2',
    icon: History,
    colorName: 'violet',
    borderColor: 'border-violet-500/50',
    glowColor: 'from-violet-500/15 via-violet-950/20 to-transparent',
    accentColor: 'text-violet-400',
    badgeBorder: 'border-violet-500/30 bg-violet-500/10 text-violet-300',
    asciiSigil: [
      ' ┌─┐ ┌─┐ ',
      ' │ ∿ │ ∿ │ ',
      ' └───┴───┘ ',
      '[CHRONO]',
    ],
    summary:
      'Excavates git commit logs, releases, author turnover, and contributor patterns to reconstruct the factual timeline of development and isolate the exact moment activity waned.',
    inputs: [
      'Git commit log & authorship history',
      'Issue closures & pull request velocity',
      'Tagged releases and milestone metadata',
    ],
    outputs: [
      'Chronological project timeline (epochs & shifts)',
      'Abandonment signal markers with factual citations',
      'Contributor bus-factor & turnover distribution',
    ],
    telemetryLogs: [
      '[0x01B2] EXCAVATING GIT LOG FROM HEAD TO GENESIS...',
      '[0x01B3] COMMITS PARSED; DETECTED AUTHOR TURNOVER INFLECTION AT 2021-04...',
      '[0x01B4] ISOLATING ABANDONMENT SIGNALS: ZERO MERGED PRS IN 36 MONTHS...',
      '[0x01B5] RECONSTRUCTING 5 HISTORICAL EPOCHS WITH GROUNDED SHAS...',
      '[0x01B6] CHRONOLOGICAL COMPENDIUM CERTIFIED FOR DOSSIER RECORD.',
    ],
    quote:
      'Code does not merely stop; it whispers the circumstances of its final breath.',
  },
  {
    id: 'archaeologist',
    name: 'THE ARCHAEOLOGIST',
    role: 'Architecture & Intent Discovery',
    badge: 'SOURCE & AST HIERARCHY',
    frequency: '88.50 MHz',
    register: '0x02C3',
    icon: Pickaxe,
    colorName: 'cyan',
    borderColor: 'border-cyan-500/50',
    glowColor: 'from-cyan-500/15 via-cyan-950/20 to-transparent',
    accentColor: 'text-cyan-400',
    badgeBorder: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
    asciiSigil: [
      '   / \\   ',
      '  / ⬢ \\  ',
      '  \\_⬡_/  ',
      '[ARCHITECT]',
    ],
    summary:
      'Inspects directory hierarchies, package manifests, entry points, and source code to reconstruct what the author originally sought to build vs what remained half-finished.',
    inputs: [
      'README, architecture documentation & docstrings',
      'Project file hierarchy & directory topology',
      'Package manifests (package.json, Cargo.toml, setup.py)',
      'Primary source entry points & exports',
    ],
    outputs: [
      'Reconstructed original project intent statement',
      'Complete technology stack taxonomy',
      'Feature inventory (fully implemented vs incomplete stubs)',
      'Documentation completeness & drift audit',
    ],
    telemetryLogs: [
      '[0x02C3] LOCATING PACKAGE MANIFESTS: FOUND 1 MANIFEST, 1 LOCKFILE...',
      '[0x02C4] INFERRING ORIGINAL INTENT FROM README DOCSTRINGS & AST LEAVES...',
      '[0x02C5] ENTRY POINT LOCATED: MAIN SOURCE PIPELINE EXPOSED...',
      '[0x02C6] FEATURE INVENTORY AUDIT: 4 CORE COMPLETE, 2 STUBBED PATHS...',
      '[0x02C7] ARCHITECTURAL TAXONOMY SERIALIZED FOR RETRIEVAL CONTEXT.',
    ],
    quote:
      'Underneath layers of bitrot lies the pure architectural intention of its creator.',
  },
  {
    id: 'exorcist',
    name: 'THE EXORCIST',
    role: 'Technical Debt & Bitrot Hunter',
    badge: 'DEBT & VULNERABILITIES',
    frequency: '104.2 MHz',
    register: '0x03D4',
    icon: Flame,
    colorName: 'rose',
    borderColor: 'border-rose-500/50',
    glowColor: 'from-rose-500/15 via-rose-950/20 to-transparent',
    accentColor: 'text-rose-400',
    badgeBorder: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
    asciiSigil: [
      '  \\ 🕱 /  ',
      ' ── ☣ ── ',
      '  /   \\  ',
      '[EXORCIST]',
    ],
    summary:
      'Diagnoses compiler bitrot, outdated dependencies, abandoned TODO/FIXME comments, missing CI pipelines, and active security vulnerabilities—safely without executing unverified code.',
    inputs: [
      'Manifest dependency version ranges',
      'Source file comments & annotation tokens',
      'Open issue backlog & error telemetry',
      'CI/CD workflow definitions (.github/workflows)',
    ],
    outputs: [
      'Compiler bitrot & technical debt severity report',
      'Outdated external dependency version delta matrix',
      'Abandoned TODO/FIXME marker ledger with line references',
      'Missing test harness & CI pipeline quarantine log',
    ],
    telemetryLogs: [
      '[0x03D4] LAUNCHING STATIC DEPENDENCY SCAN (STRICT ZERO RCE SANDBOX)...',
      '[0x03D5] DETECTED 14 OUTDATED PACKAGES WITH BREAKING MAJOR DELTAS...',
      '[0x03D6] EXTRACTED 7 UNRESOLVED TODO/FIXME MARKERS FROM SOURCE AST...',
      '[0x03D7] COMPILER BITROT RISK CLASSIFIED AS SEVERE (ORPHANED TOOLCHAIN)...',
      '[0x03D8] NECROSIS AUDIT SEALED WITH VERIFIABLE EVIDENCE CITATIONS.',
    ],
    quote:
      'I illuminate the demons of obsolescence before they poison the resurrection.',
  },
  {
    id: 'revivalist',
    name: 'THE REVIVALIST',
    role: 'Resurrection Strategy & Onboarding',
    badge: 'BLUEPRINT & ACTION',
    frequency: '161.8 MHz',
    register: '0x04E5',
    icon: Sparkles,
    colorName: 'emerald',
    borderColor: 'border-emerald-500/50',
    glowColor: 'from-emerald-500/15 via-emerald-950/20 to-transparent',
    accentColor: 'text-emerald-400',
    badgeBorder: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    asciiSigil: [
      '  ✦ 🜂 ✦  ',
      ' ◄ ✧ ✧ ► ',
      '  ✦ 🜄 ✦  ',
      '[RESURRECT]',
    ],
    summary:
      'Synthesizes all findings into a concrete, prioritized resurrection roadmap, structured first contributions, and an actionable 10-minute newcomer onboarding guide.',
    inputs: [
      'Historian chronological timeline & turnover signals',
      'Archaeologist architectural blueprint & feature inventory',
      'Exorcist technical debt report & risk matrix',
      'Corroborated evidence ledger with citation anchors',
    ],
    outputs: [
      'Phase 1-3 Structured Revival Roadmap',
      'Top 5 Highest-Priority Remediation Actions',
      'Newcomer 10-Minute Onboarding Compendium',
      'Curated Good-First-Issue revival tickets',
    ],
    telemetryLogs: [
      '[0x04E5] INGESTING SYNTHESIZED FINDINGS FROM THE THREE WATCHERS...',
      '[0x04E6] FORGING 3-PHASE RE-IGNITION BLUEPRINT (STABILIZE -> MODERNIZE)...',
      '[0x04E7] PRIORITIZING 5 HIGHEST-ROI REMEDIATION TASKS BY IMPACT...',
      '[0x04E8] GENERATING ZERO-FRICTION 10-MINUTE NEWCOMER COMPENDIUM...',
      '[0x04E9] ALCHEMICAL RESURRECTION COMPLETE. SÉANCE CONCLAVE UNLOCKED.',
    ],
    quote:
      'The past is evidence; the future is an open pull request waiting to be forged.',
  },
];

export function AgentShowcase() {
  const [selectedAgent, setSelectedAgent] = useState<AgentSpec>(AGENTS[0]);

  const handleSelect = (agent: AgentSpec) => {
    sound.playClick(600 + AGENTS.indexOf(agent) * 150);
    setSelectedAgent(agent);
  };

  return (
    <section id="agents" className="py-24 border-t border-slate-800/80 relative bg-[#05070b]">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-300 mb-3">
            <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>PENTARCHY COMMAND NEXUS // 5 AUTONOMOUS ENCLAVES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Five Specialized Watchers. <br />
            <span className="text-amber-400">One Verifiable Resurrection.</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Software abandonment cannot be diagnosed by a generic prompt. RepoRevenant deploys a
            conclave of isolated agent personas, each bound to specific forensic evidence domains.
          </p>
        </div>

        {/* Master Occult Transceiver Console */}
        <div className="rounded-2xl border border-slate-800 bg-[#070a10]/95 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
          {/* Top Console Telemetry Bar */}
          <div className="px-5 py-3 border-b border-slate-800 bg-[#090d16] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-slate-300 font-bold uppercase tracking-wider">
                COUNCIL_BUS: ONLINE
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 hidden sm:inline">
                NEURAL_CORE: GEMMA-3:4B (OLLAMA ENGINE)
              </span>
            </div>

            <div className="flex items-center gap-4 text-slate-400 text-[11px]">
              <div className="flex items-center gap-1.5">
                <Sliders className="w-3 h-3 text-amber-400" />
                <span>FREQ: {selectedAgent.frequency}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-violet-400" />
                <span>REG: {selectedAgent.register}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Channel Switchboard (Agent Selector) */}
            <div className="lg:col-span-4 border-r border-slate-800/80 bg-[#06080e]/90 p-3 sm:p-4 space-y-2">
              <div className="px-2 py-1.5 text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center justify-between border-b border-slate-800/60 mb-2">
                <span>SELECT FREQUENCY</span>
                <span>CHANNEL MATRIX</span>
              </div>

              {AGENTS.map((agent, index) => {
                const Icon = agent.icon;
                const isSelected = selectedAgent.id === agent.id;
                return (
                  <button
                    key={agent.id}
                    onClick={() => handleSelect(agent)}
                    className={cn(
                      'w-full text-left p-3.5 rounded-xl border transition-all relative overflow-hidden flex items-center gap-3 cursor-pointer group',
                      isSelected
                        ? `${agent.borderColor} bg-[#0f1422] shadow-[0_0_20px_rgba(0,0,0,0.5)]`
                        : 'border-slate-800/80 bg-[#080b12]/60 hover:border-slate-700 hover:bg-[#0c101a]'
                    )}
                  >
                    {/* Active Indicator Pillar */}
                    <div
                      className={cn(
                        'w-1.5 h-10 rounded-full transition-all shrink-0',
                        isSelected ? 'bg-amber-400 shadow-[0_0_10px_#e5a93c]' : 'bg-slate-800 group-hover:bg-slate-700'
                      )}
                    />

                    {/* Agent Icon Plate */}
                    <div
                      className={cn(
                        'p-2 rounded-lg border shrink-0 transition-transform group-hover:scale-105',
                        isSelected
                          ? `${agent.borderColor} bg-slate-900 ${agent.accentColor}`
                          : 'border-slate-800 bg-slate-900/50 text-slate-500'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={cn(
                            'text-xs font-mono font-bold truncate',
                            isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                          )}
                        >
                          {agent.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 shrink-0">
                          0{index + 1}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {agent.role}
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* Status footer pill */}
              <div className="p-3 rounded-xl bg-[#090c14] border border-slate-800 text-[11px] font-mono text-slate-400 mt-4 flex items-center justify-between">
                <span>CONCLAVE SYNC</span>
                <span className="text-emerald-400 font-bold">LOCKED (5/5)</span>
              </div>
            </div>

            {/* Right Terminal & Archaeological Dossier Screen */}
            <div className="lg:col-span-8 p-6 sm:p-8 relative min-h-[520px] flex flex-col justify-between overflow-hidden">
              {/* Ambient Glow */}
              <div
                className={cn(
                  'absolute inset-0 bg-gradient-to-br opacity-40 pointer-events-none transition-all duration-700',
                  selectedAgent.glowColor
                )}
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedAgent.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 space-y-6"
                >
                  {/* Agent Header Plate */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800/80">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border font-bold',
                            selectedAgent.badgeBorder
                          )}
                        >
                          {selectedAgent.badge}
                        </span>
                        <span className="text-xs font-mono text-slate-500">
                          REGISTER: {selectedAgent.register}
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight flex items-center gap-3">
                        <span>{selectedAgent.name}</span>
                      </h3>
                      <p className="text-xs font-mono text-slate-400">{selectedAgent.role}</p>
                    </div>

                    {/* ASCII Glyphic Hologram Sigil */}
                    <div className="hidden sm:flex flex-col items-center justify-center p-3 rounded-xl bg-[#05070c] border border-slate-800 text-[10px] font-mono text-slate-400 font-bold shadow-inner">
                      {selectedAgent.asciiSigil.map((line, idx) => (
                        <span key={idx} className={selectedAgent.accentColor}>
                          {line}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Summary & Core Directive */}
                  <div className="space-y-3">
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {selectedAgent.summary}
                    </p>

                    <blockquote className="p-3.5 rounded-xl bg-[#090c14]/90 border border-slate-800/90 text-xs font-mono italic text-slate-300 border-l-2 border-l-amber-500">
                      &ldquo;{selectedAgent.quote}&rdquo;
                    </blockquote>
                  </div>

                  {/* Simulated Teleprinter Execution Log Stream */}
                  <div className="rounded-xl border border-slate-800/90 bg-[#05070d] p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-1.5 border-b border-slate-800/60">
                      <div className="flex items-center gap-1.5 text-amber-400">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>LIVE REASONING TELEMETRY STREAM</span>
                      </div>
                      <span className="text-[10px] text-slate-500">REALTIME DISPATCH</span>
                    </div>
                    <div className="space-y-1 font-mono text-[11px] text-slate-400">
                      {selectedAgent.telemetryLogs.map((log, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-amber-500/70 select-none">›</span>
                          <span className={idx === selectedAgent.telemetryLogs.length - 1 ? 'text-amber-300 font-semibold' : ''}>
                            {log}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Excavation Specimen Slips (Inputs & Deliverables) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[#070a12]/80 border border-slate-800/90 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
                        <FileCode className="w-4 h-4 text-amber-400" />
                        <span>INGESTION CONTRACTS</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-400">
                        {selectedAgent.inputs.map((inp, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-amber-500 select-none">▸</span>
                            <span>{inp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-[#070a12]/80 border border-slate-800/90 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>VERIFIED DELIVERABLES</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-400">
                        {selectedAgent.outputs.map((out, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-400 select-none">✓</span>
                            <span>{out}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Bottom Security Guarantee */}
              <div className="pt-4 mt-6 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>MASTRA ORCHESTRATED WORKFLOW PIPELINE</span>
                </div>
                <span>ZERO REMOTE CODE EXECUTION</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
