'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Logo } from './Logo';

const links = [
  { href: '/writing', label: 'Writing' },
  { href: '/newsletter', label: 'Newsletter' },
  { href: '/playbook', label: 'Playbook' },
  { href: '/podcast', label: 'Podcast' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const linkBase =
  'rounded-full px-3 py-1.5 text-sm text-ink-muted transition-colors hover:text-ink hover:bg-surface-muted focus-visible:text-ink focus-visible:bg-surface-muted';

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // While open: Escape to close, lock body scroll, move focus into the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>('a')?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/75 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between">
        <Logo />

        {/* Desktop nav — hidden below md */}
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex md:gap-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={linkBase}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile trigger — hidden at md+ */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft md:hidden"
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <>
          <button
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-x-0 bottom-0 top-16 z-40 bg-ink/10 md:hidden"
          />
          <div
            id="mobile-nav"
            ref={panelRef}
            className="absolute inset-x-0 top-16 z-50 border-b border-line bg-bg md:hidden"
          >
            <nav aria-label="Primary mobile" className="container-page flex flex-col py-2">
              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={
                      'flex min-h-[52px] items-center border-b border-line py-3 text-base last:border-b-0 ' +
                      (active ? 'font-semibold text-accent' : 'text-ink')
                    }
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
