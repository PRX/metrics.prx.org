export interface EpisodeAllTimeDownloads {
  podcastId: string;
  guid: string;
  allTimeDownloads?: number;
  loaded: boolean;
  loading: boolean;
  error: any;
}
