'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  GitBranch,
  FileCheck2,
  Sparkles,
  ShieldCheck,
  Flame,
} from 'lucide-react';

export function WorkflowVisualizer() {
  const steps = [
    {
      step: '01',
      title: 'Target Validation',
      actor: 'The Summoner',
      desc: 'Validates GitHub URL, checks rate limits, inspects repository status (active vs archived).',
      icon: Globe,
      color: 'amber',
    },
    {
      step: '02',
      title: 'Parallel Excavation',
      actor: 'Historian & Archaeologist',
      desc: 'Simultaneously mines commit log chronology and parses directory hierarchy & package manifests.',
      icon: GitBranch,
      color: 'violet',
    },
    {
      step: '03',
      title: 'Vulnerability & Debt Scan',
      actor: 'The Exorcist',
      desc: 'Diagnoses outdated dependencies, dead CI workflows, and abandoned TODO comments safely.',
      icon: Flame,
      color: 'rose',
    },
    {
      step: '04',
      title: 'Resurrection Strategy',
      actor: 'The Revivalist',
      desc: 'Synthesizes findings into a 3-phase roadmap, Top 5 fixes, and a 10-minute newcomer guide.',
      icon: Sparkles,
      color: 'emerald',
    },
    {
      step: '05',
      title: 'Dossier & Séance',
      actor: 'The Collective',
      desc: 'Produces transparent Health Score, evidence ledger, and unlocks the Developer Séance chamber.',
      icon: FileCheck2,
      color: 'cyan',
    },
  ];

  return (
    <section id="workflow" className="py-20 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-mono text-violet-300 mb-3">
            <GitBranch className="w-3.5 h-3.5 text-violet-400" />
            <span>Mastra Execution Pipeline</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            How The Harness Operates
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Deterministic orchestration meets open-weight intelligence. Every conclusion is
            bound to verifiable repository artifacts.
          </p>
        </div>

        {/* Workflow Diagram Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-panel p-5 rounded-xl border-slate-800 relative group hover:border-amber-500/40 hover:bg-[#111624] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-bold text-amber-400/80">
                      PHASE {item.step}
                    </span>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-white font-mono mb-1">
                    {item.title}
                  </h4>
                  <div className="text-[11px] font-mono text-violet-400 mb-2">
                    {item.actor}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Isolated Sandbox</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/70" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Technical Guarantee Banner */}
        <div className="mt-12 p-5 rounded-2xl bg-[#0a0d15]/80 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Execution Security Guarantee
              </h5>
              <p className="text-xs text-slate-400 mt-0.5">
                RepoRevenant statically inspects repository trees. Untrusted scripts or build hooks are NEVER executed on the host.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Zero Remote Code Execution</span>
          </div>
        </div>
      </div>
    </section>
  );
}
