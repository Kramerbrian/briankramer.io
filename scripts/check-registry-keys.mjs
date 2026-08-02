#!/usr/bin/env node
/**
 * Registry key integrity check.
 *
 * The content-governance scanners verify that public CLAIMS are backed by
 * evidence. They do not verify that the registries themselves are internally
 * consistent. With multiple agents writing to this repo in parallel, the
 * realistic failure is two branches independently minting the SAME queueId or
 * claimId, then merging — producing a registry with duplicate primary keys and
 * silently contradictory records.
 *
 * This check enforces three invariants:
 *   1. queueId is unique across sourceValidationQueue.
 *   2. claimId is unique across publicClaimEvidence.
 *   3. Referential integrity: every claimId referenced by a queue entry exists
 *      in the evidence registry, and is not a retired record.
 *
 * Exits non-zero with a specific, actionable message on any violation.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const PRESS = 'content/press.ts';
const EVIDENCE = 'content/publishing/public-claim-evidence.ts';

const read = (rel) => readFileSync(resolve(process.cwd(), rel), 'utf8');

const errors = [];
const push = (msg) => errors.push(msg);

/** Line number of a character offset, 1-indexed. */
const lineAt = (text, index) => text.slice(0, index).split('\n').length;

// —— Collect queueIds ——
const pressSrc = read(PRESS);
const queueIds = [];
for (const m of pressSrc.matchAll(/queueId:\s*'([^']+)'/g)) {
  queueIds.push({ id: m[1], line: lineAt(pressSrc, m.index) });
}

// —— Collect claimIds referenced by queue entries ——
const referencedClaimIds = [];
for (const m of pressSrc.matchAll(/claimIds:\s*\[([^\]]*)\]/g)) {
  const block = m[1];
  for (const c of block.matchAll(/'([^']+)'/g)) {
    referencedClaimIds.push({ id: c[1], line: lineAt(pressSrc, m.index) });
  }
}

// —— Collect claimIds defined in the evidence registry ——
const evidenceSrc = read(EVIDENCE);
const claimIds = [];
for (const m of evidenceSrc.matchAll(/record\(\s*'([^']+)'/g)) {
  claimIds.push({ id: m[1], line: lineAt(evidenceSrc, m.index) });
}

// Retired records: capture the claimId and the evidenceStatus that follows it.
const retired = new Set();
for (const m of evidenceSrc.matchAll(/record\(\s*'([^']+)'[\s\S]{0,600}?'(retired)'/g)) {
  retired.add(m[1]);
}

// —— Invariant 1: unique queueId ——
const seenQueue = new Map();
for (const { id, line } of queueIds) {
  if (seenQueue.has(id)) {
    push(
      `Duplicate queueId '${id}' in ${PRESS} (lines ${seenQueue.get(id)} and ${line}). ` +
        `Two branches likely minted the same key independently — reconcile before merging.`,
    );
  } else {
    seenQueue.set(id, line);
  }
}

// —— Invariant 2: unique claimId ——
const seenClaim = new Map();
for (const { id, line } of claimIds) {
  if (seenClaim.has(id)) {
    push(
      `Duplicate claimId '${id}' in ${EVIDENCE} (lines ${seenClaim.get(id)} and ${line}). ` +
        `Two branches likely minted the same key independently — reconcile before merging.`,
    );
  } else {
    seenClaim.set(id, line);
  }
}

// —— Invariant 3: referential integrity ——
for (const { id, line } of referencedClaimIds) {
  if (!seenClaim.has(id)) {
    push(
      `Queue entry at ${PRESS}:${line} references claimId '${id}', which does not exist in ${EVIDENCE}. ` +
        `Either the evidence record was dropped, or the queue entry was written against a different branch's registry.`,
    );
    continue;
  }
  if (retired.has(id)) {
    push(
      `Queue entry at ${PRESS}:${line} references claimId '${id}', which is marked 'retired' in ${EVIDENCE}. ` +
        `A retired record must not back a live queue entry.`,
    );
  }
}

// —— Report ——
if (errors.length > 0) {
  console.error('Registry key integrity check failed:\n');
  for (const e of errors) console.error(`- ${e}`);
  console.error(
    `\n${errors.length} violation(s). These indicate concurrent edits to the governance ` +
      `registries that were not reconciled.`,
  );
  process.exit(1);
}

console.log('Registry key integrity check passed.');
console.log(`- ${queueIds.length} queue entries, all queueId values unique`);
console.log(`- ${claimIds.length} evidence records, all claimId values unique`);
console.log(`- ${referencedClaimIds.length} claimId references resolve to live (non-retired) records`);
