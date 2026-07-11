import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const registryPath = path.join(root, 'content/doctrine/automotive-update-doctrine.ts');
const markdownPath = path.join(root, 'content/doctrine/FORMULA_KNOWLEDGE.md');

const registry = fs.readFileSync(registryPath, 'utf8');
const markdown = fs.readFileSync(markdownPath, 'utf8');

const formulaBlock = registry.match(/export const automotiveUpdateFormulas:[\s\S]*?= \[([\s\S]*?)\n\];/);
if (!formulaBlock) throw new Error('Could not locate automotiveUpdateFormulas registry.');

const registryIds = [...formulaBlock[1].matchAll(/\bid:\s*'([^']+)'/g)].map((match) => match[1]);
const markdownIds = [...markdown.matchAll(/^## Formula: ([a-z0-9-]+)$/gm)].map((match) => match[1]);

const duplicates = (ids) => [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
const missing = registryIds.filter((id) => !markdownIds.includes(id));
const undocumented = markdownIds.filter((id) => !registryIds.includes(id));
const registryDuplicates = duplicates(registryIds);
const markdownDuplicates = duplicates(markdownIds);

const errors = [];
if (missing.length) errors.push(`Registry IDs missing from Markdown: ${missing.join(', ')}`);
if (undocumented.length) errors.push(`Markdown IDs absent from registry: ${undocumented.join(', ')}`);
if (registryDuplicates.length) errors.push(`Duplicate registry IDs: ${registryDuplicates.join(', ')}`);
if (markdownDuplicates.length) errors.push(`Formula IDs documented more than once: ${markdownDuplicates.join(', ')}`);
if (registryIds.length !== markdownIds.length) {
  errors.push(`Formula count mismatch: registry=${registryIds.length}, markdown=${markdownIds.length}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Formula governance check passed: ${registryIds.length} formula IDs map exactly once.`);
