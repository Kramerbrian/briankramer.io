# AGENTS.md

## Cursor Cloud specific instructions

### What this is
Single Next.js 16 (App Router, Turbopack) + React 19 + TypeScript content/marketing site (`briankramer-site`). Package manager is **npm** (`package-lock.json`). There is no monorepo, no Docker, and no local database — the two backend integrations (Supabase for waitlist persistence, Resend for email) are hosted SaaS.

### Run / lint / build / check
Standard scripts in `package.json`:
- Dev server: `npm run dev` (Turbopack; serves everything on port **3000**).
- Lint: `npm run lint` (ESLint flat config in `eslint.config.mjs`; Next 16 removed `next lint`, and `next build` no longer lints).
- Production build: `npm run build`; serve build with `npm run start`.
- Unit/component tests: `npm test` (Vitest + jsdom + Testing Library); e2e: `npm run test:e2e` (Playwright — run `npx playwright install chromium` once first).
- Content governance checks: `npm run check:content-governance` (also runs `check:public-claims` and `test:public-claims`). These are pure Node scripts, no server needed; useful before committing content changes.

### Testing gotchas
- Vitest config is `vitest.config.mts` (**must** be `.mts`: the project is CommonJS-by-default and some Vite plugins are ESM-only). It maps the `@/` alias to the repo root via `resolve.alias`.
- `*.test.ts(x)`, `e2e/**`, and the vitest/playwright configs are excluded from `tsconfig.json` so they don't break `next build`'s type-check. Editor type-checking of tests is therefore looser.
- Unit tests mock `globalThis.fetch` and use `vi.stubEnv` to cover the graceful-degradation branches of `lib/email.ts` and `lib/waitlist.ts`.
- Playwright's config auto-starts `npm run dev` and reuses an already-running server locally.

### Non-obvious caveats
- **The app degrades gracefully without secrets.** `lib/email.ts` (Resend) and `lib/waitlist.ts` (Supabase) return `false` when their env vars are unset instead of throwing. The site, all pages, and the API routes still run fine without any secrets.
- **Consequence for testing:** submitting the book waitlist form (or contact form) with no credentials configured redirects to `/?waitlist=error` and shows "Something went wrong…". This is expected — it is not a bug or a broken environment. To exercise the real success path you must set the env vars below in `.env.local` and (for waitlist persistence) apply `supabase/migrations/20260711000000_waitlist_signups.sql` to a Supabase project.
- Optional env vars (see `.env.local.example`): `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TO`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`. Never expose the service-role key with a `NEXT_PUBLIC_` prefix.
- API routes run on the **Edge runtime** (`export const runtime = 'edge'`).
- `package.json` pins `overrides` for `sharp` (`^0.35.3`) and `postcss` (`^8.5.19`) to keep `npm audit --omit=dev` clean; Next 16 otherwise pulls vulnerable transitive versions. Remove once a stable Next ships the patched versions.
- Dynamic route `params` and page `searchParams` are async (must be `await`ed) — required since Next 15.
- Content lives in `content/` (TypeScript modules + MDX) and is rendered at request/build time; there is no CMS or runtime content service.
