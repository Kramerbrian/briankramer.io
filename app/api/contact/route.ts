import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { escapeHtml, htmlWithLineBreaks } from '@/lib/html';

export const runtime = 'edge';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function contactRedirect(req: Request, status: '1' | 'error') {
  const url = new URL(req.url);
  return NextResponse.redirect(new URL(`/contact?sent=${status}`, url.origin), 303);
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const name = String(form.get('name') ?? '').trim();
    const email = String(form.get('email') ?? '').trim();
    const topic = String(form.get('topic') ?? '').trim();
    const message = String(form.get('message') ?? '').trim();
    const honeypot = String(form.get('company') ?? '').trim();

    if (honeypot) {
      return contactRedirect(req, '1');
    }

    if (!name || !email || !message) {
      return contactRedirect(req, 'error');
    }
    if (!emailPattern.test(email)) {
      return contactRedirect(req, 'error');
    }

    const sent = await sendEmail({
      subject: `[Contact] ${topic} — ${name}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Topic:</strong> ${escapeHtml(topic || 'Other')}</p>
        <p><strong>Message:</strong></p>
        <p>${htmlWithLineBreaks(message)}</p>
      `,
      replyTo: email,
    });

    return contactRedirect(req, sent ? '1' : 'error');
  } catch {
    return contactRedirect(req, 'error');
  }
}
