/**
 * Deterministic public-claim governance fixtures.
 *
 * Each case builds a minimal repo tree from a passing scaffold, then applies
 * one mutation. The test runner writes trees to a temp dir and asserts.
 *
 * No production content files are modified by these fixtures.
 *
 * Acceptance matrix (required fail/pass proofs):
 *   FAIL — Person schema Automotive News award          → fail-person-schema-award
 *   FAIL — honorificAward schema key                    → fail-honorific-award
 *   FAIL — Homepage “Coming 2026”                       → fail-coming-2026
 *   FAIL — Named publication without pending label      → fail-named-publication-no-label
 *   FAIL — Dynamic press entry outside legacy list      → fail-dynamic-publication-no-label
 *   FAIL — Distant pending label outside tight window   → fail-distant-pending-label
 *   FAIL — Podcast duration without provisional label   → fail-podcast-duration-no-provisional
 *   FAIL — Held 70% / 35% / $2,000 claims               → fail-held-70-35-2000
 *   FAIL — “first” / “leading” without registry coverage → fail-first-leading-no-coverage
 *   FAIL — File sourcePath alone does not blanket file  → fail-file-coverage-not-blanket
 *   FAIL — Verified press claim without https URL       → fail-verified-press-missing-url
 *   PASS — Pending publication with visible label       → pass-pending-publication-label
 *   PASS — Book “In progress”                           → pass-book-in-progress
 *   PASS — Podcast provisional archive disclaimer       → pass-podcast-provisional
 *   PASS — Verified/qualified claim with claim-text coverage
 *        → pass-verified-registry-coverage, pass-qualified-registry-coverage
 *   PASS — FP trim: most recently / best practices / bare year
 *        → pass-superlative-year-false-positives
 */

/** Required claim IDs the live gate expects in the evidence registry. */
const REQUIRED_RECORDS = [
  ['press-wsj-source-pending', 'content/press.ts'],
  ['press-automotive-news-source-pending', 'content/press.ts'],
  ['press-fandi-source-pending', 'content/press.ts'],
  ['press-digital-dealer-source-pending', 'content/press.ts'],
  ['press-jalopnik-source-pending', 'content/press.ts'],
  ['press-pbs-viewpoint-source-pending', 'content/press.ts'],
  ['pub-podcast-fields-provisional', 'app/podcast/page.tsx'],
  ['pub-book-release-in-progress', 'app/page.tsx'],
  ['schema-person-award-removed', 'app/layout.tsx'],
];

/**
 * @param {Array<[string, string] | [string, string, string, string] | [string, string, string, string, string]>} extraRecords
 *   [id, sourcePath] or [id, sourcePath, evidenceStatus, publicTreatment]
 *   or [id, sourcePath, evidenceStatus, publicTreatment, claimText]
 */
function evidenceRegistry(extraRecords = []) {
  const requiredRows = REQUIRED_RECORDS.map(
    ([id, sourcePath]) => [id, sourcePath, 'pending', 'label', `${id} fixture claim.`],
  );
  const extraRows = extraRecords.map((row) => {
    const [
      id,
      sourcePath,
      evidenceStatus = 'pending',
      publicTreatment = 'label',
      claimText = `${id} fixture claim.`,
    ] = row;
    return [id, sourcePath, evidenceStatus, publicTreatment, claimText];
  });
  const rows = [...requiredRows, ...extraRows]
    .map(
      ([id, sourcePath, evidenceStatus, publicTreatment, claimText]) => `  record(
    '${id}',
    '${claimText.replace(/'/g, "\\'")}',
    'source-validation',
    '${evidenceStatus}',
    '${sourcePath}',
    'Fixture registry coverage.',
    '${publicTreatment}',
    'Fixture note.',
  ),`,
    )
    .join('\n');

  return `function record(claimId, claimText, evidenceClass, evidenceStatus, sourcePath, sourceDetail, publicTreatment, notes) {
  return { claimId, claimText, evidenceClass, evidenceStatus, sourcePath, sourceDetail, publicTreatment, notes };
}

export const publicClaimEvidence = [
${rows}
];
`;
}

function recordsFile(approvedIds = []) {
  const ids = approvedIds.map((id) => `'${id}'`).join(', ');
  return `export const publishingRecords = [
  {
    contentId: 'bk-fixture',
    approvedClaimIds: [${ids}],
  },
];
`;
}

function pressFile({
  wsjNote = 'Source validation pending',
  includeWsj = true,
  extraEntries = '',
} = {}) {
  const wsj = includeWsj
    ? `  { publication: 'The Wall Street Journal', note: '${wsjNote}' },\n`
    : '';
  return `export const pressMentions = [
${wsj}  { publication: 'Automotive News', note: 'citation pending' },
  { publication: 'F&I Magazine', note: 'Source validation pending' },
  { publication: 'Digital Dealer Magazine', note: 'Source validation pending' },
  { publication: 'Jalopnik', note: 'Source validation pending' },
  { publication: 'PBS "Viewpoint" with Dennis Quaid', note: 'Appearance citation pending' },
${extraEntries}];
`;
}

function homeFile({
  bookEyebrow = 'A book · In progress',
  bookBadge = 'In progress',
  extra = '',
} = {}) {
  return `export default function HomePage() {
  return (
    <>
      <p className="eyebrow">${bookEyebrow}</p>
      <p className="text-[11px] uppercase tracking-widest text-white/60">${bookBadge}</p>
      <ul>
        {pressMentions.map((p) => (
          <li key={p.publication}>
            <p>{p.publication}</p>
            {p.note && <p className="note">{p.note}</p>}
          </li>
        ))}
      </ul>
      ${extra}
    </>
  );
}

import { pressMentions } from '@/content/press';
`;
}

function layoutFile({ withAward = false } = {}) {
  const awardLine = withAward ? `\n  award: 'Automotive News 40 Under 40',\n` : '\n';
  return `const personSchema = {
  '@type': 'Person',
  name: 'Brian Kramer',${awardLine}};

export default function RootLayout({ children }) {
  return <html><body>{children}</body></html>;
}
`;
}

function podcastPageFile({ withProvisional = true, withDuration = true } = {}) {
  const banner = withProvisional
    ? `<p>Provisional archive: titles, dates, hosts, and durations are not source-verified yet.</p>
      <span>Source verification pending</span>`
    : `<p>Podcast archive</p>`;
  const duration = withDuration ? `<span>{pod.durationMinutes} min</span>` : '';
  return `export default function PodcastPage() {
  const podcasts = [];
  return (
    <section>
      ${banner}
      <ul>
        {podcasts.map((pod) => (
          <li key={pod.id}>
            ${duration}
          </li>
        ))}
      </ul>
    </section>
  );
}
`;
}

function podcastSeedFile() {
  return `export const podcastAppearances = [
  {
    id: 'pod-fixture-1',
    slug: 'fixture-episode',
    title: 'Fixture episode',
    publishDate: '2024-01-01',
    podcastHost: 'Fixture Host',
    durationMinutes: 42,
    sourceVerified: false,
    sourceUrl: null,
  },
];
`;
}

/** Minimal tree that satisfies the live gate. */
export function passingScaffold(overrides = {}) {
  const files = {
    'content/publishing/public-claim-evidence.ts': evidenceRegistry(),
    'content/publishing/records.ts': recordsFile(),
    'content/press.ts': pressFile(),
    'content/podcasts/seed.ts': podcastSeedFile(),
    'app/page.tsx': homeFile(),
    'app/layout.tsx': layoutFile(),
    'app/podcast/page.tsx': podcastPageFile(),
    'lib/site.ts': `export const siteName = 'fixture';\n`,
    ...overrides,
  };
  return files;
}

/**
 * @typedef {{ id: string, expect: 'fail'|'pass', errorIncludes?: string[], build: () => Record<string,string> }} FixtureCase
 */

/** @type {FixtureCase[]} */
export const FIXTURE_CASES = [
  {
    id: 'fail-person-schema-award',
    expect: 'fail',
    errorIncludes: [
      'Unsupported Person schema award claim appears in app/layout.tsx',
    ],
    build: () =>
      passingScaffold({
        // award value is Automotive News 40 Under 40 (see layoutFile).
        'app/layout.tsx': layoutFile({ withAward: true }),
      }),
  },
  {
    id: 'fail-honorific-award',
    expect: 'fail',
    errorIncludes: ['Unsupported Person schema award claim appears in app/layout.tsx'],
    build: () =>
      passingScaffold({
        'app/layout.tsx': `const personSchema = {
  '@type': 'Person',
  name: 'Brian Kramer',
  honorificAward: 'Automotive News 40 Under 40',
};

export default function RootLayout({ children }) {
  return <html><body>{children}</body></html>;
}
`,
      }),
  },
  {
    id: 'fail-coming-2026',
    expect: 'fail',
    errorIncludes: ['Homepage contains date-specific book release language'],
    build: () =>
      passingScaffold({
        'app/page.tsx': homeFile({
          bookEyebrow: 'A book · Coming 2026',
          bookBadge: 'Coming 2026',
        }),
      }),
  },
  {
    id: 'fail-named-publication-no-label',
    expect: 'fail',
    errorIncludes: [
      'Named publication lacks visible pending/source label in content/press.ts: The Wall Street Journal',
    ],
    build: () =>
      passingScaffold({
        // Cross-entry pending text must NOT satisfy WSJ's own entry.
        'content/press.ts': pressFile({ wsjNote: 'Featured mention' }),
      }),
  },
  {
    id: 'fail-dynamic-publication-no-label',
    expect: 'fail',
    errorIncludes: [
      'Named publication lacks visible pending/source label in content/press.ts: Car and Driver',
    ],
    build: () =>
      passingScaffold({
        'content/press.ts': pressFile({
          extraEntries: `  { publication: 'Car and Driver', note: 'Featured profile' },\n`,
        }),
      }),
  },
  {
    id: 'fail-distant-pending-label',
    expect: 'fail',
    errorIncludes: [
      'Named publication "The Wall Street Journal" lacks registry coverage or visible pending label',
    ],
    build: () =>
      passingScaffold({
        'app/about/page.tsx': `export default function AboutPage() {
  return (
    <div>
      <p>The Wall Street Journal covered the operator story in detail across several desks.</p>
      <p>${'x'.repeat(200)} Source validation pending for unrelated copy.</p>
    </div>
  );
}
`,
      }),
  },
  {
    id: 'fail-podcast-duration-no-provisional',
    expect: 'fail',
    errorIncludes: [
      'Podcast duration claims render without provisional source-verification label',
    ],
    build: () =>
      passingScaffold({
        'app/podcast/page.tsx': podcastPageFile({ withProvisional: false, withDuration: true }),
      }),
  },
  {
    id: 'fail-held-70-35-2000',
    expect: 'fail',
    errorIncludes: [
      'More than 70% of buyers have a vehicle to trade or sell',
      'average dealership captures approximately 35%',
      'Every missed trade creates a $2,000 auction penalty',
    ],
    build: () =>
      passingScaffold({
        'app/about/page.tsx': `export default function AboutPage() {
  return (
    <p>
      More than 70% of buyers have a vehicle to trade or sell.
      The average dealership captures approximately 35% of trades.
      Every missed trade creates a $2,000 auction penalty.
    </p>
  );
}
`,
      }),
  },
  {
    id: 'fail-first-leading-no-coverage',
    expect: 'fail',
    errorIncludes: ['Risky superlative/absolute claim lacks registry coverage'],
    build: () =>
      passingScaffold({
        'components/ClaimCard.tsx': `export function ClaimCard() {
  return <p>We are the leading platform and the first to ship this model.</p>;
}
`,
      }),
  },
  {
    id: 'fail-file-coverage-not-blanket',
    expect: 'fail',
    errorIncludes: ['Risky superlative/absolute claim lacks registry coverage'],
    build: () =>
      passingScaffold({
        // about/page.tsx is a registered sourcePath for other claims, but file listing
        // alone must not exempt an unrelated promotional superlative.
        'content/publishing/public-claim-evidence.ts': evidenceRegistry([
          [
            'bio-fixture-about-other',
            'app/about/page.tsx',
            'pending',
            'label',
            'Two decades as a General Manager with biography evidence pending.',
          ],
        ]),
        'app/about/page.tsx': `export default function AboutPage() {
  return <p>We are the leading platform for dealer growth desks.</p>;
}
`,
      }),
  },
  {
    id: 'fail-podcast-summary-held',
    expect: 'fail',
    errorIncludes: ['Held/retired claim appears in content/podcasts/seed.ts summary'],
    build: () =>
      passingScaffold({
        'content/podcasts/seed.ts': `export const podcastAppearances = [
  {
    id: 'pod-fixture-1',
    slug: 'fixture-episode',
    title: 'Fixture episode',
    summary: 'More than 70% of buyers have a vehicle to trade or sell in this market.',
    publishDate: '2024-01-01',
    podcastHost: 'Fixture Host',
    durationMinutes: 42,
    sourceVerified: false,
    sourceUrl: null,
  },
];
`,
      }),
  },
  {
    id: 'fail-approved-summary-held',
    expect: 'fail',
    errorIncludes: ['Held/retired claim appears in content/publishing/records.ts approvedSummary'],
    build: () =>
      passingScaffold({
        'content/publishing/records.ts': `export const publishingRecords = [
  {
    contentId: 'bk-fixture',
    approvedClaimIds: [],
    approvedSummary: 'Every missed trade creates a $2,000 auction penalty for the desk.',
  },
];
`,
      }),
  },
  {
    id: 'fail-source-verified-without-https',
    expect: 'fail',
    errorIncludes: ['sourceVerified true requires a non-null https sourceUrl'],
    build: () =>
      passingScaffold({
        'content/podcasts/seed.ts': `export const podcastAppearances = [
  {
    id: 'pod-fixture-1',
    slug: 'fixture-episode',
    title: 'Fixture episode',
    summary: 'A safe summary with no held benchmarks.',
    publishDate: '2024-01-01',
    podcastHost: 'Fixture Host',
    durationMinutes: 42,
    sourceVerified: true,
    sourceUrl: null,
  },
];
`,
      }),
  },
  {
    id: 'fail-schema-bracket-award',
    expect: 'fail',
    errorIncludes: ['Unsupported schema award key'],
    build: () =>
      passingScaffold({
        'app/about/page.tsx': `const personSchema = {};
personSchema['award'] = 'Automotive News 40 Under 40';
export default function AboutPage() {
  return <p>About</p>;
}
`,
      }),
  },
  {
    id: 'fail-verified-press-missing-url',
    expect: 'fail',
    errorIncludes: [
      'Verified claim press-automotive-news-source-pending requires https url on press mention "Automotive News"',
    ],
    build: () => {
      const files = passingScaffold({
        'content/press.ts': `export const pressMentions = [
  { publication: 'The Wall Street Journal', note: 'Source validation pending' },
  { publication: 'Automotive News', note: '2012 Retail 40 Under 40 — primary award page' },
  { publication: 'F&I Magazine', note: 'Source validation pending' },
  { publication: 'Digital Dealer Magazine', note: 'Source validation pending' },
  { publication: 'Jalopnik', note: 'Source validation pending' },
  { publication: 'PBS "Viewpoint" with Dennis Quaid', note: 'Appearance citation pending' },
];
`,
      });
      files['content/publishing/public-claim-evidence.ts'] = evidenceRegistry().replace(
        "'press-automotive-news-source-pending',\n    'press-automotive-news-source-pending fixture claim.',\n    'source-validation',\n    'pending',",
        "'press-automotive-news-source-pending',\n    'Automotive News mention and 40 Under 40 recognition.',\n    'source-validation',\n    'verified',",
      );
      return files;
    },
  },
  {
    id: 'pass-pending-publication-label',
    expect: 'pass',
    build: () =>
      passingScaffold({
        'content/press.ts': pressFile({ wsjNote: 'Source validation pending' }),
      }),
  },
  {
    id: 'pass-book-in-progress',
    expect: 'pass',
    build: () =>
      passingScaffold({
        'app/page.tsx': homeFile({
          bookEyebrow: 'A book · In progress',
          bookBadge: 'In progress',
        }),
      }),
  },
  {
    id: 'pass-podcast-provisional',
    expect: 'pass',
    build: () =>
      passingScaffold({
        'app/podcast/page.tsx': podcastPageFile({ withProvisional: true, withDuration: true }),
      }),
  },
  {
    id: 'pass-verified-registry-coverage',
    expect: 'pass',
    build: () =>
      passingScaffold({
        'content/publishing/public-claim-evidence.ts': evidenceRegistry([
          [
            'pub-fixture-covered-claim',
            'components/CoveredClaim.tsx',
            'verified',
            'publish',
            'A leading operator narrative with first-party operating proof.',
          ],
        ]),
        'content/publishing/records.ts': recordsFile(['pub-fixture-covered-claim']),
        'components/CoveredClaim.tsx': `export function CoveredClaim() {
  return <p>A leading operator narrative with first-party operating proof.</p>;
}
`,
      }),
  },
  {
    id: 'pass-qualified-registry-coverage',
    expect: 'pass',
    build: () =>
      passingScaffold({
        'content/publishing/public-claim-evidence.ts': evidenceRegistry([
          [
            'pub-fixture-qualified-claim',
            'components/QualifiedClaim.tsx',
            'qualified',
            'qualify',
            'A leading desk practice with first-pass proof still being qualified.',
          ],
        ]),
        'content/publishing/records.ts': recordsFile(['pub-fixture-qualified-claim']),
        'components/QualifiedClaim.tsx': `export function QualifiedClaim() {
  return <p>A leading desk practice with first-pass proof still being qualified.</p>;
}
`,
      }),
  },
  {
    id: 'pass-superlative-year-false-positives',
    expect: 'pass',
    build: () =>
      passingScaffold({
        'components/OperatorNote.tsx': `export function OperatorNote() {
  return (
    <p>
      Most recently we used best practices from the 2024 floor guide. Fix that first.
      The first set will publish when source material is ready.
    </p>
  );
}
`,
      }),
  },
];
