import type { ReactNode } from 'react';

interface PullQuoteBandProps {
  quote: ReactNode;
  attribution?: ReactNode;
}

/**
 * Full-bleed dark section used as a scroll-rhythm breather between light
 * sections. Background uses the existing `ink` token (already used for
 * body text) rather than introducing a new color, so it stays inside the
 * established design system from PR #33.
 */
export function PullQuoteBand({ quote, attribution }: PullQuoteBandProps) {
  return (
    <section className="bg-ink py-20 md:py-28">
      <div className="container-page">
        <p className="mx-auto max-w-3xl text-center font-serif text-2xl italic leading-snug text-bg md:text-3xl">
          {quote}
        </p>
        {attribution ? (
          <p className="mt-6 text-center text-sm font-semibold uppercase tracking-[0.12em] text-bg/60">
            {attribution}
          </p>
        ) : null}
      </div>
    </section>
  );
}
