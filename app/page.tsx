import Link from 'next/link';
import { HeroGlassPanel } from '@/components/HeroGlassPanel';
import { GlassCard } from '@/components/GlassCard';
import { LinkButton } from '@/components/Button';
import { pressMentions } from '@/content/press';

interface HomePageProps {
  searchParams?: { waitlist?: string };
}

export default function HomePage({ searchParams }: HomePageProps) {
  const waitlistStatus = searchParams?.waitlist;

  return (
    <>
      <section className="container-page pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="animate-fade-up space-y-7">
            <p className="eyebrow">EVP, Cars Commerce · Naples, FL</p>
            <h1 className="text-display-lg font-semibold text-ink">
              Dealer growth, earned through trust.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-ink-muted md:text-xl">
              27 years in automotive retail — 19 as a General Manager, now leading dealer growth at
              Cars Commerce. I write, teach, and build for operators who treat trust as the moat.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <LinkButton href="/writing" variant="primary">
                Read the essays
              </LinkButton>
              <LinkButton href="/podcast" variant="subtle">
                Listen to 61 appearances
              </LinkButton>
            </div>
          </div>

          <div className="animate-fade-in">
            <HeroGlassPanel />
          </div>
        </div>
      </section>

      <section className="container-page pb-24">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Focus</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              Where I spend the reps.
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <GlassCard as="article" className="p-8">
            <p className="eyebrow text-accent">01 · Acquisition</p>
            <h3 className="mt-3 text-xl font-semibold text-ink">Used-vehicle sourcing</h3>
            <p className="mt-3 text-base leading-relaxed text-ink-muted">
              Service-drive first, auction last. The economics of the acquisition funnel decide the
              store, not the sales floor.
            </p>
          </GlassCard>
          <GlassCard as="article" className="p-8">
            <p className="eyebrow text-accent">02 · Trust</p>
            <h3 className="mt-3 text-xl font-semibold text-ink">Trust as an operating system</h3>
            <p className="mt-3 text-base leading-relaxed text-ink-muted">
              Bad reviews aren't a marketing problem — they're a Quality Score tax and a CPL
              premium. Trust compounds; the lack of it compounds faster.
            </p>
          </GlassCard>
          <GlassCard as="article" className="p-8">
            <p className="eyebrow text-accent">03 · Digital transformation</p>
            <h3 className="mt-3 text-xl font-semibold text-ink">Paperless, and beyond</h3>
            <p className="mt-3 text-base leading-relaxed text-ink-muted">
              Led the first end-to-end paperless automotive transaction in 2020. Now working on
              what comes after: AI-native retail.
            </p>
          </GlassCard>
        </div>
      </section>

      <section className="bg-bg-alt py-24 md:py-32">
        <div className="container-page grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="eyebrow">A book · Coming 2026</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              The Best End User
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
              A field manual for dealers who want to earn the last customer, not just the next one.
              Built from two decades of GM reps, appraisal spreadsheets, and the trust math that
              actually moves a store.
            </p>
            {waitlistStatus === '1' && (
              <p className="mt-8 rounded-2xl border border-accent/30 bg-accent-soft px-5 py-4 text-sm text-ink">
                You&apos;re on the list. One email when it ships.
              </p>
            )}
            {waitlistStatus === 'error' && (
              <p className="mt-8 rounded-2xl border border-line bg-surface-muted px-5 py-4 text-sm text-ink-muted">
                Something went wrong — try again or email{' '}
                <a href="mailto:bkramer@cars.com" className="text-accent underline">
                  bkramer@cars.com
                </a>
                .
              </p>
            )}
            <form
              action="/api/waitlist"
              method="post"
              className="mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="waitlist-email" className="sr-only">
                Email
              </label>
              <input
                id="waitlist-email"
                name="email"
                type="email"
                required
                placeholder="you@dealership.com"
                className="flex-1 rounded-full border border-line bg-surface px-5 py-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent-soft"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft"
              >
                Join the waitlist
              </button>
            </form>
            <p className="mt-3 text-xs text-ink-faint">
              One email when it ships. No newsletter, no spam.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-sm">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-ink to-accent-hover shadow-glass-lift">
                <div className="flex h-full flex-col justify-between p-8 text-white">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">
                    Brian Kramer
                  </p>
                  <div>
                    <p className="font-display text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl">
                      The Best End User
                    </p>
                    <p className="mt-3 text-sm text-white/70">
                      How great dealerships earn the last customer.
                    </p>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="h-px w-16 bg-white/40" />
                    <p className="text-[11px] uppercase tracking-widest text-white/60">2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-24">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Writing</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              Essays from the floor.
            </h2>
          </div>
          <Link
            href="/writing"
            className="hidden text-sm font-medium text-accent hover:text-accent-hover md:inline"
          >
            All essays →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FeaturedEssay
            slug="ai-search-trust"
            eyebrow="AI search"
            title="Why AI can't cite your VDP — and what it's costing you"
            dek="Structured data, canonical stability, and the invisible tax dealers pay when ChatGPT and Perplexity skip their inventory."
            minutes={7}
          />
          <FeaturedEssay
            slug="service-drive-acquisition"
            eyebrow="Acquisition"
            title="Service drive is a search problem, not a sales problem"
            dek="Why the best acquisition programs look like SREs at work, not appraisers with clipboards."
            minutes={6}
          />
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link href="/writing" className="text-sm font-medium text-accent">
            All essays →
          </Link>
        </div>
      </section>

      <section className="border-y border-line bg-surface-muted py-12">
        <div className="container-page">
          <p className="eyebrow text-center">Featured in</p>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-ink-muted">
            {pressMentions.map((p) => (
              <li key={p.publication} className="whitespace-nowrap">
                {p.publication}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function FeaturedEssay({
  slug,
  eyebrow,
  title,
  dek,
  minutes,
}: {
  slug: string;
  eyebrow: string;
  title: string;
  dek: string;
  minutes: number;
}) {
  return (
    <Link
      href={`/writing/${slug}`}
      className="group block rounded-2xl border border-line bg-surface/70 p-8 shadow-glass backdrop-blur-xl transition-all duration-200 hover:border-line-strong hover:shadow-glass-lift"
    >
      <p className="eyebrow text-accent">{eyebrow}</p>
      <h3 className="mt-3 text-xl font-semibold leading-snug text-ink md:text-2xl">
        {title}
      </h3>
      <p className="mt-3 text-base leading-relaxed text-ink-muted">{dek}</p>
      <div className="mt-6 flex items-center justify-between text-xs text-ink-faint">
        <span>{minutes} min read</span>
        <span className="text-accent transition-transform group-hover:translate-x-1">→</span>
      </div>
    </Link>
  );
}
