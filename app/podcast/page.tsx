import type { Metadata } from 'next';
import { GlassCard } from '@/components/GlassCard';
import { getAllPodcasts, TOTAL_PODCAST_COUNT } from '@/content/podcasts/seed';

export const metadata: Metadata = {
  title: 'Podcast',
  description:
    'Podcast appearances on dealer operations, acquisition, trust, and digital transformation.',
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

  return (
    <section className="container-page pt-16 pb-24 md:pt-24">
      <p className="eyebrow">Podcast</p>
      <h1 className="mt-3 text-display font-semibold text-ink">61 appearances. One thread.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
        Conversations on dealer operations, acquisition economics, trust, and what comes after
        paperless. Showing {podcasts.length} of {TOTAL_PODCAST_COUNT} — full catalog importing
        soon.
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
                {pod.sourceUrl && (
                  <a
                    href={pod.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-accent hover:text-accent-hover"
                  >
                    Listen on {platformLabels[pod.sourcePlatform] ?? 'Web'} →
                  </a>
                )}
              </div>
            </GlassCard>
          </li>
        ))}
      </ul>
    </section>
  );
}
