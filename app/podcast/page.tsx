import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { GlassCard } from '@/components/GlassCard';
import { getCanonicalContentByPath } from '@/content/publishing/records';
import { collectionPageJsonLd, metadataFromRecord } from '@/lib/seo';
import { getAllPodcasts, canPublishPodcastListenLink } from '@/content/podcasts/seed';

const archiveRecord = getCanonicalContentByPath('/podcast');

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
  other: 'Other',
};

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

  const podcasts = getAllPodcasts();

  return (
    <section className="container-page pt-16 pb-24 md:pt-24">
      <JsonLd id="schema-podcast" data={schema} />
      <p className="eyebrow">Podcast</p>
      <h1 className="mt-3 text-display font-semibold text-ink">Podcast conversations. One thread.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
        Conversations on dealer operations, acquisition economics, trust, and what comes after
        paperless. Listen links publish as durable source records are added.
      </p>
      <p className="mt-3 text-sm text-ink-faint">
        Source verification in progress: titles, dates, hosts, and durations are not source-verified yet. Treat every entry below as unconfirmed until it carries a verified listen link.
      </p>
      {podcasts[0] && (
        <p className="mt-2 text-sm text-ink-faint">
          Latest appearance in this archive:{' '}
          <time dateTime={podcasts[0].publishDate}>
            {new Date(podcasts[0].publishDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          . This archive updates as new appearances clear source verification, not on a fixed
          schedule.
        </p>
      )}

      <ul className="mt-14 space-y-4">
        {podcasts.map((pod) => {
          const canListen = canPublishPodcastListenLink(pod);
          return (
            <li key={pod.id} id={pod.slug} className="scroll-mt-24">
              <GlassCard as="article" className="p-8 md:p-10">
                <div className="flex flex-wrap items-center gap-3">
                  {pod.topicPillar && (
                    <p className="eyebrow text-accent">
                      {pillarLabels[pod.topicPillar] ?? pod.topicPillar}
                    </p>
                  )}
                  <time dateTime={pod.publishDate} className="text-xs text-ink-faint">
                    {new Date(pod.publishDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                <h2 className="mt-3 text-xl font-semibold leading-snug text-ink md:text-2xl">
                  {pod.title}
                </h2>
                <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-muted">
                  {pod.summary}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-faint">
                  {pod.showName && <span>{pod.showName}</span>}
                  {pod.podcastHost && <span>Hosted by {pod.podcastHost}</span>}
                  {pod.durationMinutes && <span>{pod.durationMinutes} min</span>}
                  <span>{platformLabels[pod.sourcePlatform] ?? pod.sourcePlatform}</span>
                </div>
                {canListen ? (
                  <a
                    href={pod.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex min-h-[44px] w-fit items-center font-medium text-accent hover:text-accent-hover"
                  >
                    Listen →
                  </a>
                ) : (
                  <p className="mt-6 text-xs text-ink-faint">
                    Listen link publishes once the source record is verified.
                  </p>
                )}
              </GlassCard>
            </li>
          );
        })}
      </ul>

      <p className="mt-14 text-sm text-ink-muted">
        Prefer music over conversation?{' '}
        <Link href="/playlist" className="font-medium text-accent hover:text-accent-hover">
          Open the working playlist →
        </Link>
      </p>
    </section>
  );
}
