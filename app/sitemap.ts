import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/utils';
import { listSitemapCanonicalRecords } from '@/content/publishing/records';

/** Core public routes without long-form publishing records (or pending archives). */
const CORE_PUBLIC_ROUTES = [
  '',
  '/about',
  '/contact',
  '/writing',
  '/podcast',
  '/playlist',
  '/playbook',
  '/speaking',
  '/newsletter',
  '/changelog',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  const coreRoutes: MetadataRoute.Sitemap = CORE_PUBLIC_ROUTES.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.8,
  }));

  const recordedRoutes: MetadataRoute.Sitemap = listSitemapCanonicalRecords().map((record) => {
    const path = record.canonicalUrl.replace(base, '');
    const isEssay = path.startsWith('/writing/');
    return {
      url: record.canonicalUrl,
      lastModified: new Date(record.dateModified),
      changeFrequency: 'monthly' as const,
      priority: isEssay ? 0.7 : 0.8,
    };
  });

  const seen = new Set<string>();
  const merged: MetadataRoute.Sitemap = [];
  for (const entry of [...coreRoutes, ...recordedRoutes]) {
    if (seen.has(entry.url)) continue;
    seen.add(entry.url);
    merged.push(entry);
  }

  return merged;
}
