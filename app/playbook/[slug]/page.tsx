import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Playbook',
  alternates: { canonical: '/playbook' },
};

export default function PlaybookEntryPage() {
  notFound();
}
