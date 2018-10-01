export interface EpisodeDownloads {
  podcastId: string;
  guid: string;
  allTimeDownloads?: number;
  loaded: boolean;
  loading: boolean;
  error: any;
}
