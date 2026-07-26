import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col justify-center py-24">
      <p className="eyebrow text-accent">404</p>
      <h1 className="mt-3 max-w-3xl text-display font-semibold text-ink">That page is not on the lot.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
        The page may have moved, or it may still be in the unpublished operating notes.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft"
        >
          Home
        </Link>
        <Link
          href="/writing"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-surface px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft"
        >
          Writing
        </Link>
      </div>
    </section>
  );
}
