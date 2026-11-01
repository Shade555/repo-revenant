'use client';

import React from 'react';
import { DossierReport, TimelineEvent } from '@/types';
import { ConfidenceBadge } from '@/components/ui/Badge';
import {
  History,
  GitCommit,
  Users,
  AlertTriangle,
  Milestone,
  Flame,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { sound } from '@/lib/audio/sound-synth';

export function TimelineTab({ dossier }: { dossier: DossierReport }) {
  const { historian } = dossier;

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'creation':
        return <GitCommit className="w-4 h-4 text-emerald-400" />;
      case 'milestone':
        return <Milestone className="w-4 h-4 text-amber-400" />;
      case 'shift':
        return <History className="w-4 h-4 text-violet-400" />;
      case 'abandonment':
      case 'last_pulse':
        return <Flame className="w-4 h-4 text-rose-400" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Contributor Distribution & Abandonment Signals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Contributor Turnover & Bus Factor Forensics */}
        <div className="lg:col-span-7 bracket-box p-6 rounded-2xl bg-[#080b12] border border-slate-800 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                Contributor Excavation & Bus Factor Forensics
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              {historian.primaryContributors.length} EXCAVATED AUTHORS
            </span>
          </div>

          <div className="space-y-3.5">
            {historian.primaryContributors.map((c) => (
              <div key={c.name} className="space-y-1.5 p-2 rounded-lg bg-[#05070c] border border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-200 font-bold">{c.name}</span>
                  <span className="text-amber-400 font-semibold">
                    {c.commits} commits ({c.percentage}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 rounded-full"
                    style={{ width: `${c.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Estimated Total Repositories History:</span>
            <span className="text-white font-bold">~{historian.totalCommitsEstimated.toLocaleString()} commits</span>
          </div>
        </div>

        {/* Factual Abandonment Signals */}
        <div className="lg:col-span-5 bracket-box p-6 rounded-2xl bg-[#080b12] border border-slate-800 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                Evidence-Backed Abandonment Signals
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed font-sans">
              Strict factual markers extracted from git log metadata, commit silence spans, and PR velocity:
            </p>

            <ul className="space-y-2.5">
              {historian.abandonmentSignals.map((signal, idx) => (
                <li
                  key={idx}
                  className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs text-rose-200/90 flex items-start gap-2.5 shadow-sm"
                >
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-sans">{signal}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] font-mono text-slate-500">
            NO SPECULATIVE MOTIVES INVENTED
          </div>
        </div>
      </div>

      {/* Chronological Stratigraphic Timeline */}
      <div className="bracket-box p-6 sm:p-8 rounded-2xl bg-[#080b12] border border-slate-800 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-8 border-b border-slate-800 gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <History className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-bold font-mono text-white">
                Chronological Stratigraphic Core Log
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Reconstructed historical epochs from initial commit genesis to the final preserved breath.
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 w-fit">
            {historian.timeline.length} EXCAVATED EPOCHS
          </span>
        </div>

        {/* Vertical Core Timeline Rail */}
        <div className="relative pl-6 sm:pl-10 space-y-8 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500/60 via-amber-500/60 via-violet-500/60 to-rose-500/60">
          {historian.timeline.map((event, idx) => (
            <div
              key={event.id}
              className="relative group"
              onClick={() => sound.playClick(500 + idx * 70)}
            >
              {/* Timeline Node Dot */}
              <div className="absolute -left-[27px] sm:-left-[31px] top-1.5 p-1 rounded-full bg-[#06080d] border border-amber-500/70 shadow-[0_0_12px_rgba(229,169,60,0.5)] group-hover:scale-125 transition-transform cursor-pointer">
                {getEventIcon(event.type)}
              </div>

              {/* Event Card */}
              <div className="p-5 rounded-xl bg-[#05070d] border border-slate-800 group-hover:border-slate-700 transition-all space-y-2.5 shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold text-amber-300">
                      {formatDate(event.date)}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold bg-slate-900 border border-slate-800 text-slate-400">
                      {event.type}
                    </span>
                  </div>
                  <ConfidenceBadge confidence={event.confidence} />
                </div>

                <h4 className="text-sm sm:text-base font-bold font-mono text-white group-hover:text-amber-300 transition-colors">
                  {event.title}
                </h4>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {event.description}
                </p>

                {/* Grounding Artifacts */}
                {(event.commitSha || event.evidenceText) && (
                  <div className="pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      Grounding Artifacts:
                    </span>
                    {event.commitSha && (
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 flex items-center gap-1">
                        <span>SHA: {event.commitSha}</span>
                        {event.commitUrl && <ExternalLink className="w-2.5 h-2.5 text-cyan-500/70" />}
                      </span>
                    )}
                    {event.evidenceText && (
                      <span className="text-[11px] font-mono text-slate-400 italic">
                        {event.evidenceText}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
