'use client';

import React from 'react';
import { DossierReport } from '@/types';
import {
  Flame,
  Code2,
  FileWarning,
  ShieldAlert,
} from 'lucide-react';

export function TechDebtTab({ dossier }: { dossier: DossierReport }) {
  const { exorcist } = dossier;

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'High':
      case 'Critical':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-rose-950/70 text-rose-300 border border-rose-500/30">
            {risk}
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-950/70 text-amber-300 border border-amber-500/30">
            Medium
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-950/70 text-emerald-300 border border-emerald-500/30">
            Low
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Exorcist Summary Card */}
      <div className="glass-panel p-6 sm:p-7 rounded-2xl border-rose-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                The Exorcist Diagnostic
              </span>
              <h3 className="text-lg font-bold font-mono text-white">
                Technical Debt & Compiler Bitrot Audit
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Overall Severity:</span>
            {getRiskBadge(exorcist.severity)}
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed bg-[#0a0d15]/80 p-4 rounded-xl border border-slate-800">
          {exorcist.summary}
        </p>
      </div>

      {/* Outdated Dependencies Matrix */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileWarning className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              Outdated & Obsolete Dependencies
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {exorcist.outdatedDependencies.length} Flagged
          </span>
        </div>

        {exorcist.outdatedDependencies.length === 0 ? (
          <div className="p-4 rounded-xl bg-[#090d15] text-center text-xs font-mono text-emerald-400 border border-emerald-500/20">
            No obsolete external packages detected. Clean runtime dependencies.
          </div>
        ) : (
          <div className="space-y-3">
            {exorcist.outdatedDependencies.map((dep) => (
              <div
                key={dep.name}
                className="p-4 rounded-xl bg-[#090d15] border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white">
                      {dep.name}
                    </span>
                    {getRiskBadge(dep.risk)}
                  </div>
                  <div className="text-xs text-slate-400">
                    <span className="text-slate-500">Current: </span>
                    <span className="text-rose-300 font-mono">{dep.currentVersion}</span>
                    <span className="mx-2 text-slate-600">→</span>
                    <span className="text-slate-500">Target: </span>
                    <span className="text-emerald-300 font-mono">{dep.latestVersion}</span>
                  </div>
                  <p className="text-xs text-slate-400">{dep.notes}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TODO / FIXME Ledger & Missing Configurations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* TODO / FIXME comments */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              Abandoned TODO / FIXME Markers
            </h3>
          </div>

          <div className="space-y-3">
            {exorcist.todoMarkers.map((marker, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#090d15] border border-slate-800 space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-semibold truncate">
                    {marker.file}:{marker.line}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                      marker.type === 'FIXME' || marker.type === 'HACK'
                        ? 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {marker.type}
                  </span>
                </div>
                <div className="text-xs font-mono text-amber-400/90 pl-2 border-l border-amber-500/40">
                  {marker.comment}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Configs & CI Status */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border-slate-800 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
                Missing Configurations
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {exorcist.missingConfig.map((item, idx) => (
                <li
                  key={idx}
                  className="p-2.5 rounded-lg bg-[#090d15] border border-slate-800 flex items-start gap-2"
                >
                  <span className="text-rose-400 select-none">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
              CI/CD & Test Automation Status
            </h4>
            <div className="p-3 rounded-xl bg-[#090d15] border border-slate-800 text-xs space-y-1.5 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Automated CI:</span>
                <span className={exorcist.testCoverageStatus.hasCi ? 'text-emerald-400' : 'text-rose-400'}>
                  {exorcist.testCoverageStatus.hasCi ? 'Detected' : 'None Configured'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Test Framework:</span>
                <span className="text-slate-200">
                  {exorcist.testCoverageStatus.testFramework || 'Unknown / Legacy'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                {exorcist.testCoverageStatus.notes}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
