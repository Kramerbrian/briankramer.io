-- Contact form submissions for briankramer.io
-- Apply in Supabase SQL editor (or via CLI). Service-role inserts only.

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  topic text not null default 'Other',
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);

alter table public.contact_submissions enable row level security;

-- No anon/authenticated policies: public Data API cannot read or write.
-- Edge route inserts with SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).

revoke all on table public.contact_submissions from anon, authenticated;
grant select, insert on table public.contact_submissions to service_role;
