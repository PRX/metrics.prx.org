export interface EpisodeAllTimeDownloads {
  id: string;
  podcastId: string;
  guid: string;
  allTimeDownloads?: number;
  loaded: boolean;
  loading: boolean;
  error?: any;
}
