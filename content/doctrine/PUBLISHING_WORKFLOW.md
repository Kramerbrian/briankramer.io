# Canonical Publishing Workflow

Status: Canonical  
Version: 1.0.0  
Canonized: 2026-07-11  
Owner: Brian Kramer

## Governing rule

One master argument, one approved evidence state, and platform-specific adaptations. briankramer.io owns durable doctrine, formulas, operating models and evergreen essays. Substack owns newsletter-first commentary. LinkedIn receives a native adaptation and never becomes the master copy of long-form content.

## Ownership matrix

| Content | Canonical owner | LinkedIn use |
| --- | --- | --- |
| Durable doctrine, formulas and operating models | briankramer.io | Native condensed adaptation |
| Evergreen essays supporting site navigation | briankramer.io | Native argument with selected insights |
| Timely newsletter commentary | Substack | Native adaptation linked to Substack |
| Short observation or conversation starter | LinkedIn | LinkedIn-native; no canonical article required |
| Podcast or video appearance | Original media platform | Clip or summary; site archive links to source |

Every long-form item receives one immutable `contentId`, one `canonicalOwner`, one clean `canonicalUrl`, and a semantic `version`.

## Required publishing record

```ts
{
  contentId: 'bk-acquisition-2026-001',
  canonicalOwner: 'briankramer.io',
  canonicalUrl: 'https://www.briankramer.io/writing/example-slug',
  canonicalTitle: '...',
  seoTitle: '...',
  linkedinHook: '...',
  newsletterSubject: '...',
  approvedSummary: '...',
  doctrineIds: [],
  formulaIds: [],
  approvedClaimIds: [],
  version: '1.0.0',
  datePublished: 'YYYY-MM-DD',
  dateModified: 'YYYY-MM-DD',
  linkedinUrl: null,
  substackUrl: null,
  lastDriftReview: 'YYYY-MM-DD'
}
```

## Sequence

1. Assign the content ID and canonical owner.
2. Draft and validate the canonical version against doctrine, formula and claim registries.
3. Publish the canonical page.
4. Verify canonical metadata, structured data and sitemap inclusion.
5. Generate the LinkedIn adaptation from the approved canonical source.
6. Publish the adaptation 24–72 hours later when editorial timing permits.
7. Add its URL to the publishing record.
8. Review public feedback after 48 hours, seven days and 30 days.
9. Route corrections and evidence challenges through governance.
10. Update the canonical source first; regenerate adaptations only when meaning changes.

## Titles and excerpts

Maintain separate `canonicalTitle`, `seoTitle`, `linkedinHook`, and `newsletterSubject` fields. Platform framing may change, but doctrine, scope, numbers and certainty may not.

Maintain one approved 35–60 word summary. Derive metadata descriptions, cards, RSS, archive summaries and adaptation briefs from that summary. LinkedIn adaptations must provide standalone value and must not reproduce most of the canonical article.

## Canonical links

Website-owned articles emit a self-referencing canonical link. Substack-owned articles retain the Substack canonical URL; briankramer.io may publish only metadata, a concise original summary and a source link. LinkedIn points directly to the canonical owner and never to an intermediate redirect page.

## Structured data

Use `Article` or `BlogPosting` for site-owned long-form work. Keep headline, description, author, dates, canonical URL and version consistent with the publishing record. Use `HowTo` only for executable instructions with inputs and a defined outcome. Do not use `Dataset` for anecdotal or unpublished findings. Held claims must not appear in schema or metadata.

## UTM convention

External distribution links use lowercase snake_case:

```text
utm_source=linkedin|substack
utm_medium=organic_social|email
utm_campaign=automotive_update
utm_content={contentId}
utm_term=launch_post|comment_followup|video_excerpt
```

`utm_content` always equals the immutable content ID. Internal briankramer.io links never receive UTMs. The clean canonical URL is stored separately from distribution URLs.

## Updates

- Patch: spelling, formatting or non-substantive clarification.
- Minor: new source, example or section that preserves the conclusion.
- Major: doctrine, formula, conclusion or operating recommendation changes.

Minor and major changes update `dateModified`, version, revision note and drift review. Corrections affecting meaning must be disclosed. Preserve the canonical URL when a title changes.

## Comment-feedback ingestion

Capture themes, not identities. Remove names, employers, locations, contact details, event references and unnecessary personal circumstances.

Allowed categories: question, objection, agreement, implementation-request, evidence-request, correction and new-example.

Each record includes `feedbackId`, `contentId`, platform, capture date, category, anonymized summary, frequency, strategic value, evidence type, recommended action and status. Comments do not alter doctrine automatically. Anecdotes remain anecdotes; evidence challenges route to source validation.

## Drift prevention

Publishing must fail governance review when:

- more than one canonical owner exists;
- two full pages share a content ID;
- an adaptation introduces a number absent from approved claims;
- an adaptation increases certainty;
- held or retired claims appear in publishable content;
- formula IDs or definitions diverge from the formula registry;
- metadata, schema and registry disagree on the canonical URL;
- a substantive update lacks a version or date change;
- an adaptation points to an outdated canonical URL.

Adaptations are generated from the stored canonical source, never from memory or another adaptation.
