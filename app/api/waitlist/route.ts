import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { escapeHtml } from '@/lib/html';
import { storeWaitlistSignup } from '@/lib/waitlist';

export const runtime = 'edge';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function waitlistRedirect(req: Request, status: '1' | 'error') {
  const url = new URL(req.url);
  return NextResponse.redirect(new URL(`/?waitlist=${status}`, url.origin), 303);
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';
    const isForm = !contentType.includes('application/json');
    let email = '';
    let honeypot = '';

    if (contentType.includes('application/json')) {
      const body = (await req.json()) as { email?: string; company?: string };
      email = body.email ?? '';
      honeypot = body.company ?? '';
    } else {
      const form = await req.formData();
      email = String(form.get('email') ?? '');
      honeypot = String(form.get('company') ?? '');
    }

    email = email.trim().toLowerCase();
    honeypot = honeypot.trim();

    if (honeypot) {
      return isForm ? waitlistRedirect(req, '1') : NextResponse.json({ ok: true });
    }

    if (!email || !emailPattern.test(email)) {
      return isForm
        ? waitlistRedirect(req, 'error')
        : NextResponse.json({ ok: false, error: 'Enter a valid email address.' }, { status: 400 });
    }

    const [stored, notified] = await Promise.all([
      storeWaitlistSignup(email),
      sendEmail({
        subject: `[Waitlist] The Best End User — ${email}`,
        html: `<p>New waitlist signup for <em>The Best End User</em>:</p><p><strong>${escapeHtml(email)}</strong></p>`,
        replyTo: email,
      }),
    ]);

    // Succeed if either persistence or notification worked.
    const ok = stored || notified;

    if (isForm) {
      return waitlistRedirect(req, ok ? '1' : 'error');
    }

    return NextResponse.json({
      ok,
      stored,
      notified,
      ...(ok ? {} : { error: 'Could not save or send the waitlist signup.' }),
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'Unexpected waitlist error.' }, { status: 500 });
  }
}
