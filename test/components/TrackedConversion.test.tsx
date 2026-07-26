import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TrackedForm } from '@/components/TrackedConversion';
import { trackConversion } from '@/lib/analytics';

vi.mock('@/lib/analytics', () => ({
  trackConversion: vi.fn(),
}));

function FormFixture({ onSubmit = vi.fn() }: { onSubmit?: React.FormEventHandler<HTMLFormElement> }) {
  return (
    <TrackedForm
      event="book_waitlist_submit"
      location="home_waitlist"
      pendingLabel="Joining the waitlist..."
      onSubmit={onSubmit}
    >
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" required />
      <button type="submit">Join the waitlist</button>
    </TrackedForm>
  );
}

describe('TrackedForm', () => {
  it('lets native required/email validation block invalid submits', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<FormFixture onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: /join the waitlist/i }));

    expect(screen.getByLabelText(/email/i)).toBeInvalid();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(trackConversion).not.toHaveBeenCalled();
  });

  it('sets a submitting state, announces it, and tracks valid submits', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault());
    render(<FormFixture onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'dealer@example.com');
    await user.click(screen.getByRole('button', { name: /join the waitlist/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(trackConversion).toHaveBeenCalledWith('book_waitlist_submit', {
      location: 'home_waitlist',
    });
    expect(document.querySelector('form')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('Joining the waitlist...');
  });

  it('prevents duplicate submits once pending', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault());
    render(<FormFixture onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'dealer@example.com');
    const button = screen.getByRole('button', { name: /join the waitlist/i });
    await user.click(button);
    await user.click(button);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(trackConversion).toHaveBeenCalledTimes(1);
  });
});
