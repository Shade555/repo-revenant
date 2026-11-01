'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function RadarScan({
  className,
  size = 140,
  active = true,
}: {
  className?: string;
  size?: number;
  active?: boolean;
}) {
  return (
    <div
      className={cn('relative flex items-center justify-center select-none', className)}
      style={{ width: size, height: size }}
    >
      {/* Outer Glow Ring */}
      <div className="absolute inset-0 rounded-full border border-amber-500/20 bg-[#0a0d14]/70" />

      {/* Concentric Coordinate Rings */}
      <div className="absolute inset-3 rounded-full border border-amber-500/15" />
      <div className="absolute inset-7 rounded-full border border-amber-500/10" />
      <div className="absolute inset-11 rounded-full border border-amber-500/10" />

      {/* Axis crosshairs */}
      <div className="absolute inset-x-0 top-1/2 h-px bg-amber-500/15 -translate-y-1/2" />
      <div className="absolute inset-y-0 left-1/2 w-px bg-amber-500/15 -translate-x-1/2" />

      {/* Rotating Radar Sweep Beam */}
      {active && (
        <div
          className="absolute inset-0 rounded-full animate-radar-sweep pointer-events-none"
          style={{
            background:
              'conic-gradient(from 0deg, rgba(229, 169, 60, 0.35) 0deg, rgba(229, 169, 60, 0.05) 60deg, transparent 75deg)',
          }}
        />
      )}

      {/* Blip dots (simulated archaeological signals) */}
      <div className="absolute top-[32%] left-[68%] w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping opacity-75" />
      <div className="absolute bottom-[35%] left-[28%] w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      <div className="absolute top-[60%] right-[30%] w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />

      {/* Center Beacon */}
      <div className="relative w-3 h-3 rounded-full bg-amber-500 border-2 border-[#0a0d14] shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
    </div>
  );
}
