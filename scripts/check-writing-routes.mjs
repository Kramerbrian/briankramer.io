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

const BASE = argValue('--base') ?? 'https://www.briankramer.io';
const SITEMAP = `${BASE}/sitemap.xml`;
const UA = 'briankramer-io-route-canary/1.0';

// Which sitemap path prefixes are dynamic-slug routes worth canarying.
// Only /writing/[slug] is a published dynamic route today; /playbook/[slug]
// exists but always 404s (unpublished pending source verification) so it's
// excluded until it goes live — add it here with a comma or repeat --prefix.
const PREFIXES = (argValue('--prefix') ?? '/writing/')
  .split(',')
  .map((p) => p.trim())
  .filter(Boolean);

// A route is healthy only if ALL of these hold.
const MIN_WORDS = 150;

function argValue(flag) {
  const i = process.argv.indexOf(flag);
  return i !== -1 ? process.argv[i + 1] : undefined;
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function getSitemapUrls() {
  const res = await fetch(SITEMAP, { headers: { 'user-agent': UA } });
  if (!res.ok) throw new Error(`sitemap ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

/**
 * Strips scripts/tags and counts words across the WHOLE document, not just
 * <main>. React streams Suspense payloads into a hidden <div> that appears
 * after </main> and is swapped in by inline script — content-in-<main> is not
 * a valid health signal on this site.
 */
function visibleWordCount(html) {
  const stripped = html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<template[\s\S]*?<\/template>/g, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  return stripped.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
}

function firstTitle(html) {
  return html.match(/<title>([^<]*)<\/title>/)?.[1] ?? null;
}

function canonical(html) {
  const linkTag = html.match(/<link\s+[^>]*rel="canonical"[^>]*>/)?.[0];
  if (!linkTag) return null;
  return linkTag.match(/href="([^"]+)"/)?.[1] ?? null;
}

function isNoindex(html) {
  const metaTag = html.match(/<meta\s+[^>]*name="robots"[^>]*>/)?.[0];
  if (!metaTag) return false;
  const content = metaTag.match(/content="([^"]*)"/)?.[1] ?? '';
  return content.split(',').map((s) => s.trim()).includes('noindex');
}

async function checkUrl(url) {
  const res = await fetch(url, { headers: { 'user-agent': UA }, redirect: 'follow' });
  const html = await res.text();

  const problems = [];

  // The core defect: 200 status carrying a not-found render.
  const softNotFound = html.includes('NEXT_HTTP_ERROR_FALLBACK;404');
  if (res.status === 200 && softNotFound) {
    problems.push('SOFT_404: HTTP 200 with Next not-found fallback in body');
  }

  if (res.status !== 200) problems.push(`STATUS: ${res.status}`);

  if (isNoindex(html)) {
    problems.push('NOINDEX: robots noindex present');
  }

  const canon = canonical(html);
  if (!canon) {
    problems.push('NO_CANONICAL');
  } else if (canon.replace(/\/$/, '') !== url.replace(/\/$/, '')) {
    problems.push(`CANONICAL_MISMATCH: ${canon}`);
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
async function checkNegativeControl(prefix) {
  const url = `${BASE}${prefix}__canary-nonexistent-slug__`;
  const res = await fetch(url, { headers: { 'user-agent': UA } });
  const html = await res.text();
  const isNotFound =
    res.status === 404 || html.includes('NEXT_HTTP_ERROR_FALLBACK;404');
  return {
    url,
    status: res.status,
    ok: isNotFound,
    note: isNotFound
      ? 'unknown slug correctly resolves to not-found'
      : 'unknown slug did NOT resolve to not-found — route matches everything',
  };
}

const urls = await getSitemapUrls();
const prefixPattern = new RegExp(
  `(?:${PREFIXES.map(escapeRegExp).join('|')})[^/]+/?$`
);
const articleUrls = urls.filter((u) => prefixPattern.test(u));

if (articleUrls.length === 0) {
  console.error(`FAIL: sitemap lists zero URLs under [${PREFIXES.join(', ')}]`);
  process.exit(1);
}

console.log(`Checking ${articleUrls.length} routes under [${PREFIXES.join(', ')}] against ${BASE}\n`);

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

const controls = [];
for (const prefix of PREFIXES) {
  const control = await checkNegativeControl(prefix);
  controls.push(control);
  console.log(
    `\n[${control.ok ? ' ok ' : 'FAIL'}] negative control ${control.url}\n` +
      `        ${control.note} (status=${control.status})`
  );
}

const failed = results.filter((r) => r.problems.length);
const failedControls = controls.filter((c) => !c.ok);
console.log(
  `\n${results.length - failed.length}/${results.length} routes healthy`
);

if (failed.length || failedControls.length) process.exit(1);
