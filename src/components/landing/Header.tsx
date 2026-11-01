'use client';

import React from 'react';
import Link from 'next/link';
import { Skull, Compass, Sparkles } from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-500/15 bg-[#080a0f]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500/20 to-violet-600/30 border border-amber-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(229,169,60,0.25)] group-hover:border-amber-400 transition-all">
            <Skull className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-wide text-white font-mono group-hover:text-amber-300 transition-colors">
                REPO<span className="text-amber-400">REVENANT</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-950/80 text-violet-300 border border-violet-500/30">
                v1.0
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono tracking-tight hidden sm:block">
              Repository Resurrection Harness
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300 font-mono">
          <Link
            href="/#agents"
            className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>The Agents</span>
          </Link>
          <Link
            href="/#workflow"
            className="hover:text-amber-300 transition-colors"
          >
            Workflow
          </Link>
          <Link
            href="/#open-source"
            className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Gemma 3 & Mastra</span>
          </Link>
          <Link
            href="/dashboard/dossier-three20-archived"
            className="hover:text-amber-300 transition-colors text-amber-400/90"
          >
            Explore Sample Dossier
          </Link>
        </nav>

        {/* Action / Badges */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono text-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span>Hacktoberfest 2026: Ghost in the Machine</span>
          </div>

          <a
            href="https://github.com/Shade555/repo-revenant"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-xs font-mono text-slate-200 hover:border-amber-500/40 transition-all"
          >
            <GithubIcon className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">Star on GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
