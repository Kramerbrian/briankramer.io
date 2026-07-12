import type { Metadata } from 'next';
import Script from 'next/script';
import { GlassCard } from '@/components/GlassCard';
import { canPublishPodcastListenLink, getAllPodcasts } from '@/content/podcasts/seed';
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
        'Provisional podcast archive on dealer operations, acquisition, trust, and digital transformation. Sources are being verified before listen links are published.',
      alternates: { canonical: '/podcast' },
    };

const pillarLabels: Record<string, string> = {
  acquisition: 'Acquisition',
  appraisal: 'Appraisal',
  trust: 'Trust',
  'digital-transformation': 'Digital transformation',
  'ai-search': 'AI search',
  leadership: 'Leadership',
};

const platformLabels: Record<string, string> = {
  spotify: 'Spotify',
  'apple-podcasts': 'Apple Podcasts',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  other: 'Web',
};

export default function PodcastPage() {
  const podcasts = getAllPodcasts();
  const schema = archiveRecord
    ? collectionPageJsonLd({ record: archiveRecord })
    : {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Podcast conversations. One thread.',
        description:
          'Provisional public podcast archive. Titles and summaries may appear; listen links require source verification.',
        url: 'https://www.briankramer.io/podcast',
        isPartOf: {
          '@type': 'WebSite',
          name: 'Brian Kramer',
          url: 'https://www.briankramer.io',
        },
      };

  return (
    <section className="container-page pt-16 pb-24 md:pt-24">
      <Script
        id="schema-podcast"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <p className="eyebrow">Podcast</p>
      <h1 className="mt-3 text-display font-semibold text-ink">Podcast conversations. One thread.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
        Conversations on dealer operations, acquisition economics, trust, and what comes after
        paperless. The archive is being verified before links are published.
      </p>

      <ul className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2">
        {podcasts.map((pod) => (
          <li key={pod.id}>
            <GlassCard as="article" interactive className="flex h-full flex-col p-8">
              <div className="flex items-start justify-between gap-4">
                <p className="eyebrow text-accent">
                  {pillarLabels[pod.topicPillar ?? ''] ?? 'Interview'}
                </p>
                <span className="shrink-0 text-xs text-ink-faint">
                  {pod.durationMinutes} min
                </span>
              </div>
              <h2 className="mt-3 text-xl font-semibold leading-snug text-ink">
                {pod.title}
              </h2>
              <p className="mt-2 text-sm text-ink-muted">
                {pod.showName}
                {pod.podcastHost ? ` · ${pod.podcastHost}` : ''}
              </p>
              <p className="mt-3 flex-1 text-base leading-relaxed text-ink-muted">
                {pod.summary}
              </p>
              <div className="mt-6 flex items-center justify-between">
                <time
                  dateTime={pod.publishDate}
                  className="text-xs text-ink-faint"
                >
                  {new Date(pod.publishDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                  })}
                </time>
                {canPublishPodcastListenLink(pod) ? (
                  <a
                    href={pod.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-accent hover:text-accent-hover"
                  >
                    Listen on {platformLabels[pod.sourcePlatform] ?? 'Web'} →
                  </a>
                ) : (
                  <span className="text-xs text-ink-faint">Source verification pending</span>
                )}
              </div>
            </GlassCard>
          </li>
        ))}
      </ul>
    </section>
  );
}
