#!/usr/bin/env node
/**
 * Public claim governance gate — briankramer.io
 *
 * DESIGN
 * ------
 * Dependency-free Node script that fails CI when public surfaces contain risky
 * claim patterns without evidence-registry coverage, publishing-record linkage,
 * or visible pending/qualified labels.
 *
 * Authority chain:
 *   1. content/publishing/public-claim-evidence.ts — claim registry (record())
 *   2. content/publishing/records.ts — approvedClaimIds linkage
 *   3. Visible UI labels — pending / provisional / in progress / citation pending
 *
 * Scan roots (public route + content surfaces):
 *   app/, components/, content/ (except content/doctrine/), lib/
 *
 * Excluded from risky-pattern scan:
 *   content/doctrine/* — doctrine source; never altered by this gate
 *   scripts/*, evidence registry itself
 *
 * Detection lanes:
 *   A. Registry integrity — required claim IDs + publishing-record linkage
 *   B. Structural guards — Person schema awards, book release dates, press labels
 *   C. Podcast provisional gate — duration/title/date/host fields when unverified
 *   D. Held/retired snippet ban — known bad claims must not reappear publicly
 *   E. Risky-pattern line scan — %, $, years, counts, superlatives
 *   F. Named publication guard — per-entry pending note or https URL
 *   G. Award claim guard — schema keys + prose award assertions
 *   H. Appearance-count guard — numeric appearance claims
 *   I. Coverage-immune field scan — podcast summary/title + approvedSummary
 *   J. sourceVerified invariant — true requires non-null https sourceUrl
 *   K. Verified press URL invariant — verified registry claims need https urls
 *
 * Pass rules:
 *   - Verified/approved claims: mapped in evidence registry or publishing records
 *   - Pending claims: visible label on same surface or registry sourcePath coverage
 *   - Held claims: must not appear outside doctrine/evidence registry
 *
 * Testing:
 *   export runPublicClaimGovernance(rootDir) — used by scripts/test-public-claims.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const PUBLIC_ROOTS = ['app', 'components', 'content', 'lib'];
const PUBLIC_EXTENSIONS = ['.ts', '.tsx', '.js', '.mjs', '.md', '.mdx'];
const EVIDENCE_PATH = 'content/publishing/public-claim-evidence.ts';
const DOCTRINE_PREFIX = 'content/doctrine/';
const IGNORED_HELD_SCAN = new Set([
  EVIDENCE_PATH,
  'content/doctrine/automotive-update-doctrine.ts',
  'content/doctrine/FORMULA_KNOWLEDGE.md',
  'content/doctrine/PUBLISHING_WORKFLOW.md',
]);

const REQUIRED_CLAIM_IDS = [
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

const HELD_CLAIM_SNIPPETS = [
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

const RISKY_PATTERNS = [
  { name: 'percentage', re: /\b\d+(?:\.\d+)?\s*%/ },
  { name: 'dollar amount', re: /\$\s?\d[\d,]*(?:\.\d+)?\b/ },
  { name: 'year', re: /\b20\d{2}\b/ },
  {
    name: 'count',
    re: /\b\d[\d,]*\s+(?:vehicles|stores|dealers|episodes|appearances|transactions|years|minutes|min)\b/i,
  },
  {
    name: 'superlative/absolute',
    re: /\b(first|inaugural|leading|best|most|every|never|always)\b/i,
  },
];

const LABEL_RE =
  /pending|source-verified|source verification|citation pending|in progress|qualified|provisional|withheld/i;

const NAMED_PUBLICATIONS = [
  'The Wall Street Journal',
  'Automotive News',
  'F&I Magazine',
  'Digital Dealer Magazine',
  'Jalopnik',
  'PBS "Viewpoint" with Dennis Quaid',
];

/** Per-entry pending/verified acceptance for pressMentions objects. */
const PRESS_PENDING_NOTE_RE =
  /source validation pending|citation pending|appearance citation pending/i;

const SCHEMA_AWARD_RES = [
  { name: 'award property', re: /\baward\s*:/ },
  { name: 'quoted award key', re: /['"]award['"]\s*:/ },
  { name: 'bracket award key', re: /\[['"]award['"]\]\s*=/ },
];

/** Coverage-immune scanners for fields that publish into UI / meta / JSON-LD. */
const HIGH_RISK_FIELD_RES = [
  { name: 'percentage', re: /\b\d+(?:\.\d+)?\s*%/ },
  { name: 'dollar amount', re: /\$\s?\d[\d,]*(?:\.\d+)?\b/ },
  {
    name: 'absolute superlative',
    // Bare "leading" is too broad ("are leading", "leading indicator").
    re: /\b(?:inaugural|(?:the|a)\s+leading|industry[\s-]first|first(?:\s+ever|\s+in\s+the\s+industry))\b/i,
  },
];

const HELD_PARAPHRASE_RES = [
  { name: '70% buyers trade paraphrase', re: /70\s*%\s+of\s+buyers/i },
  { name: '35% capture paraphrase', re: /(?:captures?|capture)\s+\w*\s*approximately\s+35\s*%|approximately\s+35\s*%/i },
  { name: '$2,000 auction penalty paraphrase', re: /\$\s?2,?000\b/ },
];

const AWARD_PATTERNS = [
  { name: 'schema award property', re: /\baward\s*:/ },
  {
    name: 'award assertion',
    re: /\b(?:won|received|named to|recognized (?:as|in|by)|honored (?:as|with)|inaugural)\b.{0,60}\b(?:award|40 Under 40|Top \d+)/i,
  },
];

const APPEARANCE_COUNT_PATTERNS = [
  { name: 'numeric appearance count', re: /\b\d[\d,]*\s+(?:podcast\s+)?appearances?\b/i },
  { name: 'appearance count phrase', re: /\b(?:over|more than|nearly|almost)\s+\d[\d,]*\s+appearances?\b/i },
  { name: 'appearance total claim', re: /\b\d+\+?\s+(?:media\s+)?appearances?\s+(?:and|across|on)\b/i },
];

const LINE_SKIP_RES = [
  /^import /,
  /^\/\//,
  /^\/\*/,
  /^\*/,
  /leading-relaxed|leading-snug/,
  /leading-tight|object-\[/,
  /href\?:\s*never/,
  /contentId:\s*'bk-/,
  /DRIFT_REVIEW|datePublished|dateModified|lastDriftReview/,
  /The Best End User/,
  /linkedin\.com\/pulse/,
  /durationMinutes|readingMinutes|publishDate/,
  /['"]\d+%['"]/,
  /\b(?:width|height|maxWidth|opacity|scale)\s*:\s*['"]?\d+%/i,
];

function lineNumber(text, index) {
  return text.slice(0, index).split('\n').length;
}

function hasRegistryClaimId(src, claimId) {
  return (
    new RegExp(`claimId:\\s*['"]${claimId}['"]`).test(src) ||
    new RegExp(`record\\(\\s*['"]${claimId}['"]`).test(src)
  );
}

function extractRegistryClaimIds(src) {
  const ids = new Set();
  for (const match of src.matchAll(/claimId:\s*['"]([^'"]+)['"]/g)) ids.add(match[1]);
  for (const match of src.matchAll(/record\(\s*['"]([^'"]+)['"]/g)) ids.add(match[1]);
  return ids;
}

function extractRegistrySourcePaths(src) {
  const paths = new Set();
  for (const match of src.matchAll(/sourcePath:\s*['"]([^'"]+)['"]/g)) paths.add(match[1]);
  for (const block of src.split(/record\(/).slice(1)) {
    const strings = [...block.matchAll(/'([^']*)'/g)].map((match) => match[1]);
    if (strings.length >= 5) paths.add(strings[4]);
  }
  return paths;
}


function extractRecordEvidenceStatus(src, claimId) {
  // Positional record(claimId, claimText, evidenceClass, evidenceStatus, ...)
  const positional = new RegExp(
    `record\\(\\s*'${claimId}'\\s*,\\s*'[^']*'\\s*,\\s*'[^']*'\\s*,\\s*'([^']*)'`,
  ).exec(src);
  if (positional) return positional[1];
  // Object-style claimId + evidenceStatus near the same record block.
  const objectBlock = new RegExp(
    `claimId:\\s*'${claimId}'[\\s\\S]{0,240}?evidenceStatus:\\s*'([^']*)'`,
  ).exec(src);
  return objectBlock?.[1] ?? null;
}

function shouldSkipLine(trimmed) {
  if (!trimmed) return true;
  if (LINE_SKIP_RES.some((re) => re.test(trimmed))) return true;
  if (/linear-gradient|fontSize:|background:|#[0-9A-Fa-f]{3,8}\s+\d+%/.test(trimmed)) return true;
  return false;
}

function isPublicScanFile(rel) {
  if (rel.startsWith(DOCTRINE_PREFIX)) return false;
  if (rel === EVIDENCE_PATH) return false;
  if (rel.startsWith('scripts/')) return false;
  return true;
}

/** Parse pressMentions object literals so labels cannot leak across entries. */
function extractPressMentionEntries(pressSrc) {
  // Allow both `pressMentions = [` and `pressMentions: Type = [`.
  const match = pressSrc.match(
    /export const pressMentions(?:\s*:\s*[^=]+)?\s*=\s*\[([\s\S]*?)\]\s*;/,
  );
  if (!match) return [];
  const entries = [];
  for (const objectMatch of match[1].matchAll(/\{([^{}]+)\}/g)) {
    const block = objectMatch[1];
    const publication = /publication:\s*'((?:\\'|[^'])*)'/.exec(block)?.[1];
    if (!publication) continue;
    const note = /note:\s*'((?:\\'|[^'])*)'/.exec(block)?.[1];
    const url = /url:\s*'((?:\\'|[^'])*)'/.exec(block)?.[1];
    entries.push({ publication, note, url, block });
  }
  return entries;
}

function pressEntryHasPendingLabel(entry) {
  return Boolean(entry.note && PRESS_PENDING_NOTE_RE.test(entry.note));
}

function pressEntryHasVerifiedUrl(entry) {
  return Boolean(entry.url && /^https:\/\//i.test(entry.url));
}

/** Extract single-quoted field values (supports multi-line values). */
function extractSingleQuotedFields(src, fieldName) {
  const values = [];
  const re = new RegExp(`${fieldName}:\\s*'([^']*)'`, 'g');
  for (const match of src.matchAll(re)) {
    values.push({ value: match[1], index: match.index ?? 0 });
  }
  return values;
}

function scanHighRiskText(push, surface, text) {
  for (const snippet of HELD_CLAIM_SNIPPETS) {
    if (text.includes(snippet)) {
      push(`Held/retired claim appears in ${surface} — ${snippet}`);
    }
  }
  for (const pattern of HELD_PARAPHRASE_RES) {
    if (pattern.re.test(text)) {
      push(`Held-claim paraphrase (${pattern.name}) appears in ${surface}`);
    }
  }
  for (const pattern of HIGH_RISK_FIELD_RES) {
    if (pattern.re.test(text)) {
      push(`Risky ${pattern.name} claim in publishable field ${surface}`);
    }
  }
}

/**
 * Run the public-claim governance gate against a repository root.
 * @param {string} [rootDir=process.cwd()]
 * @returns {{ ok: boolean, errors: string[], warnings: string[], stats: Record<string, number> }}
 */
export function runPublicClaimGovernance(rootDir = process.cwd()) {
  const root = path.resolve(rootDir);
  const errors = [];
  const warnings = [];

  function read(rel) {
    return fs.readFileSync(path.join(root, rel), 'utf8');
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

  const evidenceSrc = read(EVIDENCE_PATH);
  const recordsSrc = read('content/publishing/records.ts');
  const pressSrc = read('content/press.ts');
  const podcastPageSrc = read('app/podcast/page.tsx');
  const podcastSeedSrc = read('content/podcasts/seed.ts');
  const homeSrc = read('app/page.tsx');
  const layoutSrc = read('app/layout.tsx');

  const publicFiles = PUBLIC_ROOTS.flatMap((rel) => walkFiles(rel, PUBLIC_EXTENSIONS));
  const scanFiles = publicFiles.filter(isPublicScanFile);

  for (const claimId of REQUIRED_CLAIM_IDS) {
    if (!hasRegistryClaimId(evidenceSrc, claimId)) {
      push(`Missing public-claim evidence registry record: ${claimId}`);
    }
  }

  const evidenceClaimIds = extractRegistryClaimIds(evidenceSrc);
  const evidenceSourcePaths = extractRegistrySourcePaths(evidenceSrc);
  const approvedClaimIds = [
    ...recordsSrc.matchAll(/approvedClaimIds:\s*\[([\s\S]*?)\]/g),
  ].flatMap((m) => [...m[1].matchAll(/['"]([^'"]+)['"]/g)].map((hit) => hit[1]));

  for (const claimId of approvedClaimIds) {
    if (!evidenceClaimIds.has(claimId)) {
      push(`Publishing record references missing public-claim evidence record: ${claimId}`);
    }
  }

  // —— Lane B: Person schema award (layout + any schema-like award key) ——
  for (const pattern of SCHEMA_AWARD_RES) {
    if (pattern.re.test(layoutSrc)) {
      push(`Unsupported Person schema award claim appears in app/layout.tsx (${pattern.name}).`);
    }
  }
  for (const rel of scanFiles) {
    if (rel === 'app/layout.tsx') continue;
    const text = read(rel);
    for (const pattern of SCHEMA_AWARD_RES) {
      if (!pattern.re.test(text)) continue;
      push(`Unsupported schema award key (${pattern.name}) appears in ${rel}.`);
    }
  }

  if (/Coming\s+20\d{2}|ships\s+in\s+20\d{2}|release(?:s|d)?\s+20\d{2}/i.test(homeSrc)) {
    push('Homepage contains date-specific book release language without verified source record.');
  }
  if (!/A book\s*·\s*In progress/.test(homeSrc) || !/>In progress</.test(homeSrc)) {
    push('Homepage book treatment must remain visible as “In progress.”');
  }

  // —— Lane F: per-entry press labels (no cross-entry leak) ——
  const pressEntries = extractPressMentionEntries(pressSrc);
  if (!pressEntries.length && /pressMentions/.test(pressSrc)) {
    push('Unable to parse pressMentions entries in content/press.ts.');
  }
  for (const entry of pressEntries) {
    if (!NAMED_PUBLICATIONS.includes(entry.publication)) continue;
    const pending = pressEntryHasPendingLabel(entry);
    const verifiedUrl = pressEntryHasVerifiedUrl(entry);
    if (!pending && !verifiedUrl) {
      push(
        `Named publication lacks visible pending/source label in content/press.ts: ${entry.publication}`,
      );
    }
    if (entry.url && !/^https:\/\//i.test(entry.url)) {
      push(`Press mention URL must be https for ${entry.publication}.`);
    }
    if (verifiedUrl && pending) {
      // Allowed: rare transitional state; no error.
    }
  }

  // Evidence-verified press claim IDs must have a matching https URL on the press entry.
  const verifiedPressClaimToPublication = [
    ['press-automotive-news-source-pending', 'Automotive News'],
    ['press-fandi-source-pending', 'F&I Magazine'],
    ['press-digital-dealer-source-pending', 'Digital Dealer Magazine'],
    ['press-jalopnik-source-pending', 'Jalopnik'],
  ];
  for (const [claimId, publication] of verifiedPressClaimToPublication) {
    const verifiedInRegistry = extractRecordEvidenceStatus(evidenceSrc, claimId) === 'verified';
    if (!verifiedInRegistry) continue;
    const entry = pressEntries.find((item) => item.publication === publication);
    if (!entry || !pressEntryHasVerifiedUrl(entry)) {
      push(
        `Verified claim ${claimId} requires https url on press mention "${publication}".`,
      );
    }
  }

  if (!/pressMentions\.map/.test(homeSrc) || !/p\.note/.test(homeSrc)) {
    push('Homepage press mentions must render pending/source labels from content/press.ts.');
  }

  for (const rel of scanFiles) {
    if (rel === 'content/press.ts') continue;
    const text = read(rel);
    const hasCoverage = evidenceSourcePaths.has(rel);
    for (const publication of NAMED_PUBLICATIONS) {
      const index = text.indexOf(publication);
      if (index === -1) continue;
      const line = text.split('\n')[lineNumber(text, index) - 1] ?? '';
      if (hasCoverage || LABEL_RE.test(line) || LABEL_RE.test(text.slice(Math.max(0, index - 120), index + 160))) {
        continue;
      }
      push(
        `Named publication "${publication}" lacks registry coverage or visible pending label in ${rel}:${lineNumber(text, index)}`,
      );
    }
  }

  // —— Lane C: podcast source-field gate + sourceVerified URL integrity ——
  const podcastClaimFieldsRender =
    /podcasts\.map/.test(podcastPageSrc) &&
    /pod\.(?:title|publishDate|podcastHost|durationMinutes)/.test(podcastPageSrc);
  const podcastBannerRequired =
    /titles, dates, hosts, and durations are not source-verified yet/.test(podcastPageSrc) &&
    /Source verification pending/.test(podcastPageSrc);

  if (podcastClaimFieldsRender && !podcastBannerRequired) {
    push('/podcast must visibly label titles, dates, hosts, and durations as not source-verified.');
  }

  if (/durationMinutes/.test(podcastPageSrc) && !podcastBannerRequired) {
    push('Podcast duration claims render without provisional source-verification label.');
  }

  const podcastBlocks = podcastSeedSrc.split(/\{\s*\n\s*id:\s*'pod-/).slice(1);
  for (const raw of podcastBlocks) {
    const block = `id: 'pod-${raw}`;
    const slug = /slug:\s*'([^']+)'/.exec(block)?.[1] ?? '(unknown)';
    const verified = /sourceVerified:\s*(true|false)/.exec(block)?.[1];
    const urlMatch = /sourceUrl:\s*(null|'[^']*'|"[^"]*")/.exec(block);
    const hasClaimFields =
      /title:\s*'/.test(block) ||
      /publishDate:\s*'/.test(block) ||
      /podcastHost:\s*'/.test(block) ||
      /durationMinutes:\s*\d+/.test(block);
    if (verified === 'false' && hasClaimFields && podcastClaimFieldsRender && !podcastBannerRequired) {
      push(`Podcast ${slug} exposes provisional title/date/host/duration fields without visible provisional label.`);
    }
    if (verified === 'true') {
      const url = urlMatch?.[1];
      if (!url || url === 'null' || !/^['"]https:\/\//i.test(url)) {
        push(`Podcast ${slug}: sourceVerified true requires a non-null https sourceUrl.`);
      }
      if (url && /example\d*/i.test(url)) {
        push(`Podcast ${slug}: sourceVerified true cannot use placeholder sourceUrl (${url}).`);
      }
    }
  }

  // —— Coverage-immune publishable field scans (DEF-2 / DEF-3) ——
  for (const field of extractSingleQuotedFields(podcastSeedSrc, 'summary')) {
    scanHighRiskText(push, `content/podcasts/seed.ts summary`, field.value);
  }
  for (const field of extractSingleQuotedFields(podcastSeedSrc, 'title')) {
    scanHighRiskText(push, `content/podcasts/seed.ts title`, field.value);
  }
  for (const field of extractSingleQuotedFields(recordsSrc, 'approvedSummary')) {
    scanHighRiskText(push, `content/publishing/records.ts approvedSummary`, field.value);
  }

  // —— Lane D: held/retired snippet ban ——
  for (const rel of publicFiles) {
    if (IGNORED_HELD_SCAN.has(rel)) continue;
    if (rel.startsWith(DOCTRINE_PREFIX)) continue;
    const text = read(rel);
    for (const snippet of HELD_CLAIM_SNIPPETS) {
      const index = text.indexOf(snippet);
      if (index !== -1) {
        push(`Held/retired claim appears in ${rel}:${lineNumber(text, index)} — ${snippet}`);
      }
    }
  }

  for (const rel of scanFiles) {
    const text = read(rel);
    const hasCoverage = evidenceSourcePaths.has(rel);
    const lines = text.split('\n');
    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (shouldSkipLine(trimmed)) return;
      for (const pattern of AWARD_PATTERNS) {
        if (!pattern.re.test(trimmed)) continue;
        if (hasCoverage || LABEL_RE.test(trimmed)) continue;
        push(`Award claim (${pattern.name}) lacks registry coverage or visible label in ${rel}:${idx + 1}: ${trimmed}`);
      }
    });
  }

  for (const rel of scanFiles) {
    const text = read(rel);
    const hasCoverage = evidenceSourcePaths.has(rel);
    const lines = text.split('\n');
    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (shouldSkipLine(trimmed)) return;
      for (const pattern of APPEARANCE_COUNT_PATTERNS) {
        if (!pattern.re.test(trimmed)) continue;
        if (hasCoverage || LABEL_RE.test(trimmed)) continue;
        push(
          `Appearance-count claim (${pattern.name}) lacks registry coverage or visible label in ${rel}:${idx + 1}: ${trimmed}`,
        );
      }
    });
  }

  for (const rel of scanFiles) {
    const text = read(rel);
    const hasFileRegistryCoverage = evidenceSourcePaths.has(rel);
    const lines = text.split('\n');
    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (shouldSkipLine(trimmed)) return;
      for (const pattern of RISKY_PATTERNS) {
        if (!pattern.re.test(trimmed)) continue;
        if (LABEL_RE.test(trimmed) || hasFileRegistryCoverage) continue;
        push(`Risky ${pattern.name} claim lacks registry coverage or visible label in ${rel}:${idx + 1}: ${trimmed}`);
      }
    });
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    stats: {
      filesScanned: scanFiles.length,
      evidenceRecords: evidenceClaimIds.size,
      publishingClaimLinks: approvedClaimIds.length,
    },
  };
}

function reportCli(result) {
  if (!result.ok) {
    console.error('Public claim governance failed:\n');
    for (const error of result.errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log('Public claim governance check passed.');
  console.log(
    `- Files scanned: ${result.stats.filesScanned} public surfaces across ${PUBLIC_ROOTS.join(', ')}`,
  );
  console.log(`- Evidence registry records: ${result.stats.evidenceRecords}`);
  console.log(`- Publishing-record claim links: ${result.stats.publishingClaimLinks}`);
  console.log('- Required PR #4 evidence records present');
  console.log('- Named publication pending/verified source labels present');
  console.log('- Podcast source-field exposure policy clean');
  console.log('- Person schema award remains removed');
  console.log('- Held/retired public claims absent');
}

const isDirectRun =
  process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isDirectRun) {
  reportCli(runPublicClaimGovernance(process.cwd()));
}
