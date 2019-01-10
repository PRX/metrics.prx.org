export const EPISODE_PAGE_SIZE = 10;
export const EPISODE_SELECT_PAGE_SIZE = 100;

export interface Episode {
  guid: string;
  podcastId: string;
  title: string;
  publishedAt: Date;
  page: number;
  color?: string;
}
