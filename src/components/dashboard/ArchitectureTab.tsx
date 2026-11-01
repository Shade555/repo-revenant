'use client';

import React from 'react';
import { DossierReport } from '@/types';
import {
  Pickaxe,
  Layers,
  FolderTree,
  FileCode,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen,
} from 'lucide-react';

export function ArchitectureTab({ dossier }: { dossier: DossierReport }) {
  const { archaeologist } = dossier;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>Complete</span>
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-950/60 text-amber-300 border border-amber-500/30">
            <AlertCircle className="w-3 h-3" />
            <span>Partial</span>
          </span>
        );
      case 'stub':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-violet-950/60 text-violet-300 border border-violet-500/30">
            <HelpCircle className="w-3 h-3" />
            <span>Stub</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-rose-950/60 text-rose-400 border border-rose-500/30">
            <AlertCircle className="w-3 h-3" />
            <span>Broken</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Architecture Overview & Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 glass-panel p-6 sm:p-7 rounded-2xl border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              Architecture Overview
            </h3>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed bg-[#090d15]/80 p-4 rounded-xl border border-slate-800">
            {archaeologist.architectureOverview}
          </p>

          {/* Languages Distribution */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-mono text-slate-400 uppercase">
              Language Composition
            </div>
            <div className="flex h-2.5 rounded-full overflow-hidden bg-slate-800">
              {archaeologist.languages.map((lang) => (
                <div
                  key={lang.name}
                  style={{
                    width: `${lang.percentage}%`,
                    backgroundColor: lang.color || '#438eff',
                  }}
                  title={`${lang.name}: ${lang.percentage}%`}
                />
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
              {archaeologist.languages.map((lang) => (
                <div key={lang.name} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: lang.color || '#438eff' }}
                  />
                  <span>
                    {lang.name} ({lang.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Frameworks & Doc Audit */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border-slate-800 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
                Documentation Audit
              </h3>
            </div>

            <div className="p-3 rounded-xl bg-[#090d15] border border-slate-800 space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">README Quality</span>
                <span className="font-bold text-amber-300">
                  {archaeologist.documentationAssessment.readmeQuality}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">License File</span>
                <span className="text-emerald-400 font-bold">
                  {archaeologist.documentationAssessment.hasLicense ? 'Present' : 'Missing'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Contributing Guide</span>
                <span className="text-rose-400 font-bold">
                  {archaeologist.documentationAssessment.hasContributingGuide ? 'Present' : 'Missing'}
                </span>
              </div>
            </div>

            <div className="text-xs font-mono text-slate-400 uppercase mb-2">
              Detected Frameworks
            </div>
            <div className="flex flex-wrap gap-1.5">
              {archaeologist.frameworks.map((f) => (
                <span
                  key={f}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Entry Points & Directory Anatomy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Entry Points */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <FileCode className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              Application Entry Points
            </h3>
          </div>

          <div className="space-y-3">
            {archaeologist.entryPoints.map((ep) => (
              <div
                key={ep.path}
                className="p-3.5 rounded-xl bg-[#090d15] border border-slate-800/90 hover:border-slate-700 transition-all space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-300">
                    {ep.path}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">
                    {ep.type}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{ep.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Directory Structure */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <FolderTree className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              Excavated Directory Structure
            </h3>
          </div>

          <div className="space-y-2.5">
            {archaeologist.directoryStructure.map((dir) => (
              <div
                key={dir.path}
                className="p-3 rounded-xl bg-[#090d15] border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-mono font-bold text-slate-200">
                    {dir.path}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {dir.purpose}
                  </div>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${
                    dir.health === 'intact'
                      ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/20'
                      : dir.health === 'incomplete'
                      ? 'bg-amber-950/50 text-amber-400 border border-amber-500/20'
                      : 'bg-rose-950/50 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {dir.health}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Inventory Table */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
            <Pickaxe className="w-4 h-4 text-amber-400" />
            <span>Feature Completeness Inventory</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {archaeologist.featureInventory.length} Features Cataloged
          </span>
        </div>

        <div className="space-y-3">
          {archaeologist.featureInventory.map((item) => (
            <div
              key={item.name}
              className="p-3.5 rounded-xl bg-[#090d15] border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <div className="text-xs font-mono font-bold text-white">
                  {item.name}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Evidence: {item.evidence}
                </div>
              </div>
              <div>{getStatusBadge(item.status)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
