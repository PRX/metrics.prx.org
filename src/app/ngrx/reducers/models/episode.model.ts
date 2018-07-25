export const EPISODE_PAGE_SIZE = 10;

export interface Episode {
  guid: string;
  podcastId: string;
  title: string;
  publishedAt: Date;
}
