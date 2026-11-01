'use client';

import React from 'react';
import { Cpu, Box, Database, Activity, Code, Lock } from 'lucide-react';

export function OpenSourceStack() {
  const technologies = [
    {
      name: 'Gemma 3 (Google)',
      role: 'Core Open-Weight Intelligence',
      desc: 'High-capability open model run locally via Ollama (default `gemma3:4b`). No closed APIs required.',
      icon: Cpu,
      tag: 'Local Inference',
    },
    {
      name: 'Mastra AI Framework',
      role: 'Agent Orchestration Engine',
      desc: 'Type-safe workflows, autonomous multi-agent branching, structured outputs, and telemetry.',
      icon: Box,
      tag: 'Orchestrator',
    },
    {
      name: 'MongoDB Atlas',
      role: 'Dossier & Séance Persistence',
      desc: 'Stores complete archaeological ledgers, health scores, and séance conversation trees. Optional for dev.',
      icon: Database,
      tag: 'Database',
    },
    {
      name: 'GitHub REST API',
      role: 'Repository Intelligence',
      desc: 'Retrieves public git trees, issues, releases, and commits. Works without a token or with a PAT.',
      icon: Code,
      tag: 'Data Source',
    },
    {
      name: 'Sentry Observability',
      role: 'Error Tracing & Telemetry',
      desc: 'Deep agent execution tracing, duration monitoring, and model token usage tracking.',
      icon: Activity,
      tag: 'Observability',
    },
    {
      name: 'Sandboxed Prompt Defense',
      role: 'Security Hardening',
      desc: 'Treats repo files as untrusted evidence data to prevent prompt injection and SSRF exploits.',
      icon: Lock,
      tag: 'Security',
    },
  ];

  return (
    <section id="open-source" className="py-20 border-t border-slate-800/80 bg-[#06080d]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>Open Weights First</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Built for True Open-Source AI
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            RepoRevenant is sovereign software. It runs entirely on local models without mandatory
            proprietary API subscriptions or closed-source lock-in.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {technologies.map((tech) => {
            const Icon = tech.icon;
            return (
              <div
                key={tech.name}
                className="glass-panel p-6 rounded-2xl border-slate-800/90 hover:border-amber-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60">
                      {tech.tag}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white font-mono">
                    {tech.name}
                  </h4>
                  <div className="text-xs font-mono text-amber-400/90 mb-2">
                    {tech.role}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {tech.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
