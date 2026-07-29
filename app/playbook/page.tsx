import Link from 'next/link';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { getPlaybookSlugs, getPlaybookEntry } from '@/content/playbook/entries';
import { getCanonicalContentByPath } from '@/content/publishing/records';
import { collectionPageJsonLd, metadataFromRecord } from '@/lib/seo';

const playbookRecord = getCanonicalContentByPath('/playbook');

const pillarLabels: Record<string, string> = {
  acquisition: 'Acquisition',
  appraisal: 'Appraisal',
  trust: 'Trust',
  'ai-search': 'AI search',
};

// Only slugs with their own publishing record are listed here — mirrors the
// reachability rule enforced in app/playbook/[slug]/page.tsx and
// scripts/check-content-governance.mjs.
const publishedEntries = getPlaybookSlugs()
  .map((slug) => ({ slug, entry: getPlaybookEntry(slug), record: getCanonicalContentByPath(`/playbook/${slug}`) }))
  .filter((item) => item.entry && item.record)
  .map((item) => ({ entry: item.entry!, record: item.record! }));

export const metadata: Metadata = playbookRecord
  ? {
      ...metadataFromRecord(playbookRecord),
      title: { absolute: 'Playbook — Brian Kramer' },
    }
  : {
      title: 'Playbook',
      description: 'Dealer operating playbooks are being prepared for publication.',
      alternates: { canonical: '/playbook' },
    };

export default function PlaybookPage() {
  const schema = playbookRecord
    ? collectionPageJsonLd({ record: playbookRecord })
    : {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Operating tools you can run this week.',
        description: 'Dealer operating playbooks are being prepared for publication.',
        url: 'https://www.briankramer.io/playbook',
      };

  return (
    <section className="container-page pt-16 pb-24 md:pt-24">
      <JsonLd id="schema-playbook" data={schema} />
      <p className="eyebrow">Playbook</p>
      <h1 className="mt-3 text-display font-semibold text-ink">Operating tools you can run this week.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
        Step-by-step operating playbooks with clear owners, cadence, and proof — no universal
        benchmarks, just the process. More publish as source material clears review.
      </p>

      <ul className="mt-14 grid gap-6 sm:grid-cols-2">
        {publishedEntries.map(({ entry, record }) => (
          <li key={entry.slug}>
            <Link
              href={`/playbook/${entry.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-line p-6 transition-colors hover:border-accent"
            >
              <p className="eyebrow text-accent">{pillarLabels[entry.pillar] ?? entry.pillar}</p>
              <h2 className="mt-3 text-xl font-semibold text-ink group-hover:text-accent">
                {record.canonicalTitle}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-ink-muted">{entry.dek}</p>
              <div className="mt-6 flex flex-1 items-end justify-between text-sm text-ink-faint">
                <span>{entry.timeToRun}</span>
                <span className="text-accent transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
