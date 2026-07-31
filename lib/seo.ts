import type { Metadata } from 'next';
import {
  getCanonicalContentByPath,
  type CanonicalContentRecord,
  SITE_ORIGIN,
} from '@/content/publishing/records';
import { siteConfig } from '@/lib/utils';

export const PERSON_SCHEMA_ID = `${SITE_ORIGIN}/#person`;
export const WEBSITE_SCHEMA_ID = `${SITE_ORIGIN}/#website`;

const pillarKeywords: Record<string, string[]> = {
  acquisition: ['dealer acquisition', 'service drive', 'used vehicle sourcing'],
  appraisal: ['Look-to-Book', 'vehicle appraisal', 'used car operations'],
  trust: ['dealer trust', 'digital trust audit', 'dealership reviews'],
  'digital-transformation': ['paperless automotive', 'dealer operations', 'digital retail'],
  'ai-search': ['AI search', 'dealer schema', 'ChatGPT dealership'],
  leadership: ['automotive leadership', 'dealer growth'],
};

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}

export function pathFromCanonicalUrl(canonicalUrl: string): string {
  return canonicalUrl.replace(SITE_ORIGIN, '') || '/';
}

export function metadataFromRecord(
  record: CanonicalContentRecord,
  extras?: Partial<Metadata>,
): Metadata {
  const path = pathFromCanonicalUrl(record.canonicalUrl);
  return {
    title: { absolute: record.seoTitle },
    description: record.approvedSummary,
    alternates: { canonical: path },
    ...extras,
  };
}

export function getEssayPublishingRecord(slug: string): CanonicalContentRecord | undefined {
  return getCanonicalContentByPath(`/writing/${slug}`);
}

export function articleJsonLd(input: {
  record: CanonicalContentRecord;
  topicPillar?: string | null;
  image?: string;
  wordCount?: number;
}): Record<string, unknown> {
  const { record, topicPillar, image, wordCount } = input;
  const keywords = [
    ...(topicPillar ? pillarKeywords[topicPillar] ?? [topicPillar] : []),
    'Brian Kramer',
    'automotive retail',
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${record.canonicalUrl}#article`,
    headline: record.canonicalTitle,
    description: record.approvedSummary,
    datePublished: record.datePublished,
    dateModified: record.dateModified,
    image: image ?? absoluteUrl('/opengraph-image'),
    wordCount,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': record.canonicalUrl,
    },
    author: {
      '@type': 'Person',
      '@id': PERSON_SCHEMA_ID,
      name: siteConfig.author.name,
      url: absoluteUrl('/about'),
    },
    publisher: {
      '@type': 'Person',
      '@id': PERSON_SCHEMA_ID,
      name: siteConfig.author.name,
      url: SITE_ORIGIN,
    },
    keywords,
  };
}

export function breadcrumbListJsonLd(
  items: Array<{ name: string; url: string }>,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function collectionPageJsonLd(input: {
  record: CanonicalContentRecord;
}): Record<string, unknown> {
  const { record } = input;
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: record.canonicalTitle,
    description: record.approvedSummary,
    url: record.canonicalUrl,
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: SITE_ORIGIN,
    },
  };
}
