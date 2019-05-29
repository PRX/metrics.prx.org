export interface EpisodeDropday {
  id: string;
  guid: string;
  title: string;
  podcastId: string;
  publishedAt: Date;
  interval: number;
  downloads?: any[][];
  loaded?: boolean;
  loading?: boolean;
  error?: any;
}
