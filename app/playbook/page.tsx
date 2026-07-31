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

interface OperatingLoopStage {
  number: string;
  label: string;
  detail: string;
}

const operatingLoop: OperatingLoopStage[] = [
  {
    number: '01',
    label: 'Signal',
    detail: 'What happened that should trigger action.',
  },
  {
    number: '02',
    label: 'Owner',
    detail: 'One accountable role, not a committee.',
  },
  {
    number: '03',
    label: 'Cadence',
    detail: 'When the operating work happens and repeats.',
  },
  {
    number: '04',
    label: 'Steps',
    detail: 'The exact sequence an operator can run.',
  },
  {
    number: '05',
    label: 'Proof',
    detail: 'The receipt showing the work occurred.',
  },
  {
    number: '06',
    label: 'Success',
    detail: 'The measurable outcome that closes the loop.',
  },
];

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

      <div className="mt-16 border-y border-line py-14 md:mt-20">
        <p className="eyebrow">The standard</p>
        <h2 className="mt-3 text-2xl font-semibold text-ink md:text-3xl">
          The plays on this page
          <span className="subline mt-1">run the same loop.</span>
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
          Before a playbook earns a place here, it has to survive Monday morning — a named owner,
          a real cadence, and a way to prove the work happened.
        </p>
        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {operatingLoop.map((stage) => (
            <li key={stage.number}>
              <p className="eyebrow text-accent">{stage.number}</p>
              <p className="mt-2 text-lg font-semibold text-ink">{stage.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{stage.detail}</p>
            </li>
          ))}
        </ol>
      </div>

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
