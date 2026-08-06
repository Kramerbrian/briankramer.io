import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbListJsonLd } from '@/lib/seo';
import { siteConfig } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Links',
  description:
    'The writing, newsletter, podcast, playbook, and other places to find Brian Kramer — in one place.',
  alternates: { canonical: '/links' },
};

interface LinkRow {
  label: string;
  description: string;
  href: string;
  external?: boolean;
}

const rows: LinkRow[] = [
  { label: 'Writing', description: 'Essays on dealer growth and AI search visibility', href: '/writing' },
  { label: 'Newsletter', description: 'The Best End User, in your inbox', href: '/newsletter' },
  { label: 'Playbook', description: 'Operating playbooks for dealer teams', href: '/playbook' },
  { label: 'Podcast', description: 'Conversations on automotive retail', href: '/podcast' },
  { label: 'Speaking', description: 'Book Brian for a talk or panel', href: '/speaking' },
  { label: 'Playlist', description: 'The working playlist', href: '/playlist' },
  { label: 'About', description: 'Background and credentials', href: '/about' },
  { label: 'Contact', description: 'Speaking, consulting, book, or press', href: '/contact' },
  {
    label: 'LinkedIn',
    description: 'Connect professionally',
    href: siteConfig.socials.linkedin,
    external: true,
  },
];

const rowClasses =
  'flex min-h-[64px] w-full flex-col justify-center rounded-2xl border border-line bg-surface/70 px-6 py-3 text-left backdrop-blur-xl transition-colors hover:border-line-strong hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft';

export default function LinksPage() {
  const breadcrumbSchema = breadcrumbListJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Links', url: '/links' },
  ]);

  return (
    <>
      <JsonLd id="schema-breadcrumb-links" data={breadcrumbSchema} />
      <section className="container-page pt-16 pb-24 md:pt-24">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border border-line shadow-glass">
            <Image
              src="/images/brian-portrait-blue.jpg"
              alt="Portrait of Brian Kramer"
              fill
              sizes="96px"
              className="object-cover"
              priority
            />
          </div>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-ink">Brian Kramer</h1>
          <p className="mt-2 text-sm text-ink-muted">{siteConfig.author.role}</p>
          <p className="mt-1 text-sm text-ink-faint">{siteConfig.author.location}</p>

          <ul className="mt-10 flex w-full flex-col gap-3">
            {rows.map((row) => (
              <li key={row.href}>
                {row.external ? (
                  <a href={row.href} target="_blank" rel="noopener noreferrer" className={rowClasses}>
                    <span className="text-base font-medium text-ink">{row.label}</span>
                    <span className="mt-0.5 text-sm text-ink-muted">{row.description}</span>
                  </a>
                ) : (
                  <Link href={row.href} className={rowClasses}>
                    <span className="text-base font-medium text-ink">{row.label}</span>
                    <span className="mt-0.5 text-sm text-ink-muted">{row.description}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
