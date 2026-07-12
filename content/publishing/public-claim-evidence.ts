/**
 * Public-claim evidence registry.
 *
 * Classifies claims that appear, or could reappear, on the public site.
 * This registry governs public treatment only. It does not alter doctrine,
 * manuscript source, playbook source, or formula knowledge.
 */

export type PublicClaimEvidenceClass =
  | 'approved-doctrine'
  | 'formula-knowledge'
  | 'biography-evidence'
  | 'source-validation'
  | 'anecdote'
  | 'opinion'
  | 'held';

export type PublicClaimEvidenceStatus =
  | 'verified'
  | 'qualified'
  | 'pending'
  | 'held'
  | 'retired';

export type PublicClaimTreatment = 'publish' | 'qualify' | 'label' | 'remove';

export interface PublicClaimEvidenceRecord {
  claimId: string;
  claimText: string;
  evidenceClass: PublicClaimEvidenceClass;
  evidenceStatus: PublicClaimEvidenceStatus;
  sourcePath: string;
  sourceDetail: string;
  doctrineIds: string[];
  formulaIds: string[];
  publicTreatment: PublicClaimTreatment;
  notes: string;
}

function record(
  claimId: string,
  claimText: string,
  evidenceClass: PublicClaimEvidenceClass,
  evidenceStatus: PublicClaimEvidenceStatus,
  sourcePath: string,
  sourceDetail: string,
  publicTreatment: PublicClaimTreatment,
  notes: string,
  doctrineIds: string[] = [],
  formulaIds: string[] = [],
): PublicClaimEvidenceRecord {
  return {
    claimId,
    claimText,
    evidenceClass,
    evidenceStatus,
    sourcePath,
    sourceDetail,
    doctrineIds,
    formulaIds,
    publicTreatment,
    notes,
  };
}

export const publicClaimEvidence: PublicClaimEvidenceRecord[] = [
  // Biography / credentials.
  record(
    'bio-evp-cars-commerce',
    'Brian Kramer is EVP, Dealer Growth & Success at Cars Commerce.',
    'biography-evidence',
    'qualified',
    'app/about/page.tsx',
    'Public bio statement; title and role should match current employer records.',
    'publish',
    'Role titles can change; keep qualified pending periodic employer confirmation.',
  ),
  record(
    'bio-years-retail-gm',
    'Two decades as a General Manager; exact year counts remain pending validation.',
    'biography-evidence',
    'pending',
    'app/about/page.tsx',
    'About page uses two-decade framing; exact counts are not asserted.',
    'label',
    'Exact tenure arithmetic still requires resume or ledger validation.',
  ),
  record(
    'bio-germain-volume-7500',
    'Germain Naples store volume reported above 7,500 retail vehicles annually.',
    'biography-evidence',
    'pending',
    'app/about/page.tsx',
    'About page and credentials label this as biography evidence with ledger confirmation pending.',
    'label',
    'Do not present as audited industry data until the ledger/source record is verified.',
  ),
  record(
    'bio-paperless-first-2020',
    'Helped lead an early or believed-first end-to-end paperless automotive transaction in 2020.',
    'biography-evidence',
    'qualified',
    'content/essays/index.ts',
    'Essay and homepage use qualified early/believed-first wording.',
    'qualify',
    'Absolute industry-first language is not approved without primary source validation.',
  ),
  record(
    'bio-an-40-under-40',
    'Automotive News 40 Under 40 recognition.',
    'biography-evidence',
    'pending',
    'content/press.ts',
    'Credential remains citation-pending; Person schema award claim removed from app/layout.tsx.',
    'label',
    'Needs primary Automotive News citation URL/date before verified treatment.',
  ),
  record(
    'bio-google-dealer-advisory-board',
    'Former member, Google Dealer Advisory Board.',
    'biography-evidence',
    'pending',
    'content/press.ts',
    'Credentials list labels roster confirmation pending.',
    'label',
    'Needs board roster, invitation, or other primary artifact.',
  ),
  record(
    'bio-web3-first-transaction',
    'Facilitated an early Web3 transaction in automotive retail.',
    'biography-evidence',
    'pending',
    'content/press.ts',
    'Credentials use early wording; absolute first is not asserted.',
    'qualify',
    'Keep qualified until source-validated.',
  ),

  // PR #4 named-publication labels.
  record(
    'press-wsj-source-pending',
    'The Wall Street Journal mention.',
    'source-validation',
    'pending',
    'content/press.ts',
    'Public press mention labeled Source validation pending.',
    'label',
    'No URL added because no primary source URL is verified.',
  ),
  record(
    'press-automotive-news-source-pending',
    'Automotive News mention and 40 Under 40 recognition.',
    'source-validation',
    'pending',
    'content/press.ts',
    'Public press mention labeled citation pending; related credential remains pending.',
    'label',
    'Do not mark verified until the primary Automotive News citation is supplied.',
  ),
  record(
    'press-fandi-source-pending',
    'F&I Magazine mention.',
    'source-validation',
    'pending',
    'content/press.ts',
    'Public press mention labeled Source validation pending.',
    'label',
    'No URL added because no primary source URL is verified.',
  ),
  record(
    'press-digital-dealer-source-pending',
    'Digital Dealer Magazine mention.',
    'source-validation',
    'pending',
    'content/press.ts',
    'Public press mention labeled Source validation pending.',
    'label',
    'No URL added because no primary source URL is verified.',
  ),
  record(
    'press-jalopnik-source-pending',
    'Jalopnik mention.',
    'source-validation',
    'pending',
    'content/press.ts',
    'Public press mention labeled Source validation pending.',
    'label',
    'No URL added because no primary source URL is verified.',
  ),
  record(
    'press-pbs-viewpoint-source-pending',
    'PBS Viewpoint with Dennis Quaid appearance mention.',
    'source-validation',
    'pending',
    'content/press.ts',
    'Public press mention labeled Appearance citation pending.',
    'label',
    'No URL added because no primary appearance citation is verified.',
  ),

  // PR #4 provisional public treatments.
  record(
    'pub-podcast-archive-provisional',
    'Podcast archive entries are provisional pending source verification; listen links are withheld.',
    'source-validation',
    'pending',
    'content/podcasts/seed.ts',
    'All seed records currently sourceVerified: false with sourceUrl null.',
    'label',
    'Public treatment is Source verification pending; no appearance-count claim is approved.',
  ),
  record(
    'pub-podcast-fields-provisional',
    'Podcast titles, dates, hosts, and durations are not source-verified yet.',
    'source-validation',
    'pending',
    'app/podcast/page.tsx',
    'Visible provisional archive disclaimer added on /podcast.',
    'label',
    'Podcast title/date/host/duration fields may pass only while visibly labeled provisional.',
  ),
  record(
    'pub-book-release-in-progress',
    'The Best End User public book release/date language is In progress.',
    'source-validation',
    'pending',
    'app/page.tsx',
    'Homepage removed Coming 2026 and now uses In progress language.',
    'label',
    'Do not reintroduce a release year or shipping date without a source record.',
  ),
  record(
    'schema-person-award-removed',
    'Person schema award claim removed until primary citation is verified.',
    'source-validation',
    'pending',
    'app/layout.tsx',
    'Person JSON-LD does not include award while Automotive News citation is pending.',
    'remove',
    'Schema must not carry unverified award claims.',
  ),

  // Approved doctrine mirrored in public essays.
  record(
    'pub-service-drive-own-channel',
    'Service-drive and consumer sourcing must be managed as their own acquisition channel.',
    'approved-doctrine',
    'verified',
    'content/essays/index.ts',
    'Service-drive acquisition essay.',
    'publish',
    'Doctrine-approved operating statement; no universal close-rate threshold attached.',
    ['acquisition-consumer-source', 'execution-contract'],
    ['trade-capture', 'missed-trade'],
  ),
  record(
    'pub-cannot-acquire-unappraised',
    'A dealership cannot acquire an opportunity it never appraises.',
    'approved-doctrine',
    'verified',
    'content/essays/index.ts',
    'Look-to-book and service-drive essays.',
    'publish',
    'Approved doctrine; keep free of held prevalence/capture percentages.',
    ['acquisition-appraisal-coverage', 'appraisal-full-opportunity-set'],
    ['appraisal-to-sale'],
  ),
  record(
    'pub-look-to-book-definition',
    'Look-to-Book is Looks over Books.',
    'approved-doctrine',
    'verified',
    'content/essays/index.ts',
    'Look-to-book essay definition section.',
    'publish',
    'Definitional doctrine only; universal healthy ranges remain retired/held.',
    ['appraisal-look-to-book'],
  ),
  record(
    'pub-look-to-book-no-universal-range',
    'No universal Look-to-Book healthy range is published; floors and ceilings must be proven locally.',
    'approved-doctrine',
    'verified',
    'content/essays/index.ts',
    'Look-to-book essay refuses universal ranges.',
    'publish',
    'Corrective public treatment of retired universal-range claim.',
    ['appraisal-look-to-book'],
  ),
  record(
    'pub-ai-schema-citation',
    'AI visibility depends on structured data, stable citable URLs, and evidence quality.',
    'approved-doctrine',
    'verified',
    'content/essays/index.ts',
    'AI search and dealer schema essays.',
    'publish',
    'Avoid retired AI-punishment and AI-indexes-everything absolutes.',
    ['ai-seo-eligibility', 'ai-measurement-surface', 'ai-evidence-quality', 'ai-recurring-probes'],
  ),
  record(
    'pub-trust-reviews-as-evidence',
    'Review text and response behavior are operating evidence, not only a marketing score.',
    'approved-doctrine',
    'verified',
    'content/essays/index.ts',
    'Digital trust audit essay and homepage trust focus card.',
    'publish',
    'Do not attach unsupported shopper-percentage benchmarks.',
    ['trust-reviews-as-evidence', 'trust-proof-before-promotion'],
  ),
  record(
    'pub-auction-dependency-diagnostic',
    'Auction dependency is an outcome to diagnose, not automatically the strategy.',
    'approved-doctrine',
    'qualified',
    'content/essays/index.ts',
    'Service-drive essay frames auction as margin default when drive channel is unmanaged.',
    'qualify',
    'Keep diagnostic, not absolute.',
    ['acquisition-auction-dependency', 'economics-auction-dependency'],
  ),

  // Formula knowledge.
  record(
    'formula-appraisal-to-sale',
    'Appraisal-to-Sale = completed_appraisals / retail_vehicle_sales.',
    'formula-knowledge',
    'verified',
    'content/doctrine/FORMULA_KNOWLEDGE.md',
    'Canonical formula spec.',
    'publish',
    'Formula approved. Universal performance thresholds remain held.',
    [],
    ['appraisal-to-sale'],
  ),
  record(
    'formula-trade-capture',
    'Trade Capture Rate = trades_acquired / verified_trade_eligible_opportunities.',
    'formula-knowledge',
    'qualified',
    'content/doctrine/FORMULA_KNOWLEDGE.md',
    'Approved with proxy qualification when eligibility unavailable.',
    'qualify',
    'Proxy results must be labeled; average-dealer capture claims are not verified.',
    [],
    ['trade-capture'],
  ),
  record(
    'formula-missed-trade',
    'Missed Trade Rate = verified opportunities not acquired / verified trade-eligible opportunities.',
    'formula-knowledge',
    'verified',
    'content/doctrine/FORMULA_KNOWLEDGE.md',
    'Canonical formula; thresholds not approved.',
    'publish',
    'Formula only; no universal miss-rate benchmark.',
    [],
    ['missed-trade'],
  ),

  // Qualified / pending operating claims.
  record(
    'pub-half-dealer-sites-broken-schema',
    'Broken or missing schema is common enough to treat as non-optional.',
    'anecdote',
    'qualified',
    'content/essays/index.ts',
    'Dealer AI schema essay; hard half-of-sites percentage removed.',
    'qualify',
    'Do not publish a hard percentage without source validation.',
    ['ai-evidence-quality'],
  ),
  record(
    'pub-shoppers-decide-before-call',
    'Many shoppers form a dealer preference before they call.',
    'opinion',
    'qualified',
    'content/essays/index.ts',
    'Digital trust audit essay; unsupported 84%/71% removed.',
    'qualify',
    'Soft operator framing only; no shopper-percentage benchmarks.',
    ['trust-reviews-as-evidence'],
  ),
  record(
    'pub-90-second-service-sla',
    'A short RO-to-buyer notification SLA can be a useful operating change.',
    'anecdote',
    'qualified',
    'content/essays/index.ts',
    'Service-drive essay labels cadence as illustrative.',
    'qualify',
    'Not a universal threshold.',
    ['execution-contract', 'acquisition-consumer-source'],
  ),
  record(
    'pub-trust-quality-score-tax',
    'Bad reviews can become a paid-media drag.',
    'opinion',
    'qualified',
    'app/page.tsx',
    'Homepage trust focus card softened Quality Score/CPL causality.',
    'qualify',
    'Treat as operator interpretation, not measured industry law.',
    ['trust-reviews-as-evidence'],
  ),
  record(
    'pub-ai-2027-forecast',
    'Dealers who started in 2026 will show up in AI answers in 2027.',
    'held',
    'retired',
    'content/essays/index.ts',
    'Removed from public AI search essay.',
    'remove',
    'Time-bound forecast language removed from public essay.',
  ),
  record(
    'pub-look-to-book-illustrative-spread',
    'Illustrative appraiser Look-to-Book spread without publishing fixed percentage benchmarks.',
    'anecdote',
    'qualified',
    'content/essays/index.ts',
    'Look-to-book essay replaced hard percentages with qualitative illustrative language.',
    'qualify',
    'Local proof required; not a universal threshold.',
    ['appraisal-look-to-book'],
  ),

  // Scrubbed playbook source claims and held automotive-update claims.
  record(
    'playbook-look-to-book-universal-range',
    'Under 20% Look-to-Book is bidding scared; over 55% is overpaying or lucky; healthy range is 28-42%.',
    'held',
    'retired',
    'content/playbook/entries.ts',
    'Removed from playbook source copy; routes remain coming-soon / notFound.',
    'remove',
    'Must not re-enter public UI.',
  ),
  record(
    'playbook-reviews-84-71',
    '84% of shoppers read reviews. 71% of them decide on a dealer before they call.',
    'held',
    'held',
    'content/playbook/entries.ts',
    'Removed from playbook dek.',
    'remove',
    'Unsupported benchmarks. Never mark verified.',
  ),
  record(
    'playbook-drive-close-rate-band',
    'Drive-sourced offer close rate under 20% / over 60% / aim 25-40%.',
    'held',
    'held',
    'content/playbook/entries.ts',
    'Removed from service-drive-sourcing step 5.',
    'remove',
    'Universal close-rate band not approved in FORMULA_KNOWLEDGE.md.',
  ),
  record(
    'playbook-advisor-spiff-100-250',
    'Advisor acquisition spiff of $100-$250 per vehicle.',
    'held',
    'held',
    'content/playbook/entries.ts',
    'Removed universal dollar band; local testing language remains.',
    'remove',
    'Dollar band is not an approved formula threshold.',
  ),
  record(
    'claim-trade-prevalence-70',
    'More than 70% of buyers have a vehicle to trade or sell.',
    'held',
    'held',
    'content/doctrine/automotive-update-doctrine.ts',
    'Held automotive update claim.',
    'remove',
    'Do not publish as verified without primary study metadata.',
  ),
  record(
    'claim-trade-capture-35',
    'The average dealership captures approximately 35% of trade opportunities.',
    'held',
    'held',
    'content/doctrine/automotive-update-doctrine.ts',
    'Held automotive update claim.',
    'remove',
    'Formula may be published; this universal average may not.',
    [],
    ['trade-capture'],
  ),
  record(
    'claim-appraisal-study-100k',
    'A 100,000-plus appraisal study establishes universal A2S outcomes.',
    'held',
    'held',
    'content/doctrine/automotive-update-doctrine.ts',
    'Held automotive update claim.',
    'remove',
    'Study scope and methodology required.',
    [],
    ['appraisal-to-sale'],
  ),
  record(
    'claim-marketplace-overlap-90',
    'Ninety percent of buyers overlap with third-party marketplaces.',
    'held',
    'held',
    'content/doctrine/automotive-update-doctrine.ts',
    'Held automotive update claim.',
    'remove',
    'Unsupported without study owner, definition, population, and period.',
  ),
  record(
    'claim-consumer-acquisition-share',
    'Carvana and CarMax account for 12.7% of U.S. consumer acquisitions.',
    'held',
    'held',
    'content/doctrine/automotive-update-doctrine.ts',
    'Held automotive update claim.',
    'remove',
    'Needs consistent numerator, denominator, and source date.',
  ),
  record(
    'claim-auction-penalty-2000',
    'Every missed trade creates a $2,000 auction penalty.',
    'held',
    'held',
    'content/doctrine/automotive-update-doctrine.ts',
    'Held automotive update claim.',
    'remove',
    'Segment, market, period, and gross definition required.',
    ['economics-auction-dependency'],
  ),
  record(
    'claim-recon-variance-1400',
    'Typical appraisal-to-ledger reconditioning variance exceeds $1,400.',
    'held',
    'held',
    'content/doctrine/automotive-update-doctrine.ts',
    'Held automotive update claim.',
    'remove',
    'Formula approved; this universal threshold is held.',
    ['economics-recon-variance'],
    ['recon-variance', 'absolute-recon-error'],
  ),
  record(
    'claim-fi-history',
    'Historical F&I PVR progressed through published universal values.',
    'held',
    'held',
    'content/doctrine/automotive-update-doctrine.ts',
    'Held automotive update claim.',
    'remove',
    'Needs NADA/CAR edition, definition, and period before public benchmark series.',
    [],
    ['fi-pvr'],
  ),

  // Retired claims.
  record(
    'retire-look-to-book-primary',
    'Look-to-Book is the principal appraisal KPI.',
    'held',
    'retired',
    'content/doctrine/automotive-update-doctrine.ts',
    'Retired automotive update claim.',
    'remove',
    'Retired because it excludes opportunities that never reached a completed appraisal.',
    ['appraisal-full-opportunity-set'],
  ),
  record(
    'retire-look-to-book-range',
    'One universal Look-to-Book range defines a healthy dealership.',
    'held',
    'retired',
    'content/doctrine/automotive-update-doctrine.ts',
    'Retired automotive update claim.',
    'remove',
    'Retired; public essay correctly refuses universal ranges.',
  ),
  record(
    'retire-ai-punishment',
    'AI punishes dealerships for inconsistent behavior.',
    'held',
    'retired',
    'content/doctrine/automotive-update-doctrine.ts',
    'Retired automotive update claim.',
    'remove',
    'Use measurable omission, confidence, or representation risk instead.',
    ['ai-contradiction-risk'],
  ),
  record(
    'retire-ai-indexes-everything',
    'AI indexes every dealership behavior, appraisal, and offer.',
    'held',
    'retired',
    'content/doctrine/automotive-update-doctrine.ts',
    'Retired automotive update claim.',
    'remove',
    'Unsupported generalization.',
  ),
  record(
    'retire-ai-cannot-be-manipulated',
    'AI cannot be manipulated.',
    'held',
    'retired',
    'content/doctrine/automotive-update-doctrine.ts',
    'Retired automotive update claim.',
    'remove',
    'False as an absolute claim.',
  ),
];

export function getPublicClaimsByStatus(
  status: PublicClaimEvidenceStatus,
): PublicClaimEvidenceRecord[] {
  return publicClaimEvidence.filter((c) => c.evidenceStatus === status);
}

export function getPublicClaimsByTreatment(
  treatment: PublicClaimTreatment,
): PublicClaimEvidenceRecord[] {
  return publicClaimEvidence.filter((c) => c.publicTreatment === treatment);
}

export function getPublicClaim(claimId: string): PublicClaimEvidenceRecord | undefined {
  return publicClaimEvidence.find((c) => c.claimId === claimId);
}
