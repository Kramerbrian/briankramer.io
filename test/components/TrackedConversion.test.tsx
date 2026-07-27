import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TrackedAnchor, TrackedForm } from '@/components/TrackedConversion';
import { trackConversion } from '@/lib/analytics';

vi.mock('@/lib/analytics', () => ({
  trackConversion: vi.fn(),
}));

const originalLocation = window.location;

function FormFixture({
  onSubmit,
  successConversion = {
    name: 'waitlist_submit' as const,
    props: { source: 'homepage' },
  },
}: {
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  successConversion?:
    | { name: 'waitlist_submit'; props: { source: string } }
    | { name: 'contact_submit'; topicFromField: string };
}) {
  return (
    <TrackedForm
      successConversion={successConversion}
      pendingLabel="Joining the waitlist..."
      action="/api/waitlist"
      method="post"
      onSubmit={onSubmit}
    >
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="topic">Topic</label>
      <select id="topic" name="topic" defaultValue="Speaking">
        <option>Speaking</option>
        <option>Press</option>
      </select>
      <button type="submit">Join the waitlist</button>
    </TrackedForm>
  );
}

describe('TrackedForm', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  it('lets native required/email validation block invalid submits', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    render(<FormFixture />);

    await user.click(screen.getByRole('button', { name: /join the waitlist/i }));

    expect(screen.getByLabelText(/^email$/i)).toBeInvalid();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(trackConversion).not.toHaveBeenCalled();
  });

  it('tracks waitlist_submit only after a successful POST redirect', async () => {
    const user = userEvent.setup();
    const assign = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, assign, origin: 'http://localhost' },
    });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        headers: { get: (name: string) => (name === 'Location' ? '/?waitlist=1' : null) },
      }),
    );

    render(<FormFixture />);

    await user.type(screen.getByLabelText(/^email$/i), 'dealer@example.com');
    await user.click(screen.getByRole('button', { name: /join the waitlist/i }));

    await waitFor(() => {
      expect(trackConversion).toHaveBeenCalledWith({
        name: 'waitlist_submit',
        props: { source: 'homepage' },
      });
    });
    expect(assign).toHaveBeenCalledWith('http://localhost/?waitlist=1');
    expect(document.querySelector('form')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('Joining the waitlist...');
  });

  it('does not track when the POST redirects to an error status', async () => {
    const user = userEvent.setup();
    const assign = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, assign, origin: 'http://localhost' },
    });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        headers: { get: (name: string) => (name === 'Location' ? '/?waitlist=error' : null) },
      }),
    );

    render(<FormFixture />);
    await user.type(screen.getByLabelText(/^email$/i), 'dealer@example.com');
    await user.click(screen.getByRole('button', { name: /join the waitlist/i }));

    await waitFor(() => {
      expect(assign).toHaveBeenCalled();
    });
    expect(trackConversion).not.toHaveBeenCalled();
  });

  it('tracks contact_submit with the selected topic after success', async () => {
    const user = userEvent.setup();
    const assign = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, assign, origin: 'http://localhost' },
    });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        headers: { get: (name: string) => (name === 'Location' ? '/contact?sent=1' : null) },
      }),
    );

    render(
      <FormFixture
        successConversion={{ name: 'contact_submit', topicFromField: 'topic' }}
      />,
    );
    await user.type(screen.getByLabelText(/^email$/i), 'dealer@example.com');
    await user.selectOptions(screen.getByLabelText(/topic/i), 'Press');
    await user.click(screen.getByRole('button', { name: /join the waitlist/i }));

    await waitFor(() => {
      expect(trackConversion).toHaveBeenCalledWith({
        name: 'contact_submit',
        props: { topic: 'Press' },
      });
    });
  });

  it('prevents duplicate submits once pending', async () => {
    const user = userEvent.setup();
    let resolveFetch: ((value: unknown) => void) | undefined;
    const fetchMock = vi.fn(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        }),
    );
    vi.stubGlobal('fetch', fetchMock);
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, assign: vi.fn(), origin: 'http://localhost' },
    });

    render(<FormFixture />);
    await user.type(screen.getByLabelText(/^email$/i), 'dealer@example.com');
    const button = screen.getByRole('button', { name: /join the waitlist/i });
    await user.click(button);
    await user.click(button);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    resolveFetch?.({
      ok: false,
      headers: { get: () => '/?waitlist=1' },
    });
    await waitFor(() => {
      expect(trackConversion).toHaveBeenCalledTimes(1);
    });
  });
});

describe('TrackedAnchor', () => {
  it('tracks newsletter_subscribe_click without blocking navigation', async () => {
    const user = userEvent.setup();
    render(
      <TrackedAnchor
        href="https://www.linkedin.com/example"
        conversion={{
          name: 'newsletter_subscribe_click',
          props: { source: 'newsletter_page' },
        }}
      >
        Subscribe on LinkedIn
      </TrackedAnchor>,
    );

    await user.click(screen.getByRole('link', { name: /subscribe on linkedin/i }));

    expect(trackConversion).toHaveBeenCalledWith({
      name: 'newsletter_subscribe_click',
      props: {
        source: 'newsletter_page',
        destination: 'https://www.linkedin.com/example',
      },
    });
  });
});
