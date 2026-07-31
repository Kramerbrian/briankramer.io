import type { PodcastAppearance } from '@/lib/streams/types';

/**
 * Provisional per-episode archive — retired 2026-07-31.
 *
 * The prior version of this file held eight unverified title/date/host/duration
 * entries (`sourceVerified: false`, `sourceUrl: null`) that existed only to backfill
 * /podcast with placeholder content. /podcast now embeds the real, verifiable sources
 * directly — the 57-track Spotify playlist (https://open.spotify.com/playlist/1Ij3H93G7v5eoMGYmm3KkE)
 * and two YouTube episode embeds — so no provisional per-episode claims are needed here.
 *
 * Kept as an empty, typed export (rather than deleted) so future verified appearances
 * can be added without re-threading imports, and so historical governance-queue
 * references to this path (see content/press.ts, content/publishing/public-claim-evidence.ts)
 * still resolve to a real file.
 */
export const podcastAppearances: PodcastAppearance[] = [];

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
