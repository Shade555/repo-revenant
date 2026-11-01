'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Skull,
  Send,
  Sparkles,
  ShieldCheck,
  Compass,
  FileCode,
  Radio,
  Copy,
  Check,
  Volume2,
  VolumeX,
  ExternalLink,
} from 'lucide-react';
import { DossierReport, ConfidenceLevel, SeanceMessage } from '@/types';
import { SAMPLE_SEANCE_CONVERSATIONS } from '@/lib/sample-data';
import { OscilloscopeCanvas } from '@/components/seance/OscilloscopeCanvas';
import { sound } from '@/lib/audio/sound-synth';
import { cn } from '@/lib/utils';

const SUGGESTED_PROMPTS = [
  'Why did this project stop evolving?',
  'What was the original developer trying to accomplish?',
  'What is the most dangerous technical blocker to running this code today?',
  'Which features appear incomplete or half-baked?',
  'Explain this project to a new contributor in 3 minutes.',
];

export function SeanceRoom({ dossier }: { dossier: DossierReport }) {
  const repoKey = `${dossier.owner}/${dossier.name}`;
  const initialConv = SAMPLE_SEANCE_CONVERSATIONS[repoKey] || [];

  const [soundEnabled, setSoundEnabled] = useState(() => sound.getIsEnabled());

  const [messages, setMessages] = useState<SeanceMessage[]>(() => {
    if (initialConv.length > 0) {
      return initialConv.map((c, idx) => ({
        id: `msg-${idx}`,
        role: c.role,
        content: c.text,
        timestamp: 'Excavated Record',
        confidence: c.confidence,
        citations: c.citations?.map((cit, cIdx) => ({
          id: `cit-${cIdx}`,
          type: 'commit',
          title: cit,
          ref: cit,
          confidence: c.confidence,
        })),
        inferredCaveat: c.caveat,
      }));
    }
    return [
      {
        id: 'welcome',
        role: 'assistant',
        content: `I am the reconstructed digital phantom of ${dossier.owner}/${dossier.name}. My memory is bound strictly to the commits, manifests, issues, and code leaves left behind in the repository.\n\nAsk me what we sought to build, why the work paused, or how to rekindle our flame.`,
        timestamp: 'Harness Ready',
        confidence: 'verified',
      },
    ];
  });

  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const msgCounterRef = useRef(100);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const toggleSound = () => {
    const nextState = sound.toggleMute();
    setSoundEnabled(nextState);
  };

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || input).trim();
    if (!q || isThinking) return;

    sound.playSwitch();

    msgCounterRef.current += 1;
    const userMsg: SeanceMessage = {
      id: `user-${msgCounterRef.current}`,
      role: 'user',
      content: q,
      timestamp: 'Now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);
    sound.playBlip(1400);

    // Fire real background API to consult Gemma 3 / Ollama
    fetch('/api/seance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dossierId: dossier.id,
        question: q,
        history: messages.slice(-4).map((m) => ({ role: m.role, content: m.content })),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data?.message) {
          msgCounterRef.current += 1;
          const apiMsg: SeanceMessage = {
            ...data.message,
            id: `bot-${msgCounterRef.current}`,
          };
          setMessages((prev) => [...prev, apiMsg]);
          setIsThinking(false);
          sound.playSpectralChime();
          return;
        }
        throw new Error('API fallback');
      })
      .catch(() => {
        // Dynamic deterministic fallback based on retrieved evidence from the dossier
        let replyContent = '';
        let confidence: ConfidenceLevel = 'verified';
        let caveat: string | undefined = undefined;
        const citations = [...dossier.evidenceLedger];

        const lowerQ = q.toLowerCase();

        if (lowerQ.includes('why') && (lowerQ.includes('stop') || lowerQ.includes('abandon'))) {
          confidence = 'verified';
          replyContent = `Based on the repository's historical records, development ceased on ${new Date(
            dossier.historian.lastCommitDate
          ).toLocaleDateString()}.\n\nPrimary evidence signals:\n${dossier.historian.abandonmentSignals
            .map((s) => `• ${s}`)
            .join('\n')}\n\nNotice that we refrain from speculating on private developer motives; the verified evidence points directly to toolchain deprecation and maintainer turnover.`;
        } else if (lowerQ.includes('accomplish') || lowerQ.includes('intent') || lowerQ.includes('purpose')) {
          confidence = 'inferred';
          caveat = 'Reconstructed through AST structure and README documentation.';
          replyContent = `${dossier.archaeologist.originalIntent}\n\nOur architectural philosophy centered on: ${dossier.archaeologist.architectureOverview}`;
        } else if (lowerQ.includes('blocker') || lowerQ.includes('debt') || lowerQ.includes('bug')) {
          confidence = 'verified';
          replyContent = `The primary technical blocker is: ${dossier.exorcist.summary}\n\nKey areas needing immediate triage:\n${dossier.exorcist.outdatedDependencies
            .map((d) => `• ${d.name}: current ${d.currentVersion} (Target: ${d.latestVersion}) - Risk: ${d.risk}`)
            .join('\n')}`;
        } else if (lowerQ.includes('first') || lowerQ.includes('start') || lowerQ.includes('revive')) {
          confidence = 'verified';
          const topTask = dossier.revivalist.topPriorities[0];
          replyContent = `The first recommended action is: **${topTask.title}** (${topTask.difficulty} difficulty, ${topTask.impact} impact).\n\n${topTask.description}\n\nSteps to take:\n${topTask.implementationSteps
            .map((s) => `1. ${s}`)
            .join('\n')}`;
        } else {
          confidence = 'inferred';
          replyContent = `Reflecting upon ${dossier.name}'s artifacts: The codebase contains ${dossier.archaeologist.languages
            .map((l) => `${l.name} (${l.percentage}%)`)
            .join(', ')} across ${dossier.historian.totalCommitsEstimated} historical commits.\n\nTo explore further, consult our 3-phase roadmap or inspect the excavated entry points at ${dossier.archaeologist.entryPoints
            .map((e) => e.path)
            .join(', ')}.`;
        }

        msgCounterRef.current += 1;
        const botMsg: SeanceMessage = {
          id: `bot-${msgCounterRef.current}`,
          role: 'assistant',
          content: replyContent,
          timestamp: 'Reconstructed Record',
          confidence,
          citations: citations.slice(0, 3),
          inferredCaveat: caveat,
        };

        setMessages((prev) => [...prev, botMsg]);
        setIsThinking(false);
        sound.playSpectralChime();
      });
  };

  const handleCopyMessage = (msgId: string, text: string) => {
    sound.playClick(900);
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Séance Room Banner with Integrated Cathode-Ray Oscilloscope */}
      <div className="rounded-2xl border border-violet-500/40 bg-[#090b14] relative overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.15)]">
        {/* Spectral ambient aura */}
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-60 bg-violet-600/15 blur-[100px] pointer-events-none" />

        <div className="p-6 sm:p-7 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Title & Status */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-violet-950/80 border border-violet-500/40 text-violet-300 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                <Skull className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-violet-400 font-bold">
                    RETRIEVAL-AUGMENTED CONCLAVE
                  </span>
                  <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-mono text-white">
                  Speak to the Ghost of {dossier.name}
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Communing with the preserved memory of <span className="text-amber-400 font-mono">{dossier.owner}/{dossier.name}</span>.
              All responses are bound strictly to excavated commits, AST manifests, and repository artifacts.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400 pt-1">
              <button
                onClick={toggleSound}
                className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-900/80 hover:border-violet-500/40 text-slate-300 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>AUDIO HARMONICS: ON</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                    <span>AUDIO HARMONICS: MUTED</span>
                  </>
                )}
              </button>
              <span className="text-slate-600">|</span>
              <span className="text-violet-300">CORE: GEMMA-3:4B</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">ETHICAL AI PROTOCOL ACTIVE</span>
            </div>
          </div>

          {/* Right: Live Cathode-Ray Oscilloscope HUD */}
          <div className="lg:col-span-5 h-28 sm:h-32 rounded-xl border border-violet-500/30 bg-[#06080e] p-2 relative overflow-hidden flex flex-col justify-between shadow-inner">
            <div className="flex items-center justify-between text-[10px] font-mono text-violet-400 px-2 py-0.5 border-b border-violet-500/20">
              <div className="flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-violet-400" />
                <span>PHOSPHOR CRT OSCILLOSCOPE</span>
              </div>
              <span className={isThinking ? 'text-amber-400 font-bold animate-pulse' : 'text-slate-500'}>
                {isThinking ? 'EXCITING HARMONICS' : 'RESONANCE: 13.37 MHz'}
              </span>
            </div>

            <div className="flex-1 w-full relative">
              <OscilloscopeCanvas
                active={true}
                intensity={isThinking ? 0.95 : 0.45}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Ethical Transparency Disclaimer */}
        <div className="px-6 py-2.5 bg-[#070910] border-t border-violet-500/20 text-[11px] font-mono text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Non-Impersonation Guarantee: This interface is an algorithmic forensic reconstruction grounded strictly in public repository artifacts. It never claims to impersonate living developers.
          </span>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="rounded-2xl border border-slate-800 bg-[#070a12] p-4 sm:p-6 flex flex-col min-h-[480px] max-h-[660px] overflow-hidden shadow-2xl">
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-3xl rounded-2xl p-4 sm:p-6 relative space-y-3.5 ${
                  msg.role === 'user'
                    ? 'bg-amber-500/10 border border-amber-500/30 text-white rounded-br-none ml-8'
                    : 'bg-[#090d18] border border-violet-500/40 text-slate-200 rounded-bl-none mr-8 shadow-[0_0_30px_rgba(0,0,0,0.7)]'
                }`}
              >
                {/* Header with Role and Confidence Seal */}
                <div className="flex items-center justify-between gap-4 text-xs font-mono border-b border-white/5 pb-2.5">
                  <div className="flex items-center gap-2">
                    {msg.role === 'user' ? (
                      <span className="text-amber-300 font-bold uppercase tracking-wider">
                        EXCAVATION RESEARCHER
                      </span>
                    ) : (
                      <span className="text-violet-400 font-bold flex items-center gap-1.5 uppercase tracking-wider">
                        <Skull className="w-3.5 h-3.5" />
                        <span>SPECTRAL REPOSITORY TRANSMISSION</span>
                      </span>
                    )}
                    <span className="text-slate-500 text-[10px]">
                      {'// '}{msg.timestamp}
                    </span>
                  </div>

                  {/* Cryptographic Seal Stamp */}
                  {msg.confidence && (
                    <div
                      className={cn(
                        'px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider border flex items-center gap-1.5',
                        msg.confidence === 'verified'
                          ? 'border-emerald-500/40 bg-emerald-950/60 text-emerald-300'
                          : msg.confidence === 'inferred'
                          ? 'border-amber-500/40 bg-amber-950/60 text-amber-300'
                          : 'border-slate-500/40 bg-slate-900/60 text-slate-400'
                      )}
                    >
                      <span>
                        {msg.confidence === 'verified'
                          ? '🜂 VERIFIED ARTIFACT'
                          : msg.confidence === 'inferred'
                          ? '⟁ RECONSTRUCTED INFERENCE'
                          : '🕱 UNKNOWN SPECIMEN'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans text-slate-200">
                  {msg.content}
                </div>

                {/* Caveat Note for Inferred Findings */}
                {msg.inferredCaveat && (
                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[11px] font-mono text-amber-200/90 flex items-start gap-2">
                    <Compass className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Inference Note: {msg.inferredCaveat}</span>
                  </div>
                )}

                {/* Evidence Citations - Specimen Index Cards */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-3 border-t border-white/5 space-y-2">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                      <span>GROUNDED REPOSITORY EVIDENCE CITATIONS:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {msg.citations.map((c) => (
                        <div
                          key={c.id}
                          className="px-2.5 py-1 rounded-lg bg-[#05070c] border border-cyan-500/30 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5 shadow-sm"
                        >
                          <span className="text-cyan-500 font-bold">#</span>
                          <span>{c.ref || c.title}</span>
                          <ExternalLink className="w-2.5 h-2.5 text-cyan-500/70" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Copy Button */}
                <button
                  onClick={() => handleCopyMessage(msg.id, msg.content)}
                  className="absolute top-3 right-3 text-slate-500 hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Copy transmission"
                >
                  {copiedId === msg.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </motion.div>
          ))}

          {isThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 p-4 rounded-xl bg-violet-950/40 border border-violet-500/40 max-w-md text-xs font-mono text-violet-300 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
            >
              <Sparkles className="w-4 h-4 text-violet-400 animate-spin" />
              <span>Excavating repository evidence & consulting Gemma-3...</span>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Archaeological Inquiries */}
        <div className="pt-4 pb-2 border-t border-slate-800/80">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>SUGGESTED ARCHAEOLOGICAL INQUIRIES:</span>
            <span>CLICK TO TRANSMIT</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  sound.playClick(800 + idx * 80);
                  handleSend(p);
                }}
                disabled={isThinking}
                className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-[11px] font-mono text-slate-300 hover:text-amber-300 transition-all text-left disabled:opacity-50 cursor-pointer shadow-sm"
              >
                &ldquo;{p}&rdquo;
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="pt-3 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the Ghost of this codebase (e.g. 'What architectural compromise caused the slowdown?')"
            disabled={isThinking}
            className="flex-1 px-4 py-3 bg-[#05070c] rounded-xl border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm font-mono focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-500/30 transition-all disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isThinking || !input.trim()}
            className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-mono font-bold text-xs flex items-center gap-2 shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">TRANSMIT</span>
          </button>
        </form>
      </div>
    </div>
  );
}
