import type { Metadata } from 'next';
import { GlassCard } from '@/components/GlassCard';
import { JsonLd } from '@/components/JsonLd';
import { LinkButton } from '@/components/Button';
import { siteConfig } from '@/lib/utils';

const playlistUrl = 'https://open.spotify.com/playlist/1Ij3H93G7v5eoMGYmm3KkE';
const playlistEmbedUrl =
  'https://open.spotify.com/embed/playlist/1Ij3H93G7v5eoMGYmm3KkE?utm_source=generator';

export const metadata: Metadata = {
  title: 'Playlist',
  description: 'A Spotify playlist from Brian Kramer for the work, travel, and thinking between the reps.',
  alternates: { canonical: '/playlist' },
  openGraph: {
    title: 'Playlist - Brian Kramer',
    description:
      'A Spotify playlist from Brian Kramer for the work, travel, and thinking between the reps.',
    url: `${siteConfig.url}/playlist`,
    type: 'website',
  },
};

const playlistSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Playlist',
  url: `${siteConfig.url}/playlist`,
  isPartOf: {
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
  },
  mainEntity: {
    '@type': 'MusicPlaylist',
    name: 'Brian Kramer Playlist',
    url: playlistUrl,
    provider: {
      '@type': 'Organization',
      name: 'Spotify',
      url: 'https://open.spotify.com',
    },
  },
};

export default function PlaylistPage() {
  return (
    <section className="container-page pt-16 pb-12 md:pb-16 md:pt-24">
      <JsonLd id="schema-playlist" data={playlistSchema} />

      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="animate-fade-up lg:col-span-4">
          <p className="eyebrow">Spotify</p>
          <h1 className="mt-3 text-display font-semibold text-ink">The working playlist.</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
            A running soundtrack for the drives, flights, and late-night build sessions around the
            work. No thesis, no manifesto. Just the signal between the reps.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href={playlistUrl} external variant="primary">
              Open in Spotify
            </LinkButton>
            <LinkButton href="/podcast" variant="subtle">
              Podcast archive
            </LinkButton>
          </div>
        </div>

        <GlassCard as="section" className="overflow-hidden p-3 lg:col-span-8">
          <iframe
            title="Brian Kramer Spotify playlist"
            className="block min-h-[560px] w-full rounded-xl border-0"
            src={playlistEmbedUrl}
            width="100%"
            height="560"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </GlassCard>
      </div>
    </section>
  );
}
