export type CanonicalOwner = 'briankramer.io' | 'substack' | 'original-media';
export type FeedbackCategory =
  | 'question'
  | 'objection'
  | 'agreement'
  | 'implementation-request'
  | 'evidence-request'
  | 'correction'
  | 'new-example';

export const PUBLISHING_WORKFLOW_ID = 'BRIAN_KRAMER_PUBLISHING_WORKFLOW_V1' as const;
export const PUBLISHING_WORKFLOW_VERSION = '1.0.0' as const;
export const PUBLISHING_WORKFLOW_CANONIZED_AT = '2026-07-11' as const;

export interface PublishingRecord {
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
  version: string;
  datePublished: string;
  dateModified: string;
  linkedinUrl: string | null;
  substackUrl: string | null;
  lastDriftReview: string;
}

export interface AnonymizedFeedbackRecord {
  feedbackId: string;
  contentId: string;
  platform: 'linkedin' | 'substack' | 'briankramer.io';
  capturedAt: string;
  category: FeedbackCategory;
  anonymizedSummary: string;
  frequency: number;
  strategicValue: 'low' | 'medium' | 'high' | 'very-high';
  evidenceType: 'none' | 'opinion' | 'anecdote' | 'source-request' | 'correction';
  recommendedAction: string;
  status: 'new' | 'reviewing' | 'accepted' | 'declined' | 'resolved';
}

export const publishingRules = [
  'Every long-form item has exactly one immutable content ID and one canonical owner.',
  'briankramer.io owns durable doctrine, formulas, operating models and evergreen essays.',
  'Substack owns newsletter-first commentary.',
  'LinkedIn receives a native adaptation and is not the master copy of long-form content.',
  'An adaptation may change framing but not doctrine, numbers, scope or certainty.',
  'Canonical content is updated before any adaptation.',
  'Comments are anonymized and classified; they never alter doctrine automatically.',
  'Held and retired claims are prohibited in public copy, metadata and structured data.',
  'Internal links do not use UTM parameters.',
  'Distribution links use the immutable content ID as utm_content.',
] as const;

export const utmConvention = {
  campaign: 'automotive_update',
  content: '{contentId}',
  sources: {
    linkedin: { source: 'linkedin', medium: 'organic_social' },
    substack: { source: 'substack', medium: 'email' },
  },
  permittedTerms: ['launch_post', 'comment_followup', 'video_excerpt'],
} as const;
