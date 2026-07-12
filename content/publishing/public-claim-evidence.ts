/**
 * Public-claim evidence registry.
 *
 * Classifies claims that appear (or could reappear) on the public site.
 * Does not alter approved doctrine. Held/retired doctrine IDs are referenced
 * by claimId alignment with content/doctrine/automotive-update-doctrine.ts.
 *
 * Unsupported benchmarks must never be marked verified.
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

export const publicClaimEvidence: PublicClaimEvidenceRecord[] = [
  // —— Biography (homepage / about / press) ——
  {
    claimId: 'bio-evp-cars-commerce',
    claimText: 'Brian Kramer is EVP, Dealer Growth & Success at Cars Commerce.',
    evidenceClass: 'biography-evidence',
    evidenceStatus: 'qualified',
    sourcePath: 'app/about/page.tsx',
    sourceDetail: 'Public bio statement; title/role should match current employer records.',
    doctrineIds: [],
    formulaIds: [],
    publicTreatment: 'publish',
    notes: 'Role titles change; treat as qualified pending periodic HR/employer confirmation.',
  },
  {
    claimId: 'bio-years-retail-gm',
    claimText: 'Two decades as a General Manager (exact year counts remain pending validation).',
    evidenceClass: 'biography-evidence',
    evidenceStatus: 'pending',
    sourcePath: 'app/about/page.tsx',
    sourceDetail: 'About and homepage use aligned two-decade framing; exact 27/19 counts removed from public hero copy.',
    doctrineIds: [],
    formulaIds: [],
    publicTreatment: 'label',
    notes: 'Exact tenure arithmetic still pending resume/ledger validation.',
  },
  {
    claimId: 'bio-germain-volume-7500',
    claimText:
      'Germain Naples store volume reported above 7,500 retail vehicles annually (ledger confirmation pending).',
    evidenceClass: 'biography-evidence',
    evidenceStatus: 'pending',
    sourcePath: 'app/about/page.tsx',
    sourceDetail: 'Also labeled in content/press.ts credentials detail.',
    doctrineIds: [],
    formulaIds: [],
    publicTreatment: 'label',
    notes: 'Public copy now labels biography evidence; do not present as audited industry data.',
  },
  {
    claimId: 'bio-paperless-first-2020',
    claimText: 'Helped lead an early / believed-first end-to-end paperless automotive transaction in 2020.',
    evidenceClass: 'biography-evidence',
    evidenceStatus: 'qualified',
    sourcePath: 'content/essays/index.ts',
    sourceDetail: 'Essay paperless-lessons and homepage Focus card use qualified wording.',
    doctrineIds: [],
    formulaIds: [],
    publicTreatment: 'qualify',
    notes: 'Absolute “industry first” removed from press/homepage; essay retains “what we believed was the first.”',
  },
  {
    claimId: 'bio-an-40-under-40',
    claimText: 'Automotive News “40 Under 40” recognition.',
    evidenceClass: 'biography-evidence',
    evidenceStatus: 'pending',
    sourcePath: 'content/press.ts',
    sourceDetail: 'Press/credentials and Person schema award (inaugural wording removed).',
    doctrineIds: [],
    formulaIds: [],
    publicTreatment: 'label',
    notes: 'Pending primary Automotive News award citation URL/date before verified.',
  },
  {
    claimId: 'bio-google-dealer-advisory-board',
    claimText: 'Former member, Google Dealer Advisory Board.',
    evidenceClass: 'biography-evidence',
    evidenceStatus: 'pending',
    sourcePath: 'content/press.ts',
    sourceDetail: 'About credentials list.',
    doctrineIds: [],
    formulaIds: [],
    publicTreatment: 'label',
    notes: 'Needs board roster or invitation artifact.',
  },
  {
    claimId: 'bio-web3-first-transaction',
    claimText: 'Facilitated an early Web3 transaction in automotive retail.',
    evidenceClass: 'biography-evidence',
    evidenceStatus: 'pending',
    sourcePath: 'content/press.ts',
    sourceDetail: 'About credentials list; absolute “first” removed.',
    doctrineIds: [],
    formulaIds: [],
    publicTreatment: 'qualify',
    notes: 'Qualified wording only until source-validated.',
  },

  // —— Approved doctrine mirrored in public essays ——
  {
    claimId: 'pub-service-drive-own-channel',
    claimText: 'Service-drive / consumer sourcing must be managed as its own acquisition channel.',
    evidenceClass: 'approved-doctrine',
    evidenceStatus: 'verified',
    sourcePath: 'content/essays/index.ts',
    sourceDetail: 'Essay service-drive-acquisition; aligns with acquisition-consumer-source.',
    doctrineIds: ['acquisition-consumer-source', 'execution-contract'],
    formulaIds: ['trade-capture', 'missed-trade'],
    publicTreatment: 'publish',
    notes: 'Doctrine-approved operating statement; no universal close-rate threshold attached.',
  },
  {
    claimId: 'pub-cannot-acquire-unappraised',
    claimText: 'A dealership cannot acquire an opportunity it never appraises.',
    evidenceClass: 'approved-doctrine',
    evidenceStatus: 'verified',
    sourcePath: 'content/essays/index.ts',
    sourceDetail: 'Implied throughout look-to-book and service-drive essays.',
    doctrineIds: ['acquisition-appraisal-coverage', 'appraisal-full-opportunity-set'],
    formulaIds: ['appraisal-to-sale'],
    publicTreatment: 'publish',
    notes: 'Approved doctrine; keep free of held prevalence/capture percentages.',
  },
  {
    claimId: 'pub-look-to-book-definition',
    claimText:
      'Look-to-Book is Looks (completed appraisals with a real number) over Books (Looks that result in ownership).',
    evidenceClass: 'approved-doctrine',
    evidenceStatus: 'verified',
    sourcePath: 'content/essays/index.ts',
    sourceDetail: 'Essay look-to-book definition section.',
    doctrineIds: ['appraisal-look-to-book'],
    formulaIds: [],
    publicTreatment: 'publish',
    notes: 'Definitional doctrine only. Universal healthy ranges remain retired/held.',
  },
  {
    claimId: 'pub-look-to-book-no-universal-range',
    claimText: 'No universal Look-to-Book healthy range is published; floors/ceilings must be proven locally.',
    evidenceClass: 'approved-doctrine',
    evidenceStatus: 'verified',
    sourcePath: 'content/essays/index.ts',
    sourceDetail: 'Essay look-to-book explicitly refuses universal ranges.',
    doctrineIds: ['appraisal-look-to-book'],
    formulaIds: [],
    publicTreatment: 'publish',
    notes: 'Corrective public treatment of retired claim retire-look-to-book-range.',
  },
  {
    claimId: 'pub-ai-schema-citation',
    claimText:
      'AI visibility depends on structured data, stable citable URLs, and evidence quality — not keyword SEO alone.',
    evidenceClass: 'approved-doctrine',
    evidenceStatus: 'verified',
    sourcePath: 'content/essays/index.ts',
    sourceDetail: 'Essays ai-search-trust and dealer-ai-schema.',
    doctrineIds: [
      'ai-seo-eligibility',
      'ai-measurement-surface',
      'ai-evidence-quality',
      'ai-recurring-probes',
    ],
    formulaIds: [],
    publicTreatment: 'publish',
    notes: 'Approved AI visibility doctrine; avoid retired “AI punishes” / “indexes everything” absolutes.',
  },
  {
    claimId: 'pub-trust-reviews-as-evidence',
    claimText: 'Review text and response behavior are operating evidence, not only a marketing score.',
    evidenceClass: 'approved-doctrine',
    evidenceStatus: 'verified',
    sourcePath: 'content/essays/index.ts',
    sourceDetail: 'Essay digital-trust-audit; homepage trust Focus card.',
    doctrineIds: ['trust-reviews-as-evidence', 'trust-proof-before-promotion'],
    formulaIds: [],
    publicTreatment: 'publish',
    notes: 'Doctrine-aligned; do not attach unsupported 84%/71% shopper benchmarks.',
  },
  {
    claimId: 'pub-auction-dependency-diagnostic',
    claimText: 'Auction dependency is an outcome to diagnose, not automatically the strategy.',
    evidenceClass: 'approved-doctrine',
    evidenceStatus: 'qualified',
    sourcePath: 'content/essays/index.ts',
    sourceDetail: 'Service-drive essay frames auction as margin default when drive channel is unmanaged.',
    doctrineIds: ['acquisition-auction-dependency', 'economics-auction-dependency'],
    formulaIds: [],
    publicTreatment: 'qualify',
    notes: 'Doctrine status is approved-with-qualification; keep diagnostic, not absolute.',
  },

  // —— Formula knowledge (expressions approved; thresholds not) ——
  {
    claimId: 'formula-appraisal-to-sale',
    claimText: 'Appraisal-to-Sale = completed_appraisals / retail_vehicle_sales.',
    evidenceClass: 'formula-knowledge',
    evidenceStatus: 'verified',
    sourcePath: 'content/doctrine/FORMULA_KNOWLEDGE.md',
    sourceDetail: 'Canonical formula spec; machine ID appraisal-to-sale.',
    doctrineIds: [],
    formulaIds: ['appraisal-to-sale'],
    publicTreatment: 'publish',
    notes: 'Formula approved. Universal performance thresholds remain held.',
  },
  {
    claimId: 'formula-trade-capture',
    claimText: 'Trade Capture Rate = trades_acquired / verified_trade_eligible_opportunities.',
    evidenceClass: 'formula-knowledge',
    evidenceStatus: 'qualified',
    sourcePath: 'content/doctrine/FORMULA_KNOWLEDGE.md',
    sourceDetail: 'Approved with proxy qualification when eligibility unavailable.',
    doctrineIds: [],
    formulaIds: ['trade-capture'],
    publicTreatment: 'qualify',
    notes: 'Proxy results must be labeled; never present “average dealer captures ~35%” as verified.',
  },
  {
    claimId: 'formula-missed-trade',
    claimText: 'Missed Trade Rate = verified opportunities not acquired / verified trade-eligible opportunities.',
    evidenceClass: 'formula-knowledge',
    evidenceStatus: 'verified',
    sourcePath: 'content/doctrine/FORMULA_KNOWLEDGE.md',
    sourceDetail: 'Canonical formula; thresholds not approved.',
    doctrineIds: [],
    formulaIds: ['missed-trade'],
    publicTreatment: 'publish',
    notes: 'Formula only; no universal miss-rate benchmark.',
  },

  // —— Source-validation / pending operating claims on public pages ——
  {
    claimId: 'pub-half-dealer-sites-broken-schema',
    claimText: 'In audits I have run, broken or missing schema is common enough to treat as non-optional.',
    evidenceClass: 'anecdote',
    evidenceStatus: 'qualified',
    sourcePath: 'content/essays/index.ts',
    sourceDetail: 'Essay dealer-ai-schema; playbook ai-search-quick-start source material matches.',
    doctrineIds: ['ai-evidence-quality'],
    formulaIds: [],
    publicTreatment: 'qualify',
    notes: 'Hard “half of dealer sites” percentage removed from public copy.',
  },
  {
    claimId: 'pub-shoppers-decide-before-call',
    claimText: 'Many shoppers form a dealer preference before they call.',
    evidenceClass: 'opinion',
    evidenceStatus: 'qualified',
    sourcePath: 'content/essays/index.ts',
    sourceDetail: 'Essay digital-trust-audit dek/body; unsupported 84%/71% removed from playbook dek.',
    doctrineIds: ['trust-reviews-as-evidence'],
    formulaIds: [],
    publicTreatment: 'qualify',
    notes: 'Soft operator framing only; no shopper-percentage benchmarks.',
  },
  {
    claimId: 'pub-90-second-service-sla',
    claimText:
      'A short RO-to-buyer notification SLA (illustrative: about 90 seconds when the lane allows) is a useful operating change.',
    evidenceClass: 'anecdote',
    evidenceStatus: 'qualified',
    sourcePath: 'content/essays/index.ts',
    sourceDetail: 'Essay service-drive-acquisition; labeled illustrative operator cadence.',
    doctrineIds: ['execution-contract', 'acquisition-consumer-source'],
    formulaIds: [],
    publicTreatment: 'qualify',
    notes: 'Not a universal threshold. “Highest-leverage” absolute removed.',
  },
  {
    claimId: 'pub-trust-quality-score-tax',
    claimText: 'Bad reviews are a Quality Score tax and a CPL premium.',
    evidenceClass: 'opinion',
    evidenceStatus: 'qualified',
    sourcePath: 'app/page.tsx',
    sourceDetail: 'Homepage Focus trust card; echoed in digital-trust-audit close.',
    doctrineIds: ['trust-reviews-as-evidence'],
    formulaIds: [],
    publicTreatment: 'qualify',
    notes: 'Causal paid-media framing is interpretive; publish as operator opinion, not measured industry law.',
  },
  {
    claimId: 'pub-podcast-archive-provisional',
    claimText: 'Podcast archive entries are provisional pending source verification; listen links are withheld.',
    evidenceClass: 'source-validation',
    evidenceStatus: 'pending',
    sourcePath: 'content/podcasts/seed.ts',
    sourceDetail: 'All seed records currently sourceVerified: false with sourceUrl null. No appearance-count claim.',
    doctrineIds: [],
    formulaIds: [],
    publicTreatment: 'label',
    notes: 'Public treatment is label (“Source verification pending”); TOTAL_PODCAST_COUNT removed.',
  },
  {
    claimId: 'pub-ai-2027-forecast',
    claimText: 'Dealers who started in 2026 will show up in AI answers in 2027.',
    evidenceClass: 'held',
    evidenceStatus: 'retired',
    sourcePath: 'content/essays/index.ts',
    sourceDetail: 'Removed from ai-search-trust close; replaced with non-dated positioning language.',
    doctrineIds: [],
    formulaIds: [],
    publicTreatment: 'remove',
    notes: 'Time-bound forecast language removed from public essay.',
  },
  {
    claimId: 'pub-look-to-book-illustrative-spread',
    claimText: 'Illustrative appraiser Look-to-Book spread (e.g. mid-forties vs low teens) without publishing fixed % benchmarks.',
    evidenceClass: 'anecdote',
    evidenceStatus: 'qualified',
    sourcePath: 'content/essays/index.ts',
    sourceDetail: 'Essay look-to-book; hard 45%/12% replaced with qualitative illustrative language.',
    doctrineIds: ['appraisal-look-to-book'],
    formulaIds: [],
    publicTreatment: 'qualify',
    notes: 'Not a universal threshold; local proof required.',
  },

  // —— Scrubbed playbook source claims (still unpublished; text removed from entries.ts) ——
  {
    claimId: 'playbook-look-to-book-universal-range',
    claimText:
      'Under 20% Look-to-Book is bidding scared; over 55% is overpaying or lucky; healthy range is 28–42%.',
    evidenceClass: 'held',
    evidenceStatus: 'retired',
    sourcePath: 'content/playbook/entries.ts',
    sourceDetail: 'Removed from playbook source copy; routes remain coming-soon / notFound.',
    doctrineIds: [],
    formulaIds: [],
    publicTreatment: 'remove',
    notes: 'Maps to retire-look-to-book-range. Must not re-enter public UI.',
  },
  {
    claimId: 'playbook-reviews-84-71',
    claimText: '84% of shoppers read reviews. 71% of them decide on a dealer before they call.',
    evidenceClass: 'held',
    evidenceStatus: 'held',
    sourcePath: 'content/playbook/entries.ts',
    sourceDetail: 'Removed from playbook dek.',
    doctrineIds: [],
    formulaIds: [],
    publicTreatment: 'remove',
    notes: 'Unsupported benchmarks. Never mark verified.',
  },
  {
    claimId: 'playbook-drive-close-rate-band',
    claimText: 'Drive-sourced offer close rate under 20% / over 60% / aim 25–40%.',
    evidenceClass: 'held',
    evidenceStatus: 'held',
    sourcePath: 'content/playbook/entries.ts',
    sourceDetail: 'Removed from service-drive-sourcing step 5; replaced with local-diagnosis language.',
    doctrineIds: [],
    formulaIds: [],
    publicTreatment: 'remove',
    notes: 'Universal close-rate band not approved in FORMULA_KNOWLEDGE.md.',
  },
  {
    claimId: 'playbook-advisor-spiff-100-250',
    claimText: 'Advisor acquisition spiff of $100–$250 per vehicle.',
    evidenceClass: 'held',
    evidenceStatus: 'held',
    sourcePath: 'content/playbook/entries.ts',
    sourceDetail: 'Removed universal dollar band; local testing language remains.',
    doctrineIds: [],
    formulaIds: [],
    publicTreatment: 'remove',
    notes: 'Dollar band is not an approved formula threshold.',
  },

  // —— Held automotive-update claims (must not appear as verified public fact) ——
  {
    claimId: 'claim-trade-prevalence-70',
    claimText: 'More than 70% of buyers have a vehicle to trade or sell.',
    evidenceClass: 'held',
    evidenceStatus: 'held',
    sourcePath: 'content/doctrine/automotive-update-doctrine.ts',
    sourceDetail: 'heldAutomotiveUpdateClaims; evidence required: primary study, population, period.',
    doctrineIds: [],
    formulaIds: [],
    publicTreatment: 'remove',
    notes: 'Do not publish as verified. LinkedIn source history is not sufficient without study metadata.',
  },
  {
    claimId: 'claim-trade-capture-35',
    claimText: 'The average dealership captures approximately 35% of trade opportunities.',
    evidenceClass: 'held',
    evidenceStatus: 'held',
    sourcePath: 'content/doctrine/automotive-update-doctrine.ts',
    sourceDetail: 'heldAutomotiveUpdateClaims.',
    doctrineIds: [],
    formulaIds: ['trade-capture'],
    publicTreatment: 'remove',
    notes: 'Formula may be published; this universal average may not.',
  },
  {
    claimId: 'claim-appraisal-study-100k',
    claimText: 'A 100,000-plus appraisal study establishes universal A2S outcomes.',
    evidenceClass: 'held',
    evidenceStatus: 'held',
    sourcePath: 'content/doctrine/automotive-update-doctrine.ts',
    sourceDetail: 'heldAutomotiveUpdateClaims.',
    doctrineIds: [],
    formulaIds: ['appraisal-to-sale'],
    publicTreatment: 'remove',
    notes: 'Study scope/methodology still required.',
  },
  {
    claimId: 'claim-marketplace-overlap-90',
    claimText: 'Ninety percent of buyers overlap with third-party marketplaces.',
    evidenceClass: 'held',
    evidenceStatus: 'held',
    sourcePath: 'content/doctrine/automotive-update-doctrine.ts',
    sourceDetail: 'heldAutomotiveUpdateClaims.',
    doctrineIds: [],
    formulaIds: [],
    publicTreatment: 'remove',
    notes: 'Unsupported without study owner, touch definition, population, period.',
  },
  {
    claimId: 'claim-consumer-acquisition-share',
    claimText: 'Carvana and CarMax account for 12.7% of U.S. consumer acquisitions.',
    evidenceClass: 'held',
    evidenceStatus: 'held',
    sourcePath: 'content/doctrine/automotive-update-doctrine.ts',
    sourceDetail: 'heldAutomotiveUpdateClaims.',
    doctrineIds: [],
    formulaIds: [],
    publicTreatment: 'remove',
    notes: 'Needs consistent numerator/denominator and source date.',
  },
  {
    claimId: 'claim-auction-penalty-2000',
    claimText: 'Every missed trade creates a $2,000 auction penalty.',
    evidenceClass: 'held',
    evidenceStatus: 'held',
    sourcePath: 'content/doctrine/automotive-update-doctrine.ts',
    sourceDetail: 'heldAutomotiveUpdateClaims.',
    doctrineIds: ['economics-auction-dependency'],
    formulaIds: [],
    publicTreatment: 'remove',
    notes: 'Segment/market/period/gross definition required; never mark verified.',
  },
  {
    claimId: 'claim-recon-variance-1400',
    claimText: 'Typical appraisal-to-ledger reconditioning variance exceeds $1,400.',
    evidenceClass: 'held',
    evidenceStatus: 'held',
    sourcePath: 'content/doctrine/automotive-update-doctrine.ts',
    sourceDetail: 'heldAutomotiveUpdateClaims.',
    doctrineIds: ['economics-recon-variance'],
    formulaIds: ['recon-variance', 'absolute-recon-error'],
    publicTreatment: 'remove',
    notes: 'Formula approved; this universal threshold is held.',
  },
  {
    claimId: 'claim-fi-history',
    claimText: 'Historical F&I PVR progressed through the published universal values.',
    evidenceClass: 'held',
    evidenceStatus: 'held',
    sourcePath: 'content/doctrine/automotive-update-doctrine.ts',
    sourceDetail: 'heldAutomotiveUpdateClaims; FORMULA_KNOWLEDGE.md marks historical progression held.',
    doctrineIds: [],
    formulaIds: ['fi-pvr'],
    publicTreatment: 'remove',
    notes: 'Needs NADA/CAR edition, definition, and period before any public benchmark series.',
  },

  // —— Retired claims (public treatment: remove) ——
  {
    claimId: 'retire-look-to-book-primary',
    claimText: 'Look-to-Book is the principal appraisal KPI.',
    evidenceClass: 'held',
    evidenceStatus: 'retired',
    sourcePath: 'content/doctrine/automotive-update-doctrine.ts',
    sourceDetail: 'retiredAutomotiveUpdateClaims.',
    doctrineIds: ['appraisal-full-opportunity-set'],
    formulaIds: [],
    publicTreatment: 'remove',
    notes: 'Retired: excludes opportunities that never reached a completed appraisal.',
  },
  {
    claimId: 'retire-look-to-book-range',
    claimText: 'One universal Look-to-Book range defines a healthy dealership.',
    evidenceClass: 'held',
    evidenceStatus: 'retired',
    sourcePath: 'content/doctrine/automotive-update-doctrine.ts',
    sourceDetail: 'retiredAutomotiveUpdateClaims.',
    doctrineIds: [],
    formulaIds: [],
    publicTreatment: 'remove',
    notes: 'Retired. Public essay correctly refuses universal ranges.',
  },
  {
    claimId: 'retire-ai-punishment',
    claimText: 'AI punishes dealerships for inconsistent behavior.',
    evidenceClass: 'held',
    evidenceStatus: 'retired',
    sourcePath: 'content/doctrine/automotive-update-doctrine.ts',
    sourceDetail: 'retiredAutomotiveUpdateClaims.',
    doctrineIds: ['ai-contradiction-risk'],
    formulaIds: [],
    publicTreatment: 'remove',
    notes: 'Use measurable omission/confidence/representation risk instead.',
  },
  {
    claimId: 'retire-ai-indexes-everything',
    claimText: 'AI indexes every dealership behavior, appraisal and offer.',
    evidenceClass: 'held',
    evidenceStatus: 'retired',
    sourcePath: 'content/doctrine/automotive-update-doctrine.ts',
    sourceDetail: 'retiredAutomotiveUpdateClaims.',
    doctrineIds: [],
    formulaIds: [],
    publicTreatment: 'remove',
    notes: 'Unsupported generalization.',
  },
  {
    claimId: 'retire-ai-cannot-be-manipulated',
    claimText: 'AI cannot be manipulated.',
    evidenceClass: 'held',
    evidenceStatus: 'retired',
    sourcePath: 'content/doctrine/automotive-update-doctrine.ts',
    sourceDetail: 'retiredAutomotiveUpdateClaims.',
    doctrineIds: [],
    formulaIds: [],
    publicTreatment: 'remove',
    notes: 'False as an absolute claim.',
  },
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
