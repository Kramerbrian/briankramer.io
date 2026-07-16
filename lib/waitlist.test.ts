import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { storeWaitlistSignup } from './waitlist';

const OK_RESPONSE = { ok: true, text: async () => '' } as Response;

describe('storeWaitlistSignup', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns false and skips the request when Supabase env is unset', async () => {
    vi.stubEnv('SUPABASE_URL', '');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', '');
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    const result = await storeWaitlistSignup('person@example.com');

    expect(result).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('posts a normalized signup to Supabase and returns true on success', async () => {
    vi.stubEnv('SUPABASE_URL', 'https://project.supabase.co/');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-role');
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(OK_RESPONSE);

    const result = await storeWaitlistSignup('  Person@Example.com  ');

    expect(result).toBe(true);
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe('https://project.supabase.co/rest/v1/waitlist_signups');
    expect((init?.headers as Record<string, string>).apikey).toBe('service-role');
    const body = JSON.parse(init?.body as string);
    expect(body).toEqual({ email: 'person@example.com', source: 'book_waitlist' });
  });

  it('returns false when Supabase responds with an error', async () => {
    vi.stubEnv('SUPABASE_URL', 'https://project.supabase.co');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-role');
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'error',
    } as Response);

    const result = await storeWaitlistSignup('person@example.com');

    expect(result).toBe(false);
  });
});
