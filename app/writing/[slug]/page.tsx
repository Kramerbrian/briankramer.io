import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { EssayBody } from '@/components/EssayBody';
import { getEssay, getEssaySlugs } from '@/content/essays';

const pillarLabels: Record<string, string> = {
  acquisition: 'Acquisition',
  appraisal: 'Appraisal',
  trust: 'Trust',
  'digital-transformation': 'Digital transformation',
  'ai-search': 'AI search',
  leadership: 'Leadership',
};

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getEssaySlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const essay = getEssay(params.slug);
  if (!essay) return {};
  return {
    title: essay.title,
    description: essay.dek,
  };
}

export default function EssayPage({ params }: Props) {
  const essay = getEssay(params.slug);
  if (!essay) notFound();

  const formattedDate = new Date(essay.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="container-prose pt-16 pb-24 md:pt-24">
      <Link
        href="/writing"
        className="text-sm font-medium text-accent hover:text-accent-hover"
      >
        ← All essays
      </Link>

      <p className="eyebrow mt-8 text-accent">
        {pillarLabels[essay.topicPillar] ?? essay.topicPillar}
      </p>
      <h1 className="mt-3 text-display font-semibold text-ink">{essay.title}</h1>
      <p className="mt-5 text-lg leading-relaxed text-ink-muted">{essay.dek}</p>

      <div className="mt-6 flex items-center gap-4 text-sm text-ink-faint">
        <time dateTime={essay.publishDate}>{formattedDate}</time>
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
