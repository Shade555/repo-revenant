'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Skull,
  Star,
  GitFork,
  AlertCircle,
  ExternalLink,
  Download,
  Share2,
  Check,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { DossierReport } from '@/types';
import { calculateDaysAgo, formatNumber } from '@/lib/utils';
import { sound } from '@/lib/audio/sound-synth';

export function DossierHeader({ dossier }: { dossier: DossierReport }) {
  const [copied, setCopied] = useState(false);
  const daysDormant = calculateDaysAgo(dossier.historian.lastCommitDate);

  const handleCopyShare = () => {
    sound.playClick(850);
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportJson = () => {
    sound.playClick(1000);
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(dossier, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${dossier.name}-revival-dossier.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bracket-box p-6 sm:p-8 rounded-2xl bg-[#080b12] border border-amber-500/30 mb-8 relative overflow-hidden shadow-2xl">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 blur-[80px] pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          {/* Identity & Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300 font-bold">
              <Skull className="w-3.5 h-3.5 text-amber-400" />
              <span>REVIVAL DOSSIER #{dossier.id}</span>
            </span>

            {dossier.isDemo && (
              <span className="px-3 py-1 rounded-full bg-violet-950/70 text-violet-300 border border-violet-500/30 text-xs font-mono font-bold">
                DEMONSTRATION SPECIMEN
              </span>
            )}

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-700 text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Dormant for {daysDormant.toLocaleString()} days</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
              {dossier.owner}/<span className="text-amber-400">{dossier.name}</span>
            </h1>
            <a
              href={dossier.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
              title="Open GitHub Repository"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>

          <p className="text-slate-300 text-sm max-w-3xl mt-2 leading-relaxed font-sans">
            {dossier.description}
          </p>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-5 mt-4 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300">{formatNumber(dossier.stars)} stars</span>
            </div>
            <div className="flex items-center gap-1.5">
              <GitFork className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300">{formatNumber(dossier.forks)} forks</span>
            </div>
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span className="text-slate-300">{dossier.openIssues} open issues</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">License:</span>
              <span className="text-slate-200 font-semibold">{dossier.license}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleCopyShare}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
            <span>{copied ? 'Link Copied' : 'Share'}</span>
          </button>

          <button
            onClick={handleExportJson}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <Link
            href={`/investigate?target=${encodeURIComponent(`${dossier.owner}/${dossier.name}`)}`}
            className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-mono font-bold text-amber-300 flex items-center gap-2 transition-all shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-excavate</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
