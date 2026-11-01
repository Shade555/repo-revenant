'use client';

import React, { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Skull, Compass, Sparkles, Volume2, VolumeX, Terminal } from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';
import { sound } from '@/lib/audio/sound-synth';

const emptySubscribe = () => () => {};

export function Header() {
  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [audioOverride, setAudioOverride] = useState<boolean | null>(null);

  const audioEnabled =
    audioOverride !== null ? audioOverride : isMounted ? sound.getIsEnabled() : false;

  const handleToggleAudio = () => {
    const newState = sound.toggleMute();
    setAudioOverride(newState);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-500/20 bg-[#06080d]/90 backdrop-blur-md">
      {/* Top Technical Calibration Telemetry Bar */}
      <div className="w-full bg-[#040508] border-b border-white/[0.04] px-4 sm:px-6 lg:px-8 py-1 hidden sm:flex items-center justify-between text-[10px] font-mono text-slate-400 select-none">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>HARNESS::ACTIVE</span>
          </span>
          <span className="text-slate-600">|</span>
          <span>STRATIGRAPHY: SEC-04</span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-400/80">CORE: GEMMA-3:4B (OLLAMA)</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-violet-400">CHAMBER: SÉANCE RECEPTIVE</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-500">HACKTOBERFEST 2026 // WK-4</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Occult Glyph */}
        <Link
          href="/"
          onClick={() => sound.playClick(900)}
          className="flex items-center gap-3.5 group"
        >
          <div className="relative w-9 h-9 rounded-lg bg-[#0a0e18] border border-amber-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(229,169,60,0.25)] group-hover:border-amber-400 group-hover:shadow-[0_0_20px_rgba(229,169,60,0.4)] transition-all">
            <Skull className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-wider text-white font-mono group-hover:text-amber-300 transition-colors">
                REPO<span className="text-amber-400">REVENANT</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-violet-950/80 text-violet-300 border border-violet-500/30">
                v1.0
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono tracking-tight hidden sm:block">
              Archaeological Software Resurrection Harness
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-slate-300">
          <Link
            href="/#agents"
            onClick={() => sound.playClick(600)}
            className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>The Council</span>
          </Link>
          <Link
            href="/#workflow"
            onClick={() => sound.playClick(600)}
            className="hover:text-amber-300 transition-colors"
          >
            Workflow
          </Link>
          <Link
            href="/#relics"
            onClick={() => sound.playClick(600)}
            className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Relic Vault</span>
          </Link>
          <Link
            href="/dashboard/dossier-three20-archived"
            onClick={() => sound.playClick(750)}
            className="hover:text-amber-300 transition-colors text-amber-400/90 flex items-center gap-1"
          >
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span>Sample Dossier</span>
          </Link>
        </nav>

        {/* Actions & Audio Synthesizer Toggle */}
        <div className="flex items-center gap-3">
          {/* Audio Ambiance Toggle */}
          {isMounted && (
            <button
              onClick={handleToggleAudio}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                audioEnabled
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-[0_0_12px_rgba(229,169,60,0.25)]'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title={audioEnabled ? 'Mute procedural laboratory audio' : 'Enable procedural laboratory audio'}
            >
              {audioEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span className="hidden sm:inline">AUDIO: ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">AUDIO: OFF</span>
                </>
              )}
            </button>
          )}

          <a
            href="https://github.com/Shade555/repo-revenant"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick(800)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-xs font-mono text-slate-200 hover:border-amber-500/40 transition-all"
          >
            <GithubIcon className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
