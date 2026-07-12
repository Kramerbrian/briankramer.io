#!/usr/bin/env node
/**
 * Content governance checks for briankramer.io public surface.
 * Fails non-zero when publishing parity, podcast verification, playbook
 * gating, prohibited copy, or formula ID drift is detected.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function walkFiles(dirRel, exts, out = []) {
  const abs = path.join(root, dirRel);
  if (!fs.existsSync(abs)) return out;
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = path.join(dirRel, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue;
      walkFiles(rel, exts, out);
    } else if (exts.some((ext) => entry.name.endsWith(ext))) {
      out.push(rel);
    }
  }
  return out;
}

function push(msg) {
  errors.push(msg);
}

// —— Formula ID drift (FORMULA_KNOWLEDGE.md ↔ TypeScript) ——
const registryPath = 'content/doctrine/automotive-update-doctrine.ts';
const markdownPath = 'content/doctrine/FORMULA_KNOWLEDGE.md';
const registry = read(registryPath);
const markdown = read(markdownPath);

const formulaBlock = registry.match(
  /export const automotiveUpdateFormulas:[\s\S]*?= \[([\s\S]*?)\n\];/,
);
if (!formulaBlock) {
  push('Could not locate automotiveUpdateFormulas registry.');
} else {
  const registryIds = [...formulaBlock[1].matchAll(/\bid:\s*'([^']+)'/g)].map((m) => m[1]);
  const markdownIds = [...markdown.matchAll(/^## Formula: ([a-z0-9-]+)$/gm)].map((m) => m[1]);
  const duplicates = (ids) => [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
  const missing = registryIds.filter((id) => !markdownIds.includes(id));
  const undocumented = markdownIds.filter((id) => !registryIds.includes(id));
  const registryDuplicates = duplicates(registryIds);
  const markdownDuplicates = duplicates(markdownIds);

  if (missing.length) push(`Registry IDs missing from Markdown: ${missing.join(', ')}`);
  if (undocumented.length) push(`Markdown IDs absent from registry: ${undocumented.join(', ')}`);
  if (registryDuplicates.length) push(`Duplicate registry IDs: ${registryDuplicates.join(', ')}`);
  if (markdownDuplicates.length) {
    push(`Formula IDs documented more than once: ${markdownDuplicates.join(', ')}`);
  }
  if (registryIds.length !== markdownIds.length) {
    push(`Formula count mismatch: registry=${registryIds.length}, markdown=${markdownIds.length}`);
  }
}

// —— Load publishing records + public content indexes ——
const recordsSrc = read('content/publishing/records.ts');
const essaysSrc = read('content/essays/index.ts');
const podcastsSrc = read('content/podcasts/seed.ts');
const newsletterSrc = exists('content/newsletter/editions.ts')
  ? read('content/newsletter/editions.ts')
  : '';
const playbookSlugSrc = read('app/playbook/[slug]/page.tsx');
const playbookIndexSrc = read('app/playbook/page.tsx');
const sitemapSrc = read('app/sitemap.ts');

const recordUrls = [...recordsSrc.matchAll(/canonicalUrl:\s*`\$\{SITE\}([^`]+)`/g)].map(
  (m) => m[1],
);
const essaySlugs = [...essaysSrc.matchAll(/^\s*slug:\s*'([^']+)'/gm)].map((m) => m[1]);
const podcastSlugs = [...podcastsSrc.matchAll(/^\s*slug:\s*'([^']+)'/gm)].map((m) => m[1]);
const newsletterSlugs = newsletterSrc
  ? [...newsletterSrc.matchAll(/^\s*slug:\s*'([^']+)'/gm)].map((m) => m[1])
  : [];

// —— Public content items must have publishing records ——
for (const slug of essaySlugs) {
  const expected = `/writing/${slug}`;
  if (!recordUrls.includes(expected)) {
    push(`Public essay missing publishing record: ${expected}`);
  }
}

if (!recordUrls.includes('/playbook')) {
  push('Public playbook index missing publishing record: /playbook');
}

if (!recordUrls.includes('/podcast')) {
  push('Public podcast archive missing publishing record: /podcast');
}

for (const slug of podcastSlugs) {
  const expected = `/podcast#${slug}`;
  if (!recordUrls.includes(expected)) {
    push(`Public podcast entry missing publishing record: ${expected}`);
  }
}

if (exists('app/newsletter/page.tsx')) {
  if (!recordUrls.includes('/newsletter')) {
    push('Public newsletter index missing publishing record: /newsletter');
  }
  for (const slug of newsletterSlugs) {
    const expected = `/newsletter#${slug}`;
    if (!recordUrls.includes(expected)) {
      push(`Public newsletter edition missing publishing record: ${expected}`);
    }
  }
  if (!newsletterSrc) {
    push('Newsletter route exists but content/newsletter/editions.ts is missing.');
  } else if (!/sourceVerified:\s*true/.test(newsletterSrc)) {
    push('Newsletter editions must be sourceVerified: true.');
  }
}

// —— Publishing records must point to existing routes ——
for (const urlPath of recordUrls) {
  if (urlPath.startsWith('/writing/')) {
    const slug = urlPath.slice('/writing/'.length);
    if (!essaySlugs.includes(slug)) {
      push(`Publishing record points to missing essay slug: ${urlPath}`);
    }
    continue;
  }
  if (urlPath === '/podcast') {
    if (!exists('app/podcast/page.tsx')) push('Publishing record /podcast missing app route.');
    continue;
  }
  if (urlPath.startsWith('/podcast#')) {
    const slug = urlPath.slice('/podcast#'.length);
    if (!podcastSlugs.includes(slug)) {
      push(`Publishing record points to missing podcast slug: ${urlPath}`);
    }
    if (!exists('app/podcast/page.tsx')) push('Publishing record podcast fragment missing /podcast route.');
    continue;
  }
  if (urlPath === '/newsletter') {
    if (!exists('app/newsletter/page.tsx')) push('Publishing record /newsletter missing app route.');
    continue;
  }
  if (urlPath.startsWith('/newsletter#')) {
    const slug = urlPath.slice('/newsletter#'.length);
    if (!newsletterSlugs.includes(slug)) {
      push(`Publishing record points to missing newsletter slug: ${urlPath}`);
    }
    if (!exists('app/newsletter/page.tsx')) {
      push('Publishing record newsletter fragment missing /newsletter route.');
    }
    continue;
  }
  if (urlPath === '/playbook') {
    if (!exists('app/playbook/page.tsx')) push('Publishing record /playbook missing app route.');
    continue;
  }
  if (urlPath.startsWith('/playbook/')) {
    push(`Publishing record points to blocked playbook detail route: ${urlPath}`);
    continue;
  }
  if (urlPath === '/newsletter' || urlPath === '/speaking') {
    const page = urlPath === '/newsletter' ? 'app/newsletter/page.tsx' : 'app/speaking/page.tsx';
    if (!exists(page)) push(`Publishing record for nonexistent route: ${urlPath}`);
    continue;
  }
}

// —— Sitemap must not include blocked / unverified detail routes ——
const sitemapMentionsPlaybookDetails =
  /playbook\/\$\{|\/playbook\/`|playbookEntries\.map|\/playbook\/\$\{entry/.test(sitemapSrc) ||
  /url:.*\/playbook\//.test(sitemapSrc);
if (sitemapMentionsPlaybookDetails) {
  push('Sitemap includes playbook detail routes (blocked/unverified).');
}

if (/\/podcast#/.test(sitemapSrc) || /podcastAppearances\.map/.test(sitemapSrc)) {
  push('Sitemap includes unverified podcast episode/fragment routes.');
}
if (/\/newsletter#/.test(sitemapSrc) || /newsletterEditions\.map/.test(sitemapSrc)) {
  push('Sitemap includes newsletter edition fragment routes.');
}
if (/playbookEntries\.map/.test(sitemapSrc) || /\/playbook\/\$\{/.test(sitemapSrc)) {
  push('Sitemap must not emit playbook detail slug routes while unverified.');
}

// Public archive indexes may be listed in CORE_PUBLIC_ROUTES even when pending.
if (!/CORE_PUBLIC_ROUTES/.test(sitemapSrc)) {
  push('sitemap.ts must define CORE_PUBLIC_ROUTES for public index parity.');
}
if (!/['"]\/podcast['"]/.test(sitemapSrc) || !/['"]\/playbook['"]/.test(sitemapSrc)) {
  push('sitemap CORE_PUBLIC_ROUTES must include public /podcast and /playbook archive indexes.');
}

// listSitemapCanonicalRecords must exclude fragments and non-verified long-form detail statuses
if (!/canonicalUrl\.includes\('\/podcast#'\)/.test(recordsSrc)) {
  push('listSitemapCanonicalRecords must exclude /podcast# fragment URLs.');
}
if (!/canonicalUrl\.includes\('\/newsletter#'\)/.test(recordsSrc)) {
  push('listSitemapCanonicalRecords must exclude /newsletter# fragment URLs.');
}
if (
  !/evidenceStatus !== 'verified'/.test(recordsSrc) ||
  !/evidenceStatus !== 'qualified'/.test(recordsSrc)
) {
  push(
    "listSitemapCanonicalRecords must allow only evidenceStatus 'verified' or 'qualified' for recorded long-form URLs.",
  );
}

// —— Podcast: sourceVerified false ⇒ sourceUrl must be null ——
const podcastBlocks = podcastsSrc.split(/\{\s*\n\s*id:\s*'pod-/).slice(1);
for (const raw of podcastBlocks) {
  const block = `id: 'pod-${raw}`;
  const slug = /slug:\s*'([^']+)'/.exec(block)?.[1] ?? '(unknown)';
  const verified = /sourceVerified:\s*(true|false)/.exec(block)?.[1];
  const urlMatch = /sourceUrl:\s*(null|'[^']*'|"[^"]*")/.exec(block);
  if (!verified || !urlMatch) {
    push(`Podcast ${slug}: missing sourceVerified or sourceUrl field.`);
    continue;
  }
  if (verified === 'false' && urlMatch[1] !== 'null') {
    push(`Podcast ${slug}: sourceVerified is false but sourceUrl is non-null (${urlMatch[1]}).`);
  }
}

// —— TOTAL_PODCAST_COUNT without verification ——
if (/\bTOTAL_PODCAST_COUNT\b/.test(podcastsSrc)) {
  const verifiedCount = [...podcastsSrc.matchAll(/sourceVerified:\s*true/g)].length;
  if (verifiedCount === 0) {
    push('TOTAL_PODCAST_COUNT appears while no podcast sources are verified.');
  }
}

// —— Playbook detail routes must not be public while unverified ——
const playbooksUnverified = true; // no verified playbook publishing records for detail pages
const detailRendersContent =
  /playbookEntries/.test(playbookSlugSrc) ||
  (!/notFound\(\)/.test(playbookSlugSrc) && /export default function/.test(playbookSlugSrc));
const detailAlwaysNotFound =
  /notFound\(\)/.test(playbookSlugSrc) && !/playbookEntries/.test(playbookSlugSrc);

if (playbooksUnverified && detailRendersContent) {
  push('Playbook detail routes are public while playbooks remain unverified.');
}
if (playbooksUnverified && !detailAlwaysNotFound) {
  push('Playbook detail page must call notFound() and must not import playbookEntries while unverified.');
}
if (!/Operating tools, coming soon/.test(playbookIndexSrc)) {
  push('Playbook index must remain the coming-soon archive while details are unverified.');
}

// —— Public-copy scans ——
const publicScanRoots = [
  'app',
  'content/essays',
  'content/playbook',
  'content/podcasts',
  'content/newsletter',
  'content/press.ts',
  'content/publishing/records.ts',
  'lib',
];
const publicFiles = [];
for (const rel of publicScanRoots) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) continue;
  if (fs.statSync(abs).isFile()) publicFiles.push(rel);
  else walkFiles(rel, ['.ts', '.tsx', '.js', '.mjs', '.md', '.mdx'], publicFiles);
}

const PLACEHOLDER_URL_RE =
  /https?:\/\/[^\s"'`)]*(?:\/example\d*|\/example2\b)|(?:open\.spotify\.com\/show\/example|podcasts\.apple\.com\/example)/gi;
const PLACEHOLDER_PATH_RE = /['"`]https?:\/\/[^'"`]*\/example\d*['"`]|['"`]\/example\d*['"`]/gi;

const UNIVERSAL_RANGE_RES = [
  { name: '28-42%', re: /28\s*[–-]\s*42\s*%/i },
  { name: '25-40%', re: /25\s*[–-]\s*40\s*%/i },
  { name: 'under 20%', re: /under\s+20\s*%/i },
  { name: 'over 55%', re: /over\s+55\s*%/i },
  { name: 'over 60%', re: /over\s+60\s*%/i },
];

const MOAT_RE = /\bmoat\b/i;

for (const rel of publicFiles) {
  // Guard helper documents rejected placeholder paths; skip that file for placeholder path literals.
  const text = read(rel);
  const isPodcastGuard = rel === 'content/podcasts/seed.ts';

  if (!isPodcastGuard) {
    const urlHits = text.match(PLACEHOLDER_URL_RE) || [];
    const pathHits = text.match(PLACEHOLDER_PATH_RE) || [];
    for (const hit of [...urlHits, ...pathHits]) {
      push(`Placeholder URL/path in ${rel}: ${hit}`);
    }
  } else {
    // Still fail if an actual sourceUrl value uses a placeholder.
    for (const m of text.matchAll(/sourceUrl:\s*'([^']+)'/g)) {
      if (/\/example\d*$/i.test(m[1]) || /\/example2?\b/i.test(m[1])) {
        push(`Podcast sourceUrl placeholder in ${rel}: ${m[1]}`);
      }
    }
  }

  for (const { name, re } of UNIVERSAL_RANGE_RES) {
    if (re.test(text)) {
      push(`Unsupported universal range (${name}) in public copy: ${rel}`);
    }
  }

  if (MOAT_RE.test(text)) {
    push(`Prohibited term "moat" in public copy: ${rel}`);
  }
}

// Also scan full repo (except doctrine/evidence/scripts/node_modules) for /example placeholders in committed public-ish trees
const anywhereFiles = walkFiles('.', ['.ts', '.tsx', '.js', '.mjs', '.md', '.mdx']).filter((rel) => {
  if (rel.startsWith('node_modules/') || rel.startsWith('.next/')) return false;
  if (rel.startsWith('content/doctrine/')) return false;
  if (rel === 'content/publishing/public-claim-evidence.ts') return false;
  if (rel.startsWith('scripts/')) return false;
  return true;
});

for (const rel of anywhereFiles) {
  const text = read(rel);
  if (rel === 'content/podcasts/seed.ts') continue; // handled above
  const hits = text.match(/https?:\/\/[^\s"'`)]+\/example\d*/gi) || [];
  for (const hit of hits) push(`Placeholder URL appears in ${rel}: ${hit}`);
}

if (errors.length) {
  console.error('Content governance failed:\n');
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

console.log('Content governance check passed.');
console.log(`- Formula IDs aligned`);
console.log(`- ${essaySlugs.length} essays, ${podcastSlugs.length} podcasts, playbook index recorded`);
console.log(`- Podcast verification / playbook gating / prohibited copy checks clean`);
