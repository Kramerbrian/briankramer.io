import Link from 'next/link';
import { Logo } from './Logo';

const links = [
  { href: '/writing', label: 'Writing' },
  { href: '/playbook', label: 'Playbook' },
  { href: '/podcast', label: 'Podcast' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/75 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between">
        <Logo />
        <nav aria-label="Primary" className="flex items-center gap-1 md:gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-sm text-ink-muted transition-colors hover:text-ink hover:bg-surface-muted focus-visible:text-ink focus-visible:bg-surface-muted"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
