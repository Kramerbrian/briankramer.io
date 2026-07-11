import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { playbookEntries } from '@/content/playbook/entries';

const pillarLabels: Record<string, string> = {
  acquisition: 'Acquisition',
  appraisal: 'Appraisal',
  trust: 'Trust',
  'ai-search': 'AI search',
};

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return playbookEntries.map((entry) => ({ slug: entry.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const entry = playbookEntries.find((e) => e.slug === params.slug);
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.dek,
    alternates: { canonical: `/playbook/${entry.slug}` },
  };
}

export default function PlaybookEntryPage({ params }: Props) {
  const entry = playbookEntries.find((e) => e.slug === params.slug);
  if (!entry) notFound();

  return (
    <article className="container-page pt-16 pb-24 md:pt-24">
      <Link
        href="/playbook"
        className="text-sm font-medium text-accent hover:text-accent-hover"
      >
        ← All playbooks
      </Link>

      <p className="eyebrow mt-8 text-accent">
        {pillarLabels[entry.pillar] ?? entry.pillar}
      </p>
      <h1 className="mt-3 max-w-3xl text-display font-semibold text-ink">{entry.title}</h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">{entry.dek}</p>

      <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
        <div>
          <dt className="eyebrow">Audience</dt>
          <dd className="mt-1 text-ink-muted">{entry.audience}</dd>
        </div>
        <div>
          <dt className="eyebrow">Time to run</dt>
          <dd className="mt-1 text-ink-muted">{entry.timeToRun}</dd>
        </div>
      </dl>

      <div className="hairline mt-12" />

      <ol className="mt-12 space-y-10">
        {entry.steps.map((step) => (
          <li key={step.n} className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-1">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft font-display text-sm font-semibold text-accent">
                {step.n}
              </span>
            </div>
            <div className="md:col-span-11">
              <h2 className="text-xl font-semibold text-ink md:text-2xl">{step.headline}</h2>
              <p className="mt-3 text-base leading-relaxed text-ink-muted md:text-lg">
                {step.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}
