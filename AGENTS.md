# AGENTS.md

## Cursor Cloud specific instructions

### What this is
Single Next.js 14 (App Router) + TypeScript content/marketing site (`briankramer-site`). Package manager is **npm** (`package-lock.json`). There is no monorepo, no Docker, and no local database — the two backend integrations (Supabase for waitlist persistence, Resend for email) are hosted SaaS.

### Run / lint / build / check
Standard scripts in `package.json`:
- Dev server: `npm run dev` (serves everything on port **3000**).
- Lint: `npm run lint`.
- Production build: `npm run build`; serve build with `npm run start`.
- Content governance checks: `npm run check:content-governance` (also runs `check:public-claims`). These are pure Node scripts, no server needed; useful before committing content changes.

### Non-obvious caveats
- **The app degrades gracefully without secrets.** `lib/email.ts` (Resend) and `lib/waitlist.ts` (Supabase) return `false` when their env vars are unset instead of throwing. The site, all pages, and the API routes still run fine without any secrets.
- **Consequence for testing:** submitting the book waitlist form (or contact form) with no credentials configured redirects to `/?waitlist=error` and shows "Something went wrong…". This is expected — it is not a bug or a broken environment. To exercise the real success path you must set the env vars below in `.env.local` and (for waitlist persistence) apply `supabase/migrations/20260711000000_waitlist_signups.sql` to a Supabase project.
- Optional env vars (see `.env.local.example`): `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TO`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`. Never expose the service-role key with a `NEXT_PUBLIC_` prefix.
- API routes run on the **Edge runtime** (`export const runtime = 'edge'`).
- Content lives in `content/` (TypeScript modules + MDX) and is rendered at request/build time; there is no CMS or runtime content service.
