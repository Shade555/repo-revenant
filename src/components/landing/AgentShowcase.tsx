'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
  History,
  Pickaxe,
  Flame,
  Sparkles,
  CheckCircle2,
  FileCode,
  Cpu,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AGENTS = [
  {
    id: 'summoner',
    name: 'THE SUMMONER',
    role: 'Central Agent Orchestrator',
    badge: 'ORCHESTRATION',
    icon: Crown,
    color: 'amber',
    borderColor: 'border-amber-500/40',
    bgGlow: 'from-amber-500/10 via-amber-950/20 to-transparent',
    accentColor: 'text-amber-400',
    summary:
      'Coordinates the multi-agent investigation workflow, manages parallel agent pipelines, enforces data contracts, and synthesizes the final Revival Dossier.',
    inputs: ['Public GitHub Repository URL', 'Optional GitHub Token (higher rate limits)'],
    outputs: ['Validated metadata tree', 'Revival Dossier Report', 'MongoDB persistence record'],
    quote:
      'I awaken the dormant watchers and command the synthesis of forgotten wisdom.',
  },
  {
    id: 'historian',
    name: 'THE HISTORIAN',
    role: 'Chronological Archaeology',
    badge: 'TIMELINE & COMMITS',
    icon: History,
    color: 'violet',
    borderColor: 'border-violet-500/40',
    bgGlow: 'from-violet-500/10 via-violet-950/20 to-transparent',
    accentColor: 'text-violet-400',
    summary:
      'Excavates git commit logs, releases, author turnover, and contributor patterns to reconstruct the factual timeline of development and isolate the exact moment activity waned.',
    inputs: ['Git commit history', 'Issue closures & PR logs', 'Release tags'],
    outputs: ['Chronological project timeline', 'Abandonment signal markers', 'Contributor bus factor analysis'],
    quote:
      'Code does not merely stop; it whispers the circumstances of its final breath.',
  },
  {
    id: 'archaeologist',
    name: 'THE ARCHAEOLOGIST',
    role: 'Architecture & Intent Discovery',
    badge: 'SOURCE & AST',
    icon: Pickaxe,
    color: 'cyan',
    borderColor: 'border-cyan-500/40',
    bgGlow: 'from-cyan-500/10 via-cyan-950/20 to-transparent',
    accentColor: 'text-cyan-400',
    summary:
      'Inspects directory hierarchies, package manifests, entry points, and source code to reconstruct what the author originally sought to build vs what remained half-finished.',
    inputs: ['README & docs', 'Directory structure', 'Package manifests (package.json, Cargo.toml, etc.)', 'Main source files'],
    outputs: ['Architecture overview', 'Tech stack taxonomy', 'Feature inventory (complete vs stub)', 'Documentation audit'],
    quote:
      'Underneath layers of bitrot lies the pure architectural intention of its creator.',
  },
  {
    id: 'exorcist',
    name: 'THE EXORCIST',
    role: 'Technical Debt & Bitrot Hunter',
    badge: 'DEBT & VULNERABILITIES',
    icon: Flame,
    color: 'rose',
    borderColor: 'border-rose-500/40',
    bgGlow: 'from-rose-500/10 via-rose-950/20 to-transparent',
    accentColor: 'text-rose-400',
    summary:
      'Diagnoses compiler bitrot, outdated dependencies, abandoned TODO/FIXME comments, missing CI pipelines, and active security vulnerabilities—safely without executing unverified code.',
    inputs: ['Manifest dependency versions', 'Source file comments', 'Open issue backlog', 'CI/CD workflow definitions'],
    outputs: ['Technical debt report', 'Outdated dependency matrix', 'TODO marker ledger', 'Missing config audit'],
    quote:
      'I illuminate the demons of obsolescence before they poison the resurrection.',
  },
  {
    id: 'revivalist',
    name: 'THE REVIVALIST',
    role: 'Resurrection Strategy & Onboarding',
    badge: 'BLUEPRINT & ACTION',
    icon: Sparkles,
    color: 'emerald',
    borderColor: 'border-emerald-500/40',
    bgGlow: 'from-emerald-500/10 via-emerald-950/20 to-transparent',
    accentColor: 'text-emerald-400',
    summary:
      'Synthesizes all findings into a concrete, prioritized resurrection roadmap, structured first contributions, and an actionable 10-minute newcomer onboarding guide.',
    inputs: ['Historical timeline', 'Architectural state', 'Exorcist debt report', 'Evidence ledger'],
    outputs: ['Phase 1-3 Revival Roadmap', 'Top 5 Priority Fixes', 'Newcomer Onboarding Guide', 'Curated first contributions'],
    quote:
      'The past is evidence; the future is an open pull request waiting to be forged.',
  },
];

export function AgentShowcase() {
  const [selectedAgent, setSelectedAgent] = useState(AGENTS[0]);

  return (
    <section id="agents" className="py-20 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-300 mb-3">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>The Multi-Agent Council</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Five Specialized Agents. <br />
            <span className="text-amber-400">One Unified Resurrection Harness.</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            No single agent can understand software history. RepoRevenant assigns specialized
            roles with strict data boundaries, working exclusively from retrieved repository facts.
          </p>
        </div>

        {/* Agent Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-8">
          {AGENTS.map((agent) => {
            const Icon = agent.icon;
            const isSelected = selectedAgent.id === agent.id;
            return (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={cn(
                  'p-3.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer',
                  isSelected
                    ? `${agent.borderColor} bg-[#121622] shadow-[0_0_20px_rgba(0,0,0,0.5)]`
                    : 'border-slate-800 bg-[#0a0d14]/70 hover:border-slate-700 hover:bg-[#0e121a]'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={cn(
                      'p-2 rounded-lg border',
                      isSelected
                        ? `${agent.borderColor} bg-slate-900 ${agent.accentColor}`
                        : 'border-slate-800 bg-slate-900/60 text-slate-400'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    0{AGENTS.indexOf(agent) + 1}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold font-mono text-white truncate">
                    {agent.name}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {agent.role}
                  </div>
                </div>

                {isSelected && (
                  <motion.div
                    layoutId="activeAgentTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-violet-500"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Agent Detailed View */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedAgent.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className={cn(
              'glass-panel p-6 sm:p-8 rounded-2xl border relative overflow-hidden',
              selectedAgent.borderColor
            )}
          >
            {/* Ambient Background Gradient */}
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-br opacity-50 pointer-events-none',
                selectedAgent.bgGlow
              )}
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Agent Identity & Quote */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'p-3 rounded-xl border bg-slate-900',
                      selectedAgent.borderColor,
                      selectedAgent.accentColor
                    )}
                  >
                    <selectedAgent.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                      {selectedAgent.badge}
                    </span>
                    <h3 className="text-2xl font-bold font-mono text-white">
                      {selectedAgent.name}
                    </h3>
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed">
                  {selectedAgent.summary}
                </p>

                <blockquote className="p-4 rounded-xl bg-[#090c12]/90 border border-slate-800 text-xs font-mono italic text-slate-400 border-l-2 border-l-amber-500">
                  &ldquo;{selectedAgent.quote}&rdquo;
                </blockquote>
              </div>

              {/* Data Contracts (Inputs & Outputs) */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#080b11]/80 border border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-300 mb-3">
                    <FileCode className="w-4 h-4 text-amber-400" />
                    <span>INVESTIGATION INPUTS</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-400">
                    {selectedAgent.inputs.map((input, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-500 select-none">▸</span>
                        <span>{input}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#080b11]/80 border border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-300 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>EVIDENCE DELIVERABLES</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-400">
                    {selectedAgent.outputs.map((out, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-500 select-none">✓</span>
                        <span>{out}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
