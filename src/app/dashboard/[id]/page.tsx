import React, { Suspense } from 'react';
import { SAMPLE_DOSSIERS } from '@/lib/sample-data';
import { DossierDashboard } from '@/components/dashboard/DossierDashboard';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { SpectralCanvas } from '@/components/ui/SpectralCanvas';

export function generateStaticParams() {
  return [
    { id: 'dossier-three20-archived' },
    { id: 'dossier-mon-archived' },
  ];
}

async function DossierContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Look for matching sample dossier by ID or by repo name
  let dossier = Object.values(SAMPLE_DOSSIERS).find(
    (d) => d.id === id || d.name === id || `${d.owner}/${d.name}` === id
  );

  // Fallback to sample dossier
  if (!dossier) {
    dossier = SAMPLE_DOSSIERS['facebookarchive/three20'];
  }

  return <DossierDashboard dossier={dossier} />;
}

export default function DossierPage(props: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="min-h-screen bg-[#07090e] text-[#e2e8f0] flex flex-col justify-between relative selection:bg-amber-500/30 selection:text-amber-300">
      <SpectralCanvas />
      <Header />
      <div className="flex-1 relative z-10">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[60vh] font-mono text-sm text-amber-400">
              Excavating Revival Dossier artifacts...
            </div>
          }
        >
          <DossierContent params={props.params} />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}
