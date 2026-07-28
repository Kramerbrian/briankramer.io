import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { getPlaybookEntry, getPlaybookSlugs } from '@/content/playbook/entries';
import { getCanonicalContentByPath } from '@/content/publishing/records';
import { metadataFromRecord } from '@/lib/seo';

const pillarLabels: Record<string, string> = {
  acquisition: 'Acquisition',
  appraisal: 'Appraisal',
  trust: 'Trust',
  'ai-search': 'AI search',
};

interface Props {
  params: Promise<{ slug: string }>;
}

// Only slugs with a canonical publishing record in
// content/publishing/records.ts are reachable — see
// scripts/check-content-governance.mjs for the enforced pairing. A playbook
// slug can exist in content/playbook/entries.ts without a record; it will
// 404 until a record is added.
const recordedSlugs = getPlaybookSlugs().filter((slug) =>
  Boolean(getCanonicalContentByPath(`/playbook/${slug}`)),
);

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return recordedSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!recordedSlugs.includes(slug)) return {};

  const record = getCanonicalContentByPath(`/playbook/${slug}`);
  if (record) return metadataFromRecord(record);

  const entry = getPlaybookEntry(slug);
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.dek,
    alternates: { canonical: `/playbook/${entry.slug}` },
  };
}

export default async function PlaybookEntryPage({ params }: Props) {
  const { slug } = await params;
  if (!recordedSlugs.includes(slug)) notFound();

  const entry = getPlaybookEntry(slug);
  if (!entry) notFound();

  const record = getCanonicalContentByPath(`/playbook/${slug}`);
  const headline = record?.canonicalTitle ?? entry.title;
  const description = record?.approvedSummary ?? entry.dek;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: headline,
    description,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.briankramer.io/playbook/${entry.slug}`,
    },
    author: {
      '@type': 'Person',
      name: 'Brian Kramer',
      url: 'https://www.briankramer.io/about',
    },
    step: entry.steps.map((step) => ({
      '@type': 'HowToStep',
      position: step.n,
      name: step.headline,
      text: step.detail,
    })),
  };

  return (
    <article className="container-prose pt-16 pb-24 md:pt-24">
      <JsonLd id={`schema-playbook-${entry.slug}`} data={schema} />
      <Link
        href="/playbook"
        className="inline-flex min-h-[44px] items-center py-3 text-sm font-medium text-accent hover:text-accent-hover"
      >
        ← All playbooks
      </Link>

      <p className="eyebrow mt-8 text-accent">{pillarLabels[entry.pillar] ?? entry.pillar}</p>
      <h1 className="mt-3 text-display font-semibold text-ink">{headline}</h1>
      <p className="mt-5 text-lg leading-relaxed text-ink-muted">{entry.dek}</p>

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-faint">
        <span>{entry.audience}</span>
        <span aria-hidden="true">·</span>
        <span>{entry.timeToRun}</span>
      </div>

      <div className="hairline mt-10" />

      <ol className="mt-10 space-y-8">
        {entry.steps.map((step) => (
          <li key={step.n} className="flex gap-4">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent"
            >
              {step.n}
            </span>
            <div>
              <h2 className="text-lg font-semibold text-ink">{step.headline}</h2>
              <p className="mt-2 leading-relaxed text-ink-muted">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}
