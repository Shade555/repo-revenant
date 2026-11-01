'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DossierReport } from '@/types';
import { DossierHeader } from './DossierHeader';
import { OverviewTab } from './OverviewTab';
import { TimelineTab } from './TimelineTab';
import { ArchitectureTab } from './ArchitectureTab';
import { TechDebtTab } from './TechDebtTab';
import { RoadmapTab } from './RoadmapTab';
import { SeanceRoom } from '@/components/seance/SeanceRoom';
import { AgentActivityTab } from './AgentActivityTab';
import {
  LayoutDashboard,
  History,
  Layers,
  Flame,
  Sparkles,
  Skull,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'overview', label: 'Overview & Health', icon: LayoutDashboard },
  { id: 'timeline', label: 'Timeline (Historian)', icon: History },
  { id: 'architecture', label: 'Architecture & Stack', icon: Layers },
  { id: 'debt', label: 'Technical Debt (Exorcist)', icon: Flame },
  { id: 'roadmap', label: 'Revival Roadmap', icon: Sparkles },
  { id: 'seance', label: 'Developer Séance', icon: Skull, isFeatured: true },
  { id: 'telemetry', label: 'Agent Telemetry', icon: Activity },
];

export function DossierDashboard({ dossier }: { dossier: DossierReport }) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dossier Header */}
      <DossierHeader dossier={dossier} />

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-8 border-b border-slate-800/80 no-scrollbar">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-semibold whitespace-nowrap transition-all relative cursor-pointer',
                isActive
                  ? tab.isFeatured
                    ? 'bg-violet-950/80 text-violet-300 border border-violet-500/50 shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                    : 'bg-[#121724] text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(229,169,60,0.15)]'
                  : tab.isFeatured
                  ? 'bg-violet-950/20 text-violet-400 border border-violet-500/20 hover:bg-violet-950/40'
                  : 'bg-[#090c13] text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4',
                  isActive
                    ? tab.isFeatured
                      ? 'text-violet-400'
                      : 'text-amber-400'
                    : 'text-slate-500'
                )}
              />
              <span>{tab.label}</span>

              {tab.isFeatured && (
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping ml-1" />
              )}

              {isActive && (
                <motion.div
                  layoutId="activeDossierTab"
                  className={cn(
                    'absolute bottom-0 left-0 right-0 h-0.5',
                    tab.isFeatured ? 'bg-violet-400' : 'bg-amber-400'
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels with Smooth Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === 'overview' && <OverviewTab dossier={dossier} />}
          {activeTab === 'timeline' && <TimelineTab dossier={dossier} />}
          {activeTab === 'architecture' && <ArchitectureTab dossier={dossier} />}
          {activeTab === 'debt' && <TechDebtTab dossier={dossier} />}
          {activeTab === 'roadmap' && <RoadmapTab dossier={dossier} />}
          {activeTab === 'seance' && <SeanceRoom dossier={dossier} />}
          {activeTab === 'telemetry' && <AgentActivityTab dossier={dossier} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
