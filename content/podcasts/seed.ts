import type { PodcastAppearance } from '@/lib/streams/types';

/** Provisional archive — entries remain public as titles only until sources are verified. */
export const podcastAppearances: PodcastAppearance[] = [
  {
    id: 'pod-001',
    slug: 'automotive-leadership-edge',
    contentType: 'podcast',
    title: 'Building trust as a dealer operating system',
    summary:
      'How review velocity, phone experience, and VDP quality compound into acquisition economics.',
    sourcePlatform: 'spotify',
    sourceVerified: false,
    sourceUrl: null,
    topicPillar: 'trust',
    series: null,
    showName: 'The Automotive Leadership Edge',
    podcastHost: 'Ryan Gerardi',
    featured: true,
    publishDate: '2025-11-12',
    thumbnail: null,
    durationMinutes: 42,
  },
  {
    id: 'pod-002',
    slug: 'dealer-talk-digital-transformation',
    contentType: 'podcast',
    title: 'From paperless to AI-native retail',
    summary:
      'Lessons from helping lead an early end-to-end paperless transaction — and what comes next for dealers.',
    sourcePlatform: 'apple-podcasts',
    sourceVerified: false,
    sourceUrl: null,
    topicPillar: 'digital-transformation',
    series: null,
    showName: 'Dealer Talk',
    podcastHost: 'Jim Fitzpatrick',
    featured: true,
    publishDate: '2025-09-03',
    thumbnail: null,
    durationMinutes: 38,
  },
  {
    id: 'pod-003',
    slug: 'used-car-weekly-look-to-book',
    contentType: 'podcast',
    title: 'The Look-to-Book metric many stores still under-measure',
    summary:
      'Why appraisal close rate remains an under-measured lever in used-car acquisition.',
    sourcePlatform: 'youtube',
    sourceVerified: false,
    sourceUrl: null,
    topicPillar: 'appraisal',
    series: null,
    showName: 'Used Car Weekly',
    podcastHost: 'Tom Webb',
    featured: false,
    publishDate: '2025-07-22',
    thumbnail: null,
    durationMinutes: 35,
  },
  {
    id: 'pod-004',
    slug: 'fixed-ops-matters-service-drive',
    contentType: 'podcast',
    title: 'Service drive sourcing: the channel you already own',
    summary:
      'Turning RO volume into acquisition volume with SLAs, equity math, and advisor incentives.',
    sourcePlatform: 'spotify',
    sourceVerified: false,
    sourceUrl: null,
    topicPillar: 'acquisition',
    series: null,
    showName: 'Fixed Ops Matters',
    podcastHost: 'Mike Davidson',
    featured: false,
    publishDate: '2025-05-14',
    thumbnail: null,
    durationMinutes: 29,
  },
  {
    id: 'pod-005',
    slug: 'digital-dealer-ai-search',
    contentType: 'podcast',
    title: 'AI search visibility for dealers',
    summary:
      'What ChatGPT, Perplexity, and Gemini say when shoppers ask which dealers to consider locally.',
    sourcePlatform: 'youtube',
    sourceVerified: false,
    sourceUrl: null,
    topicPillar: 'ai-search',
    series: null,
    showName: 'Digital Dealer Podcast',
    podcastHost: 'Digital Dealer Staff',
    featured: true,
    publishDate: '2025-03-08',
    thumbnail: null,
    durationMinutes: 44,
  },
  {
    id: 'pod-006',
    slug: 'cars-commerce-dealer-growth',
    contentType: 'podcast',
    title: 'EVP perspective: dealer growth at scale',
    summary:
      "Moving from single-store GM to platform-level dealer success — what changes and what doesn't.",
    sourcePlatform: 'other',
    sourceVerified: false,
    sourceUrl: null,
    topicPillar: 'leadership',
    series: null,
    showName: 'Cars Commerce Live',
    podcastHost: 'Cars Commerce Team',
    featured: false,
    publishDate: '2025-01-17',
    thumbnail: null,
    durationMinutes: 31,
  },
  {
    id: 'pod-007',
    slug: 'naples-business-journal-retail',
    contentType: 'podcast',
    title: 'Retail leadership in Southwest Florida',
    summary:
      'Building Germain Toyota of Naples during high-volume retail years, and the operator habits that survived the transition.',
    sourcePlatform: 'apple-podcasts',
    sourceVerified: false,
    sourceUrl: null,
    topicPillar: 'leadership',
    series: null,
    showName: 'Southwest Florida Business Radio',
    podcastHost: 'Local Business Journal',
    featured: false,
    publishDate: '2024-10-05',
    thumbnail: null,
    durationMinutes: 26,
  },
  {
    id: 'pod-008',
    slug: 'automotive-news-40-under-40',
    contentType: 'podcast',
    title: 'Automotive News 40 Under 40: what the recognition actually measures',
    summary:
      'Recognition is a lagging indicator. The habits that earn it are leading.',
    sourcePlatform: 'other',
    sourceVerified: false,
    sourceUrl: null,
    topicPillar: 'leadership',
    series: null,
    showName: 'Automotive News Podcast',
    podcastHost: 'Automotive News',
    featured: false,
    publishDate: '2024-06-18',
    thumbnail: null,
    durationMinutes: 22,
  },
];

/** True only when the record is verified and the URL is a non-placeholder absolute http(s) link. */
export function canPublishPodcastListenLink(pod: {
  sourceVerified: boolean;
  sourceUrl: string | null;
}): pod is { sourceVerified: true; sourceUrl: string } {
  if (!pod.sourceVerified || !pod.sourceUrl) return false;
  try {
    const url = new URL(pod.sourceUrl);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
    const path = url.pathname.toLowerCase();
    if (path === '/example' || path === '/example2' || /\/example\d*$/i.test(path)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function getAllPodcasts(): PodcastAppearance[] {
  return [...podcastAppearances].sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
  );
}
