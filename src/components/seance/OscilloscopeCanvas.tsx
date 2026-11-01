'use client';

import React, { useEffect, useRef } from 'react';

interface OscilloscopeCanvasProps {
  active?: boolean;
  intensity?: number; // 0 to 1
  className?: string;
}

export function OscilloscopeCanvas({
  active = true,
  intensity = 0.5,
  className,
}: OscilloscopeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 300);
      const height = (canvas.height = canvas.parentElement?.clientHeight || 120);

      ctx.fillStyle = 'rgba(7, 9, 15, 0.45)';
      ctx.fillRect(0, 0, width, height);

      // Draw faint background phosphor grid lines
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.08)';
      ctx.lineWidth = 1;
      const step = 20;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Center Axis
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)';
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Oscilloscope Beam 1: Primary Harmonic (Ghostly Violet)
      ctx.beginPath();
      ctx.strokeStyle = '#a78bfa';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#8b5cf6';

      const centerY = height / 2;
      const amp = active ? (height * 0.32) * intensity : 3;

      for (let x = 0; x < width; x++) {
        const normX = x / width;
        // Harmonic synthesis: fundamental + 2nd overtone + subtle jitter
        const y =
          centerY +
          Math.sin(normX * Math.PI * 4 + phase) * amp * 0.6 +
          Math.sin(normX * Math.PI * 10 - phase * 1.5) * amp * 0.3 +
          (Math.random() - 0.5) * (active ? 3 : 0.5);

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Oscilloscope Beam 2: Secondary Vector Harmonic (Ethereal Gold / Marigold)
      if (active) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.65)';
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#fbbf24';

        for (let x = 0; x < width; x += 2) {
          const normX = x / width;
          const y =
            centerY +
            Math.cos(normX * Math.PI * 3 + phase * 0.8) * amp * 0.4 +
            Math.sin(normX * Math.PI * 7 + phase * 2) * amp * 0.2;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      phase += active ? 0.06 : 0.015;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [active, intensity]);

  return (
    <div className={`relative overflow-hidden rounded-lg border border-violet-500/30 bg-[#06080e] ${className || ''}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* CRT Glass Reflection overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none" />
      <div className="absolute bottom-1 right-2 text-[9px] font-mono text-violet-400/70 select-none">
        OSC::CH-1 [10mV/DIV]
      </div>
    </div>
  );
}
