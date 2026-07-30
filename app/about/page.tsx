import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { TrackedAnchor } from '@/components/TrackedConversion';
import { credentials, pressMentions } from '@/content/press';
import { siteConfig } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Brian Kramer is EVP of Dealer Growth & Success at Cars Commerce, with two decades as a General Manager across import, domestic, and luxury stores in Ohio and Florida.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <section className="container-page pt-16 pb-16 md:pt-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="eyebrow">About</p>
            <h1 className="mt-3 text-display font-semibold text-ink">
              Two decades on the floor. One belief: dealers earn.
            </h1>
            <div className="prose mt-8 max-w-none">
              <p>
                I&apos;m EVP, Dealer Growth &amp; Success at Cars Commerce, where I lead the work of
                helping dealers grow through better tools, better data, and better trust with the
                people who buy from them.
              </p>
              <p>
                Before Cars Commerce, I spent two decades as a General Manager — publicly traded,
                privately held, import, domestic, and luxury stores across Ohio and Florida. Most
                recently as GM of Germain Toyota of Naples and Germain Lincoln of Naples, where store
                volume in those years was reported above 7,500 retail vehicles annually.
              </p>
              <p>
                I care about the parts of retail that don&apos;t photograph well: appraisal discipline,
                service-drive acquisition, the honest math behind a used-car deal, and the daily
                operator reps that turn a store from a lot into an institution.
              </p>
              <p>
                I write about it because I want more of it to exist.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border border-line shadow-glass">
              <Image
                src="/images/brian-portrait-blue.jpg"
                alt="Portrait of Brian Kramer"
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <p className="eyebrow">Selected recognition</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          On the record.
        </h2>
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {credentials.map((c) => (
            <li key={c.label} className="flex items-baseline justify-between gap-6 py-5">
              <div>
                <p className="text-lg font-medium text-ink">{c.label}</p>
                {c.detail && <p className="mt-1 text-sm text-ink-muted">{c.detail}</p>}
              </div>
              {c.year && (
                <p className="shrink-0 text-sm tabular-nums text-ink-faint">{c.year}</p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page py-16">
        <p className="eyebrow">Featured in</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          Where the work has shown up.
        </h2>
        <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3">
          {pressMentions.map((p) => (
            <li key={p.publication} className="rounded-xl border border-line bg-surface/70 p-5 backdrop-blur-xl">
              <p className="font-medium text-ink">{p.publication}</p>
              {p.note && <p className="mt-1 text-sm text-ink-muted">{p.note}</p>}
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page py-16">
        <div className="rounded-3xl border border-line bg-bg-alt p-10 md:p-14">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <p className="eyebrow">Get in touch</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                Speaking, consulting, or just want to compare notes.
              </h2>
            </div>
            <div className="flex md:justify-end">
              <TrackedAnchor
                href={`mailto:${siteConfig.author.email}`}
                conversion={{ name: 'contact_mailto_click', props: { source: 'about_page' } }}
                className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft"
              >
                {siteConfig.author.email}
              </TrackedAnchor>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page pb-24">
        <p className="eyebrow">Keep reading</p>
        <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-base">
          <li>
            <Link
              href="/writing"
              className="flex min-h-[44px] items-center font-medium text-accent hover:text-accent-hover"
            >
              Read the essays →
            </Link>
          </li>
          <li>
            <Link
              href="/playbook"
              className="flex min-h-[44px] items-center font-medium text-accent hover:text-accent-hover"
            >
              Open the playbook →
            </Link>
          </li>
          <li>
            <Link
              href="/podcast"
              className="flex min-h-[44px] items-center font-medium text-accent hover:text-accent-hover"
            >
              Listen to the podcast →
            </Link>
          </li>
          <li>
            <Link
              href="/newsletter"
              className="flex min-h-[44px] items-center font-medium text-accent hover:text-accent-hover"
            >
              Subscribe to the newsletter →
            </Link>
          </li>
        </ul>
      </section>
    </>
  );
}
