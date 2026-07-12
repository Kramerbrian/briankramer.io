import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

/** Detail routes stay unpublished until playbooks are source-verified. */
export const metadata: Metadata = {
  title: 'Playbook',
  robots: { index: false, follow: false },
};

export default function PlaybookEntryPage() {
  notFound();
}
