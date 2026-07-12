import type { Metadata } from 'next';
import Script from 'next/script';
import { getCanonicalContentByPath } from '@/content/publishing/records';
import { collectionPageJsonLd, metadataFromRecord } from '@/lib/seo';

const playbookRecord = getCanonicalContentByPath('/playbook');

export const metadata: Metadata = playbookRecord
  ? {
      ...metadataFromRecord(playbookRecord),
      title: { absolute: 'Playbook — Brian Kramer' },
    }
  : {
      title: 'Playbook',
      description: 'Dealer operating playbooks are being prepared for publication.',
      alternates: { canonical: '/playbook' },
    };

export default function PlaybookPage() {
  const schema = playbookRecord
    ? collectionPageJsonLd({ record: playbookRecord })
    : {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Operating tools, coming soon.',
        description: 'Dealer operating playbooks are being prepared for publication.',
        url: 'https://www.briankramer.io/playbook',
      };

  return (
    <section className="container-page pt-16 pb-24 md:pt-24">
      <Script
        id="schema-playbook"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <p className="eyebrow">Playbook</p>
      <h1 className="mt-3 text-display font-semibold text-ink">Operating tools, coming soon.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
        I am turning the operating doctrine into calm, executable tools with clear owners,
        cadence, proof, and success measures. The first set will publish when the source material
        and examples are ready.
      </p>
    </section>
  );
}
