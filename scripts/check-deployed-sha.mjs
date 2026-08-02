#!/usr/bin/env node
/**
 * Deploy provenance check.
 *
 * Asserts that what production is serving is what was merged. Five separate times
 * on 2026-07-27 a fix was confirmed correct in the repo while production continued
 * serving an older build — the JSON-LD component, the contact/waitlist banners, the
 * analytics wiring, the hero crop, and the essay soft-404. Each was found by hand.
 * This makes the check mechanical.
 *
 * Usage:
 *   node scripts/check-deployed-sha.mjs
 *   node scripts/check-deployed-sha.mjs --sha <sha>            # explicit expectation
 *   node scripts/check-deployed-sha.mjs --base https://... --ref origin/main
 *   node scripts/check-deployed-sha.mjs --retries 10 --delay 15   # post-deploy poll
 *
 * Expected SHA resolution order (first hit wins):
 *   1. --sha <value>
 *   2. $GITHUB_SHA        — set by GitHub Actions; use this in CI, because
 *                           actions/checkout defaults to fetch-depth 1 and
 *                           `git rev-parse origin/main` frequently cannot resolve.
 *   3. git rev-parse <--ref, default origin/main>
 *
 * Exit codes:
 *   0  deployed SHA matches the expectation
 *   1  mismatch after all retries, unreachable endpoint, or missing SHA
 *
 * PREREQUISITE: /api/version only returns a SHA when "Automatically expose System
 * Environment Variables" is ON in Vercel → Project → Settings → Environment
 * Variables. With it off this reports "no SHA" forever — a toggle, not a bad deploy.
 */

import { execSync } from 'node:child_process';

const args = process.argv.slice(2);
const argVal = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};

const BASE = argVal('base', 'https://www.briankramer.io').replace(/\/$/, '');
const REF = argVal('ref', 'origin/main');
const RETRIES = Number.parseInt(argVal('retries', '1'), 10);
const DELAY_S = Number.parseInt(argVal('delay', '15'), 10);
const URL_ = `${BASE}/api/version`;

const fail = (msg) => {
  console.error(`Deploy provenance check FAILED:\n- ${msg}`);
  process.exit(1);
};

// —— Resolve what we expect production to be serving ——
let expected = argVal('sha', null) ?? process.env.GITHUB_SHA ?? null;
let expectedSource = argVal('sha', null) ? '--sha' : process.env.GITHUB_SHA ? '$GITHUB_SHA' : null;

if (!expected) {
  try {
    expected = execSync(`git rev-parse ${REF}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    expectedSource = REF;
  } catch {
    fail(
      `Could not resolve ref '${REF}'. In CI, pass --sha or rely on $GITHUB_SHA — ` +
        `actions/checkout uses fetch-depth 1 by default and often cannot resolve remote refs. ` +
        `Locally, run 'git fetch origin' first.`,
    );
  }
}

const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000));
const short = (s) => String(s).slice(0, 7);

/** Returns {payload} on success, or {error} describing a *specific* failure mode. */
async function probe() {
  let res;
  try {
    res = await fetch(URL_, { headers: { 'cache-control': 'no-cache' } });
  } catch (err) {
    return { error: `Could not reach ${URL_} (network/DNS/TLS) — ${err instanceof Error ? err.message : String(err)}` };
  }
  if (!res.ok) {
    return { error: `${URL_} returned HTTP ${res.status}. The host is reachable; the route is failing.` };
  }
  try {
    return { payload: await res.json() };
  } catch {
    // Reached the host and got 200, but not JSON — usually an HTML error page or a
    // rewrite swallowing the route. Do NOT report this as unreachable.
    return { error: `${URL_} returned 200 but the body was not JSON. The route may be shadowed by a rewrite or an error page.` };
  }
}

let last = '';
for (let attempt = 1; attempt <= Math.max(1, RETRIES); attempt++) {
  const { payload, error } = await probe();

  if (error) {
    last = error;
  } else {
    const deployed = payload?.sha;
    if (!deployed) {
      last =
        `${URL_} returned no SHA (env: ${payload?.env ?? 'unknown'}). ` +
        `Most likely "Automatically expose System Environment Variables" is OFF in Vercel project settings. ` +
        `If this is the first deploy after adding the endpoint, redeploy and re-run.`;
    } else if (deployed === expected) {
      console.log('Deploy provenance check passed.');
      console.log(`- ${BASE} is serving ${short(deployed)} (${payload.ref ?? 'unknown'}, ${payload.env})`);
      console.log(`- matches ${expectedSource} (${short(expected)})`);
      process.exit(0);
    } else {
      last =
        `Production is serving ${short(deployed)} but ${expectedSource} is ${short(expected)}.\n` +
        `  Deployed ref: ${payload.ref ?? 'unknown'}   env: ${payload.env ?? 'unknown'}\n` +
        `  A merge did not deploy, a build failed, or a rollback is active. ` +
        `Do NOT treat repo state as live state until these match.`;
    }
  }

  if (attempt < RETRIES) {
    console.log(`Attempt ${attempt}/${RETRIES} not yet matching; waiting ${DELAY_S}s for the deploy to land...`);
    await sleep(DELAY_S);
  }
}

fail(`${last}\n  (gave up after ${RETRIES} attempt(s) at ${DELAY_S}s intervals)`);
