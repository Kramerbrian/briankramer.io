import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { GlassCard } from '@/components/GlassCard';
import { LinkButton } from '@/components/Button';
import { getCanonicalContentByPath } from '@/content/publishing/records';
import { metadataFromRecord } from '@/lib/seo';
import { siteConfig } from '@/lib/utils';

const archiveRecord = getCanonicalContentByPath('/podcast');

const playlistUrl = 'https://open.spotify.com/playlist/1Ij3H93G7v5eoMGYmm3KkE';
const playlistEmbedUrl =
  'https://open.spotify.com/embed/playlist/1Ij3H93G7v5eoMGYmm3KkE?utm_source=generator';

interface FeaturedEpisode {
  title: string;
  show: string;
  url: string;
  embedId: string;
  publishDate: string;
}

const featuredEpisodes: FeaturedEpisode[] = [
  {
    title: "Why Dealers Are Losing 70% of Trade-Ins—and How They're Fighting Back",
    show: 'Car Dealership Guy Podcast',
    url: 'https://www.youtube.com/watch?v=6l0sXTGE0zA',
    embedId: '6l0sXTGE0zA',
    publishDate: '2025-01-21',
  },
  {
    title: "Episode 10 | The Data Problem Dealers Aren't Solving | Ryan Rohrman & Brian Kramer",
    show: 'The Kramer Show',
    url: 'https://www.youtube.com/watch?v=NbZ_A7kQ_NI',
    embedId: 'NbZ_A7kQ_NI',
    publishDate: '2026-03-30',
  },
];

const listenEverywhere = [
  { label: 'YouTube', href: siteConfig.socials.youtube },
  { label: 'Spotify playlist', href: playlistUrl },
  { label: 'LinkedIn', href: siteConfig.socials.linkedin },
  { label: 'Instagram', href: siteConfig.socials.instagram },
  { label: 'TikTok', href: siteConfig.socials.tiktok },
  { label: 'Facebook', href: siteConfig.socials.facebook },
];

export const metadata: Metadata = archiveRecord
  ? {
      ...metadataFromRecord(archiveRecord),
      title: { absolute: 'Podcast — Brian Kramer' },
    }
  : {
      title: 'Podcast',
      description:
        'Podcast conversations on dealer operations, acquisition, trust, and digital transformation — plus a running playlist of every appearance.',
      alternates: { canonical: '/podcast' },
    };

export default function PodcastPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Podcast conversations. One thread.',
    description:
      'Podcast conversations on dealer operations, acquisition, trust, and digital transformation — plus a running playlist of every appearance.',
    url: `${siteConfig.url}/podcast`,
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntity: {
      '@type': 'PodcastSeries',
      name: 'Brian Kramer Dealership Podcasts in Retail Automotive',
      url: playlistUrl,
      webFeed: playlistUrl,
    },
  };

  return (
    <section className="container-page pt-16 pb-24 md:pt-24">
      <JsonLd id="schema-podcast" data={schema} />
      <p className="eyebrow">Podcast</p>
      <h1 className="mt-3 text-display font-semibold text-ink">Podcast conversations. One thread.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
        Conversations on dealer operations, acquisition economics, trust, and what comes after
        paperless — recorded natively on the shows and channels that hosted them. No secondhand
        summaries: every entry below plays or links straight to the original source.
      </p>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
        {featuredEpisodes.map((ep) => (
          <GlassCard key={ep.embedId} as="article" className="overflow-hidden p-3">
            <div className="aspect-video w-full overflow-hidden rounded-xl">
              <iframe
                title={ep.title}
                className="h-full w-full border-0"
                src={`https://www.youtube-nocookie.com/embed/${ep.embedId}`}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
            <div className="p-5">
              <p className="eyebrow text-accent">{ep.show}</p>
              <h2 className="mt-2 text-lg font-semibold leading-snug text-ink">{ep.title}</h2>
              <div className="mt-3 flex items-center justify-between gap-3">
                <time dateTime={ep.publishDate} className="text-xs text-ink-faint">
                  {new Date(ep.publishDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <a
                  href={ep.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[44px] items-center text-sm font-medium text-accent hover:text-accent-hover"
                >
                  Watch on YouTube →
                </a>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-4">
          <p className="eyebrow">Spotify · 57 tracks</p>
          <h2 className="mt-3 text-2xl font-semibold text-ink md:text-3xl">Every appearance, one playlist.</h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink-muted">
            A running Spotify playlist of every podcast appearance — Car Dealership Guy, Fixed Ops
            Roundtable, The David Spisak Show, vAuto Podcast, The Dealer Playbook, and more. Updated
            as new episodes publish.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton href={playlistUrl} external variant="primary">
              Open in Spotify
            </LinkButton>
          </div>
        </div>

        <GlassCard as="section" className="overflow-hidden p-3 lg:col-span-8">
          <iframe
            title="Brian Kramer Dealership Podcasts in Retail Automotive — Spotify playlist"
            className="block min-h-[560px] w-full rounded-xl border-0"
            src={playlistEmbedUrl}
            width="100%"
            height="560"
            allow="autoplay; clipboard-write; compute-pressure; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </GlassCard>
      </div>

      <div className="mt-16 border-t border-line pt-10">
        <p className="eyebrow">Listen everywhere</p>
        <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink-muted">
          {listenEverywhere.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[44px] items-center font-medium text-ink hover:text-accent"
              >
                {item.label} →
              </a>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-14 text-sm text-ink-muted">
        Prefer music over conversation?{' '}
        <Link href="/playlist" className="font-medium text-accent hover:text-accent-hover">
          Open the working playlist →
        </Link>
      </p>
    </section>
  );
}
