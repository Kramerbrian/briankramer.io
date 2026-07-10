import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const name = String(form.get('name') ?? '').trim();
    const email = String(form.get('email') ?? '').trim();
    const topic = String(form.get('topic') ?? '').trim();
    const message = String(form.get('message') ?? '').trim();

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: 'Invalid email' }, { status: 400 });
    }

    const sent = await sendEmail({
      subject: `[Contact] ${topic} — ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Topic:</strong> ${topic}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      replyTo: email,
    });

    const url = new URL(req.url);
    const redirectUrl = new URL(sent ? '/contact?sent=1' : '/contact?sent=error', url.origin);
    return NextResponse.redirect(redirectUrl, 303);
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
