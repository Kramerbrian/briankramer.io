-- Waitlist signups for briankramer.io
-- Apply in Supabase SQL editor (or via CLI). Service-role inserts only.

create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null default 'book_waitlist',
  created_at timestamptz not null default now(),
  constraint waitlist_signups_email_key unique (email)
);

create index if not exists waitlist_signups_created_at_idx
  on public.waitlist_signups (created_at desc);

alter table public.waitlist_signups enable row level security;

-- No anon/authenticated policies: public Data API cannot read or write.
-- Edge route inserts with SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).

revoke all on table public.waitlist_signups from anon, authenticated;
grant select, insert on table public.waitlist_signups to service_role;
