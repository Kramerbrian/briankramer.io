import type { Metadata } from 'next';
import Link from 'next/link';
import { GlassCard } from '@/components/GlassCard';
import { JsonLd } from '@/components/JsonLd';
import { TrackedAnchor } from '@/components/TrackedConversion';
import { getNewsletterEditions } from '@/content/newsletter/editions';
import { getCanonicalContentByPath } from '@/content/publishing/records';
import { collectionPageJsonLd, metadataFromRecord } from '@/lib/seo';

const newsletterRecord = getCanonicalContentByPath('/newsletter');

/**
 * LinkedIn "Automotive Update" newsletter-follow endpoint — one-tap subscribe
 * for signed-in members (not the profile link, which does not subscribe).
 */
const LINKEDIN_SUBSCRIBE_URL =
  'https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=6876750479435583488';

export const metadata: Metadata = newsletterRecord
  ? {
      ...metadataFromRecord(newsletterRecord),
      title: { absolute: 'Newsletter — Brian Kramer' },
    }
  : {
      title: 'Newsletter',
      description:
        'Verified LinkedIn Automotive Update editions — concise summaries with links to the canonical LinkedIn posts.',
      alternates: { canonical: '/newsletter' },
    };

const categoryLabels: Record<string, string> = {
  acquisition: 'Acquisition',
  trust: 'Trust',
  'used-car-economics': 'Used-car economics',
  'digital-transformation': 'Digital transformation',
};

export default function NewsletterPage() {
  const editions = getNewsletterEditions();
  const schema = newsletterRecord
    ? collectionPageJsonLd({ record: newsletterRecord })
    : {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Automotive Update',
        description:
          'Verified LinkedIn Automotive Update editions with concise summaries and canonical source links.',
        url: 'https://www.briankramer.io/newsletter',
        isPartOf: {
          '@type': 'WebSite',
          name: 'Brian Kramer',
          url: 'https://www.briankramer.io',
        },
      };

  return (
    <section className="container-page pt-16 pb-24 md:pt-24">
      <JsonLd id="schema-newsletter" data={schema} />

      <p className="eyebrow">Newsletter</p>
      <h1 className="mt-3 text-display font-semibold text-ink">Automotive Update</h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
        Concise summaries of verified LinkedIn Automotive Update editions. Full text lives on
        LinkedIn — this page does not republish articles.
      </p>

      <div className="mt-10">
        <TrackedAnchor
          href={LINKEDIN_SUBSCRIBE_URL}
          conversion={{
            name: 'newsletter_subscribe_click',
            props: { source: 'newsletter_page' },
          }}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft"
        >
          Subscribe on LinkedIn
        </TrackedAnchor>
        <p className="mt-3 text-xs text-ink-faint">
          Follow Brian Kramer on LinkedIn for new Automotive Update editions.
        </p>
      </div>

      <ul className="mt-14 space-y-4">
        {editions.map((edition) => (
          <li key={edition.contentId}>
            <GlassCard as="article" className="p-8 md:p-10">
              <div className="flex flex-wrap items-center gap-3">
                <p className="eyebrow text-accent">
                  {categoryLabels[edition.category] ?? edition.category}
                </p>
                <time dateTime={edition.publishDate} className="text-xs text-ink-faint">
                  {new Date(edition.publishDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
              <h2 className="mt-3 text-xl font-semibold leading-snug text-ink md:text-2xl">
                {edition.title}
              </h2>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-muted">
                {edition.summary}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <a
                  href={edition.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-accent hover:text-accent-hover"
                >
                  Read on LinkedIn →
                </a>
                <Link
                  href={edition.relatedPath}
                  className="text-ink-muted hover:text-accent"
                >
                  Related on this site →
                </Link>
              </div>
            </GlassCard>
          </li>
        ))}
      </ul>
    </section>
  );
}
