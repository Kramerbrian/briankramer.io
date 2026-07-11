export async function storeWaitlistSignup(email: string): Promise<boolean> {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    console.warn('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set — waitlist not stored');
    return false;
  }

  const normalized = email.trim().toLowerCase();

  const res = await fetch(`${url}/rest/v1/waitlist_signups`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=ignore-duplicates,return=minimal',
    },
    body: JSON.stringify({
      email: normalized,
      source: 'book_waitlist',
    }),
  });

  if (!res.ok) {
    console.error('Supabase waitlist error:', res.status, await res.text());
    return false;
  }

  return true;
}
