import React from 'react';
import { ShieldCheck, Compass, HelpCircle } from 'lucide-react';
import { ConfidenceLevel } from '@/types';
import { cn } from '@/lib/utils';

interface ConfidenceBadgeProps {
  confidence: ConfidenceLevel;
  className?: string;
  showIcon?: boolean;
}

export function ConfidenceBadge({
  confidence,
  className,
  showIcon = true,
}: ConfidenceBadgeProps) {
  if (confidence === 'verified') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium',
          'bg-emerald-950/70 text-emerald-400 border border-emerald-500/30',
          'shadow-[0_0_12px_rgba(16,185,129,0.15)]',
          className
        )}
      >
        {showIcon && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
        <span>VERIFIED OBSERVATION</span>
      </span>
    );
  }

  if (confidence === 'inferred') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium',
          'bg-amber-950/60 text-amber-300 border border-amber-500/30',
          'shadow-[0_0_12px_rgba(245,158,11,0.15)]',
          className
        )}
      >
        {showIcon && <Compass className="w-3.5 h-3.5 text-amber-400" />}
        <span>REASONED INFERENCE</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium',
        'bg-violet-950/60 text-violet-300 border border-violet-500/30',
        'shadow-[0_0_12px_rgba(139,92,246,0.15)]',
        className
      )}
    >
      {showIcon && <HelpCircle className="w-3.5 h-3.5 text-violet-400" />}
      <span>UNKNOWN / INSUFFICIENT DATA</span>
    </span>
  );
}

export function AgentTag({
  agent,
  className,
}: {
  agent: string;
  className?: string;
}) {
  const getColors = () => {
    switch (agent.toUpperCase()) {
      case 'SUMMONER':
      case 'THE SUMMONER':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'HISTORIAN':
      case 'THE HISTORIAN':
        return 'bg-violet-500/10 text-violet-300 border-violet-500/30';
      case 'ARCHAEOLOGIST':
      case 'THE ARCHAEOLOGIST':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
      case 'EXORCIST':
      case 'THE EXORCIST':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      case 'REVIVALIST':
      case 'THE REVIVALIST':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider border',
        getColors(),
        className
      )}
    >
      {agent}
    </span>
  );
}
