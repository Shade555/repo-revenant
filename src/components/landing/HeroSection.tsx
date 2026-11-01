'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Skull,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Radio,
  Layers,
  Terminal,
  Activity,
  Zap,
} from 'lucide-react';
import { AltarSigil } from '@/components/ui/AltarSigil';
import { sound } from '@/lib/audio/sound-synth';

const SPECIMEN_PODS = [
  {
    name: 'facebookarchive/three20',
    title: 'Specimen 01: Three20',
    subtitle: 'iOS 2.x/3.x UIKit Extension Suite',
    depthDays: 5158,
    primaryLang: 'Objective-C',
    stratum: 'MRR Pre-ARC Bedrock',
    bitrotIndex: '68.4% (Critical)',
    bitrotColor: 'text-rose-400',
    stars: '10.4k',
    dossierId: 'dossier-three20-archived',
    notes: 'Preserved artifact of the original Facebook iPhone application. Contains early URL router and photo viewer.',
  },
  {
    name: 'visionmedia/mon',
    title: 'Specimen 02: mon',
    subtitle: 'Micro C Daemon Supervisor',
    depthDays: 3368,
    primaryLang: 'POSIX C',
    stratum: 'Pre-Systemd Minimalist UNIX',
    bitrotIndex: '21.0% (Low)',
    bitrotColor: 'text-emerald-400',
    stars: '3.2k',
    dossierId: 'dossier-mon-archived',
    notes: 'TJ Holowaychuk minimalist process monitor. Single-file C architecture with low algorithmic decay.',
  },
  {
    name: 'richhickey/clojure-clr',
    title: 'Specimen 03: clojure-clr',
    subtitle: 'Microsoft CLR Clojure Compiler',
    depthDays: 4210,
    primaryLang: 'C# / Lisp',
    stratum: '.NET Framework 3.5 / DLR',
    bitrotIndex: '46.8% (Moderate)',
    bitrotColor: 'text-amber-400',
    stars: '1.8k',
    url: 'https://github.com/richhickey/clojure-clr',
    notes: 'Rich Hickey native Clojure implementation for Microsoft .NET Common Language Runtime.',
  },
];

export function HeroSection() {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ritualMode, setRitualMode] = useState<'EXHUMATION' | 'AUTOPSY' | 'RESURRECTION'>('EXHUMATION');
  const [selectedSpecimen, setSelectedSpecimen] = useState(SPECIMEN_PODS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = repoUrl.trim();
    if (!trimmed) {
      setError('Please provide a GitHub repository URL or owner/repo identifier');
      sound.playClick(300);
      return;
    }

    const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)\/?.*$/;
    const shorthandRegex = /^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/;

    let owner = '';
    let repo = '';

    const matchUrl = trimmed.match(githubRegex);
    if (matchUrl) {
      owner = matchUrl[3];
      repo = matchUrl[4].replace(/\.git$/, '');
    } else {
      const matchShort = trimmed.match(shorthandRegex);
      if (matchShort) {
        owner = matchShort[1];
        repo = matchShort[2];
      } else {
        setError('Invalid coordinate format. Use https://github.com/owner/repo or owner/repo');
        sound.playClick(300);
        return;
      }
    }

    sound.playSwitch();
    sound.playSpectralChime();
    setIsSubmitting(true);
    router.push(`/investigate?target=${encodeURIComponent(`${owner}/${repo}`)}&mode=${ritualMode}`);
  };

  const handleSelectPod = (pod: (typeof SPECIMEN_PODS)[0]) => {
    sound.playClick(900);
    setSelectedSpecimen(pod);
    if (pod.dossierId) {
      router.push(`/dashboard/${pod.dossierId}`);
    } else {
      setRepoUrl(pod.name);
      router.push(`/investigate?target=${encodeURIComponent(pod.name)}`);
    }
  };

  return (
    <section className="relative pt-8 pb-20 md:pt-14 md:pb-28 overflow-hidden archaeological-grid">
      {/* Background Spectral Spotlight & Atmospheric Vignette */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-b from-amber-500/10 via-violet-600/10 to-transparent blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hacktoberfest Week 4 Technical Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
              EXCAVATION CHAMBER ONLINE
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="text-amber-400/90 flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              <span>HACKTOBERFEST 2026 // WEEK 4: GHOST IN THE MACHINE</span>
            </span>
          </div>
        </div>

        {/* Main Console Grid: Left Summoning Deck, Right Specimen Vault */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Left Column: Altar, Title & Input Console */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  <span className="tracking-widest uppercase font-semibold">
                    AUTONOMOUS REPOSITORY FORENSICS & RECOVERY
                  </span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.08] font-mono">
                  Some code deserves <br />
                  <span className="text-amber-400 text-glow-marigold">
                    a second life.
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                  Enter any dormant, archived, or forgotten GitHub repository. A coordinated cabal of autonomous AI agents excavates commit geology, diagnoses compiler bitrot, and summons an evidence-backed resurrection blueprint.
                </p>
              </div>

              <AltarSigil size={104} active={true} className="hidden sm:flex shrink-0 mt-3" />
            </div>

            {/* Ritual Mode Toggle Selector */}
            <div className="p-1 rounded-xl bg-[#090d16] border border-slate-800/90 inline-flex items-center gap-1 text-[11px] font-mono">
              {(['EXHUMATION', 'AUTOPSY', 'RESURRECTION'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    sound.playClick(700);
                    setRitualMode(mode);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    ritualMode === mode
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_10px_rgba(229,169,60,0.2)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  MODE: {mode}
                </button>
              ))}
            </div>

            {/* The Injection Terminal (Input Card with Corner Brackets) */}
            <div className="bracket-box p-4 sm:p-5 rounded-xl bg-[#080b12]/95 border border-amber-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.8)] relative">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-2">
                <span>INSPECTION TARGET // GITHUB SPECIMEN URI</span>
                <span>SEC-RESTRICTED: api.github.com</span>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1 flex items-center">
                  <Search className="absolute left-3.5 w-4 h-4 text-amber-400/80 pointer-events-none" />
                  <input
                    type="text"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    onKeyDown={() => sound.playClick(1000)}
                    placeholder="https://github.com/facebookarchive/three20 or owner/repo"
                    className="w-full pl-10 pr-3 py-3 bg-[#05070c] rounded-lg border border-slate-700/80 text-white placeholder-slate-500 font-mono text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-500/30 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(229,169,60,0.4)] hover:shadow-[0_0_30px_rgba(229,169,60,0.6)] active:scale-98 transition-all disabled:opacity-70 cursor-pointer shrink-0"
                >
                  {isSubmitting ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                      <span>EXHUMING SPECIMEN...</span>
                    </>
                  ) : (
                    <>
                      <Skull className="w-4 h-4 text-slate-950" />
                      <span>SUMMON HARNESS</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              {error && (
                <div className="mt-2.5 px-3 py-1.5 rounded bg-rose-950/80 border border-rose-500/40 text-xs font-mono text-rose-300">
                  {error}
                </div>
              )}

              <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-white/[0.04]">
                <span>SOVEREIGN INTELLIGENCE: GEMMA 3 (OPEN-WEIGHT)</span>
                <span>SANDBOX: ZERO HOST CODE EXECUTION</span>
              </div>
            </div>
          </div>

          {/* Right Column: Specimen Containment Pods (The Reliquary) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 text-xs font-mono text-violet-400">
                <Layers className="w-4 h-4 text-violet-400" />
                <span className="font-bold tracking-wider uppercase">
                  PRESERVED SPECIMEN VAULT
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                3 ARTIFACTS IN STASIS
              </span>
            </div>

            {/* Specimen Pods */}
            <div className="space-y-3">
              {SPECIMEN_PODS.map((pod) => {
                const isSelected = selectedSpecimen.name === pod.name;
                return (
                  <div
                    key={pod.name}
                    onClick={() => handleSelectPod(pod)}
                    className={`bracket-box p-4 rounded-xl transition-all cursor-pointer relative overflow-hidden group ${
                      isSelected
                        ? 'stasis-pod stasis-pod-active'
                        : 'bg-[#080b12]/80 border border-slate-800 hover:border-amber-500/40 hover:bg-[#0c101a]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-white group-hover:text-amber-300 transition-colors">
                            {pod.title}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700 text-slate-400">
                            ★ {pod.stars}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                          {pod.subtitle}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-mono text-slate-500 block">
                          STRATUM DEPTH
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-400">
                          {pod.depthDays.toLocaleString()} DAYS
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-2">
                      {pod.notes}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-2 border-t border-white/[0.05]">
                      <div>
                        <span className="text-slate-500">Stratum: </span>
                        <span className="text-slate-300">{pod.stratum}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500">Decay: </span>
                        <span className={pod.bitrotColor}>{pod.bitrotIndex}</span>
                      </div>
                    </div>

                    {/* Action link */}
                    <div className="mt-2 text-right">
                      <span className="text-[10px] font-mono text-amber-400/90 group-hover:text-amber-300 inline-flex items-center gap-1">
                        <span>Examine Forensic Dossier</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Technical Guarantee Calibration Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/[0.06]">
          <div className="p-3.5 rounded-lg bg-[#06080e] border border-slate-800/80 flex items-center gap-3">
            <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-white">Strict Evidence Citations</div>
              <div className="text-[11px] text-slate-400">Verified commit SHAs & lines. Zero hallucinated motives.</div>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#06080e] border border-slate-800/80 flex items-center gap-3">
            <div className="p-2 rounded bg-violet-500/10 border border-violet-500/20 text-violet-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-white">The Developer Séance</div>
              <div className="text-[11px] text-slate-400">RAG transceiver speaking directly to codebase memory.</div>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#06080e] border border-slate-800/80 flex items-center gap-3">
            <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-white">Gemma 3 & Mastra Core</div>
              <div className="text-[11px] text-slate-400">Open-weight local model. Sovereign from proprietary APIs.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
