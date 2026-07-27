import Link from 'next/link';
import { siteConfig } from '@/lib/utils';

const socialLinks = [
  { href: siteConfig.socials.linkedin, label: 'LinkedIn' },
  { href: siteConfig.socials.youtube, label: 'YouTube' },
  { href: siteConfig.socials.instagram, label: 'Instagram' },
  { href: siteConfig.socials.tiktok, label: 'TikTok' },
  { href: siteConfig.socials.linktree, label: 'Linktree' },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-32 border-t border-line bg-bg">
      <div className="container-page py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <p className="font-display text-lg font-semibold tracking-tight text-ink">
              Brian Kramer
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              {siteConfig.author.role}
            </p>
            <p className="mt-1 text-sm text-ink-faint">
              {siteConfig.author.location}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <p className="eyebrow">Elsewhere</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-muted">
              {socialLinks.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[44px] items-center py-3 transition-colors hover:text-ink"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/playlist"
                  className="flex min-h-[44px] items-center py-3 transition-colors hover:text-ink"
                >
                  Playlist
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="flex min-h-[44px] items-center py-3 transition-colors hover:text-ink"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="hairline mt-12" />
        <div className="mt-6 flex flex-col gap-2 text-xs text-ink-faint md:flex-row md:items-center md:justify-between">
          <p>© {year} Brian Kramer. All rights reserved.</p>
          <p>Naples, FL · Built with Next.js on Vercel.</p>
        </div>
      </div>
    </footer>
  );
}
