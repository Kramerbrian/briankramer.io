import Link from 'next/link';
import type { Metadata } from 'next';
import { GlassCard } from '@/components/GlassCard';
import { playbookEntries } from '@/content/playbook/entries';

export const metadata: Metadata = {
  title: 'Playbook',
  description:
    'Operator playbooks for dealer acquisition, appraisal, trust, and AI search visibility.',
};

const pillarLabels: Record<string, string> = {
  acquisition: 'Acquisition',
  appraisal: 'Appraisal',
  trust: 'Trust',
  'ai-search': 'AI search',
};

export default function PlaybookPage() {
  return (
    <section className="container-page pt-16 pb-24 md:pt-24">
      <p className="eyebrow">Playbook</p>
      <h1 className="mt-3 text-display font-semibold text-ink">Run it this week.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
        Step-by-step operator playbooks — built for GMs and department heads who want reps, not
        theory.
      </p>

      <ul className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2">
        {playbookEntries.map((entry) => (
          <li key={entry.slug}>
            <Link href={`/playbook/${entry.slug}`} className="group block h-full">
              <GlassCard interactive className="flex h-full flex-col p-8">
                <p className="eyebrow text-accent">
                  {pillarLabels[entry.pillar] ?? entry.pillar}
                </p>
                <h2 className="mt-3 text-xl font-semibold leading-snug text-ink transition-colors group-hover:text-accent md:text-2xl">
                  {entry.title}
                </h2>
                <p className="mt-3 flex-1 text-base leading-relaxed text-ink-muted">
                  {entry.dek}
                </p>
                <div className="mt-6 flex items-center justify-between text-xs text-ink-faint">
                  <span>{entry.timeToRun}</span>
                  <span className="text-accent transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </GlassCard>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
