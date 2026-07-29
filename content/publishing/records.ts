import type { CanonicalOwner } from '@/content/doctrine/publishing-workflow';
import type { PublicClaimEvidenceStatus } from '@/content/publishing/public-claim-evidence';

/**
 * Canonical publishing records for every public long-form item.
 * LinkedIn / Substack adaptation URLs stay null until a real URL is verified.
 * /speaking is omitted until verified appearance evidence exists.
 * /newsletter is included only for verified LinkedIn Automotive Update editions.
 */

export interface CanonicalContentRecord {
  contentId: string;
  canonicalOwner: CanonicalOwner;
  canonicalUrl: string;
  canonicalTitle: string;
  seoTitle: string;
  linkedinHook: string;
  newsletterSubject: string;
  approvedSummary: string;
  doctrineIds: string[];
  formulaIds: string[];
  approvedClaimIds: string[];
  evidenceStatus: PublicClaimEvidenceStatus;
  version: string;
  datePublished: string;
  dateModified: string;
  linkedinUrl: string | null;
  substackUrl: string | null;
  lastDriftReview: string;
}

const SITE = 'https://www.briankramer.io';
const DRIFT_REVIEW = '2026-07-11';

export const canonicalContent: CanonicalContentRecord[] = [
  // —— Essays ——
  {
    contentId: 'bk-ai-search-trust-2026-001',
    canonicalOwner: 'briankramer.io',
    canonicalUrl: `${SITE}/writing/ai-search-trust`,
    canonicalTitle: "Why AI can't cite your VDP — and what it's costing you",
    seoTitle: "Why AI can't cite your VDP — Brian Kramer",
    linkedinHook:
      'AI answers skip dealers whose VDPs, schema, and about pages cannot be cited with confidence.',
    newsletterSubject: "Why AI can't cite your VDP",
    approvedSummary:
      'A qualified operating essay on structured data, stable vehicle URLs, and evidence quality for dealership discovery in AI answers.',
    doctrineIds: [
      'ai-seo-eligibility',
      'ai-measurement-surface',
      'ai-evidence-quality',
      'ai-recurring-probes',
    ],
    formulaIds: [],
    approvedClaimIds: ['pub-ai-schema-citation'],
    evidenceStatus: 'qualified',
    version: '1.1.0',
    datePublished: '2026-03-15',
    dateModified: '2026-07-11',
    linkedinUrl: null,
    substackUrl: null,
    lastDriftReview: DRIFT_REVIEW,
  },
  {
    contentId: 'bk-service-drive-acquisition-2026-001',
    canonicalOwner: 'briankramer.io',
    canonicalUrl: `${SITE}/writing/service-drive-acquisition`,
    canonicalTitle: 'Service drive is a search problem, not a sales problem',
    seoTitle: 'Service drive is a search problem — Brian Kramer',
    linkedinHook:
      'Treat the service drive as its own acquisition channel — with a funnel, an SLA, and a weekly report.',
    newsletterSubject: 'Service drive is a search problem',
    approvedSummary:
      'An operating essay on treating service-drive acquisition as a measurable funnel with accountable handoffs and locally proven cadences.',
    doctrineIds: [
      'acquisition-consumer-source',
      'acquisition-appraisal-coverage',
      'execution-contract',
      'acquisition-auction-dependency',
    ],
    formulaIds: ['appraisal-to-sale', 'trade-capture', 'missed-trade'],
    approvedClaimIds: [
      'pub-service-drive-own-channel',
      'pub-cannot-acquire-unappraised',
      'pub-90-second-service-sla',
      'pub-auction-dependency-diagnostic',
    ],
    evidenceStatus: 'qualified',
    version: '1.1.0',
    datePublished: '2026-02-28',
    dateModified: '2026-07-11',
    linkedinUrl: null,
    substackUrl: null,
    lastDriftReview: DRIFT_REVIEW,
  },
  {
    contentId: 'bk-look-to-book-2026-001',
    canonicalOwner: 'briankramer.io',
    canonicalUrl: `${SITE}/writing/look-to-book`,
    canonicalTitle: 'The Look-to-Book number every dealer should track',
    seoTitle: 'Look-to-Book: the appraisal close rate — Brian Kramer',
    linkedinHook:
      'Retail close rate gets the meeting. Appraisal Look-to-Book usually does not — and that silence is expensive.',
    newsletterSubject: 'The Look-to-Book number every dealer should track',
    approvedSummary:
      'Defines Look-to-Book as an appraisal operating metric and explains why healthy ranges should be proven locally.',
    doctrineIds: ['appraisal-look-to-book', 'appraisal-full-opportunity-set'],
    formulaIds: [],
    approvedClaimIds: [
      'pub-look-to-book-definition',
      'pub-look-to-book-no-universal-range',
      'pub-look-to-book-illustrative-spread',
    ],
    evidenceStatus: 'qualified',
    version: '1.1.0',
    datePublished: '2026-02-10',
    dateModified: '2026-07-11',
    linkedinUrl: null,
    substackUrl: null,
    lastDriftReview: DRIFT_REVIEW,
  },
  {
    contentId: 'bk-digital-trust-audit-2026-001',
    canonicalOwner: 'briankramer.io',
    canonicalUrl: `${SITE}/writing/digital-trust-audit`,
    canonicalTitle: 'The digital trust audit: what your store looks like before a customer walks in',
    seoTitle: 'The digital trust audit — Brian Kramer',
    linkedinHook:
      'Audit the store a stranger sees — reviews, phone, and VDP — before you spend another dollar on awareness.',
    newsletterSubject: 'The digital trust audit',
    approvedSummary:
      'A practical trust-surface audit for reviews, phone experience, and VDPs, without unsupported shopper-percentage benchmarks.',
    doctrineIds: ['trust-reviews-as-evidence', 'trust-proof-before-promotion'],
    formulaIds: [],
    approvedClaimIds: ['pub-trust-reviews-as-evidence', 'pub-shoppers-decide-before-call', 'pub-trust-quality-score-tax'],
    evidenceStatus: 'qualified',
    version: '1.1.0',
    datePublished: '2026-01-22',
    dateModified: '2026-07-11',
    linkedinUrl: null,
    substackUrl: null,
    lastDriftReview: DRIFT_REVIEW,
  },
  {
    contentId: 'bk-paperless-lessons-2025-001',
    canonicalOwner: 'briankramer.io',
    canonicalUrl: `${SITE}/writing/paperless-lessons`,
    canonicalTitle: 'What paperless actually taught me about dealer operations',
    seoTitle: 'What paperless taught me about dealer operations — Brian Kramer',
    linkedinHook:
      'Paperless was never about the PDF. It was about forcing every step of the deal to justify the printer.',
    newsletterSubject: 'What paperless actually taught me',
    approvedSummary:
      'Operator lessons from an early end-to-end paperless transaction: friction exposure, floor ownership, and trust through clarity.',
    doctrineIds: ['execution-technology-role', 'execution-contract', 'trust-alignment'],
    formulaIds: [],
    approvedClaimIds: ['bio-paperless-first-2020'],
    evidenceStatus: 'qualified',
    version: '1.1.0',
    datePublished: '2025-12-12',
    dateModified: '2026-07-11',
    linkedinUrl: null,
    substackUrl: null,
    lastDriftReview: DRIFT_REVIEW,
  },
  {
    contentId: 'bk-dealer-ai-schema-2026-001',
    canonicalOwner: 'briankramer.io',
    canonicalUrl: `${SITE}/writing/dealer-ai-schema`,
    canonicalTitle: 'Dealer AI schema: the boring work that decides if ChatGPT names you',
    seoTitle: 'Dealer AI schema — Brian Kramer',
    linkedinHook:
      'Schema is boring, technical, and decisive. Models name the stores they can lift clean facts about.',
    newsletterSubject: 'Dealer AI schema: the boring work that decides if ChatGPT names you',
    approvedSummary:
      'A schema-first operating note on homepage identity markup, quotable about pages, stable VDPs, and monthly AI probes.',
    doctrineIds: [
      'ai-seo-eligibility',
      'ai-evidence-quality',
      'ai-measurement-surface',
      'ai-recurring-probes',
    ],
    formulaIds: [],
    approvedClaimIds: ['pub-ai-schema-citation', 'pub-half-dealer-sites-broken-schema'],
    evidenceStatus: 'qualified',
    version: '1.1.0',
    datePublished: '2026-01-08',
    dateModified: '2026-07-11',
    linkedinUrl: null,
    substackUrl: null,
    lastDriftReview: DRIFT_REVIEW,
  },

  // —— Playbook index (public coming-soon route; detail routes blocked) ——
  {
    contentId: 'bk-playbook-index-2026-001',
    canonicalOwner: 'briankramer.io',
    canonicalUrl: `${SITE}/playbook`,
    canonicalTitle: 'Operating tools, coming soon.',
    seoTitle: 'Playbook — Brian Kramer',
    linkedinHook:
      'Operating tools with owners, cadence, proof, and success measures — publishing when source material is ready.',
    newsletterSubject: 'Playbook: operating tools, coming soon',
    approvedSummary:
      'Dealer operating playbooks are being prepared for publication, with detail routes held until source material is ready.',
    doctrineIds: ['execution-contract', 'execution-standardization'],
    formulaIds: [],
    approvedClaimIds: [],
    evidenceStatus: 'pending',
    version: '1.0.0',
    datePublished: '2026-07-11',
    dateModified: '2026-07-11',
    linkedinUrl: null,
    substackUrl: null,
    lastDriftReview: DRIFT_REVIEW,
  },

  // —— Playbook detail entries (published live; evidenceStatus pending until
  // formally verified, per Brian's explicit call — excluded from the
  // sitemap by listSitemapCanonicalRecords() until upgraded to qualified/verified) ——
  {
    contentId: 'bk-playbook-service-drive-sourcing-2026-001',
    canonicalOwner: 'briankramer.io',
    canonicalUrl: `${SITE}/playbook/service-drive-sourcing`,
    canonicalTitle: 'Service-drive sourcing: the acquisition channel you already own',
    seoTitle: 'Service-drive sourcing playbook — Brian Kramer',
    linkedinHook:
      'Trade-ready vehicles roll through your service drive every day. Most stores let them roll back out.',
    newsletterSubject: 'Service-drive sourcing playbook',
    approvedSummary:
      'A 6-step operating playbook for treating the service drive as its own acquisition channel, with locally proven SLAs and incentives instead of universal benchmarks.',
    doctrineIds: ['acquisition-consumer-source', 'acquisition-appraisal-coverage'],
    formulaIds: [],
    approvedClaimIds: [],
    evidenceStatus: 'pending',
    version: '1.0.0',
    datePublished: '2026-07-28',
    dateModified: '2026-07-28',
    linkedinUrl: null,
    substackUrl: null,
    lastDriftReview: DRIFT_REVIEW,
  },
  {
    contentId: 'bk-playbook-look-to-book-2026-001',
    canonicalOwner: 'briankramer.io',
    canonicalUrl: `${SITE}/playbook/look-to-book`,
    canonicalTitle: 'The Look-to-Book number every dealer should track',
    seoTitle: 'Look-to-Book playbook — Brian Kramer',
    linkedinHook:
      'You know your close rate on retail. Do you know your close rate on appraisal?',
    newsletterSubject: 'Look-to-Book playbook',
    approvedSummary:
      'A 6-step operating playbook for defining, instrumenting, and reporting Look-to-Book without publishing a universal healthy range.',
    doctrineIds: ['appraisal-look-to-book', 'appraisal-full-opportunity-set'],
    formulaIds: [],
    approvedClaimIds: [],
    evidenceStatus: 'pending',
    version: '1.0.0',
    datePublished: '2026-07-28',
    dateModified: '2026-07-28',
    linkedinUrl: null,
    substackUrl: null,
    lastDriftReview: DRIFT_REVIEW,
  },
  {
    contentId: 'bk-playbook-digital-trust-audit-2026-001',
    canonicalOwner: 'briankramer.io',
    canonicalUrl: `${SITE}/playbook/digital-trust-audit`,
    canonicalTitle: 'The digital trust audit: what your store looks like before a customer walks in',
    seoTitle: 'Digital trust audit playbook — Brian Kramer',
    linkedinHook:
      'Audit the store a stranger sees — reviews, phone, and VDP — before you spend another dollar on awareness.',
    newsletterSubject: 'Digital trust audit playbook',
    approvedSummary:
      'A 6-step quarterly audit playbook for reviews, phone experience, and VDP trust signals, without unsupported shopper-percentage benchmarks.',
    doctrineIds: ['trust-reviews-as-evidence', 'trust-proof-before-promotion'],
    formulaIds: [],
    approvedClaimIds: [],
    evidenceStatus: 'pending',
    version: '1.0.0',
    datePublished: '2026-07-28',
    dateModified: '2026-07-28',
    linkedinUrl: null,
    substackUrl: null,
    lastDriftReview: DRIFT_REVIEW,
  },
  {
    contentId: 'bk-playbook-ai-search-quick-start-2026-001',
    canonicalOwner: 'briankramer.io',
    canonicalUrl: `${SITE}/playbook/ai-search-quick-start`,
    canonicalTitle: 'AI search visibility quick-start: showing up when ChatGPT recommends a dealer',
    seoTitle: 'AI search visibility quick-start playbook — Brian Kramer',
    linkedinHook:
      'Whether ChatGPT mentions your store is a design problem, not a marketing problem.',
    newsletterSubject: 'AI search visibility quick-start playbook',
    approvedSummary:
      'A 6-step installation playbook for dealer schema, quotable about pages, third-party mentions, and stable VDPs for AI answer visibility.',
    doctrineIds: ['ai-seo-eligibility', 'ai-evidence-quality'],
    formulaIds: [],
    approvedClaimIds: [],
    evidenceStatus: 'pending',
    version: '1.0.0',
    datePublished: '2026-07-28',
    dateModified: '2026-07-28',
    linkedinUrl: null,
    substackUrl: null,
    lastDriftReview: DRIFT_REVIEW,
  },

  // —— Newsletter index + verified Automotive Update editions ——
  {
    contentId: 'bk-newsletter-index-2026-001',
    canonicalOwner: 'briankramer.io',
    canonicalUrl: `${SITE}/newsletter`,
    canonicalTitle: 'Automotive Update',
    seoTitle: 'Newsletter — Brian Kramer',
    linkedinHook:
      'Verified LinkedIn Automotive Update editions — summaries here, full posts on LinkedIn.',
    newsletterSubject: 'Automotive Update on briankramer.io',
    approvedSummary:
      'Collection of verified LinkedIn Automotive Update editions with concise original summaries, categories, dates, and canonical LinkedIn source links.',
    doctrineIds: [],
    formulaIds: [],
    approvedClaimIds: [],
    evidenceStatus: 'qualified',
    version: '1.0.0',
    datePublished: '2026-07-11',
    dateModified: '2026-07-11',
    linkedinUrl: null,
    substackUrl: null,
    lastDriftReview: DRIFT_REVIEW,
  },
  {
    contentId: 'bk-au-innovation-acceleration-2026-001',
    canonicalOwner: 'original-media',
    canonicalUrl: `${SITE}/newsletter#acceleration-of-innovation`,
    canonicalTitle:
      'Anyone who doesn’t embrace the acceleration of innovation is going to get run over by it.',
    seoTitle: 'Automotive Update: acceleration of innovation',
    linkedinHook: 'Digital change is an operating obligation — ownership, cadence, and proof.',
    newsletterSubject: 'Automotive Update: acceleration of innovation',
    approvedSummary:
      'Verified LinkedIn Automotive Update edition (2026-04-09). Original concise summary only; full text on LinkedIn.',
    doctrineIds: ['execution-technology-role', 'execution-contract'],
    formulaIds: [],
    approvedClaimIds: [],
    evidenceStatus: 'qualified',
    version: '1.0.0',
    datePublished: '2026-04-09',
    dateModified: '2026-07-11',
    linkedinUrl:
      'https://www.linkedin.com/pulse/anyone-who-doesnt-embrace-acceleration-innovation-going-brian-kramer-cpjge',
    substackUrl: null,
    lastDriftReview: DRIFT_REVIEW,
  },
  {
    contentId: 'bk-au-trade-in-opportunities-2025-001',
    canonicalOwner: 'original-media',
    canonicalUrl: `${SITE}/newsletter#where-trade-in-opportunities-go`,
    canonicalTitle: 'Where do the other trade-in opportunities go?',
    seoTitle: 'Automotive Update: where trade-in opportunities go',
    linkedinHook: 'Trade-eligible opportunities leave when they are never appraised.',
    newsletterSubject: 'Automotive Update: where trade-in opportunities go',
    approvedSummary:
      'Verified LinkedIn Automotive Update edition (2025-09-20). Summary avoids held prevalence/capture benchmarks.',
    doctrineIds: ['acquisition-consumer-source', 'acquisition-appraisal-coverage'],
    formulaIds: ['trade-capture', 'missed-trade'],
    approvedClaimIds: ['pub-service-drive-own-channel', 'pub-cannot-acquire-unappraised'],
    evidenceStatus: 'qualified',
    version: '1.0.0',
    datePublished: '2025-09-20',
    dateModified: '2026-07-11',
    linkedinUrl:
      'https://www.linkedin.com/pulse/70-car-buyers-have-vehicle-trade-in-average-dealer-only-brian-kramer-lwjle',
    substackUrl: null,
    lastDriftReview: DRIFT_REVIEW,
  },
  {
    contentId: 'bk-au-carvana-argument-2025-001',
    canonicalOwner: 'original-media',
    canonicalUrl: `${SITE}/newsletter#carvana-winning-the-argument`,
    canonicalTitle: 'Carvana Is Winning the Argument. With Your Inventory. With Your Customers.',
    seoTitle: 'Automotive Update: Carvana winning the argument',
    linkedinHook: 'Third-party buyers compete for the same trade-eligible customer.',
    newsletterSubject: 'Automotive Update: Carvana winning the argument',
    approvedSummary:
      'Verified LinkedIn Automotive Update edition (2025-08-08). Summary avoids held market-share claims.',
    doctrineIds: ['acquisition-consumer-source', 'acquisition-auction-dependency'],
    formulaIds: [],
    approvedClaimIds: ['pub-service-drive-own-channel'],
    evidenceStatus: 'qualified',
    version: '1.0.0',
    datePublished: '2025-08-08',
    dateModified: '2026-07-11',
    linkedinUrl:
      'https://www.linkedin.com/pulse/carvana-winning-argument-your-inventory-customers-brian-kramer-pygde',
    substackUrl: null,
    lastDriftReview: DRIFT_REVIEW,
  },
  {
    contentId: 'bk-au-customer-experience-2025-001',
    canonicalOwner: 'original-media',
    canonicalUrl: `${SITE}/newsletter#real-customer-experience`,
    canonicalTitle: 'What is the real customer experience like at my dealership?',
    seoTitle: 'Automotive Update: real customer experience',
    linkedinHook: 'Audit the store a stranger sees before spending more on awareness.',
    newsletterSubject: 'Automotive Update: real customer experience',
    approvedSummary:
      'Verified LinkedIn Automotive Update edition (2025-07-26). Trust-surface audit framing without shopper-percentage benchmarks.',
    doctrineIds: ['trust-reviews-as-evidence', 'trust-proof-before-promotion'],
    formulaIds: [],
    approvedClaimIds: ['pub-trust-reviews-as-evidence'],
    evidenceStatus: 'qualified',
    version: '1.0.0',
    datePublished: '2025-07-26',
    dateModified: '2026-07-11',
    linkedinUrl:
      'https://www.linkedin.com/pulse/what-real-customer-experience-like-my-dealership-name-brian-kramer-gg1me',
    substackUrl: null,
    lastDriftReview: DRIFT_REVIEW,
  },
  {
    contentId: 'bk-au-margin-compression-2025-001',
    canonicalOwner: 'original-media',
    canonicalUrl: `${SITE}/newsletter#used-vehicle-margin-compression`,
    canonicalTitle: 'Why do used-vehicle departments experience margin compression?',
    seoTitle: 'Automotive Update: used-vehicle margin compression',
    linkedinHook: 'Margin pressure is an operating diagnosis — source mix, appraisal, recon.',
    newsletterSubject: 'Automotive Update: used-vehicle margin compression',
    approvedSummary:
      'Verified LinkedIn Automotive Update edition (2025-05-28). Summary avoids held dollar penalties and universal thresholds.',
    doctrineIds: ['economics-source-effects', 'economics-recon-variance', 'appraisal-look-to-book'],
    formulaIds: ['recon-variance'],
    approvedClaimIds: ['pub-look-to-book-no-universal-range'],
    evidenceStatus: 'qualified',
    version: '1.0.0',
    datePublished: '2025-05-28',
    dateModified: '2026-07-11',
    linkedinUrl:
      'https://www.linkedin.com/pulse/why-do-used-vehicle-departments-experience-margin-most-brian-kramer-voohe',
    substackUrl: null,
    lastDriftReview: DRIFT_REVIEW,
  },

  // —— Podcast collection + public archive entries ——
  {
    contentId: 'bk-podcast-archive-2026-001',
    canonicalOwner: 'briankramer.io',
    canonicalUrl: `${SITE}/podcast`,
    canonicalTitle: 'Podcast conversations. One thread.',
    seoTitle: 'Podcast — Brian Kramer',
    linkedinHook:
      'Podcast conversations on dealer operations, acquisition economics, trust, and what comes after paperless.',
    newsletterSubject: 'Podcast conversations on dealer operations',
    approvedSummary:
      'Selected podcast conversations on dealer operations, acquisition economics, trust, and digital transformation.',
    doctrineIds: [],
    formulaIds: [],
    approvedClaimIds: ['pub-podcast-archive-provisional'],
    evidenceStatus: 'pending',
    version: '1.0.0',
    datePublished: '2026-07-11',
    dateModified: '2026-07-11',
    linkedinUrl: null,
    substackUrl: null,
    lastDriftReview: DRIFT_REVIEW,
  },
  {
    contentId: 'bk-pod-001-automotive-leadership-edge-2025',
    canonicalOwner: 'original-media',
    canonicalUrl: `${SITE}/podcast#automotive-leadership-edge`,
    canonicalTitle: 'Building trust as a dealer operating system',
    seoTitle: 'Building trust as a dealer operating system — podcast',
    linkedinHook: 'Trust compounds into acquisition economics — review velocity, phone, and VDP quality.',
    newsletterSubject: 'Podcast: Building trust as a dealer operating system',
    approvedSummary:
      'Provisional archive entry for The Automotive Leadership Edge. Source URL withheld pending verification.',
    doctrineIds: ['trust-reviews-as-evidence', 'trust-alignment'],
    formulaIds: [],
    approvedClaimIds: ['pub-podcast-archive-provisional'],
    evidenceStatus: 'pending',
    version: '0.1.0',
    datePublished: '2025-11-12',
    dateModified: '2026-07-11',
    linkedinUrl: null,
    substackUrl: null,
    lastDriftReview: DRIFT_REVIEW,
  },
  {
    contentId: 'bk-pod-002-dealer-talk-digital-transformation-2025',
    canonicalOwner: 'original-media',
    canonicalUrl: `${SITE}/podcast#dealer-talk-digital-transformation`,
    canonicalTitle: 'From paperless to AI-native retail',
    seoTitle: 'From paperless to AI-native retail — podcast',
    linkedinHook: 'What an early paperless transaction taught about the path to AI-native retail.',
    newsletterSubject: 'Podcast: From paperless to AI-native retail',
    approvedSummary:
      'Provisional archive entry for Dealer Talk. Source URL withheld pending verification.',
    doctrineIds: ['execution-technology-role'],
    formulaIds: [],
    approvedClaimIds: ['pub-podcast-archive-provisional', 'bio-paperless-first-2020'],
    evidenceStatus: 'pending',
    version: '0.1.0',
    datePublished: '2025-09-03',
    dateModified: '2026-07-11',
    linkedinUrl: null,
    substackUrl: null,
    lastDriftReview: DRIFT_REVIEW,
  },
  {
    contentId: 'bk-pod-003-used-car-weekly-look-to-book-2025',
    canonicalOwner: 'original-media',
    canonicalUrl: `${SITE}/podcast#used-car-weekly-look-to-book`,
    canonicalTitle: 'The Look-to-Book metric many stores still under-measure',
    seoTitle: 'Look-to-Book on Used Car Weekly — podcast',
    linkedinHook: 'Appraisal close rate remains under-measured in used-car acquisition.',
    newsletterSubject: 'Podcast: Look-to-Book still under-measured',
    approvedSummary:
      'Provisional archive entry for Used Car Weekly. Source URL withheld pending verification.',
    doctrineIds: ['appraisal-look-to-book'],
    formulaIds: [],
    approvedClaimIds: ['pub-podcast-archive-provisional', 'pub-look-to-book-definition'],
    evidenceStatus: 'pending',
    version: '0.1.0',
    datePublished: '2025-07-22',
    dateModified: '2026-07-11',
    linkedinUrl: null,
    substackUrl: null,
    lastDriftReview: DRIFT_REVIEW,
  },
  {
    contentId: 'bk-pod-004-fixed-ops-matters-service-drive-2025',
    canonicalOwner: 'original-media',
    canonicalUrl: `${SITE}/podcast#fixed-ops-matters-service-drive`,
    canonicalTitle: 'Service drive sourcing: the channel you already own',
    seoTitle: 'Service drive sourcing — podcast',
    linkedinHook: 'Turning RO volume into acquisition volume with SLAs and accountable handoffs.',
    newsletterSubject: 'Podcast: Service drive sourcing',
    approvedSummary:
      'Provisional archive entry for Fixed Ops Matters. Source URL withheld pending verification.',
    doctrineIds: ['acquisition-consumer-source', 'execution-contract'],
    formulaIds: ['trade-capture', 'missed-trade'],
    approvedClaimIds: ['pub-podcast-archive-provisional', 'pub-service-drive-own-channel'],
    evidenceStatus: 'pending',
    version: '0.1.0',
    datePublished: '2025-05-14',
    dateModified: '2026-07-11',
    linkedinUrl: null,
    substackUrl: null,
    lastDriftReview: DRIFT_REVIEW,
  },
  {
    contentId: 'bk-pod-005-digital-dealer-ai-search-2025',
    canonicalOwner: 'original-media',
    canonicalUrl: `${SITE}/podcast#digital-dealer-ai-search`,
    canonicalTitle: 'AI search visibility for dealers',
    seoTitle: 'AI search visibility for dealers — podcast',
    linkedinHook: 'What AI models say when shoppers ask which dealers to consider locally.',
    newsletterSubject: 'Podcast: AI search visibility for dealers',
    approvedSummary:
      'Provisional archive entry for Digital Dealer Podcast. Source URL withheld pending verification.',
    doctrineIds: ['ai-seo-eligibility', 'ai-measurement-surface'],
    formulaIds: [],
    approvedClaimIds: ['pub-podcast-archive-provisional', 'pub-ai-schema-citation'],
    evidenceStatus: 'pending',
    version: '0.1.0',
    datePublished: '2025-03-08',
    dateModified: '2026-07-11',
    linkedinUrl: null,
    substackUrl: null,
    lastDriftReview: DRIFT_REVIEW,
  },
  {
    contentId: 'bk-pod-006-cars-commerce-dealer-growth-2025',
    canonicalOwner: 'original-media',
    canonicalUrl: `${SITE}/podcast#cars-commerce-dealer-growth`,
    canonicalTitle: 'EVP perspective: dealer growth at scale',
    seoTitle: 'Dealer growth at scale — podcast',
    linkedinHook: 'What changes — and what does not — from single-store GM to platform dealer success.',
    newsletterSubject: 'Podcast: Dealer growth at scale',
    approvedSummary:
      'Provisional archive entry for Cars Commerce Live. Source URL withheld pending verification.',
    doctrineIds: ['execution-learning-loop'],
    formulaIds: [],
    approvedClaimIds: ['pub-podcast-archive-provisional', 'bio-evp-cars-commerce'],
    evidenceStatus: 'pending',
    version: '0.1.0',
    datePublished: '2025-01-17',
    dateModified: '2026-07-11',
    linkedinUrl: null,
    substackUrl: null,
    lastDriftReview: DRIFT_REVIEW,
  },
  {
    contentId: 'bk-pod-007-naples-business-journal-retail-2024',
    canonicalOwner: 'original-media',
    canonicalUrl: `${SITE}/podcast#naples-business-journal-retail`,
    canonicalTitle: 'Retail leadership in Southwest Florida',
    seoTitle: 'Retail leadership in Southwest Florida — podcast',
    linkedinHook: 'Operator habits from high-volume Naples retail years that survived the transition.',
    newsletterSubject: 'Podcast: Retail leadership in Southwest Florida',
    approvedSummary:
      'Provisional archive entry for Southwest Florida Business Radio. Source URL withheld pending verification.',
    doctrineIds: [],
    formulaIds: [],
    approvedClaimIds: ['pub-podcast-archive-provisional', 'bio-germain-volume-7500'],
    evidenceStatus: 'pending',
    version: '0.1.0',
    datePublished: '2024-10-05',
    dateModified: '2026-07-11',
    linkedinUrl: null,
    substackUrl: null,
    lastDriftReview: DRIFT_REVIEW,
  },
  {
    contentId: 'bk-pod-008-automotive-news-40-under-40-2024',
    canonicalOwner: 'original-media',
    canonicalUrl: `${SITE}/podcast#automotive-news-40-under-40`,
    canonicalTitle: 'Automotive News 40 Under 40: what the recognition actually measures',
    seoTitle: 'Automotive News 40 Under 40 — podcast',
    linkedinHook: 'Recognition is a lagging indicator. The habits that earn it are leading.',
    newsletterSubject: 'Podcast: What 40 Under 40 actually measures',
    approvedSummary:
      'Provisional archive entry for Automotive News Podcast. Source URL withheld pending verification.',
    doctrineIds: [],
    formulaIds: [],
    approvedClaimIds: ['pub-podcast-archive-provisional', 'bio-an-40-under-40'],
    evidenceStatus: 'pending',
    version: '0.1.0',
    datePublished: '2024-06-18',
    dateModified: '2026-07-11',
    linkedinUrl: null,
    substackUrl: null,
    lastDriftReview: DRIFT_REVIEW,
  },
];

export function getCanonicalContent(contentId: string): CanonicalContentRecord | undefined {
  return canonicalContent.find((r) => r.contentId === contentId);
}

export function getCanonicalContentByUrl(canonicalUrl: string): CanonicalContentRecord | undefined {
  return canonicalContent.find((r) => r.canonicalUrl === canonicalUrl);
}

/** Lookup by site path (`/writing/slug`) or absolute URL. */
export function getCanonicalContentByPath(pathOrUrl: string): CanonicalContentRecord | undefined {
  if (pathOrUrl.startsWith('http')) {
    return getCanonicalContentByUrl(pathOrUrl);
  }
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return getCanonicalContentByUrl(`${SITE}${path}`);
}

export function listCanonicalContentByEvidenceStatus(
  evidenceStatus: PublicClaimEvidenceStatus,
): CanonicalContentRecord[] {
  return canonicalContent.filter((r) => r.evidenceStatus === evidenceStatus);
}

/** Essay / archive URLs safe for sitemap (public + canonical + evidence-verified). */
export function listSitemapCanonicalRecords(): CanonicalContentRecord[] {
  return canonicalContent.filter((r) => {
    if (r.evidenceStatus !== 'verified' && r.evidenceStatus !== 'qualified') return false;
    // Fragment URLs are not standalone public routes.
    if (r.canonicalUrl.includes('/podcast#')) return false;
    if (r.canonicalUrl.includes('/newsletter#')) return false;
    return true;
  });
}

export const SITE_ORIGIN = SITE;
