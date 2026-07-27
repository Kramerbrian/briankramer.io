import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { getCanonicalContentByPath } from '@/content/publishing/records';
import { collectionPageJsonLd, metadataFromRecord } from '@/lib/seo';

const archiveRecord = getCanonicalContentByPath('/podcast');

export const metadata: Metadata = archiveRecord
  ? {
      ...metadataFromRecord(archiveRecord),
      title: { absolute: 'Podcast — Brian Kramer' },
    }
  : {
      title: 'Podcast',
      description:
        'Selected podcast conversations on dealer operations, acquisition, trust, and digital transformation.',
      alternates: { canonical: '/podcast' },
    };

export default function PodcastPage() {
  const schema = archiveRecord
    ? collectionPageJsonLd({ record: archiveRecord })
    : {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Podcast conversations. One thread.',
        description:
          'Selected podcast conversations on dealer operations, acquisition, trust, and digital transformation.',
        url: 'https://www.briankramer.io/podcast',
        isPartOf: {
          '@type': 'WebSite',
          name: 'Brian Kramer',
          url: 'https://www.briankramer.io',
        },
      };

  return (
    <section className="container-page pt-16 pb-24 md:pt-24">
      <JsonLd id="schema-podcast" data={schema} />
      <p className="eyebrow">Podcast</p>
      <h1 className="mt-3 text-display font-semibold text-ink">Podcast conversations. One thread.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
        Conversations on dealer operations, acquisition economics, trust, and what comes after
        paperless. Listen links publish as durable source records are added.
      </p>
    </section>
  );
}
