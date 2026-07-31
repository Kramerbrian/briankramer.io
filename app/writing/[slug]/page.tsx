import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { EssayBody } from '@/components/EssayBody';
import { JsonLd } from '@/components/JsonLd';
import { getEssay, getEssaySlugs, getReadingMinutes, getWordCount } from '@/content/essays';
import {
  articleJsonLd,
  absoluteUrl,
  breadcrumbListJsonLd,
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

// Only the slugs returned by generateStaticParams() are valid routes.
// Without this, Next renders unknown slugs on demand; notFound() then fires
// after the static shell is committed, producing HTTP 200 with a not-found
// body (a soft 404 Google drops but keeps re-crawling).
export const dynamicParams = false;

export function generateStaticParams() {
  return getEssaySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const essay = getEssay(slug);
  if (!essay) return {};

  const canonicalPath = `/writing/${essay.slug}`;
  const ogImage = `${canonicalPath}/opengraph-image`;
  const record = getEssayPublishingRecord(essay.slug);
  if (record) {
    return metadataFromRecord(record, {
      openGraph: {
        type: 'article',
        url: canonicalPath,
        title: record.seoTitle,
        description: record.approvedSummary,
        siteName: 'Brian Kramer',
        publishedTime: record.datePublished,
        modifiedTime: record.dateModified,
        authors: ['Brian Kramer'],
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: record.canonicalTitle,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: record.seoTitle,
        description: record.approvedSummary,
        images: [ogImage],
      },
    });
  }

  return {
    title: essay.title,
    description: essay.dek,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: 'article',
      url: canonicalPath,
      title: essay.title,
      description: essay.dek,
      publishedTime: essay.publishDate,
      modifiedTime: essay.publishDate,
      authors: ['Brian Kramer'],
      images: [{ url: ogImage, width: 1200, height: 630, alt: essay.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: essay.title,
      description: essay.dek,
      images: [ogImage],
    },
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
  const canonicalUrl = record?.canonicalUrl ?? absoluteUrl(`/writing/${essay.slug}`);
  const image = absoluteUrl(`/writing/${essay.slug}/opengraph-image`);
  const wordCount = getWordCount(essay.body);

  const formattedDate = new Date(datePublished).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const schema = record
    ? articleJsonLd({
        record,
        topicPillar: essay.topicPillar,
        image,
        wordCount,
      })
    : {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        '@id': `${canonicalUrl}#article`,
        headline,
        description,
        datePublished,
        dateModified,
        image,
        wordCount,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
        author: {
          '@type': 'Person',
          '@id': 'https://www.briankramer.io/#person',
          name: 'Brian Kramer',
          url: 'https://www.briankramer.io/about',
        },
        publisher: {
          '@type': 'Person',
          '@id': 'https://www.briankramer.io/#person',
          name: 'Brian Kramer',
          url: 'https://www.briankramer.io',
        },
        keywords: ['Brian Kramer', 'automotive retail', essay.topicPillar],
      };
  const breadcrumbSchema = breadcrumbListJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Writing', url: '/writing' },
    { name: headline, url: `/writing/${essay.slug}` },
  ]);

  return (
    <article className="container-prose pt-16 pb-24 md:pt-24">
      <JsonLd id={`schema-essay-${essay.slug}`} data={schema} />
      <JsonLd id={`schema-breadcrumb-${essay.slug}`} data={breadcrumbSchema} />
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
        <span>{getReadingMinutes(essay.body)} min read</span>
      </div>

      <div className="hairline mt-10" />

      <div className="mt-10">
        <EssayBody body={essay.body} />
      </div>

      {essay.sources && essay.sources.length > 0 && (
        <div className="mt-14">
          <div className="hairline" />
          <p className="eyebrow mt-8 text-ink-faint">Sources</p>
          <ul className="mt-3 space-y-2">
            {essay.sources.map((source) => (
              <li key={source.url} className="text-sm text-ink-muted">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center text-accent underline underline-offset-2 hover:text-accent-hover"
                >
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
