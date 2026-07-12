#!/usr/bin/env node
/**
 * Public claim governance gate.
 *
 * Fails when risky public claims appear without registry coverage, visible
 * pending labels, or publishing-record linkage. This intentionally stays
 * dependency-free so it can run inside the existing content-governance check.
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
      if (['node_modules', '.next', '.git'].includes(entry.name)) continue;
      walkFiles(rel, exts, out);
    } else if (exts.some((ext) => entry.name.endsWith(ext))) {
      out.push(rel);
    }
  }
  return out;
}

function push(message) {
  errors.push(message);
}

function lineNumber(text, index) {
  return text.slice(0, index).split('\n').length;
}

const evidencePath = 'content/publishing/public-claim-evidence.ts';
const evidenceSrc = read(evidencePath);
const recordsSrc = read('content/publishing/records.ts');
const pressSrc = read('content/press.ts');
const podcastPageSrc = read('app/podcast/page.tsx');
const podcastSeedSrc = read('content/podcasts/seed.ts');
const homeSrc = read('app/page.tsx');
const layoutSrc = read('app/layout.tsx');

const requiredClaimIds = [
  'press-wsj-source-pending',
  'press-automotive-news-source-pending',
  'press-fandi-source-pending',
  'press-digital-dealer-source-pending',
  'press-jalopnik-source-pending',
  'press-pbs-viewpoint-source-pending',
  'pub-podcast-fields-provisional',
  'pub-book-release-in-progress',
  'schema-person-award-removed',
];

for (const claimId of requiredClaimIds) {
  if (!new RegExp(`claimId:\\s*['\"]${claimId}['\"]`).test(evidenceSrc)) {
    push(`Missing public-claim evidence registry record: ${claimId}`);
  }
}

const evidenceClaimIds = new Set(
  [...evidenceSrc.matchAll(/claimId:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]),
);
const approvedClaimIds = [
  ...recordsSrc.matchAll(/approvedClaimIds:\s*\[([\s\S]*?)\]/g),
].flatMap((m) => [...m[1].matchAll(/['"]([^'"]+)['"]/g)].map((hit) => hit[1]));

for (const claimId of approvedClaimIds) {
  if (!evidenceClaimIds.has(claimId)) {
    push(`Publishing record references missing public-claim evidence record: ${claimId}`);
  }
}

// Person schema must not carry unsupported awards while the primary citation is pending.
if (/\baward\s*:/.test(layoutSrc)) {
  push('Unsupported Person schema award claim appears in app/layout.tsx.');
}

// Book release dates must stay non-date-specific until a source record exists.
if (/Coming\s+20\d{2}|ships\s+in\s+20\d{2}|release(?:s|d)?\s+20\d{2}/i.test(homeSrc)) {
  push('Homepage contains date-specific book release language without verified source record.');
}
if (!/A book\s*·\s*In progress/.test(homeSrc) || !/>In progress</.test(homeSrc)) {
  push('Homepage book treatment must remain visible as “In progress.”');
}

// Named publication mentions must either carry verified source URLs or visible pending/citation labels.
const publicationRules = [
  { name: 'The Wall Street Journal', label: /The Wall Street Journal[\s\S]{0,160}Source validation pending/ },
  { name: 'Automotive News', label: /Automotive News[\s\S]{0,220}(citation pending|Source validation pending)/i },
  { name: 'F&I Magazine', label: /F&I Magazine[\s\S]{0,160}Source validation pending/ },
  { name: 'Digital Dealer Magazine', label: /Digital Dealer Magazine[\s\S]{0,160}Source validation pending/ },
  { name: 'Jalopnik', label: /Jalopnik[\s\S]{0,160}Source validation pending/ },
  { name: 'PBS "Viewpoint" with Dennis Quaid', label: /PBS \"Viewpoint\" with Dennis Quaid[\s\S]{0,180}Appearance citation pending/ },
];

for (const rule of publicationRules) {
  if (pressSrc.includes(rule.name) && !rule.label.test(pressSrc)) {
    push(`Named publication lacks visible pending/source label in content/press.ts: ${rule.name}`);
  }
}

if (!/pressMentions\.map/.test(homeSrc) || !/p\.note/.test(homeSrc)) {
  push('Homepage press mentions must render pending/source labels from content/press.ts.');
}

// Podcast fields are public claims while sourceVerified remains false. They pass only with the visible provisional banner.
const podcastBannerRequired =
  /titles, dates, hosts, and durations are not source-verified yet/.test(podcastPageSrc) &&
  /Source verification pending/.test(podcastPageSrc);
if (!podcastBannerRequired) {
  push('/podcast must visibly label titles, dates, hosts, and durations as not source-verified.');
}

const podcastBlocks = podcastSeedSrc.split(/\{\s*\n\s*id:\s*'pod-/).slice(1);
for (const raw of podcastBlocks) {
  const block = `id: 'pod-${raw}`;
  const slug = /slug:\s*'([^']+)'/.exec(block)?.[1] ?? '(unknown)';
  const verified = /sourceVerified:\s*(true|false)/.exec(block)?.[1];
  const hasClaimFields =
    /title:\s*'/.test(block) ||
    /publishDate:\s*'/.test(block) ||
    /podcastHost:\s*'/.test(block) ||
    /durationMinutes:\s*\d+/.test(block);
  if (verified === 'false' && hasClaimFields && !podcastBannerRequired) {
    push(`Podcast ${slug} exposes provisional title/date/host/duration fields without visible provisional label.`);
  }
}

// Held and retired claim text should not reappear in public surfaces outside the evidence registry and doctrine source.
const heldClaimSnippets = [
  'More than 70% of buyers have a vehicle to trade or sell',
  'average dealership captures approximately 35%',
  '100,000-plus appraisal study',
  'Ninety percent of buyers overlap',
  '12.7% of U.S. consumer acquisitions',
  'Every missed trade creates a $2,000 auction penalty',
  'reconditioning variance exceeds $1,400',
  'Under 20% Look-to-Book',
  'healthy range is 28–42%',
  '84% of shoppers read reviews',
  '71% of them decide on a dealer before they call',
  'Drive-sourced offer close rate under 20%',
  '$100–$250 per vehicle',
  'AI punishes dealerships',
  'AI indexes every dealership behavior',
  'AI cannot be manipulated',
];

const publicRoots = ['app', 'components', 'content', 'lib'];
const publicFiles = publicRoots.flatMap((rel) => walkFiles(rel, ['.ts', '.tsx', '.js', '.mjs', '.md', '.mdx']));
const ignoredForHeldScan = new Set([
  evidencePath,
  'content/doctrine/automotive-update-doctrine.ts',
  'content/doctrine/FORMULA_KNOWLEDGE.md',
  'content/doctrine/PUBLISHING_WORKFLOW.md',
]);

for (const rel of publicFiles) {
  if (ignoredForHeldScan.has(rel)) continue;
  if (rel.startsWith('content/doctrine/')) continue;
  const text = read(rel);
  for (const snippet of heldClaimSnippets) {
    const index = text.indexOf(snippet);
    if (index !== -1) {
      push(`Held/retired claim appears in ${rel}:${lineNumber(text, index)} — ${snippet}`);
    }
  }
}

// Broad risky-pattern scan: detects common claim classes and requires either registry coverage for the file
// or an explicit visible pending/qualified label near the claim. This catches newly introduced public claims.
const riskyPatterns = [
  { name: 'percentage', re: /\b\d+(?:\.\d+)?\s*%\b/ },
  { name: 'dollar amount', re: /\$\s?\d[\d,]*(?:\.\d+)?\b/ },
  { name: 'year', re: /\b20\d{2}\b/ },
  { name: 'count', re: /\b\d[\d,]*\s+(?:vehicles|stores|dealers|episodes|appearances|transactions|years|minutes|min)\b/i },
  { name: 'superlative/absolute', re: /\b(first|inaugural|leading|best|most|every|never|always)\b/i },
];
const labelRe = /pending|source-verified|source verification|citation pending|in progress|qualified|provisional|withheld/i;
const fileCoverageRe = (rel) => new RegExp(`sourcePath:\\s*['\"]${rel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['\"]`);
const scanFiles = publicFiles.filter((rel) => {
  if (rel.startsWith('content/doctrine/')) return false;
  if (rel === evidencePath) return false;
  if (rel.startsWith('scripts/')) return false;
  return true;
});

for (const rel of scanFiles) {
  const text = read(rel);
  const hasFileRegistryCoverage = fileCoverageRe(rel).test(evidenceSrc);
  const lines = text.split('\n');
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('import ') || trimmed.startsWith('//')) return;
    for (const pattern of riskyPatterns) {
      if (!pattern.re.test(trimmed)) continue;
      if (labelRe.test(trimmed) || hasFileRegistryCoverage) continue;
      if (/datePublished|dateModified|lastDriftReview|durationMinutes|readingMinutes|publishDate/.test(trimmed)) {
        continue;
      }
      push(`Risky ${pattern.name} claim lacks registry coverage or visible label in ${rel}:${idx + 1}: ${trimmed}`);
    }
  });
}

if (errors.length) {
  console.error('Public claim governance failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Public claim governance check passed.');
console.log('- Required PR #4 evidence records present');
console.log('- Named publication pending labels present');
console.log('- Podcast provisional source-field labels present');
console.log('- Person schema award remains removed');
console.log('- Held/retired public claims absent');
