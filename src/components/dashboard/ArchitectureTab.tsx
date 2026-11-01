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
  Code,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';
import { sound } from '@/lib/audio/sound-synth';

export function ArchitectureTab({ dossier }: { dossier: DossierReport }) {
  const { archaeologist } = dossier;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/40">
            <CheckCircle2 className="w-3 h-3" />
            <span>Complete</span>
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-amber-950/60 text-amber-300 border border-amber-500/40">
            <AlertCircle className="w-3 h-3" />
            <span>Partial</span>
          </span>
        );
      case 'stub':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-violet-950/60 text-violet-300 border border-violet-500/40">
            <HelpCircle className="w-3 h-3" />
            <span>Stub</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-rose-950/60 text-rose-400 border border-rose-500/40">
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
        <div className="lg:col-span-8 bracket-box p-6 sm:p-7 rounded-2xl bg-[#080b12] border border-slate-800 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                Reconstructed Architecture Overview
              </h3>
            </div>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/30">
              AST EXCAVATED
            </span>
          </div>

          <p className="text-slate-200 text-sm sm:text-base leading-relaxed bg-[#05070c] p-4 rounded-xl border border-slate-800 font-sans">
            {archaeologist.architectureOverview}
          </p>

          {/* Languages Distribution */}
          <div className="space-y-2 pt-3 border-t border-slate-800/80">
            <div className="text-xs font-mono text-slate-400 uppercase flex items-center justify-between">
              <span>Language Composition Stratum</span>
              <span className="text-slate-500">{archaeologist.languages.length} Languages</span>
            </div>
            <div className="flex h-3 rounded-full overflow-hidden bg-slate-900 border border-slate-800">
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
              {archaeologist.languages.map((lang, idx) => (
                <div
                  key={lang.name}
                  onClick={() => sound.playClick(500 + idx * 80)}
                  className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors"
                >
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
        <div className="lg:col-span-4 bracket-box p-6 rounded-2xl bg-[#080b12] border border-slate-800 shadow-2xl space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                Documentation Health Audit
              </h3>
            </div>

            <div className="p-3.5 rounded-xl bg-[#05070c] border border-slate-800/90 space-y-2.5 mb-4 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">README Quality</span>
                <span className="font-bold text-amber-300">
                  {archaeologist.documentationAssessment.readmeQuality}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">License File</span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  {archaeologist.documentationAssessment.hasLicense ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Present</span>
                    </>
                  ) : (
                    <>
                      <X className="w-3.5 h-3.5 text-rose-400" />
                      <span className="text-rose-400">Missing</span>
                    </>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Contributing Guide</span>
                <span className="flex items-center gap-1 text-rose-400 font-bold">
                  {archaeologist.documentationAssessment.hasContributingGuide ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Present</span>
                    </>
                  ) : (
                    <>
                      <X className="w-3.5 h-3.5" />
                      <span>Missing</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="text-xs font-mono text-slate-400 uppercase mb-2">
              Detected Frameworks
            </div>
            <div className="flex flex-wrap gap-2">
              {archaeologist.frameworks.map((f) => (
                <span
                  key={f}
                  className="px-2.5 py-1 rounded-lg bg-[#05070c] border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-1"
                >
                  <Code className="w-3 h-3 text-cyan-400" />
                  <span>{f}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>VERIFIED ARTIFACTS ONLY</span>
          </div>
        </div>
      </div>

      {/* Entry Points & Directory Anatomy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Entry Points */}
        <div className="lg:col-span-6 bracket-box p-6 rounded-2xl bg-[#080b12] border border-slate-800 shadow-2xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                Application Entry Points
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              {archaeologist.entryPoints.length} DETECTED
            </span>
          </div>

          <div className="space-y-3">
            {archaeologist.entryPoints.map((ep, idx) => (
              <div
                key={ep.path}
                onClick={() => sound.playClick(600 + idx * 80)}
                className="p-3.5 rounded-xl bg-[#05070c] border border-slate-800/90 hover:border-slate-700 transition-all space-y-1 group cursor-default"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-300 group-hover:text-amber-200">
                    {ep.path}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    {ep.type}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-sans">{ep.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Directory Structure */}
        <div className="lg:col-span-6 bracket-box p-6 rounded-2xl bg-[#080b12] border border-slate-800 shadow-2xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                Excavated Directory Structure
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              TOPOLOGICAL AUDIT
            </span>
          </div>

          <div className="space-y-2.5">
            {archaeologist.directoryStructure.map((dir, idx) => (
              <div
                key={dir.path}
                onClick={() => sound.playClick(400 + idx * 60)}
                className="p-3 rounded-xl bg-[#05070c] border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between text-xs cursor-default"
              >
                <div>
                  <div className="font-mono font-bold text-slate-200">
                    {dir.path}
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                    {dir.purpose}
                  </div>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                    dir.health === 'intact'
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                      : dir.health === 'incomplete'
                      ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                      : 'bg-rose-950/60 text-rose-400 border border-rose-500/40'
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
      <div className="bracket-box p-6 rounded-2xl bg-[#080b12] border border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
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
              className="p-3.5 rounded-xl bg-[#05070c] border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <div className="text-xs font-mono font-bold text-white">
                  {item.name}
                </div>
                <div className="text-xs text-slate-400 font-sans mt-0.5">
                  Evidence Anchor: <span className="font-mono text-slate-300">{item.evidence}</span>
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
