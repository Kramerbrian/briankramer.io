import type { Metadata } from 'next';
import { TrackedAnchor, TrackedForm } from '@/components/TrackedConversion';
import { siteConfig } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Reach Brian Kramer for speaking, consulting, book, or press.',
  alternates: { canonical: '/contact' },
};

const topics = ['Speaking', 'Consulting', 'The Best End User', 'Press', 'Other'];

interface ContactPageProps {
  searchParams?: Promise<{ sent?: string }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const sent = (await searchParams)?.sent;

  return (
    <section className="container-page pt-16 pb-24 md:pt-24">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="eyebrow">Contact</p>
          <h1 className="mt-3 text-display font-semibold text-ink">Let&apos;s talk.</h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-muted">
            Speaking inquiries, consulting, book, or press. If you&apos;re a dealer, an OEM, or a
            builder in this space — write.
          </p>

          <dl className="mt-10 space-y-6">
            <div>
              <dt className="eyebrow">Email</dt>
              <dd className="mt-1">
                <TrackedAnchor
                  href={`mailto:${siteConfig.author.email}`}
                  conversion={{ name: 'contact_mailto_click', props: { source: 'contact_page' } }}
                  className="inline-flex min-h-[44px] items-center text-lg font-medium text-ink underline underline-offset-4 decoration-line hover:decoration-accent"
                >
                  {siteConfig.author.email}
                </TrackedAnchor>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Elsewhere</dt>
              <dd className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-muted">
                <a
                  href={siteConfig.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[44px] items-center hover:text-ink"
                >
                  LinkedIn
                </a>
                <a
                  href={siteConfig.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[44px] items-center hover:text-ink"
                >
                  YouTube
                </a>
                <a
                  href={siteConfig.socials.linktree}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[44px] items-center hover:text-ink"
                >
                  Linktree
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Based in</dt>
              <dd className="mt-1 text-lg text-ink">Naples, Florida</dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-7">
          {sent === '1' && (
            <p className="mb-6 rounded-2xl border border-accent/30 bg-accent-soft px-5 py-4 text-sm text-ink">
              Message sent. I read everything — expect a reply within a few days.
            </p>
          )}
          {sent === 'error' && (
            <p className="mb-6 rounded-2xl border border-line bg-surface-muted px-5 py-4 text-sm text-ink-muted">
              Something went wrong — try again or email{' '}
              <TrackedAnchor
                href="mailto:bkramer@cars.com"
                conversion={{ name: 'contact_mailto_click', props: { source: 'contact_page' } }}
                className="text-accent underline"
              >
                bkramer@cars.com
              </TrackedAnchor>
              .
            </p>
          )}
          <TrackedForm
            action="/api/contact"
            method="post"
            successConversion={{
              name: 'contact_submit',
              topicFromField: 'topic',
            }}
            pendingLabel="Sending your message..."
            className="group/form rounded-3xl border border-line bg-surface/70 p-8 shadow-glass backdrop-blur-xl md:p-10"
          >
            <div className="pointer-events-none absolute -left-[100vw] h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="contact-company">Company</label>
              <input id="contact-company" name="company" tabIndex={-1} autoComplete="off" />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-ink">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className="w-full rounded-xl border border-ink-faint bg-surface px-4 py-3 text-base text-ink placeholder:text-ink-faint focus:outline-none focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent-soft sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-xl border border-ink-faint bg-surface px-4 py-3 text-base text-ink placeholder:text-ink-faint focus:outline-none focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent-soft sm:text-sm"
                />
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor="topic" className="mb-2 block text-sm font-medium text-ink">
                What&apos;s this about?
              </label>
              <select
                id="topic"
                name="topic"
                defaultValue="Speaking"
                className="w-full rounded-xl border border-ink-faint bg-surface px-4 py-3 text-base text-ink focus:outline-none focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent-soft sm:text-sm"
              >
                {topics.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="mt-6">
              <label htmlFor="message" className="mb-2 block text-sm font-medium text-ink">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                className="w-full rounded-xl border border-ink-faint bg-surface px-4 py-3 text-base text-ink placeholder:text-ink-faint focus:outline-none focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent-soft sm:text-sm"
              />
            </div>
            <div className="mt-8 flex items-center justify-between gap-4">
              <p className="text-xs text-ink-faint">
                I read everything. Response within a few days.
              </p>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft group-data-[submitting=true]/form:pointer-events-none group-data-[submitting=true]/form:opacity-70"
              >
                <span className="group-data-[submitting=true]/form:hidden">Send</span>
                <span className="hidden group-data-[submitting=true]/form:inline">Sending...</span>
              </button>
            </div>
          </TrackedForm>
        </div>
      </div>
    </section>
  );
}
