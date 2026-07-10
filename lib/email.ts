interface SendEmailOptions {
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ subject, html, replyTo }: SendEmailOptions): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.EMAIL_TO ?? 'bkramer@cars.com';
  const from = process.env.EMAIL_FROM ?? 'notifications@briankramer.io';

  if (!apiKey) {
    console.warn('RESEND_API_KEY not set — email not sent');
    return false;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  if (!res.ok) {
    console.error('Resend error:', await res.text());
    return false;
  }

  return true;
}
