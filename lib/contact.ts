export interface ContactSubmission {
  name: string;
  email: string;
  topic: string;
  message: string;
}

export async function storeContactSubmission({
  name,
  email,
  topic,
  message,
}: ContactSubmission): Promise<boolean> {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    console.warn('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set - contact not stored');
    return false;
  }

  const res = await fetch(`${url}/rest/v1/contact_submissions`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      name,
      email: email.trim().toLowerCase(),
      topic: topic || 'Other',
      message,
    }),
  });

  if (!res.ok) {
    console.error('Supabase contact error:', res.status, await res.text());
    return false;
  }

  return true;
}
