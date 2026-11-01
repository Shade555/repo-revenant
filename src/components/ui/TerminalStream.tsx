'use client';

import React, { useEffect, useRef } from 'react';
import { InvestigationLog } from '@/types';
import { AgentTag } from './Badge';
import { Terminal, Copy, Check } from 'lucide-react';

interface TerminalStreamProps {
  logs: InvestigationLog[];
  isStreaming?: boolean;
  className?: string;
}

export function TerminalStream({
  logs,
  isStreaming = false,
  className,
}: TerminalStreamProps) {
  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const copyLogs = () => {
    const text = logs
      .map((l) => `[${l.timestamp}] [${l.agent}] [${l.phase}] ${l.message}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLogTypeColor = (type: InvestigationLog['type']) => {
    switch (type) {
      case 'success':
        return 'text-emerald-400';
      case 'warn':
        return 'text-amber-300';
      case 'error':
        return 'text-rose-400';
      case 'evidence':
        return 'text-cyan-300';
      default:
        return 'text-slate-300';
    }
  };

  return (
    <div
      className={`rounded-xl border border-amber-500/20 bg-[#080b11] overflow-hidden shadow-2xl flex flex-col font-mono text-xs ${
        className || ''
      }`}
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0d121c] border-b border-amber-500/15">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          <div className="ml-2 flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span>ARCHAEOLOGICAL HARNESS TELEMETRY STREAM</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isStreaming && (
            <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE ORCHESTRATION</span>
            </div>
          )}
          <button
            onClick={copyLogs}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Copy logs"
          >
            {copied ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-4 overflow-y-auto max-h-[380px] space-y-2 selection:bg-amber-500/30">
        {logs.length === 0 ? (
          <div className="text-slate-500 italic py-6 text-center">
            Awaiting summon command... agents standing by in the ether.
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-2.5 leading-relaxed hover:bg-white/[0.02] p-1 rounded transition-colors"
            >
              <span className="text-slate-600 select-none text-[10px] pt-0.5">
                {log.timestamp}
              </span>
              <AgentTag agent={log.agent} />
              <span className="text-amber-500/70 text-[10px] px-1 py-0.5 rounded bg-amber-500/5 border border-amber-500/10">
                {log.phase}
              </span>
              <span className={`flex-1 break-words ${getLogTypeColor(log.type)}`}>
                {log.message}
              </span>
            </div>
          ))
        )}

        {isStreaming && (
          <div className="flex items-center gap-2 pt-2 text-amber-400/80">
            <span className="animate-pulse">❯</span>
            <span className="animate-terminal-blink font-bold">_</span>
          </div>
        )}

        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}
