import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { siteConfig } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Visual doctrine',
  description:
    'Four working models from The Best End User. Trust, truth and clarity are what survive the market; fear, ambiguity and hesitation are what divide it.',
  alternates: { canonical: '/doctrine' },
};

interface Artifact {
  n: string;
  title: string;
  caption: string;
  src: string;
  width: number;
  height: number;
  /** Describes the CONTENT of the diagram, not its appearance. These images carry
   *  the argument — a reader who cannot see them must still get the model. */
  alt: string;
}

const artifacts: Artifact[] = [
  {
    n: '01',
    title: 'Acquisition',
    caption:
      'The Best End User cover concept: trust, truth and clarity determine who acquires each vehicle.',
    src: '/images/doctrine/01-acquisition-cover.webp',
    width: 1024,
    height: 1536,
    alt: 'Book cover for The Best End User, subtitled Acquisition, by Robert Hollenshead and Brian Kramer. The cover states that trust, truth and decisiveness decide who acquires each vehicle.',
  },
  {
    n: '02',
    title: 'What survives the market',
    caption:
      'Friction stops at the market. Trust, truth, clarity, appraisal and acquisition pass through to ownership.',
    src: '/images/doctrine/02-what-survives-market.webp',
    width: 1535,
    height: 1024,
    alt: 'Diagram of market inputs in two columns. On the left, forces that do not survive the market — the friction and hesitation system: fraud, distrust, fear, ambiguity and hesitation — each stopping at a vertical bar before reaching the market line. On the right, forces that pass through the market — the acquisition and enablement system: trust, truth, clarity, appraisal, best end user and acquisition — each crossing the market line with arrows. Below the market line, a single output: Best End User Ownership, the only result the market records.',
  },
  {
    n: '03',
    title: 'The ownership equation',
    caption:
      'Acquisition force compounds. Fear, ambiguity and hesitation divide it. The market records the result.',
    src: '/images/doctrine/03-ownership-equation.webp',
    width: 1536,
    height: 1024,
    alt: 'An equation. Best End User Ownership equals acquisition force divided by acquisition friction. Acquisition force is trust multiplied by truth multiplied by clarity multiplied by appraisal. Acquisition friction is fear multiplied by ambiguity multiplied by hesitation. Three statements run beneath: the market is neutral, the market records the answer, ownership is the only receipt.',
  },
  {
    n: '04',
    title: 'From trust to acquisition',
    caption:
      'A visual hierarchy connecting ground truth, clarity, appraisal, the best end user and the winning acquisition decision.',
    src: '/images/doctrine/04-trust-to-acquisition.webp',
    width: 1024,
    height: 1536,
    alt: 'A six-tier pyramid titled: the market does not reward belief, it records who bought the car. From the base upward — Trust, the ground truth moves on; Truth, what the VIN can prove; Clarity, truth that survives the handoff; Appraisal, your best shot at the VIN; Best End User, the buyer the market chose; and at the apex Acquisition, the winning bid. A light beam labelled AI visibility layer strikes the upper tiers, revealing hidden contradiction at scale.',
  },
];

const schema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Visual doctrine',
  description:
    'Four working models from The Best End User illustrating the acquisition doctrine: trust, truth and clarity as the forces that survive the market.',
  url: `${siteConfig.url}/doctrine`,
  isPartOf: {
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
  },
  hasPart: artifacts.map((a) => ({
    '@type': 'ImageObject',
    name: a.title,
    description: a.caption,
    contentUrl: `${siteConfig.url}${a.src}`,
  })),
};

export default function DoctrinePage() {
  return (
    <section className="container-page pt-16 pb-24 md:pt-24">
      <JsonLd id="schema-doctrine" data={schema} />

      <Link href="/writing" className="text-sm font-medium text-accent hover:text-accent-hover">
        ← All essays
      </Link>

      <p className="eyebrow mt-8 text-accent">Visual doctrine</p>
      <h1 className="mt-3 max-w-3xl text-display font-semibold text-ink">
        The argument, made visible.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
        Four working models from <em>The Best End User</em>. These are editorial artifacts — not
        decoration — and each makes a specific part of the acquisition doctrine easier to grasp.
      </p>

      <div className="hairline mt-12" />

      <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8">
        {artifacts.map((a, i) => (
          <figure
            key={a.n}
            className="overflow-hidden rounded-2xl border border-line bg-surface/70 shadow-glass backdrop-blur-xl transition-[border-color,box-shadow] duration-200 hover:border-line-strong hover:shadow-glass-lift"
          >
            <div className="relative w-full bg-ink">
              <Image
                src={a.src}
                alt={a.alt}
                width={a.width}
                height={a.height}
                priority={i === 0}
                sizes="(min-width: 768px) 45vw, 100vw"
                className="h-auto w-full"
              />
            </div>
            <figcaption className="p-6 md:p-8">
              <p className="eyebrow text-accent">{a.n}</p>
              <h2 className="mt-3 text-xl font-semibold text-ink">{a.title}</h2>
              <p className="mt-3 text-base leading-relaxed text-ink-muted">{a.caption}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
