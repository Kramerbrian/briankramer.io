'use client';

// Catches exceptions thrown in the root layout itself (app/layout.tsx) — above
// where error.tsx can reach. This replaces the ENTIRE document, so it must
// render its own <html>/<body> and can't rely on layout.tsx's providers or
// Tailwind context loading cleanly. Inline styles only, on purpose.

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '6rem 1.5rem',
          maxWidth: '640px',
          marginInline: 'auto',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          backgroundColor: '#F7F5F1',
          color: '#0F1B24',
        }}
      >
        <p
          style={{
            color: '#0E7C86',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          Something broke
        </p>
        <h1
          style={{
            marginTop: '0.75rem',
            fontSize: '2rem',
            fontWeight: 600,
            lineHeight: 1.15,
          }}
        >
          The lot is closed for a minute.
        </h1>
        <p
          style={{
            marginTop: '1.25rem',
            fontSize: '1.05rem',
            lineHeight: 1.6,
            color: '#41525C',
          }}
        >
          Something failed to load at the page level. Try again, or reach out
          directly if it keeps happening.
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={reset}
            style={{
              borderRadius: '9999px',
              backgroundColor: '#0E7C86',
              color: '#fff',
              border: 'none',
              padding: '0.75rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
          <a
            href="mailto:bkramer@cars.com"
            style={{
              borderRadius: '9999px',
              border: '1px solid #646F77',
              backgroundColor: '#FFFFFF',
              color: '#0F1B24',
              padding: '0.75rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            Email Brian
          </a>
        </div>
      </body>
    </html>
  );
}
