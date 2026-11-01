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
import { sound } from '@/lib/audio/sound-synth';

export function AgentActivityTab({ dossier }: { dossier: DossierReport }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLedger = () => {
    sound.playClick(900);
    navigator.clipboard.writeText(JSON.stringify(dossier.evidenceLedger, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Telemetry Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bracket-box p-5 rounded-xl bg-[#080b12] border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Inference Engine
            </span>
            <Cpu className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-sm font-mono font-bold text-white">
            Gemma 3 (4B Quantized)
          </div>
          <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Local Ollama • Zero Closed APIs</span>
          </div>
        </div>

        <div className="bracket-box p-5 rounded-xl bg-[#080b12] border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Orchestration Framework
            </span>
            <Activity className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-sm font-mono font-bold text-white">
            Mastra Multi-Agent Workflows
          </div>
          <div className="text-[11px] font-mono text-violet-300">
            Typed State Machine & Retries
          </div>
        </div>

        <div className="bracket-box p-5 rounded-xl bg-[#080b12] border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Evidence Footprint
            </span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-sm font-mono font-bold text-white">
            {dossier.evidenceLedger.length} Verified Artifacts
          </div>
          <div className="text-[11px] font-mono text-cyan-300">
            Indexed into Retrieval Engine
          </div>
        </div>
      </div>

      {/* Agent Execution Records */}
      <div className="bracket-box p-6 rounded-2xl bg-[#080b12] border border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
              Autonomous Agent Telemetry & Duration Log
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {dossier.executionRecords.length} ENCLAVES DISPATCHED
          </span>
        </div>

        <div className="space-y-3">
          {dossier.executionRecords.map((rec, idx) => (
            <div
              key={rec.agentName}
              onClick={() => sound.playClick(500 + idx * 80)}
              className="p-4 rounded-xl bg-[#05070c] border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs cursor-default"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 font-mono">
                  <span className="font-bold text-white">{rec.agentName}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 uppercase font-bold">
                    {rec.status}
                  </span>
                  <span className="text-amber-400 font-bold text-[11px]">
                    {rec.durationMs}ms
                  </span>
                </div>
                <p className="text-slate-400 font-sans">{rec.summary}</p>
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
      <div className="bracket-box p-6 rounded-2xl bg-[#080b12] border border-slate-800 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-800 gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
              Corroborated Repository Evidence Ledger
            </h3>
          </div>

          <button
            onClick={handleCopyLedger}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#05070c] border border-slate-700 text-xs font-mono text-slate-300 hover:text-white hover:border-amber-500/40 transition-colors cursor-pointer w-fit shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">LEDGER COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>EXPORT LEDGER JSON</span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-3">
          {dossier.evidenceLedger.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => sound.playClick(400 + idx * 50)}
              className="p-3.5 rounded-xl bg-[#05070c] border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs cursor-default"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono">
                  <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-900 border border-slate-800 text-cyan-300">
                    {item.type}
                  </span>
                  <span className="font-bold text-white">{item.title}</span>
                  {item.ref && (
                    <span className="text-slate-500 text-[11px] truncate max-w-xs">
                      ({item.ref})
                    </span>
                  )}
                </div>
                {item.snippet && (
                  <p className="text-slate-400 font-mono text-[11px] italic bg-[#020408] p-2 rounded border border-slate-900">
                    &ldquo;{item.snippet}&rdquo;
                  </p>
                )}
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <ConfidenceBadge confidence={item.confidence} />
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded text-slate-400 hover:text-white"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
