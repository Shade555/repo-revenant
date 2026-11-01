import React from 'react';
import { Header } from '@/components/landing/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { AgentShowcase } from '@/components/landing/AgentShowcase';
import { WorkflowVisualizer } from '@/components/landing/WorkflowVisualizer';
import { OpenSourceStack } from '@/components/landing/OpenSourceStack';
import { Footer } from '@/components/landing/Footer';
import { SpectralCanvas } from '@/components/ui/SpectralCanvas';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#07090e] text-[#e2e8f0] flex flex-col justify-between relative selection:bg-amber-500/30 selection:text-amber-300">
      {/* Background Spectral Particles */}
      <SpectralCanvas />

      {/* Navigation Header */}
      <Header />

      {/* Hero Section */}
      <div className="flex-1 relative z-10">
        <HeroSection />
        <AgentShowcase />
        <WorkflowVisualizer />
        <OpenSourceStack />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
