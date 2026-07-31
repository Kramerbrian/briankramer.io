import { describe, expect, it } from 'vitest';
import { essays, getWordCount } from '@/content/essays';
import { getEssayPublishingRecord, articleJsonLd, absoluteUrl } from '@/lib/seo';

describe('essay metadata and schema inputs', () => {
  it('has publishing records and unique SEO fields for every essay', () => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    const canonicalUrls = new Set<string>();
    const ogImages = new Set<string>();

    for (const essay of essays) {
      const record = getEssayPublishingRecord(essay.slug);
      expect(record, essay.slug).toBeDefined();
      expect(record?.seoTitle, essay.slug).not.toBe('Brian Kramer — EVP, Cars Commerce');
      expect(record?.approvedSummary, essay.slug).not.toBe(
        'EVP at Cars Commerce focused on dealer growth and success. Career GM and executive tenure in automotive retail. Writing The Best End User.',
      );

      titles.add(record?.seoTitle ?? '');
      descriptions.add(record?.approvedSummary ?? '');
      canonicalUrls.add(record?.canonicalUrl ?? '');
      ogImages.add(absoluteUrl(`/writing/${essay.slug}/opengraph-image`));
    }

    expect(titles.size).toBe(essays.length);
    expect(descriptions.size).toBe(essays.length);
    expect(canonicalUrls.size).toBe(essays.length);
    expect(ogImages.size).toBe(essays.length);
  });

  it('emits complete BlogPosting schema for each essay', () => {
    for (const essay of essays) {
      const record = getEssayPublishingRecord(essay.slug);
      expect(record).toBeDefined();

      const schema = articleJsonLd({
        record: record!,
        topicPillar: essay.topicPillar,
        image: absoluteUrl(`/writing/${essay.slug}/opengraph-image`),
        wordCount: getWordCount(essay.body),
      });

      expect(schema).toMatchObject({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        '@id': `${record!.canonicalUrl}#article`,
        headline: record!.canonicalTitle,
        description: record!.approvedSummary,
        datePublished: record!.datePublished,
        dateModified: record!.dateModified,
        image: absoluteUrl(`/writing/${essay.slug}/opengraph-image`),
        wordCount: getWordCount(essay.body),
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': record!.canonicalUrl,
        },
        author: {
          '@type': 'Person',
          '@id': 'https://www.briankramer.io/#person',
          name: 'Brian Kramer',
        },
      });
    }
  });
});
