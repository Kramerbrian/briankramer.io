import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * Build provenance endpoint.
 *
 * The recurring failure on this project is not "the fix was wrong" — it is "the fix
 * was correct in the repo and never reached production." Comparing this SHA to
 * `git rev-parse origin/main` turns that from something you discover by eye into
 * something CI can assert.
 *
 * VERCEL_GIT_COMMIT_SHA is injected by Vercel at build time. Locally it is absent,
 * which is reported honestly rather than faked.
 *
 * PREREQUISITE: this only populates when "Automatically expose System Environment
 * Variables" is enabled in Project → Settings → Environment Variables. With it off,
 * every field below is null and check-deployed-sha.mjs fails on every run — which
 * looks like a broken deploy but is a project toggle. Check that first.
 */
export function GET() {
  return NextResponse.json(
    {
      sha: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
      ref: process.env.VERCEL_GIT_COMMIT_REF ?? null,
      env: process.env.VERCEL_ENV ?? 'local',
      // Identifier (dpl_...), not a timestamp. Vercel exposes no build-time clock
      // to the runtime; if a real build time is ever needed, inject it via
      // next.config env at build and read it here under a separate key.
      deploymentId: process.env.VERCEL_DEPLOYMENT_ID ?? null,
    },
    {
      headers: {
        // Never cache: a cached version endpoint defeats its own purpose.
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      },
    },
  );
}
