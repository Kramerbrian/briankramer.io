export type DoctrinePillar =
  | 'acquisition'
  | 'appraisal-efficiency'
  | 'trust'
  | 'ai-visibility'
  | 'used-car-economics'
  | 'operating-execution';

export type EvidenceStatus =
  | 'approved'
  | 'approved-with-qualification'
  | 'hold-for-source'
  | 'retired';

export interface DoctrineStatement {
  id: string;
  pillar: DoctrinePillar;
  statement: string;
  status: EvidenceStatus;
  rationale?: string;
}

export interface GovernedClaim {
  id: string;
  claim: string;
  status: 'hold-for-source' | 'retired';
  evidenceRequired?: string[];
  reason?: string;
}

export interface DoctrineFormula {
  id: string;
  name: string;
  expression: string;
  qualification?: string;
}

export const automotiveUpdateSources = [
  {
    publishedAt: '2026-04-09',
    title:
      'Anyone who doesn’t embrace the acceleration of innovation is going to get run over by it.',
    url: 'https://www.linkedin.com/pulse/anyone-who-doesnt-embrace-acceleration-innovation-going-brian-kramer-cpjge',
  },
  {
    publishedAt: '2025-09-20',
    title: 'Where do the other trade-in opportunities go?',
    url: 'https://www.linkedin.com/pulse/70-car-buyers-have-vehicle-trade-in-average-dealer-only-brian-kramer-lwjle',
  },
  {
    publishedAt: '2025-08-08',
    title: 'Carvana Is Winning the Argument. With Your Inventory. With Your Customers.',
    url: 'https://www.linkedin.com/pulse/carvana-winning-argument-your-inventory-customers-brian-kramer-pygde',
  },
  {
    publishedAt: '2025-07-26',
    title: 'What is the real customer experience like at my dealership?',
    url: 'https://www.linkedin.com/pulse/what-real-customer-experience-like-my-dealership-name-brian-kramer-gg1me',
  },
  {
    publishedAt: '2025-05-28',
    title: 'Why do used-vehicle departments experience margin compression?',
    url: 'https://www.linkedin.com/pulse/why-do-used-vehicle-departments-experience-margin-most-brian-kramer-voohe',
  },
] as const;

export const automotiveUpdateDoctrine: DoctrineStatement[] = [
  {
    id: 'acquisition-ownership',
    pillar: 'acquisition',
    statement: 'You cannot retail what you do not own.',
    status: 'approved',
  },
  {
    id: 'acquisition-appraisal-coverage',
    pillar: 'acquisition',
    statement: 'A dealership cannot acquire an opportunity it never appraises.',
    status: 'approved',
  },
  {
    id: 'acquisition-consumer-source',
    pillar: 'acquisition',
    statement: 'Consumer sourcing must be managed as its own acquisition channel.',
    status: 'approved',
  },
  {
    id: 'acquisition-best-end-user',
    pillar: 'acquisition',
    statement: 'Acquisition decisions should consider the vehicle’s best end user.',
    status: 'approved',
  },
  {
    id: 'acquisition-auction-dependency',
    pillar: 'acquisition',
    statement: 'Auction dependency is an outcome to diagnose, not automatically the strategy.',
    status: 'approved-with-qualification',
  },
  {
    id: 'appraisal-look-to-book',
    pillar: 'appraisal-efficiency',
    statement: 'Look-to-Book begins too late and uses an incomplete denominator.',
    status: 'approved',
  },
  {
    id: 'appraisal-full-opportunity-set',
    pillar: 'appraisal-efficiency',
    statement: 'Measure the complete appraisal opportunity set.',
    status: 'approved',
  },
  {
    id: 'appraisal-score-family',
    pillar: 'appraisal-efficiency',
    statement:
      'Appraisal Efficiency, Trade Capture and Missed Trade must be interpreted together.',
    status: 'approved',
  },
  {
    id: 'appraisal-condition-evidence',
    pillar: 'appraisal-efficiency',
    statement: 'Every appraisal requires consistent condition evidence.',
    status: 'approved',
  },
  {
    id: 'appraisal-recon-reconciliation',
    pillar: 'appraisal-efficiency',
    statement: 'Estimated reconditioning must be reconciled against actual reconditioning.',
    status: 'approved',
  },
  {
    id: 'trust-alignment',
    pillar: 'trust',
    statement: 'Trust is produced when message, process, evidence and outcome agree.',
    status: 'approved',
  },
  {
    id: 'trust-specific-offers',
    pillar: 'trust',
    statement:
      'Specific, explainable offers create more credibility than intentionally vague ranges.',
    status: 'approved-with-qualification',
  },
  {
    id: 'trust-reviews-as-evidence',
    pillar: 'trust',
    statement: 'Public reviews are operational evidence.',
    status: 'approved',
  },
  {
    id: 'trust-proof-before-promotion',
    pillar: 'trust',
    statement: 'A claim the store cannot prove should not become marketing copy.',
    status: 'approved',
  },
  {
    id: 'ai-seo-eligibility',
    pillar: 'ai-visibility',
    statement: 'SEO is the eligibility gate.',
    status: 'approved',
  },
  {
    id: 'ai-measurement-surface',
    pillar: 'ai-visibility',
    statement:
      'AI visibility measures whether systems can retrieve, interpret, cite and accurately represent the dealership.',
    status: 'approved',
  },
  {
    id: 'ai-evidence-quality',
    pillar: 'ai-visibility',
    statement: 'Entity clarity, structured content, stable URLs and source quality matter.',
    status: 'approved',
  },
  {
    id: 'ai-recurring-probes',
    pillar: 'ai-visibility',
    statement: 'AI-answer testing must repeat on a defined cadence.',
    status: 'approved',
  },
  {
    id: 'ai-contradiction-risk',
    pillar: 'ai-visibility',
    statement:
      'Contradictions between dealership-controlled and third-party evidence are measurable risks.',
    status: 'approved-with-qualification',
  },
  {
    id: 'economics-source-effects',
    pillar: 'used-car-economics',
    statement: 'Acquisition source affects downstream gross, turn and risk.',
    status: 'approved',
  },
  {
    id: 'economics-auction-dependency',
    pillar: 'used-car-economics',
    statement:
      'Missed consumer-source opportunities can create avoidable auction dependency.',
    status: 'approved-with-qualification',
  },
  {
    id: 'economics-recon-variance',
    pillar: 'used-car-economics',
    statement: 'Reconditioning estimate variance is an economic control signal.',
    status: 'approved',
  },
  {
    id: 'economics-market-vs-execution',
    pillar: 'used-car-economics',
    statement:
      'Margin compression must be separated into market effects and execution effects.',
    status: 'approved',
  },
  {
    id: 'execution-contract',
    pillar: 'operating-execution',
    statement:
      'A standard must define the signal, owner, cadence, steps, proof and success measure.',
    status: 'approved',
  },
  {
    id: 'execution-technology-role',
    pillar: 'operating-execution',
    statement: 'Technology should reduce uncertainty and improve accountable execution.',
    status: 'approved',
  },
  {
    id: 'execution-standardization',
    pillar: 'operating-execution',
    statement: 'Standardization creates the basis for coaching and comparison.',
    status: 'approved',
  },
  {
    id: 'execution-receipts',
    pillar: 'operating-execution',
    statement: 'Receipts prove that the process occurred.',
    status: 'approved',
  },
  {
    id: 'execution-learning-loop',
    pillar: 'operating-execution',
    statement: 'Outcome data should recalibrate the process.',
    status: 'approved',
  },
];

export const automotiveUpdateFormulas: DoctrineFormula[] = [
  {
    id: 'appraisal-to-sale',
    name: 'Appraisal-to-Sale Ratio',
    expression: 'completed_appraisals / retail_vehicle_sales',
    qualification:
      'The formula is approved. Universal performance thresholds remain held pending source validation.',
  },
  {
    id: 'trade-capture',
    name: 'Trade Capture Rate',
    expression: 'trades_acquired / verified_trade_eligible_opportunities',
    qualification:
      'Retail sales may be used only as a labeled proxy when trade eligibility is unavailable.',
  },
  {
    id: 'missed-trade',
    name: 'Missed Trade Rate',
    expression:
      'verified_trade_opportunities_not_acquired / verified_trade_eligible_opportunities',
  },
  {
    id: 'recon-variance',
    name: 'Reconditioning Variance',
    expression: 'final_gl_recon_cost - recon_estimate_at_appraisal',
  },
  {
    id: 'absolute-recon-error',
    name: 'Absolute Reconditioning Error',
    expression: 'abs(final_gl_recon_cost - recon_estimate_at_appraisal)',
  },
  {
    id: 'fi-pvr',
    name: 'F&I PVR',
    expression: 'total_fi_gross / retail_deliveries',
  },
  {
    id: 'used-front-end-pvr',
    name: 'Used Front-End PVR',
    expression: 'used_front_end_gross / used_retail_units',
  },
];

export const heldAutomotiveUpdateClaims: GovernedClaim[] = [
  {
    id: 'claim-trade-prevalence-70',
    claim: 'More than 70% of buyers have a vehicle to trade or sell.',
    status: 'hold-for-source',
    evidenceRequired: ['primary study', 'population', 'observation period'],
  },
  {
    id: 'claim-trade-capture-35',
    claim: 'The average dealership captures approximately 35% of trade opportunities.',
    status: 'hold-for-source',
    evidenceRequired: ['denominator definition', 'population', 'observation period'],
  },
  {
    id: 'claim-appraisal-study-100k',
    claim: 'A 100,000-plus appraisal study establishes universal A2S outcomes.',
    status: 'hold-for-source',
    evidenceRequired: [
      'dataset scope',
      'dealer-group composition',
      'metric definitions',
      'methodology',
      'confidence intervals',
    ],
  },
  {
    id: 'claim-marketplace-overlap-90',
    claim: 'Ninety percent of buyers overlap with third-party marketplaces.',
    status: 'hold-for-source',
    evidenceRequired: ['study owner', 'touch definition', 'population', 'period'],
  },
  {
    id: 'claim-consumer-acquisition-share',
    claim: 'Carvana and CarMax account for 12.7% of U.S. consumer acquisitions.',
    status: 'hold-for-source',
    evidenceRequired: ['consistent numerator', 'consistent denominator', 'source date'],
  },
  {
    id: 'claim-auction-penalty-2000',
    claim: 'Every missed trade creates a $2,000 auction penalty.',
    status: 'hold-for-source',
    evidenceRequired: ['segment', 'market', 'time period', 'gross definition'],
  },
  {
    id: 'claim-recon-variance-1400',
    claim: 'Typical appraisal-to-ledger reconditioning variance exceeds $1,400.',
    status: 'hold-for-source',
    evidenceRequired: ['sample', 'mean or median', 'time period', 'vehicle mix'],
  },
  {
    id: 'claim-fi-history',
    claim: 'Historical F&I PVR progressed through the published universal values.',
    status: 'hold-for-source',
    evidenceRequired: ['NADA or CAR edition', 'definition', 'period'],
  },
];

export const retiredAutomotiveUpdateClaims: GovernedClaim[] = [
  {
    id: 'retire-look-to-book-primary',
    claim: 'Look-to-Book is the principal appraisal KPI.',
    status: 'retired',
    reason: 'It excludes opportunities that never reached a completed appraisal.',
  },
  {
    id: 'retire-look-to-book-range',
    claim: 'One universal Look-to-Book range defines a healthy dealership.',
    status: 'retired',
    reason: 'It lacks opportunity coverage and market-context controls.',
  },
  {
    id: 'retire-ai-punishment',
    claim: 'AI punishes dealerships for inconsistent behavior.',
    status: 'retired',
    reason:
      'Ranking and recommendation systems are surface-specific; use measurable omission, confidence and representation risk instead.',
  },
  {
    id: 'retire-ai-indexes-everything',
    claim: 'AI indexes every dealership behavior, appraisal and offer.',
    status: 'retired',
    reason: 'This is an unsupported generalization.',
  },
  {
    id: 'retire-ai-cannot-be-manipulated',
    claim: 'AI cannot be manipulated.',
    status: 'retired',
    reason: 'This is false as an absolute claim.',
  },
  {
    id: 'retire-time-bound-forecasts',
    claim: 'Time-bound 2025 competitor forecasts are permanent doctrine.',
    status: 'retired',
    reason: 'Forecasts expire and must not enter evergreen doctrine.',
  },
  {
    id: 'retire-no-outliers',
    claim: 'The appraisal study produced no exceptions or outliers.',
    status: 'retired',
    reason: 'The assertion requires statistical disclosure.',
  },
];

export const automotiveUpdateCallsToAction = [
  {
    pillar: 'ai-visibility',
    action:
      'Select one commercially important model-and-market query, align its evidence across every surface and establish a repeatable AI-answer baseline.',
  },
  {
    pillar: 'appraisal-efficiency',
    action:
      'Instrument every trade-eligible opportunity and publish Appraisal Efficiency, Trade Capture and Missed Trade together.',
  },
  {
    pillar: 'acquisition',
    action:
      'Build a consumer-sourcing route that competes before the vehicle reaches an auction.',
  },
  {
    pillar: 'trust',
    action:
      'Test what AI systems say, identify the supporting evidence, repair contradictions and repeat the probe on a fixed cadence.',
  },
  {
    pillar: 'operating-execution',
    action:
      'Standardize appraisal execution, capture condition evidence, reconcile estimated and actual recon and coach the variance by operator.',
  },
] as const;
