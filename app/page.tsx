import Link from 'next/link';
import type { Metadata } from 'next';
import { HeroGlassPanel } from '@/components/HeroGlassPanel';
import { GlassCard } from '@/components/GlassCard';
import { LinkButton } from '@/components/Button';
import { FormField } from '@/components/FormField';
import { TrackedAnchor, TrackedForm } from '@/components/TrackedConversion';
import { PullQuoteBand } from '@/components/PullQuoteBand';
import { pressMentions } from '@/content/press';
import { siteConfig } from '@/lib/utils';

export const metadata: Metadata = {
  title: { absolute: siteConfig.title },
  description: siteConfig.description,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <section className="container-page pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="animate-fade-up space-y-7">
            <p className="eyebrow">Automotive Retail Operator · Naples, FL</p>
            <h1 className="text-display-lg font-semibold text-ink">
              Dealer growth,{' '}
              <em className="font-serif font-normal italic text-ink">earned through trust.</em>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-ink-muted md:text-xl">
              Two decades as a dealership GM, now leading dealer growth at Cars Commerce.
              I write, teach, and build for operators who treat trust as an operating system.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <LinkButton href="/writing" variant="primary">
                Read the essays
              </LinkButton>
              <LinkButton href="/newsletter" variant="subtle">
                Read the newsletter
              </LinkButton>
            </div>
            <Link
              href="/about"
              className="inline-flex min-h-[44px] items-center text-sm font-medium text-ink-muted underline decoration-line underline-offset-4 hover:text-ink hover:decoration-accent"
            >
              More about Brian →
            </Link>
          </div>

          <div className="animate-fade-in">
            <HeroGlassPanel />
          </div>
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="hairline" />
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-10">
          <div>
            <p className="eyebrow">Clarity</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Say the true thing plainly, in the fewest words that carry it.
            </p>
          </div>
          <div>
            <p className="eyebrow">Trust</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Earned in small moments, spent by a single broken promise.
            </p>
          </div>
          <div>
            <p className="eyebrow">Truth</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              What the numbers say when the story wants to say something else.
            </p>
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
            <p className="eyebrow text-accent">Acquisition</p>
            <h3 className="mt-3 text-xl font-semibold text-ink">Used-vehicle sourcing</h3>
            <p className="mt-3 text-base leading-relaxed text-ink-muted">
              Service-drive sourcing before auction dependency. The economics of the acquisition
              funnel decide the store, not the sales floor.
            </p>
          </GlassCard>
          <GlassCard as="article" className="p-8">
            <p className="eyebrow text-accent">Reputation economics</p>
            <h3 className="mt-3 text-xl font-semibold text-ink">Reviews are paid media</h3>
            <p className="mt-3 text-base leading-relaxed text-ink-muted">
              Bad reviews aren&apos;t just a marketing problem; they can become a paid-media drag.
              Trust compounds; the lack of it compounds faster.
            </p>
          </GlassCard>
          <GlassCard as="article" className="p-8">
            <p className="eyebrow text-accent">Digital transformation</p>
            <h3 className="mt-3 text-xl font-semibold text-ink">Paperless, and beyond</h3>
            <p className="mt-3 text-base leading-relaxed text-ink-muted">
              Helped lead an early end-to-end paperless automotive transaction. Now working on what
              comes after: AI-native retail, structured data, and clearer operating systems.
            </p>
          </GlassCard>
        </div>
      </section>

      <PullQuoteBand quote="Trust is produced when message, process, evidence and outcome agree." />

      <section className="bg-bg-alt py-24 md:py-32">
        <div className="container-page grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="eyebrow">A book · In progress</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              The Best End User
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
              A field manual for dealers who want to earn the last customer, not just the next one.
              Built from GM reps, appraisal spreadsheets, and the trust math that actually moves a
              store.
            </p>
            {/*
             * No server-rendered success/error banner here: TrackedForm below
             * already renders successMessage/errorMessage client-side after a
             * followed redirect (see components/TrackedConversion.tsx), using
             * history.replaceState instead of a full navigation. A prior
             * version of this page also read `searchParams` here to render an
             * equivalent banner server-side — that forced this entire route
             * into Next's dynamic/streamed rendering path (visible in the
             * build output as `ƒ /`), which surfaced as a confirmed ~0.31-0.39
             * CLS regression: Next's automatic Suspense fallback for the
             * dynamic-API boundary is a small loading skeleton, and swapping
             * it for the full ~4,900px homepage in one synchronous DOM
             * mutation pushes the footer down by hundreds of pixels after
             * first paint. Removing the `searchParams` read lets this page
             * render synchronously with no streaming shell.
             */}
            <TrackedForm
              successConversion={{
                name: 'waitlist_submit',
                props: { source: 'homepage' },
              }}
              pendingLabel="Joining the waitlist..."
              successMessage="You're on the list. One email when it ships."
              errorMessage="Something went wrong — try again or email bkramer@cars.com."
              action="/api/waitlist"
              method="post"
              className="group/form mt-8 flex max-w-md flex-col gap-3 sm:flex-row sm:items-start"
            >
              <div className="pointer-events-none absolute -left-[100vw] h-px w-px overflow-hidden" aria-hidden="true">
                <label htmlFor="waitlist-company">Company</label>
                <input id="waitlist-company" name="company" tabIndex={-1} autoComplete="off" />
              </div>
              <FormField
                id="waitlist-email"
                label="Email"
                required
                className="flex-1"
                labelClassName="sr-only"
              >
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@dealership.com (required)"
                  className="w-full rounded-full border border-ink-faint bg-surface px-5 py-3 text-base text-ink placeholder:text-ink-faint focus:outline-none focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent-soft aria-[invalid=true]:border-red-600"
                />
              </FormField>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft group-data-[submitting=true]/form:pointer-events-none group-data-[submitting=true]/form:opacity-70 group-data-[result=success]/form:bg-accent-hover"
              >
                <span className="group-data-[submitting=true]/form:hidden group-data-[result=success]/form:hidden">
                  Join the waitlist
                </span>
                <span className="hidden group-data-[submitting=true]/form:inline">Joining...</span>
                <span className="hidden group-data-[result=success]/form:inline">Joined ✓</span>
              </button>
            </TrackedForm>
            <p className="mt-3 text-sm text-ink-faint">
              One email when it ships. No newsletter, no spam.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-sm">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-ink to-accent-hover shadow-glass-lift">
                <div className="flex h-full flex-col justify-between p-8 text-white">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
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
                    <p className="text-sm uppercase tracking-widest text-white/60">In progress</p>
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
            className="hidden min-h-[44px] items-center text-sm font-medium text-accent hover:text-accent-hover md:inline-flex"
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
            dek="Why strong acquisition programs look like SREs at work, not appraisers with clipboards."
            minutes={6}
          />
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/writing"
            className="inline-flex min-h-[44px] items-center text-sm font-medium text-accent"
          >
            All essays →
          </Link>
        </div>
      </section>

      <section className="container-page pb-24">
        <GlassCard as="article" className="p-8 md:p-10">
          <p className="eyebrow text-accent">Playbook</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            Operating tools you can run this week.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
            The operating doctrine turned into practical tools with clear owners, cadence, proof,
            and success measures. More publish as source material clears review.
          </p>
          <Link
            href="/playbook"
            className="mt-6 inline-flex min-h-[44px] items-center text-sm font-medium text-accent hover:text-accent-hover"
          >
            Open the playbook →
          </Link>
        </GlassCard>
      </section>

      <section className="border-y border-line bg-surface-muted py-12">
        <div className="container-page">
          <p className="eyebrow text-center">Featured in</p>
          <ul className="mt-6 grid grid-cols-1 gap-4 text-center text-sm text-ink-muted sm:grid-cols-2 lg:grid-cols-3">
            {pressMentions.map((p) => (
              <li key={p.publication} className="rounded-xl border border-line bg-surface/70 p-4">
                <p className="font-medium text-ink">{p.publication}</p>
                {p.note && <p className="mt-1 text-sm text-ink-faint">{p.note}</p>}
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
      <div className="mt-6 flex items-center justify-between text-sm text-ink-faint">
        <span>{minutes} min read</span>
        <span className="text-accent transition-transform group-hover:translate-x-1">→</span>
      </div>
    </Link>
  );
}
