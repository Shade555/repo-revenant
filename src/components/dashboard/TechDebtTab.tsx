'use client';

import React from 'react';
import { DossierReport } from '@/types';
import {
  Flame,
  Code2,
  FileWarning,
  ShieldAlert,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  FileCode,
  Lock,
} from 'lucide-react';
import { sound } from '@/lib/audio/sound-synth';

export function TechDebtTab({ dossier }: { dossier: DossierReport }) {
  const { exorcist } = dossier;

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'High':
      case 'Critical':
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-rose-950/80 text-rose-300 border border-rose-500/40">
            {risk} RISK
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-950/80 text-amber-300 border border-amber-500/40">
            Medium Risk
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
            Low Risk
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Exorcist Forensic Pathology Card */}
      <div className="bracket-box p-6 sm:p-7 rounded-2xl bg-[#080b12] border border-rose-500/40 relative overflow-hidden shadow-[0_0_40px_rgba(244,63,94,0.12)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-4 border-b border-rose-500/20">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-rose-400 font-bold">
                  THE EXORCIST AUTOPSY
                </span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-mono text-white">
                Technical Debt & Compiler Bitrot Quarantine
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-rose-950/40 px-3.5 py-1.5 rounded-xl border border-rose-500/30">
            <AlertOctagon className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-mono text-slate-300">Necrosis Severity:</span>
            {getRiskBadge(exorcist.severity)}
          </div>
        </div>

        <p className="text-sm text-slate-200 leading-relaxed bg-[#05070c] p-4 rounded-xl border border-slate-800 font-sans">
          {exorcist.summary}
        </p>

        <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Lock className="w-3.5 h-3.5" />
            <span>SAFE STATIC ISOLATION: Zero arbitrary scripts executed on host</span>
          </span>
          <span className="text-slate-500">AIR-GAPPED AST HARNESS</span>
        </div>
      </div>

      {/* Outdated Dependencies Matrix */}
      <div className="bracket-box p-6 rounded-2xl bg-[#080b12] border border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileWarning className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
              Obsolete & Deprecated External Packages
            </h3>
          </div>
          <span className="text-xs font-mono text-rose-400 font-bold">
            {exorcist.outdatedDependencies.length} PACKAGES FLAGGED
          </span>
        </div>

        {exorcist.outdatedDependencies.length === 0 ? (
          <div className="p-6 rounded-xl bg-[#05070d] text-center text-xs font-mono text-emerald-400 border border-emerald-500/30 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>No obsolete external packages detected. Clean package manifest dependencies.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {exorcist.outdatedDependencies.map((dep, idx) => (
              <div
                key={dep.name}
                onClick={() => sound.playClick(600 + idx * 80)}
                className="p-4 rounded-xl bg-[#05070c] border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group cursor-default"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-mono font-bold text-white group-hover:text-amber-300 transition-colors">
                      {dep.name}
                    </span>
                    {getRiskBadge(dep.risk)}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    <span className="text-slate-500">Frozen: </span>
                    <span className="text-rose-400 font-bold">{dep.currentVersion}</span>
                    <span className="mx-2 text-slate-600">→</span>
                    <span className="text-slate-500">Target: </span>
                    <span className="text-emerald-400 font-bold">{dep.latestVersion}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans">{dep.notes}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TODO / FIXME Ledger & Missing Configurations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* TODO / FIXME markers */}
        <div className="lg:col-span-7 bracket-box p-6 rounded-2xl bg-[#080b12] border border-slate-800 shadow-2xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                Abandoned TODO & FIXME Annotations
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500">
              {exorcist.todoMarkers.length} TOKENS
            </span>
          </div>

          <div className="space-y-3">
            {exorcist.todoMarkers.map((marker, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#05070c] border border-slate-800/90 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-bold flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{marker.file}:{marker.line}</span>
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                      marker.type === 'FIXME'
                        ? 'border-rose-500/40 bg-rose-950/60 text-rose-300'
                        : 'border-amber-500/40 bg-amber-950/60 text-amber-300'
                    }`}
                  >
                    {marker.type}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono italic bg-[#020408] p-2 rounded border border-slate-900">
                  &ldquo;{marker.comment}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Configurations & CI Health */}
        <div className="lg:col-span-5 bracket-box p-6 rounded-2xl bg-[#080b12] border border-slate-800 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                Missing Environment & CI Audit
              </h3>
            </div>

            <div className="space-y-2.5">
              {exorcist.missingConfig.map((cfg, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#05070c] border border-slate-800 flex items-start gap-2.5"
                >
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300 font-mono leading-relaxed">
                    {cfg}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] font-mono text-slate-500">
            AUDIT CERTIFIED BY THE EXORCIST
          </div>
        </div>
      </div>
    </div>
  );
}
