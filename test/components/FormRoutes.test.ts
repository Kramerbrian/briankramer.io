import { afterEach, describe, expect, it, vi } from 'vitest';
import { POST as contactPost } from '@/app/api/contact/route';
import { POST as waitlistPost } from '@/app/api/waitlist/route';

const originalEnv = process.env;

function formRequest(path: string, fields: Record<string, string>) {
  const body = new URLSearchParams(fields);
  return new Request(`https://www.briankramer.io${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });
}

function expectRedirect(res: Response, location: string) {
  expect(res.status).toBe(303);
  expect(res.headers.get('location')).toBe(location);
}

describe('waitlist route', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
    process.env = originalEnv;
  });

  it('redirects valid signups to success when Supabase stores the email', async () => {
    process.env = {
      ...originalEnv,
      SUPABASE_URL: 'https://project.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: 'service-role-key',
      RESEND_API_KEY: '',
    };
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);

    const res = await waitlistPost(
      formRequest('/api/waitlist', { company: '', email: 'Dealer@Example.com' }),
    );

    expectRedirect(res, 'https://www.briankramer.io/?waitlist=1');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://project.supabase.co/rest/v1/waitlist_signups',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('redirects invalid waitlist emails to error without posting', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const res = await waitlistPost(
      formRequest('/api/waitlist', { company: '', email: 'not-an-email' }),
    );

    expectRedirect(res, 'https://www.briankramer.io/?waitlist=error');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('redirects waitlist honeypot submissions to fake success without posting', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const res = await waitlistPost(
      formRequest('/api/waitlist', { company: 'bot', email: 'bot@example.com' }),
    );

    expectRedirect(res, 'https://www.briankramer.io/?waitlist=1');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('redirects valid waitlist submissions to error when storage and email are unavailable', async () => {
    process.env = {
      ...originalEnv,
      SUPABASE_URL: '',
      SUPABASE_SERVICE_ROLE_KEY: '',
      RESEND_API_KEY: '',
    };

    const res = await waitlistPost(
      formRequest('/api/waitlist', { company: '', email: 'dealer@example.com' }),
    );

    expectRedirect(res, 'https://www.briankramer.io/?waitlist=error');
  });
});

describe('contact route', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
    process.env = originalEnv;
  });

  it('redirects valid contact submissions to success when Supabase stores the message', async () => {
    process.env = {
      ...originalEnv,
      SUPABASE_URL: 'https://project.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: 'service-role-key',
      RESEND_API_KEY: '',
    };
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);

    const res = await contactPost(
      formRequest('/api/contact', {
        company: '',
        name: 'Dealer Principal',
        email: 'Dealer@Example.com',
        topic: 'Speaking',
        message: 'Let us talk.',
      }),
    );

    expectRedirect(res, 'https://www.briankramer.io/contact?sent=1');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://project.supabase.co/rest/v1/contact_submissions',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('redirects invalid contact submissions to error without posting', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const res = await contactPost(
      formRequest('/api/contact', {
        company: '',
        name: '',
        email: 'bad',
        topic: 'Speaking',
        message: '',
      }),
    );

    expectRedirect(res, 'https://www.briankramer.io/contact?sent=error');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('redirects contact honeypot submissions to fake success without posting', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const res = await contactPost(
      formRequest('/api/contact', {
        company: 'bot',
        name: 'Bot',
        email: 'bot@example.com',
        topic: 'Speaking',
        message: 'Spam',
      }),
    );

    expectRedirect(res, 'https://www.briankramer.io/contact?sent=1');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('redirects valid contact submissions to error when storage and email are unavailable', async () => {
    process.env = {
      ...originalEnv,
      SUPABASE_URL: '',
      SUPABASE_SERVICE_ROLE_KEY: '',
      RESEND_API_KEY: '',
    };

    const res = await contactPost(
      formRequest('/api/contact', {
        company: '',
        name: 'Dealer Principal',
        email: 'dealer@example.com',
        topic: 'Speaking',
        message: 'Let us talk.',
      }),
    );

    expectRedirect(res, 'https://www.briankramer.io/contact?sent=error');
  });
});
