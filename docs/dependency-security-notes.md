# Dependency Security Notes

Last reviewed: 2026-07-26

## npm audit status

- `npm audit --audit-level=critical` exits clean after upgrading to Next.js 16.
- Remaining `npm audit` findings are high-severity `brace-expansion` reports through dev-only ESLint tooling:
  - `eslint -> minimatch@3 -> brace-expansion@1`
  - `@eslint/eslintrc -> minimatch@3 -> brace-expansion@1`
  - `eslint-plugin-import -> minimatch@3 -> brace-expansion@1`
  - `eslint-plugin-jsx-a11y -> minimatch@3 -> brace-expansion@1`
  - `eslint-plugin-react -> minimatch@3 -> brace-expansion@1`

## Resolution attempted

- `brace-expansion@5.0.8` override was rejected because `minimatch@3` expects the older callable CommonJS API and lint broke.
- Direct minimatch overrides were not compatible; `npm ls` marked nested `minimatch@3.1.5` installs invalid.
- `eslint@10` via `npm audit fix --force` broke the current Next/React lint stack.
- A scoped `@eslint/config-array@0.23.5` override is compatible and removes one vulnerable ESLint branch while keeping `npm run lint` green.

## Deferral

The remaining findings are dev-toolchain-only and are not shipped in the production Next.js bundle. Keep Dependabot enabled for npm updates and revisit when one of these lands:

- `eslint-config-next` supports ESLint 10 cleanly.
- ESLint 9 releases replace `minimatch@3` in `eslint` and `@eslint/eslintrc`.
- `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, and `eslint-plugin-react` replace `minimatch@3`.
