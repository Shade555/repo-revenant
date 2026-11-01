'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Skull,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Flame,
  Radio,
  Code2,
} from 'lucide-react';

const SAMPLE_REPOS = [
  {
    name: 'facebookarchive/three20',
    title: 'Three20 (iOS Framework)',
    stars: '10.4k',
    desc: 'The original Facebook iOS framework that pioneered URL routing & photo viewers.',
    dossierId: 'dossier-three20-archived',
  },
  {
    name: 'visionmedia/mon',
    title: 'mon (C Process Monitor)',
    stars: '3.2k',
    desc: 'TJ Holowaychuk’s ultra-minimal UNIX supervisor before Docker dominance.',
    dossierId: 'dossier-mon-archived',
  },
  {
    name: 'richhickey/clojure-clr',
    title: 'clojure-clr (.NET Runtime)',
    stars: '1.8k',
    desc: 'Rich Hickey’s native Clojure compiler port for the Microsoft CLR ecosystem.',
    url: 'https://github.com/richhickey/clojure-clr',
  },
];

export function HeroSection() {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = repoUrl.trim();
    if (!trimmed) {
      setError('Please provide a GitHub repository URL or owner/repo path');
      return;
    }

    // Validate GitHub URL format
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
        setError('Invalid format. Use https://github.com/owner/repo or owner/repo');
        return;
      }
    }

    setIsSubmitting(true);
    router.push(`/investigate?target=${encodeURIComponent(`${owner}/${repo}`)}`);
  };

  const handleSelectSample = (sample: (typeof SAMPLE_REPOS)[0]) => {
    if (sample.dossierId) {
      router.push(`/dashboard/${sample.dossierId}`);
    } else {
      setRepoUrl(sample.name);
      router.push(`/investigate?target=${encodeURIComponent(sample.name)}`);
    }
  };

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
      {/* Background radial spotlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-b from-amber-500/10 via-violet-600/10 to-transparent blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hacktoberfest Week 4 Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-violet-900/30 to-amber-500/15 border border-amber-500/30 text-xs font-mono text-amber-300 shadow-[0_0_20px_rgba(229,169,60,0.15)]">
            <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Hacktoberfest 2026 Challenge • Week 4: Ghost in the Machine</span>
          </div>
        </motion.div>

        {/* Main Headings */}
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500/50" />
            <span className="font-mono text-xs uppercase tracking-widest text-amber-400/90 font-semibold">
              Autonomous Software Archaeology
            </span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500/50" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]"
          >
            Some code deserves <br />
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-violet-400 bg-clip-text text-transparent text-glow-marigold">
              a second life.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal"
          >
            Enter any inactive or abandoned GitHub repository. A coordinated cabal of
            autonomous AI agents uncovers original author intent, diagnoses compiler bitrot,
            and summons an evidence-backed resurrection blueprint.
          </motion.p>
        </div>

        {/* URL Summoning Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <div className="glass-panel p-2 sm:p-3 rounded-2xl border-amber-500/30 shadow-[0_0_50px_rgba(0,0,0,0.6)] relative overflow-hidden group">
            {/* Ambient border sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-violet-500/10 to-transparent pointer-events-none" />

            <form onSubmit={handleSubmit} className="relative z-10 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-amber-400/70 pointer-events-none" />
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/facebookarchive/three20 or owner/repo"
                  className="w-full pl-12 pr-4 py-3.5 bg-[#0a0d14]/90 rounded-xl border border-slate-700/80 text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-mono font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(229,169,60,0.4)] hover:shadow-[0_0_35px_rgba(229,169,60,0.6)] active:scale-98 transition-all disabled:opacity-70 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                    <span>SUMMONING...</span>
                  </>
                ) : (
                  <>
                    <Skull className="w-4 h-4 text-slate-950" />
                    <span>SUMMON HARNESS</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-2.5 px-4 py-2 rounded-lg bg-rose-950/70 border border-rose-500/40 text-xs font-mono text-rose-300">
                {error}
              </div>
            )}
          </div>

          {/* Quick Summon Curated Repositories */}
          <div className="mt-6 flex flex-col items-center">
            <span className="text-xs font-mono text-slate-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Or explore pre-excavated historical artifacts:</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
              {SAMPLE_REPOS.map((sample) => (
                <button
                  key={sample.name}
                  onClick={() => handleSelectSample(sample)}
                  className="glass-panel p-3 rounded-xl border-slate-800 hover:border-amber-500/40 text-left transition-all group hover:bg-[#121722]/80 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono font-semibold text-slate-200 group-hover:text-amber-300 transition-colors">
                      <span className="truncate">{sample.title}</span>
                      <span className="text-[11px] text-amber-400/90 font-mono">
                        ★ {sample.stars}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {sample.desc}
                    </p>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500 group-hover:text-amber-400">
                    <span>{sample.dossierId ? 'View Dossier' : 'Inspect Code'}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Feature Highlights Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="p-4 rounded-xl bg-[#0b0e15]/90 border border-slate-800/80 flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-mono">Strict Evidence Citations</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Clear separation of verified observations (commit SHAs, file lines) versus reasonable inferences. Never hallucinates reasons for abandonment.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0b0e15]/90 border border-slate-800/80 flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-mono">The Developer Séance</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Speak directly to the digital phantom of the repository. Query architectural motives and get advice grounded in real project artifacts.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0b0e15]/90 border border-slate-800/80 flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-mono">Gemma 3 & Mastra Core</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Powered by Google&apos;s open-weight Gemma 3 model via local Ollama and orchestrated with Mastra. Zero mandatory proprietary API dependencies.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
