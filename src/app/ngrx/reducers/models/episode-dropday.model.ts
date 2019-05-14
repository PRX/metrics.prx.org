export interface EpisodeDropday {
  id: string;
  guid: string;
  podcastId: string;
  interval: number;
  downloads?: any[][];
  loaded?: boolean;
  loading?: boolean;
  error?: any;
}
