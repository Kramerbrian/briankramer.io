import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { storeWaitlistSignup } from '@/lib/waitlist';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let email = '';
    if (contentType.includes('application/json')) {
      const body = (await req.json()) as { email?: string };
      email = body.email ?? '';
    } else {
      const form = await req.formData();
      email = String(form.get('email') ?? '');
    }

    email = email.trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: 'Invalid email' }, { status: 400 });
    }

    const [stored, notified] = await Promise.all([
      storeWaitlistSignup(email),
      sendEmail({
        subject: `[Waitlist] The Best End User — ${email}`,
        html: `<p>New waitlist signup for <em>The Best End User</em>:</p><p><strong>${email}</strong></p>`,
        replyTo: email,
      }),
    ]);

    // Succeed if either persistence or notification worked.
    const ok = stored || notified;

    const url = new URL(req.url);
    const isForm = !contentType.includes('application/json');

    if (isForm) {
      const redirectUrl = new URL(ok ? '/?waitlist=1' : '/?waitlist=error', url.origin);
      return NextResponse.redirect(redirectUrl, 303);
    }

    return NextResponse.json({ ok, stored, notified });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
