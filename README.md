# briankramer.io

Personal brand and content site for **Brian Kramer** (EVP, Cars Commerce), built with the Next.js App Router. It serves marketing pages, long-form essays and a "Playbook" (MDX + TypeScript content), a podcast/playlist archive, a book waitlist for *The Best End User*, and a contact form.

## Tech stack

- **Framework:** Next.js 14 (App Router), React 18, TypeScript (strict)
- **Styling:** Tailwind CSS + PostCSS
- **Content:** MDX (`@next/mdx`) + TypeScript modules under `content/`
- **API routes:** Edge runtime (`app/api/*`)
- **Optional integrations:** Supabase (waitlist persistence) and Resend (transactional email) — both degrade gracefully when unconfigured
- **Package manager:** npm
- **Deploy target:** Vercel

## Getting started

```bash
npm install
cp .env.local.example .env.local   # optional — see "Environment variables"
npm run dev                        # http://localhost:3000
```

The site renders fully without any secrets; the optional integrations simply no-op (see below).

## Environment variables

All variables are **optional** for local development. See `.env.local.example` for the full list.

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TO` | Transactional email (contact form + waitlist notification) via Resend |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Client-safe Supabase config |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Server-only Supabase, used to persist waitlist signups |

Without these, the contact and waitlist forms submit successfully end-to-end but skip persistence/email and show the "something went wrong" fallback message. To exercise the real success path, set the variables and apply the waitlist table migration in `supabase/migrations/`.

> The service-role key must never be exposed with a `NEXT_PUBLIC_` prefix.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server on port 3000 |
| `npm run build` | Production build (also type-checks the app) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint via `next lint` |
| `npm test` | Unit + component tests (Vitest) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:e2e` | End-to-end smoke tests (Playwright) |
| `npm run check:content-governance` | Content governance + public-claim checks (includes `test:public-claims`) |

### Testing

- **Unit/component tests** live next to their sources as `*.test.ts(x)` and run under Vitest (jsdom + Testing Library).
- **End-to-end tests** live in `e2e/` and run under Playwright. `playwright.config.ts` starts the dev server automatically (and reuses an already-running one locally). First run: `npx playwright install chromium`.
- **Content governance** validates public claims in content against a source-evidence registry; it runs in CI and via `check:content-governance`.

CI (`.github/workflows/public-site-governance.yml`) runs lint, unit tests, build, content governance, and Playwright e2e on every push/PR.

## Project structure

```
app/          App Router routes, layouts, and Edge API routes
components/    Reusable UI components
content/      Essays, playbook, podcasts, newsletter, publishing records (MDX + TS)
lib/          Utilities, SEO helpers, email + waitlist integrations
scripts/      Content-governance / public-claim checks (+ their tests)
supabase/     SQL migrations
e2e/          Playwright end-to-end tests
```
