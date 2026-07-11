import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/utils';
import { getEssaySlugs } from '@/content/essays';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/contact',
    '/writing',
    '/podcast',
    '/playbook',
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.8,
  }));

  const essayRoutes: MetadataRoute.Sitemap = getEssaySlugs().map((slug) => ({
    url: `${base}/writing/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...essayRoutes];
}
