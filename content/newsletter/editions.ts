/**
 * Newsletter editions derived only from verified LinkedIn Automotive Update
 * sources in content/doctrine/automotive-update-doctrine.ts.
 *
 * Summaries are original and concise. They must not restate held claims
 * (prevalence %, capture averages, auction penalties, etc.).
 */

export type NewsletterCategory =
  | 'acquisition'
  | 'trust'
  | 'used-car-economics'
  | 'digital-transformation';

export interface NewsletterEdition {
  contentId: string;
  slug: string;
  title: string;
  summary: string;
  category: NewsletterCategory;
  publishDate: string;
  linkedinUrl: string;
  relatedPath: string;
  sourceVerified: true;
}

/**
 * Verified Automotive Update editions (LinkedIn pulse URLs + publish dates
 * from automotiveUpdateSources). Order: newest first.
 */
export const newsletterEditions: NewsletterEdition[] = [
  {
    contentId: 'bk-au-innovation-acceleration-2026-001',
    slug: 'acceleration-of-innovation',
    title:
      'Anyone who doesn’t embrace the acceleration of innovation is going to get run over by it.',
    summary:
      'Operator note on treating digital change as an operating obligation — ownership, cadence, and proof — not a one-time tech purchase.',
    category: 'digital-transformation',
    publishDate: '2026-04-09',
    linkedinUrl:
      'https://www.linkedin.com/pulse/anyone-who-doesnt-embrace-acceleration-innovation-going-brian-kramer-cpjge',
    relatedPath: '/writing/dealer-ai-schema',
    sourceVerified: true,
  },
  {
    contentId: 'bk-au-trade-in-opportunities-2025-001',
    slug: 'where-trade-in-opportunities-go',
    title: 'Where do the other trade-in opportunities go?',
    summary:
      'Why trade-eligible opportunities leave before they are appraised, and why consumer sourcing must run as its own acquisition channel with a visible funnel.',
    category: 'acquisition',
    publishDate: '2025-09-20',
    linkedinUrl:
      'https://www.linkedin.com/pulse/70-car-buyers-have-vehicle-trade-in-average-dealer-only-brian-kramer-lwjle',
    relatedPath: '/writing/service-drive-acquisition',
    sourceVerified: true,
  },
  {
    contentId: 'bk-au-carvana-argument-2025-001',
    slug: 'carvana-winning-the-argument',
    title: 'Carvana Is Winning the Argument. With Your Inventory. With Your Customers.',
    summary:
      'How third-party buyers compete for the same trade-eligible customer — and why stores that cannot see their own acquisition channel lose the argument before the desk does.',
    category: 'acquisition',
    publishDate: '2025-08-08',
    linkedinUrl:
      'https://www.linkedin.com/pulse/carvana-winning-argument-your-inventory-customers-brian-kramer-pygde',
    relatedPath: '/writing/service-drive-acquisition',
    sourceVerified: true,
  },
  {
    contentId: 'bk-au-customer-experience-2025-001',
    slug: 'real-customer-experience',
    title: 'What is the real customer experience like at my dealership?',
    summary:
      'A practical call to audit the store a stranger actually sees — reviews, phone, and digital surface — before spending more on awareness.',
    category: 'trust',
    publishDate: '2025-07-26',
    linkedinUrl:
      'https://www.linkedin.com/pulse/what-real-customer-experience-like-my-dealership-name-brian-kramer-gg1me',
    relatedPath: '/writing/digital-trust-audit',
    sourceVerified: true,
  },
  {
    contentId: 'bk-au-margin-compression-2025-001',
    slug: 'used-vehicle-margin-compression',
    title: 'Why do used-vehicle departments experience margin compression?',
    summary:
      'Margin pressure as an operating diagnosis: source mix, appraisal discipline, and recon variance — measured locally, not assumed from a universal threshold.',
    category: 'used-car-economics',
    publishDate: '2025-05-28',
    linkedinUrl:
      'https://www.linkedin.com/pulse/why-do-used-vehicle-departments-experience-margin-most-brian-kramer-voohe',
    relatedPath: '/writing/look-to-book',
    sourceVerified: true,
  },
];

export function getNewsletterEditions(): NewsletterEdition[] {
  return [...newsletterEditions].sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
  );
}
