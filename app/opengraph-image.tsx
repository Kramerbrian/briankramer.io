import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Brian Kramer — EVP, Cars Commerce';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
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
          briankramer.io
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 600,
              color: '#0F1B24',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              maxWidth: '900px',
            }}
          >
            Dealer growth, earned through trust.
          </div>
          <div style={{ fontSize: 28, color: '#41525C', maxWidth: '760px', lineHeight: 1.4 }}>
            Brian Kramer · EVP, Cars Commerce · Naples, FL
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 20,
            color: '#7A8891',
          }}
        >
          <span>Writing · Podcast · Playbooks</span>
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
