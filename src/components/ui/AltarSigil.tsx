'use client';

import React from 'react';
import { Skull } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AltarSigil({
  size = 280,
  active = true,
  className,
}: {
  size?: number;
  active?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn('relative flex items-center justify-center select-none pointer-events-none', className)}
      style={{ width: size, height: size }}
    >
      {/* Ambient Radial Energy */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-500/10 via-violet-600/10 to-transparent blur-2xl pointer-events-none" />

      {/* Outer Caliper Ring (Rotates clockwise) */}
      <div
        className={cn(
          'absolute inset-0 rounded-full border border-amber-500/25 border-dashed',
          active && 'animate-rune-spin'
        )}
      />

      {/* Hex Coordinates Ring (Rotates counter-clockwise) */}
      <svg
        viewBox="0 0 300 300"
        className={cn(
          'absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)]',
          active && 'animate-rune-spin-reverse'
        )}
      >
        <circle
          cx="150"
          cy="150"
          r="142"
          fill="none"
          stroke="rgba(139, 92, 246, 0.25)"
          strokeWidth="1"
          strokeDasharray="4 8"
        />
        {/* Runic / Archaeological Technical Markers */}
        <text
          x="150"
          y="18"
          fill="rgba(229, 169, 60, 0.7)"
          fontSize="9"
          fontFamily="monospace"
          textAnchor="middle"
        >
          0x00 // RESURRECT
        </text>
        <text
          x="282"
          y="153"
          fill="rgba(139, 92, 246, 0.7)"
          fontSize="9"
          fontFamily="monospace"
          textAnchor="middle"
        >
          0x7E // STRATUM
        </text>
        <text
          x="150"
          y="292"
          fill="rgba(229, 169, 60, 0.7)"
          fontSize="9"
          fontFamily="monospace"
          textAnchor="middle"
        >
          0xFF // EXHUMATION
        </text>
        <text
          x="18"
          y="153"
          fill="rgba(139, 92, 246, 0.7)"
          fontSize="9"
          fontFamily="monospace"
          textAnchor="middle"
        >
          0x3C // BITROT
        </text>
      </svg>

      {/* Geometric Sacred Algorithm Star / Octagon */}
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-8 w-[calc(100%-64px)] h-[calc(100%-64px)] opacity-60"
      >
        <polygon
          points="100,10 125,75 190,100 125,125 100,190 75,125 10,100 75,75"
          fill="none"
          stroke="rgba(229, 169, 60, 0.3)"
          strokeWidth="1"
        />
        <circle
          cx="100"
          cy="100"
          r="65"
          fill="none"
          stroke="rgba(139, 92, 246, 0.3)"
          strokeWidth="1"
        />
      </svg>

      {/* Inner Glowing Altar Core */}
      <div className="relative w-16 h-16 rounded-2xl bg-[#090d16] border-2 border-amber-500/60 flex items-center justify-center shadow-[0_0_25px_rgba(229,169,60,0.5)]">
        <Skull className="w-8 h-8 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
      </div>
    </div>
  );
}
