export interface PressMention {
  publication: string;
  note?: string;
  url?: string;
}

export const pressMentions: PressMention[] = [
  { publication: 'The Wall Street Journal', note: 'Source validation pending' },
  { publication: 'Automotive News', note: 'Automotive News “40 Under 40” recognition; citation pending' },
  { publication: 'F&I Magazine', note: 'Source validation pending' },
  { publication: 'Digital Dealer Magazine', note: 'Source validation pending' },
  { publication: 'Jalopnik', note: 'Source validation pending' },
  { publication: 'PBS "Viewpoint" with Dennis Quaid', note: 'Appearance citation pending' },
];

export interface Credential {
  label: string;
  detail?: string;
  year?: string;
}

export const credentials: Credential[] = [
  {
    label: 'Automotive News “40 Under 40” recognition',
    detail: 'Biography evidence; primary award citation pending',
  },
  {
    label: 'Former member, Google Dealer Advisory Board',
    detail: 'Biography evidence; roster confirmation pending',
  },
  {
    label: 'Helped lead an early end-to-end paperless automotive transaction',
    detail: 'Qualified claim — absolute “industry first” not asserted here',
    year: '2020',
  },
  {
    label: 'Facilitated an early Web3 transaction in automotive retail',
    detail: 'Qualified claim — absolute “industry first” not asserted here',
  },
  {
    label: 'Former GM, Germain Toyota of Naples & Germain Lincoln of Naples',
    detail: 'Reported store volume above 7,500 retail vehicles annually (biography evidence; ledger confirmation pending)',
  },
];

/** Source-validation queue status. Nothing is verified here without primary or durable source. */
export type SourceValidationStatus = 'pending' | 'qualified';

/** Public treatment allowed while a queue item remains unverified. */
export type SourceValidationTreatment = 'label' | 'qualify' | 'remove';

export interface SourceValidationQueueItem {
  queueId: string;
  claimIds: string[];
  currentPublicClaim: string;
  currentStatus: SourceValidationStatus;
  exactSourceNeeded: string;
  acceptableEvidenceTypes: string[];
  publicTreatmentUntilVerified: SourceValidationTreatment;
  remainPublic: boolean;
  publicSurfaces: string[];
  removalTrigger?: string;
}

/**
 * Named publication and biography claims awaiting primary or durable source validation.
 * Linked to content/publishing/public-claim-evidence.ts by claimIds.
 * Do not mark verified without supplied source artifacts.
 */
export const sourceValidationQueue: SourceValidationQueueItem[] = [
  {
    queueId: 'svq-wsj-mention',
    claimIds: ['press-wsj-source-pending'],
    currentPublicClaim:
      'Homepage “Featured in” lists The Wall Street Journal with note: Source validation pending. No URL is published.',
    currentStatus: 'pending',
    exactSourceNeeded:
      'Primary WSJ article or profile naming Brian Kramer as subject, quoted source, or bylined author — with headline, publication date, and durable permalink or archivable citation.',
    acceptableEvidenceTypes: [
      'WSJ.com permalink (subscriber or archived)',
      'Nexis/Lexis or equivalent news-archive printable article with metadata',
      'Print edition citation: date, section, page, headline',
    ],
    publicTreatmentUntilVerified: 'label',
    remainPublic: true,
    publicSurfaces: ['app/page.tsx (Featured in)', 'content/press.ts'],
    removalTrigger: 'Remove from pressMentions if no primary WSJ citation is found after source search.',
  },
  {
    queueId: 'svq-automotive-news-40-under-40',
    claimIds: ['press-automotive-news-source-pending', 'bio-an-40-under-40'],
    currentPublicClaim:
      'Homepage press lists Automotive News with “40 Under 40” recognition; citation pending. About credentials repeat the recognition with primary award citation pending. Person schema award property remains removed.',
    currentStatus: 'pending',
    exactSourceNeeded:
      'Official Automotive News 40 Under 40 honoree record naming Brian Kramer with award year/class and publication or announcement date.',
    acceptableEvidenceTypes: [
      'Automotive News official award or honoree page URL',
      'Automotive News published honoree announcement with date',
      'Durable archived capture of AN property page with URL and timestamp',
    ],
    publicTreatmentUntilVerified: 'label',
    remainPublic: true,
    publicSurfaces: [
      'app/page.tsx (Featured in)',
      'app/about/page.tsx (credentials)',
      'content/press.ts',
      'content/podcasts/seed.ts (provisional archive entry only)',
    ],
    removalTrigger:
      'Do not add Person schema award or verified URL until primary AN citation is supplied. Remove credential if honoree status cannot be substantiated.',
  },
  {
    queueId: 'svq-fandi-mention',
    claimIds: ['press-fandi-source-pending'],
    currentPublicClaim:
      'Homepage “Featured in” lists F&I Magazine with note: Source validation pending. No URL is published.',
    currentStatus: 'pending',
    exactSourceNeeded:
      'Primary F&I Magazine article, profile, or interview URL naming Brian Kramer with headline and publication date.',
    acceptableEvidenceTypes: [
      'F&I Magazine permalink',
      'Wayback Machine or equivalent archived publisher URL',
      'Print issue citation: volume, issue, date, page, headline',
    ],
    publicTreatmentUntilVerified: 'label',
    remainPublic: true,
    publicSurfaces: ['app/page.tsx (Featured in)', 'content/press.ts'],
    removalTrigger: 'Remove from pressMentions if no primary F&I citation is found after source search.',
  },
  {
    queueId: 'svq-digital-dealer-mention',
    claimIds: ['press-digital-dealer-source-pending'],
    currentPublicClaim:
      'Homepage “Featured in” lists Digital Dealer Magazine with note: Source validation pending. No URL is published.',
    currentStatus: 'pending',
    exactSourceNeeded:
      'Primary Digital Dealer Magazine article, profile, or interview URL naming Brian Kramer with headline and publication date.',
    acceptableEvidenceTypes: [
      'Digital Dealer Magazine permalink',
      'Wayback Machine or equivalent archived publisher URL',
      'Print or digital issue citation with date and headline',
    ],
    publicTreatmentUntilVerified: 'label',
    remainPublic: true,
    publicSurfaces: ['app/page.tsx (Featured in)', 'content/press.ts'],
    removalTrigger:
      'Remove from pressMentions if no primary Digital Dealer citation is found after source search.',
  },
  {
    queueId: 'svq-jalopnik-mention',
    claimIds: ['press-jalopnik-source-pending'],
    currentPublicClaim:
      'Homepage “Featured in” lists Jalopnik with note: Source validation pending. No URL is published.',
    currentStatus: 'pending',
    exactSourceNeeded:
      'Primary Jalopnik article or post URL naming Brian Kramer with headline and publication date.',
    acceptableEvidenceTypes: [
      'Jalopnik.com permalink',
      'Wayback Machine or equivalent archived publisher URL',
      'Syndicated repost only if it traces to the original Jalopnik URL',
    ],
    publicTreatmentUntilVerified: 'label',
    remainPublic: true,
    publicSurfaces: ['app/page.tsx (Featured in)', 'content/press.ts'],
    removalTrigger: 'Remove from pressMentions if no primary Jalopnik citation is found after source search.',
  },
  {
    queueId: 'svq-pbs-viewpoint-appearance',
    claimIds: ['press-pbs-viewpoint-source-pending'],
    currentPublicClaim:
      'Homepage “Featured in” lists PBS "Viewpoint" with Dennis Quaid with note: Appearance citation pending. No episode URL is published.',
    currentStatus: 'pending',
    exactSourceNeeded:
      'PBS episode page, program guide entry, or broadcast metadata showing Brian Kramer appearance on Viewpoint with Dennis Quaid including air date or episode identifier.',
    acceptableEvidenceTypes: [
      'PBS.org episode or series page URL',
      'PBS program guide or distributor episode listing with date',
      'Official PBS press or programming document naming guest and air date',
    ],
    publicTreatmentUntilVerified: 'label',
    remainPublic: true,
    publicSurfaces: ['app/page.tsx (Featured in)', 'content/press.ts'],
    removalTrigger:
      'Remove from pressMentions if no primary appearance citation is found. Do not add listen/watch URL until verified.',
  },
  {
    queueId: 'svq-google-dealer-advisory-board',
    claimIds: ['bio-google-dealer-advisory-board'],
    currentPublicClaim:
      'About credentials list: Former member, Google Dealer Advisory Board — biography evidence; roster confirmation pending.',
    currentStatus: 'pending',
    exactSourceNeeded:
      'Google-issued invitation, published board roster, or official Google/Cars program announcement listing Brian Kramer as advisory board member with service period.',
    acceptableEvidenceTypes: [
      'Google or Google-partner invitation email or letter (author-held)',
      'Official Google press release or program page naming board members',
      'Archived Google dealer program page listing advisory board roster',
      'Employer or Google liaison roster export with dates (author-held, redacted as needed)',
    ],
    publicTreatmentUntilVerified: 'label',
    remainPublic: true,
    publicSurfaces: ['app/about/page.tsx (credentials)', 'content/press.ts'],
    removalTrigger:
      'Remove credential if board membership cannot be substantiated. Do not upgrade to verified without roster or invitation artifact.',
  },
  {
    queueId: 'svq-early-web3-transaction',
    claimIds: ['bio-web3-first-transaction'],
    currentPublicClaim:
      'About credentials list: Facilitated an early Web3 transaction in automotive retail — qualified claim; absolute “industry first” not asserted.',
    currentStatus: 'pending',
    exactSourceNeeded:
      'Transaction record, dealer/OEM announcement, trade-press article, or on-chain evidence identifying the dealership transaction Brian Kramer facilitated, with date and transaction context.',
    acceptableEvidenceTypes: [
      'On-chain transaction hash plus contextual deal summary (privacy-redacted)',
      'Dealer or OEM press release describing the Web3 transaction',
      'Contemporaneous trade-press article naming store and transaction',
      'Author-held deal summary or contract excerpt with date (redacted)',
    ],
    publicTreatmentUntilVerified: 'qualify',
    remainPublic: true,
    publicSurfaces: ['app/about/page.tsx (credentials)', 'content/press.ts'],
    removalTrigger:
      'Remove or further soften if transaction cannot be substantiated. Never upgrade to “first” without primary source.',
  },
  {
    queueId: 'svq-germain-7500-retail-volume',
    claimIds: ['bio-germain-volume-7500'],
    currentPublicClaim:
      'About page and credentials state Germain Toyota/Lincoln Naples store volume was reported above 7,500 retail vehicles annually — biography evidence; ledger confirmation pending.',
    currentStatus: 'pending',
    exactSourceNeeded:
      'Store operational ledger, annual volume report, or employer GM record for Germain Toyota of Naples and Germain Lincoln of Naples covering the relevant years with retail unit counts and period definition.',
    acceptableEvidenceTypes: [
      'Internal dealer KPI or annual volume report (author-held)',
      'Audited store report or P&L volume line for the period',
      'Manufacturer/franchise annual statement with retail counts',
      'Employer letter confirming GM tenure and store volume for defined years',
    ],
    publicTreatmentUntilVerified: 'label',
    remainPublic: true,
    publicSurfaces: ['app/about/page.tsx', 'content/press.ts (credentials)'],
    removalTrigger:
      'Remove numeric claim or replace with non-quantified biography if ledger cannot be supplied. Do not present as audited industry data.',
  },
];

export function getSourceValidationQueueItem(
  queueId: string,
): SourceValidationQueueItem | undefined {
  return sourceValidationQueue.find((item) => item.queueId === queueId);
}
