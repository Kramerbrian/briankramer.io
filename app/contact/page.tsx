import type { Metadata } from 'next';
import { siteConfig } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Reach Brian Kramer for speaking, consulting, book, or press.',
};

const topics = ['Speaking', 'Consulting', 'The Best End User', 'Press', 'Other'];

interface ContactPageProps {
  searchParams?: { sent?: string };
}

export default function ContactPage({ searchParams }: ContactPageProps) {
  const sent = searchParams?.sent;

  return (
    <section className="container-page pt-16 pb-24 md:pt-24">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="eyebrow">Contact</p>
          <h1 className="mt-3 text-display font-semibold text-ink">Let's talk.</h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-muted">
            Speaking inquiries, consulting, book, or press. If you're a dealer, an OEM, or a
            builder in this space — write.
          </p>

          <dl className="mt-10 space-y-6">
            <div>
              <dt className="eyebrow">Email</dt>
              <dd className="mt-1">
                <a
                  href={`mailto:${siteConfig.author.email}`}
                  className="text-lg font-medium text-ink underline underline-offset-4 decoration-line hover:decoration-accent"
                >
                  {siteConfig.author.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Elsewhere</dt>
              <dd className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-muted">
                <a href={siteConfig.socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-ink">LinkedIn</a>
                <a href={siteConfig.socials.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-ink">YouTube</a>
                <a href={siteConfig.socials.linktree} target="_blank" rel="noopener noreferrer" className="hover:text-ink">Linktree</a>
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
              <a href="mailto:bkramer@cars.com" className="text-accent underline">
                bkramer@cars.com
              </a>
              .
            </p>
          )}
          <form
            action="/api/contact"
            method="post"
            className="rounded-3xl border border-line bg-surface/70 p-8 shadow-glass backdrop-blur-xl md:p-10"
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-ink">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent-soft"
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
                  className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent-soft"
                />
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor="topic" className="mb-2 block text-sm font-medium text-ink">
                What's this about?
              </label>
              <select
                id="topic"
                name="topic"
                defaultValue="Speaking"
                className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink focus:outline-none focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent-soft"
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
                className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent-soft"
              />
            </div>
            <div className="mt-8 flex items-center justify-between gap-4">
              <p className="text-xs text-ink-faint">
                I read everything. Response within a few days.
              </p>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
