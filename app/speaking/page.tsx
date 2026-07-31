import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { GlassCard } from '@/components/GlassCard';
import { getCanonicalContentByPath } from '@/content/publishing/records';
import { metadataFromRecord } from '@/lib/seo';
import { siteConfig } from '@/lib/utils';

const speakingRecord = getCanonicalContentByPath('/speaking');

interface Topic {
  number: string;
  title: string;
  description: string;
}

const topics: Topic[] = [
  {
    number: '01',
    title: 'The Best End User',
    description:
      'An appraisal decision is also a placement decision — a buyer, channel, or lot that turns the vehicle fastest at a defensible margin. A framework for deciding where a car belongs before you set a number.',
  },
  {
    number: '02',
    title: 'Trust Is Infrastructure',
    description:
      'Review velocity, phone experience, and VDP quality are not marketing line items — they are the acquisition pipeline. What changes when a store treats trust as something it builds, not something it buys.',
  },
  {
    number: '03',
    title: 'Appraisals Are a Contact Sport',
    description:
      'Look-to-book is a lagging indicator. Stores that win consumer acquisition treat walk-ins, service-drive visits, and phone calls as appraisal opportunities, not transactions waiting to happen.',
  },
  {
    number: '04',
    title: 'The Answer Layer',
    description:
      'AI answer engines are already recommending — or skipping — dealerships before a shopper ever lands on a website. What dealers need to understand about being cited, not just ranked.',
  },
];

const mailtoHref = `mailto:${siteConfig.author.email}?subject=${encodeURIComponent('Speaking inquiry')}`;

export const metadata: Metadata = speakingRecord
  ? {
      ...metadataFromRecord(speakingRecord),
      title: { absolute: 'Speaking — Brian Kramer' },
    }
  : {
      title: 'Speaking',
      description:
        'Talks for dealer groups, OEMs, and industry events on acquisition, trust, appraisals, and AI answer-surface visibility.',
      alternates: { canonical: '/speaking' },
    };

export default function SpeakingPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Stage time should change Monday.',
    description:
      'Talks for dealer groups, OEMs, and industry events on acquisition, trust, appraisals, and AI answer-surface visibility.',
    url: `${siteConfig.url}/speaking`,
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <section className="container-page pt-16 pb-24 md:pt-24">
      <JsonLd id="schema-speaking" data={schema} />
      <p className="eyebrow">Speaking</p>
      <h1 className="mt-3 text-display font-semibold text-ink">Stage time should change Monday.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
        Talks for dealer groups, OEMs, and industry events — built from the floor, not from slides.
        Each topic below ends with something a GM can run the week after.
      </p>

      <ul className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
        {topics.map((topic) => (
          <li key={topic.number}>
            <GlassCard as="article" className="h-full p-8 md:p-10">
              <p className="font-display text-3xl font-semibold text-ink-faint">{topic.number}</p>
              <h2 className="mt-4 text-xl font-semibold leading-snug text-ink md:text-2xl">
                {topic.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-muted">{topic.description}</p>
            </GlassCard>
          </li>
        ))}
      </ul>

      <div className="mt-16 border-t border-line pt-10">
        <p className="eyebrow">Book a talk</p>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-muted">
          Write with the event, audience, and date — I read everything and reply within a few days.
        </p>
        <div className="mt-6">
          <a
            href={mailtoHref}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft"
          >
            Email about speaking →
          </a>
        </div>
      </div>
    </section>
  );
}
