import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllEssays, getReadingMinutes } from '@/content/essays';

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

interface VisualDoctrineEntry {
  number: string;
  title: string;
  src: string;
  alt: string;
  caption: string;
}

const visualDoctrine: VisualDoctrineEntry[] = [
  {
    number: '01',
    title: 'Acquisition',
    src: '/visual-doctrine/01-acquisition.png',
    alt: 'The Best End User Acquisition — book cover concept typographic treatment',
    caption:
      'The Best End User cover concept: trust, truth and decisiveness determine who acquires each vehicle.',
  },
  {
    number: '02',
    title: 'What survives the market',
    src: '/visual-doctrine/02-what-survives.png',
    alt: 'Diagram showing friction stopping at the market while trust, truth, clarity, and appraisal pass through to ownership',
    caption:
      'Friction stops at the market. Trust, truth, clarity, appraisal and acquisition pass through to ownership.',
  },
  {
    number: '03',
    title: 'The ownership equation',
    src: '/visual-doctrine/03-ownership-equation.png',
    alt: 'Formula graphic: The Best End User Ownership equals trust times truth times clarity times appraisal over acquisition force, divided by fear times ambiguity times hesitation over acquisition friction',
    caption:
      'Acquisition force compounds. Fear, ambiguity and hesitation divide it. The market records the result.',
  },
  {
    number: '04',
    title: 'From trust to acquisition',
    src: '/visual-doctrine/04-trust-to-acquisition.png',
    alt: 'Pyramid diagram ascending from trust to truth to clarity to appraisal',
    caption:
      'A visual hierarchy connecting ground truth, clarity, appraisal and the acquisition decision.',
  },
];

export default function WritingPage() {
  const essays = getAllEssays();

  return (
    <section className="container-page pt-16 pb-24 md:pt-24">
      <p className="eyebrow">Writing</p>
      <h1 className="mt-3 text-display font-semibold text-ink">
        Essays from
        <span className="subline mt-1">the floor.</span>
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
        Operator notes on acquisition, trust, and the systems that compound — written for GMs,
        UCMs, and the people who actually run stores.
      </p>
      <Link
        href="/newsletter"
        className="mt-4 inline-flex min-h-[44px] items-center text-sm font-medium text-accent hover:text-accent-hover"
      >
        Read the LinkedIn newsletter archive →
      </Link>

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
                  <span>{getReadingMinutes(essay.body)} min read</span>
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

      <div className="mt-24 border-t border-line pt-16 md:mt-32">
        <p className="eyebrow">Visual Doctrine</p>
        <h2 className="mt-3 text-3xl font-semibold text-ink md:text-4xl">
          The argument,
          <span className="subline mt-1">made visible.</span>
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
          Four graphics that carry the same doctrine as the essays above — acquisition,
          ownership, and what actually survives contact with the market.
        </p>

        <div className="mt-12 grid gap-10 sm:grid-cols-2">
          {visualDoctrine.map((entry) => (
            <figure key={entry.number} className="group">
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl border border-line bg-black shadow-glass">
                <Image
                  src={entry.src}
                  alt={entry.alt}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <figcaption className="mt-4">
                <p className="eyebrow text-accent">{entry.number}</p>
                <p className="mt-1 text-lg font-semibold text-ink">{entry.title}</p>
                <p className="mt-2 text-base leading-relaxed text-ink-muted">{entry.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
