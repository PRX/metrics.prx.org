export interface EpisodeDownloads {
  guid: string;
  podcastId: string;
  page: number;
  downloads?: any[][];
  charted?: boolean;
  loaded?: boolean;
  loading?: boolean;
  error?: any;
}
