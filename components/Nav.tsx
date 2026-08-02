'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Logo } from './Logo';

// Newsletter intentionally excluded from primary nav: it's the same
// content type as Writing (essay-adjacent reading) presented as a
// separate destination confuses first-time visitors about whether the
// two are duplicates. The page still exists at /newsletter with its own
// SEO record and conversion tracking — it's linked from within /writing
// instead of competing for a top-level nav slot. Keeps nav at 6 items,
// closer to Hick's Law's practical working-memory ceiling.
const links = [
  { href: '/writing', label: 'Writing' },
  { href: '/playbook', label: 'Playbook' },
  { href: '/speaking', label: 'Speaking' },
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

  // While open: Escape to close, lock body scroll, move focus into the panel,
  // and mark the page's main content inert so it can't be tabbed into or hit
  // by a pointer while the drawer sits on top of it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const main = document.getElementById('main');
    main?.setAttribute('inert', '');
    main?.setAttribute('aria-hidden', 'true');
    panelRef.current?.querySelector<HTMLElement>('a')?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      main?.removeAttribute('inert');
      main?.removeAttribute('aria-hidden');
    };
  }, [open]);

  return (
    <>
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
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink-faint bg-surface text-ink transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent md:hidden"
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
      </header>

      {/* Mobile drawer — rendered as a sibling of <header>, not inside it.
          <header> has backdrop-blur-xl, and backdrop-filter on an ancestor
          creates a new containing block for fixed-position descendants, which
          collapsed the scrim's fixed top/bottom inset to 0 height (it was
          resolving against the 64px-tall header, not the viewport). Keeping
          the drawer outside <header> lets `fixed` resolve against the
          viewport as intended. */}
      {open && (
        <>
          <button
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-16 z-40 bg-ink/30 md:hidden"
          />
          <div
            id="mobile-nav"
            ref={panelRef}
            className="fixed inset-x-0 top-16 z-50 border-b border-line bg-bg md:hidden"
          >
            <nav aria-label="Primary mobile" className="container-page flex flex-col py-2">
              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => setOpen(false)}
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
    </>
  );
}
