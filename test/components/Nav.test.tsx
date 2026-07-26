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
    pathname = '/newsletter';
    const user = userEvent.setup();
    render(<Nav />);

    await user.click(screen.getByRole('button', { name: /open menu/i }));

    const mobileNav = screen.getByRole('navigation', { name: /primary mobile/i });
    expect(within(mobileNav).getByRole('link', { name: 'Newsletter' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
});
