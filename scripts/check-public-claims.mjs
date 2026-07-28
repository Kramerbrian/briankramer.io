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
 *   B. Structural guards — Person schema awards (award/honorificAward/awards), book dates
 *   C. Podcast provisional gate — duration/title/date/host fields when unverified
 *   D. Held/retired snippet ban — known bad claims must not reappear publicly
 *   E. Risky-pattern line scan — %, $, dated releases, counts, promotional superlatives
 *   F. Named publication guard — dynamic pressMentions entries; pending note or https URL
 *   G. Award claim guard — schema keys + prose award assertions
 *   H. Appearance-count guard — numeric appearance claims
 *   I. Coverage-immune field scan — podcast summary/title + approvedSummary
 *   J. sourceVerified invariant — true requires non-null https sourceUrl
 *   K. Verified press URL invariant — verified press-* claims need https urls
 *
 * Pass rules:
 *   - Verified/approved claims: claim-scoped registry coverage (claimText overlap on sourcePath)
 *     or publishing-record linkage — sourcePath listing alone does not blanket a file
 *   - Pending claims: visible label in a tight proximity window or claim-scoped coverage
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
  // Bare years (publishDate, award years, URLs) are too noisy; flag dated release claims only.
  {
    name: 'dated release claim',
    re: /\b(?:coming|ships?(?:\s+in)?|releases?(?:\s+in)?|launches?(?:\s+in)?)\s+20\d{2}\b/i,
  },
  {
    name: 'count',
    re: /\b\d[\d,]*\s+(?:vehicles|stores|dealers|episodes|appearances|transactions|years|minutes|min)\b/i,
  },
  // Trim FP superlatives ("most recently", "best practices", bare every/never/first/leading,
  // and instructional "the best dealer" shopper-query examples).
  {
    name: 'superlative/absolute',
    re: /\b(?:inaugural|(?:the|a)\s+leading|(?:the|an?)\s+first\s+to\b|industry[\s-]first|first\s+ever|first\s+in\s+the\s+industry)\b/i,
  },
];

const LABEL_RE =
  /pending|source-verified|source verification|citation pending|in progress|qualified|provisional|withheld/i;

/** Tight proximity window for labels near a named-publication mention (chars). */
const LABEL_WINDOW_BEFORE = 40;
const LABEL_WINDOW_AFTER = 80;

/** Per-entry pending/verified acceptance for pressMentions objects. */
const PRESS_PENDING_NOTE_RE =
  /source validation pending|citation pending|appearance citation pending/i;

const SCHEMA_AWARD_KEYS = ['award', 'honorificAward', 'awards'];
const SCHEMA_AWARD_RES = SCHEMA_AWARD_KEYS.flatMap((key) => [
  { name: `${key} property`, re: new RegExp(`\\b${key}\\s*:`) },
  { name: `quoted ${key} key`, re: new RegExp(`['"]${key}['"]\\s*:`) },
  { name: `bracket ${key} key`, re: new RegExp(`\\[['"]${key}['"]\\]\\s*=`) },
]);

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

/**
 * Parse registry records from positional record(...) calls and object literals.
 * @returns {Array<{ claimId: string, claimText: string, evidenceStatus: string, sourcePath: string, publicTreatment: string }>}
 */
function extractRegistryRecords(src) {
  const records = [];
  for (const block of src.split(/record\(/).slice(1)) {
    const strings = [...block.matchAll(/'([^']*)'/g)].map((match) => match[1]);
    if (strings.length < 7) continue;
    records.push({
      claimId: strings[0],
      claimText: strings[1],
      evidenceStatus: strings[3],
      sourcePath: strings[4],
      publicTreatment: strings[6],
    });
  }
  // Object-style fallbacks (rare in this repo, but keep Lane K robust).
  for (const match of src.matchAll(
    /claimId:\s*'([^']+)'[\s\S]{0,320}?claimText:\s*'([^']*)'[\s\S]{0,320}?evidenceStatus:\s*'([^']*)'[\s\S]{0,320}?sourcePath:\s*'([^']*)'[\s\S]{0,320}?publicTreatment:\s*'([^']*)'/g,
  )) {
    if (records.some((record) => record.claimId === match[1])) continue;
    records.push({
      claimId: match[1],
      claimText: match[2],
      evidenceStatus: match[3],
      sourcePath: match[4],
      publicTreatment: match[5],
    });
  }
  return records;
}

function extractRecordEvidenceStatus(src, claimId) {
  const fromRecords = extractRegistryRecords(src).find((record) => record.claimId === claimId);
  if (fromRecords) return fromRecords.evidenceStatus;
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

function normalizeClaimText(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9%\s$.,]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Claim-scoped registry coverage: a sourcePath listing alone does not blanket a file.
 * A line is covered only when a record for that path has meaningful claimText overlap.
 */
function lineHasClaimScopedCoverage(rel, line, registryRecords) {
  const hay = normalizeClaimText(line);
  if (!hay) return false;
  for (const record of registryRecords) {
    if (record.sourcePath !== rel) continue;
    if (record.publicTreatment === 'remove') continue;
    const claim = normalizeClaimText(record.claimText);
    if (!claim) continue;
    if (claim.length >= 12 && hay.includes(claim)) return true;
    if (hay.length >= 12 && claim.includes(hay)) return true;
    const tokens = claim.split(' ').filter((token) => token.length >= 4 || /\d/.test(token));
    if (tokens.length < 2) continue;
    const matched = tokens.filter((token) => hay.includes(token));
    const needed = Math.min(3, Math.ceil(tokens.length * 0.5));
    if (matched.length >= needed && matched.length >= 2) return true;
  }
  return false;
}

function hasNearbyLabel(text, index, matchLength = 0) {
  const start = Math.max(0, index - LABEL_WINDOW_BEFORE);
  const end = Math.min(text.length, index + matchLength + LABEL_WINDOW_AFTER);
  return LABEL_RE.test(text.slice(start, end));
}

/** Match a verified press-* registry record to a pressMentions publication. */
function publicationMatchesVerifiedRecord(entry, record) {
  const publication = entry.publication.toLowerCase();
  if (record.claimText.toLowerCase().includes(publication)) return true;
  const slug = record.claimId
    .replace(/^press-/, '')
    .replace(/-source-pending$/, '')
    .replace(/-/g, ' ')
    .toLowerCase();
  if (!slug) return false;
  const compactPub = publication.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  return compactPub.includes(slug) || slug.includes(compactPub);
}

/**
 * Named-publication prose coverage without blanketing whole files.
 * Accepts nearby labels, claim-text overlap, publication-named records on the
 * same path, or provisional/pending labeled surface coverage for that path.
 */
function namedPublicationCovered(rel, publication, line, text, index, registryRecords) {
  if (LABEL_RE.test(line) || hasNearbyLabel(text, index, publication.length)) return true;
  if (lineHasClaimScopedCoverage(rel, line, registryRecords)) return true;
  const pubNorm = normalizeClaimText(publication);
  return registryRecords.some((record) => {
    if (record.sourcePath !== rel || record.publicTreatment === 'remove') return false;
    const blob = normalizeClaimText(`${record.claimId} ${record.claimText}`);
    if (pubNorm && blob.includes(pubNorm)) return true;
    if (
      record.publicTreatment === 'label' &&
      (record.evidenceStatus === 'pending' || record.evidenceStatus === 'qualified') &&
      /provisional|source verification|not source verified|withheld|archive/.test(blob)
    ) {
      return true;
    }
    return false;
  });
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
  const registryRecords = extractRegistryRecords(evidenceSrc);
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

  // —— Lane F: per-entry press labels (dynamic — every pressMentions publication) ——
  const pressEntries = extractPressMentionEntries(pressSrc);
  if (!pressEntries.length && /pressMentions/.test(pressSrc)) {
    push('Unable to parse pressMentions entries in content/press.ts.');
  }
  const namedPublications = pressEntries.map((entry) => entry.publication);
  for (const entry of pressEntries) {
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
  }

  // Evidence-verified press claims must have a matching https URL on the press entry.
  // Dynamic: any verified press-* registry record mapped to a pressMentions publication.
  for (const record of registryRecords) {
    if (record.evidenceStatus !== 'verified') continue;
    if (!record.claimId.startsWith('press-')) continue;
    const entry = pressEntries.find((item) => publicationMatchesVerifiedRecord(item, record));
    if (!entry) {
      push(
        `Verified claim ${record.claimId} has no matching pressMentions publication for claim text.`,
      );
      continue;
    }
    if (!pressEntryHasVerifiedUrl(entry)) {
      push(
        `Verified claim ${record.claimId} requires https url on press mention "${entry.publication}".`,
      );
    }
  }

  if (!/pressMentions\.map/.test(homeSrc) || !/p\.note/.test(homeSrc)) {
    push('Homepage press mentions must render pending/source labels from content/press.ts.');
  }

  // Catalog linkage files are governed by Lane F/K + claim IDs, not prose publication scans.
  const skipNamedPubProseScan = new Set(['content/publishing/records.ts']);
  for (const rel of scanFiles) {
    if (rel === 'content/press.ts') continue;
    if (skipNamedPubProseScan.has(rel)) continue;
    const text = read(rel);
    for (const publication of namedPublications) {
      let fromIndex = 0;
      while (fromIndex < text.length) {
        const index = text.indexOf(publication, fromIndex);
        if (index === -1) break;
        fromIndex = index + publication.length;
        const line = text.split('\n')[lineNumber(text, index) - 1] ?? '';
        if (namedPublicationCovered(rel, publication, line, text, index, registryRecords)) {
          continue;
        }
        push(
          `Named publication "${publication}" lacks registry coverage or visible pending label in ${rel}:${lineNumber(text, index)}`,
        );
      }
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
    const lines = text.split('\n');
    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (shouldSkipLine(trimmed)) return;
      for (const pattern of AWARD_PATTERNS) {
        if (!pattern.re.test(trimmed)) continue;
        if (LABEL_RE.test(trimmed) || lineHasClaimScopedCoverage(rel, trimmed, registryRecords)) {
          continue;
        }
        push(`Award claim (${pattern.name}) lacks registry coverage or visible label in ${rel}:${idx + 1}: ${trimmed}`);
      }
    });
  }

  for (const rel of scanFiles) {
    const text = read(rel);
    const lines = text.split('\n');
    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (shouldSkipLine(trimmed)) return;
      for (const pattern of APPEARANCE_COUNT_PATTERNS) {
        if (!pattern.re.test(trimmed)) continue;
        if (LABEL_RE.test(trimmed) || lineHasClaimScopedCoverage(rel, trimmed, registryRecords)) {
          continue;
        }
        push(
          `Appearance-count claim (${pattern.name}) lacks registry coverage or visible label in ${rel}:${idx + 1}: ${trimmed}`,
        );
      }
    });
  }

  for (const rel of scanFiles) {
    const text = read(rel);
    const lines = text.split('\n');
    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (shouldSkipLine(trimmed)) return;
      for (const pattern of RISKY_PATTERNS) {
        if (!pattern.re.test(trimmed)) continue;
        if (LABEL_RE.test(trimmed) || lineHasClaimScopedCoverage(rel, trimmed, registryRecords)) {
          continue;
        }
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
