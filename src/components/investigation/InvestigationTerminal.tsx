'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Skull,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  History,
  Pickaxe,
  Flame,
  Crown,
} from 'lucide-react';
import { RadarScan } from '@/components/ui/RadarScan';
import { TerminalStream } from '@/components/ui/TerminalStream';
import { InvestigationLog } from '@/types';
import { SAMPLE_DOSSIERS } from '@/lib/sample-data';

interface AgentState {
  id: 'summoner' | 'historian' | 'archaeologist' | 'exorcist' | 'revivalist';
  name: string;
  role: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  progress: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export function InvestigationTerminal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const target = searchParams.get('target') || 'facebookarchive/three20';

  const [agents, setAgents] = useState<AgentState[]>([
    {
      id: 'summoner',
      name: 'THE SUMMONER',
      role: 'Coordinating Investigation',
      status: 'running',
      progress: 30,
      icon: Crown,
      color: 'text-amber-400',
    },
    {
      id: 'historian',
      name: 'THE HISTORIAN',
      role: 'Reconstructing History',
      status: 'idle',
      progress: 0,
      icon: History,
      color: 'text-violet-400',
    },
    {
      id: 'archaeologist',
      name: 'THE ARCHAEOLOGIST',
      role: 'Exploring Source & AST',
      status: 'idle',
      progress: 0,
      icon: Pickaxe,
      color: 'text-cyan-400',
    },
    {
      id: 'exorcist',
      name: 'THE EXORCIST',
      role: 'Detecting Technical Debt',
      status: 'idle',
      progress: 0,
      icon: Flame,
      color: 'text-rose-400',
    },
    {
      id: 'revivalist',
      name: 'THE REVIVALIST',
      role: 'Creating Revival Strategy',
      status: 'idle',
      progress: 0,
      icon: Sparkles,
      color: 'text-emerald-400',
    },
  ]);

  const matchedSample = SAMPLE_DOSSIERS[target];
  const dossierId = matchedSample ? matchedSample.id : 'dossier-three20-archived';

  const [logs, setLogs] = useState<InvestigationLog[]>(() => [
    {
      id: '1',
      timestamp: '00:00.12',
      agent: 'SUMMONER',
      phase: 'INIT',
      message: `Summoning harness for target repository: github.com/${target}`,
      type: 'info',
    },
    {
      id: '2',
      timestamp: '00:00.45',
      agent: 'SUMMONER',
      phase: 'VALIDATE',
      message: 'Validating GitHub API endpoint. SSL handshake verified.',
      type: 'success',
    },
  ]);
  const [overallProgress, setOverallProgress] = useState(10);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Sequential multi-agent simulation that simulates real step progression
    const timers: NodeJS.Timeout[] = [];

    // Step 2: Historian & Archaeologist launch in parallel
    timers.push(
      setTimeout(() => {
        setAgents((prev) =>
          prev.map((a) => {
            if (a.id === 'summoner') return { ...a, status: 'completed', progress: 100 };
            if (a.id === 'historian' || a.id === 'archaeologist')
              return { ...a, status: 'running', progress: 40 };
            return a;
          })
        );
        setOverallProgress(35);
        setLogs((prev) => [
          ...prev,
          {
            id: '3',
            timestamp: '00:01.20',
            agent: 'SUMMONER',
            phase: 'FORK',
            message: 'Dispatching concurrent excavation branches to Historian and Archaeologist.',
            type: 'info',
          },
          {
            id: '4',
            timestamp: '00:01.80',
            agent: 'HISTORIAN',
            phase: 'GIT_LOG',
            message: 'Reading commit history, tags, and author frequency distribution.',
            type: 'evidence',
          },
          {
            id: '5',
            timestamp: '00:02.10',
            agent: 'ARCHAEOLOGIST',
            phase: 'TREE_INSPECT',
            message: 'Traversing root directory tree and parsing package manifests.',
            type: 'evidence',
          },
        ]);
      }, 2000)
    );

    // Step 3: Historian finds abandonment point, Archaeologist finishes architecture
    timers.push(
      setTimeout(() => {
        setAgents((prev) =>
          prev.map((a) => {
            if (a.id === 'historian') return { ...a, progress: 85 };
            if (a.id === 'archaeologist') return { ...a, progress: 90 };
            return a;
          })
        );
        setOverallProgress(60);
        setLogs((prev) => [
          ...prev,
          {
            id: '6',
            timestamp: '00:03.40',
            agent: 'HISTORIAN',
            phase: 'TIMELINE',
            message: 'Detected terminal commit window. Primary author turnover confirmed in git log.',
            type: 'warn',
          },
          {
            id: '7',
            timestamp: '00:03.90',
            agent: 'ARCHAEOLOGIST',
            phase: 'INTENT',
            message: 'Reconstructed core intent: URL-driven native navigation and declarative UI rendering.',
            type: 'success',
          },
        ]);
      }, 4200)
    );

    // Step 4: Exorcist launches
    timers.push(
      setTimeout(() => {
        setAgents((prev) =>
          prev.map((a) => {
            if (a.id === 'historian' || a.id === 'archaeologist')
              return { ...a, status: 'completed', progress: 100 };
            if (a.id === 'exorcist') return { ...a, status: 'running', progress: 45 };
            return a;
          })
        );
        setOverallProgress(75);
        setLogs((prev) => [
          ...prev,
          {
            id: '8',
            timestamp: '00:04.60',
            agent: 'EXORCIST',
            phase: 'BITROT_SCAN',
            message: 'Auditing dependency vulnerabilities, deprecated SDK symbols, and TODO markers.',
            type: 'warn',
          },
          {
            id: '9',
            timestamp: '00:05.10',
            agent: 'EXORCIST',
            phase: 'DEBT_ISOLATION',
            message: 'Extracted 4 high-priority TODO/FIXME comments and isolated broken CI pipeline.',
            type: 'evidence',
          },
        ]);
      }, 6200)
    );

    // Step 5: Revivalist runs
    timers.push(
      setTimeout(() => {
        setAgents((prev) =>
          prev.map((a) => {
            if (a.id === 'exorcist') return { ...a, status: 'completed', progress: 100 };
            if (a.id === 'revivalist') return { ...a, status: 'running', progress: 60 };
            return a;
          })
        );
        setOverallProgress(90);
        setLogs((prev) => [
          ...prev,
          {
            id: '10',
            timestamp: '00:06.40',
            agent: 'REVIVALIST',
            phase: 'SYNTHESIS',
            message: 'Synthesizing 3-phase resurrection roadmap with 5 highest-priority fixes.',
            type: 'info',
          },
          {
            id: '11',
            timestamp: '00:07.10',
            agent: 'REVIVALIST',
            phase: 'ONBOARDING',
            message: 'Generated 10-minute newcomer onboarding guide and good-first-revival tasks.',
            type: 'success',
          },
        ]);
      }, 8200)
    );

    // Step 6: Complete
    timers.push(
      setTimeout(() => {
        setAgents((prev) =>
          prev.map((a) => ({ ...a, status: 'completed', progress: 100 }))
        );
        setOverallProgress(100);
        setIsFinished(true);
        setLogs((prev) => [
          ...prev,
          {
            id: '12',
            timestamp: '00:08.50',
            agent: 'SUMMONER',
            phase: 'COMPLETE',
            message: 'Revival Dossier synthesized successfully! Developer Séance chamber unlocked.',
            type: 'success',
          },
        ]);
      }, 10200)
    );

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [target]);

  const handleOpenDossier = () => {
    router.push(`/dashboard/${dossierId}`);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-between">
      <div>
        {/* Terminal Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-amber-500/20">
          <div className="flex items-center gap-4">
            <RadarScan size={64} active={!isFinished} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-semibold">
                  Archaeological Excavation Active
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-white mt-1">
                {target}
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Model: <span className="text-slate-200">Gemma 3 (4B via Ollama)</span> • Harness: <span className="text-slate-200">Mastra Multi-Agent</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isFinished ? (
              <button
                onClick={handleOpenDossier}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-mono font-bold text-sm flex items-center gap-2 shadow-[0_0_30px_rgba(229,169,60,0.5)] transition-all cursor-pointer animate-bounce"
              >
                <span>OPEN REVIVAL DOSSIER</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                <span>EXCAVATING ARTIFACTS... {overallProgress}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden mb-8 border border-slate-800">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 via-violet-500 to-emerald-400 rounded-full"
            style={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* 5 Agent State Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-8">
          {agents.map((agent) => {
            const Icon = agent.icon;
            return (
              <div
                key={agent.id}
                className={`p-4 rounded-xl border transition-all ${
                  agent.status === 'running'
                    ? 'bg-[#131724] border-amber-500/50 shadow-[0_0_20px_rgba(229,169,60,0.15)]'
                    : agent.status === 'completed'
                    ? 'bg-[#0a0e16] border-emerald-500/30'
                    : 'bg-[#080b10] border-slate-800/80 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg bg-slate-900 border border-slate-800 ${agent.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {agent.status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : agent.status === 'running' ? (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-slate-600" />
                  )}
                </div>

                <div className="text-xs font-bold font-mono text-white truncate">
                  {agent.name}
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5 mb-3">
                  {agent.role}
                </div>

                {/* Agent Mini Progress */}
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      agent.status === 'completed'
                        ? 'bg-emerald-400'
                        : 'bg-amber-400'
                    }`}
                    style={{ width: `${agent.progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Real-Time Terminal Streaming Log */}
        <div className="mb-8">
          <TerminalStream logs={logs} isStreaming={!isFinished} />
        </div>
      </div>

      {/* Completion Banner */}
      {isFinished && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-violet-950/40 to-emerald-950/40 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Skull className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono">
                Investigation Complete • Revival Dossier Ready
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                The agents have assembled the full historical timeline, architecture breakdown, technical debt registry, and opened the Séance.
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenDossier}
            className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono font-bold text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(229,169,60,0.4)] transition-all cursor-pointer shrink-0"
          >
            <span>EXPLORE DOSSIER</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
