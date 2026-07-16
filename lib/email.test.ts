import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { sendEmail } from './email';

const OK_RESPONSE = { ok: true, text: async () => '' } as Response;

describe('sendEmail', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns false and does not call the API when RESEND_API_KEY is unset', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    const result = await sendEmail({ subject: 's', html: '<p>hi</p>' });

    expect(result).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('posts to the Resend API and returns true on success', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-key');
    vi.stubEnv('EMAIL_TO', 'to@example.com');
    vi.stubEnv('EMAIL_FROM', 'from@example.com');
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(OK_RESPONSE);

    const result = await sendEmail({ subject: 'Hello', html: '<p>hi</p>', replyTo: 'r@example.com' });

    expect(result).toBe(true);
    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');
    expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer test-key');
    const body = JSON.parse(init?.body as string);
    expect(body).toMatchObject({
      from: 'from@example.com',
      to: ['to@example.com'],
      subject: 'Hello',
      reply_to: 'r@example.com',
    });
  });

  it('returns false when the API responds with an error', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-key');
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      text: async () => 'bad request',
    } as Response);

    const result = await sendEmail({ subject: 's', html: '<p>hi</p>' });

    expect(result).toBe(false);
  });
});
