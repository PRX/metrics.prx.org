export interface EpisodeDownloads {
  id: string;
  guid: string;
  podcastId: string;
  page: number;
  downloads?: any[][];
  charted?: boolean;
  loaded?: boolean;
  loading?: boolean;
  error?: any;
}
