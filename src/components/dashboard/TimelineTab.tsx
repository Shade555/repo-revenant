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
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

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
      {/* Contributor Distribution & Bus Factor Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Contributor Breakdown */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              Primary Excavated Contributors
            </h3>
          </div>

          <div className="space-y-3.5">
            {historian.primaryContributors.map((c) => (
              <div key={c.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-200 font-semibold">{c.name}</span>
                  <span className="text-slate-400">
                    {c.commits} commits ({c.percentage}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                    style={{ width: `${c.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
            Estimated Total History: ~{historian.totalCommitsEstimated.toLocaleString()} commits
          </div>
        </div>

        {/* Abandonment Signals */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
                Evidence-Backed Abandonment Signals
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Factual indicators extracted from git log messages, issue transitions, and release metadata.
            </p>

            <ul className="space-y-2.5">
              {historian.abandonmentSignals.map((signal, idx) => (
                <li
                  key={idx}
                  className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/20 text-xs text-rose-200/90 flex items-start gap-2"
                >
                  <span className="text-rose-400 font-mono font-bold select-none">!</span>
                  <span className="leading-relaxed">{signal}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Chronological Timeline */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-slate-800">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold font-mono text-white">
              Chronological Project Timeline
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Key developmental eras, milestones, and inflection points reconstructed by The Historian.
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400">
            {historian.timeline.length} Historical Epochs
          </span>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-8 before:content-[''] before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-amber-500/50 via-violet-500/50 to-rose-500/50">
          {historian.timeline.map((event) => (
            <div key={event.id} className="relative group">
              {/* Timeline Node Dot */}
              <div className="absolute -left-[27px] sm:-left-[31px] top-1 p-1 rounded-full bg-[#07090e] border border-amber-500/60 shadow-[0_0_10px_rgba(229,169,60,0.5)]">
                {getEventIcon(event.type)}
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-[#0a0d15]/90 border border-slate-800/90 group-hover:border-slate-700 transition-all space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-300">
                      {formatDate(event.date)}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded uppercase bg-slate-900 border border-slate-700/80 text-slate-400">
                      {event.type}
                    </span>
                  </div>
                  <ConfidenceBadge confidence={event.confidence} />
                </div>

                <h4 className="text-sm sm:text-base font-bold font-mono text-white">
                  {event.title}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {event.description}
                </p>

                {(event.commitSha || event.evidenceText) && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
                    {event.commitSha && (
                      <span className="flex items-center gap-1.5 text-amber-400/90">
                        <GitCommit className="w-3.5 h-3.5" />
                        <span>Commit: {event.commitSha}</span>
                      </span>
                    )}
                    {event.evidenceText && (
                      <span className="text-slate-400 italic">
                        &ldquo;{event.evidenceText}&rdquo;
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
