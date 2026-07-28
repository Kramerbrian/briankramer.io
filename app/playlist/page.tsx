import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { LinkButton } from '@/components/Button';
import { siteConfig } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Playlist',
  description:
    'Spotify playlist for Brian Kramer dealership podcast conversations. On-site listen links publish as durable source records are added.',
  alternates: { canonical: '/playlist' },
  openGraph: {
    title: 'Playlist — Brian Kramer',
    description:
      'Spotify playlist for Brian Kramer dealership podcast conversations. On-site listen links publish as durable source records are added.',
    url: `${siteConfig.url}/playlist`,
    type: 'website',
  },
};

const playlistSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Playlist',
  description:
    'Pointer page for Brian Kramer Dealership Podcasts in Retail Automotive. Listen links publish as durable source records are added.',
  url: `${siteConfig.url}/playlist`,
  isPartOf: {
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
  },
};

export default function PlaylistPage() {
  return (
    <section className="container-page pt-16 pb-12 md:pb-16 md:pt-24">
      <JsonLd id="schema-playlist" data={playlistSchema} />

      <div className="max-w-2xl animate-fade-up">
        <p className="eyebrow">Spotify</p>
        <h1 className="mt-3 text-display font-semibold text-ink">Dealership podcasts playlist.</h1>
        <p className="mt-6 text-lg leading-relaxed text-ink-muted">
          Brian maintains a public Spotify playlist titled &ldquo;Brian Kramer Dealership Podcasts in
          Retail Automotive.&rdquo; This site does not embed or link that playlist here. The podcast
          archive is the on-site surface; listen links publish as durable source records are added.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton href="/podcast" variant="primary">
            Podcast archive
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
