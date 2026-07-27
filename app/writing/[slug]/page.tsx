import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { EssayBody } from '@/components/EssayBody';
import { JsonLd } from '@/components/JsonLd';
import { getEssay, getEssaySlugs } from '@/content/essays';
import {
  articleJsonLd,
  getEssayPublishingRecord,
  metadataFromRecord,
} from '@/lib/seo';

const pillarLabels: Record<string, string> = {
  acquisition: 'Acquisition',
  appraisal: 'Appraisal',
  trust: 'Trust',
  'digital-transformation': 'Digital transformation',
  'ai-search': 'AI search',
  leadership: 'Leadership',
};

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getEssaySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const essay = getEssay(slug);
  if (!essay) return {};

  const record = getEssayPublishingRecord(essay.slug);
  if (record) {
    return metadataFromRecord(record);
  }

  return {
    title: essay.title,
    description: essay.dek,
    alternates: { canonical: `/writing/${essay.slug}` },
  };
}

export default async function EssayPage({ params }: Props) {
  const { slug } = await params;
  const essay = getEssay(slug);
  if (!essay) notFound();

  const record = getEssayPublishingRecord(essay.slug);
  const datePublished = record?.datePublished ?? essay.publishDate;
  const dateModified = record?.dateModified ?? essay.publishDate;
  const description = record?.approvedSummary ?? essay.dek;
  const headline = record?.canonicalTitle ?? essay.title;

  const formattedDate = new Date(datePublished).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const schema = record
    ? articleJsonLd({ record, topicPillar: essay.topicPillar })
    : {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline,
        description,
        datePublished,
        dateModified,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://www.briankramer.io/writing/${essay.slug}`,
        },
        author: {
          '@type': 'Person',
          name: 'Brian Kramer',
          url: 'https://www.briankramer.io/about',
        },
        publisher: {
          '@type': 'Person',
          name: 'Brian Kramer',
          url: 'https://www.briankramer.io',
        },
        keywords: ['Brian Kramer', 'automotive retail', essay.topicPillar],
      };

  return (
    <article className="container-prose pt-16 pb-24 md:pt-24">
      <JsonLd id={`schema-essay-${essay.slug}`} data={schema} />
      <Link
        href="/writing"
        className="inline-flex min-h-[44px] items-center py-3 text-sm font-medium text-accent hover:text-accent-hover"
      >
        ← All essays
      </Link>

      <p className="eyebrow mt-8 text-accent">
        {pillarLabels[essay.topicPillar] ?? essay.topicPillar}
      </p>
      <h1 className="mt-3 text-display font-semibold text-ink">{headline}</h1>
      <p className="mt-5 text-lg leading-relaxed text-ink-muted">{essay.dek}</p>

      <div className="mt-6 flex items-center gap-4 text-sm text-ink-faint">
        <time dateTime={datePublished}>{formattedDate}</time>
        <span aria-hidden="true">·</span>
        <span>{essay.readingMinutes} min read</span>
      </div>

      <div className="hairline mt-10" />

      <div className="mt-10">
        <EssayBody body={essay.body} />
      </div>
    </article>
  );
}
