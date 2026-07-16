#!/usr/bin/env node
/**
 * Deterministic regression runner for scripts/check-public-claims.mjs
 *
 * Writes each fixture tree to a temp directory, runs runPublicClaimGovernance,
 * and asserts expected fail/pass outcomes + error substrings.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runPublicClaimGovernance } from './check-public-claims.mjs';
import { FIXTURE_CASES } from './fixtures/public-claims/cases.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function writeTree(root, files) {
  for (const [rel, contents] of Object.entries(files)) {
    const abs = path.join(root, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, contents, 'utf8');
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function runCase(fixtureCase) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `bk-public-claims-${fixtureCase.id}-`));
  try {
    writeTree(tmp, fixtureCase.build());
    const result = runPublicClaimGovernance(tmp);

    if (fixtureCase.expect === 'pass') {
      assert(
        result.ok,
        `${fixtureCase.id}: expected PASS but failed with:\n- ${result.errors.join('\n- ')}`,
      );
      return { id: fixtureCase.id, expect: 'pass', ok: true };
    }

    assert(!result.ok, `${fixtureCase.id}: expected FAIL but gate passed`);
    for (const needle of fixtureCase.errorIncludes ?? []) {
      assert(
        result.errors.some((err) => err.includes(needle)),
        `${fixtureCase.id}: expected error containing ${JSON.stringify(needle)}\nGot:\n- ${result.errors.join('\n- ')}`,
      );
    }
    return { id: fixtureCase.id, expect: 'fail', ok: true, errorCount: result.errors.length };
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

function main() {
  const results = [];
  const failures = [];

  for (const fixtureCase of FIXTURE_CASES) {
    try {
      results.push(runCase(fixtureCase));
      console.log(`PASS ${fixtureCase.id} (${fixtureCase.expect})`);
    } catch (error) {
      failures.push(fixtureCase.id);
      console.error(`FAIL ${fixtureCase.id}`);
      console.error(`  ${error.message}`);
    }
  }

  console.log('');
  console.log(
    `Public-claim fixture summary: ${results.length} passed, ${failures.length} failed, ${FIXTURE_CASES.length} total`,
  );
  console.log(`Fixture definitions: ${path.join(__dirname, 'fixtures/public-claims/cases.mjs')}`);

  if (failures.length) {
    process.exit(1);
  }
}

main();
