import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

/** Detail routes stay unpublished until playbooks are source-verified. */
export const metadata: Metadata = {
  title: 'Playbook',
  robots: { index: false, follow: false },
};

// No slug is publishable yet, so the valid-params set is empty. Paired with
// dynamicParams = false, Next rejects every /playbook/<slug> at the router with
// a real HTTP 404 instead of rendering a page that calls notFound() after the
// static shell is committed — which returned 200 with a not-found body.
export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return [];
}

export default function PlaybookEntryPage() {
  // Unreachable while dynamicParams = false rejects every slug at the router.
  // Retained as defense in depth: if the guard is removed, this still refuses
  // to serve a page rather than rendering empty content under a 200.
  notFound();
}
