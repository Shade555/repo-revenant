'use client';

import React, { useState } from 'react';
import { DossierReport } from '@/types';
import { ConfidenceBadge } from '@/components/ui/Badge';
import {
  Activity,
  Cpu,
  Clock,
  Database,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
} from 'lucide-react';

export function AgentActivityTab({ dossier }: { dossier: DossierReport }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLedger = () => {
    navigator.clipboard.writeText(JSON.stringify(dossier.evidenceLedger, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Telemetry Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-xl border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase">
              Inference Engine
            </span>
            <Cpu className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-sm font-mono font-bold text-white">
            Gemma 3 (4B Parameters)
          </div>
          <div className="text-[11px] font-mono text-emerald-400 mt-1">
            Local Ollama Engine • Zero Closed APIs
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase">
              Orchestration Framework
            </span>
            <Activity className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-sm font-mono font-bold text-white">
            Mastra Multi-Agent Workflows
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">
            Type-Safe Step Boundaries
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase">
              Evidence Footprint
            </span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-sm font-mono font-bold text-white">
            {dossier.evidenceLedger.length} Artifacts Verified
          </div>
          <div className="text-[11px] font-mono text-cyan-300 mt-1">
            Indexed into Vector Memory
          </div>
        </div>
      </div>

      {/* Agent Execution Records */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              Agent Execution & Telemetry Log
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {dossier.executionRecords.length} Agents Dispatched
          </span>
        </div>

        <div className="space-y-3">
          {dossier.executionRecords.map((rec) => (
            <div
              key={rec.agentName}
              className="p-4 rounded-xl bg-[#090d15] border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-white">{rec.agentName}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 uppercase">
                    {rec.status}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {rec.durationMs}ms
                  </span>
                </div>
                <p className="text-slate-400">{rec.summary}</p>
              </div>

              <div className="flex items-center gap-4 font-mono text-[11px] text-slate-400 shrink-0">
                {rec.tokensUsed && (
                  <div>
                    <span className="text-slate-500">Tokens: </span>
                    <span className="text-amber-300 font-bold">{rec.tokensUsed}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-500">Model: </span>
                  <span className="text-slate-200">{rec.model}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grounded Evidence Ledger */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              Grounded Repository Evidence Ledger
            </h3>
          </div>

          <button
            onClick={handleCopyLedger}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? 'Copied' : 'Copy Evidence JSON'}</span>
          </button>
        </div>

        <div className="space-y-3">
          {dossier.evidenceLedger.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-[#090d15] border border-slate-800/80 space-y-2 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-400 font-bold">
                    {item.type}
                  </span>
                  <span className="font-bold text-white">{item.title}</span>
                </div>

                <div className="flex items-center gap-2">
                  <ConfidenceBadge confidence={item.confidence} />
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-amber-400 transition-colors p-1"
                      title="Open source artifact"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              <div className="font-mono text-[11px] text-slate-400">
                Reference: <span className="text-cyan-300">{item.ref}</span>
              </div>

              {item.snippet && (
                <pre className="p-3 rounded-lg bg-[#06080d] border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap">
                  {item.snippet}
                </pre>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
