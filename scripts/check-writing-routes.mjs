#!/usr/bin/env node
/**
 * check-writing-routes.mjs
 *
 * Detects the soft-404 / ISR-poisoning failure mode on briankramer.io:
 * a route that returns HTTP 200 while rendering Next.js's not-found fallback.
 *
 * Exits non-zero on failure so it can gate a deploy or run as a cron canary.
 *
 *   node scripts/check-writing-routes.mjs
 *   node scripts/check-writing-routes.mjs --base https://preview-xyz.vercel.app
 *
 * No dependencies. Node 18+ (built-in fetch).
 */

const UA = 'briankramer-io-route-canary/1.0';

const BASE = argValue('--base') ?? 'https://www.briankramer.io';
const SITEMAP = `${BASE}/sitemap.xml`;

// A route is healthy only if ALL of these hold.
// Site chrome (nav + footer) alone measures 52 words; the shortest real essay
// is 442. 150 sits with margin on both sides.
const MIN_WORDS = 150;

// The sitemap is not a trusted source here — it is one of the things that can
// silently lose entries. Without this, dropping 3 of 6 essays from the sitemap
// reports "3/3 healthy" and exits 0.
const EXPECTED_ARTICLES = Number(argValue('--expect') ?? 6);

// After the dynamicParams/notFound fix ships, run with --strict-404 so an
// unknown slug returning 200 fails the build instead of being tolerated.
const STRICT_404 = process.argv.includes('--strict-404');

const TIMEOUT_MS = 15_000;

function argValue(flag) {
  const i = process.argv.indexOf(flag);
  return i !== -1 ? process.argv[i + 1] : undefined;
}

/**
 * One retry on network-level failure. A canary on a 15-minute schedule that
 * pages on a single dropped connection gets muted within a week.
 * Retries transport errors and 5xx only — never a clean 200 carrying a bad body,
 * which is the exact defect being hunted.
 */
async function fetchOnce(url) {
  const res = await fetch(url, {
    headers: { 'user-agent': UA },
    redirect: 'follow',
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  return { res, html: await res.text() };
}

async function fetchWithRetry(url) {
  try {
    const out = await fetchOnce(url);
    if (out.res.status >= 500) throw new Error(`upstream ${out.res.status}`);
    return out;
  } catch {
    await new Promise((r) => setTimeout(r, 2000));
    return fetchOnce(url);
  }
}

async function getSitemapUrls() {
  const { res, html } = await fetchWithRetry(SITEMAP);
  if (!res.ok) throw new Error(`sitemap ${res.status}`);
  return [...html.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1])
    // sitemap.xml emits absolute production URLs. Without this rewrite,
    // `--base https://preview-xyz.vercel.app` reads the preview's sitemap and
    // then checks the PRODUCTION urls it contains — silently green-lighting a
    // broken preview because prod is fine.
    .map((loc) => new URL(new URL(loc).pathname, BASE).toString());
}

/**
 * Strips scripts/tags and counts words across the WHOLE document, not just
 * <main>. React streams Suspense payloads into a hidden <div> that appears
 * after </main> and is swapped in by inline script — content-in-<main> is not
 * a valid health signal on this site.
 */
function visibleWordCount(html) {
  const stripped = html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<template[\s\S]*?<\/template>/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  return stripped.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
}

function firstTitle(html) {
  return html.match(/<title>([^<]*)<\/title>/)?.[1] ?? null;
}

function canonical(html) {
  return html.match(/rel="canonical"\s+href="([^"]+)"/)?.[1] ?? null;
}

async function checkUrl(url) {
  const { res, html } = await fetchWithRetry(url);

  const problems = [];

  // The core defect: 200 status carrying a not-found render.
  const softNotFound = html.includes('NEXT_HTTP_ERROR_FALLBACK;404');
  if (res.status === 200 && softNotFound) {
    problems.push('SOFT_404: HTTP 200 with Next not-found fallback in body');
  }

  if (res.status !== 200) problems.push(`STATUS: ${res.status}`);

  if (/<meta name="robots" content="noindex"/.test(html)) {
    problems.push('NOINDEX: robots noindex present');
  }

  // Compare PATHS, not full URLs. A canonical correctly points at the
  // production origin even when the page is served from a preview deploy or
  // localhost, so an origin comparison fails every non-prod run.
  const canon = canonical(html);
  if (!canon) {
    problems.push('NO_CANONICAL');
  } else {
    const canonPath = new URL(canon, BASE).pathname.replace(/\/$/, '');
    const urlPath = new URL(url).pathname.replace(/\/$/, '');
    if (canonPath !== urlPath) problems.push(`CANONICAL_MISMATCH: ${canon}`);
  }

  const words = visibleWordCount(html);
  if (words < MIN_WORDS) problems.push(`THIN: ${words} words (min ${MIN_WORDS})`);

  return {
    url,
    status: res.status,
    cache: res.headers.get('x-vercel-cache'),
    prerender: res.headers.get('x-nextjs-prerender'),
    matchedPath: res.headers.get('x-matched-path'),
    title: firstTitle(html),
    words,
    problems,
  };
}

/**
 * Control case: a slug that must NOT exist. This SHOULD render the not-found
 * fallback. If it looks identical to a real slug's healthy render, the route is
 * serving something for every slug and the real-slug pass is meaningless.
 */
async function checkNegativeControl() {
  const url = `${BASE}/writing/__canary-nonexistent-slug__`;
  const { res, html } = await fetchWithRetry(url);

  const rendersNotFound =
    res.status === 404 || html.includes('NEXT_HTTP_ERROR_FALLBACK;404');
  const correctStatus = res.status === 404;

  const ok = STRICT_404 ? correctStatus : rendersNotFound;

  let note;
  if (!rendersNotFound) {
    note = 'unknown slug did NOT resolve to not-found — route matches everything';
  } else if (!correctStatus) {
    note = STRICT_404
      ? `SOFT_404: not-found body served with HTTP ${res.status} — the route is rendering unknown slugs on demand and calling notFound() after the static shell is committed. Set "export const dynamicParams = false" so unknown slugs are rejected at the router with a real 404.`
      : `not-found body served with HTTP ${res.status} (known open bug; re-run with --strict-404 once fixed)`;
  } else {
    note = 'unknown slug returns a true 404';
  }

  return { url, status: res.status, ok, note };
}

const urls = await getSitemapUrls();
const articleUrls = urls.filter((u) => /\/writing\/[^/]+$/.test(u));

if (articleUrls.length === 0) {
  console.error('FAIL: sitemap lists zero /writing/<slug> URLs');
  process.exit(1);
}

let countProblem = null;
if (articleUrls.length !== EXPECTED_ARTICLES) {
  countProblem =
    `SITEMAP_COUNT: expected ${EXPECTED_ARTICLES} article URLs, sitemap lists ` +
    `${articleUrls.length}. Articles cannot be verified if they are not listed.`;
}

console.log(`Checking ${articleUrls.length} article routes against ${BASE}\n`);

const results = [];
for (const u of articleUrls) {
  results.push(await checkUrl(u));
}

for (const r of results) {
  const flag = r.problems.length ? 'FAIL' : ' ok ';
  console.log(
    `[${flag}] ${r.url}\n` +
      `        status=${r.status} cache=${r.cache} prerender=${r.prerender} words=${r.words}\n` +
      `        title=${r.title}`
  );
  for (const p of r.problems) console.log(`        -> ${p}`);
}

const control = await checkNegativeControl();
console.log(
  `\n[${control.ok ? ' ok ' : 'FAIL'}] negative control ${control.url}\n` +
    `        ${control.note} (status=${control.status})`
);

const failed = results.filter((r) => r.problems.length);
console.log(
  `\n${results.length - failed.length}/${results.length} article routes healthy` +
    ` (expected ${EXPECTED_ARTICLES})`
);

if (countProblem) console.error(`[FAIL] ${countProblem}`);

if (failed.length || !control.ok || countProblem) process.exit(1);
