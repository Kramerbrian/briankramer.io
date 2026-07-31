import { ImageResponse } from 'next/og';
import { notFound } from 'next/navigation';
import { getEssay } from '@/content/essays';
import { getEssayPublishingRecord } from '@/lib/seo';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const essay = getEssay(slug);
  if (!essay) notFound();

  const record = getEssayPublishingRecord(essay.slug);
  const title = record?.canonicalTitle ?? essay.title;
  const description = record?.approvedSummary ?? essay.dek;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: 'linear-gradient(160deg, #F7F5F1 0%, #EEF2F3 45%, #D6EBED 100%)',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: 22,
            fontWeight: 600,
            color: '#0E7C86',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          briankramer.io / writing
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div
            style={{
              fontSize: title.length > 74 ? 54 : 66,
              fontWeight: 600,
              color: '#0F1B24',
              lineHeight: 1.08,
              maxWidth: '980px',
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 28, color: '#41525C', maxWidth: '860px', lineHeight: 1.35 }}>
            {description}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 20,
            color: '#646F77',
          }}
        >
          <span>Brian Kramer · Automotive retail operations</span>
          <div
            style={{
              width: '48px',
              height: '4px',
              background: '#0E7C86',
              borderRadius: '2px',
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
