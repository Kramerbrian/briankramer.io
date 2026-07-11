export type ContentType = 'essay' | 'video' | 'short' | 'podcast' | 'playbook';
export type SourcePlatform =
  | 'native'
  | 'youtube'
  | 'spotify'
  | 'linkedin'
  | 'substack'
  | 'apple-podcasts'
  | 'other';
export type TopicPillar =
  | 'acquisition'
  | 'appraisal'
  | 'trust'
  | 'digital-transformation'
  | 'ai-search'
  | 'leadership';

export interface Stream {
  id: string;
  slug: string;
  contentType: ContentType;
  title: string;
  summary: string;
  sourcePlatform: SourcePlatform;
  sourceUrl: string | null;
  sourceVerified: boolean;
  topicPillar: TopicPillar | null;
  series: string | null;
  showName: string | null;
  podcastHost: string | null;
  featured: boolean;
  publishDate: string;
  thumbnail: string | null;
  durationMinutes: number | null;
}

export interface Essay extends Stream {
  contentType: 'essay';
  readingMinutes: number;
  body: string;
}

export interface PodcastAppearance extends Stream {
  contentType: 'podcast';
  sourcePlatform: 'spotify' | 'apple-podcasts' | 'youtube' | 'other';
}
