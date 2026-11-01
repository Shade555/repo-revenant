import React, { Suspense } from 'react';
import { InvestigationTerminal } from '@/components/investigation/InvestigationTerminal';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { SpectralCanvas } from '@/components/ui/SpectralCanvas';

export default function InvestigatePage() {
  return (
    <main className="min-h-screen bg-[#07090e] text-[#e2e8f0] flex flex-col justify-between relative">
      <SpectralCanvas />
      <Header />
      <div className="flex-1 relative z-10">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[60vh] font-mono text-sm text-amber-400">
              Awakening archaeological harness...
            </div>
          }
        >
          <InvestigationTerminal />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}
