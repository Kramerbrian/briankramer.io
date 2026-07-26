import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllEssays } from '@/content/essays';

export const metadata: Metadata = {
  title: 'Writing',
  description:
    'Essays on dealer operations, acquisition, trust, and digital transformation from Brian Kramer.',
  alternates: { canonical: '/writing' },
};

const pillarLabels: Record<string, string> = {
  acquisition: 'Acquisition',
  appraisal: 'Appraisal',
  trust: 'Trust',
  'digital-transformation': 'Digital transformation',
  'ai-search': 'AI search',
  leadership: 'Leadership',
};

export default function WritingPage() {
  const essays = getAllEssays();

  return (
    <section className="container-page pt-16 pb-24 md:pt-24">
      <p className="eyebrow">Writing</p>
      <h1 className="mt-3 text-display font-semibold text-ink">Essays from the floor.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
        Operator notes on acquisition, trust, and the systems that compound — written for GMs,
        UCMs, and the people who actually run stores.
      </p>

      {essays.length > 0 ? (
        <ul className="mt-14 divide-y divide-line border-y border-line">
          {essays.map((essay) => (
            <li key={essay.slug}>
              <Link
                href={`/writing/${essay.slug}`}
                className="group flex flex-col gap-3 py-8 transition-colors md:flex-row md:items-start md:justify-between"
              >
                <div className="max-w-2xl">
                  <p className="eyebrow text-accent">
                    {pillarLabels[essay.topicPillar] ?? essay.topicPillar}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-ink transition-colors group-hover:text-accent md:text-2xl">
                    {essay.title}
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-ink-muted">{essay.dek}</p>
                </div>
                <div className="flex shrink-0 items-center gap-4 text-sm text-ink-faint md:flex-col md:items-end md:pt-8">
                  <span>{essay.readingMinutes} min read</span>
                  <span className="text-accent transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-14 border-y border-line py-10">
          <p className="max-w-xl text-base leading-relaxed text-ink-muted">
            Essays are being prepared for publication. The index will open as soon as the public
            drafts are ready.
          </p>
        </div>
      )}
    </section>
  );
}
