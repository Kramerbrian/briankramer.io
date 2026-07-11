import type { CanonicalOwner } from '@/content/doctrine/publishing-workflow';

export interface CanonicalContentRecord {
  contentId: string;
  canonicalOwner: CanonicalOwner;
  canonicalUrl: string;
  canonicalTitle: string;
  approvedSummary: string;
  doctrineIds: string[];
  formulaIds: string[];
  version: string;
  datePublished: string;
  dateModified: string;
  linkedinUrl: string | null;
  substackUrl: string | null;
}

export const canonicalContent: CanonicalContentRecord[] = [
  {
    contentId: 'bk-ai-search-trust-2026-001',
    canonicalOwner: 'briankramer.io',
    canonicalUrl: 'https://www.briankramer.io/writing/ai-search-trust',
    canonicalTitle: "Why AI can't cite your VDP — and what it's costing you",
    approvedSummary: 'A qualified operating essay on structured data, stable vehicle URLs and evidence quality for dealership discovery.',
    doctrineIds: ['ai-seo-eligibility', 'ai-measurement-surface', 'ai-evidence-quality', 'ai-recurring-probes'],
    formulaIds: [],
    version: '1.0.0',
    datePublished: '2026-03-15',
    dateModified: '2026-03-15',
    linkedinUrl: null,
    substackUrl: null,
  },
  {
    contentId: 'bk-service-drive-acquisition-2026-001',
    canonicalOwner: 'briankramer.io',
    canonicalUrl: 'https://www.briankramer.io/writing/service-drive-acquisition',
    canonicalTitle: 'Service drive is a search problem, not a sales problem',
    approvedSummary: 'An operating essay on treating service-drive acquisition as a measurable funnel with accountable handoffs.',
    doctrineIds: ['acquisition-consumer-source', 'acquisition-appraisal-coverage', 'execution-contract'],
    formulaIds: ['appraisal-to-sale', 'trade-capture', 'missed-trade'],
    version: '1.0.0',
    datePublished: '2026-02-28',
    dateModified: '2026-02-28',
    linkedinUrl: null,
    substackUrl: null,
  },
];
