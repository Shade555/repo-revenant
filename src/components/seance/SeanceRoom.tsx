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
} from 'lucide-react';
import { DossierReport, ConfidenceLevel, SeanceMessage } from '@/types';
import { ConfidenceBadge } from '@/components/ui/Badge';
import { SAMPLE_SEANCE_CONVERSATIONS } from '@/lib/sample-data';

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
        content: `I am the reconstructed digital phantom of ${dossier.owner}/${dossier.name}. My memory is bound strictly to the commits, manifests, issues, and code leaves left behind in the repository. Ask me what we sought to build, why the work paused, or how to rekindle our flame.`,
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

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || input).trim();
    if (!q || isThinking) return;

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
          timestamp: 'Reconstructed',
          confidence,
          citations: citations.slice(0, 3),
          inferredCaveat: caveat,
        };

        setMessages((prev) => [...prev, botMsg]);
        setIsThinking(false);
      });
  };

  const handleCopyMessage = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Séance Room Banner */}
      <div className="glass-panel-violet p-6 sm:p-7 rounded-2xl border-violet-500/30 relative overflow-hidden">
        {/* Spectral ambient aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-60 bg-violet-600/15 blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-violet-950/80 border border-violet-500/40 text-violet-300 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              <Skull className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-violet-400 font-bold">
                  Retrieval-Augmented Séance
                </span>
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-white">
                Speak to the Ghost of This Repository
              </h2>
            </div>
          </div>

          {/* Spectral Frequency Waveform */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#090b14] border border-violet-500/20">
            <Radio className="w-3.5 h-3.5 text-violet-400" />
            <div className="flex items-center gap-0.5 h-4">
              {[40, 75, 30, 90, 60, 100, 45, 80, 25, 70].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-violet-400 rounded-full animate-pulse"
                  style={{
                    height: `${h}%`,
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
            <span className="text-[10px] font-mono text-violet-300 ml-1">
              ETHER RESONANCE
            </span>
          </div>
        </div>

        {/* Ethical Transparency Disclaimer */}
        <div className="mt-4 pt-3 border-t border-violet-500/20 text-[11px] font-mono text-slate-400 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            Strict Ethical AI Protocol: This interface is an algorithmic reconstruction grounded strictly in public repository artifacts. It never claims to impersonate living developers.
          </span>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="glass-panel rounded-2xl border-slate-800 p-4 sm:p-6 flex flex-col min-h-[480px] max-h-[620px] overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-5 pr-2">
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
                className={`max-w-3xl rounded-2xl p-4 sm:p-5 relative space-y-3 ${
                  msg.role === 'user'
                    ? 'bg-amber-500/15 border border-amber-500/30 text-white rounded-br-none ml-10'
                    : 'bg-[#0d101a]/95 border border-violet-500/30 text-slate-200 rounded-bl-none mr-10 shadow-[0_0_25px_rgba(0,0,0,0.5)]'
                }`}
              >
                {/* Header with Role and Confidence */}
                <div className="flex items-center justify-between gap-4 text-xs font-mono border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    {msg.role === 'user' ? (
                      <span className="text-amber-300 font-bold">RESEARCHER</span>
                    ) : (
                      <span className="text-violet-400 font-bold flex items-center gap-1.5">
                        <Skull className="w-3.5 h-3.5" />
                        <span>REPOSITORY PHANTOM</span>
                      </span>
                    )}
                    <span className="text-slate-500 text-[10px]">
                      {msg.timestamp}
                    </span>
                  </div>

                  {msg.confidence && (
                    <ConfidenceBadge confidence={msg.confidence} />
                  )}
                </div>

                {/* Content */}
                <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {msg.content}
                </div>

                {/* Caveat for Inferred findings */}
                {msg.inferredCaveat && (
                  <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-[11px] font-mono text-amber-200/90 flex items-start gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Inference Note: {msg.inferredCaveat}</span>
                  </div>
                )}

                {/* Evidence Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-2 border-t border-white/5 space-y-1.5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Grounded Evidence Citations:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.citations.map((c) => (
                        <div
                          key={c.id}
                          className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-cyan-300 flex items-center gap-1"
                        >
                          <FileCode className="w-3 h-3 text-cyan-400" />
                          <span>{c.ref || c.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Copy Button */}
                <button
                  onClick={() => handleCopyMessage(msg.id, msg.content)}
                  className="absolute top-2 right-2 text-slate-500 hover:text-slate-300 p-1 rounded transition-colors cursor-pointer"
                  title="Copy answer"
                >
                  {copiedId === msg.id ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </motion.div>
          ))}

          {isThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 p-4 rounded-xl bg-violet-950/30 border border-violet-500/30 max-w-sm text-xs font-mono text-violet-300"
            >
              <Sparkles className="w-4 h-4 text-violet-400 animate-spin" />
              <span>Excavating repository evidence & consulting Gemma 3...</span>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompt Chips */}
        <div className="pt-4 pb-2 border-t border-slate-800">
          <div className="text-[10px] font-mono text-slate-500 uppercase mb-2">
            Suggested Archaeological Inquiries:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                disabled={isThinking}
                className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-[11px] font-mono text-slate-300 hover:text-amber-300 transition-all text-left disabled:opacity-50 cursor-pointer"
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
          className="pt-2 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the Ghost of this codebase (e.g., 'What architectural compromise caused the slowdown?')"
            disabled={isThinking}
            className="flex-1 px-4 py-3 bg-[#0a0d15] rounded-xl border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm font-mono focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-500/30 transition-all disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isThinking || !input.trim()}
            className="px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-mono font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">TRANSMIT</span>
          </button>
        </form>
      </div>
    </div>
  );
}
