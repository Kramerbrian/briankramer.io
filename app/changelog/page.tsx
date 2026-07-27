import type { Metadata } from 'next';
import { GlassCard } from '@/components/GlassCard';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Changelog — Brian Kramer',
  description: 'Site updates, accessibility fixes, and build/governance changes for briankramer.io.',
  alternates: { canonical: '/changelog' },
};

interface ChangelogEntry {
  publishDate: string;
  title: string;
  summary: string;
  items: string[];
  prUrls?: { label: string; url: string }[];
}

const entries: ChangelogEntry[] = [
  {
    publishDate: '2026-07-27',
    title: 'Contact page and homepage tap targets',
    summary:
      'A follow-up mobile sweep found two more spots with the same undersized tap-target pattern, missed by the earlier pass.',
    items: [
      'The mobile-only "All essays" link on the homepage was still a ~19px hit box.',
      'The Contact page has its own separate email and social links (LinkedIn, YouTube, Linktree) that were not covered by the earlier footer fix — email link was ~24px tall, social links ~20px.',
      'All expanded to a 44px minimum tap target using the same flex layout pattern as the earlier fixes.',
    ],
  },
  {
    publishDate: '2026-07-27',
    title: 'Newsletter inline-link tap targets',
    summary:
      'Expanded the "Read on LinkedIn" and "Related on this site" links on each newsletter edition to a full 44px tap target.',
    items: [
      'Both links were bare inline text with no vertical padding (roughly 20px tall) — hard to tap accurately on mobile.',
      'Same fix pattern as the footer/logo update below: flex layout with a 44px minimum height, no change to visible text size.',
    ],
    prUrls: [{ label: 'PR #16', url: 'https://github.com/Kramerbrian/briankramer.io/pull/16' }],
  },
  {
    publishDate: '2026-07-27',
    title: 'Branch protection on main',
    summary:
      'main now requires the site’s CI check (typecheck, lint, build, tests, and content governance) to pass before any merge, including for admins.',
    items: [
      'Prevents a repeat of the two governance-script bugs below from landing on main unnoticed.',
      'Force-pushes and branch deletion are also blocked on main.',
    ],
  },
  {
    publishDate: '2026-07-27',
    title: 'Footer and logo tap targets, plus two CI governance fixes',
    summary:
      'Fixed real mobile tap-target issues found in a 375×812 layout sweep, and two unrelated pre-existing bugs in the content-governance CI checks that surfaced along the way.',
    items: [
      'Footer social links, Playlist, and Contact links expanded from a ~19px hit box to a full 44px target.',
      'Header logo expanded from a ~28px tap target to 44px, matching the nav menu button’s existing sizing.',
      'Fixed a content-governance false positive where a test fixture URL (a placeholder LinkedIn link used only in tests) was mistaken for a real placeholder link left in public content.',
      'Fixed a second false positive where the public-claims checker read an internal code comment (JSDoc) as public-facing copy and flagged an absolute-sounding word in that comment as a risky claim.',
      'Verified the governance-script fixes don’t weaken real detection — all existing test fixtures for both checks still pass exactly as before.',
    ],
    prUrls: [
      { label: 'PR #14', url: 'https://github.com/Kramerbrian/briankramer.io/pull/14' },
      { label: 'PR #15', url: 'https://github.com/Kramerbrian/briankramer.io/pull/15' },
    ],
  },
];

export default function ChangelogPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Changelog',
    description: 'Site updates, accessibility fixes, and build/governance changes for briankramer.io.',
    url: 'https://www.briankramer.io/changelog',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Brian Kramer',
      url: 'https://www.briankramer.io',
    },
  };

  return (
    <section className="container-page pt-16 pb-24 md:pt-24">
      <JsonLd id="schema-changelog" data={schema} />

      <p className="eyebrow">Changelog</p>
      <h1 className="mt-3 text-display font-semibold text-ink">Site updates</h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
        Notable fixes and changes to this site — accessibility, build tooling, and content
        governance. Not a full commit log.
      </p>

      <ul className="mt-14 space-y-4">
        {entries.map((entry) => (
          <li key={`${entry.publishDate}-${entry.title}`}>
            <GlassCard as="article" className="p-8 md:p-10">
              <time dateTime={entry.publishDate} className="text-xs text-ink-faint">
                {new Date(`${entry.publishDate}T00:00:00Z`).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  timeZone: 'UTC',
                })}
              </time>
              <h2 className="mt-3 text-xl font-semibold leading-snug text-ink md:text-2xl">
                {entry.title}
              </h2>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-muted">
                {entry.summary}
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
                {entry.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {entry.prUrls && entry.prUrls.length > 0 ? (
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  {entry.prUrls.map((pr) => (
                    <a
                      key={pr.url}
                      href={pr.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-[44px] items-center font-medium text-accent hover:text-accent-hover"
                    >
                      {pr.label} →
                    </a>
                  ))}
                </div>
              ) : null}
            </GlassCard>
          </li>
        ))}
      </ul>
    </section>
  );
}
