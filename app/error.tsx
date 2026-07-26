'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="container-page flex min-h-[60vh] flex-col justify-center py-24">
      <p className="eyebrow text-accent">Something broke</p>
      <h1 className="mt-3 max-w-3xl text-display font-semibold text-ink">The page did not load cleanly.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
        Try once more. If it keeps happening, the contact link still works.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft"
        >
          Try again
        </button>
        <a
          href="mailto:bkramer@cars.com"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-surface px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft"
        >
          Email Brian
        </a>
      </div>
    </section>
  );
}
