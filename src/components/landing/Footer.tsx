'use client';

import React from 'react';
import Link from 'next/link';
import { Skull, Heart, Radio } from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#05070a] text-slate-400 py-12 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Skull className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">
                REPO<span className="text-amber-400">REVENANT</span>
              </div>
              <div className="text-[11px] text-slate-500">
                &ldquo;Some code deserves a second life.&rdquo;
              </div>
            </div>
          </div>

          {/* Hacktoberfest Details */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-amber-300">
            <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Hacktoberfest 2026 • Week 4: Ghost in the Machine</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard/dossier-three20-archived"
              className="hover:text-amber-300 transition-colors"
            >
              Demo Dossier
            </Link>
            <a
              href="https://github.com/Shade555/repo-revenant"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            Open-source under MIT & Apache 2.0 Licenses. Powered by Gemma 3 & Mastra.
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>for dormant repositories everywhere.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
