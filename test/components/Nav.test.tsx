import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Nav } from '@/components/Nav';

let pathname = '/writing';

vi.mock('next/navigation', () => ({
  usePathname: () => pathname,
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={typeof href === 'string' ? href : String(href)} {...props}>
      {children}
    </a>
  ),
}));

describe('Nav', () => {
  it('opens and closes the mobile drawer from the trigger', async () => {
    const user = userEvent.setup();
    render(<Nav />);

    await user.click(screen.getByRole('button', { name: /open menu/i }));
    expect(screen.getByRole('navigation', { name: /primary mobile/i })).toBeInTheDocument();
    expect(document.body).toHaveStyle({ overflow: 'hidden' });

    await user.click(screen.getByRole('button', { name: /close menu/i }));
    expect(screen.queryByRole('navigation', { name: /primary mobile/i })).not.toBeInTheDocument();
    expect(document.body).not.toHaveStyle({ overflow: 'hidden' });
  });

  it('closes the mobile drawer with Escape', async () => {
    const user = userEvent.setup();
    render(<Nav />);

    await user.click(screen.getByRole('button', { name: /open menu/i }));
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('navigation', { name: /primary mobile/i })).not.toBeInTheDocument();
  });

  it('marks the active mobile route', async () => {
    // Newsletter intentionally removed from primary nav (see Nav.tsx comment):
    // it's the same content type as Writing and competed for a nav slot
    // without adding a distinct decision. /newsletter still exists as a real
    // page (linked from /writing and the homepage), so this test now checks
    // active-state against a route that remains in nav.
    pathname = '/playbook';
    const user = userEvent.setup();
    render(<Nav />);

    await user.click(screen.getByRole('button', { name: /open menu/i }));

    const mobileNav = screen.getByRole('navigation', { name: /primary mobile/i });
    expect(within(mobileNav).getByRole('link', { name: 'Playbook' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('makes #main inert and aria-hidden while the mobile drawer is open, and restores it on close', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Nav />
        <main id="main">
          <button type="button">Read the essays</button>
        </main>
      </>,
    );

    const main = document.getElementById('main')!;
    expect(main).not.toHaveAttribute('inert');
    expect(main).not.toHaveAttribute('aria-hidden');

    await user.click(screen.getByRole('button', { name: /open menu/i }));
    expect(main).toHaveAttribute('inert');
    expect(main).toHaveAttribute('aria-hidden', 'true');

    await user.click(screen.getByRole('button', { name: /close menu/i }));
    expect(main).not.toHaveAttribute('inert');
    expect(main).not.toHaveAttribute('aria-hidden');
  });

  it('renders a scrim that fills the viewport below the header so it can catch pointer events', async () => {
    const user = userEvent.setup();
    render(<Nav />);

    await user.click(screen.getByRole('button', { name: /open menu/i }));

    const scrim = document.querySelector('button[aria-hidden="true"]');
    expect(scrim).not.toBeNull();
    // Regression guard for the bug where the scrim was nested inside a
    // backdrop-blur <header>, giving it a new containing block and collapsing
    // its fixed top/bottom inset to 0 height. The scrim must be a sibling of
    // <header>, not a descendant, so `fixed` resolves against the viewport.
    expect(scrim!.closest('header')).toBeNull();
  });
});
