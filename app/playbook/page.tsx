import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Playbook',
  description: 'Dealer operating playbooks are being prepared for publication.',
  alternates: { canonical: '/playbook' },
};

export default function PlaybookPage() {
  return (
    <section className="container-page pt-16 pb-24 md:pt-24">
      <Script id="schema-playbook" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Brian Kramer Playbook', url: 'https://www.briankramer.io/playbook', description: 'Dealer operating playbooks are being prepared for publication.' }) }} />
      <p className="eyebrow">Playbook</p>
      <h1 className="mt-3 text-display font-semibold text-ink">Operating tools, coming soon.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
        I am turning the operating doctrine into calm, executable tools with clear owners,
        cadence, proof and success measures. The first set will publish when the source material
        and examples are ready.
      </p>
    </section>
  );
}
