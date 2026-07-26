import type { Metadata } from 'next';
import Script from 'next/script';
import { LinkButton } from '@/components/Button';
import { siteConfig } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Playlist',
  description:
    'Spotify playlist pointer for Brian Kramer dealership podcast conversations. On-site listen links stay unpublished until source records are verified.',
  alternates: { canonical: '/playlist' },
  openGraph: {
    title: 'Playlist - Brian Kramer',
    description:
      'Spotify playlist pointer for Brian Kramer dealership podcast conversations. On-site listen links stay unpublished until source records are verified.',
    url: `${siteConfig.url}/playlist`,
    type: 'website',
  },
};

const playlistSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Playlist',
  description:
    'Pointer page for a Brian Kramer Spotify playlist of dealership podcast conversations. Listen links are not published here while podcast sources remain unverified.',
  url: `${siteConfig.url}/playlist`,
  isPartOf: {
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
  },
};

export default function PlaylistPage() {
  return (
    <section className="container-page pt-16 pb-24 md:pt-24">
      <Script
        id="schema-playlist"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(playlistSchema) }}
      />

      <div className="max-w-2xl animate-fade-up">
        <p className="eyebrow">Spotify</p>
        <h1 className="mt-3 text-display font-semibold text-ink">Dealership podcasts playlist.</h1>
        <p className="mt-6 text-lg leading-relaxed text-ink-muted">
          Brian maintains a public Spotify playlist titled &ldquo;Brian Kramer Dealership Podcasts in
          Retail Automotive.&rdquo; This site does not embed or link that playlist while podcast
          source verification is incomplete.
        </p>
        <p className="mt-6 rounded-2xl border border-line bg-surface-muted px-5 py-4 text-sm leading-relaxed text-ink-muted">
          Provisional: on-site listen surfaces stay gated. The podcast archive is the on-site
          surface; listen links there remain hidden until source records are verified.
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
